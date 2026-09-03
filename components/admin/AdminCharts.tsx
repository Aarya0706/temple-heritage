"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TopTemple, RegionCount, SignupDay } from "@/lib/admin-stats";

// Shared palette pulled from the rest of the admin page (see the stats
// cards and status pills in app/admin/page.tsx) so the charts don't look
// like a bolted-on library default theme.
const INK = "#542019";
const MUTED = "#9b6958";
const BORDER = "#f0ddc8";
const BAR = "#c97a3d";
const LINE = "#8c2416";

const tooltipStyle = {
  background: "white",
  border: `1px solid ${BORDER}`,
  borderRadius: 10,
  fontSize: 13,
  color: INK,
};

function ChartCard({ title, empty, children }: { title: string; empty: boolean; children: React.ReactNode }) {
  return (
    <div
      style={{
        border: `1px solid ${BORDER}`,
        borderRadius: 14,
        padding: "18px 20px",
        background: "white",
      }}
    >
      <div style={{ color: INK, fontWeight: 700, fontSize: 14, marginBottom: 14 }}>{title}</div>
      {empty ? (
        <div style={{ color: MUTED, fontSize: 13, padding: "24px 0", textAlign: "center" }}>
          Not enough data yet.
        </div>
      ) : (
        children
      )}
    </div>
  );
}

export function TopTemplesChart({ data }: { data: TopTemple[] }) {
  // Longest bar on top reads more naturally than the reverse, so the
  // list is reversed before handing it to recharts (which draws
  // categories bottom-to-top by default for a horizontal bar chart).
  const chartData = [...data].reverse();

  return (
    <ChartCard title="Most-viewed temples" empty={data.length === 0}>
      <ResponsiveContainer width="100%" height={Math.max(160, chartData.length * 34)}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
          <CartesianGrid horizontal={false} stroke={BORDER} />
          <XAxis type="number" allowDecimals={false} tick={{ fill: MUTED, fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="name"
            width={140}
            tick={{ fill: INK, fontSize: 12 }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => [`${value} views`, ""]}
            labelFormatter={() => ""}
          />
          <Bar dataKey="views" fill={BAR} radius={[0, 6, 6, 0]} barSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function PlannerRegionsChart({ data }: { data: RegionCount[] }) {
  return (
    <ChartCard title="Most-used planner regions" empty={data.length === 0}>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
          <CartesianGrid vertical={false} stroke={BORDER} />
          <XAxis
            dataKey="region"
            tick={{ fill: INK, fontSize: 11 }}
            tickLine={false}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={50}
          />
          <YAxis allowDecimals={false} tick={{ fill: MUTED, fontSize: 12 }} width={30} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => [`${value} plans`, ""]}
            labelFormatter={(label) => label}
          />
          <Bar dataKey="count" fill={BAR} radius={[6, 6, 0, 0]} barSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function SignupGrowthChart({ data }: { data: SignupDay[] }) {
  const hasAnySignups = data.some((d) => d.cumulative > 0);
  const chartData = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
  }));

  return (
    <ChartCard title={`Signup growth (last ${data.length} days)`} empty={!hasAnySignups}>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData} margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
          <CartesianGrid vertical={false} stroke={BORDER} />
          <XAxis
            dataKey="label"
            tick={{ fill: MUTED, fontSize: 11 }}
            tickLine={false}
            interval={Math.ceil(chartData.length / 8) - 1}
          />
          <YAxis allowDecimals={false} tick={{ fill: MUTED, fontSize: 12 }} width={30} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value, name) => [value, name === "cumulative" ? "Total users" : "New signups"]}
          />
          <Line type="monotone" dataKey="cumulative" stroke={LINE} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="signups" stroke={BAR} strokeWidth={1.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
