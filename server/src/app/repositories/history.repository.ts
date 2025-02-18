import { DocumentHistoryEntry } from '@nx-document-assignment/shared-models';
import { documentBase } from '../data/mockDatabase';

export const HistoryRepository = {
  getHistory: (): DocumentHistoryEntry[] => documentBase.history,

  addHistory: (entry: { id: string; title: string }) => {
    // Remove any existing entry with the same id
    documentBase.history = documentBase.history.filter(
      (historyEntry) => historyEntry.id !== entry.id
    );

    // Create a new entry with current timestamp
    const newEntry = { ...entry, timestamp: Date.now() };

    // Add the new entry at the beginning and keep only the latest 10 entries
    documentBase.history.unshift(newEntry);
    documentBase.history = documentBase.history.slice(0, 10);

    return newEntry;
  },
};
