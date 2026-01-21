const fs = require('fs');
const path = require('path');

const JSON_PATH = path.join(__dirname, '..', 'data', 'projects.json');

console.log('Reading projects.json...');
const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

// Wrap array in object if it's an array
const wrapped = Array.isArray(data) ? { projects: data } : data;

console.log(`Restructuring ${Array.isArray(data) ? data.length : 'existing'} projects...`);
fs.writeFileSync(JSON_PATH, JSON.stringify(wrapped, null, 2));

console.log('✅ File restructured successfully!');
console.log('New structure:', Object.keys(wrapped)[0], 'with', wrapped.projects?.length || 'unknown', 'projects');

