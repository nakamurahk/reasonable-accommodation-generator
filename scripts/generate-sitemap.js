const fs = require('fs');
const path = require('path');

const baseUrl = 'https://inclusibridge.com';
const currentDate = new Date().toISOString().split('T')[0];

const staticPages = [
  {
    url: '',
    lastmod: currentDate,
    changefreq: 'weekly',
    priority: '1.0',
  },
  {
    url: '/about',
    lastmod: currentDate,
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    url: '/concept',
    lastmod: currentDate,
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    url: '/developer',
    lastmod: currentDate,
    changefreq: 'monthly',
    priority: '0.6',
  },
  {
    url: '/contact',
    lastmod: currentDate,
    changefreq: 'monthly',
    priority: '0.7',
  },
  {
    url: '/privacy',
    lastmod: currentDate,
    changefreq: 'yearly',
    priority: '0.3',
  },
  {
    url: '/terms',
    lastmod: currentDate,
    changefreq: 'yearly',
    priority: '0.3',
  },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map((page) => {
    return `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  })
  .join('')}
</urlset>`;

// publicディレクトリにsitemap.xmlを生成
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
console.log('Sitemap generated successfully!');
