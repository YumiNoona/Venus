
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
  { from: 'bg-[color:var(--bg)]', to: 'bg-bg' },
  { from: 'bg-[color:var(--bg-soft)]', to: 'bg-bg-soft' },
  { from: 'bg-[color:var(--surface)]', to: 'bg-bg-soft' },
  { from: 'bg-[color:var(--surface-hover)]', to: 'bg-bg-soft' },
  { from: 'text-[color:var(--text)]', to: 'text-text' },
  { from: 'text-[color:var(--text-primary)]', to: 'text-text' },
  { from: 'text-[color:var(--text-secondary)]', to: 'text-text-secondary' },
  { from: 'border-[color:var(--border)]', to: 'border-border' },
  { from: 'bg-[color:var(--primary)]', to: 'bg-primary' },
  { from: 'text-[color:var(--primary)]', to: 'text-primary' },
  { from: 'border-[color:var(--primary)]', to: 'border-primary' },
  { from: 'bg-[color:var(--accent)]', to: 'bg-accent' },
  { from: 'text-[color:var(--accent)]', to: 'text-accent' },
  { from: 'border-[color:var(--accent)]', to: 'border-accent' },
  { from: 'shadow-[color:var(--accent)]', to: 'shadow-accent' },
  { from: 'shadow-[color:var(--primary)]', to: 'shadow-primary' },
  { from: 'bg-[color:var(--danger-soft)]', to: 'bg-red-500/10' },
  { from: 'fill-[color:var(--accent)]', to: 'fill-accent' }
];

let changedFiles = 0;

walk('./', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  for (const r of replacements) {
    content = content.split(r.from).join(r.to);
  }
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    changedFiles++;
    console.log('Updated', filePath);
  }
});

console.log('Modified ' + changedFiles + ' files.');

