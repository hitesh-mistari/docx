import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Bar, Line, Pie, Doughnut, Radar, PolarArea } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { createChartData } from '../utils/chartUtils';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  RadialLinearScale,
  Filler
);

export const InfographicPreview: React.FC = () => {
  const { 
    tables, 
    selectedTableId, 
    infographicOptions,
    chartData,
    setChartData,
    chartOptions,
    setChartOptions,
    file
  } = useAppContext();

  useEffect(() => {
    if (!selectedTableId) return;
    
    const selectedTable = tables.find(table => table.id === selectedTableId);
    if (!selectedTable) return;
    
    // Create chart data and options based on the selected table and infographic options
    const { data, options } = createChartData(selectedTable, infographicOptions);
    
    setChartData(data);
    setChartOptions(options);
  }, [selectedTableId, infographicOptions, tables]);

  if (!file || !chartData || !chartOptions) return null;

  // Render the appropriate chart based on the selected chart type
  const renderChart = () => {
    const props = {
      data: chartData,
      options: chartOptions,
    };

    switch (infographicOptions.chartType) {
      case 'bar':
        return <Bar {...props} />;
      case 'line':
        return <Line {...props} />;
      case 'pie':
        return <Pie {...props} />;
      case 'doughnut':
        return <Doughnut {...props} />;
      case 'radar':
        return <Radar {...props} />;
      case 'polarArea':
        return <PolarArea {...props} />;
      default:
        return <Bar {...props} />;
    }
  };

  return (
    <div className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all duration-300 ease-in-out">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{infographicOptions.title}</h2>
            <p className="text-gray-600">{infographicOptions.description}</p>
          </div>
          
          {infographicOptions.logoUrl && (
            <div className="max-w-24 max-h-16">
              <img 
                src={infographicOptions.logoUrl} 
                alt="Brand logo" 
                className="max-h-full max-w-full object-contain"
              />
            </div>
          )}
        </div>
        
        <div className="w-full h-[500px] aspect-[16/9]">
          {renderChart()}
        </div>
      </div>
      
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
        <p>Preview (export will be at 1900×1080px)</p>
      </div>
    </div>
  );
};