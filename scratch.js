const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = `${dir}/${file}`;
    if (fs.statSync(name).isDirectory()) {
      if (!name.includes('node_modules')) {
        getFiles(name, files);
      }
    } else if (name.endsWith('.js')) {
      files.push(name);
    }
  }
  return files;
}

const files = getFiles('backend');
const keys = new Set();
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const regex = /sendApiResponse\s*\(\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*["']([^"']+)["']/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    keys.add(match[1]);
  }
});
console.log(Array.from(keys).sort().join('\n'));
