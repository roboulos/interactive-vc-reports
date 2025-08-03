import React from 'react';

interface DataPoint {
  label: string;
  value: number;
  category?: string;
}

interface KPICardProps {
  data_points: DataPoint[];
}

export const KPICard: React.FC<KPICardProps> = ({ data_points }) => {
  if (!data_points || data_points.length === 0) {
    return (
      <div className="kpi-grid-empty">
        <p>No KPI data available</p>
      </div>
    );
  }

  return (
    <div className="kpi-grid">
      {data_points.map((point, index) => (
        <div key={index} className="kpi-card">
          <div className="kpi-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18m-9-9v18" />
            </svg>
          </div>
          <div className="kpi-content">
            <div className="kpi-value">${point.value}M</div>
            <div className="kpi-label">{point.label}</div>
            {point.category && (
              <div className="kpi-category">{point.category}</div>
            )}
          </div>
          <div className="kpi-trend">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
            <span className="kpi-trend-text">+12%</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICard;