const path = require('path');
const fs = require('fs');
const unzipper = require('unzipper');
const xml2js = require('xml2js');

//Extract SCORM zip to C:/scorm/<uuid>
async function extractScorm(file, uuid) {
  const targetPath = path.join('C:/scorm_uploads', uuid);
  fs.mkdirSync(targetPath, { recursive: true });
  await unzipper.Open.buffer(file.data).then(d => d.extract({ path: targetPath }));
  return targetPath;
}

//Recursively search for a file by name
function searchFileRecursive(baseDir, targetFileName) {
  let foundPath = null;
  function search(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        search(fullPath);
      } else if (
        entry.isFile() &&
        entry.name.toLowerCase() === targetFileName.toLowerCase()
      ) {
        foundPath = fullPath;
        return;
      }
    }
  }

  search(baseDir);
  return foundPath;
}

//Recursively find any .html file
function findAnyHtml(basePath) {
  let result = null;

  function search(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const full = path.join(dir, item.name);
      if (item.isDirectory()) {
        search(full);
      } else if (item.isFile() && item.name.toLowerCase().endsWith('.html')) {
        result = full;
        return;
      }
    }
  }

  search(basePath);
  return result;
}

// Parse imsmanifest.xml to get launch file (href)
async function parseManifest(manifestPath) {
  try {
    const xml = fs.readFileSync(manifestPath, 'utf-8');
    const result = await xml2js.parseStringPromise(xml);

    const resources = result?.manifest?.resources?.[0]?.resource;
    if (!resources || resources.length === 0) return null;

    const href = resources[0]?.['$']?.href;
    return href || null;
  } catch (err) {
    console.error('Error parsing imsmanifest.xml:', err.message);
    return null;
  }
}

// Main function to decide final launch file
async function getLaunchFile(folderPath) {
  // 1. Prefer index.html
  const indexPath = searchFileRecursive(folderPath, 'index.html');
  if (indexPath) {
    return path.relative(folderPath, indexPath).replace(/\\/g, '/');
  }

  const manifestPath = searchFileRecursive(folderPath, 'imsmanifest.xml');
  if (manifestPath) {
    const href = await parseManifest(manifestPath);
    if (href) {
      const resolved = searchFileRecursive(folderPath, path.basename(href));
      if (resolved) {
        return path.relative(folderPath, resolved).replace(/\\/g, '/');
      }
    }
  }

  const htmlPath = findAnyHtml(folderPath);
  if (htmlPath) {
    return path.relative(folderPath, htmlPath).replace(/\\/g, '/');
  }
  throw new Error('No valid HTML launch file found in SCORM package.');
}

module.exports = {
  extractScorm,
  getLaunchFile
};