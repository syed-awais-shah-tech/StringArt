/**
 * App.jsx — Root application component
 * Layout: header | sidebar (controls) | main (upload + canvas)
 */
import React, { useState, useEffect } from 'react';
import ControlPanel, { getActiveColors } from './components/ControlPanel.jsx';
import ImageUpload from './components/ImageUpload.jsx';
import CanvasPreview from './components/CanvasPreview.jsx';
import GenerateButton from './components/GenerateButton.jsx';
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

  // Sync feature highlight colors into params.colors
  useEffect(() => {
    const colors = getActiveColors(params.featureHighlight);
    setParam('colors', colors);
  }, [params.featureHighlight]); // eslint-disable-line react-hooks/exhaustive-deps

  // Show toast on error or done
  useEffect(() => {
    if (status === 'error' && error) {
      addToast('error', `⚠️ ${error}`);
    }
    if (status === 'done') {
      addToast('success', '✅ Sequence file downloaded!');
    }
  }, [status, error]);

  function addToast(type, msg) {
    const id = Date.now();
    setToasts((t) => [...t, { id, type, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }

  return (
    <div className="app">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="app-header">
        <div className="app-logo">
          <div className="app-logo-icon">🧵</div>
          <span className="app-logo-text">StringArt</span>
          <span className="app-logo-badge">ERN Stack</span>
        </div>
        <div className="app-header-actions">
          <span>Thread Art Generator</span>
          <span style={{ color: 'var(--border-subtle)' }}>·</span>
          <a
            href="https://github.com/vxjnc/StringArt"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent-3)', textDecoration: 'none', fontSize: '0.85rem' }}
          >
            GitHub ↗
          </a>
        </div>
      </header>

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="sidebar">
        <ControlPanel params={params} setParam={setParam} />
      </aside>

      {/* ── Main Area ───────────────────────────────────────────────────── */}
      <main className="main-area">
        {/* Image Upload */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-icon">📁</div>
            <span className="panel-title">Source Image</span>
          </div>
          <ImageUpload
            imageFile={imageFile}
            imagePreviewUrl={imagePreviewUrl}
            onSelect={selectImage}
          />
        </div>

        {/* Generate Button + Status */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-icon">🚀</div>
            <span className="panel-title">Generate</span>
          </div>

          {/* Hint about processing time */}
          <div style={{
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            marginBottom: 'var(--spacing-md)',
            lineHeight: 1.5,
          }}>
            ⏱️ Generation runs on the Node.js server. Time depends on nails ×
            max-lines × threads. Suggested: 200 nails, 3 000 lines.
          </div>

          <GenerateButton
            status={status}
            stats={stats}
            onGenerate={generate}
            onCancel={cancel}
            onDownload={downloadSequence}
            hasImage={!!imageFile}
          />
        </div>

        {/* Canvas Preview */}
        <CanvasPreview previewData={previewData} />
      </main>

      {/* ── Toast Notifications ──────────────────────────────────────────── */}
      <div className="toast-container" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
