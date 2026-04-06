import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AnalysisContext = createContext(null);
const HISTORY_KEY = 'satellite-analysis-history';
const MAX_HISTORY = 50;

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(list) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, MAX_HISTORY)));
  } catch {}
}

export function AnalysisProvider({ children }) {
  const [analysis, setAnalysis] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [history, setHistory] = useState(loadHistory);

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const clearAnalysis = () => {
    setAnalysis(null);
    setOriginalImage(null);
  };

  const addToHistory = useCallback((analysisData, imgDataUrl) => {
    const topClass = analysisData?.classification?.[0]?.class || 'Unknown';
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const item = {
      id,
      timestamp: Date.now(),
      topClass,
      analysis: analysisData,
      thumbnail: imgDataUrl,
    };
    setHistory((h) => [item, ...h.filter((x) => x.id !== id)]);
  }, []);

  const loadFromHistory = useCallback((item) => {
    setAnalysis(item.analysis);
    setOriginalImage(item.thumbnail);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return (
    <AnalysisContext.Provider
      value={{
        analysis,
        setAnalysis,
        originalImage,
        setOriginalImage,
        clearAnalysis,
        history,
        addToHistory,
        loadFromHistory,
        clearHistory,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error('useAnalysis must be used within AnalysisProvider');
  return ctx;
}

export function useAnalysisHistory() {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error('useAnalysisHistory must be used within AnalysisProvider');
  return {
    history: ctx.history || [],
    addToHistory: ctx.addToHistory,
    loadFromHistory: ctx.loadFromHistory,
    clearHistory: ctx.clearHistory,
  };
}
