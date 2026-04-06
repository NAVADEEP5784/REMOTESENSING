import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Sun, Moon, Bell } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './Settings.css';

export default function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="settings-page">
      <div className="settings-inner">
        <h1 className="settings-title"><SettingsIcon size={28} /> Settings</h1>

        <motion.section
          className="settings-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2>Appearance</h2>
          <div className="setting-row">
            <span>Theme</span>
            <div className="theme-options">
              <button
                className={theme === 'dark' ? 'active' : ''}
                onClick={() => setTheme('dark')}
              >
                <Moon size={18} /> Dark
              </button>
              <button
                className={theme === 'light' ? 'active' : ''}
                onClick={() => setTheme('light')}
              >
                <Sun size={18} /> Light
              </button>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="settings-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2>Data & Storage</h2>
          <p className="settings-desc">
            Analysis history is stored locally in your browser. Use the History page to view past analyses.
          </p>
        </motion.section>
      </div>
    </div>
  );
}
