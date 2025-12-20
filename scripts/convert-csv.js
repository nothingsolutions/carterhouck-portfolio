#!/usr/bin/env node

/**
 * CSV to JSON Converter for Portfolio Projects
 * 
 * Usage: npm run convert-data
 * 
 * Reads: data/projects.csv (exported from Google Sheets)
 * Outputs: data/projects.json
 * 
 * Expected CSV columns:
 * Image, Item, Client, Category, Role, Date, Program, Supplier, Notes, Image 2, Image 3, Status
 */

const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, '..', 'data', 'projects.csv');
const JSON_PATH = path.join(__dirname, '..', 'data', 'projects.json');

function parseCSV(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) {
    console.error('CSV file is empty or has no data rows');
    process.exit(1);
  }

  // Parse header row
  const headers = parseCSVLine(lines[0]);
  
  // Parse data rows
  const projects = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0 || values.every(v => !v.trim())) continue;
    
    const row = {};
    headers.forEach((header, index) => {
      row[header.trim()] = values[index]?.trim() || '';
    });
    
    projects.push(row);
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

function convertToProjectFormat(rawProjects) {
  return rawProjects.map((row, index) => {
    // Collect all images into an array, filtering out empty ones
    const images = [
      row['Image'] || row['image'] || '',
      row['Image 2'] || row['image 2'] || '',
      row['Image 3'] || row['image 3'] || '',
    ].filter(img => img.trim() !== '');

    // Convert Google Drive links to direct image URLs if needed
    const processedImages = images.map(convertGoogleDriveUrl);

    return {
      id: String(index + 1),
      images: processedImages,
      item: row['Item'] || row['item'] || '',
      client: row['Client'] || row['client'] || '',
      category: row['Category'] || row['category'] || '',
      role: row['Role'] || row['role'] || '',
      date: row['Date'] || row['date'] || '',
      program: row['Program'] || row['program'] || '',
      supplier: row['Supplier'] || row['supplier'] || '',
      notes: row['Notes'] || row['notes'] || '',
      status: row['Status'] || row['status'] || 'Complete',
    };
  });
}

function convertGoogleDriveUrl(url) {
  if (!url) return url;
  
  // Convert Google Drive share URLs to direct image URLs
  // Format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // To: https://drive.google.com/uc?id=FILE_ID
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch) {
    return `https://drive.google.com/uc?id=${driveMatch[1]}`;
  }
  
  // Already in correct format or not a Google Drive URL
  return url;
}

function main() {
  console.log('📊 Converting CSV to JSON...\n');

  // Check if CSV file exists
  if (!fs.existsSync(CSV_PATH)) {
    console.error(`❌ CSV file not found at: ${CSV_PATH}`);
    console.log('\nTo use this script:');
    console.log('1. Export your Google Sheets as CSV (File → Download → CSV)');
    console.log('2. Save it as: data/projects.csv');
    console.log('3. Run: npm run convert-data\n');
    process.exit(1);
  }

  // Read and parse CSV
  const csvContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const rawProjects = parseCSV(csvContent);
  console.log(`📄 Found ${rawProjects.length} projects in CSV`);

  // Convert to project format
  const projects = convertToProjectFormat(rawProjects);

  // Write JSON
  fs.writeFileSync(JSON_PATH, JSON.stringify(projects, null, 2));
  console.log(`✅ Wrote ${projects.length} projects to: ${JSON_PATH}\n`);

  // Show preview
  console.log('Preview of first project:');
  console.log(JSON.stringify(projects[0], null, 2));
}

main();

