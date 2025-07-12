import React from 'react';

interface ConfidenceChartProps {
  data: Array<{
    country: string;
    score: number;
    confidence: number;
  }>;
}

const ConfidenceChart: React.FC<ConfidenceChartProps> = ({ data }) => {
  const maxScore = Math.max(...data.map(item => item.score));
  const maxConfidence = Math.max(...data.map(item => item.confidence));

  return (
    <div className="h-64 relative">
      <svg className="w-full h-full" viewBox="0 0 400 200">
        {/* Grid lines */}
        {[...Array(5)].map((_, i) => (
          <g key={i}>
            <line
              x1="50"
              y1={40 + (i * 32)}
              x2="350"
              y2={40 + (i * 32)}
              stroke="rgb(16 185 129 / 0.1)"
              strokeWidth="1"
            />
            <line
              x1={50 + (i * 60)}
              y1="40"
              x2={50 + (i * 60)}
              y2="168"
              stroke="rgb(16 185 129 / 0.1)"
              strokeWidth="1"
            />
          </g>
        ))}
        
        {/* Data points */}
        {data.map((country, index) => {
          const x = 50 + (country.score / maxScore) * 300;
          const y = 168 - (country.confidence / maxConfidence) * 128;
          const size = 4 + (country.score / maxScore) * 8;
          
          return (
            <g key={country.country}>
              {/* Glow effect */}
              <circle
                cx={x}
                cy={y}
                r={size + 2}
                fill="url(#glowGradient)"
                opacity="0.6"
              />
              {/* Main point */}
              <circle
                cx={x}
                cy={y}
                r={size}
                fill="rgb(16 185 129)"
                className="animate-pulse"
              />
              {/* Country label */}
              <text
                x={x}
                y={y - size - 4}
                textAnchor="middle"
                className="fill-emerald-300 text-xs font-medium"
              >
                {country.country}
              </text>
            </g>
          );
        })}
        
        {/* Gradient definitions */}
        <defs>
          <radialGradient id="glowGradient">
            <stop offset="0%" stopColor="rgb(16 185 129)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="rgb(16 185 129)" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
      
      {/* Axis labels */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-emerald-400 text-sm">
        Market Attractiveness Score
      </div>
      <div className="absolute top-1/2 left-2 transform -translate-y-1/2 -rotate-90 text-emerald-400 text-sm">
        Prediction Confidence
      </div>
    </div>
  );
};

export default ConfidenceChart;