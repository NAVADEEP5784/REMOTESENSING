import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { History as HistoryIcon, Image, Trash2 } from 'lucide-react';
import { useAnalysisHistory } from '../context/AnalysisContext';
import './History.css';

export default function History() {
  const { history, loadFromHistory, clearHistory } = useAnalysisHistory();

  if (!history || history.length === 0) {
    return (
      <div className="history-page">
        <div className="history-inner">
          <h1 className="history-title"><HistoryIcon size={28} /> Analysis History</h1>
          <div className="history-empty">
            <Image size={48} />
            <h2>No analyses yet</h2>
            <p>Upload and analyze images to see them here</p>
            <Link to="/upload" className="cta-link">Upload Image</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="history-inner">
        <header className="history-header">
          <h1 className="history-title"><HistoryIcon size={28} /> Analysis History</h1>
          <button className="clear-btn" onClick={clearHistory}>
            <Trash2 size={18} /> Clear All
          </button>
        </header>
        <div className="history-grid">
          {history.map((item, i) => (
            <motion.div
              key={item.id}
              className="history-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="history-thumb">
                <img src={item.thumbnail} alt="Analysis" />
              </div>
              <div className="history-info">
                <span className="history-top-class">{item.topClass}</span>
                <span className="history-date">{new Date(item.timestamp).toLocaleString()}</span>
              </div>
              <Link to="/results" className="view-btn" onClick={() => loadFromHistory(item)}>
                View Results
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
