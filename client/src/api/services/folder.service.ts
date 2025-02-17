import { API_ENDPOINTS } from '../config';
import type { DocumentFolder, Document } from '@/../../shared-models/src/index';

export const FolderService = {
  getFolders: async (): Promise<DocumentFolder[]> => {
    const response = await fetch(API_ENDPOINTS.FOLDERS);
    return response.json();
  },

  getDocumentsByFolder: async (folderId: string): Promise<Document[]> => {
    const response = await fetch(`${API_ENDPOINTS.FOLDERS}/${folderId}`);
    return response.json();
  },

  createFolder: async (name: string): Promise<DocumentFolder> => {
    const response = await fetch(API_ENDPOINTS.FOLDERS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    return response.json();
  },

  deleteFolder: async (id: string): Promise<{ status: string }> => {
    const response = await fetch(`${API_ENDPOINTS.FOLDERS}/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
}; 