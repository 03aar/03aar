import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store';
import { AIService } from '../services/ai';
import '../styles/WriteMode.css';

export const WriteMode: React.FC = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('Untitled Document');
  const [isEditing, setIsEditing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { currentSession, updateSession } = useAppStore();

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);

    if (currentSession) {
      updateSession(currentSession.id, { content: e.target.value });
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);

    if (currentSession) {
      updateSession(currentSession.id, { title: e.target.value });
    }
  };

  const handleAIAssist = async (action: string) => {
    const selection = window.getSelection()?.toString() || content;

    let prompt = '';
    switch (action) {
      case 'improve':
        prompt = `Improve this text while maintaining its meaning: ${selection}`;
        break;
      case 'shorten':
        prompt = `Make this text more concise: ${selection}`;
        break;
      case 'expand':
        prompt = `Expand on this text with more details: ${selection}`;
        break;
      case 'tone':
        prompt = `Adjust the tone of this text to be more professional: ${selection}`;
        break;
    }

    const result = await AIService.assistWriting(prompt);
    setAiSuggestion(result);
  };

  const applySuggestion = () => {
    if (aiSuggestion) {
      setContent(content + '\n\n' + aiSuggestion);
      setAiSuggestion('');
    }
  };

  const exportDocument = (format: 'txt' | 'md') => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="write-mode">
      {/* Toolbar */}
      <div className="write-toolbar">
        <input
          type="text"
          className="document-title"
          value={title}
          onChange={handleTitleChange}
          placeholder="Document title..."
        />

        <div className="toolbar-actions">
          <div className="ai-assists">
            <button className="assist-btn" onClick={() => handleAIAssist('improve')} title="Improve">
              ✨ Improve
            </button>
            <button className="assist-btn" onClick={() => handleAIAssist('shorten')} title="Shorten">
              ✂️ Shorten
            </button>
            <button className="assist-btn" onClick={() => handleAIAssist('expand')} title="Expand">
              📝 Expand
            </button>
            <button className="assist-btn" onClick={() => handleAIAssist('tone')} title="Adjust Tone">
              🎯 Tone
            </button>
          </div>

          <div className="export-actions">
            <button className="export-btn" onClick={() => exportDocument('txt')}>
              Export TXT
            </button>
            <button className="export-btn" onClick={() => exportDocument('md')}>
              Export MD
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="write-editor-container">
        <motion.div
          className="write-editor"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <textarea
            ref={textareaRef}
            className="editor-textarea"
            placeholder="Begin writing..."
            value={content}
            onChange={handleContentChange}
            onFocus={() => setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
            spellCheck
          />

          {/* Word Count */}
          <div className="editor-stats">
            <span>{content.split(/\s+/).filter(Boolean).length} words</span>
            <span>{content.length} characters</span>
          </div>
        </motion.div>

        {/* AI Suggestion Panel */}
        {aiSuggestion && (
          <motion.div
            className="ai-suggestion-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="suggestion-header">
              <h4>AI Suggestion</h4>
              <button
                className="suggestion-close"
                onClick={() => setAiSuggestion('')}
              >
                ✕
              </button>
            </div>
            <div className="suggestion-content">
              {aiSuggestion}
            </div>
            <div className="suggestion-actions">
              <button className="apply-btn" onClick={applySuggestion}>
                Apply
              </button>
              <button className="dismiss-btn" onClick={() => setAiSuggestion('')}>
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Muse Assistant Hint */}
      {!isEditing && content.length === 0 && (
        <motion.div
          className="muse-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
        >
          <p>Start typing, or ask the Context Assistant for inspiration</p>
        </motion.div>
      )}
    </div>
  );
};
