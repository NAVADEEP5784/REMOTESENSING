import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import './Toast.css';

export default function Toast() {
  const { toasts } = useToast();

  const icon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={18} />;
      case 'error': return <XCircle size={18} />;
      default: return <Info size={18} />;
    }
  };

  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            className={`toast toast-${t.type}`}
            initial={{ opacity: 0, y: -20, x: '100%' }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
          >
            {icon(t.type)}
            <span>{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
