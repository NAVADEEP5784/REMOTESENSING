import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Cell,
} from 'recharts';
import { Activity, Target, Database, Cpu, TrendingUp } from 'lucide-react';
import './Dashboard.css';

// Demo data (backend doesn't provide - UI only)
const ACCURACY_DATA = [
  { epoch: 1, train: 90.5, val: 96.3 },
  { epoch: 2, train: 95.3, val: 96.4 },
  { epoch: 3, train: 96.2, val: 96.4 },
  { epoch: 4, train: 96.8, val: 96.9 },
  { epoch: 5, train: 97.3, val: 97.0 },
];

const LOSS_DATA = [
  { epoch: 1, loss: 0.31 },
  { epoch: 2, loss: 0.14 },
  { epoch: 3, loss: 0.12 },
  { epoch: 4, loss: 0.10 },
  { epoch: 5, loss: 0.08 },
];

const CLASS_DISTRIBUTION = [
  { name: 'AnnualCrop', count: 3000, fill: '#00e5b0' },
  { name: 'Forest', count: 2700, fill: '#22c55e' },
  { name: 'Herbaceous', count: 2700, fill: '#84cc16' },
  { name: 'Highway', count: 2700, fill: '#64748b' },
  { name: 'Industrial', count: 2700, fill: '#f97316' },
  { name: 'Pasture', count: 2700, fill: '#a3e635' },
  { name: 'PermanentCrop', count: 2700, fill: '#eab308' },
  { name: 'Residential', count: 2700, fill: '#8b5cf6' },
  { name: 'River', count: 2700, fill: '#0ea5e9' },
  { name: 'SeaLake', count: 2700, fill: '#06b6d4' },
];

const F1_DATA = [
  { class: 'Forest', f1: 0.98 },
  { class: 'Residential', f1: 0.96 },
  { class: 'River', f1: 0.95 },
  { class: 'Agriculture', f1: 0.94 },
  { class: 'Industrial', f1: 0.92 },
  { class: 'Highway', f1: 0.90 },
];

const ROC_DATA = [
  { fpr: 0, tpr: 0 },
  { fpr: 0.1, tpr: 0.85 },
  { fpr: 0.2, tpr: 0.92 },
  { fpr: 0.3, tpr: 0.95 },
  { fpr: 0.4, tpr: 0.97 },
  { fpr: 0.5, tpr: 0.98 },
  { fpr: 0.6, tpr: 0.99 },
  { fpr: 0.7, tpr: 0.995 },
  { fpr: 0.8, tpr: 1 },
  { fpr: 1, tpr: 1 },
];

const STAT_CARDS = [
  { icon: Target, label: 'Model Accuracy', value: '97.04%', color: '#00e5b0' },
  { icon: Activity, label: 'Prediction Confidence', value: '96.5%', color: '#0ea5e9' },
  { icon: Database, label: 'Dataset Size', value: '27,000', color: '#8b5cf6' },
  { icon: Cpu, label: 'Model Type', value: 'ResNet18', color: '#f97316' },
];

function Dashboard() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-inner">
      <h1 className="dashboard-title">Analytics Dashboard</h1>

      <div className="stat-cards">
        {STAT_CARDS.map((card, i) => (
          <motion.div
            key={card.label}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <div className="stat-icon" style={{ color: card.color }}>
              <card.icon size={28} />
            </div>
            <span className="stat-label">{card.label}</span>
            <span className="stat-value">{card.value}</span>
          </motion.div>
        ))}
      </div>

      <div className="charts-grid">
        <motion.div
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3>Training Accuracy</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={ACCURACY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" />
              <XAxis dataKey="epoch" stroke="#7a9ab8" />
              <YAxis stroke="#7a9ab8" />
              <Tooltip contentStyle={{ background: '#0d1520', border: '1px solid #1e2d42' }} />
              <Legend />
              <Line type="monotone" dataKey="train" stroke="#00e5b0" strokeWidth={2} name="Train" dot={{ fill: '#00e5b0' }} />
              <Line type="monotone" dataKey="val" stroke="#7b2cbf" strokeWidth={2} name="Validation" dot={{ fill: '#7b2cbf' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3>Training Loss</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={LOSS_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" />
              <XAxis dataKey="epoch" stroke="#7a9ab8" />
              <YAxis stroke="#7a9ab8" />
              <Tooltip contentStyle={{ background: '#0d1520', border: '1px solid #1e2d42' }} />
              <Line type="monotone" dataKey="loss" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="chart-card wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3>Class Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={CLASS_DISTRIBUTION} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" />
              <XAxis type="number" stroke="#7a9ab8" />
              <YAxis type="category" dataKey="name" stroke="#7a9ab8" width={90} />
              <Tooltip contentStyle={{ background: '#0d1520', border: '1px solid #1e2d42' }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {CLASS_DISTRIBUTION.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3>F1 Score by Class</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={F1_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" />
              <XAxis dataKey="class" stroke="#7a9ab8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#7a9ab8" domain={[0, 1]} />
              <Tooltip contentStyle={{ background: '#0d1520', border: '1px solid #1e2d42' }} />
              <Bar dataKey="f1" fill="#00e5b0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3>ROC Curve</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={ROC_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3f5f" />
              <XAxis dataKey="fpr" stroke="#7a9ab8" />
              <YAxis stroke="#7a9ab8" />
              <Tooltip contentStyle={{ background: '#0d1520', border: '1px solid #1e2d42' }} />
              <Line type="monotone" dataKey="tpr" stroke="#7b2cbf" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
      </div>
    </div>
  );
}

export default Dashboard;
