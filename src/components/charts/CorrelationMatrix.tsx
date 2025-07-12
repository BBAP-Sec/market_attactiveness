import React from 'react';

interface CorrelationMatrixProps {
  data: any[];
}

const CorrelationMatrix: React.FC<CorrelationMatrixProps> = ({ data }) => {
  const numericFields = [
    'gdp_growth',
    'per_capita_income',
    'inflation_rate',
    'internet_penetration',
    'ecommerce_adoption',
    '5g_coverage'
  ];

  // Calculate correlation matrix
  const correlationMatrix = numericFields.map(field1 => 
    numericFields.map(field2 => {
      if (field1 === field2) return 1;
      
      const values1 = data.map(d => d[field1]);
      const values2 = data.map(d => d[field2]);
      
      // Simple correlation calculation
      const mean1 = values1.reduce((a, b) => a + b, 0) / values1.length;
      const mean2 = values2.reduce((a, b) => a + b, 0) / values2.length;
      
      const numerator = values1.reduce((sum, val1, i) => 
        sum + (val1 - mean1) * (values2[i] - mean2), 0);
      
      const denominator = Math.sqrt(
        values1.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0) *
        values2.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0)
      );
      
      return denominator ? numerator / denominator : 0;
    })
  );

  const cellSize = 40;

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        <svg width={numericFields.length * cellSize + 150} height={numericFields.length * cellSize + 100}>
          {/* Draw matrix */}
          {correlationMatrix.map((row, i) =>
            row.map((correlation, j) => {
              const intensity = Math.abs(correlation);
              const hue = correlation > 0 ? 120 : 0; // Green for positive, red for negative
              
              return (
                <g key={`${i}-${j}`}>
                  <rect
                    x={j * cellSize + 100}
                    y={i * cellSize + 50}
                    width={cellSize}
                    height={cellSize}
                    fill={`hsla(${hue}, 70%, 50%, ${intensity * 0.7})`}
                    stroke="rgb(16 185 129 / 0.3)"
                    strokeWidth="1"
                  />
                  <text
                    x={j * cellSize + 100 + cellSize / 2}
                    y={i * cellSize + 50 + cellSize / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-white text-xs font-medium"
                  >
                    {correlation.toFixed(2)}
                  </text>
                </g>
              );
            })
          )}
          
          {/* Row labels */}
          {numericFields.map((field, i) => (
            <text
              key={`row-${i}`}
              x="90"
              y={i * cellSize + 50 + cellSize / 2}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-emerald-300 text-xs font-medium"
            >
              {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </text>
          ))}
          
          {/* Column labels */}
          {numericFields.map((field, i) => (
            <text
              key={`col-${i}`}
              x={i * cellSize + 100 + cellSize / 2}
              y="40"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-emerald-300 text-xs font-medium"
              transform={`rotate(-45, ${i * cellSize + 100 + cellSize / 2}, 40)`}
            >
              {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </text>
          ))}
        </svg>
        
        {/* Legend */}
        <div className="mt-4 flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-emerald-300 text-sm">Negative Correlation</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-500 rounded"></div>
            <span className="text-emerald-300 text-sm">No Correlation</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-emerald-300 text-sm">Positive Correlation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorrelationMatrix;