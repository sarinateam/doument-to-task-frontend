export type TaskCategory = 'UI Design' | 'UI Development' | 'Frontend Logic' | 'Backend Development';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: number;
  dependencies?: string[];
  estimatedTime?: string;
}

export interface DocumentAnalysisResult {
  tasks: Task[];
  summary: string;
  metadata: {
    documentType: string;
    wordCount: number;
  };
}

export interface AIModel {
  name: string;
  provider: string;
  modelId: string;
  maxTokens: number;
  temperature: number;
}

export interface ErrorResponse {
  error: string;
  details?: string;
}

// Component Props Types
export interface DocumentUploadProps {
  onUpload: (text: string) => void;
}

export interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export interface TaskListProps {
  tasks: Task[];
} 