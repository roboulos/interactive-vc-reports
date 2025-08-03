import React from 'react';
import { 
  VisualizationTemplate, 
  KPITemplate, 
  TableTemplate, 
  FormTemplate, 
  DashboardTemplate 
} from './response-templates';

interface ComponentData {
  component: string;
  data: any;
  [key: string]: any;
}

interface ComponentResolverProps {
  componentData: ComponentData;
}

export const ComponentResolver: React.FC<ComponentResolverProps> = ({ componentData }) => {
  const { component, data, ...props } = componentData;

  switch (component) {
    case 'VisualizationTemplate':
      return <VisualizationTemplate data={data} {...props} />;
    
    case 'KPITemplate':
      return <KPITemplate {...data} {...props} />;
    
    case 'TableTemplate':
      return <TableTemplate {...data} {...props} />;
    
    case 'FormTemplate':
      return <FormTemplate {...data} {...props} />;
    
    case 'DashboardTemplate':
      return <DashboardTemplate {...data} {...props} />;
    
    default:
      return (
        <div className="unknown-component">
          <p>Unknown component: {component}</p>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      );
  }
};

export default ComponentResolver;