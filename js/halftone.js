/**
 * Halftone Image Generator - Extended Edition
 * Client-side halftone effect tool with comprehensive controls
 */

(function() {
  'use strict';

  // ===== DOM ELEMENTS =====
  const uploadZone = document.getElementById('upload-zone');
  const fileInput = document.getElementById('file-input');
  const halftoneMain = document.getElementById('halftone-main');
  const canvas = document.getElementById('halftone-canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  // Controls
  const controls = {
    gridType: document.getElementById('ctrl-grid-type'),
    spacing: document.getElementById('ctrl-spacing'),
    angle: document.getElementById('ctrl-angle'),
    gridSize: document.getElementById('ctrl-grid-size'),
    shape: document.getElementById('ctrl-shape'),
    dotSize: document.getElementById('ctrl-dotsize'),
    sizeOffset: document.getElementById('ctrl-size-offset'),
    shapeRotation: document.getElementById('ctrl-shape-rotation'),
    rounding: document.getElementById('ctrl-rounding'),
    blur: document.getElementById('ctrl-blur'),
    gamma: document.getElementById('ctrl-gamma'),
    contrast: document.getElementById('ctrl-contrast'),
    brightness: document.getElementById('ctrl-brightness'),
    channel: document.getElementById('ctrl-channel'),
    colorMode: document.getElementById('ctrl-color-mode'),
    foreground: document.getElementById('ctrl-foreground'),
    background: document.getElementById('ctrl-background'),
    gradientPreset: document.getElementById('ctrl-gradient-preset'),
    invert: document.getElementById('ctrl-invert'),
    dither: document.getElementById('ctrl-dither'),
    displacement: document.getElementById('ctrl-displacement'),
    noise: document.getElementById('ctrl-noise'),
    noiseScale: document.getElementById('ctrl-noise-scale')
  };

  // Buttons
  const btnRandomize = document.getElementById('btn-randomize');
  const btnDownloadPng = document.getElementById('btn-download-png');
  const btnDownloadSvg = document.getElementById('btn-download-svg');
  const btnReset = document.getElementById('btn-reset');
  const btnNewImage = document.getElementById('btn-new-image');

  // State
  let sourceImage = null;
  let sourceImageData = null;
  let renderTimeout = null;
  const MAX_DIMENSION = 1200;
  
  // Noise cache for performance
  let noiseCache = {};

  // ===== GRADIENT PRESETS =====
  const gradientPresets = {
    'bw': ['#000000', '#ffffff'],
    'duotone-blue': ['#000033', '#66ccff'],
    'duotone-red': ['#330000', '#ff6666'],
    'thermal': ['#000000', '#ff0000', '#ffff00', '#ffffff'],
    'rainbow': ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#8b00ff'],
    'sunset': ['#2c1654', '#ff6b35', '#f7931e', '#fdc830'],
    'ocean': ['#001f3f', '#0074d9', '#7fdbff', '#ffffff'],
    'forest': ['#1a1a1a', '#2d5016', '#4a7c2c', '#a8d08d'],
    'sepia': ['#2b1d0e', '#704214', '#c8a882', '#f3e3d3']
  };

  // ===== PRESETS =====
  const presets = {
    classic: {
      gridType: 'square', spacing: 8, angle: 45, gridSize: 1, shape: 'circle',
      dotSize: 0.62, sizeOffset: 0, shapeRotation: 0, rounding: 0,
      blur: 0, gamma: 1, contrast: 20, brightness: 0,
      channel: 'luminance', colorMode: 'two-colors', invert: false,
      dither: 'none', displacement: 0, noise: 0
    },
    newsprint: {
      gridType: 'square', spacing: 6, angle: 15, gridSize: 1, shape: 'circle',
      dotSize: 0.7, sizeOffset: 0, shapeRotation: 0, rounding: 0,
      blur: 2, gamma: 0.9, contrast: 30, brightness: 0,
      channel: 'luminance', colorMode: 'two-colors', invert: false,
      dither: 'bayer4', displacement: 0, noise: 0
    },
    dots: {
      gridType: 'square', spacing: 16, angle: 0, gridSize: 1, shape: 'circle',
      dotSize: 0.8, sizeOffset: 2, shapeRotation: 0, rounding: 0,
      blur: 3, gamma: 1.2, contrast: 40, brightness: 0,
      channel: 'luminance', colorMode: 'two-colors', invert: false,
      dither: 'none', displacement: 0, noise: 0
    },
    fine: {
      gridType: 'square', spacing: 4, angle: 22, gridSize: 1, shape: 'circle',
      dotSize: 0.55, sizeOffset: 0, shapeRotation: 0, rounding: 0,
      blur: 1, gamma: 1, contrast: 25, brightness: 0,
      channel: 'luminance', colorMode: 'two-colors', invert: false,
      dither: 'bayer8', displacement: 0, noise: 0
    },
    engraving: {
      gridType: 'line', spacing: 4, angle: 0, gridSize: 1, shape: 'line',
      dotSize: 0.8, sizeOffset: 0, shapeRotation: 0, rounding: 0,
      blur: 1, gamma: 1.1, contrast: 35, brightness: 0,
      channel: 'luminance', colorMode: 'two-colors', invert: false,
      dither: 'none', displacement: 0, noise: 0
    },
    stipple: {
      gridType: 'square', spacing: 5, angle: 0, gridSize: 1, shape: 'circle',
      dotSize: 0.4, sizeOffset: 0, shapeRotation: 0, rounding: 0,
      blur: 2, gamma: 1, contrast: 20, brightness: 0,
      channel: 'luminance', colorMode: 'two-colors', invert: false,
      dither: 'floyd', displacement: 3, noise: 0.1
    },
    radial: {
      gridType: 'radial', spacing: 12, angle: 0, gridSize: 1, shape: 'circle',
      dotSize: 0.65, sizeOffset: 0, shapeRotation: 0, rounding: 0,
      blur: 2, gamma: 1.1, contrast: 25, brightness: 0,
      channel: 'luminance', colorMode: 'two-colors', invert: false,
      dither: 'none', displacement: 0, noise: 0
    },
    hex: {
      gridType: 'hex', spacing: 10, angle: 0, gridSize: 1, shape: 'circle',
      dotSize: 0.62, sizeOffset: 0, shapeRotation: 0, rounding: 0,
      blur: 1, gamma: 1, contrast: 20, brightness: 0,
      channel: 'luminance', colorMode: 'two-colors', invert: false,
      dither: 'none', displacement: 0, noise: 0
    }
  };

  // ===== INITIALIZATION =====
  function init() {
    // Upload events
    uploadZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    uploadZone.addEventListener('dragover', handleDragOver);
    uploadZone.addEventListener('dragleave', handleDragLeave);
    uploadZone.addEventListener('drop', handleDrop);

    // Control events
    Object.values(controls).forEach(ctrl => {
      if (ctrl.type === 'range') {
        ctrl.addEventListener('input', debounceRender);
      } else {
        ctrl.addEventListener('change', () => {
          updateColorModeUI();
          renderHalftone();
        });
      }
    });

    // Buttons
    btnRandomize.addEventListener('click', randomizeSettings);
    btnDownloadPng.addEventListener('click', downloadPNG);
    btnDownloadSvg.addEventListener('click', downloadSVG);
    btnReset.addEventListener('click', resetSettings);
    btnNewImage.addEventListener('click', resetToUpload);

    // Preset buttons
    document.querySelectorAll('.halftone-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => applyPreset(btn.dataset.preset));
    });

    // Section collapse/expand
    document.querySelectorAll('.halftone-section-title').forEach(title => {
      title.addEventListener('click', () => {
        const section = title.parentElement;
        const toggle = title.querySelector('.halftone-section-toggle');
        section.classList.toggle('collapsed');
        toggle.textContent = section.classList.contains('collapsed') ? '+' : '−';
      });
    });
  }

  // ===== FILE HANDLING =====
  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) loadImage(file);
  }

  function handleDragOver(e) {
    e.preventDefault();
    uploadZone.classList.add('dragging');
  }

  function handleDragLeave(e) {
    e.preventDefault();
    uploadZone.classList.remove('dragging');
  }

  function handleDrop(e) {
    e.preventDefault();
    uploadZone.classList.remove('dragging');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) loadImage(file);
  }

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

  function prepareCanvas() {
    let width = sourceImage.width;
    let height = sourceImage.height;

    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
      width = Math.floor(width * ratio);
      height = Math.floor(height * ratio);
    }

    canvas.width = width;
    canvas.height = height;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(sourceImage, 0, 0, width, height);
    sourceImageData = tempCtx.getImageData(0, 0, width, height);
  }

  // ===== RENDERING =====
  function debounceRender(e) {
    updateValueDisplay(e.target);
    clearTimeout(renderTimeout);
    renderTimeout = setTimeout(renderHalftone, 100);
  }

  function updateValueDisplay(input) {
    const valueMap = {
      'ctrl-spacing': ['value-spacing', v => v],
      'ctrl-angle': ['value-angle', v => v + '°'],
      'ctrl-grid-size': ['value-grid-size', v => v],
      'ctrl-dotsize': ['value-dotsize', v => v],
      'ctrl-size-offset': ['value-size-offset', v => v],
      'ctrl-shape-rotation': ['value-shape-rotation', v => v + '°'],
      'ctrl-rounding': ['value-rounding', v => v],
      'ctrl-blur': ['value-blur', v => v],
      'ctrl-gamma': ['value-gamma', v => v],
      'ctrl-contrast': ['value-contrast', v => v],
      'ctrl-brightness': ['value-brightness', v => v],
      'ctrl-displacement': ['value-displacement', v => v],
      'ctrl-noise': ['value-noise', v => v],
      'ctrl-noise-scale': ['value-noise-scale', v => v]
    };

    const mapping = valueMap[input.id];
    if (mapping) {
      const [targetId, formatter] = mapping;
      document.getElementById(targetId).textContent = formatter(input.value);
    }
  }

  function updateColorModeUI() {
    const mode = controls.colorMode.value;
    document.getElementById('control-foreground').style.display = 
      mode === 'two-colors' ? 'flex' : 'none';
    document.getElementById('control-background').style.display = 
      mode === 'two-colors' ? 'flex' : 'none';
    document.getElementById('control-gradient').style.display = 
      mode === 'gradient' ? 'flex' : 'none';
  }

  function renderHalftone() {
    if (!sourceImageData) return;

    const params = {
      gridType: controls.gridType.value,
      spacing: parseFloat(controls.spacing.value),
      angle: parseFloat(controls.angle.value) * (Math.PI / 180),
      gridSize: parseFloat(controls.gridSize.value),
      shape: controls.shape.value,
      dotSize: parseFloat(controls.dotSize.value),
      sizeOffset: parseFloat(controls.sizeOffset.value),
      shapeRotation: parseFloat(controls.shapeRotation.value) * (Math.PI / 180),
      rounding: parseFloat(controls.rounding.value),
      blur: parseFloat(controls.blur.value),
      gamma: parseFloat(controls.gamma.value),
      contrast: parseFloat(controls.contrast.value),
      brightness: parseFloat(controls.brightness.value) * 2.55,
      channel: controls.channel.value,
      colorMode: controls.colorMode.value,
      foreground: controls.foreground.value,
      background: controls.background.value,
      gradientPreset: controls.gradientPreset.value,
      invert: controls.invert.checked,
      dither: controls.dither.value,
      displacement: parseFloat(controls.displacement.value),
      noise: parseFloat(controls.noise.value),
      noiseScale: parseFloat(controls.noiseScale.value)
    };

    const width = canvas.width;
    const height = canvas.height;

    // Process image data
    let processedData = applyImageAdjustments(sourceImageData, params);
    if (params.blur > 0) {
      processedData = applyBlur(processedData, width, height, params.blur);
    }
    if (params.dither !== 'none') {
      processedData = applyDithering(processedData, width, height, params.dither);
    }

    // Clear canvas
    ctx.fillStyle = params.background;
    ctx.fillRect(0, 0, width, height);

    // Generate grid and render
    const points = generateGrid(width, height, params);
    renderPoints(points, processedData, width, height, params);
  }

  // ===== IMAGE ADJUSTMENTS =====
  function applyImageAdjustments(imageData, params) {
    const data = new Uint8ClampedArray(imageData.data);
    const factor = (259 * (params.contrast + 255)) / (255 * (259 - params.contrast));

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // Gamma
      if (params.gamma !== 1) {
        r = 255 * Math.pow(r / 255, 1 / params.gamma);
        g = 255 * Math.pow(g / 255, 1 / params.gamma);
        b = 255 * Math.pow(b / 255, 1 / params.gamma);
      }

      // Contrast
      r = factor * (r - 128) + 128;
      g = factor * (g - 128) + 128;
      b = factor * (b - 128) + 128;

      // Brightness
      r += params.brightness;
      g += params.brightness;
      b += params.brightness;

      data[i] = Math.max(0, Math.min(255, r));
      data[i + 1] = Math.max(0, Math.min(255, g));
      data[i + 2] = Math.max(0, Math.min(255, b));
    }

    return data;
  }

  function applyBlur(data, width, height, radius) {
    // Simple box blur for performance
    const output = new Uint8ClampedArray(data);
    const r = Math.floor(radius);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let rSum = 0, gSum = 0, bSum = 0, count = 0;
        
        for (let dy = -r; dy <= r; dy++) {
          for (let dx = -r; dx <= r; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const i = (ny * width + nx) * 4;
              rSum += data[i];
              gSum += data[i + 1];
              bSum += data[i + 2];
              count++;
            }
          }
        }
        
        const i = (y * width + x) * 4;
        output[i] = rSum / count;
        output[i + 1] = gSum / count;
        output[i + 2] = bSum / count;
      }
    }
    
    return output;
  }

  // ===== DITHERING =====
  const bayerMatrix2 = [
    [0, 2],
    [3, 1]
  ];

  const bayerMatrix4 = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
  ];

  const bayerMatrix8 = [
    [0, 32, 8, 40, 2, 34, 10, 42],
    [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44, 4, 36, 14, 46, 6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22],
    [3, 35, 11, 43, 1, 33, 9, 41],
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47, 7, 39, 13, 45, 5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21]
  ];

  function applyDithering(data, width, height, type) {
    const output = new Uint8ClampedArray(data);
    
    if (type === 'bayer2' || type === 'bayer4' || type === 'bayer8') {
      const matrix = type === 'bayer2' ? bayerMatrix2 : 
                     type === 'bayer4' ? bayerMatrix4 : bayerMatrix8;
      const size = matrix.length;
      const divisor = size * size;
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          const threshold = (matrix[y % size][x % size] / divisor) * 255;
          const gray = getLuminance(data[i], data[i + 1], data[i + 2]) * 255;
          const value = gray > threshold ? 255 : 0;
          output[i] = output[i + 1] = output[i + 2] = value;
        }
      }
    } else if (type === 'floyd') {
      // Floyd-Steinberg error diffusion
      const errors = new Float32Array(width * height);
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          const gray = getLuminance(data[i], data[i + 1], data[i + 2]) * 255 + errors[y * width + x];
          const value = gray > 127 ? 255 : 0;
          const error = gray - value;
          
          output[i] = output[i + 1] = output[i + 2] = value;
          
          // Distribute error
          if (x + 1 < width) errors[y * width + (x + 1)] += error * 7 / 16;
          if (y + 1 < height) {
            if (x > 0) errors[(y + 1) * width + (x - 1)] += error * 3 / 16;
            errors[(y + 1) * width + x] += error * 5 / 16;
            if (x + 1 < width) errors[(y + 1) * width + (x + 1)] += error * 1 / 16;
          }
        }
      }
    }
    
    return output;
  }

  // ===== GRID GENERATION =====
  function generateGrid(width, height, params) {
    const points = [];
    const cellSize = params.spacing * params.gridSize;
    const cos = Math.cos(-params.angle);
    const sin = Math.sin(-params.angle);
    const cx = width / 2;
    const cy = height / 2;

    if (params.gridType === 'square') {
      for (let y = -cellSize; y < height + cellSize; y += cellSize) {
        for (let x = -cellSize; x < width + cellSize; x += cellSize) {
          const dx = x - cx;
          const dy = y - cy;
          const rx = dx * cos - dy * sin + cx;
          const ry = dx * sin + dy * cos + cy;
          
          if (rx >= -cellSize && rx < width + cellSize && 
              ry >= -cellSize && ry < height + cellSize) {
            points.push({ x: rx, y: ry });
          }
        }
      }
    } else if (params.gridType === 'hex') {
      const hexHeight = cellSize * Math.sqrt(3);
      for (let row = -2; row < height / hexHeight + 2; row++) {
        for (let col = -2; col < width / cellSize + 2; col++) {
          const x = col * cellSize * 1.5;
          const y = row * hexHeight + (col % 2) * hexHeight / 2;
          const dx = x - cx;
          const dy = y - cy;
          const rx = dx * cos - dy * sin + cx;
          const ry = dx * sin + dy * cos + cy;
          points.push({ x: rx, y: ry });
        }
      }
    } else if (params.gridType === 'radial') {
      const numRings = Math.floor(Math.max(width, height) / cellSize) + 2;
      for (let ring = 0; ring < numRings; ring++) {
        const radius = ring * cellSize;
        const circumference = 2 * Math.PI * radius;
        const numPoints = ring === 0 ? 1 : Math.floor(circumference / cellSize);
        for (let i = 0; i < numPoints; i++) {
          const angle = (i / numPoints) * 2 * Math.PI;
          const x = cx + radius * Math.cos(angle);
          const y = cy + radius * Math.sin(angle);
          points.push({ x, y });
        }
      }
    } else if (params.gridType === 'line') {
      for (let y = 0; y < height + cellSize; y += cellSize) {
        for (let x = 0; x < width; x += cellSize / 4) {
          const dx = x - cx;
          const dy = y - cy;
          const rx = dx * cos - dy * sin + cx;
          const ry = dx * sin + dy * cos + cy;
          points.push({ x: rx, y: ry });
        }
      }
    }

    // Apply displacement
    if (params.displacement > 0) {
      points.forEach(p => {
        const nx = p.x / params.spacing;
        const ny = p.y / params.spacing;
        const offsetX = noise2D(nx * 0.1, ny * 0.1) * params.displacement;
        const offsetY = noise2D(nx * 0.1 + 100, ny * 0.1 + 100) * params.displacement;
        p.x += offsetX;
        p.y += offsetY;
      });
    }

    return points;
  }

  // ===== POINT RENDERING =====
  function renderPoints(points, data, width, height, params) {
    points.forEach(point => {
      if (point.x < 0 || point.x >= width || point.y < 0 || point.y >= height) return;

      const px = Math.floor(point.x);
      const py = Math.floor(point.y);
      const i = (py * width + px) * 4;

      // Sample tone
      let tone = sampleTone(data[i], data[i + 1], data[i + 2], params.channel);
      
      // Add noise
      if (params.noise > 0) {
        const n = noise2D(point.x / params.noiseScale, point.y / params.noiseScale);
        tone = Math.max(0, Math.min(1, tone + n * params.noise));
      }
      
      const darkness = params.invert ? tone : 1 - tone;
      const radius = Math.sqrt(darkness) * params.spacing * params.dotSize + params.sizeOffset;

      if (radius > 0.1) {
        // Get color
        let color;
        if (params.colorMode === 'source') {
          color = rgbToHex(data[i], data[i + 1], data[i + 2]);
        } else if (params.colorMode === 'gradient') {
          color = sampleGradient(darkness, params.gradientPreset);
        } else {
          color = params.foreground;
        }

        ctx.fillStyle = color;
        drawShape(point.x, point.y, radius, params);
      }
    });
  }

  function sampleTone(r, g, b, channel) {
    switch (channel) {
      case 'red': return r / 255;
      case 'green': return g / 255;
      case 'blue': return b / 255;
      case 'alpha': return 1; // No alpha support yet
      case 'luminance':
      default:
        return getLuminance(r, g, b);
    }
  }

  function getLuminance(r, g, b) {
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }

  function sampleGradient(t, preset) {
    const colors = gradientPresets[preset] || gradientPresets.bw;
    const segments = colors.length - 1;
    const segment = Math.floor(t * segments);
    const localT = (t * segments) - segment;
    
    const c1 = hexToRgb(colors[Math.min(segment, colors.length - 1)]);
    const c2 = hexToRgb(colors[Math.min(segment + 1, colors.length - 1)]);
    
    const r = Math.floor(c1.r + (c2.r - c1.r) * localT);
    const g = Math.floor(c1.g + (c2.g - c1.g) * localT);
    const b = Math.floor(c1.b + (c2.b - c1.b) * localT);
    
    return rgbToHex(r, g, b);
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = Math.floor(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  // ===== SHAPE DRAWING =====
  function drawShape(x, y, radius, params) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(params.shapeRotation);

    switch (params.shape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'square':
        drawRoundedRect(-radius, -radius, radius * 2, radius * 2, radius * params.rounding);
        break;
        
      case 'triangle':
        drawPolygon(radius, 3, params.rounding);
        break;
        
      case 'diamond':
        ctx.save();
        ctx.rotate(Math.PI / 4);
        drawRoundedRect(-radius, -radius, radius * 2, radius * 2, radius * params.rounding);
        ctx.restore();
        break;
        
      case 'ellipse':
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 1.4, radius * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'cross':
        const w = radius * 0.4;
        ctx.fillRect(-w, -radius, w * 2, radius * 2);
        ctx.fillRect(-radius, -w, radius * 2, w * 2);
        break;
        
      case 'star':
        drawStar(radius, 5, 0.5);
        break;
        
      case 'line':
        ctx.beginPath();
        ctx.moveTo(-radius, 0);
        ctx.lineTo(radius, 0);
        ctx.lineWidth = Math.max(1, radius * 0.3);
        ctx.stroke();
        break;
    }

    ctx.restore();
  }

  function drawRoundedRect(x, y, width, height, radius) {
    if (radius === 0) {
      ctx.fillRect(x, y, width, height);
      return;
    }
    
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  }

  function drawPolygon(radius, sides, rounding) {
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }

  function drawStar(radius, points, innerRadius) {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 === 0 ? radius : radius * innerRadius;
      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }

  // ===== NOISE =====
  function noise2D(x, y) {
    const key = `${Math.floor(x * 10)},${Math.floor(y * 10)}`;
    if (noiseCache[key] === undefined) {
      // Simple pseudo-random noise
      const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      noiseCache[key] = (n - Math.floor(n)) * 2 - 1;
    }
    return noiseCache[key];
  }

  // ===== PRESETS & RANDOMIZATION =====
  function applyPreset(name) {
    const preset = presets[name];
    if (!preset) return;

    Object.keys(preset).forEach(key => {
      const control = controls[key];
      if (!control) return;
      
      if (control.type === 'checkbox') {
        control.checked = preset[key];
      } else {
        control.value = preset[key];
      }
      
      if (control.type === 'range') {
        updateValueDisplay(control);
      }
    });

    updateColorModeUI();
    renderHalftone();
  }

  function randomizeSettings() {
    const randomInRange = (min, max, step = 1) => {
      const range = (max - min) / step;
      return min + Math.floor(Math.random() * (range + 1)) * step;
    };

    const randomChoice = arr => arr[Math.floor(Math.random() * arr.length)];

    controls.gridType.value = randomChoice(['square', 'hex', 'radial', 'line']);
    controls.spacing.value = randomInRange(4, 20);
    controls.angle.value = randomInRange(0, 360, 15);
    controls.gridSize.value = (0.5 + Math.random() * 1.5).toFixed(1);
    controls.shape.value = randomChoice(['circle', 'square', 'triangle', 'diamond', 'ellipse', 'cross', 'star']);
    controls.dotSize.value = (0.3 + Math.random() * 1).toFixed(2);
    controls.sizeOffset.value = randomInRange(-2, 5);
    controls.shapeRotation.value = randomInRange(0, 360, 15);
    controls.rounding.value = (Math.random() * 0.5).toFixed(2);
    controls.blur.value = randomInRange(0, 8);
    controls.gamma.value = (0.6 + Math.random() * 1.8).toFixed(1);
    controls.contrast.value = randomInRange(-30, 60, 10);
    controls.brightness.value = randomInRange(-30, 30, 10);
    controls.channel.value = randomChoice(['luminance', 'red', 'green', 'blue']);
    controls.colorMode.value = randomChoice(['two-colors', 'gradient', 'source']);
    controls.invert.checked = Math.random() > 0.7;
    controls.dither.value = randomChoice(['none', 'bayer2', 'bayer4', 'floyd']);
    controls.displacement.value = randomInRange(0, 10);
    controls.noise.value = (Math.random() * 0.2).toFixed(2);

    // Random colors
    const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    controls.foreground.value = randomColor();
    controls.background.value = randomColor();
    controls.gradientPreset.value = randomChoice(Object.keys(gradientPresets));

    Object.values(controls).forEach(ctrl => {
      if (ctrl.type === 'range') updateValueDisplay(ctrl);
    });

    updateColorModeUI();
    renderHalftone();
  }

  function resetSettings() {
    applyPreset('classic');
    controls.foreground.value = '#000000';
    controls.background.value = '#ffffff';
  }

  // ===== EXPORT =====
  function downloadPNG() {
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'halftone-' + Date.now() + '.png';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  function downloadSVG() {
    if (!sourceImageData) return;

    const width = canvas.width;
    const height = canvas.height;
    const params = {
      gridType: controls.gridType.value,
      spacing: parseFloat(controls.spacing.value),
      angle: parseFloat(controls.angle.value) * (Math.PI / 180),
      gridSize: parseFloat(controls.gridSize.value),
      shape: controls.shape.value,
      dotSize: parseFloat(controls.dotSize.value),
      sizeOffset: parseFloat(controls.sizeOffset.value),
      shapeRotation: parseFloat(controls.shapeRotation.value) * (Math.PI / 180),
      rounding: parseFloat(controls.rounding.value),
      channel: controls.channel.value,
      colorMode: controls.colorMode.value,
      foreground: controls.foreground.value,
      background: controls.background.value,
      gradientPreset: controls.gradientPreset.value,
      invert: controls.invert.checked,
      displacement: parseFloat(controls.displacement.value),
      noise: parseFloat(controls.noise.value),
      noiseScale: parseFloat(controls.noiseScale.value)
    };

    let processedData = applyImageAdjustments(sourceImageData, params);
    const points = generateGrid(width, height, params);

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
    svg += `<rect width="${width}" height="${height}" fill="${params.background}"/>`;

    points.forEach(point => {
      if (point.x < 0 || point.x >= width || point.y < 0 || point.y >= height) return;
      
      const px = Math.floor(point.x);
      const py = Math.floor(point.y);
      const i = (py * width + px) * 4;
      
      let tone = sampleTone(processedData[i], processedData[i + 1], processedData[i + 2], params.channel);
      if (params.noise > 0) {
        const n = noise2D(point.x / params.noiseScale, point.y / params.noiseScale);
        tone = Math.max(0, Math.min(1, tone + n * params.noise));
      }
      
      const darkness = params.invert ? tone : 1 - tone;
      const radius = Math.sqrt(darkness) * params.spacing * params.dotSize + params.sizeOffset;

      if (radius > 0.1) {
        let color = params.foreground;
        if (params.colorMode === 'gradient') {
          color = sampleGradient(darkness, params.gradientPreset);
        }
        
        if (params.shape === 'circle') {
          svg += `<circle cx="${point.x}" cy="${point.y}" r="${radius}" fill="${color}"/>`;
        } else {
          svg += `<rect x="${point.x - radius}" y="${point.y - radius}" width="${radius * 2}" height="${radius * 2}" fill="${color}"/>`;
        }
      }
    });

    svg += '</svg>';

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'halftone-' + Date.now() + '.svg';
    a.click();
    URL.revokeObjectURL(url);
  }

  function resetToUpload() {
    sourceImage = null;
    sourceImageData = null;
    fileInput.value = '';
    uploadZone.style.display = 'block';
    halftoneMain.style.display = 'none';
    noiseCache = {};
    resetSettings();
  }

  // Initialize
  init();
  updateColorModeUI();
})();
