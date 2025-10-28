import { mockCampaignStatistics, getCategoryName, getUrgencyLevel, formatAmount } from '@/lib/mockData';
import Image from 'next/image';

interface CampaignCardProps {
  id: number;
  title: string;
  description: string;
  goal_amount: number;
  currency_id: number;
  category_id: number;
  urgency_level_id: number;
  image_url: string;
  end_date: Date;
}

export default function CampaignCard({
  id,
  title,
  description,
  goal_amount,
  currency_id,
  category_id,
  urgency_level_id,
  image_url,
  end_date,
}: CampaignCardProps) {
  const stats = mockCampaignStatistics.find(s => s.campaign_id === id);
  const urgency = getUrgencyLevel(urgency_level_id);
  const category = getCategoryName(category_id);
  
  const daysLeft = Math.ceil((end_date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Campaign Image */}
      <div className="relative h-48 bg-gray-200">
        {image_url ? (
          <Image src={image_url} alt={title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        {urgency && (
          <div 
            className="absolute top-2 right-2 px-3 py-1 rounded-full text-white text-xs font-semibold"
            style={{ backgroundColor: urgency.color_code } as React.CSSProperties}
          >
            {urgency.name}
          </div>
        )}
      </div>

      {/* Campaign Content */}
      <div className="p-6">
        {/* Category Badge */}
        <div className="mb-2">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
            {category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {description}
        </p>

        {/* Progress Bar */}
        {stats && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">
                {formatAmount(stats.current_amount, currency_id)} raised
              </span>
              <span className="text-gray-900 font-semibold">
                {stats.completion_percentage.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(stats.completion_percentage, 100)}%` } as React.CSSProperties}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Goal: {formatAmount(goal_amount, currency_id)}</span>
              <span>{stats.donations_count} donations</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            {daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}
          </span>
          <button 
            type="button"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors"
          >
            Donate Now
          </button>
        </div>
      </div>
    </div>
  );
}
