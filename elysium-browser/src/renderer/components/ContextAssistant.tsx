import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store';
import { AIService } from '../services/ai';
import { AIMessage } from '../types';
import '../styles/ContextAssistant.css';

export const ContextAssistant: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    rightPanelExpanded,
    setRightPanelExpanded,
    chatMessages,
    addChatMessage,
    isAIThinking,
    setAIThinking,
    currentSession,
  } = useAppStore();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: AIMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    addChatMessage(userMessage);
    setInputValue('');
    setAIThinking(true);

    // Get AI response
    try {
      const response = await AIService.query(inputValue, {
        session: currentSession,
        history: chatMessages.slice(-5),
      });

      const aiMessage: AIMessage = {
        id: `msg_${Date.now()}_ai`,
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        sources: response.sources,
      };

      addChatMessage(aiMessage);
    } catch (error) {
      const errorMessage: AIMessage = {
        id: `msg_${Date.now()}_error`,
        role: 'system',
        content: 'I encountered an issue. Please try again.',
        timestamp: new Date(),
      };
      addChatMessage(errorMessage);
    } finally {
      setAIThinking(false);
    }
  };

  const quickActions = [
    { id: 'summarize', label: 'Summarize', icon: '📝' },
    { id: 'extract', label: 'Extract Data', icon: '🔍' },
    { id: 'compare', label: 'Compare', icon: '⚖️' },
    { id: 'cite', label: 'Cite Sources', icon: '📚' },
  ];

  const handleQuickAction = async (actionId: string) => {
    let prompt = '';
    switch (actionId) {
      case 'summarize':
        prompt = 'Summarize this page concisely';
        break;
      case 'extract':
        prompt = 'Extract key data points from this page';
        break;
      case 'compare':
        prompt = 'Compare this with my recent research';
        break;
      case 'cite':
        prompt = 'Provide citations for this content';
        break;
    }

    setInputValue(prompt);
    inputRef.current?.focus();
  };

  if (!rightPanelExpanded) {
    return (
      <motion.button
        className="context-assistant-toggle"
        onClick={() => setRightPanelExpanded(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.05 }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M7 9h6M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </motion.button>
    );
  }

  return (
    <motion.aside
      className="context-assistant"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="assistant-header">
        <h3 className="assistant-title">Context</h3>
        <button
          className="assistant-close"
          onClick={() => setRightPanelExpanded(false)}
          title="Close"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Quick Actions */}
      {chatMessages.length === 0 && (
        <div className="quick-actions">
          {quickActions.map((action) => (
            <button
              key={action.id}
              className="quick-action-btn"
              onClick={() => handleQuickAction(action.id)}
            >
              <span className="action-icon">{action.icon}</span>
              <span className="action-label">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Chat Messages */}
      <div className="assistant-chat">
        <AnimatePresence>
          {chatMessages.map((message, index) => (
            <motion.div
              key={message.id}
              className={`chat-message ${message.role}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="message-content">{message.content}</div>
              {message.sources && message.sources.length > 0 && (
                <div className="message-sources">
                  {message.sources.map((source, i) => (
                    <a key={i} href={source} className="source-link" target="_blank" rel="noopener noreferrer">
                      Source {i + 1}
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isAIThinking && (
          <motion.div
            className="chat-message assistant thinking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="thinking-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </motion.div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="assistant-input-form">
        <input
          ref={inputRef}
          type="text"
          className="assistant-input"
          placeholder="Ask anything..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isAIThinking}
        />
        <button
          type="submit"
          className="assistant-send"
          disabled={!inputValue.trim() || isAIThinking}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M15 1L7 9m8-8l-6 14-2-6-6-2L15 1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </form>
    </motion.aside>
  );
};
