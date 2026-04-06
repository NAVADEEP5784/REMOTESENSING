import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Profile.css';

export default function Profile() {
  const { user, logout } = useAuth();
  const { success } = useToast();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    success('Logged out');
    window.location.href = '/';
  };

  return (
    <div className="profile-page">
      <div className="profile-bg" />
      <motion.div
        className="profile-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="profile-avatar">
          <User size={48} />
        </div>
        <h1>{user.name || user.email}</h1>
        <p className="profile-role">
          {user.role === 'admin' ? (
            <><Shield size={18} /> Administrator</>
          ) : (
            <>User</>
          )}
        </p>

        <div className="profile-details">
          <div className="profile-row">
            <Mail size={20} />
            <span>{user.email}</span>
          </div>
          <div className="profile-row">
            <Shield size={20} />
            <span>{user.role === 'admin' ? 'Full access' : 'Standard access'}</span>
          </div>
        </div>

        <div className="profile-actions">
          {user.role === 'admin' && (
            <Link to="/admin" className="profile-link">Admin Dashboard</Link>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
}
