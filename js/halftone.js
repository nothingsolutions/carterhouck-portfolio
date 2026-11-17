/**
 * Halftone Image Generator
 * Client-side halftone effect tool
 */

(function() {
  'use strict';

  // DOM elements
  const uploadZone = document.getElementById('upload-zone');
  const fileInput = document.getElementById('file-input');
  const halftoneMain = document.getElementById('halftone-main');
  const canvas = document.getElementById('halftone-canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  // Controls
  const ctrlDotSize = document.getElementById('ctrl-dotsize');
  const ctrlSpacing = document.getElementById('ctrl-spacing');
  const ctrlAngle = document.getElementById('ctrl-angle');
  const ctrlShape = document.getElementById('ctrl-shape');
  const ctrlContrast = document.getElementById('ctrl-contrast');
  const ctrlBrightness = document.getElementById('ctrl-brightness');
  const ctrlForeground = document.getElementById('ctrl-foreground');
  const ctrlBackground = document.getElementById('ctrl-background');
  const ctrlInvert = document.getElementById('ctrl-invert');

  // Value displays
  const valueDotSize = document.getElementById('value-dotsize');
  const valueSpacing = document.getElementById('value-spacing');
  const valueAngle = document.getElementById('value-angle');
  const valueContrast = document.getElementById('value-contrast');
  const valueBrightness = document.getElementById('value-brightness');

  // Buttons
  const btnDownloadPng = document.getElementById('btn-download-png');
  const btnDownloadSvg = document.getElementById('btn-download-svg');
  const btnNewImage = document.getElementById('btn-new-image');

  // State
  let sourceImage = null;
  let sourceImageData = null;
  let renderTimeout = null;

  // Max canvas size for performance
  const MAX_DIMENSION = 1200;

  /**
   * Initialize event listeners
   */
  function init() {
    // Upload events
    uploadZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop
    uploadZone.addEventListener('dragover', handleDragOver);
    uploadZone.addEventListener('dragleave', handleDragLeave);
    uploadZone.addEventListener('drop', handleDrop);

    // Control events with debouncing
    [ctrlDotSize, ctrlSpacing, ctrlAngle, ctrlContrast, ctrlBrightness].forEach(ctrl => {
      ctrl.addEventListener('input', debounceRender);
    });

    [ctrlShape, ctrlForeground, ctrlBackground, ctrlInvert].forEach(ctrl => {
      ctrl.addEventListener('change', renderHalftone);
    });

    // Button events
    btnDownloadPng.addEventListener('click', downloadPNG);
    btnDownloadSvg.addEventListener('click', downloadSVG);
    btnNewImage.addEventListener('click', resetToUpload);
  }

  /**
   * Handle file selection
   */
  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      loadImage(file);
    }
  }

  /**
   * Handle drag over
   */
  function handleDragOver(e) {
    e.preventDefault();
    uploadZone.classList.add('dragging');
  }

  /**
   * Handle drag leave
   */
  function handleDragLeave(e) {
    e.preventDefault();
    uploadZone.classList.remove('dragging');
  }

  /**
   * Handle drop
   */
  function handleDrop(e) {
    e.preventDefault();
    uploadZone.classList.remove('dragging');
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      loadImage(file);
    }
  }

  /**
   * Load and process image
   */
  function loadImage(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        sourceImage = img;
        prepareCanvas();
        uploadZone.style.display = 'none';
        halftoneMain.style.display = 'grid';
        renderHalftone();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  /**
   * Prepare canvas with appropriate size
   */
  function prepareCanvas() {
    let width = sourceImage.width;
    let height = sourceImage.height;

    // Downscale if too large
    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
      width = Math.floor(width * ratio);
      height = Math.floor(height * ratio);
    }

    canvas.width = width;
    canvas.height = height;

    // Draw and store source image data
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(sourceImage, 0, 0, width, height);
    sourceImageData = tempCtx.getImageData(0, 0, width, height);
  }

  /**
   * Debounce render for slider inputs
   */
  function debounceRender(e) {
    updateValueDisplay(e.target);
    clearTimeout(renderTimeout);
    renderTimeout = setTimeout(renderHalftone, 100);
  }

  /**
   * Update value displays
   */
  function updateValueDisplay(input) {
    const id = input.id;
    const value = input.value;
    
    if (id === 'ctrl-dotsize') valueDotSize.textContent = value;
    else if (id === 'ctrl-spacing') valueSpacing.textContent = value;
    else if (id === 'ctrl-angle') valueAngle.textContent = value + '°';
    else if (id === 'ctrl-contrast') valueContrast.textContent = value;
    else if (id === 'ctrl-brightness') valueBrightness.textContent = value;
  }

  /**
   * Apply brightness and contrast adjustments
   */
  function adjustPixels(imageData, brightness, contrast) {
    const data = new Uint8ClampedArray(imageData.data);
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    
    for (let i = 0; i < data.length; i += 4) {
      // Apply contrast
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];
      
      r = factor * (r - 128) + 128;
      g = factor * (g - 128) + 128;
      b = factor * (b - 128) + 128;
      
      // Apply brightness
      r += brightness;
      g += brightness;
      b += brightness;
      
      // Clamp values
      data[i] = Math.max(0, Math.min(255, r));
      data[i + 1] = Math.max(0, Math.min(255, g));
      data[i + 2] = Math.max(0, Math.min(255, b));
    }
    
    return data;
  }

  /**
   * Calculate luminance from RGB
   */
  function getLuminance(r, g, b) {
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }

  /**
   * Render halftone effect
   */
  function renderHalftone() {
    if (!sourceImageData) return;

    const dotSize = parseFloat(ctrlDotSize.value);
    const spacing = parseFloat(ctrlSpacing.value);
    const angle = parseFloat(ctrlAngle.value) * (Math.PI / 180);
    const shape = ctrlShape.value;
    const contrast = parseFloat(ctrlContrast.value);
    const brightness = parseFloat(ctrlBrightness.value) * 2.55; // Scale to 0-255
    const foreground = ctrlForeground.value;
    const background = ctrlBackground.value;
    const invert = ctrlInvert.checked;

    const width = canvas.width;
    const height = canvas.height;
    const cellSize = dotSize * spacing;

    // Apply brightness/contrast adjustments
    const adjustedData = adjustPixels(sourceImageData, brightness, contrast);

    // Clear and fill background
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = foreground;

    // Calculate rotated canvas bounds
    const cos = Math.cos(-angle);
    const sin = Math.sin(-angle);
    const centerX = width / 2;
    const centerY = height / 2;

    // Draw halftone dots
    for (let y = 0; y < height; y += cellSize) {
      for (let x = 0; x < width; x += cellSize) {
        // Rotate coordinates
        const dx = x - centerX;
        const dy = y - centerY;
        const rotatedX = dx * cos - dy * sin + centerX;
        const rotatedY = dx * sin + dy * cos + centerY;

        // Skip if outside bounds
        if (rotatedX < 0 || rotatedX >= width || rotatedY < 0 || rotatedY >= height) {
          continue;
        }

        // Sample pixel at rotated position
        const px = Math.floor(rotatedX);
        const py = Math.floor(rotatedY);
        const i = (py * width + px) * 4;

        // Calculate luminance
        const luminance = getLuminance(adjustedData[i], adjustedData[i + 1], adjustedData[i + 2]);
        const darkness = invert ? luminance : 1 - luminance;

        // Size dot by area (sqrt for radius)
        const radius = Math.sqrt(darkness) * dotSize * 0.62;

        if (radius > 0.3) {
          drawDot(x, y, radius, shape, angle);
        }
      }
    }
  }

  /**
   * Draw a single dot with the specified shape
   */
  function drawDot(x, y, radius, shape, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();
    } else if (shape === 'square') {
      const size = radius * 1.4; // Adjust for similar visual weight
      ctx.fillRect(-size / 2, -size / 2, size, size);
    } else if (shape === 'line') {
      const length = radius * 2;
      ctx.beginPath();
      ctx.moveTo(-length / 2, 0);
      ctx.lineTo(length / 2, 0);
      ctx.lineWidth = Math.max(1, radius * 0.3);
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Download as PNG
   */
  function downloadPNG() {
    canvas.toBlob(function(blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'halftone-' + Date.now() + '.png';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  /**
   * Download as SVG
   */
  function downloadSVG() {
    if (!sourceImageData) return;

    const dotSize = parseFloat(ctrlDotSize.value);
    const spacing = parseFloat(ctrlSpacing.value);
    const angle = parseFloat(ctrlAngle.value) * (Math.PI / 180);
    const shape = ctrlShape.value;
    const contrast = parseFloat(ctrlContrast.value);
    const brightness = parseFloat(ctrlBrightness.value) * 2.55;
    const foreground = ctrlForeground.value;
    const background = ctrlBackground.value;
    const invert = ctrlInvert.checked;

    const width = canvas.width;
    const height = canvas.height;
    const cellSize = dotSize * spacing;

    const adjustedData = adjustPixels(sourceImageData, brightness, contrast);

    // Build SVG
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
    svg += `<rect width="${width}" height="${height}" fill="${background}"/>`;
    svg += `<g fill="${foreground}">`;

    const cos = Math.cos(-angle);
    const sin = Math.sin(-angle);
    const centerX = width / 2;
    const centerY = height / 2;

    for (let y = 0; y < height; y += cellSize) {
      for (let x = 0; x < width; x += cellSize) {
        const dx = x - centerX;
        const dy = y - centerY;
        const rotatedX = dx * cos - dy * sin + centerX;
        const rotatedY = dx * sin + dy * cos + centerY;

        if (rotatedX < 0 || rotatedX >= width || rotatedY < 0 || rotatedY >= height) {
          continue;
        }

        const px = Math.floor(rotatedX);
        const py = Math.floor(rotatedY);
        const i = (py * width + px) * 4;

        const luminance = getLuminance(adjustedData[i], adjustedData[i + 1], adjustedData[i + 2]);
        const darkness = invert ? luminance : 1 - luminance;
        const radius = Math.sqrt(darkness) * dotSize * 0.62;

        if (radius > 0.3) {
          if (shape === 'circle') {
            svg += `<circle cx="${x}" cy="${y}" r="${radius}" transform="rotate(${angle * 180 / Math.PI} ${x} ${y})"/>`;
          } else if (shape === 'square') {
            const size = radius * 1.4;
            svg += `<rect x="${x - size / 2}" y="${y - size / 2}" width="${size}" height="${size}" transform="rotate(${angle * 180 / Math.PI} ${x} ${y})"/>`;
          } else if (shape === 'line') {
            const length = radius * 2;
            const strokeWidth = Math.max(1, radius * 0.3);
            svg += `<line x1="${x - length / 2}" y1="${y}" x2="${x + length / 2}" y2="${y}" stroke="${foreground}" stroke-width="${strokeWidth}" transform="rotate(${angle * 180 / Math.PI} ${x} ${y})"/>`;
          }
        }
      }
    }

    svg += '</g></svg>';

    // Download
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'halftone-' + Date.now() + '.svg';
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Reset to upload state
   */
  function resetToUpload() {
    sourceImage = null;
    sourceImageData = null;
    fileInput.value = '';
    uploadZone.style.display = 'block';
    halftoneMain.style.display = 'none';
    
    // Reset controls
    ctrlDotSize.value = 8;
    ctrlSpacing.value = 1.0;
    ctrlAngle.value = 0;
    ctrlShape.value = 'circle';
    ctrlContrast.value = 0;
    ctrlBrightness.value = 0;
    ctrlForeground.value = '#000000';
    ctrlBackground.value = '#ffffff';
    ctrlInvert.checked = false;
    
    // Update displays
    valueDotSize.textContent = '8';
    valueSpacing.textContent = '1.0';
    valueAngle.textContent = '0°';
    valueContrast.textContent = '0';
    valueBrightness.textContent = '0';
  }

  // Initialize on load
  init();
})();
