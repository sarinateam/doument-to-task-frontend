export enum TaskCategory {
  UI_DESIGN = 'UI_DESIGN',
  UI_DEVELOPMENT = 'UI_DEVELOPMENT',
  FRONTEND_LOGIC = 'FRONTEND_LOGIC',
  BACKEND_DEVELOPMENT = 'BACKEND_DEVELOPMENT'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category?: TaskCategory;
  priority: number;
  dependencies?: string[];
  estimatedTime?: string;
}

export interface DocumentAnalysisResult {
  tasks: Task[];
  summary: string;
}

export interface TaskListProps {
  tasks: Task[];
} 