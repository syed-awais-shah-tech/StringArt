import React, { useState, useRef } from 'react';
import CompareSlider from './CompareSlider.jsx';
import CanvasPreview from './CanvasPreview.jsx';

/**
 * HeroGenerator
 * Customer-facing hero section with instant string art previewer inspired by stringboard.co.uk.
 */
export default function HeroGenerator({
  params,
  setParam,
  imageFile,
  imagePreviewUrl,
  onSelectImage,
  status,
  error,
  generate,
  cancel,
  downloadSequence,
  previewData,
  stats,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activePreset, setActivePreset] = useState('mono'); // 'mono' or 'color'
  const fileInputRef = useRef(null);

  const isRunning = status === 'running';
  const isDone = status === 'done' && previewData;

  // Handle Preset change
  const handlePresetSelect = (preset) => {
    setActivePreset(preset);
    if (preset === 'mono') {
      setParam('featureHighlight', 'mono');
      setParam('colors', [[0, 0, 0]]);
    } else {
      setParam('featureHighlight', 'none');
      setParam('colors', [
        [0, 0, 0],
        [255, 255, 255],
        [255, 0, 0],
        [0, 255, 0],
        [0, 0, 255],
        [255, 0, 255],
        [0, 255, 255],
        [255, 255, 0],
      ]);
    }
  };

  // Helper to load sample image directly into engine
  const handleLoadSample = async (type = 'portrait') => {
    try {
      const src = type === 'dog' ? '/gallery/dog_original.jpg' : '/gallery/input.png';
      const filename = type === 'dog' ? 'golden-retriever-sample.jpg' : 'portrait-sample.png';
      const response = await fetch(src);
      const blob = await response.blob();
      const file = new File([blob], filename, { type: blob.type || 'image/png' });
      onSelectImage(file);
    } catch (e) {
      console.error('Failed to load sample image', e);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onSelectImage(file);
    }
  };

  return (
    <section className="hero-section" id="preview-studio">
      <div className="hero-container">
        {/* Hero Copy */}
        <div className="hero-header-text">
          <div className="hero-pill-badge">
            <span className="hero-pill-dot"></span>
            Handmade String Art · 100% Tensioned Thread
          </div>
          <h1 className="hero-title">Turn your photo into string art</h1>
          <p className="hero-subtitle">
            Upload any photo of a pet, person, or cherished memory. Our custom engine calculates
            over 3,000 continuous thread paths across 200 perimeter nails to weave a striking art piece without ink or paint.
          </p>
        </div>

        {/* Generator Studio Card */}
        <div className="generator-card">
          {/* Stepper Header */}
          <div className="stepper-nav">
            <div className="stepper-track"></div>
            <div className="stepper-step">
              <div className={`stepper-node ${!imageFile && !isDone ? 'active' : 'completed'}`}>
                {!imageFile && !isDone ? '1' : '✓'}
              </div>
              <span className={`stepper-label ${!imageFile && !isDone ? 'active' : ''}`}>1. Upload</span>
            </div>

            <div className="stepper-step">
              <div
                className={`stepper-node ${
                  isRunning ? 'active' : isDone ? 'completed' : imageFile ? 'ready' : ''
                }`}
              >
                {isRunning ? (
                  <span className="spinner-inline"></span>
                ) : isDone ? (
                  '✓'
                ) : (
                  '2'
                )}
              </div>
              <span className={`stepper-label ${isRunning ? 'active' : ''}`}>2. Generate</span>
            </div>

            <div className="stepper-step">
              <div className={`stepper-node ${isDone ? 'active completed' : ''}`}>
                {isDone ? '★' : '3'}
              </div>
              <span className={`stepper-label ${isDone ? 'active' : ''}`}>3. Preview</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="studio-alert error">
              <span className="studio-alert-icon">⚠️</span>
              <div>
                <strong>Generation Notice:</strong> {error}
              </div>
            </div>
          )}

          {/* ── STATE 1: No photo uploaded yet ── */}
          {!imageFile && !isDone && (
            <div className="studio-idle-view">
              {/* Interactive Before/After Preview */}
              <div className="studio-hero-preview">
                <CompareSlider
                  originalSrc="/gallery/dog_original.jpg"
                  stringArtSrc="/gallery/dog_stringart.jpg"
                  originalLabel="Original Dog Photo"
                  stringArtLabel="Woven String Art"
                />
                <span className="preview-caption">
                  Drag the slider to compare original photo vs string art piece
                </span>
              </div>

              {/* Upload Drop Zone */}
              <div className="studio-upload-box">
                <input
                  ref={fileInputRef}
                  id="hero-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  style={{ display: 'none' }}
                />

                <label
                  htmlFor="hero-file-input"
                  className="upload-drop-target"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files?.[0]) {
                      onSelectImage(e.dataTransfer.files[0]);
                    }
                  }}
                >
                  <div className="upload-icon-circle">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 16V8M12 8l-3.5 3.5M12 8l3.5 3.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4 16.5v1.2A2.3 2.3 0 006.3 20h11.4a2.3 2.3 0 002.3-2.3v-1.2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <span className="upload-main-text">Upload your photo</span>
                  <span className="upload-sub-text">
                    JPEG, PNG, or WEBP · Processed safely on device
                  </span>
                </label>

                {/* Example Photo Triggers */}
                <div className="sample-triggers">
                  <span className="sample-triggers-label">Or try an example:</span>
                  <div className="sample-buttons">
                    <button
                      type="button"
                      className="btn-sample"
                      onClick={() => handleLoadSample('dog')}
                    >
                      <img src="/gallery/dog_original.jpg" alt="Golden Retriever" className="sample-thumb" />
                      Golden Retriever
                    </button>
                    <button
                      type="button"
                      className="btn-sample"
                      onClick={() => handleLoadSample('portrait')}
                    >
                      <img src="/gallery/input.png" alt="Portrait Sample" className="sample-thumb" />
                      Portrait Model
                    </button>
                  </div>
                </div>
              </div>

              {/* Photo Advice Tip */}
              <div className="studio-tip-card">
                <span className="studio-tip-icon">📸</span>
                <div className="studio-tip-body">
                  <div className="studio-tip-title">Photo recommendation</div>
                  <div className="studio-tip-desc">
                    High-contrast portraits with good lighting and simple, clutter-free backgrounds produce the crispest string art definition.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STATE 2: Image is loaded, ready to configure and generate ── */}
          {imageFile && !isDone && (
            <div className="studio-config-view">
              {/* Image Preview & Change */}
              <div className="selected-photo-card">
                <div className="selected-photo-preview">
                  <img src={imagePreviewUrl} alt="Selected source" />
                </div>
                <div className="selected-photo-details">
                  <div className="selected-photo-name">{imageFile.name}</div>
                  <div className="selected-photo-size">
                    {(imageFile.size / 1024).toFixed(1)} KB · Ready for threading
                  </div>
                  <label htmlFor="hero-file-input" className="btn-link-action">
                    Replace photo
                  </label>
                </div>
              </div>

              {/* Simplified Style Selector */}
              <div className="style-selector-group">
                <label className="group-label">Thread Style</label>
                <div className="style-options-grid">
                  <button
                    type="button"
                    className={`style-option-card ${activePreset === 'mono' ? 'selected' : ''}`}
                    onClick={() => handlePresetSelect('mono')}
                  >
                    <div className="style-option-indicator">
                      <span className="style-swatch-mono"></span>
                    </div>
                    <div className="style-option-info">
                      <div className="style-option-title">Monochrome Classic</div>
                      <div className="style-option-sub">
                        Single high-tension black thread (Recommended)
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`style-option-card ${activePreset === 'color' ? 'selected' : ''}`}
                    onClick={() => handlePresetSelect('color')}
                  >
                    <div className="style-option-indicator">
                      <span className="style-swatch-color"></span>
                    </div>
                    <div className="style-option-info">
                      <div className="style-option-title">Color Threads</div>
                      <div className="style-option-sub">
                        Multi-color thread palette for depth and warmth
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Optional Collapsible Settings */}
              <div className="advanced-settings-toggle">
                <button
                  type="button"
                  className="btn-accordion-toggle"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  <span>{showAdvanced ? '▼' : '▶'} Advanced Weaving Parameters</span>
                  <span className="badge-tag">Optional</span>
                </button>

                {showAdvanced && (
                  <div className="advanced-settings-panel">
                    <div className="param-item">
                      <div className="param-item-header">
                        <label htmlFor="slider-nails">Boundary Nails</label>
                        <span className="param-val">{params.numNails}</span>
                      </div>
                      <input
                        id="slider-nails"
                        type="range"
                        min="100"
                        max="360"
                        step="10"
                        value={params.numNails}
                        onChange={(e) => setParam('numNails', parseInt(e.target.value))}
                        className="studio-slider"
                      />
                      <span className="param-hint">More nails provide finer facial curve accuracy.</span>
                    </div>

                    <div className="param-item">
                      <div className="param-item-header">
                        <label htmlFor="slider-lines">Thread Lines (Density)</label>
                        <span className="param-val">{params.maxIterations}</span>
                      </div>
                      <input
                        id="slider-lines"
                        type="range"
                        min="1500"
                        max="5000"
                        step="250"
                        value={params.maxIterations}
                        onChange={(e) => setParam('maxIterations', parseInt(e.target.value))}
                        className="studio-slider"
                      />
                      <span className="param-hint">3,000–4,000 lines is optimal for dark shades.</span>
                    </div>

                    <div className="param-item">
                      <div className="param-item-header">
                        <label htmlFor="slider-contrast">Image Contrast</label>
                        <span className="param-val">{params.contrast.toFixed(1)}x</span>
                      </div>
                      <input
                        id="slider-contrast"
                        type="range"
                        min="0.5"
                        max="2.5"
                        step="0.1"
                        value={params.contrast}
                        onChange={(e) => setParam('contrast', parseFloat(e.target.value))}
                        className="studio-slider"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Generate Trigger Button */}
              <div className="generate-action-box">
                {isRunning ? (
                  <div className="generating-status-container">
                    <div className="computing-spinner-box">
                      <span className="spinner-large"></span>
                      <div className="computing-text">
                        <strong>Calculating thread sequence…</strong>
                        <span>Optimizing light and dark shadow density across {params.numNails} nails</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary-light"
                      onClick={cancel}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    id="btn-main-generate"
                    type="button"
                    className="btn btn-primary-dark btn-hero-generate"
                    onClick={generate}
                  >
                    <span>🧵 Generate String Art Preview</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── STATE 3: Generated String Art Preview is Ready ── */}
          {isDone && (
            <div className="studio-result-view">
              <div className="result-header">
                <div className="result-title-box">
                  <span className="badge-success">✓ Generation Complete</span>
                  <h3 className="result-heading">Your String Art Preview</h3>
                </div>
                <div className="result-actions">
                  <button
                    type="button"
                    className="btn btn-secondary-light btn-sm"
                    onClick={() => {
                      onSelectImage(null);
                    }}
                  >
                    ← Try another photo
                  </button>
                </div>
              </div>

              {/* Embedded Canvas */}
              <div className="result-canvas-container">
                <CanvasPreview previewData={previewData} />
              </div>

              {/* Specs & Download Card */}
              <div className="result-specs-card">
                <div className="spec-metric">
                  <span className="metric-title">Thread Lines</span>
                  <span className="metric-val">{stats?.lines?.toLocaleString() || params.maxIterations}</span>
                </div>
                <div className="spec-metric">
                  <span className="metric-title">Board Nails</span>
                  <span className="metric-val">{params.numNails} nails</span>
                </div>
                <div className="spec-metric">
                  <span className="metric-title">Thread Length</span>
                  <span className="metric-val">~1.6 km</span>
                </div>
                <div className="spec-metric">
                  <span className="metric-title">Board Size</span>
                  <span className="metric-val">50 cm circular</span>
                </div>
              </div>

              {/* Download Sequence Button */}
              <div className="result-download-row">
                <button
                  type="button"
                  className="btn btn-primary-dark w-full"
                  onClick={downloadSequence}
                >
                  💾 Download Nail Sequence File (.txt)
                </button>
                <p className="download-hint">
                  The sequence contains the exact numerical nail-to-nail path required to string this portrait by hand.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
