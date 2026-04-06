import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, HardDrive, FileImage, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getAdminStats, getAdminUploads } from '../api';
import './Admin.css';

export default function Admin() {
  const { user, logout } = useAuth();
  const { success } = useToast();
  const [stats, setStats] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminStats(), getAdminUploads()])
      .then(([s, u]) => {
        setStats(s);
        setUploads(u.files || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    success('Logged out');
    window.location.href = '/';
  };

  return (
    <div className="admin-page">
      <div className="admin-inner">
        <motion.header
          className="admin-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="admin-title-row">
            <h1><Shield size={28} /> Admin Dashboard</h1>
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={18} /> Logout
            </button>
          </div>
          <p>Welcome, {user?.email}</p>
        </motion.header>

        {loading ? (
          <div className="admin-loading">Loading...</div>
        ) : (
          <>
            <motion.div
              className="admin-stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="stat-box">
                <HardDrive size={32} />
                <div>
                  <span className="stat-value">{stats?.uploads ?? 0}</span>
                  <span className="stat-label">Uploaded Images</span>
                </div>
              </div>
              <div className="stat-box">
                <FileImage size={32} />
                <div>
                  <span className="stat-value">{stats?.totalSizeMB ?? '0'} MB</span>
                  <span className="stat-label">Storage Used</span>
                </div>
              </div>
            </motion.div>

            <motion.section
              className="admin-uploads"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2>Recent Uploads</h2>
              {uploads.length === 0 ? (
                <p className="no-uploads">No uploads yet</p>
              ) : (
                <div className="uploads-table">
                  {uploads.slice(0, 20).map((f, i) => (
                    <div key={i} className="upload-row">
                      <span className="upload-name">{f.name}</span>
                      <span className="upload-size">{(f.size / 1024).toFixed(1)} KB</span>
                      <span className="upload-date">
                        {f.mtime ? new Date(f.mtime).toLocaleString() : '-'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.section>
          </>
        )}
      </div>
    </div>
  );
}
