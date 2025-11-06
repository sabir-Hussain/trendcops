import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your dashboard. Here's an overview of your activity.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-medium text-muted-foreground">
                Total Users
              </p>
              <p className="text-2xl font-bold">1,234</p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-medium text-muted-foreground">
                Active Sessions
              </p>
              <p className="text-2xl font-bold">567</p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-medium text-muted-foreground">
                Revenue
              </p>
              <p className="text-2xl font-bold">$12,345</p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-medium text-muted-foreground">
                Growth
              </p>
              <p className="text-2xl font-bold">+12.5%</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
