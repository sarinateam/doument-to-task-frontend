import { DocumentAnalysisResult, Task } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const analyzeDocument = async (
  content: string | File,
  onProgress: (progress: number, message: string) => void
): Promise<DocumentAnalysisResult & { documentName?: string }> => {
  try {
    // Create a promise that will resolve when we get the final result
    const resultPromise = new Promise<DocumentAnalysisResult & { documentName?: string }>((resolve, reject) => {
      // Set a timeout to reject the promise if we don't get a response within 2 minutes
      const timeoutId = setTimeout(() => {
        console.error('Timeout waiting for SSE response');
        reject(new Error('Request timed out. Please try again.'));
      }, 120000); // 2 minutes
      
      // Make the API request
      let request;
      if (content instanceof File) {
        // Handle file upload
        const formData = new FormData();
        formData.append('document', content);
        
        request = fetch(`${API_URL}/api/documents/analyze`, {
          method: 'POST',
          body: formData,
        });
      } else {
        // Handle text input
        request = fetch(`${API_URL}/api/documents/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: content }),
        });
      }
      
      // Process the response
      request.then(response => {
        if (!response.ok) {
          clearTimeout(timeoutId);
          response.json().then(errorData => {
            reject(new Error(errorData.message || `HTTP error! status: ${response.status}`));
          }).catch(() => {
            reject(new Error(`HTTP error! status: ${response.status}`));
          });
          return;
        }
        
        // Set up SSE for progress updates and result
        const reader = response.body?.getReader();
        if (!reader) {
          clearTimeout(timeoutId);
          reject(new Error('Failed to get response reader'));
          return;
        }
        
        const decoder = new TextDecoder();
        let buffer = '';
        
        const processChunk = (chunk: string) => {
          buffer += chunk;
          
          // Process complete SSE messages
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || ''; // Keep the last incomplete line in the buffer
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.substring(6));
                console.log('SSE message received:', data);
                
                if (data.type === 'progress') {
                  onProgress(data.progress, data.message);
                } else if (data.type === 'complete' && data.result) {
                  console.log('Received complete result:', data.result);
                  clearTimeout(timeoutId);
                  resolve({
                    tasks: data.result.tasks,
                    summary: data.result.summary,
                    documentName: data.result.documentName
                  });
                } else if (data.type === 'error') {
                  console.error('Error in SSE response:', data.error);
                  clearTimeout(timeoutId);
                  reject(new Error(data.error || 'Error in document analysis'));
                }
              } catch (error) {
                console.error('Error parsing SSE message:', error);
              }
            }
          }
        };
        
        const readChunk = () => {
          reader.read().then(({ done, value }) => {
            if (done) {
              console.log('Stream complete');
              return;
            }
            
            const chunk = decoder.decode(value, { stream: true });
            processChunk(chunk);
            
            readChunk();
          }).catch(error => {
            console.error('Error reading stream:', error);
            clearTimeout(timeoutId);
            reject(new Error('Error reading response stream'));
          });
        };
        
        readChunk();
      }).catch(error => {
        console.error('Error making request:', error);
        clearTimeout(timeoutId);
        reject(error);
      });
    });
    
    // Wait for the result
    return await resultPromise;
  } catch (error) {
    console.error('Error analyzing document:', error);
    throw error;
  }
};

export const exportTasksToExcel = async (tasks: Task[], documentName?: string): Promise<void> => {
  try {
    console.log('Exporting tasks to Excel:', tasks);
    console.log('Tasks length:', tasks.length);
    console.log('Tasks structure:', JSON.stringify(tasks, null, 2));
    
    // Check if tasks have all required fields
    const validTasks = tasks.every(task => {
      const isValid = task.id && task.title && task.description && task.priority !== undefined;
      if (!isValid) {
        console.error('Invalid task:', task);
      }
      return isValid;
    });
    
    if (!validTasks) {
      console.error('Some tasks are missing required fields');
      throw new Error('Some tasks are missing required fields');
    }
    
    const response = await fetch(`${API_URL}/api/documents/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tasks, documentName }),
    });
    
    console.log('Export response status:', response.status);
    console.log('Export response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Export error response:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    // Check content type to determine how to handle the response
    const contentType = response.headers.get('content-type');
    console.log('Response content type:', contentType);
    
    if (contentType && contentType.includes('application/json')) {
      // Handle JSON response (error case)
      const errorData = await response.json();
      console.error('Export error response:', errorData);
      throw new Error(errorData.error || 'Failed to export tasks');
    } else {
      // Handle binary response (success case)
      const blob = await response.blob();
      console.log('Export blob received:', blob);
      console.log('Blob size:', blob.size);
      console.log('Blob type:', blob.type);
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      console.log('Created URL for blob:', url);
      
      // Create a temporary link element
      const a = document.createElement('a');
      a.href = url;
      a.download = documentName ? `${documentName}.xlsx` : 'tasks.xlsx';
      
      // Append to the document, click it, and remove it
      document.body.appendChild(a);
      console.log('Appended link to document');
      a.click();
      console.log('Clicked link');
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      console.log('Removed link from document');
      
      console.log('Export completed successfully');
    }
  } catch (error) {
    console.error('Error exporting tasks to Excel:', error);
    throw error;
  }
}; 