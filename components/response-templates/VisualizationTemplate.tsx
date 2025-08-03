import React from 'react';

interface DataPoint {
  label: string;
  value: number;
  category?: string;
}

interface VisualizationData {
  title: string;
  type: string;
  time_range: string;
  industry_filters: string[];
  data_points: DataPoint[];
  insights: string[];
}

interface VisualizationTemplateProps {
  data: VisualizationData;
}

export const VisualizationTemplate: React.FC<VisualizationTemplateProps> = ({ data }) => {
  return (
    <div className="visualization-template">
      <div className="template-header">
        <h3 className="template-title">{data.title}</h3>
        <div className="template-meta">
          <span className="meta-badge">{data.type}</span>
          <span className="meta-badge">{data.time_range}</span>
        </div>
      </div>
      
      <div className="template-chart">
        {/* Chart would be rendered here */}
        <div className="chart-preview">
          <p className="preview-text">📊 {data.type} visualization with {data.data_points.length} data points</p>
        </div>
      </div>
      
      <div className="template-insights">
        <h4 className="insights-title">Key Insights</h4>
        <ul className="insights-list">
          {data.insights.map((insight, index) => (
            <li key={index} className="insight-item">
              <span className="insight-number">{index + 1}</span>
              <span className="insight-text">{insight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VisualizationTemplate;