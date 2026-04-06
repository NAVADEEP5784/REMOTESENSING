import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Satellite, BarChart3, ArrowRight, Brain, Image, Layers } from 'lucide-react';
import './Home.css';

const PIPELINE_STEPS = [
  { icon: Satellite, label: 'Satellite Image' },
  { icon: Image, label: 'Image Preprocessing' },
  { icon: Brain, label: 'Deep CNN Model' },
  { icon: Layers, label: 'Land Cover Classification' },
  { icon: Brain, label: 'Grad-CAM Explanation' },
  { icon: BarChart3, label: 'Environmental Insights' },
];

const RESEARCH_ITEMS = [
  {
    title: 'Deep Learning Land Classification',
    desc: 'CNNs and transfer learning for accurate land use mapping from satellite imagery.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop',
  },
  {
    title: 'Satellite Image Processing',
    desc: 'Advanced preprocessing and augmentation techniques for remote sensing data.',
    image: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=400&h=250&fit=crop',
  },
  {
    title: 'Environmental Monitoring',
    desc: 'Real-time land cover change detection and environmental impact assessment.',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=250&fit=crop',
  },
];

const SAMPLE_CATEGORIES = [
  { name: 'Forest', image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=300&h=200&fit=crop', color: '#22c55e' },
  { name: 'Agriculture', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&h=200&fit=crop', color: '#eab308' },
  { name: 'River', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop', color: '#0ea5e9' },
  { name: 'Urban', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=300&h=200&fit=crop', color: '#8b5cf6' },
];

function Home() {
  return (
    <div className="home-page">
      {/* HERO */}
      <section className="hero-section">
        <div className="hero-bg">
          <div className="hero-gradient" />
          <div className="hero-grid" />
        </div>
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="hero-title">
            AI-Powered Satellite Intelligence Platform
          </h1>
          <p className="hero-subtitle">
            Deep Learning Analysis of Land Use & Land Cover from Satellite Imagery
          </p>
          <div className="hero-actions">
            <Link to="/upload" className="btn-primary">
              <Satellite size={20} />
              Analyze Satellite Image
            </Link>
            <Link to="/dashboard" className="btn-secondary">
              <BarChart3 size={20} />
              View Research Dashboard
            </Link>
          </div>
        </motion.div>
      </section>

      {/* AI PIPELINE */}
      <section className="pipeline-section">
        <h2 className="section-title">AI Analysis Pipeline</h2>
        <motion.div
          className="pipeline-flow"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {PIPELINE_STEPS.map((step, i) => (
            <motion.div
              key={step.label}
              className="pipeline-step"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="pipeline-icon">
                <step.icon size={24} />
              </div>
              <span>{step.label}</span>
              {i < PIPELINE_STEPS.length - 1 && (
                <div className="pipeline-arrow">↓</div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* SAMPLE DATA */}
      <section className="sample-section">
        <h2 className="section-title">Sample Land Cover Categories</h2>
        <div className="sample-grid">
          {SAMPLE_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.name}
              className="sample-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="sample-img" style={{ borderColor: cat.color }}>
                <img src={cat.image} alt={cat.name} />
              </div>
              <span className="sample-label">{cat.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* RESEARCH */}
      <section className="research-section">
        <h2 className="section-title">Research Updates</h2>
        <div className="research-grid">
          {RESEARCH_ITEMS.map((item, i) => (
            <motion.article
              key={item.title}
              className="research-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="research-img">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="research-body">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
