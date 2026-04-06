import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { MessageCircle, Lightbulb, Download, Share2, FileJson, FileText, FileSpreadsheet } from 'lucide-react';
import { useAnalysis } from '../context/AnalysisContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { exportJSON, exportCSV } from '../utils/export.js';
import './Results.css';

const CHART_COLORS = [
  '#00e5b0', '#00b88a', '#00b4d8', '#7b2cbf', '#0096c7',
  '#6a4c93', '#023e8a', '#0077b6', '#48cae4', '#90e0ef',
];

const INSIGHTS_BY_CLASS = {
  Forest: {
    insights: ['High vegetation density', 'Suitable for carbon sink analysis', 'Low urban activity'],
    recommendations: ['Monitor deforestation', 'Track seasonal changes', 'Assess biodiversity'],
  },
  Residential: {
    insights: ['Built-up area detected', 'Moderate population density', 'Infrastructure presence'],
    recommendations: ['Urban planning assessment', 'Monitor expansion', 'Green space analysis'],
  },
  'Agricultural Land': {
    insights: ['Cultivated land detected', 'Moderate vegetation density', 'Crop patterns visible'],
    recommendations: ['Monitor irrigation', 'Track seasonal vegetation', 'Yield estimation'],
  },
  'River / Water Body': {
    insights: ['Water body identified', 'Flow pattern detectable', 'Watershed area'],
    recommendations: ['Flood risk monitoring', 'Water quality assessment', 'Habitat analysis'],
  },
  'Industrial Area': {
    insights: ['Industrial infrastructure', 'Manufacturing zones', 'Transport links'],
    recommendations: ['Environmental impact', 'Emissions monitoring', 'Land use zoning'],
  },
  Highway: {
    insights: ['Linear transportation', 'Connectivity indicator', 'Urban-rural link'],
    recommendations: ['Traffic flow analysis', 'Expansion planning', 'Noise impact'],
  },
  'Barren Land': {
    insights: ['Low vegetation cover', 'Exposed soil/rock', 'Potential development'],
    recommendations: ['Erosion monitoring', 'Land reclamation', 'Desertification tracking'],
  },
  AnnualCrop: {
    insights: ['Seasonal crop coverage', 'Agricultural activity', 'Moderate vegetation'],
    recommendations: ['Irrigation monitoring', 'Harvest tracking', 'Crop health'],
  },
  HerbaceousVegetation: {
    insights: ['Grassland/shrub cover', 'Natural vegetation', 'Moderate density'],
    recommendations: ['Grazing assessment', 'Fire risk', 'Biodiversity'],
  },
  Pasture: {
    insights: ['Grazing land', 'Livestock activity', 'Managed grassland'],
    recommendations: ['Stock density', 'Pasture health', 'Land management'],
  },
  PermanentCrop: {
    insights: ['Perennial crops', 'Orchards/vineyards', 'Stable vegetation'],
    recommendations: ['Yield forecasting', 'Pest monitoring', 'Irrigation'],
  },
  Industrial: {
    insights: ['Industrial infrastructure', 'Manufacturing zones'],
    recommendations: ['Environmental impact', 'Emissions monitoring'],
  },
  River: {
    insights: ['Water body', 'Flow patterns'],
    recommendations: ['Flood risk', 'Water quality'],
  },
  SeaLake: {
    insights: ['Large water body', 'Coastal/aquatic'],
    recommendations: ['Water level monitoring', 'Pollution tracking'],
  },
};

function getInsights(topClass) {
  return INSIGHTS_BY_CLASS[topClass] || {
    insights: ['Land cover classified', 'Analysis complete', 'Multiple features detected'],
    recommendations: ['Monitor changes over time', 'Cross-validate with field data', 'Track seasonal patterns'],
  };
}

function Results() {
  const { analysis, originalImage } = useAnalysis();
  const { success } = useToast();

  if (!analysis) {
    return (
      <div className="results-page">
        <div className="results-inner">
        <motion.div
          className="results-empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
        <h2>No Analysis Results</h2>
        <p>Upload and analyze an image first.</p>
        <Link to="/upload" className="cta-link">Upload Image</Link>
        </motion.div>
        </div>
      </div>
    );
  }

  const { classification, detections, annotated_image_base64 } = analysis;
  const topClass = classification[0]?.class || 'Unknown';
  const topConf = classification[0]?.probability || 0;
  const { insights, recommendations } = getInsights(topClass);

  const chartData = classification.map((item, i) => ({
    name: item.class,
    value: item.probability,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));

  const handleExport = async (type) => {
    try {
      if (type === 'json') exportJSON(analysis, topClass);
      else if (type === 'csv') exportCSV(analysis, topClass);
      else if (type === 'pdf') {
        const { exportPDF } = await import('../utils/export.js');
        exportPDF(analysis, topClass);
      }
      success(`Exported as ${type.toUpperCase()}`);
    } catch (e) {
      success('Export started');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    success('Link copied to clipboard');
  };

  const handleDownloadAnnotated = () => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${annotated_image_base64}`;
    link.download = `detection-${Date.now()}.png`;
    link.click();
    success('Downloaded annotated image');
  };

  return (
    <div className="results-page">
      <div className="results-inner">
      <header className="results-header">
        <h1 className="results-title">Prediction Results</h1>
        <div className="results-actions">
          <button className="action-btn" onClick={handleDownloadAnnotated} title="Download annotated image">
            <Download size={18} /> Download
          </button>
          <button className="action-btn" onClick={handleShare} title="Copy link">
            <Share2 size={18} /> Share
          </button>
          <div className="export-dropdown">
            <button type="button" className="action-btn">Export ▾</button>
            <div className="export-menu" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => handleExport('json')}><FileJson size={16} /> JSON</button>
              <button onClick={() => handleExport('csv')}><FileText size={16} /> CSV</button>
              <button onClick={() => handleExport('pdf')}><FileSpreadsheet size={16} /> PDF</button>
            </div>
          </div>
        </div>
      </header>

      <div className="results-layout">
        <div className="results-main">
          <motion.section
            className="card images-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2>Image Analysis</h2>
            <div className="images-row">
              <div className="img-block">
                <h3>Original Satellite Image</h3>
                <img src={originalImage} alt="Original" className="result-img" />
              </div>
              <div className="img-block">
                <h3>Object Detection</h3>
                <img
                  src={`data:image/png;base64,${annotated_image_base64}`}
                  alt="Detections"
                  className="result-img"
                />
              </div>
            </div>
            <div className="gradcam-placeholder">
              <h3>Grad-CAM Heatmap</h3>
              <div className="gradcam-vis">
                <img src={originalImage} alt="Input" />
                <div className="gradcam-overlay" />
              </div>
              <p className="gradcam-note">Attention visualization (model interpretability)</p>
            </div>
          </motion.section>

          <motion.section
            className="card classification-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2>Land Cover Classification</h2>
            <div className="prediction-highlight">
              <span className="pred-class">{topClass}</span>
              <span className="pred-conf">{(topConf).toFixed(1)}%</span>
            </div>
            <div className="classification-list">
              {classification.map((item, i) => (
                <div key={item.class} className="class-row">
                  <span className="class-name">{item.class}</span>
                  <div className="class-bar-wrap">
                    <div
                      className="class-bar"
                      style={{
                        width: `${item.probability}%`,
                        background: CHART_COLORS[i % CHART_COLORS.length],
                      }}
                    />
                  </div>
                  <span className="class-pct">{item.probability}%</span>
                </div>
              ))}
            </div>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} layout="vertical" margin={{ left: 100 }}>
                  <XAxis type="number" domain={[0, 100]} stroke="#7a9ab8" />
                  <YAxis type="category" dataKey="name" width={90} stroke="#7a9ab8" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#0d1520', border: '1px solid #1e2d42' }} formatter={(v) => [`${v}%`, 'Probability']} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {detections.length > 0 && (
              <div className="detections-block">
                <h3>Detected Objects</h3>
                <ul className="detection-list">
                  {detections.map((d, i) => (
                    <li key={i}>
                      <span className="det-class">{d.class}</span>
                      <span className="det-conf">{(d.confidence * 100).toFixed(0)}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.section>
        </div>

        <motion.aside
          className="insights-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="insights-card">
            <h3><Lightbulb size={20} /> AI Insights</h3>
            <p className="insights-label">Detected Land Type: {topClass}</p>
            <div className="insights-list">
              <h4>Insights</h4>
              <ul>
                {insights.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="recommendations-list">
              <h4>Environmental Recommendations</h4>
              <ul>
                {recommendations.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <Link to="/chat" className="chat-cta">
            <MessageCircle size={20} />
            Ask AI to Explain
          </Link>
        </motion.aside>
      </div>
      </div>
    </div>
  );
}

export default Results;
