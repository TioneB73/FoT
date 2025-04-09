// scripts/build-index.js
const fs = require("fs");
const path = require("path");

const baseDir = path.join(__dirname, "..", "Done");

function isValidFolder(name) {
  return /FoT/i.test(name);
}

function buildIndex(folderPath) {
  const files = fs.readdirSync(folderPath).filter(file =>
    /\.(png|jpe?g|gif|webp)$/i.test(file)
  );
  fs.writeFileSync(
    path.join(folderPath, "index.json"),
    JSON.stringify(files, null, 2)
  );
  console.log(`✅ index.json created for ${folderPath}`);
}

fs.readdirSync(baseDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && isValidFolder(dirent.name))
  .forEach(dirent => {
    const folderPath = path.join(baseDir, dirent.name);
    buildIndex(folderPath);
  });
