import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ChartData, ChartOptions } from 'chart.js';

export interface TableData {
  id: string;
  title: string;
  headers: string[];
  rows: string[][];
}

export interface InfographicOptions {
  title: string;
  description: string;
  chartType: 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea';
  colors: string[];
  showLegend: boolean;
  logoUrl: string | null;
}

interface AppContextType {
  file: File | null;
  setFile: (file: File | null) => void;
  tables: TableData[];
  setTables: (tables: TableData[]) => void;
  selectedTableId: string | null;
  setSelectedTableId: (id: string | null) => void;
  infographicOptions: InfographicOptions;
  setInfographicOptions: (options: InfographicOptions) => void;
  chartData: ChartData | null;
  setChartData: (data: ChartData | null) => void;
  chartOptions: ChartOptions | null;
  setChartOptions: (options: ChartOptions | null) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [file, setFile] = useState<File | null>(null);
  const [tables, setTables] = useState<TableData[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [chartOptions, setChartOptions] = useState<ChartOptions | null>(null);
  
  const [infographicOptions, setInfographicOptions] = useState<InfographicOptions>({
    title: 'My Infographic',
    description: 'Data visualization created from document',
    chartType: 'bar',
    colors: ['#2563EB', '#7C3AED', '#0D9488', '#16A34A', '#F59E0B', '#DC2626'],
    showLegend: true,
    logoUrl: null,
  });

  return (
    <AppContext.Provider
      value={{
        file,
        setFile,
        tables,
        setTables,
        selectedTableId,
        setSelectedTableId,
        infographicOptions,
        setInfographicOptions,
        chartData,
        setChartData,
        chartOptions,
        setChartOptions,
        isProcessing,
        setIsProcessing,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};