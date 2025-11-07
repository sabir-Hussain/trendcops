import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { Resend } from "resend";
import { PrismaClient } from "@/app/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER || "",
      from: process.env.EMAIL_FROM || "noreply@trendcops.com",
      async sendVerificationRequest({ identifier: email, url }) {
        if (resend) {
          try {
            await resend.emails.send({
              from: process.env.EMAIL_FROM || "noreply@trendcops.com",
              to: email,
              subject: "Sign in to TrendCops",
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                  <h1 style="color: #333;">Sign in to TrendCops</h1>
                  <p>Click the link below to sign in to your account:</p>
                  <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
                    Sign in
                  </a>
                  <p style="color: #666; font-size: 14px;">Or copy and paste this URL into your browser:</p>
                  <p style="color: #666; font-size: 12px; word-break: break-all;">${url}</p>
                  <p style="color: #666; font-size: 14px; margin-top: 24px;">This link will expire in 24 hours.</p>
                </div>
              `,
            });
          } catch (error) {
            console.error("Failed to send email:", error);
            throw new Error("Failed to send email");
          }
        } else {
          console.log("Email verification URL:", url);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
    verifyRequest: "/login",
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = (user as any).role;
      }
      return session;
    },
  },
};

