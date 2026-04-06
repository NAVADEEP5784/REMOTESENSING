import React, { useState, useRef, useEffect } from 'react';
import { useAnalysis } from '../context/AnalysisContext.jsx';
import { chat } from '../api';
import './Chatbot.css';

function Chatbot() {
  const { analysis } = useAnalysis();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input;
    if (!msg.trim()) return;

    setInput('');
    setMessages((m) => [...m, { role: 'user', content: msg }]);
    setLoading(true);
    setError(null);

    try {
      const { reply } = await chat(
        msg,
        analysis?.classification || [],
        analysis?.detections || []
      );
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          'Failed to get response. Check OPENAI_API_KEY.'
      );
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: 'Sorry, I could not process your request. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleExplain = () => {
    sendMessage('Explain these analysis results in simple terms.');
  };

  return (
    <div className="chatbot-page">
      <div className="chatbot-inner">
      <h1>AI Chatbot</h1>
      <p className="chatbot-desc">
        Ask questions about your satellite image analysis. The AI has context
        from classification and object detection.
      </p>

      {analysis && (
        <div className="quick-action">
          <button onClick={handleExplain} className="btn-quick">
            Explain Results
          </button>
        </div>
      )}

      {!analysis && (
        <p className="no-context">
          No analysis context. Upload and analyze an image first, then return
          here.
        </p>
      )}

      <div className="chat-container">
        <div className="messages">
          {messages.length === 0 && (
            <div className="empty-state">
              <p>Ask anything about your analysis...</p>
              <p className="hint">e.g. "What land types dominate?" or "Explain the detections"</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`message ${m.role}`}>
              <span className="message-role">
                {m.role === 'user' ? 'You' : 'AI'}
              </span>
              <p>{m.content}</p>
            </div>
          ))}
          {loading && (
            <div className="message assistant">
              <span className="message-role">AI</span>
              <p className="typing">Thinking...</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {error && <p className="chat-error">{error}</p>}

        <form
          className="chat-input-wrap"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the analysis..."
            disabled={loading}
            className="chat-input"
          />
          <button type="submit" disabled={loading} className="chat-send">
            Send
          </button>
        </form>
      </div>
      </div>
    </div>
  );
}

export default Chatbot;
