import { API_ENDPOINTS } from '../config';
import type { Document } from '@/../../shared-models/src/index';

// Add event system for document deletions
const documentDeleteListeners: ((deletedIds: string[]) => void)[] = [];

export const DocumentService = {
  getDocument: async (id: string): Promise<Document> => {
    const response = await fetch(`${API_ENDPOINTS.DOCUMENTS}/${id}`);
    if (!response.ok) throw new Error('Document not found');
    return response.json();
  },

  createDocument: async (data: {
    title: string;
    content: string;
    folderId: string;
  }): Promise<Document> => {
    const response = await fetch(API_ENDPOINTS.DOCUMENTS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create document');
    return response.json();
  },

  updateDocument: async (id: string, content: string): Promise<Document> => {
    const response = await fetch(`${API_ENDPOINTS.DOCUMENTS}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error('Failed to update document');
    return response.json();
  },

  deleteDocument: async (id: string): Promise<void> => {
    const response = await fetch(`${API_ENDPOINTS.DOCUMENTS}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete document');
    // Notify listeners about the deletion
    documentDeleteListeners.forEach(listener => listener([id]));
  },

  // Add listener management
  onDocumentsDeleted: (callback: (deletedIds: string[]) => void) => {
    documentDeleteListeners.push(callback);
    return () => {
      const index = documentDeleteListeners.indexOf(callback);
      if (index > -1) {
        documentDeleteListeners.splice(index, 1);
      }
    };
  },
}; 