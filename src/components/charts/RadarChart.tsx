import React from 'react';

interface RadarChartProps {
  data: any[];
}

const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  const metrics = [
    { key: 'gdp_growth', label: 'GDP Growth', max: 10 },
    { key: 'per_capita_income', label: 'Income', max: 70000 },
    { key: 'internet_penetration', label: 'Internet', max: 100 },
    { key: 'ecommerce_adoption', label: 'E-commerce', max: 100 },
    { key: '5g_coverage', label: '5G', max: 100 },
    { key: 'export_volume', label: 'Exports', max: 3000 }
  ];

  const centerX = 200;
  const centerY = 200;
  const radius = 150;

  // Generate colors for each country
  const colors = [
    'rgb(16, 185, 129)',
    'rgb(34, 197, 94)',
    'rgb(20, 184, 166)',
    'rgb(132, 204, 22)',
    'rgb(101, 163, 13)'
  ];

  // Calculate points for each metric
  const getPoint = (index: number, value: number, max: number) => {
    const angle = (index * 2 * Math.PI) / metrics.length - Math.PI / 2;
    const normalizedValue = Math.min(value / max, 1);
    const x = centerX + Math.cos(angle) * radius * normalizedValue;
    const y = centerY + Math.sin(angle) * radius * normalizedValue;
    return { x, y };
  };

  // Calculate axis endpoints
  const getAxisPoint = (index: number) => {
    const angle = (index * 2 * Math.PI) / metrics.length - Math.PI / 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    return { x, y };
  };

  return (
    <div className="flex justify-center">
      <svg width="400" height="400" className="overflow-visible">
        {/* Background circles */}
        {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale, i) => (
          <circle
            key={i}
            cx={centerX}
            cy={centerY}
            r={radius * scale}
            fill="none"
            stroke="rgb(16 185 129 / 0.1)"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines and labels */}
        {metrics.map((metric, index) => {
          const point = getAxisPoint(index);
          const labelPoint = {
            x: centerX + Math.cos((index * 2 * Math.PI) / metrics.length - Math.PI / 2) * (radius + 30),
            y: centerY + Math.sin((index * 2 * Math.PI) / metrics.length - Math.PI / 2) * (radius + 30)
          };
          
          return (
            <g key={metric.key}>
              <line
                x1={centerX}
                y1={centerY}
                x2={point.x}
                y2={point.y}
                stroke="rgb(16 185 129 / 0.2)"
                strokeWidth="1"
              />
              <text
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-emerald-300 text-sm font-medium"
              >
                {metric.label}
              </text>
            </g>
          );
        })}

        {/* Country data polygons */}
        {data.map((country, countryIndex) => {
          const points = metrics.map((metric, metricIndex) => 
            getPoint(metricIndex, country[metric.key], metric.max)
          );
          
          const pathData = points.reduce((acc, point, index) => {
            const command = index === 0 ? 'M' : 'L';
            return `${acc} ${command} ${point.x} ${point.y}`;
          }, '') + ' Z';

          return (
            <g key={country.country}>
              {/* Filled area */}
              <path
                d={pathData}
                fill={colors[countryIndex % colors.length]}
                fillOpacity="0.1"
                stroke={colors[countryIndex % colors.length]}
                strokeWidth="2"
                strokeOpacity="0.8"
              />
              
              {/* Data points */}
              {points.map((point, pointIndex) => (
                <circle
                  key={pointIndex}
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill={colors[countryIndex % colors.length]}
                  stroke="white"
                  strokeWidth="2"
                />
              ))}
            </g>
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="ml-6 space-y-2">
        <h4 className="text-white font-semibold mb-3">Countries</h4>
        {data.map((country, index) => (
          <div key={country.country} className="flex items-center space-x-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-emerald-300 text-sm">{country.country}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadarChart;