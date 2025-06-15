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
  express: app
});

// Set view engine
app.set('view engine', 'njk');

// Serve static files
app.use('/public', express.static('public'));
app.use('/assets', express.static('public/assets'));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});