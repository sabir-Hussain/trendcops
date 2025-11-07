import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { TrendsTable } from "@/components/dashboard/trends-table";
import { TrendFilters } from "@/components/dashboard/trend-filters";
import { prisma } from "@/lib/prisma";

interface TrendingTopicsPageProps {
  searchParams: Promise<{
    category?: string;
    region?: string;
  }>;
}

async function getTrends(category?: string, region?: string) {
  try {
    const where: {
      category?: string;
      region?: string;
    } = {};

    if (category && category !== "all") {
      where.category = category;
    }

    if (region && region !== "all") {
      where.region = region;
    }

    const trends = await prisma.trend.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });

    console.log(`getTrends: Found ${trends.length} trends with filters:`, { category, region });
    
    // Serialize dates to strings for client component
    return trends.map((trend) => ({
      ...trend,
      createdAt: trend.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching trends:", error);
    throw error;
  }
}

async function getCategories() {
  const categories = await prisma.trend.findMany({
    select: {
      category: true,
    },
    distinct: ["category"],
  });

  return categories.map((c) => c.category);
}

async function getRegions() {
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

  return regions
    .map((r) => r.region)
    .filter((r): r is string => r !== null);
}

export default async function TrendingTopicsPage({ searchParams }: TrendingTopicsPageProps) {
  try {
    const { category, region } = await searchParams;
    const [trends, categories, regions] = await Promise.all([
      getTrends(category, region),
      getCategories(),
      getRegions(),
    ]);

    console.log("Dashboard data:", {
      trendsCount: trends.length,
      categoriesCount: categories.length,
      regionsCount: regions.length,
      firstTrend: trends[0]?.topic,
    });

    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Trending Topics</h1>
            <p className="text-muted-foreground">
              Monitor and analyze trending topics across different categories and regions.
            </p>
            {process.env.NODE_ENV === "development" && (
              <p className="text-xs text-muted-foreground mt-2">
                Debug: {trends.length} trends loaded | {categories.length} categories | {regions.length} regions
              </p>
            )}
          </div>

          <TrendFilters
            categories={categories}
            regions={regions}
            selectedCategory={category}
            selectedRegion={region}
          />

          <TrendsTable trends={trends} />
        </div>
      </DashboardLayout>
    );
  } catch (error) {
    console.error("Dashboard error:", error);
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Trending Topics</h1>
            <p className="text-muted-foreground">
              Monitor and analyze trending topics across different categories and regions.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-destructive">
              Error loading trends. Please check the console for details.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
}

