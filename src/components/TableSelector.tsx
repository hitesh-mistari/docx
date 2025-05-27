import React from 'react';
import { useAppContext } from '../context/AppContext';
import { FileText } from 'lucide-react';

export const TableSelector: React.FC = () => {
  const { tables, selectedTableId, setSelectedTableId } = useAppContext();

  if (tables.length === 0) return null;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Select Table
      </label>
      <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md divide-y divide-gray-200">
        {tables.map((table) => (
          <button
            key={table.id}
            onClick={() => setSelectedTableId(table.id)}
            className={`w-full flex items-center p-3 text-left transition-colors duration-150 ease-in-out
              ${selectedTableId === table.id 
                ? 'bg-primary-50 text-primary-700' 
                : 'hover:bg-gray-50 text-gray-700'}`}
          >
            <FileText 
              size={16} 
              className={`mr-2 ${selectedTableId === table.id ? 'text-primary-500' : 'text-gray-400'}`} 
            />
            <div className="truncate">
              <span className="block font-medium">{table.title}</span>
              <span className="block text-xs text-gray-500">
                {table.headers.length} columns · {table.rows.length} rows
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};