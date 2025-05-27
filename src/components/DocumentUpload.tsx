import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { FileUp, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { extractTablesFromDocx } from '../utils/docxParser';

export const DocumentUpload: React.FC = () => {
  const { 
    file, 
    setFile, 
    setTables, 
    isProcessing, 
    setIsProcessing,
    setSelectedTableId,
  } = useAppContext();

  const processDocument = async (file: File) => {
    setIsProcessing(true);
    
    try {
      const tables = await extractTablesFromDocx(file);
      
      // Add null check for tables
      if (!tables || !Array.isArray(tables)) {
        throw new Error('No valid tables found in the document');
      }
      
      setTables(tables);
      
      // Select the first table by default if available
      if (tables.length > 0) {
        setSelectedTableId(tables[0].id);
      }
      
      toast.success(`Successfully extracted ${tables.length} table${tables.length === 1 ? '' : 's'}`);
    } catch (error) {
      console.error('Error processing document:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process document');
      setFile(null);
      setTables([]);
      setSelectedTableId(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    if (!file) return;
    
    // Check if file is a Word document
    if (!file.name.endsWith('.docx')) {
      toast.error('Please upload a valid Word document (.docx)');
      return;
    }
    
    setFile(file);
    processDocument(file);
  }, [setFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    disabled: isProcessing,
  });

  if (file && !isProcessing) return null;

  return (
    <div className="max-w-3xl mx-auto my-8">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors duration-200 ease-in-out
          ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'}
          ${isProcessing ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          {isProcessing ? (
            <>
              <Loader2 className="h-12 w-12 text-primary-500 animate-spin" />
              <p className="text-lg font-medium text-gray-700">Processing document...</p>
              <p className="text-sm text-gray-500">This may take a moment</p>
            </>
          ) : (
            <>
              <FileUp className="h-12 w-12 text-primary-500" />
              <div>
                <p className="text-lg font-medium text-gray-700">
                  {isDragActive ? 'Drop your DOCX file here' : 'Upload a Word document'}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Drag and drop a .docx file, or click to browse
                </p>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                We'll extract tables and help you create beautiful infographics
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};