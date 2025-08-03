import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface MetricCardProps {
  title: string;
  value: number | string;
  change?: number;
  icon: LucideIcon;
  color: string;
  onClick?: () => void;
  subtitle?: string;
}

export default function MetricCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color, 
  onClick,
  subtitle 
}: MetricCardProps) {
  const isClickable = !!onClick;

  return (
    <div 
      className={clsx(
        'card p-6 transition-all duration-200',
        isClickable && 'cursor-pointer hover:shadow-md hover:scale-105'
      )}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={clsx('p-3 rounded-lg', color)}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {change !== undefined && (
          <div className={clsx(
            'text-sm font-medium',
            change >= 0 ? 'text-green-600' : 'text-red-600'
          )}>
            {change >= 0 ? '+' : ''}{change}%
          </div>
        )}
      </div>
    </div>
  );
}