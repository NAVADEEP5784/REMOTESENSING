import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { AnalysisProvider } from './context/AnalysisContext.jsx';
import Layout from './components/Layout.jsx';
import Toast from './components/Toast.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Upload from './pages/Upload.jsx';
import Results from './pages/Results.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Chatbot from './pages/Chatbot.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import Admin from './pages/Admin.jsx';
import History from './pages/History.jsx';
import Settings from './pages/Settings.jsx';
import Help from './pages/Help.jsx';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <AnalysisProvider>
            <Layout>
              <Toast />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/results" element={<Results />} />
                <Route path="/history" element={<History />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/chat" element={<Chatbot />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/help" element={<Help />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </AnalysisProvider>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
