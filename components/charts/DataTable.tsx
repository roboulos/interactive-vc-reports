import React from 'react';

interface DataPoint {
  label: string;
  value: number;
  category?: string;
}

interface DataTableProps {
  data_points: DataPoint[];
}

export const DataTable: React.FC<DataTableProps> = ({ data_points }) => {
  if (!data_points || data_points.length === 0) {
    return (
      <div className="data-table-empty">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Company/Industry</th>
            <th>Funding Amount</th>
            <th>Category</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data_points.map((point, index) => (
            <tr key={index} className="data-table-row">
              <td className="data-table-cell">
                <div className="table-label">{point.label}</div>
              </td>
              <td className="data-table-cell">
                <div className="table-value">${point.value}M</div>
              </td>
              <td className="data-table-cell">
                <div className="table-category">{point.category || 'General'}</div>
              </td>
              <td className="data-table-cell">
                <div className="table-status">
                  <span className="status-badge status-active">Active</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;