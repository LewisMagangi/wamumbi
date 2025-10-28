import { useQuery } from "@tanstack/react-query";
import { EditPermissionGate } from "../auth/PermissionGate";
import { usePermissions } from "../../hooks/usePermissions";

/**
 * DonationSummary component
 *
 * - Named export (matches your Dashboard import).
 * - Optional `endpoint` prop: if provided, it will fetch from that endpoint.
 * - If no real endpoint exists yet, the queryFn returns mocked development data.
 */

type Category = {
  name: string;
  percentage: number; // 0-100
  color?: string;
};

type MonthlyPoint = {
  month: string;
  amount: number;
};

type DonationSummaryResponse = {
  total: number;
  target: number;
  categories: Category[];
  monthly: MonthlyPoint[];
  // future: add statusBreakdown, recurring breakdown, etc.
};

type Props = {
  endpoint?: string; // e.g. "/api/dashboard/donation-summary"
};

export const DonationSummary: React.FC<Props> = ({ endpoint = "/api/dashboard/donation-summary" }) => {
  const { canEdit } = usePermissions();

  // Query key includes endpoint so you can switch to different filtered summaries easily.
  const { data: donationData, isLoading } = useQuery<DonationSummaryResponse>({
    queryKey: ["donation-summary", endpoint],
    queryFn: async () => {
      // If you have a real API, replace the mocked response by fetching:
      // const res = await fetch(endpoint);
      // if (!res.ok) throw new Error("Failed to fetch donation summary");
      // return res.json();

      // Mocked data for local dev — mirror the shape your backend should return
      return {
        total: 245_680,
        target: 500_000,
        categories: [
          { name: "Water Projects", percentage: 35, color: "#3B82F6" },
          { name: "Education", percentage: 25, color: "#10B981" },
          { name: "Hunger Relief", percentage: 20, color: "#EF4444" },
          { name: "Healthcare", percentage: 15, color: "#8B5CF6" },
          { name: "Other", percentage: 5, color: "#F59E0B" },
        ],
        monthly: [
          { month: "Jan", amount: 18_500 },
          { month: "Feb", amount: 21_200 },
          { month: "Mar", amount: 19_800 },
          { month: "Apr", amount: 22_900 },
          { month: "May", amount: 24_850 },
          { month: "Jun", amount: 23_600 },
        ],
      };
    },
    // If you want to skip server calls during storybook/dev, toggle enabled.
    enabled: true,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="card h-full p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4 w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="h-4 bg-gray-200 rounded mb-3 w-full" />
            <div className="h-3 bg-gray-200 rounded-full mb-4 w-full" />
            <div className="h-4 bg-gray-200 rounded mb-6 w-2/3" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-200 mr-2" />
                  <div className="h-3 bg-gray-200 rounded flex-1" />
                </div>
              ))}
            </div>
          </div>
          <div className="h-64 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (!donationData) return null;

  const percentage = Math.round((donationData.total / Math.max(donationData.target, 1)) * 100);

  // Helper: currency formatting (forward-thinking for i18n later)
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

  // CSV export of the summary (simple client-side)
  const exportCsv = () => {
    const headers = ["metric", "value"];
    const rows: string[][] = [
      ["total", donationData.total.toString()],
      ["target", donationData.target.toString()],
      ["percent_of_target", percentage.toString()],
      // categories flattened
      ...donationData.categories.map((c) => [`category:${c.name}`, c.percentage.toString()]),
      // monthly data
      ...donationData.monthly.map((m) => [`monthly:${m.month}`, m.amount.toString()]),
    ];

    const csv = [headers.join(","), ...rows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `donation-summary-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // Render a simple donut chart with SVG (no external lib) — accessible, responsive.
  const Donut: React.FC<{ items: Category[]; size?: number; innerRadius?: number }> = ({ items, size = 160, innerRadius = 50 }) => {
    const totalPercent = items.reduce((s, i) => s + i.percentage, 0) || 100;
    const normalized = items.map((i) => ({ ...i, percent: (i.percentage / totalPercent) * 100 }));
    const radius = size / 2;
    const circumference = 2 * Math.PI * radius;

    // Build arcs using strokeDasharray technique on a circle
    let strokeOffset = 0;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Donation distribution by category">
        <g transform={`translate(${radius},${radius})`} >
          {normalized.map((slice, idx) => {
            const dash = (slice.percent / 100) * circumference;
            const strokeDasharray = `${dash} ${circumference - dash}`;
            const rotation = (strokeOffset / circumference) * 360;
            strokeOffset += dash;
            return (
              <circle
                key={idx}
                r={radius - 10}
                fill="transparent"
                stroke={slice.color || "#CBD5E1"}
                strokeWidth={20}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={0}
                transform={`rotate(-90) rotate(${rotation})`}
                style={{ transition: "stroke-dasharray 300ms ease, stroke 300ms ease" }}
              />
            );
          })}
          {/* center label */}
          <circle r={innerRadius} fill="white" />
          <text textAnchor="middle" dy="-6" className="font-semibold" style={{ fontSize: 14 }}>
            {percentage}%
          </text>
          <text textAnchor="middle" dy="14" className="text-xs text-gray-500" style={{ fontSize: 12 }}>
            of goal
          </text>
        </g>
      </svg>
    );
  };

  // Bar chart for monthly values (simple SVG)
  const MonthlyBars: React.FC<{ points: MonthlyPoint[]; height?: number }> = ({ points, height = 140 }) => {
    const max = Math.max(...points.map((p) => p.amount), 1);
    return (
      <div className="w-full h-full flex items-end">
        {points.map((p, idx) => {
          const pct = (p.amount / max) * 100;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div
                className="w-3/4 rounded-t-sm relative"
                style={{ height: `${pct}%`, maxHeight: height, background: "linear-gradient(180deg,#DBEAFE, #3B82F6)" }}
                title={`${p.month}: ${formatCurrency(p.amount)}`}
                aria-label={`${p.month} ${p.amount}`}
              />
              <span className="text-xs text-gray-600 mt-2">{p.month}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="card h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Donation Summary</h2>

        <div className="flex items-center space-x-3">
          <button
            onClick={exportCsv}
            className="text-sm px-3 py-1 border rounded-md text-gray-700 hover:bg-gray-50"
            aria-label="Export donation summary as CSV"
          >
            <i className="ri-download-line mr-2" aria-hidden /> Export CSV
          </button>

          <EditPermissionGate
            resource="donations"
            fallback={
              <span className="text-xs text-gray-500 flex items-center">
                <i className="ri-information-line mr-1" /> View-only mode
              </span>
            }
          >
            <button
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              aria-label="Edit donation goals"
              disabled={!canEdit}
            >
              <i className="ri-edit-line mr-1" />
              Edit Goals
            </button>
          </EditPermissionGate>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: totals + categories */}
        <div>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <h3 className="font-medium">Total Fundraising</h3>
              <span className="text-sm font-medium">{percentage}% of target</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 mb-2"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Number.isFinite(percentage) ? percentage : 0}
                aria-label={`Donation progress: ${percentage}% of goal`}
            >
                <div
                    className="h-3 rounded-full bg-blue-600"
                    style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
                />
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <span>{formatCurrency(donationData.total)} raised</span>
              <span>Goal: {formatCurrency(donationData.target)}</span>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Donation Distribution</h3>
            <div className="space-y-3">
              {donationData.categories.map((category, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: category.color || "#CBD5E1" }} />
                  <span className="text-sm flex-1">{category.name}</span>
                  <span className="text-sm font-medium">{category.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: visualizations */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-full flex items-center justify-center">
            <Donut items={donationData.categories} />
          </div>

          <div className="w-full">
            <h3 className="font-medium mb-3">Monthly Donations</h3>
            <div className="h-40">
              <MonthlyBars points={donationData.monthly} height={140} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
