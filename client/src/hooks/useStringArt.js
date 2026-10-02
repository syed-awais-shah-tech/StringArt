/**
 * useStringArt.js
 * Custom hook that manages all state + API communication for the app.
 */
import { useState, useCallback, useRef } from 'react';

const API_BASE = '/api';

const DEFAULT_PARAMS = {
  numNails:          200,
  boardDiameterMm:   480,
  threadThicknessMm: 0.10,
  maxIterations:     3000,
  alpha:             0.13,
  lineDensity:       1.00,   // maps to kDensity = lineDensity * 500
  brightness:        0.8,
  contrast:          1,
  bgThreshold:       0,      // 0 = disabled
  imageSize:         512,
  name:              'myStringArt',
  featureHighlight:  'none',
  // Thread color palette — first 8 match C++ defaults
  colors: [
    [0, 0, 0],
    [255, 255, 255],
    [255, 0, 0],
    [0, 255, 0],
    [0, 0, 255],
    [255, 0, 255],
    [0, 255, 255],
    [255, 255, 0],
  ],
};

export function useStringArt() {
  const [params, setParams]           = useState(DEFAULT_PARAMS);
  const [imageFile, setImageFile]     = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [status, setStatus]           = useState('idle'); // idle | running | done | error
  const [error, setError]             = useState(null);
  const [previewData, setPreviewData] = useState(null);  // { nails, width, height, sequence }
  const [stats, setStats]             = useState(null);  // { lines, time }
  const [sequenceText, setSequenceText] = useState(null);
  const [sequenceFilename, setSequenceFilename] = useState(null);
  const abortRef                      = useRef(null);

  // ── Parameter updater ───────────────────────────────────────────────────
  const setParam = useCallback((key, value) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  // ── Image selection ─────────────────────────────────────────────────────
  const selectImage = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreviewUrl(url);
    setPreviewData(null);
    setStats(null);
    setSequenceText(null);
    setSequenceFilename(null);
    setStatus('idle');
    setError(null);
  }, []);

  // ── Generate ─────────────────────────────────────────────────────────────
  const generate = useCallback(async () => {
    if (!imageFile) {
      setError('Please upload an image first.');
      return;
    }

    setStatus('running');
    setError(null);
    setPreviewData(null);
    setStats(null);
    setSequenceText(null);
    setSequenceFilename(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('params', JSON.stringify(params));

      const t0 = Date.now();
      const response = await fetch(`${API_BASE}/generate`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      if (!response.ok) {
        const json = await response.json().catch(() => ({}));
        throw new Error(json.error || `Server error ${response.status}`);
      }

      const data = await response.json();

      if (data.previewData) {
        setPreviewData(data.previewData);
        setStats({ lines: data.previewData.totalLines, timeMs: Date.now() - t0 });
      }

      const filename = data.filename || `${params.name}.txt`;
      setSequenceText(data.sequenceText);
      setSequenceFilename(filename);

      // ── Download sequence file ──────────────────────────────────────────
      const blob = new Blob([data.sequenceText], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      setStatus('done');
    } catch (err) {
      if (err.name === 'AbortError') {
        setStatus('idle');
        return;
      }
      setError(err.message || 'Generation failed');
      setStatus('error');
    }
  }, [imageFile, params]);

  // ── Download Sequence Manually ────────────────────────────────────────────
  const downloadSequence = useCallback(() => {
    if (!sequenceText) return;
    const blob = new Blob([sequenceText], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = sequenceFilename || 'sequence.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }, [sequenceText, sequenceFilename]);

  // ── Cancel ────────────────────────────────────────────────────────────────
  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setStatus('idle');
  }, []);

  return {
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
    DEFAULT_PARAMS,
  };
}
