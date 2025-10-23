import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAppStore } from './store';
import { StorageService } from './services/storage';
import { LeftRail } from './components/LeftRail';
import { HomeCanvas } from './components/HomeCanvas';
import { ResearchMode } from './components/ResearchMode';
import { WriteMode } from './components/WriteMode';
import { ContextAssistant } from './components/ContextAssistant';
import './styles/global.css';
import './styles/App.css';

const App: React.FC = () => {
  const { currentMode, sessions, memories, settings, updateSettings } = useAppStore();

  // Initialize app
  useEffect(() => {
    const init = async () => {
      await StorageService.initialize();

      // Load persisted data
      const savedSessions = await StorageService.loadSessions();
      const savedMemories = await StorageService.loadMemories();
      const savedSettings = await StorageService.loadSettings();

      if (savedSessions.length > 0) {
        useAppStore.setState({ sessions: savedSessions });
      }

      if (savedMemories.length > 0) {
        useAppStore.setState({ memories: savedMemories });
      }

      if (savedSettings) {
        updateSettings(savedSettings);
      }
    };

    init();
  }, []);

  // Persist data on changes
  useEffect(() => {
    if (sessions.length > 0) {
      StorageService.saveSessions(sessions);
    }
  }, [sessions]);

  useEffect(() => {
    if (memories.length > 0) {
      StorageService.saveMemories(memories);
    }
  }, [memories]);

  useEffect(() => {
    StorageService.saveSettings(settings);
  }, [settings]);

  const renderMode = () => {
    switch (currentMode) {
      case 'home':
        return <HomeCanvas />;
      case 'research':
        return <ResearchMode />;
      case 'write':
        return <WriteMode />;
      case 'automate':
        return (
          <div className="mode-placeholder">
            <h2>Automation Mode</h2>
            <p>Safe, transparent task automation coming soon.</p>
          </div>
        );
      case 'memory':
        return (
          <div className="mode-placeholder">
            <h2>Memory Mode</h2>
            <p>Browse and search your saved memories and sessions.</p>
          </div>
        );
      default:
        return <HomeCanvas />;
    }
  };

  return (
    <div className="app">
      <LeftRail />

      <main className="app-main">
        <AnimatePresence mode="wait">
          {renderMode()}
        </AnimatePresence>
      </main>

      <ContextAssistant />
    </div>
  );
};

export default App;
