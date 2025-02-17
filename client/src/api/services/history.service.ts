import { API_ENDPOINTS } from '../config';
import type { DocumentHistoryEntry } from '@/../../shared-models/src/index';

export const HistoryService = {
  getHistory: async (): Promise<DocumentHistoryEntry[]> => {
    const response = await fetch(API_ENDPOINTS.HISTORY);
    return response.json();
  },

  addToHistory: async (data: { id: string; title: string }): Promise<{ status: string }> => {
    const response = await fetch(API_ENDPOINTS.HISTORY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
}; 