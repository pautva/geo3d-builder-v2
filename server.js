const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Configure Nunjucks
nunjucks.configure([
  'node_modules/govuk-frontend/dist',
  'views'
], {
  autoescape: true,
  express: app,
  noCache: true
});

// Set view engine
app.set('view engine', 'html');

// Serve static files
app.use('/public', express.static('public'));
app.use('/assets', express.static('public/assets'));

// Routes
app.get('/', (req, res) => {
  res.render('index', {
    serviceName: '3D Model Upload Wizard'
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});