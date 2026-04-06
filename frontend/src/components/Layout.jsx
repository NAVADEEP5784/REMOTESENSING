import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Satellite, Moon, Sun, Shield, User, History, Settings, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Layout.css';

function Layout({ children }) {
  const location = useLocation();
  const { user } = useAuth();
  const { theme, toggle } = useTheme();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/upload', label: 'Analyze' },
    { path: '/results', label: 'Results' },
    { path: '/history', label: 'History' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/chat', label: 'Chatbot' },
    { path: '/settings', label: 'Settings' },
    { path: '/help', label: 'Help' },
  ];

  return (
    <div className="layout">
      <header className="header">
        <Link to="/" className="logo">
          <Satellite className="logo-icon" size={24} />
          Satellite Intelligence
        </Link>
        <nav className="nav">
          {navItems.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${location.pathname === path ? 'active' : ''}`}
            >
              {label}
            </Link>
          ))}
          <button className="theme-toggle" onClick={toggle} title="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {user ? (
            <>
              <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>
                <User size={18} /> Profile
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
                  <Shield size={18} /> Admin
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>Login</Link>
              <Link to="/register" className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}>Register</Link>
            </>
          )}
        </nav>
      </header>
      <main className="main">{children}</main>
    </div>
  );
}

export default Layout;
