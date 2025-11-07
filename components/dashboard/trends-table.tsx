"use client";

import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sparkline } from "./sparkline";

interface Trend {
  id: string;
  topic: string;
  category: string;
  region: string | null;
  growthRate: number;
  source: string;
  createdAt: string | Date;
}

interface TrendsTableProps {
  trends: Trend[];
}

function generateSparklineData(growthRate: number): number[] {
  const baseValue = 50;
  const data: number[] = [];
  const points = 12;

  for (let i = 0; i < points; i++) {
    const variation = (Math.random() - 0.5) * 20;
    const trend = (growthRate / points) * (i + 1);
    data.push(Math.max(0, baseValue + trend + variation));
  }

  return data;
}

function formatGrowthRate(rate: number): string {
  const sign = rate >= 0 ? "+" : "";
  return `${sign}${rate.toFixed(2)}%`;
}

function getGrowthColor(rate: number): string {
  if (rate > 0) {
    return "hsl(142, 76%, 36%)";
  }
  if (rate < 0) {
    return "hsl(0, 84%, 60%)";
  }
  return "hsl(var(--muted-foreground))";
}

export function TrendsTable({ trends }: TrendsTableProps) {
  useEffect(() => {
    console.log("TrendsTable received trends:", trends.length, trends.slice(0, 2));
  }, [trends]);

  if (trends.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">No trends found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Topic</TableHead>
            <TableHead>Growth Rate</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Source</TableHead>
            <TableHead className="w-[120px]">Trend</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trends.map((trend) => {
            const sparklineData = generateSparklineData(trend.growthRate);
            const growthColor = getGrowthColor(trend.growthRate);

            return (
              <TableRow key={trend.id}>
                <TableCell className="font-medium">{trend.topic}</TableCell>
                <TableCell>
                  <span style={{ color: growthColor }} className="font-semibold">
                    {formatGrowthRate(trend.growthRate)}
                  </span>
                </TableCell>
                <TableCell>{trend.category}</TableCell>
                <TableCell>{trend.source}</TableCell>
                <TableCell>
                  <Sparkline data={sparklineData} color={growthColor} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

