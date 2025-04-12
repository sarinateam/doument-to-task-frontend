import React from 'react';
import { Task, TaskCategory } from '../types';
import { exportTasksToExcel } from '../services/api';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  // Map string categories to TaskCategory enum
  const mappedTasks = tasks.map(task => {
    // If category is already a TaskCategory enum, use it as is
    if (typeof task.category === 'string') {
      // Map string category to TaskCategory enum
      let mappedCategory = TaskCategory.BACKEND_DEVELOPMENT; // Default
      
      const categoryLower = task.category.toLowerCase();
      if (categoryLower.includes('ui design') || categoryLower.includes('design')) {
        mappedCategory = TaskCategory.UI_DESIGN;
      } else if (categoryLower.includes('ui development') || categoryLower.includes('frontend')) {
        mappedCategory = TaskCategory.UI_DEVELOPMENT;
      } else if (categoryLower.includes('frontend logic') || categoryLower.includes('frontend')) {
        mappedCategory = TaskCategory.FRONTEND_LOGIC;
      } else if (categoryLower.includes('backend')) {
        mappedCategory = TaskCategory.BACKEND_DEVELOPMENT;
      }
      
      return {
        ...task,
        category: mappedCategory
      };
    }
    
    return task;
  });

  // Group tasks by category
  const tasksByCategory = mappedTasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {} as Record<TaskCategory, Task[]>);

  // Sort tasks within each category by priority
  Object.keys(tasksByCategory).forEach(category => {
    tasksByCategory[category as TaskCategory].sort((a, b) => a.priority - b.priority);
  });

  // Get category display name
  const getCategoryDisplayName = (category: TaskCategory): string => {
    switch (category) {
      case TaskCategory.UI_DESIGN:
        return 'UI Design';
      case TaskCategory.UI_DEVELOPMENT:
        return 'UI Development';
      case TaskCategory.FRONTEND_LOGIC:
        return 'Frontend Logic';
      case TaskCategory.BACKEND_DEVELOPMENT:
        return 'Backend Development';
      default:
        return category;
    }
  };

  // Get priority badge color
  const getPriorityBadgeColor = (priority: number): string => {
    switch (priority) {
      case 1:
        return 'priority-high';
      case 2:
        return 'priority-medium';
      case 3:
        return 'priority-normal';
      case 4:
        return 'priority-low';
      case 5:
        return 'priority-very-low';
      default:
        return 'priority-normal';
    }
  };

  // Get priority display name
  const getPriorityDisplayName = (priority: number): string => {
    switch (priority) {
      case 1:
        return 'Critical';
      case 2:
        return 'High';
      case 3:
        return 'Medium';
      case 4:
        return 'Low';
      case 5:
        return 'Very Low';
      default:
        return 'Medium';
    }
  };

  // Handle export to Excel
  const handleExportToExcel = async () => {
    try {
      console.log('Export button clicked, tasks:', tasks);
      await exportTasksToExcel(tasks);
    } catch (error) {
      console.error('Failed to export tasks to Excel:', error);
      alert('Failed to export tasks to Excel. Please try again.');
    }
  };

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h2 className="task-list-title">Extracted Tasks</h2>
        {tasks.length > 0 && (
          <button 
            className="export-button"
            onClick={handleExportToExcel}
            title="Export tasks to Excel"
          >
            <span className="export-icon">📊</span> Export to Excel
          </button>
        )}
      </div>
      
      {Object.keys(tasksByCategory).length === 0 ? (
        <div className="no-tasks-message">
          <p>No tasks have been extracted yet. Upload a document or enter text to get started.</p>
        </div>
      ) : (
        <div className="task-categories">
          {Object.entries(tasksByCategory).map(([category, categoryTasks]) => (
            <div key={category} className="task-category">
              <div className="category-header">
                <h3 className="category-title">{getCategoryDisplayName(category as TaskCategory)}</h3>
                <span className="category-count">{categoryTasks.length} tasks</span>
              </div>
              
              <div className="category-tasks">
                {categoryTasks.map(task => (
                  <div key={task.id} className="task-card">
                    <div className="task-header">
                      <h4 className="task-title">{task.title}</h4>
                      <div className={`priority-badge ${getPriorityBadgeColor(task.priority)}`}>
                        {getPriorityDisplayName(task.priority)}
                      </div>
                    </div>
                    
                    <p className="task-description">{task.description}</p>
                    
                    <div className="task-footer">
                      {task.estimatedTime && (
                        <div className="task-time">
                          <span className="time-icon">⏱️</span>
                          <span>{task.estimatedTime}</span>
                        </div>
                      )}
                      
                      {task.dependencies && task.dependencies.length > 0 && (
                        <div className="task-dependencies">
                          <span className="dependencies-icon">🔗</span>
                          <span>Depends on: {task.dependencies.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {tasks.length > 0 && (
        <div className="export-container">
          <button 
            className="export-button-large"
            onClick={handleExportToExcel}
            title="Export tasks to Excel"
          >
            <span className="export-icon">📊</span> Export Tasks to Excel
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskList; 