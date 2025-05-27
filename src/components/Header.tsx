import React, { useRef } from 'react';
import { FileImage, Download } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { exportChartsToZip } from '../utils/exportUtils';
import { toast } from 'react-toastify';

export const Header: React.FC = () => {
  const { chartData, infographicOptions, tables } = useAppContext();
  const chartRefs = useRef<Array<HTMLCanvasElement | null>>([]);
  
  const handleExport = async () => {
    try {
      // Filter out null refs and prepare chart data for export
      const validCharts = chartRefs.current
        .filter((ref): ref is HTMLCanvasElement => ref !== null)
        .map((chartRef, index) => ({
          chartRef,
          title: `infographic-${index + 1}`
        }));

      if (validCharts.length === 0) {
        toast.error('No charts available to export');
        return;
      }

      await exportChartsToZip(validCharts);
      toast.success('Infographics exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export infographics');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <FileImage className="h-8 w-8 text-primary-600" />
        <h1 className="text-xl font-semibold text-gray-900">DOCX to Infographics</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={handleExport}
          disabled={!chartData || tables.length === 0}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium text-sm 
            ${chartData && tables.length > 0
              ? 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          <Download size={18} />
          <span>Export {tables.length > 1 ? 'All' : ''} Infographic{tables.length > 1 ? 's' : ''}</span>
        </button>
      </div>
    </header>
  );
};