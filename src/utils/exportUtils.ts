import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { ChartData, ChartOptions } from 'chart.js';

interface ExportOptions {
  width?: number;
  height?: number;
  backgroundColor?: string;
  devicePixelRatio?: number;
}

export async function exportChartsToZip(
  charts: Array<{
    chartRef: HTMLCanvasElement;
    title: string;
  }>,
  options: ExportOptions = {}
): Promise<void> {
  const {
    width = 1900,
    height = 1080,
    backgroundColor = '#ffffff',
    devicePixelRatio = 2
  } = options;

  try {
    const zip = new JSZip();
    
    // Create a temporary canvas for high-resolution export
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    if (!tempCtx) {
      throw new Error('Failed to get canvas context');
    }
    
    // Set canvas size for high resolution
    tempCanvas.width = width * devicePixelRatio;
    tempCanvas.height = height * devicePixelRatio;
    
    for (let i = 0; i < charts.length; i++) {
      const { chartRef, title } = charts[i];
      
      // Clear the temporary canvas
      tempCtx.fillStyle = backgroundColor;
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      
      // Scale the context for high resolution
      tempCtx.scale(devicePixelRatio, devicePixelRatio);
      
      // Draw the chart onto the temporary canvas
      tempCtx.drawImage(chartRef, 0, 0, width, height);
      
      // Convert the canvas to a blob
      const blob = await new Promise<Blob>((resolve) => {
        tempCanvas.toBlob((blob) => {
          resolve(blob!);
        }, 'image/png');
      });
      
      // Add the image to the zip file
      const fileName = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;
      zip.file(fileName, blob);
      
      // Reset the context scale
      tempCtx.setTransform(1, 0, 0, 1, 0, 0);
    }
    
    // Generate and download the zip file
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, 'infographics.zip');
  } catch (error) {
    console.error('Error exporting charts:', error);
    throw error;
  }
}