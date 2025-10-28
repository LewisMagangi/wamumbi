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
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
];

export default function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Donations by Category</h2>
      
      {/* Simplified Visual Representation */}
      <div className="flex items-center justify-center mb-6">
        <div className="w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">
              {data.reduce((sum, d) => sum + d.percentage, 0).toFixed(0)}%
            </p>
            <p className="text-sm text-gray-600 mt-1">Total</p>
          </div>
        </div>
      </div>

      {/* Category List */}
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={`${item.category}-${index}`} className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-4 h-4 rounded-full ${COLORS[index % COLORS.length]}`} />
              <span className="text-sm font-medium text-gray-700">{item.category}</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                {formatAmount(item.amount)}
              </p>
              <p className="text-xs text-gray-500">{item.percentage}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
