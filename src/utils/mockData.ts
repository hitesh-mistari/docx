import { TableData } from '../context/AppContext';

// Generate a random string ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Generate mock table data for demo purposes
export const generateRandomTables = (count: number): TableData[] => {
  const tables: TableData[] = [];
  
  const tableTypes = [
    {
      title: 'Monthly Sales Data',
      headers: ['Month', 'Revenue', 'Expenses', 'Profit'],
      generator: () => [
        ['January', `${Math.floor(Math.random() * 100000)}`, `${Math.floor(Math.random() * 50000)}`, `${Math.floor(Math.random() * 50000)}`],
        ['February', `${Math.floor(Math.random() * 100000)}`, `${Math.floor(Math.random() * 50000)}`, `${Math.floor(Math.random() * 50000)}`],
        ['March', `${Math.floor(Math.random() * 100000)}`, `${Math.floor(Math.random() * 50000)}`, `${Math.floor(Math.random() * 50000)}`],
        ['April', `${Math.floor(Math.random() * 100000)}`, `${Math.floor(Math.random() * 50000)}`, `${Math.floor(Math.random() * 50000)}`],
        ['May', `${Math.floor(Math.random() * 100000)}`, `${Math.floor(Math.random() * 50000)}`, `${Math.floor(Math.random() * 50000)}`],
        ['June', `${Math.floor(Math.random() * 100000)}`, `${Math.floor(Math.random() * 50000)}`, `${Math.floor(Math.random() * 50000)}`],
      ]
    },
    {
      title: 'Product Sales Breakdown',
      headers: ['Product', 'Q1', 'Q2', 'Q3', 'Q4'],
      generator: () => [
        ['Product A', `${Math.floor(Math.random() * 5000)}`, `${Math.floor(Math.random() * 5000)}`, `${Math.floor(Math.random() * 5000)}`, `${Math.floor(Math.random() * 5000)}`],
        ['Product B', `${Math.floor(Math.random() * 5000)}`, `${Math.floor(Math.random() * 5000)}`, `${Math.floor(Math.random() * 5000)}`, `${Math.floor(Math.random() * 5000)}`],
        ['Product C', `${Math.floor(Math.random() * 5000)}`, `${Math.floor(Math.random() * 5000)}`, `${Math.floor(Math.random() * 5000)}`, `${Math.floor(Math.random() * 5000)}`],
        ['Product D', `${Math.floor(Math.random() * 5000)}`, `${Math.floor(Math.random() * 5000)}`, `${Math.floor(Math.random() * 5000)}`, `${Math.floor(Math.random() * 5000)}`],
      ]
    },
    {
      title: 'Customer Demographics',
      headers: ['Age Group', 'Male', 'Female', 'Other'],
      generator: () => [
        ['18-24', `${Math.floor(Math.random() * 1000)}`, `${Math.floor(Math.random() * 1000)}`, `${Math.floor(Math.random() * 100)}`],
        ['25-34', `${Math.floor(Math.random() * 1000)}`, `${Math.floor(Math.random() * 1000)}`, `${Math.floor(Math.random() * 100)}`],
        ['35-44', `${Math.floor(Math.random() * 1000)}`, `${Math.floor(Math.random() * 1000)}`, `${Math.floor(Math.random() * 100)}`],
        ['45-54', `${Math.floor(Math.random() * 1000)}`, `${Math.floor(Math.random() * 1000)}`, `${Math.floor(Math.random() * 100)}`],
        ['55+', `${Math.floor(Math.random() * 1000)}`, `${Math.floor(Math.random() * 1000)}`, `${Math.floor(Math.random() * 100)}`],
      ]
    },
    {
      title: 'Website Traffic Sources',
      headers: ['Source', 'Visitors', 'Conversion Rate'],
      generator: () => [
        ['Organic Search', `${Math.floor(Math.random() * 10000)}`, `${(Math.random() * 10).toFixed(2)}%`],
        ['Direct', `${Math.floor(Math.random() * 10000)}`, `${(Math.random() * 10).toFixed(2)}%`],
        ['Referral', `${Math.floor(Math.random() * 10000)}`, `${(Math.random() * 10).toFixed(2)}%`],
        ['Social Media', `${Math.floor(Math.random() * 10000)}`, `${(Math.random() * 10).toFixed(2)}%`],
        ['Email', `${Math.floor(Math.random() * 10000)}`, `${(Math.random() * 10).toFixed(2)}%`],
        ['Paid Search', `${Math.floor(Math.random() * 10000)}`, `${(Math.random() * 10).toFixed(2)}%`],
      ]
    },
    {
      title: 'Regional Sales Performance',
      headers: ['Region', '2021', '2022', '2023'],
      generator: () => [
        ['North America', `${Math.floor(Math.random() * 1000000)}`, `${Math.floor(Math.random() * 1000000)}`, `${Math.floor(Math.random() * 1000000)}`],
        ['Europe', `${Math.floor(Math.random() * 1000000)}`, `${Math.floor(Math.random() * 1000000)}`, `${Math.floor(Math.random() * 1000000)}`],
        ['Asia Pacific', `${Math.floor(Math.random() * 1000000)}`, `${Math.floor(Math.random() * 1000000)}`, `${Math.floor(Math.random() * 1000000)}`],
        ['Latin America', `${Math.floor(Math.random() * 1000000)}`, `${Math.floor(Math.random() * 1000000)}`, `${Math.floor(Math.random() * 1000000)}`],
        ['Middle East', `${Math.floor(Math.random() * 1000000)}`, `${Math.floor(Math.random() * 1000000)}`, `${Math.floor(Math.random() * 1000000)}`],
      ]
    },
  ];
  
  // Create the specified number of tables
  for (let i = 0; i < count; i++) {
    // Pick a random table type
    const tableType = tableTypes[i % tableTypes.length];
    
    tables.push({
      id: generateId(),
      title: tableType.title,
      headers: tableType.headers,
      rows: tableType.generator(),
    });
  }
  
  return tables;
};