const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');

// Configure Nunjucks
const env = nunjucks.configure([
  'node_modules/govuk-frontend/dist',
  'views'
], {
  autoescape: true,
  noCache: true
});

// Create dist directory if it doesn't exist
const distDir = 'dist';
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Copy public folder to dist
const copyDir = (src, dest) => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(src);
  
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
};

// Copy public assets
copyDir('public', path.join(distDir, 'public'));

// Fix CSS asset paths
const cssFile = path.join(distDir, 'public', 'css', 'govuk-frontend.min.css');
if (fs.existsSync(cssFile)) {
  let css = fs.readFileSync(cssFile, 'utf8');
  css = css.replace(/url\(\/assets\//g, 'url(../assets/');
  fs.writeFileSync(cssFile, css);
  console.log('✓ Fixed CSS asset paths');
}

// Render templates
const templates = [
  {
    template: 'index.html',
    output: 'index.html',
    data: {
      serviceName: '3D Model Upload Wizard'
    }
  }
];

templates.forEach(({ template, output, data }) => {
  try {
    let html = env.render(template, data);
    
    // Fix asset paths for GitHub Pages
    html = html.replace(/href="\/assets\//g, 'href="./public/assets/');
    html = html.replace(/src="\/assets\//g, 'src="./public/assets/');
    html = html.replace(/url\(\/assets\//g, 'url(./public/assets/');
    
    fs.writeFileSync(path.join(distDir, output), html);
    console.log(`✓ Generated ${output}`);
  } catch (error) {
    console.error(`✗ Error generating ${output}:`, error.message);
  }
});

console.log('Build complete! Files are in the dist/ folder.');