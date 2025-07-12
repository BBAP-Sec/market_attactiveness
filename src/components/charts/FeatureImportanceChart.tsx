import React from 'react';

interface FeatureImportanceChartProps {
  data: Array<{
    feature: string;
    importance: number;
  }>;
}

const FeatureImportanceChart: React.FC<FeatureImportanceChartProps> = ({ data }) => {
  const maxImportance = Math.max(...data.map(item => item.importance));

  return (
    <div className="space-y-3">
      {data.slice(0, 10).map((item, index) => {
        const percentage = (item.importance / maxImportance) * 100;
        const displayName = item.feature
          .replace(/_/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());

        return (
          <div key={item.feature} className="group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <span className="text-emerald-400 text-sm font-medium w-6">#{index + 1}</span>
                <span className="text-white font-medium">{displayName}</span>
              </div>
              <span className="text-emerald-300 font-semibold">
                {(item.importance * 100).toFixed(1)}%
              </span>
            </div>
            
            <div className="relative">
              <div className="w-full h-4 bg-slate-800/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000 ease-out group-hover:from-emerald-500 group-hover:to-emerald-300"
                  style={{ width: `${percentage}%` }}
                >
                  <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FeatureImportanceChart;