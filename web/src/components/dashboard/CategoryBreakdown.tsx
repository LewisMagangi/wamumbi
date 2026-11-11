import { formatAmount } from '@/lib/mockData';

interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
}

interface CategoryBreakdownProps {
  data: CategoryData[];
}

const COLORS = [
  'bg-info',
  'bg-primary',
  'bg-warning',
  'bg-chart-4',
];

export default function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  return (
    <div className="bg-card rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-foreground mb-6">Donations by Category</h2>
      
      {/* Simplified Visual Representation */}
      <div className="flex items-center justify-center mb-6">
        <div className="w-48 h-48 bg-muted rounded-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">
              {data.reduce((sum, d) => sum + d.percentage, 0).toFixed(0)}%
            </p>
            <p className="text-sm text-muted-foreground mt-1">Total</p>
          </div>
        </div>
      </div>

      {/* Category List */}
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={`${item.category}-${index}`} className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-4 h-4 rounded-full ${COLORS[index % COLORS.length]}`} />
              <span className="text-sm font-medium text-foreground/80">{item.category}</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">
                {formatAmount(item.amount)}
              </p>
              <p className="text-xs text-muted-foreground">{item.percentage}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
