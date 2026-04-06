import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload as UploadIcon, Loader2, Layers } from 'lucide-react';
import { useAnalysis } from '../context/AnalysisContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { analyzeImage } from '../api';
import './Upload.css';

function Upload() {
  const navigate = useNavigate();
  const { setAnalysis, setOriginalImage, addToHistory } = useAnalysis();
  const { success, error: toastError } = useToast();
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [batchMode, setBatchMode] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    setError(null);
    if (selected && selected.type.startsWith('image/')) {
      setFile(selected);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(selected);
    } else if (selected) {
      setError('Please select an image file (JPG, PNG, etc.)');
    }
  };

  const handleBatchFileChange = (e) => {
    const selected = Array.from(e.target.files || []).filter((f) => f.type.startsWith('image/'));
    setError(null);
    setFiles(selected);
    if (selected.length > 0) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(selected[0]);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (batchMode && files.length === 0) {
      setError('Please select images first');
      return;
    }
    if (!batchMode && !file) {
      setError('Please select an image first');
      return;
    }

    const toProcess = batchMode ? files : [file];
    setLoading(true);
    setError(null);
    setBatchProgress({ current: 0, total: toProcess.length });

    let lastResult = null;
    let lastPreview = null;

    for (let i = 0; i < toProcess.length; i++) {
      setBatchProgress({ current: i + 1, total: toProcess.length });
      try {
        const result = await analyzeImage(toProcess[i]);
        const reader = new FileReader();
        lastPreview = await new Promise((res) => {
          reader.onload = () => res(reader.result);
          reader.readAsDataURL(toProcess[i]);
        });
        lastResult = result;
        addToHistory(result, lastPreview);
      } catch (err) {
        toastError(`Image ${i + 1} failed: ${err.response?.data?.error || err.message}`);
      }
    }

    setLoading(false);
    setBatchProgress({ current: 0, total: 0 });
    if (lastResult) {
      setAnalysis(lastResult);
      setOriginalImage(lastPreview);
      success(batchMode ? `Processed ${toProcess.length} image(s)` : 'Analysis complete');
      navigate('/results');
    } else if (!batchMode) {
      setError('Analysis failed. Ensure the AI service is running.');
    }
  };

  const handleClear = () => {
    setFile(null);
    setFiles([]);
    setPreview(null);
    setError(null);
  };

  const hasFiles = batchMode ? files.length > 0 : !!file;

  return (
    <motion.div
      className="upload-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="upload-inner">
      <h1>Analyze Satellite Image</h1>
      <p className="upload-desc">
        Upload a satellite or aerial image for deep learning land cover
        classification and object detection.
      </p>

      <div className="upload-mode-toggle">
        <button
          type="button"
          className={!batchMode ? 'active' : ''}
          onClick={() => { setBatchMode(false); handleClear(); }}
        >
          <UploadIcon size={18} /> Single
        </button>
        <button
          type="button"
          className={batchMode ? 'active' : ''}
          onClick={() => { setBatchMode(true); handleClear(); }}
        >
          <Layers size={18} /> Batch
        </button>
      </div>

      <form onSubmit={handleSubmit} className="upload-form">
        <motion.div
          className={`drop-zone ${preview ? 'has-preview' : ''} ${loading ? 'loading' : ''}`}
          onClick={() => !loading && document.getElementById(batchMode ? 'batch-input' : 'file-input').click()}
          whileHover={!loading ? { scale: 1.01 } : {}}
          whileTap={!loading ? { scale: 0.99 } : {}}
        >
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <input
            id="batch-input"
            type="file"
            accept="image/*"
            multiple
            onChange={handleBatchFileChange}
            style={{ display: 'none' }}
          />
          {loading ? (
            <div className="loading-state">
              <Loader2 className="spin" size={48} />
              <p>{batchMode && batchProgress.total > 1
                ? `Analyzing ${batchProgress.current}/${batchProgress.total}...`
                : 'Analyzing image...'}</p>
              <p className="loading-hint">Running CNN model & object detection</p>
            </div>
          ) : preview ? (
            <>
              <img src={preview} alt="Preview" className="preview-img" />
              {batchMode && files.length > 1 && (
                <span className="batch-badge">{files.length} images</span>
              )}
            </>
          ) : (
            <div className="drop-placeholder">
              <UploadIcon size={48} className="drop-icon" />
              <p>{batchMode ? 'Click to select multiple images' : 'Click or drag an image here'}</p>
              <p className="drop-hint">JPG, PNG, WebP supported</p>
            </div>
          )}
        </motion.div>

        {error && (
          <motion.p
            className="error-msg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.p>
        )}

        <div className="upload-actions">
          {hasFiles && !loading && (
            <button type="button" onClick={handleClear} className="btn-secondary">
              Clear
            </button>
          )}
          <button
            type="submit"
            disabled={!hasFiles || loading}
            className="btn-primary"
          >
            {loading ? 'Analyzing...' : batchMode ? `Analyze ${files.length} Image(s)` : 'Analyze Image'}
          </button>
        </div>
      </form>
      </div>
    </motion.div>
  );
}

export default Upload;
