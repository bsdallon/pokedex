import { defineStore } from 'pinia';

interface AppError {
  id: string;
  message: string;
  details?: string;
  type?: string;
  timestamp: number;
}

export const useErrorStore = defineStore('error', {
  state: () => ({
    errors: [] as AppError[],
    maxErrors: 5,
  }),

  actions: {
    addError(error: Error | string, details?: string, type?: string) {
      const errorMessage = error instanceof Error ? error.message : error;      
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      this.errors.push({
        id,
        message: errorMessage,
        details,
        type,
        timestamp: Date.now(),
      });
      
      if (this.errors.length > this.maxErrors) {
        this.errors.shift();
      }

      console.error('Error added to store:', errorMessage, details || '', type || '');
      
      return id;
    },
    
    clearError(id: string) {
      const index = this.errors.findIndex(e => e.id === id);
      if (index !== -1) {
        this.errors.splice(index, 1);
      }
    },
    
    clearAllErrors() {
      this.errors = [];
    }
  }
});
