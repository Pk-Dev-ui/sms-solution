const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..', 'functions');
const dist = path.join(__dirname, '..', 'dist', 'functions');
for (const name of fs.readdirSync(root)) {
  const src = path.join(root, name, 'function.json');
  const targetDir = path.join(dist, name);
  if (fs.existsSync(src)) {
    fs.mkdirSync(targetDir, { recursive: true });
    fs.copyFileSync(src, path.join(targetDir, 'function.json'));
  }
}
