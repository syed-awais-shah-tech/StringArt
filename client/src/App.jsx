/**
 * App.jsx — Public Customer-Facing Business Website
 * Inspired by stringboard.co.uk
 */
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar.jsx';
import HeroGenerator from './components/HeroGenerator.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import Gallery from './components/Gallery.jsx';
import PricingPreview from './components/PricingPreview.jsx';
import FAQ from './components/FAQ.jsx';
import Footer from './components/Footer.jsx';
import { useStringArt } from './hooks/useStringArt.js';

export default function App() {
  const {
    params,
    setParam,
    imageFile,
    imagePreviewUrl,
    selectImage,
    status,
    error,
    generate,
    cancel,
    downloadSequence,
    previewData,
    stats,
  } = useStringArt();

  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, msg) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, type, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500);
  }, []);

  // Show toast notifications on error or completion
  useEffect(() => {
    if (status === 'error' && error) {
      addToast('error', error);
    }
    if (status === 'done') {
      addToast('success', 'Sequence file ready & downloaded!');
    }
  }, [status, error, addToast]);

  // Load example photo helper (e.g. from gallery or sample buttons)
  const handleLoadExample = async (type = 'portrait') => {
    try {
      const src = type === 'dog' ? '/gallery/dog_original.jpg' : '/gallery/input.png';
      const name = type === 'dog' ? 'golden-retriever-sample.jpg' : 'portrait-sample.png';
      const res = await fetch(src);
      const blob = await res.blob();
      const file = new File([blob], name, { type: blob.type || 'image/png' });
      selectImage(file);
    } catch (err) {
      console.error('Failed to load example photo', err);
    }
  };

  const handleUploadNavClick = () => {
    const el = document.getElementById('hero-file-input');
    if (el) {
      el.click();
    }
  };

  return (
    <div className="website-root">
      {/* 1. Header / Navbar */}
      <Navbar onUploadClick={handleUploadNavClick} />

      {/* 2. Hero Section + Interactive Generator */}
      <HeroGenerator
        params={params}
        setParam={setParam}
        imageFile={imageFile}
        imagePreviewUrl={imagePreviewUrl}
        onSelectImage={selectImage}
        status={status}
        error={error}
        generate={generate}
        cancel={cancel}
        downloadSequence={downloadSequence}
        previewData={previewData}
        stats={stats}
      />

      {/* 3. How It Works Section */}
      <HowItWorks />

      {/* 4. Examples / Gallery Section */}
      <Gallery onLoadExample={handleLoadExample} />

      {/* 5. Art, Kits & Offerings */}
      <PricingPreview />

      {/* 6. FAQ Section */}
      <FAQ />

      {/* 7. Footer */}
      <Footer />

      {/* Floating Toast Notification Container */}
      <div className="toast-container" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span className="toast-icon">
              {t.type === 'success' ? '✓' : '⚠️'}
            </span>
            <span className="toast-text">{t.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
