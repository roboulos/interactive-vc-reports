import React from 'react';

interface TableColumn {
  key: string;
  header: string;
  type?: 'text' | 'number' | 'currency' | 'percent';
}

interface TableTemplateProps {
  title: string;
  columns: TableColumn[];
  data: Record<string, any>[];
  summary?: string;
}

export const TableTemplate: React.FC<TableTemplateProps> = ({ title, columns, data, summary }) => {
  const formatValue = (value: any, type?: string) => {
    if (value === null || value === undefined) return '-';
    
    switch (type) {
      case 'currency':
        return `$${typeof value === 'number' ? value.toLocaleString() : value}`;
      case 'percent':
        return `${value}%`;
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value;
      default:
        return value;
    }
  };

  return (
    <div className="table-template">
      <div className="template-header">
        <h3 className="template-title">{title}</h3>
      </div>
      
      <div className="template-table-container">
        <table className="template-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="table-header-cell">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="table-row">
                {columns.map((col) => (
                  <td key={col.key} className="table-cell">
                    {formatValue(row[col.key], col.type)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {summary && (
        <div className="template-summary">
          <p className="summary-text">{summary}</p>
        </div>
      )}
    </div>
  );
};

export default TableTemplate;