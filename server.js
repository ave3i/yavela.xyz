const fs   = require('fs');
const path = require('path');

const PAGES = ['index.html', 'register.html', 'dashboard.html', 'docs.html'];

module.exports = (req, res) => {
    let page = req.query.page || 'index.html';

    page = page.replace(/^\//, '') || 'index.html';

    if (!PAGES.includes(page)) {
        return res.status(404).send('Not found.');
    }

    const filePath = path.join(process.cwd(), 'public', page);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send('Page not found.');
    }

    let html = fs.readFileSync(filePath, 'utf8');

    html = html
        .replace(/__SUPABASE_URL__/g,      process.env.SUPABASE_URL)
        .replace(/__SUPABASE_ANON_KEY__/g, process.env.SUPABASE_ANON_KEY);

    res.setHeader('Content-Type', 'text/html');
    res.send(html);
};