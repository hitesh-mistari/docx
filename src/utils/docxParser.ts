import docx4js from 'docx4js';
import { Buffer } from 'buffer';
import { TableData } from '../context/AppContext';

interface DocxTable {
  cells: string[][];
}

export async function extractTablesFromDocx(file: File): Promise<TableData[]> {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    const doc = await docx4js.load(file);
    
    if (!doc) {
      throw new Error('Failed to load document. The file might be corrupted or in an unsupported format.');
    }

    const tables: TableData[] = [];
    let tableIndex = 0;

    await doc.parse((node: any) => {
      if (!node || typeof node !== 'object') {
        return;
      }

      if (node.tag === 'w:tbl') {
        const tableData: DocxTable = { cells: [] };
        let currentRow: string[] = [];
        let rowIndex = 0;

        if (Array.isArray(node.children)) {
          node.children.forEach((row: any) => {
            if (row.tag === 'w:tr') {
              currentRow = [];
              if (Array.isArray(row.children)) {
                row.children.forEach((cell: any) => {
                  let cellText = '';
                  if (Array.isArray(cell.children)) {
                    cell.children.forEach((p: any) => {
                      if (p.tag === 'w:p' && Array.isArray(p.children)) {
                        p.children.forEach((run: any) => {
                          if (run.tag === 'w:r' && Array.isArray(run.children)) {
                            run.children.forEach((text: any) => {
                              if (text.tag === 'w:t') {
                                cellText += text.children[0] || '';
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                  currentRow.push(cellText.trim());
                });
              }
              
              if (currentRow.length > 0) {
                tableData.cells[rowIndex] = currentRow;
                rowIndex++;
              }
            }
          });
        }

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
    });

    if (tables.length === 0) {
      throw new Error('No valid tables found in the document');
    }

    return tables;
  } catch (error) {
    console.error('Error parsing DOCX file:', error);
    throw error;
  }
}