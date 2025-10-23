import { create } from 'zustand';
import { AppMode, Session, Memory, AIMessage, SettingsState } from '../types';

interface AppState {
  // Current state
  currentMode: AppMode;
  currentSession: Session | null;
  sessions: Session[];

  // UI state
  leftRailExpanded: boolean;
  rightPanelExpanded: boolean;
  intentFieldFocused: boolean;

  // Chat & AI
  chatMessages: AIMessage[];
  isAIThinking: boolean;

  // Memories
  memories: Memory[];

  // Settings
  settings: SettingsState;

  // Actions
  setMode: (mode: AppMode) => void;
  setCurrentSession: (session: Session | null) => void;
  addSession: (session: Session) => void;
  updateSession: (id: string, updates: Partial<Session>) => void;
  removeSession: (id: string) => void;

  setLeftRailExpanded: (expanded: boolean) => void;
  setRightPanelExpanded: (expanded: boolean) => void;
  setIntentFieldFocused: (focused: boolean) => void;

  addChatMessage: (message: AIMessage) => void;
  clearChat: () => void;
  setAIThinking: (thinking: boolean) => void;

  addMemory: (memory: Memory) => void;
  removeMemory: (id: string) => void;
  clearMemories: () => void;

  updateSettings: (settings: Partial<SettingsState>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  currentMode: 'home',
  currentSession: null,
  sessions: [],

  leftRailExpanded: false,
  rightPanelExpanded: true,
  intentFieldFocused: false,

  chatMessages: [],
  isAIThinking: false,

  memories: [],

  settings: {
    privacy: {
      localOnly: true,
      encryptMemories: true,
      telemetry: false,
    },
    appearance: {
      reducedMotion: false,
      fontSize: 16,
    },
    ai: {
      provider: 'openai',
    },
  },

  // Actions
  setMode: (mode) => set({ currentMode: mode }),

  setCurrentSession: (session) => set({ currentSession: session }),

  addSession: (session) =>
    set((state) => ({
      sessions: [session, ...state.sessions].slice(0, 50), // Keep last 50 sessions
    })),

  updateSession: (id, updates) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
      currentSession:
        state.currentSession?.id === id
          ? { ...state.currentSession, ...updates }
          : state.currentSession,
    })),

  removeSession: (id) =>
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== id),
      currentSession:
        state.currentSession?.id === id ? null : state.currentSession,
    })),

  setLeftRailExpanded: (expanded) => set({ leftRailExpanded: expanded }),
  setRightPanelExpanded: (expanded) => set({ rightPanelExpanded: expanded }),
  setIntentFieldFocused: (focused) => set({ intentFieldFocused: focused }),

  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, message],
    })),

  clearChat: () => set({ chatMessages: [] }),

  setAIThinking: (thinking) => set({ isAIThinking: thinking }),

  addMemory: (memory) =>
    set((state) => ({
      memories: [memory, ...state.memories],
    })),

  removeMemory: (id) =>
    set((state) => ({
      memories: state.memories.filter((m) => m.id !== id),
    })),

  clearMemories: () => set({ memories: [] }),

  updateSettings: (newSettings) =>
    set((state) => ({
      settings: {
        ...state.settings,
        ...newSettings,
        privacy: { ...state.settings.privacy, ...newSettings.privacy },
        appearance: { ...state.settings.appearance, ...newSettings.appearance },
        ai: { ...state.settings.ai, ...newSettings.ai },
      },
    })),
}));
