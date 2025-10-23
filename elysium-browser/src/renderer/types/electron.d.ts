export interface ElectronAPI {
  window: {
    minimize: () => Promise<void>;
    maximize: () => Promise<void>;
    close: () => Promise<void>;
  };
  storage: {
    save: (key: string, value: any) => Promise<{ success: boolean }>;
    load: (key: string) => Promise<any>;
    delete: (key: string) => Promise<{ success: boolean }>;
  };
  ai: {
    query: (prompt: string, context?: any) => Promise<{
      response: string;
      timestamp: string;
    }>;
  };
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export {};
