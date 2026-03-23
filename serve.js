const fs = require('fs');
const path = require('path');

const ROUTES = {
  '/': 'index.html',
  '/login': 'index.html',
  '/register': 'register.html',
  '/dash': 'dashboard.html',
  '/docs': 'docs.html'
};

module.exports = (req, res) => {
  let route = req.url.split('?')[0];
  const page = ROUTES[route];

  if (!page) {
    return res.status(404).send('Page not found.');
  }

  const filePath = path.join(process.cwd(), 'public', page);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Page file missing.');
  }

  let html = fs.readFileSync(filePath, 'utf8');
  html = html
    .replace(/__SUPABASE_URL__/g, process.env.SUPABASE_URL || '')
    .replace(/__SUPABASE_ANON_KEY__/g, process.env.SUPABASE_ANON_KEY || '');

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
};
