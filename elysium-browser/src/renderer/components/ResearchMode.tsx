import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store';
import { SessionTiles } from './SessionTiles';
import '../styles/ResearchMode.css';

export const ResearchMode: React.FC = () => {
  const { currentSession, updateSession } = useAppStore();
  const [url, setUrl] = useState(currentSession?.url || '');
  const [isLoading, setIsLoading] = useState(false);
  const webviewRef = useRef<any>(null);

  useEffect(() => {
    if (currentSession?.url && currentSession.url !== url) {
      setUrl(currentSession.url);
    }
  }, [currentSession]);

  const handleNavigate = (newUrl: string) => {
    if (!newUrl) return;

    // Normalize URL
    let normalizedUrl = newUrl;
    if (!newUrl.includes('://')) {
      normalizedUrl = `https://${newUrl}`;
    }

    setUrl(normalizedUrl);
    setIsLoading(true);

    if (currentSession) {
      updateSession(currentSession.id, { url: normalizedUrl });
    }

    // Simulate loading (in production, webview would handle this)
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNavigate(url);
  };

  const handleRefresh = () => {
    if (url) {
      handleNavigate(url);
    }
  };

  const handleBack = () => {
    // In production, implement webview navigation
    console.log('Navigate back');
  };

  const handleForward = () => {
    // In production, implement webview navigation
    console.log('Navigate forward');
  };

  return (
    <div className="research-mode">
      {/* Session Tiles */}
      <SessionTiles />

      {/* Top Bar */}
      <div className="research-topbar">
        <div className="nav-controls">
          <button className="nav-btn" onClick={handleBack} title="Back">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="nav-btn" onClick={handleForward} title="Forward">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 13l5-5-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="nav-btn" onClick={handleRefresh} title="Refresh">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1 4v4h4M15 12V8h-4M2.5 8A6.5 6.5 0 0 1 14 5.5M13.5 8A6.5 6.5 0 0 1 2 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleUrlSubmit} className="url-bar-form">
          <div className="url-bar">
            {isLoading && <div className="loading-indicator" />}
            <svg className="url-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1a6 6 0 1 0 0 12A6 6 0 0 0 7 1z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <input
              type="text"
              className="url-input"
              placeholder="Search or enter address..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </form>

        <div className="page-actions">
          <button className="page-action-btn" title="Save to Memory">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 1H4a2 2 0 0 0-2 2v12l6-3 6 3V3a2 2 0 0 0-2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="page-action-btn" title="Export">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14 10v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2M11 5L8 2M8 2L5 5M8 2v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="research-content">
        {url ? (
          <div className="webview-container">
            {/* In production, use <webview> tag or iframe */}
            <div className="webview-placeholder">
              <motion.div
                className="placeholder-content"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2"/>
                  <path d="M20 28h24M20 36h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <h3>Webpage Content</h3>
                <p>{url}</p>
                <div className="implementation-note">
                  <strong>Implementation Note:</strong>
                  <p>
                    In production, this area would contain a Chromium webview displaying the actual webpage.
                    Configure with:<br/>
                    <code>&lt;webview src="{url}" /&gt;</code>
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          <div className="research-empty">
            <p>Enter a URL or search query to begin</p>
          </div>
        )}
      </div>
    </div>
  );
};
