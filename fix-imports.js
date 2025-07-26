const fs = require('fs');
const path = require('path');

// Fix imports sau khi refactor
const fixImportPaths = (dir) => {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixImportPaths(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;
      
      // Fix asset imports từ features
      if (filePath.includes('features')) {
        content = content.replace(
          /import\s+(\w+)\s+from\s+['"]\.\.\/assets\//g,
          'import $1 from \'../../../assets/'
        );
        content = content.replace(
          /import\s+(\w+)\s+from\s+['"]\.\.\/components\//g,
          'import $1 from \'../../../components/'
        );
        content = content.replace(
          /import\s+([^'"]*)from\s+['"]\.\.\/mockData(['"])/g,
          'import $1from \'../../../shared/data$2'
        );
        content = content.replace(
          /import\s+([^'"]*)from\s+['"]\.\.\/\.\.\/data\//g,
          'import $1from \'../../../data/'
        );
        // Fix mockData/generated imports
        content = content.replace(
          /await import\(['"]\.\.\/mockData\/generated['"]\)/g,
          'await import(\'../../../mockData/generated\')'
        );
        modified = true;
      }
      
      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed: ${filePath}`);
      }
    }
  });
};

// Chạy fix
console.log('Fixing import paths...');
fixImportPaths('src/features');
console.log('Done!');
