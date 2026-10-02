import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down';
  trendValue?: string;
  color?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
}: StatCardProps) {
  return (
    <Card className="rounded-2xl border border-[#dce8f3] bg-white p-5 shadow-[0_8px_24px_rgba(37,113,197,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(37,113,197,0.11)]">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#18324b]/60">{title}</span>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e3f1ff] text-[#2571c5]">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-3">
        <div className="text-2xl font-bold tracking-tight text-[#18324b]">
          {value}
        </div>

        {(description || trendValue) && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
            {description && (
              <span className="text-[#18324b]/45">{description}</span>
            )}
            {trendValue && (
              <span
                className={`flex items-center font-medium ${
                  trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {trend === 'up' ? '↑' : '↓'} {trendValue}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}