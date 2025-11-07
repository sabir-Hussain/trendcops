"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/select";

interface TrendFiltersProps {
  categories: string[];
  regions: string[];
  selectedCategory?: string;
  selectedRegion?: string;
}

export function TrendFilters({
  categories,
  regions,
  selectedCategory,
  selectedRegion,
}: TrendFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleCategoryChange(category: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`/trending-topics?${params.toString()}`);
  }

  function handleRegionChange(region: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (region === "all") {
      params.delete("region");
    } else {
      params.set("region", region);
    }
    router.push(`/trending-topics?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-4 rounded-lg border bg-card p-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="category-filter" className="text-sm font-medium">
          Category
        </label>
        <Select
          id="category-filter"
          value={selectedCategory || "all"}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="region-filter" className="text-sm font-medium">
          Region
        </label>
        <Select
          id="region-filter"
          value={selectedRegion || "all"}
          onChange={(e) => handleRegionChange(e.target.value)}
        >
          <option value="all">All Regions</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}

