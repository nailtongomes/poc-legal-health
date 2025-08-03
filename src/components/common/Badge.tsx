import { clsx } from 'clsx';
import { Tag } from '../../types';

interface BadgeProps {
  tag: Tag;
  size?: 'sm' | 'md' | 'lg';
  showConfidence?: boolean;
  className?: string;
}

export default function Badge({ tag, size = 'md', showConfidence = false, className }: BadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1',
  };

  return (
    <div className={clsx('inline-flex items-center rounded-full font-medium', tag.cor, sizeClasses[size], className)}>
      <span>{tag.valor}</span>
      {showConfidence && (
        <span className="ml-1 text-xs opacity-75">
          ({tag.confianca}%)
        </span>
      )}
    </div>
  );
}