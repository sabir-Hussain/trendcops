import { config } from "dotenv";
import { PrismaClient } from "../app/generated/prisma/client";

config();

const prisma = new PrismaClient();

async function checkTrends() {
  try {
    const count = await prisma.trend.count();
    console.log(`Total trends in database: ${count}`);

    if (count > 0) {
      const sample = await prisma.trend.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
      });

      console.log("\nSample trends:");
      sample.forEach((trend) => {
        console.log(`- ${trend.topic} (${trend.category}, ${trend.growthRate}%)`);
      });

      const categories = await prisma.trend.findMany({
        select: {
          category: true,
        },
        distinct: ["category"],
      });

      console.log(`\nCategories: ${categories.map((c) => c.category).join(", ")}`);

      const regions = await prisma.trend.findMany({
        select: {
          region: true,
        },
        distinct: ["region"],
        where: {
          region: {
            not: null,
          },
        },
      });

      console.log(`\nRegions: ${regions.map((r) => r.region).filter((r) => r !== null).join(", ")}`);
    }
  } catch (error) {
    console.error("Error checking trends:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTrends();

