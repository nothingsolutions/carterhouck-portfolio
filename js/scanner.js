/**
 * Scanner Machine - A scanner emulator
 * Simulates flatbed scanner effects including scan lines, distortion, and artifacts
 */

(function() {
  'use strict';

  // ===== DOM ELEMENTS =====
  const uploadZone = document.getElementById('upload-zone');
  const fileInput = document.getElementById('file-input');
  const canvasWrapper = document.getElementById('canvas-wrapper');
  const canvas = document.getElementById('scanner-canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  // Buttons
  const btnUpload = document.getElementById('btn-upload');
  const btnNewImage = document.getElementById('btn-new-image');
  const btnExportPng = document.getElementById('btn-export-png');
  const btnRandomize = document.getElementById('btn-randomize');
  const btnReset = document.getElementById('btn-reset');

  // Controls
  const controls = {
    scanlines: document.getElementById('ctrl-scanlines'),
    distortion: document.getElementById('ctrl-distortion'),
    streaks: document.getElementById('ctrl-streaks'),
    offset: document.getElementById('ctrl-offset'),
    contrast: document.getElementById('ctrl-contrast'),
    brightness: document.getElementById('ctrl-brightness'),
    exposure: document.getElementById('ctrl-exposure'),
    gamma: document.getElementById('ctrl-gamma'),
    blur: document.getElementById('ctrl-blur'),
    vibrance: document.getElementById('ctrl-vibrance'),
    texture: document.getElementById('ctrl-texture'),
    textureOpacity: document.getElementById('ctrl-texture-opacity'),
    bw: document.getElementById('ctrl-bw'),
    noise: document.getElementById('ctrl-noise'),
    cmyk: document.getElementById('ctrl-cmyk'),
    inksmear: document.getElementById('ctrl-inksmear')
  };

  // State
  let sourceImage = null;
  let processedCanvas = null;
  let textureImages = {};
  let isProcessing = false;

  // Default values
  const defaultValues = {
    scanlines: 3,
    distortion: 5,
    streaks: 2,
    offset: 0.5,
    contrast: 126,
    brightness: -5,
    exposure: 0,
    gamma: 1.0,
    blur: 0.6,
    vibrance: 0,
    texture: 'white-copy',
    textureOpacity: 30,
    bw: false,
    noise: 0,
    cmyk: 0,
    inksmear: 0
  };

  // Presets
  const presets = {
    standard: {
      scanlines: 3, distortion: 5, streaks: 2, offset: 0.5,
      contrast: 126, brightness: -5, exposure: 0, gamma: 1.0, blur: 0.6,
      vibrance: 0, texture: 'white-copy', textureOpacity: 30, bw: false,
      noise: 0, cmyk: 0, inksmear: 0
    },
    overexposed: {
      scanlines: 38, distortion: 0, streaks: 0, offset: 0.5,
      contrast: 86, brightness: 15, exposure: 0.8, gamma: 1.0, blur: 0,
      vibrance: 0, texture: 'recycled-beige', textureOpacity: 87, bw: false,
      noise: 0, cmyk: 74, inksmear: 39
    },
    vintage: {
      scanlines: 15, distortion: 20, streaks: 30, offset: 1.2,
      contrast: 140, brightness: -10, exposure: 0.2, gamma: 1.3, blur: 1.5,
      vibrance: -40, texture: 'aged-book', textureOpacity: 60, bw: false,
      noise: 25, cmyk: 20, inksmear: 15
    },
    glitch: {
      scanlines: 45, distortion: 45, streaks: 60, offset: 1.8,
      contrast: 180, brightness: 0, exposure: 0.3, gamma: 0.9, blur: 0,
      vibrance: 50, texture: 'film-grain', textureOpacity: 20, bw: false,
      noise: 80, cmyk: 5, inksmear: 5
    },
    soft: {
      scanlines: 0, distortion: 0, streaks: 2, offset: 0.09,
      contrast: 111, brightness: -5, exposure: 0.02, gamma: 2.14, blur: 0.6,
      vibrance: -33, texture: 'creased-white', textureOpacity: 38, bw: false,
      noise: 0, cmyk: 0, inksmear: 0
    },
    harsh: {
      scanlines: 60, distortion: 35, streaks: 80, offset: 1.5,
      contrast: 200, brightness: 20, exposure: 0.5, gamma: 0.7, blur: 0,
      vibrance: 80, texture: 'crumpled-olive', textureOpacity: 50, bw: false,
      noise: 100, cmyk: 40, inksmear: 50
    }
  };

  // ===== INITIALIZATION =====
  function init() {
    setupEventListeners();
    setupSectionToggles();
    loadTextures();
    updateValueDisplays();
  }

  function setupEventListeners() {
    // Upload
    btnUpload.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    uploadZone.addEventListener('click', () => fileInput.click());
    uploadZone.addEventListener('dragover', handleDragOver);
    uploadZone.addEventListener('dragleave', handleDragLeave);
    uploadZone.addEventListener('drop', handleDrop);

    // Controls - attach event listeners to all sliders
    Object.keys(controls).forEach(key => {
      const control = controls[key];
      if (control && (control.type === 'range' || control.type === 'checkbox' || control.tagName === 'SELECT')) {
        control.addEventListener('input', handleControlChange);
        control.addEventListener('change', handleControlChange);
      }
    });

    // Buttons
    btnNewImage.addEventListener('click', resetToUpload);
    btnExportPng.addEventListener('click', exportPNG);
    btnRandomize.addEventListener('click', randomizeAll);
    btnReset.addEventListener('click', resetAll);

    // Presets
    document.querySelectorAll('.scanner-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const presetName = btn.dataset.preset;
        applyPreset(presetName);
      });
    });
  }

  function setupSectionToggles() {
    document.querySelectorAll('.scanner-section-title').forEach(title => {
      title.addEventListener('click', () => {
        const section = title.parentElement;
        const toggle = title.querySelector('.scanner-section-toggle');
        section.classList.toggle('collapsed');
        toggle.textContent = section.classList.contains('collapsed') ? '+' : '−';
      });
    });
  }

  // ===== FILE HANDLING =====
  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      loadImageFile(file);
    }
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
    if (file && file.type.startsWith('image/')) {
      loadImageFile(file);
    }
  }

  function loadImageFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        sourceImage = img;
        showCanvas();
        processImage();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function showCanvas() {
    uploadZone.style.display = 'none';
    canvasWrapper.classList.add('active');
    btnNewImage.style.display = 'block';
    btnExportPng.disabled = false;
  }

  function resetToUpload() {
    uploadZone.style.display = 'flex';
    canvasWrapper.classList.remove('active');
    btnNewImage.style.display = 'none';
    btnExportPng.disabled = true;
    sourceImage = null;
    fileInput.value = '';
  }

  // ===== TEXTURE LOADING =====
  function loadTextures() {
    // Load real scanned paper textures (CC0 from ambientCG and Wikimedia Commons)
    const textureFiles = {
      'white-copy': 'images/scanner/paper/white-copy-paper.webp',
      'recycled-beige': 'images/scanner/paper/recycled-fiber-beige.webp',
      'creased-white': 'images/scanner/paper/creased-white.webp',
      'kraft-ribbed': 'images/scanner/paper/kraft-ribbed.webp',
      'manila-cardstock': 'images/scanner/paper/manila-cardstock.webp',
      'kraft-brown': 'images/scanner/paper/kraft-brown.webp',
      'cardboard': 'images/scanner/paper/cardboard-corrugated.webp',
      'crumpled-white': 'images/scanner/paper/crumpled-white.webp',
      'aged-book': 'images/scanner/paper/aged-fiber-page.webp',
      'crumpled-olive': 'images/scanner/paper/crumpled-olive.webp'
    };

    // Load each texture asynchronously
    Object.keys(textureFiles).forEach(key => {
      const img = new Image();
      img.onload = () => {
        textureImages[key] = img;
      };
      img.onerror = () => {
        console.error(`Failed to load texture: ${textureFiles[key]}`);
        // Fallback to procedural texture
        textureImages[key] = generateFallbackTexture();
      };
      img.src = textureFiles[key];
    });
    
    // Add procedural Film Grain texture
    textureImages['film-grain'] = generateFilmGrainTexture();
  }

  function generateFilmGrainTexture() {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 512;
    tempCanvas.height = 512;
    const tempCtx = tempCanvas.getContext('2d');
    const imageData = tempCtx.createImageData(512, 512);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const value = Math.random() * 255;
      data[i] = value;
      data[i + 1] = value;
      data[i + 2] = value;
      data[i + 3] = 255;
    }

    tempCtx.putImageData(imageData, 0, 0);
    return tempCanvas;
  }

  function generateFallbackTexture() {
    // Simple fallback texture if loading fails
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 512;
    tempCanvas.height = 512;
    const tempCtx = tempCanvas.getContext('2d');
    const imageData = tempCtx.createImageData(512, 512);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 0.25 * 255;
      const value = 255 + noise;
      data[i] = value;
      data[i + 1] = value;
      data[i + 2] = value;
      data[i + 3] = 255;
    }

    tempCtx.putImageData(imageData, 0, 0);
    return tempCanvas;
  }

  // ===== CONTROL HANDLING =====
  function handleControlChange(e) {
    updateValueDisplays();
    if (sourceImage) {
      processImage();
    }
  }

  function updateValueDisplays() {
    Object.keys(controls).forEach(key => {
      const control = controls[key];
      const valueSpan = document.getElementById('value-' + key);
      if (valueSpan && control) {
        if (control.type === 'range') {
          valueSpan.textContent = control.value;
        } else if (control.type === 'checkbox') {
          // Checkbox doesn't need value display
        }
      }
    });
  }

  function getControlValues() {
    const values = {};
    Object.keys(controls).forEach(key => {
      const control = controls[key];
      if (control) {
        if (control.type === 'range') {
          values[key] = parseFloat(control.value);
        } else if (control.type === 'checkbox') {
          values[key] = control.checked;
        } else if (control.tagName === 'SELECT') {
          values[key] = control.value;
        }
      }
    });
    return values;
  }

  function setControlValues(values) {
    Object.keys(values).forEach(key => {
      const control = controls[key];
      if (control) {
        if (control.type === 'range') {
          control.value = values[key];
        } else if (control.type === 'checkbox') {
          control.checked = values[key];
        } else if (control.tagName === 'SELECT') {
          control.value = values[key];
        }
      }
    });
    updateValueDisplays();
  }

  // ===== PRESETS =====
  function applyPreset(presetName) {
    if (presets[presetName]) {
      setControlValues(presets[presetName]);
      if (sourceImage) {
        processImage();
      }
    }
  }

  function randomizeAll() {
    const textures = ['none', 'white-copy', 'recycled-beige', 'creased-white', 'kraft-ribbed',
                      'manila-cardstock', 'kraft-brown', 'cardboard', 'crumpled-white', 
                      'aged-book', 'crumpled-olive', 'film-grain'];
    const randomValues = {
      scanlines: Math.floor(Math.random() * 101),
      distortion: Math.floor(Math.random() * 61),
      streaks: Math.floor(Math.random() * 101),
      offset: Math.random() * 2,
      contrast: Math.floor(Math.random() * 221),
      brightness: Math.floor(Math.random() * 181) - 90,
      exposure: Math.random() * 4 - 2,
      gamma: Math.random() * 2.7 + 0.3,
      blur: Math.random() * 10,
      vibrance: Math.floor(Math.random() * 201) - 100,
      texture: textures[Math.floor(Math.random() * textures.length)],
      textureOpacity: Math.floor(Math.random() * 101),
      bw: Math.random() > 0.5,
      noise: Math.floor(Math.random() * 121),
      cmyk: Math.floor(Math.random() * 101),
      inksmear: Math.floor(Math.random() * 101)
    };
    setControlValues(randomValues);
    if (sourceImage) {
      processImage();
    }
  }

  function resetAll() {
    setControlValues(defaultValues);
    if (sourceImage) {
      processImage();
    }
  }

  // ===== IMAGE PROCESSING =====
  function processImage() {
    if (isProcessing || !sourceImage) return;
    isProcessing = true;

    requestAnimationFrame(() => {
      const values = getControlValues();
      
      // Set canvas size
      const maxWidth = 1200;
      const maxHeight = 1200;
      let width = sourceImage.width;
      let height = sourceImage.height;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      
      canvas.width = width;
      canvas.height = height;

      // Create working canvas
      const workCanvas = document.createElement('canvas');
      workCanvas.width = width;
      workCanvas.height = height;
      const workCtx = workCanvas.getContext('2d', { willReadFrequently: true });

      // Draw source image
      workCtx.drawImage(sourceImage, 0, 0, width, height);

      // Get image data
      let imageData = workCtx.getImageData(0, 0, width, height);

      // Apply effects in order
      imageData = applyExposure(imageData, values.exposure);
      imageData = applyGamma(imageData, values.gamma);
      imageData = applyBrightness(imageData, values.brightness);
      imageData = applyContrast(imageData, values.contrast);
      imageData = applyVibrance(imageData, values.vibrance);
      
      if (values.bw) {
        imageData = applyBlackAndWhite(imageData);
      }

      // Put back to working canvas for blur and distortion
      workCtx.putImageData(imageData, 0, 0);

      // Apply blur
      if (values.blur > 0) {
        workCtx.filter = `blur(${values.blur}px)`;
        workCtx.drawImage(workCanvas, 0, 0);
        workCtx.filter = 'none';
      }

      // Apply distortion (horizontal displacement)
      if (values.distortion > 0) {
        applyDistortion(workCtx, width, height, values.distortion, values.offset);
      }

      // Get final image data for remaining effects
      imageData = workCtx.getImageData(0, 0, width, height);

      // Apply scan lines
      if (values.scanlines > 0) {
        imageData = applyScanLines(imageData, values.scanlines);
      }

      // Apply scanner streaks
      if (values.streaks > 0) {
        imageData = applyScannerStreaks(imageData, values.streaks);
      }

      // Apply noise
      if (values.noise > 0) {
        imageData = applyNoise(imageData, values.noise);
      }

      // Apply CMYK screen effect
      if (values.cmyk > 0) {
        imageData = applyCMYKScreen(imageData, values.cmyk);
      }

      // Apply ink smear
      if (values.inksmear > 0) {
        imageData = applyInkSmear(imageData, values.inksmear);
      }

      // Put processed image back
      ctx.putImageData(imageData, 0, 0);

      // Apply texture overlay
      if (values.texture !== 'none' && textureImages[values.texture] && values.textureOpacity > 0) {
        applyTexture(ctx, width, height, values.texture, values.textureOpacity);
      }

      isProcessing = false;
    });
  }

  // ===== EFFECT FUNCTIONS =====
  
  function applyExposure(imageData, exposure) {
    if (exposure === 0) return imageData;
    const data = imageData.data;
    const factor = Math.pow(2, exposure);
    
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * factor);
      data[i + 1] = Math.min(255, data[i + 1] * factor);
      data[i + 2] = Math.min(255, data[i + 2] * factor);
    }
    return imageData;
  }

  function applyGamma(imageData, gamma) {
    if (gamma === 1) return imageData;
    const data = imageData.data;
    const gammaCorrection = 1 / gamma;
    
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 * Math.pow(data[i] / 255, gammaCorrection);
      data[i + 1] = 255 * Math.pow(data[i + 1] / 255, gammaCorrection);
      data[i + 2] = 255 * Math.pow(data[i + 2] / 255, gammaCorrection);
    }
    return imageData;
  }

  function applyBrightness(imageData, brightness) {
    if (brightness === 0) return imageData;
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.max(0, Math.min(255, data[i] + brightness));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + brightness));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + brightness));
    }
    return imageData;
  }

  function applyContrast(imageData, contrast) {
    const data = imageData.data;
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.max(0, Math.min(255, factor * (data[i] - 128) + 128));
      data[i + 1] = Math.max(0, Math.min(255, factor * (data[i + 1] - 128) + 128));
      data[i + 2] = Math.max(0, Math.min(255, factor * (data[i + 2] - 128) + 128));
    }
    return imageData;
  }

  function applyVibrance(imageData, vibrance) {
    if (vibrance === 0) return imageData;
    const data = imageData.data;
    const amount = vibrance / 100;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const max = Math.max(r, g, b);
      const avg = (r + g + b) / 3;
      const amt = ((Math.abs(max - avg) * 2 / 255) * amount);
      
      if (r !== max) data[i] += (max - r) * amt;
      if (g !== max) data[i + 1] += (max - g) * amt;
      if (b !== max) data[i + 2] += (max - b) * amt;
    }
    return imageData;
  }

  function applyBlackAndWhite(imageData) {
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }
    return imageData;
  }

  function applyDistortion(ctx, width, height, distortion, offset) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(ctx.canvas, 0, 0);

    ctx.clearRect(0, 0, width, height);

    const distortionAmount = distortion / 2;
    const frequency = 0.01 + offset * 0.01;

    for (let y = 0; y < height; y++) {
      const displacement = Math.sin(y * frequency) * distortionAmount;
      ctx.drawImage(tempCanvas, displacement, y, width, 1, 0, y, width, 1);
    }
  }

  function applyScanLines(imageData, intensity) {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const lineSpacing = Math.max(2, Math.floor(100 / (intensity + 1)));
    const lineIntensity = intensity / 100;

    for (let y = 0; y < height; y += lineSpacing) {
      const lineThickness = Math.max(1, Math.floor(intensity / 20));
      for (let t = 0; t < lineThickness && (y + t) < height; t++) {
        for (let x = 0; x < width; x++) {
          const i = ((y + t) * width + x) * 4;
          const darken = 1 - (lineIntensity * 0.3);
          data[i] *= darken;
          data[i + 1] *= darken;
          data[i + 2] *= darken;
        }
      }
    }
    return imageData;
  }

  function applyScannerStreaks(imageData, intensity) {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const streakCount = Math.floor(intensity / 2);

    for (let s = 0; s < streakCount; s++) {
      const x = Math.floor(Math.random() * width);
      const streakIntensity = (Math.random() * 0.5 + 0.5) * intensity / 100;
      const streakWidth = Math.floor(Math.random() * 3) + 1;

      for (let w = 0; w < streakWidth && (x + w) < width; w++) {
        for (let y = 0; y < height; y++) {
          const i = (y * width + (x + w)) * 4;
          const adjust = 1 - streakIntensity * 0.4;
          data[i] *= adjust;
          data[i + 1] *= adjust;
          data[i + 2] *= adjust;
        }
      }
    }
    return imageData;
  }

  function applyNoise(imageData, intensity) {
    const data = imageData.data;
    const amount = intensity / 100;

    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * amount * 255;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
    return imageData;
  }

  function applyCMYKScreen(imageData, intensity) {
    const data = imageData.data;
    const width = imageData.width;
    const amount = intensity / 100;
    const dotSize = 4;

    for (let y = 0; y < imageData.height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        
        if ((x % dotSize === 0) && (y % dotSize === 0) && Math.random() < amount) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Simple CMYK-like color separation
          const c = 255 - r;
          const m = 255 - g;
          const yel = 255 - b;
          
          data[i] = Math.max(0, r - c * amount * 0.3);
          data[i + 1] = Math.max(0, g - m * amount * 0.3);
          data[i + 2] = Math.max(0, b - yel * amount * 0.3);
        }
      }
    }
    return imageData;
  }

  function applyInkSmear(imageData, intensity) {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const amount = intensity / 100;

    const tempData = new Uint8ClampedArray(data);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        if (Math.random() < amount * 0.1) {
          const i = (y * width + x) * 4;
          const offset = Math.random() > 0.5 ? 1 : -1;
          const iOffset = (y * width + (x + offset)) * 4;

          data[i] = (tempData[i] + tempData[iOffset]) / 2;
          data[i + 1] = (tempData[i + 1] + tempData[iOffset + 1]) / 2;
          data[i + 2] = (tempData[i + 2] + tempData[iOffset + 2]) / 2;
        }
      }
    }
    return imageData;
  }

  function applyTexture(ctx, width, height, textureName, opacity) {
    const texture = textureImages[textureName];
    if (!texture) return;

    // Create temporary canvas for texture
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');

    // Scale and draw texture to fill canvas
    const textureAspect = texture.width / texture.height;
    const canvasAspect = width / height;
    
    let drawWidth, drawHeight, offsetX, offsetY;
    
    // Cover the entire canvas
    if (canvasAspect > textureAspect) {
      drawWidth = width;
      drawHeight = width / textureAspect;
      offsetX = 0;
      offsetY = (height - drawHeight) / 2;
    } else {
      drawHeight = height;
      drawWidth = height * textureAspect;
      offsetX = (width - drawWidth) / 2;
      offsetY = 0;
    }
    
    tempCtx.drawImage(texture, offsetX, offsetY, drawWidth, drawHeight);

    // Apply with multiply blend for paper tone and fibers
    ctx.globalAlpha = opacity / 100;
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(tempCanvas, 0, 0);
    
    // Add subtle overlay for creases and texture details
    ctx.globalAlpha = (opacity / 100) * 0.3;
    ctx.globalCompositeOperation = 'overlay';
    ctx.drawImage(tempCanvas, 0, 0);
    
    // Reset
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  // ===== EXPORT =====
  function exportPNG() {
    if (!sourceImage) return;

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'scanned-image.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  // ===== START =====
  init();

})();
