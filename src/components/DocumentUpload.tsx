import React, { useState, useRef } from 'react';
import { analyzeDocument } from '../services/api';
import './DocumentUpload.css';

interface DocumentUploadProps {
  onAnalysisComplete: (result: { tasks: any[]; summary: string }) => void;
  onError: (error: string) => void;
  onLoading: (loading: boolean) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ 
  onAnalysisComplete, 
  onError, 
  onLoading 
}) => {
  const [text, setText] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [progressMessage, setProgressMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text && !file) {
      onError('Please enter text or upload a file');
      return;
    }
    
    onLoading(true);
    setProgress(0);
    setProgressMessage('Starting analysis...');
    
    try {
      let result;
      
      if (file) {
        result = await analyzeDocument(
          file,
          (progress, message) => {
            setProgress(progress);
            setProgressMessage(message);
          }
        );
      } else {
        result = await analyzeDocument(
          text,
          (progress, message) => {
            setProgress(progress);
            setProgressMessage(message);
          }
        );
      }
      
      onAnalysisComplete(result);
    } catch (err) {
      console.error('Error analyzing document:', err);
      
      // Check for OpenAI quota error
      if (err instanceof Error && 
          (err.message.includes('429') || 
           err.message.includes('quota') || 
           err.message.includes('OpenAI API quota exceeded'))) {
        onError('OpenAI API quota exceeded. Please check your billing details or upgrade your plan.');
      } else {
        onError('Failed to analyze document. Please try again later.');
      }
    } finally {
      // Ensure progress is set to 100% when complete
      setProgress(100);
      setProgressMessage('Analysis complete!');
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="document-upload-container">
      <form onSubmit={handleSubmit}>
        <div 
          className={`dropzone ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".txt,.pdf,.docx"
            className="file-input"
          />
          
          {file ? (
            <div className="file-selected">
              <p className="file-name">{file.name}</p>
              <button 
                type="button" 
                className="remove-file-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="upload-prompt">
              <div className="upload-icon">📄</div>
              <p>Drag and drop a file here, or click to browse</p>
              <p className="supported-formats">Supported formats: PDF, DOCX, TXT</p>
            </div>
          )}
        </div>
        
        <div className="text-input-container">
          <label htmlFor="text-input">Or enter text directly:</label>
          <textarea
            id="text-input"
            value={text}
            onChange={handleTextChange}
            placeholder="Paste your text here..."
            rows={6}
          />
        </div>
        
        <button 
          type="submit" 
          className="analyze-btn"
          disabled={!text && !file}
        >
          Analyze Document
        </button>
      </form>
      
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="progress-info">
          <span className="progress-message">{progressMessage || 'Ready to analyze'}</span>
          <span className="progress-percentage">{progress}%</span>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload; 