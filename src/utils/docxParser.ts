import docx4js from 'docx4js';
import { Buffer } from 'buffer';

interface DocxTable {
  cells: string[][];
}

export interface TableData {
  id: string;
  title: string;
  headers: string[];
  rows: string[][];
}

// Ensure Buffer is available globally
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

export async function extractTablesFromDocx(file: File): Promise<TableData[]> {
  // Validate file input
  if (!file) {
    throw new Error('No file provided');
  }

  if (!file.name.toLowerCase().endsWith('.docx')) {
    throw new Error('Invalid file format. Please provide a .docx file');
  }

  try {
    // Convert File to ArrayBuffer for more reliable parsing
    const arrayBuffer = await file.arrayBuffer();
    
    console.log('Loading document...', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    // Load document with explicit ArrayBuffer
    const doc = await docx4js.load(arrayBuffer);
    
    if (!doc) {
      throw new Error('Failed to load document. The file might be corrupted or in an unsupported format.');
    }

    const tables: TableData[] = [];
    let tableIndex = 0;

    // Create a wrapper for parse to handle potential binding issues
    const parseDocument = async () => {
      return new Promise((resolve, reject) => {
        try {
          doc.parse((node: any) => {
            if (!node || typeof node !== 'object') {
              return;
            }

            try {
              if (node.tag === 'w:tbl' && Array.isArray(node.children)) {
                const tableData: DocxTable = { cells: [] };
                let currentRow: string[] = [];
                let rowIndex = 0;

                node.children.forEach((row: any) => {
                  if (!row || !Array.isArray(row.children)) return;

                  if (row.tag === 'w:tr') {
                    currentRow = [];
                    row.children.forEach((cell: any) => {
                      if (!cell || !Array.isArray(cell.children)) return;

                      let cellText = '';
                      cell.children.forEach((p: any) => {
                        if (!p || !Array.isArray(p.children)) return;

                        if (p.tag === 'w:p') {
                          p.children.forEach((run: any) => {
                            if (!run || !Array.isArray(run.children)) return;

                            if (run.tag === 'w:r') {
                              run.children.forEach((text: any) => {
                                if (text && text.tag === 'w:t' && Array.isArray(text.children)) {
                                  cellText += text.children[0] || '';
                                }
                              });
                            }
                          });
                        }
                      });
                      currentRow.push(cellText.trim());
                    });
                    
                    if (currentRow.length > 0) {
                      tableData.cells[rowIndex] = currentRow;
                      rowIndex++;
                    }
                  }
                });

                // Only process tables that have content
                if (tableData.cells.length > 0 && tableData.cells[0].length > 0) {
                  const headers = tableData.cells[0];
                  const rows = tableData.cells.slice(1);

                  // Only add tables that have both headers and data
                  if (headers.length > 0 && rows.length > 0) {
                    tables.push({
                      id: `table-${tableIndex}`,
                      title: `Table ${tableIndex + 1}`,
                      headers,
                      rows
                    });
                    tableIndex++;
                  }
                }
              }
            } catch (nodeError) {
              console.warn('Error processing table node:', nodeError);
              // Continue processing other nodes
            }
          });
          resolve(true);
        } catch (parseError) {
          reject(parseError);
        }
      });
    };

    // Execute parse with proper error handling
    await parseDocument();

    if (tables.length === 0) {
      throw new Error('No valid tables found in the document. The file may be corrupted or contain no properly formatted tables.');
    }

    console.log('Successfully extracted tables:', {
      tableCount: tables.length,
      tablesPreview: tables.map(t => ({
        id: t.id,
        headerCount: t.headers.length,
        rowCount: t.rows.length
      }))
    });

    return tables;
  } catch (error) {
    console.error('Error parsing DOCX file:', error);
    
    // Provide more specific error messages based on the error type
    if (error instanceof TypeError && error.message.includes('bind')) {
      throw new Error('Failed to parse document structure. Please ensure the document is not corrupted and try saving it again in Microsoft Word or LibreOffice.');
    }
    
    throw new Error(
      error instanceof Error 
        ? `Failed to process document: ${error.message}`
        : 'Failed to process document. The file may be corrupted or in an unsupported format.'
    );
  }
}