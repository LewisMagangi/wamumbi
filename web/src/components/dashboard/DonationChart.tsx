import { formatAmount } from '@/lib/mockData';

interface ChartData {
  month: string;
  amount: number;
}

interface DonationChartProps {
  data: ChartData[];
}

export default function DonationChart({ data }: DonationChartProps) {
  const maxAmount = Math.max(...data.map(d => d.amount));
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Donation Trends</h2>
      
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = (item.amount / maxAmount) * 100;
          return (
            <div key={`${item.month}-${index}`} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">{item.month}</span>
                <span className="font-semibold text-gray-900">
                  {formatAmount(item.amount)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` } as React.CSSProperties}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Total (Last 5 Months)</span>
          <span className="text-lg font-bold text-gray-900">
            {formatAmount(data.reduce((sum, item) => sum + item.amount, 0))}
          </span>
        </div>
      </div>
    </div>
  );
}
