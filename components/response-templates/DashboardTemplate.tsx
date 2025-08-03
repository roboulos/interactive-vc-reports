import React from 'react';

interface DashboardWidget {
  id: string;
  type: 'kpi' | 'chart' | 'table' | 'text';
  title: string;
  content: any;
  size?: 'small' | 'medium' | 'large' | 'full';
}

interface DashboardTemplateProps {
  title: string;
  subtitle?: string;
  widgets: DashboardWidget[];
  lastUpdated?: string;
}

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({ 
  title, 
  subtitle, 
  widgets,
  lastUpdated 
}) => {
  return (
    <div className="dashboard-template">
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">{title}</h2>
          {subtitle && <p className="dashboard-subtitle">{subtitle}</p>}
        </div>
        {lastUpdated && (
          <div className="dashboard-updated">
            Last updated: {lastUpdated}
          </div>
        )}
      </div>
      
      <div className="dashboard-grid">
        {widgets.map((widget) => (
          <div 
            key={widget.id} 
            className={`dashboard-widget widget-${widget.size || 'medium'} widget-${widget.type}`}
          >
            <div className="widget-header">
              <h3 className="widget-title">{widget.title}</h3>
            </div>
            <div className="widget-content">
              {widget.type === 'kpi' && (
                <div className="widget-kpi">
                  <div className="kpi-value">{widget.content.value}</div>
                  <div className="kpi-label">{widget.content.label}</div>
                </div>
              )}
              
              {widget.type === 'chart' && (
                <div className="widget-chart">
                  <div className="chart-placeholder">
                    📊 {widget.content.type} Chart
                  </div>
                </div>
              )}
              
              {widget.type === 'table' && (
                <div className="widget-table">
                  <div className="table-placeholder">
                    📋 Data Table ({widget.content.rows} rows)
                  </div>
                </div>
              )}
              
              {widget.type === 'text' && (
                <div className="widget-text">
                  <p>{widget.content}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardTemplate;