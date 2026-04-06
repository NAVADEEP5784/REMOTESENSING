import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HelpCircle, Upload, BarChart3, MessageCircle, Shield, Book } from 'lucide-react';
import './Help.css';

export default function Help() {
  return (
    <div className="help-page">
      <div className="help-inner">
        <h1 className="help-title"><HelpCircle size={28} /> Help & FAQ</h1>

        <motion.section
          className="help-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2>Getting Started</h2>
          <p>
            Upload a satellite or aerial image on the <Link to="/upload">Analyze</Link> page.
            The AI will classify land cover (10 EuroSAT classes) and run object detection.
          </p>
        </motion.section>

        <motion.section
          className="help-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <h2>Features</h2>
          <ul className="help-features">
            <li><Upload size={18} /> <strong>Single & Batch Upload</strong> – Analyze one or multiple images at once</li>
            <li><BarChart3 size={18} /> <strong>Results & Export</strong> – Export as JSON, CSV, or PDF; download annotated images</li>
            <li><MessageCircle size={18} /> <strong>AI Chatbot</strong> – Ask questions about your analysis (requires OpenAI API)</li>
            <li><Book size={18} /> <strong>History</strong> – Past analyses saved in your browser</li>
            <li><Shield size={18} /> <strong>Admin</strong> – Login to view upload stats (admin@satellite.local / admin123)</li>
          </ul>
        </motion.section>

        <motion.section
          className="help-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2>FAQ</h2>
          <div className="faq-list">
            <div className="faq-item">
              <strong>Why does analysis fail?</strong>
              <p>Ensure the AI service (Python FastAPI on port 8000) and backend (Node on port 5000) are running.</p>
            </div>
            <div className="faq-item">
              <strong>Supported image formats?</strong>
              <p>JPG, PNG, WebP, GIF, BMP. Max 20MB per file.</p>
            </div>
            <div className="faq-item">
              <strong>How to change admin password?</strong>
              <p>Set ADMIN_PASSWORD in backend/.env and restart the backend.</p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
