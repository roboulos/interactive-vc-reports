import React from 'react';

interface KPIMetric {
  label: string;
  value: string | number;
  trend?: string;
  change?: string;
}

interface KPITemplateProps {
  title: string;
  metrics: KPIMetric[];
  period?: string;
}

export const KPITemplate: React.FC<KPITemplateProps> = ({ title, metrics, period }) => {
  return (
    <div className="kpi-template">
      <div className="template-header">
        <h3 className="template-title">{title}</h3>
        {period && <span className="template-period">{period}</span>}
      </div>
      
      <div className="kpi-metrics-grid">
        {metrics.map((metric, index) => (
          <div key={index} className="kpi-metric-card">
            <div className="metric-value">{metric.value}</div>
            <div className="metric-label">{metric.label}</div>
            {metric.trend && (
              <div className={`metric-trend ${metric.trend === 'up' ? 'trend-up' : 'trend-down'}`}>
                <span className="trend-icon">{metric.trend === 'up' ? '↑' : '↓'}</span>
                <span className="trend-change">{metric.change}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KPITemplate;