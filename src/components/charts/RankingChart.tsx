import React from 'react';

interface RankingChartProps {
  data: Array<{
    country: string;
    score: number;
    confidence: number;
  }>;
}

const RankingChart: React.FC<RankingChartProps> = ({ data }) => {
  const maxScore = Math.max(...data.map(item => item.score));

  return (
    <div className="space-y-4">
      {data.map((country, index) => (
        <div key={country.country} className="group">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <span className="text-emerald-400 text-sm font-medium w-8">#{index + 1}</span>
              <span className="text-white font-medium">{country.country}</span>
            </div>
            <span className="text-emerald-300 font-semibold">{country.score.toFixed(1)}</span>
          </div>
          
          <div className="relative">
            {/* Background bar */}
            <div className="w-full h-3 bg-slate-800/50 rounded-full overflow-hidden">
              {/* Progress bar with gradient */}
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out group-hover:from-emerald-400 group-hover:to-emerald-300"
                style={{ width: `${(country.score / maxScore) * 100}%` }}
              >
                {/* Shimmer effect */}
                <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              </div>
            </div>
            
            {/* Confidence indicator */}
            <div className="absolute right-0 top-4 flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 h-1 rounded-full ${
                    i < country.confidence * 5 ? 'bg-emerald-400' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RankingChart;