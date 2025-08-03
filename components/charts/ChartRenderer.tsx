import React from 'react';
import { BarChart } from './BarChart';
import { KPICard } from './KPICard';
import { DataTable } from './DataTable';

enum VisualizationType {
  BAR_CHART = "Bar Chart",
  LINE_CHART = "Line Chart",
  PIE_CHART = "Pie Chart",
  KPI_CARD = "KPI Card",
  TABLE = "Data Table",
}

interface DataPoint {
  label: string;
  value: number;
  category?: string;
}

interface ChartRendererProps {
  type: VisualizationType | string;
  data_points: DataPoint[];
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({ type, data_points }) => {
  switch (type) {
    case VisualizationType.BAR_CHART:
      return <BarChart data_points={data_points} />;
    
    case VisualizationType.KPI_CARD:
      return <KPICard data_points={data_points} />;
    
    case VisualizationType.TABLE:
      return <DataTable data_points={data_points} />;
    
    case VisualizationType.LINE_CHART:
      // For now, fallback to bar chart for line chart
      return (
        <div className="chart-placeholder-message">
          <p>Line chart visualization coming soon</p>
          <BarChart data_points={data_points} />
        </div>
      );
    
    case VisualizationType.PIE_CHART:
      // For now, show a CSS-based pie chart placeholder
      return (
        <div className="pie-chart-placeholder">
          <div className="pie-chart-circle">
            <div className="pie-slice slice-1" style={{ transform: 'rotate(0deg)' }}></div>
            <div className="pie-slice slice-2" style={{ transform: 'rotate(90deg)' }}></div>
            <div className="pie-slice slice-3" style={{ transform: 'rotate(180deg)' }}></div>
            <div className="pie-slice slice-4" style={{ transform: 'rotate(270deg)' }}></div>
          </div>
          <div className="pie-chart-legend">
            {data_points.slice(0, 4).map((point, i) => (
              <div key={i} className="legend-item">
                <span className={`legend-color color-${i + 1}`}></span>
                <span>{point.label}: ${point.value}M</span>
              </div>
            ))}
          </div>
        </div>
      );
    
    default:
      return <BarChart data_points={data_points} />;
  }
};

export default ChartRenderer;