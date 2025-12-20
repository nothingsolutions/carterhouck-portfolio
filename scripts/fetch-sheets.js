#!/usr/bin/env node

/**
 * Fetch Projects from Published Google Sheets
 * 
 * Usage: npm run sync
 * 
 * This script fetches data directly from your published Google Sheet,
 * converts it to JSON, and saves it to data/projects.json
 * 
 * No manual CSV export required!
 */

const fs = require('fs');
const path = require('path');

// Your published Google Sheet URL (CSV format)
const SHEETS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQd2YAWCp0hNl_EOvZfTQATq8Kpk79SgD_QssB7G8O343OpeVOf9XqEMKIyN7BU_o5cclmfQ5Ak743b/pub?output=csv';

const JSON_PATH = path.join(__dirname, '..', 'data', 'projects.json');

async function fetchSheets() {
  console.log('📊 Fetching data from Google Sheets...\n');

  try {
    const response = await fetch(SHEETS_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    
    const csvContent = await response.text();
    const projects = parseAndConvert(csvContent);
    
    // Write JSON
    fs.writeFileSync(JSON_PATH, JSON.stringify(projects, null, 2));
    console.log(`✅ Synced ${projects.length} projects from Google Sheets\n`);
    
    // Show preview
    const withImages = projects.filter(p => p.images.length > 0).length;
    console.log(`📸 Projects with images: ${withImages}/${projects.length}`);
    console.log(`📁 Saved to: ${JSON_PATH}\n`);
    
    if (projects.length > 0) {
      console.log('Preview of first project:');
      console.log(JSON.stringify(projects[0], null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error fetching from Google Sheets:', error.message);
    console.log('\nMake sure your Google Sheet is published:');
    console.log('1. In Google Sheets, go to File → Share → Publish to the web');
    console.log('2. Select the sheet and choose "Comma-separated values (.csv)"');
    console.log('3. Click Publish\n');
    process.exit(1);
  }
}

function parseAndConvert(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);
  const projects = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0 || values.every(v => !v.trim())) continue;

    const row = {};
    headers.forEach((header, index) => {
      row[header.trim()] = values[index]?.trim() || '';
    });

    // Collect images into array
    const images = [
      row['Image'] || '',
      row['Image 2'] || '',
      row['Image 3'] || '',
    ].filter(img => img.trim() !== '').map(convertGoogleDriveUrl);

    projects.push({
      id: String(i),
      images,
      item: row['Item'] || '',
      client: row['Client'] || '',
      category: row['Category'] || '',
      role: row['Role'] || '',
      date: row['Date'] || '',
      program: row['Program'] || '',
      supplier: row['Supplier'] || '',
      notes: row['Notes'] || '',
      status: row['Status'] || 'Public',
    });
  }

  return projects;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function convertGoogleDriveUrl(url) {
  if (!url) return url;
  
  // Convert Google Drive share URLs to direct image URLs
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch) {
    return `https://drive.google.com/uc?id=${driveMatch[1]}`;
  }
  
  return url;
}

fetchSheets();

