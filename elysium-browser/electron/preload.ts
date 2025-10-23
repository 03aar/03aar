import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // Window controls
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
  },

  // Storage (encrypted in production)
  storage: {
    save: (key: string, value: any) => ipcRenderer.invoke('storage:save', key, value),
    load: (key: string) => ipcRenderer.invoke('storage:load', key),
    delete: (key: string) => ipcRenderer.invoke('storage:delete', key),
  },

  // AI services
  ai: {
    query: (prompt: string, context?: any) => ipcRenderer.invoke('ai:query', prompt, context),
  },
});

export {};
