import React from 'react';
import { useAppContext } from '../context/AppContext';
import { BarChart2, LineChart, PieChart, Donut as Doughnut, Radar, CircleDot, Image, Trash2 } from 'lucide-react';
import { TableSelector } from './TableSelector';
import { ColorPicker } from './ColorPicker';

export const Sidebar: React.FC = () => {
  const { 
    tables, 
    selectedTableId, 
    infographicOptions, 
    setInfographicOptions,
    file
  } = useAppContext();

  if (!file || tables.length === 0) return null;

  const chartTypes = [
    { type: 'bar', icon: <BarChart2 size={20} />, label: 'Bar Chart' },
    { type: 'line', icon: <LineChart size={20} />, label: 'Line Chart' },
    { type: 'pie', icon: <PieChart size={20} />, label: 'Pie Chart' },
    { type: 'doughnut', icon: <Doughnut size={20} />, label: 'Doughnut Chart' },
    { type: 'radar', icon: <Radar size={20} />, label: 'Radar Chart' },
    { type: 'polarArea', icon: <CircleDot size={20} />, label: 'Polar Area Chart' },
  ] as const;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfographicOptions({
      ...infographicOptions,
      title: e.target.value,
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInfographicOptions({
      ...infographicOptions,
      description: e.target.value,
    });
  };

  const handleChartTypeChange = (chartType: typeof infographicOptions.chartType) => {
    setInfographicOptions({
      ...infographicOptions,
      chartType,
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setInfographicOptions({
          ...infographicOptions,
          logoUrl: event.target.result as string,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setInfographicOptions({
      ...infographicOptions,
      logoUrl: null,
    });
  };

  const handleToggleLegend = () => {
    setInfographicOptions({
      ...infographicOptions,
      showLegend: !infographicOptions.showLegend,
    });
  };

  return (
    <aside className="w-80 border-r border-gray-200 bg-white overflow-y-auto flex flex-col">
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-3">Data Source</h2>
          <TableSelector />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Infographic Settings</h2>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={infographicOptions.title}
              onChange={handleTitleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={infographicOptions.description}
              onChange={handleDescriptionChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chart Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {chartTypes.map(({ type, icon, label }) => (
                <button
                  key={type}
                  onClick={() => handleChartTypeChange(type)}
                  className={`flex flex-col items-center justify-center p-2 rounded-md text-xs
                    ${infographicOptions.chartType === type 
                      ? 'bg-primary-100 text-primary-700 border border-primary-300' 
                      : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
                  title={label}
                >
                  {icon}
                  <span className="mt-1">{label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Color Scheme
              </label>
            </div>
            <ColorPicker />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Brand Logo
              </label>
            </div>
            
            {infographicOptions.logoUrl ? (
              <div className="relative w-full h-20 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                <img 
                  src={infographicOptions.logoUrl} 
                  alt="Brand logo" 
                  className="max-h-full max-w-full object-contain"
                />
                <button
                  onClick={handleRemoveLogo}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
                  title="Remove logo"
                >
                  <Trash2 size={16} className="text-error-500" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Image className="w-8 h-8 text-gray-400" />
                  <p className="mt-1 text-xs text-gray-500">Upload your logo</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleLogoUpload}
                  accept="image/*"
                />
              </label>
            )}
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showLegend"
              checked={infographicOptions.showLegend}
              onChange={handleToggleLegend}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="showLegend" className="ml-2 block text-sm text-gray-700">
              Show Legend
            </label>
          </div>
        </div>
      </div>
    </aside>
  );
};