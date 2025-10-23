import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store';
import { AppMode } from '../types';
import '../styles/LeftRail.css';

interface NavItem {
  id: AppMode | 'history' | 'library' | 'settings';
  label: string;
  icon: JSX.Element;
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 10l7-7 7 7v8a1 1 0 01-1 1h-3v-5H7v5H4a1 1 0 01-1-1v-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'history',
    label: 'Sessions',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 3v14M13 3v14" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: 'library',
    label: 'Library',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 19V5a2 2 0 012-2h8a2 2 0 012 2v14M4 19H2m2 0h12m0 0h2m-2 0v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'memory',
    label: 'Memory',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L3 7v6c0 4 3 6 7 7 4-1 7-3 7-7V7l-7-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 1v2m0 14v2M19 10h-2M3 10H1m15.364-5.364l-1.414 1.414M5.05 14.95l-1.414 1.414m12.728 0l-1.414-1.414M5.05 5.05L3.636 3.636" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export const LeftRail: React.FC = () => {
  const { currentMode, setMode, leftRailExpanded, setLeftRailExpanded } = useAppStore();

  const handleNavClick = (id: string) => {
    if (id === 'home' || id === 'research' || id === 'write' || id === 'automate' || id === 'memory') {
      setMode(id as AppMode);
    }
  };

  return (
    <motion.aside
      className="left-rail"
      initial={false}
      animate={{
        width: leftRailExpanded ? 220 : 72,
      }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1.0] }}
      onMouseEnter={() => setLeftRailExpanded(true)}
      onMouseLeave={() => setLeftRailExpanded(false)}
    >
      <div className="left-rail-content">
        {/* Logo / Brand */}
        <div className="rail-brand">
          <div className="brand-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="2"/>
              <path d="M9 14h10M14 9v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <AnimatePresence>
            {leftRailExpanded && (
              <motion.span
                className="brand-name"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
              >
                Elysium
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Items */}
        <nav className="rail-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`rail-nav-item ${currentMode === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
              title={!leftRailExpanded ? item.label : undefined}
            >
              <span className="nav-icon">{item.icon}</span>
              <AnimatePresence>
                {leftRailExpanded && (
                  <motion.span
                    className="nav-label"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}
        </nav>

        {/* Spacer */}
        <div className="rail-spacer" />

        {/* User / Privacy Indicator */}
        <div className="rail-footer">
          <div className="privacy-indicator" title="Privacy: Local Only">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="3" fill="currentColor"/>
            </svg>
            <AnimatePresence>
              {leftRailExpanded && (
                <motion.span
                  className="privacy-label"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Local Mode
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};
