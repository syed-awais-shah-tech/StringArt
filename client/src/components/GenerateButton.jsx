/**
 * GenerateButton.jsx
 * Generate / Cancel button with status badge, progress bar, and stats display.
 */
import React from 'react';

export default function GenerateButton({ status, stats, onGenerate, onCancel, onDownload, hasImage }) {
  const isRunning = status === 'running';
  const isDone    = status === 'done';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>

      {/* Status Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
        <StatusBadge status={status} />
        {isDone && stats && (
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {stats.lines.toLocaleString()} lines in {(stats.timeMs / 1000).toFixed(1)}s
          </span>
        )}
      </div>

      {/* Main buttons */}
      <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
        <button
          id="btn-generate"
          className="btn btn-generate"
          onClick={isRunning ? onCancel : onGenerate}
          disabled={!hasImage && !isRunning}
          style={{ gap: 'var(--spacing-sm)', flex: 1 }}
        >
          {isRunning ? (
            <>
              <span className="spinner" />
              Cancel Generation
            </>
          ) : isDone ? (
            <>🔄 Regenerate</>
          ) : (
            <>🧵 Generate String Art</>
          )}
        </button>

        {isDone && (
          <button
            className="btn btn-secondary"
            onClick={onDownload}
            title="Download Sequence Text File"
            style={{ padding: '0 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            💾 Download
          </button>
        )}
      </div>

      {/* Stats grid after completion */}
      {isDone && stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Lines</div>
            <div className="stat-value">{stats.lines.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Time Taken</div>
            <div className="stat-value">{(stats.timeMs / 1000).toFixed(1)}s</div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const configs = {
    idle:    { cls: 'idle',    dot: '○', label: 'Idle' },
    running: { cls: 'running', dot: '●', label: 'Computing…' },
    done:    { cls: 'done',    dot: '✓', label: 'Complete' },
    error:   { cls: 'error',   dot: '✕', label: 'Error' },
  };
  const { cls, dot, label } = configs[status] || configs.idle;
  return (
    <span className={`status-badge ${cls}`}>
      {status === 'running' ? <span className="spinner" style={{ width: 10, height: 10, borderWidth: 1.5 }} /> : dot}
      {label}
    </span>
  );
}
