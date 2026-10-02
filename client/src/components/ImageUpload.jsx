/**
 * ImageUpload.jsx
 * Drag-and-drop image upload zone with thumbnail preview.
 */
import React, { useCallback, useState } from 'react';

export default function ImageUpload({ imageFile, imagePreviewUrl, onSelect }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file) => {
      if (file && file.type.startsWith('image/')) onSelect(file);
    },
    [onSelect]
  );

  const handleInputChange = (e) => handleFile(e.target.files?.[0]);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      handleFile(e.dataTransfer.files?.[0]);
    },
    [handleFile]
  );

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = ()  => setIsDragging(false);

  const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  if (imageFile && imagePreviewUrl) {
    return (
      <div className="upload-preview">
        <img
          className="upload-preview-img"
          src={imagePreviewUrl}
          alt="Preview"
        />
        <div className="upload-preview-info">
          <div className="upload-preview-name" title={imageFile.name}>
            {imageFile.name}
          </div>
          <div className="upload-preview-size">{formatBytes(imageFile.size)}</div>
          <label className="upload-preview-change">
            Change image
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleInputChange}
            />
          </label>
        </div>
      </div>
    );
  }

  return (
    <label
      className={`upload-zone${isDragging ? ' drag-over' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      htmlFor="image-upload-input"
    >
      <input
        id="image-upload-input"
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />
      <span className="upload-zone-icon">🖼️</span>
      <span className="upload-zone-title">Drop image here or click to browse</span>
      <span className="upload-zone-sub">PNG, JPG, WEBP — max 20 MB</span>
    </label>
  );
}
