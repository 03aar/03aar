import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store';
import { AIService } from '../services/ai';
import '../styles/HomeCanvas.css';

export const HomeCanvas: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { setMode, setIntentFieldFocused, addSession, setCurrentSession } = useAppStore();

  useEffect(() => {
    // Auto-focus on mount
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Detect intent
    const intent = await AIService.detectIntent(inputValue);

    // Create new session
    const newSession = {
      id: `session_${Date.now()}`,
      title: inputValue.slice(0, 50),
      mode: intent.mode,
      url: intent.parameters?.url,
      content: '',
      timestamp: new Date(),
      memories: [],
    };

    addSession(newSession);
    setCurrentSession(newSession);
    setMode(intent.mode);

    // Clear input
    setInputValue('');
  };

  const handleFocus = () => {
    setIsFocused(true);
    setIntentFieldFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setIntentFieldFocused(false);
  };

  return (
    <div className="home-canvas">
      {/* Ambient Background */}
      <motion.div
        className="ambient-background"
        animate={{
          background: isFocused
            ? 'radial-gradient(circle at center, rgba(10, 132, 255, 0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle at center, rgba(28, 28, 30, 0.8) 0%, transparent 70%)'
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Center Content */}
      <motion.div
        className="home-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Intent Field */}
        <form onSubmit={handleSubmit} className="intent-form">
          <motion.div
            className="intent-field-wrapper"
            animate={{
              scale: isFocused ? 1.02 : 1,
              boxShadow: isFocused
                ? '0 12px 48px rgba(0, 0, 0, 0.6)'
                : '0 4px 20px rgba(0, 0, 0, 0.4)'
            }}
            transition={{ duration: 0.15 }}
          >
            <input
              ref={inputRef}
              type="text"
              className="intent-input"
              placeholder="What would you like to explore?"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </motion.div>
        </form>

        {/* Subtle Hint */}
        <motion.p
          className="hint-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: isFocused ? 0 : 0.5 }}
          transition={{ duration: 0.3 }}
        >
          Type a question, paste a link, or describe what you want to create
        </motion.p>
      </motion.div>

      {/* Bottom Icons */}
      <motion.div
        className="home-actions"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <button className="home-action-btn" title="Sessions">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        <button className="home-action-btn" title="Memory">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        <button className="home-action-btn" title="Settings">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10 1v2m0 14v2M19 10h-2M3 10H1m15.364-5.364l-1.414 1.414M5.05 14.95l-1.414 1.414m12.728 0l-1.414-1.414M5.05 5.05L3.636 3.636" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </motion.div>
    </div>
  );
};
