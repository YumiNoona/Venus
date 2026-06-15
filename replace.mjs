
import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', '.next', '.git'].includes(file)) {
        walk(fullPath, callback);
      }
    } else {
      if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
        callback(fullPath);
      }
    }
  }
}

const replacements = [
  { from: /bg-\[color:var\(--bg\)\]/g, to: 'bg-bg' },
  { from: /bg-\[color:var\(--bg-soft\)\]/g, to: 'bg-bg-soft' },
  { from: /bg-\[color:var\(--surface\)\]/g, to: 'bg-bg-soft' },
  { from: /bg-\[color:var\(--surface-hover\)\]/g, to: 'bg-bg-soft' },
  { from: /text-\[color:var\(--text\)\]/g, to: 'text-text' },
  { from: /text-\[color:var\(--text-primary\)\]/g, to: 'text-text' },
  { from: /text-\[color:var\(--text-secondary\)\]/g, to: 'text-text-secondary' },
  { from: /border-\[color:var\(--border\)\]/g, to: 'border-border' },
  { from: /bg-\[color:var\(--primary\)\]/g, to: 'bg-primary' },
  { from: /text-\[color:var\(--primary\)\]/g, to: 'text-primary' },
  { from: /border-\[color:var\(--primary\)\]/g, to: 'border-primary' },
  { from: /bg-\[color:var\(--accent\)\]/g, to: 'bg-accent' },
  { from: /text-\[color:var\(--accent\)\]/g, to: 'text-accent' },
  { from: /border-\[color:var\(--accent\)\]/g, to: 'border-accent' },
  { from: /shadow-\[color:var\(--accent\)\]/g, to: 'shadow-accent' },
  { from: /shadow-\[color:var\(--primary\)\]/g, to: 'shadow-primary' },
  { from: /bg-\[color:var\(--danger-soft\)\]/g, to: 'bg-red-500/10' },
  { from: /fill-\[color:var\(--accent\)\]/g, to: 'fill-accent' }
];

let changedFiles = 0;

walk('./', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  for (const r of replacements) {
    content = content.replace(r.from, r.to);
  }
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    changedFiles++;
    console.log('Updated', filePath);
  }
});

console.log('Modified ' + changedFiles + ' files.');

