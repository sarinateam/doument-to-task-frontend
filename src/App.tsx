import React, { useState } from 'react';
import DocumentUpload from './components/DocumentUpload';
import TaskList from './components/TaskList';
import { Task, TaskCategory } from './types';
import { exportTasksToExcel } from './services/api';
import './App.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState<string>('');

  const handleAnalysisComplete = (result: { tasks: Task[]; summary: string; documentName?: string }) => {
    console.log('Analysis complete, raw result:', result);
    console.log('Tasks from result:', result.tasks);
    console.log('Tasks length:', result.tasks.length);
    
    // Ensure tasks have valid categories and dependencies
    const validTasks = result.tasks.map(task => {
      console.log('Processing task:', task);
      
      // Create a new task object with default values for missing fields
      const validTask: Task = {
        ...task,
        // Set default category if missing
        category: task.category || TaskCategory.BACKEND_DEVELOPMENT,
        // Set empty array for dependencies if missing
        dependencies: task.dependencies || []
      };
      
      console.log('Validated task:', validTask);
      return validTask;
    });
    
    console.log('Valid tasks after processing:', validTasks);
    console.log('Valid tasks length:', validTasks.length);
    
    setTasks(validTasks);
    setSummary(result.summary);
    setDocumentName(result.documentName || '');
    setIsLoading(false);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    console.error('Analysis error:', errorMessage);
    setError(errorMessage);
    setIsLoading(false);
  };

  const handleLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const handleExportToExcel = async () => {
    try {
      console.log('Exporting tasks to Excel:', tasks);
      console.log('Tasks length before export:', tasks.length);
      
      if (tasks.length === 0) {
        console.error('No tasks to export');
        setError('No tasks to export. Please analyze a document first.');
        return;
      }
      
      await exportTasksToExcel(tasks);
    } catch (error) {
      console.error('Failed to export tasks to Excel:', error);
      setError('Failed to export tasks to Excel. Please try again.');
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Document to Task AI</h1>
        <p>Upload a document or enter text to extract tasks</p>
        <p className="model-info">Powered by GPT-4o-mini</p>
      </header>

      <main className="app-main">
        <DocumentUpload 
          onAnalysisComplete={handleAnalysisComplete}
          onError={handleError}
          onLoading={handleLoading}
        />

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {summary && (
          <div className="summary-container">
            <h2>Analysis Summary</h2>
            <p>{summary}</p>
          </div>
        )}

        {tasks.length > 0 && (
          <TaskList tasks={tasks} documentName={documentName} />
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Document to Task AI</p>
      </footer>
    </div>
  );
}

export default App; 