/**
 * ControlPanel.jsx
 * Parameter controls sidebar — matches the reference UI layout exactly.
 *
 * Sections:
 *   1. Physical Parameters  — Thread Thickness, Circle Diameter, Nails
 *   2. Algorithm            — Max Iterations, Alpha, Image Size
 *   3. Image Tuning         — Background, Brightness, Contrast, Line Density
 *   4. Feature Highlighting — Dropdown for thread color mode
 */
import React from 'react';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Styled slider that fills its track proportionally */
function ParamSlider({ id, label, note, min, max, step, value, unit = '', onChange }) {
  const fillPct = (((value - min) / (max - min)) * 100).toFixed(1);

  // Format display value
  const display =
    step < 0.1
      ? value.toFixed(2)
      : step < 1
      ? value.toFixed(1)
      : Math.round(value);

  return (
    <div className="param-row">
      <div className="param-label">
        <label htmlFor={id}>{label}</label>
        <span className="param-value">
          {display}
          {unit && <span style={{ fontSize: '0.65em', opacity: 0.7 }}> {unit}</span>}
        </span>
      </div>
      {note && <span className="param-note">{note}</span>}
      <input
        id={id}
        className="slider"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ '--fill-pct': `${fillPct}%` }}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}

/** Section header with icon */
function SectionHeader({ icon, title }) {
  return (
    <div className="panel-header">
      <div className="panel-icon">{icon}</div>
      <span className="panel-title">{title}</span>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ControlPanel({ params, setParam }) {
  return (
    <>
      {/* ── Physical Parameters ─────────────────────────────────────────── */}
      <div className="panel">
        <SectionHeader icon="📐" title="Physical Parameters" />

        <ParamSlider
          id="thread-thickness"
          label="Thread Thickness"
          unit="mm"
          min={0.01}
          max={2.0}
          step={0.01}
          value={params.threadThicknessMm}
          onChange={(v) => setParam('threadThicknessMm', v)}
        />

        <ParamSlider
          id="circle-diameter"
          label="Circle Diameter"
          unit="mm"
          min={100}
          max={1000}
          step={10}
          value={params.boardDiameterMm}
          onChange={(v) => setParam('boardDiameterMm', v)}
        />

        <ParamSlider
          id="num-nails"
          label="Number of Nails"
          min={50}
          max={500}
          step={1}
          value={params.numNails}
          onChange={(v) => setParam('numNails', Math.round(v))}
        />
      </div>

      {/* ── Algorithm Parameters ────────────────────────────────────────── */}
      <div className="panel">
        <SectionHeader icon="⚙️" title="Algorithm" />

        <ParamSlider
          id="max-iterations"
          label="Max Lines"
          min={500}
          max={10000}
          step={100}
          value={params.maxIterations}
          onChange={(v) => setParam('maxIterations', Math.round(v))}
        />

        <ParamSlider
          id="alpha"
          label="Thread Opacity (α)"
          min={0.01}
          max={0.5}
          step={0.01}
          value={params.alpha}
          onChange={(v) => setParam('alpha', v)}
        />

        <div className="param-row">
          <div className="param-label">
            <label htmlFor="image-size">Processing Resolution</label>
            <span className="param-value">{params.imageSize}px</span>
          </div>
          <input
            id="image-size"
            className="slider"
            type="range"
            min={256}
            max={1024}
            step={128}
            value={params.imageSize}
            style={{
              '--fill-pct': `${(((params.imageSize - 256) / (1024 - 256)) * 100).toFixed(1)}%`,
            }}
            onChange={(e) => setParam('imageSize', parseInt(e.target.value))}
          />
        </div>
      </div>

      {/* ── Image Tuning ────────────────────────────────────────────────── */}
      <div className="panel">
        <SectionHeader icon="🎨" title="Image Tuning" />

        <ParamSlider
          id="bg-threshold"
          label="Background Color"
          note="Remove background to use this option"
          min={0}
          max={255}
          step={1}
          value={params.bgThreshold}
          onChange={(v) => setParam('bgThreshold', Math.round(v))}
        />

        <ParamSlider
          id="brightness"
          label="Brightness"
          min={0.1}
          max={3.0}
          step={0.05}
          value={params.brightness}
          onChange={(v) => setParam('brightness', v)}
        />

        <ParamSlider
          id="contrast"
          label="Contrast"
          min={0.1}
          max={4.0}
          step={0.1}
          value={params.contrast}
          onChange={(v) => setParam('contrast', v)}
        />

        <ParamSlider
          id="line-density"
          label="Line Density"
          note="Optimal"
          min={0.1}
          max={5.0}
          step={0.05}
          value={params.lineDensity}
          onChange={(v) => setParam('lineDensity', v)}
        />
      </div>

      {/* ── Feature Highlighting ─────────────────────────────────────────── */}
      <div className="panel">
        <SectionHeader icon="✨" title="Feature Highlighting" />

        <div className="param-row">
          <div className="param-label" style={{ marginBottom: 6 }}>
            <label htmlFor="feature-highlight">Highlight Mode</label>
          </div>
          <select
            id="feature-highlight"
            className="select"
            value={params.featureHighlight}
            onChange={(e) => setParam('featureHighlight', e.target.value)}
          >
            <option value="none">None (all colors)</option>
            <option value="mono">Monochrome (black only)</option>
            <option value="edges">Edge Emphasis</option>
            <option value="warm">Warm Tones</option>
            <option value="cool">Cool Tones</option>
            <option value="primary">Primary Colors</option>
          </select>
          <span className="param-note" style={{ marginTop: 4 }}>
            Controls which thread color set is active during generation
          </span>
        </div>

        {/* Color preview swatches */}
        <div style={{ marginTop: 8 }}>
          <div className="param-label" style={{ marginBottom: 6 }}>
            <label>Active Thread Colors</label>
          </div>
          <div className="color-swatches">
            {getActiveColors(params.featureHighlight).map(([r, g, b], i) => (
              <div
                key={i}
                className="color-swatch"
                title={`rgb(${r},${g},${b})`}
                style={{
                  background: `rgb(${r},${g},${b})`,
                  outline: r === 255 && g === 255 && b === 255
                    ? '1px solid rgba(255,255,255,0.3)'
                    : 'none',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/** Return thread colors for the selected highlight mode */
export function getActiveColors(mode) {
  const palettes = {
    none:    [[0,0,0],[255,255,255],[255,0,0],[0,255,0],[0,0,255],[255,0,255],[0,255,255],[255,255,0]],
    mono:    [[0,0,0]],
    edges:   [[0,0,0],[30,30,30],[60,60,60]],
    warm:    [[180,40,10],[220,120,20],[255,200,60],[120,20,10]],
    cool:    [[10,40,180],[20,120,220],[60,200,255],[10,20,120]],
    primary: [[255,0,0],[0,255,0],[0,0,255]],
  };
  return palettes[mode] ?? palettes.none;
}
