import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, verifyToken, getToken } from '../api';

const AuthContext = createContext(null);
const AUTH_KEY = 'authToken';

function persistToken(token) {
  localStorage.setItem(AUTH_KEY, token);
  localStorage.removeItem('adminToken');
}

function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem('adminToken');
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    verifyToken()
      .then((r) => {
        if (r.valid && r.user) setUser(r.user);
        else clearAuth();
      })
      .catch(clearAuth)
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await apiLogin(email, password);
    persistToken(res.token);
    setUser(res.user);
    return res;
  };

  const register = async (email, password, name) => {
    const res = await apiRegister(email, password, name);
    persistToken(res.token);
    setUser(res.user);
    return res;
  };

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
