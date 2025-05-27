import React from 'react';
import { FileImage, Download } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Header: React.FC = () => {
  const { chartData, infographicOptions } = useAppContext();
  
  const handleExport = () => {
    // In a real implementation, this would capture the infographic as an image
    // and download it at 1900x1080 resolution
    alert('Export functionality would save the infographic at 1900x1080px');
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
          disabled={!chartData}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium text-sm 
            ${chartData 
              ? 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          <Download size={18} />
          <span>Export Infographic</span>
        </button>
      </div>
    </header>
  );
};