import { TableData, InfographicOptions } from '../context/AppContext';
import { ChartData, ChartOptions } from 'chart.js';

export const createChartData = (
  tableData: TableData, 
  infographicOptions: InfographicOptions
): { data: ChartData, options: ChartOptions } => {
  const { headers, rows } = tableData;
  const { colors, showLegend, chartType } = infographicOptions;
  
  // For simplicity, we'll assume the first column is labels and the rest are data series
  const labels = rows.map(row => row[0]);
  
  // Generate datasets based on the table headers and rows
  const datasets = [];
  
  // Skip the first header (labels column)
  for (let i = 1; i < headers.length; i++) {
    // Get the data for this series (column)
    const data = rows.map(row => {
      // Convert to number or use 0 if invalid
      const value = parseFloat(row[i]);
      return isNaN(value) ? 0 : value;
    });
    
    // Create a dataset with appropriate styling based on chart type
    const dataset = {
      label: headers[i],
      data,
      backgroundColor: isPieChartType(chartType) 
        ? data.map((_, index) => colors[index % colors.length])
        : colors[(i - 1) % colors.length],
      borderColor: isPieChartType(chartType) 
        ? 'white'
        : colors[(i - 1) % colors.length],
      borderWidth: 1,
    };
    
    // For line charts, add additional styling
    if (chartType === 'line') {
      Object.assign(dataset, {
        tension: 0.3,
        fill: false,
      });
    }
    
    // For radar charts
    if (chartType === 'radar') {
      Object.assign(dataset, {
        fill: true,
        backgroundColor: `${colors[(i - 1) % colors.length]}33`, // Add transparency
      });
    }
    
    datasets.push(dataset);
  }
  
  // Create chart data
  const data: ChartData = { labels, datasets };
  
  // Create chart options
  const options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top' as const,
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
      },
    },
    scales: getScalesConfig(chartType),
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };
  
  return { data, options };
};

// Helper to determine if the chart type is a pie-like chart
const isPieChartType = (type: string): boolean => {
  return ['pie', 'doughnut', 'polarArea'].includes(type);
};

// Helper to get the appropriate scales configuration based on chart type
const getScalesConfig = (chartType: string) => {
  // Pie-like charts don't use conventional axes
  if (isPieChartType(chartType)) {
    return undefined;
  }
  
  // Radar charts use radial axes
  if (chartType === 'radar') {
    return undefined;
  }
  
  // Default scales for bar and line charts
  return {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
    },
  };
};