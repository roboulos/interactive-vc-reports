import React from 'react';

interface DataPoint {
  label: string;
  value: number;
  category?: string;
}

interface BarChartProps {
  data_points: DataPoint[];
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({ data_points, height = 300 }) => {
  if (!data_points || data_points.length === 0) {
    return (
      <div className="bar-chart-empty" style={{ height }}>
        <p>No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data_points.map(d => d.value || 0));
  
  return (
    <div className="bar-chart" style={{ height }}>
      <div className="bar-chart-container">
        {data_points.map((point, index) => {
          const barHeight = maxValue > 0 ? (point.value / maxValue) * 100 : 0;
          
          return (
            <div key={index} className="bar-item">
              <div className="bar-wrapper">
                <div 
                  className="bar"
                  style={{
                    height: `${barHeight}%`,
                    background: `linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)`,
                    transition: 'height 0.5s ease-out',
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <span className="bar-value">${point.value}M</span>
                </div>
              </div>
              <span className="bar-label">{point.label}</span>
              {point.category && (
                <span className="bar-category">{point.category}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BarChart;