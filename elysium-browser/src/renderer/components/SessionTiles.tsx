import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store';
import { Session } from '../types';
import '../styles/SessionTiles.css';

export const SessionTiles: React.FC = () => {
  const { sessions, currentSession, setCurrentSession, removeSession, addSession } = useAppStore();

  const handleNewSession = () => {
    const newSession: Session = {
      id: `session_${Date.now()}`,
      title: 'New Session',
      mode: 'research',
      timestamp: new Date(),
      memories: [],
    };
    addSession(newSession);
    setCurrentSession(newSession);
  };

  const handleSelectSession = (session: Session) => {
    setCurrentSession(session);
  };

  const handleCloseSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    removeSession(sessionId);
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'research':
        return '🔍';
      case 'write':
        return '✍️';
      case 'automate':
        return '⚡';
      case 'memory':
        return '💭';
      default:
        return '📄';
    }
  };

  return (
    <div className="session-tiles">
      <div className="tiles-container">
        <AnimatePresence mode="popLayout">
          {sessions.slice(0, 10).map((session) => (
            <motion.div
              key={session.id}
              className={`session-tile ${currentSession?.id === session.id ? 'active' : ''}`}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              onClick={() => handleSelectSession(session)}
            >
              <div className="tile-content">
                <span className="tile-icon">{getModeIcon(session.mode)}</span>
                <span className="tile-title">{session.title}</span>
              </div>
              <button
                className="tile-close"
                onClick={(e) => handleCloseSession(e, session.id)}
                title="Close session"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M9 3L3 9M3 3l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* New Session Button */}
        <motion.button
          className="new-session-btn"
          onClick={handleNewSession}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </motion.button>
      </div>
    </div>
  );
};
