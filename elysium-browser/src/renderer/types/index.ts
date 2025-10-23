// Core application types

export type AppMode = 'home' | 'research' | 'write' | 'automate' | 'memory';

export interface Session {
  id: string;
  title: string;
  mode: AppMode;
  url?: string;
  content?: string;
  timestamp: Date;
  thumbnail?: string;
  memories: Memory[];
}

export interface Memory {
  id: string;
  sessionId: string;
  type: 'summary' | 'note' | 'extract' | 'action';
  content: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  encrypted: boolean;
}

export interface IntentResult {
  mode: AppMode;
  action: string;
  parameters?: Record<string, any>;
  confidence: number;
}

export interface ContextSuggestion {
  type: 'summarize' | 'compare' | 'extract' | 'continue' | 'cite';
  label: string;
  action: () => void;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  sources?: string[];
}

export interface SettingsState {
  privacy: {
    localOnly: boolean;
    encryptMemories: boolean;
    telemetry: boolean;
  };
  appearance: {
    reducedMotion: boolean;
    fontSize: number;
  };
  ai: {
    provider: 'openai' | 'anthropic' | 'local';
    apiKey?: string;
    model?: string;
  };
}

export interface UserPreferences {
  lastMode: AppMode;
  recentSessions: string[];
  favoriteUrls: string[];
}
