const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

marked.setOptions({ gfm: true, breaks: true });

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
const responsiveCss = fs.readFileSync(path.join(__dirname, 'responsive.css'), 'utf8');
const outDir = path.join(__dirname, 'docs');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Flatten all items for prev/next navigation
const allItems = config.sections.flatMap(s => s.items);

// ═══════════════════════════════════════════
// SVG ICONS (replace emojis)
// ═══════════════════════════════════════════
const svgIcons = {
  compass: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
  clipboard: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>`,
  layers: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  play: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>`,
  arrowLeft: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
  arrowRight: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  dot: `<svg width="6" height="6" viewBox="0 0 6 6"><circle cx="3" cy="3" r="3" fill="currentColor"/></svg>`
};

function generateNav(currentItemId) {
  let html = '';
  config.sections.forEach(section => {
    const icon = svgIcons[section.icon] || svgIcons.dot;
    html += `
      <div class="nav-section">
        <div class="nav-section-title">
          <span class="nav-section-icon">${icon}</span>
          ${section.title}
        </div>
        <ul class="nav-list">`;
    section.items.forEach(item => {
      const active = item.id === currentItemId ? ' active' : '';
      html += `
          <li><a href="${item.id}.html" class="nav-link${active}" aria-current="${item.id === currentItemId ? 'page' : 'false'}"><span class="nav-dot">${svgIcons.dot}</span>${item.title}</a></li>`;
    });
    html += `
        </ul>
      </div>`;
  });
  return html;
}

function generatePrevNext(currentId) {
  const idx = allItems.findIndex(i => i.id === currentId);
  const prev = idx > 0 ? allItems[idx - 1] : null;
  const next = idx < allItems.length - 1 ? allItems[idx + 1] : null;
  let html = '<div class="prev-next">';
  if (prev) {
    html += `<a href="${prev.id}.html" class="prev-next-btn prev" aria-label="Page precedente: ${prev.title}"><span class="prev-next-label">${svgIcons.arrowLeft} Precedent</span><span class="prev-next-title">${prev.title}</span></a>`;
  } else {
    html += '<div></div>';
  }
  if (next) {
    html += `<a href="${next.id}.html" class="prev-next-btn next" aria-label="Page suivante: ${next.title}"><span class="prev-next-label">Suivant ${svgIcons.arrowRight}</span><span class="prev-next-title">${next.title}</span></a>`;
  } else {
    html += '<div></div>';
  }
  html += '</div>';
  return html;
}

function generatePage(item, content) {
  const nav = generateNav(item.id);
  const prevNext = generatePrevNext(item.id);
  const currentIdx = allItems.findIndex(i => i.id === item.id) + 1;
  const total = allItems.length;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${item.title} – Tiba Docs</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    /* ═══════════════════════════════════════════
       TIBA DESIGN SYSTEM TOKENS
       ═══════════════════════════════════════════ */
    :root {
      --tiba-green: #0B8E71;
      --tiba-green-light: #0FAF8C;
      --tiba-green-bg: #E8F5F1;
      --tiba-sand: #F5F0E6;
      --tiba-sand-dark: #EDE6D6;
      --tiba-coral: #E85D75;
      --tiba-dark: #1A1A1A;
      --tiba-dark-soft: #2D2D2D;
      --sidebar-w: 280px;
      --header-h: 64px;
      --radius: 12px;
    }

    /* ═══════════════════════════════════════════
       RESET & BASE
       ═══════════════════════════════════════════ */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; background: var(--tiba-sand); }
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background: var(--tiba-sand);
      color: var(--tiba-dark);
      line-height: 1.7;
      -webkit-font-smoothing: antialiased;
      animation: fadeIn 0.25s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* ═══════════════════════════════════════════
       LAYOUT
       ═══════════════════════════════════════════ */
    .layout { display: flex; min-height: 100vh; }

    /* ─── Sidebar ─── */
    .sidebar {
      width: var(--sidebar-w);
      background: #fff;
      border-right: 1px solid #e0ddd5;
      position: fixed;
      top: 0; left: 0; bottom: 0;
      display: flex;
      flex-direction: column;
      z-index: 100;
      transition: transform 0.3s ease;
    }
    .sidebar-header {
      height: var(--header-h);
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 20px;
      border-bottom: 1px solid #e0ddd5;
      flex-shrink: 0;
    }
    .sidebar-logo {
      width: 32px;
      height: 32px;
      object-fit: contain;
    }
    .sidebar-header h1 {
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 1.3rem;
      color: var(--tiba-dark);
      letter-spacing: -0.5px;
    }
    .sidebar-header h1 span { color: var(--tiba-green); }
    .sidebar-body {
      flex: 1;
      overflow-y: auto;
      padding: 16px 12px;
    }

    /* ─── Navigation Sections ─── */
    .nav-section { margin-bottom: 8px; }
    .nav-section-title {
      font-family: 'Outfit', sans-serif;
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--tiba-green);
      padding: 10px 12px 6px;
      margin-bottom: 2px;
      display: flex;
      align-items: center;
      gap: 8px;
      border-top: 1px solid #eee;
    }
    .nav-section:first-child .nav-section-title {
      border-top: none;
    }
    .nav-section-icon {
      display: flex;
      align-items: center;
      color: var(--tiba-green);
      opacity: 0.7;
    }
    .nav-list { list-style: none; }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 7px 12px 7px 16px;
      font-size: 0.85rem;
      font-weight: 500;
      color: #666;
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.15s ease;
      margin-bottom: 1px;
    }
    .nav-dot {
      display: flex;
      align-items: center;
      color: #ccc;
      flex-shrink: 0;
      transition: color 0.15s ease;
    }
    .nav-link:hover {
      background: var(--tiba-green-bg);
      color: var(--tiba-green);
    }
    .nav-link:hover .nav-dot { color: var(--tiba-green); }
    .nav-link.active {
      background: var(--tiba-green-bg);
      color: var(--tiba-green);
      font-weight: 600;
    }
    .nav-link.active .nav-dot { color: var(--tiba-green); }

    /* ─── Main ─── */
    .main-area {
      flex: 1;
      margin-left: var(--sidebar-w);
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    /* ─── Top Bar ─── */
    .topbar {
      height: var(--header-h);
      background: rgba(245, 240, 230, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid #e0ddd5;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .topbar-title {
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: 1.15rem;
      color: var(--tiba-dark);
    }
    .topbar-badge {
      font-size: 0.75rem;
      font-weight: 600;
      background: var(--tiba-green-bg);
      color: var(--tiba-green);
      padding: 4px 12px;
      border-radius: 20px;
    }

    /* ─── Content Area ─── */
    .content-wrap {
      flex: 1;
      max-width: 960px;
      margin: 0 auto;
      padding: 40px 32px 80px;
      width: 100%;
    }

    /* ─── Mobile hamburger ─── */
    .hamburger {
      display: none;
      background: var(--tiba-green);
      color: #fff;
      border: none;
      font-size: 1.5rem;
      width: 44px; height: 44px;
      border-radius: 10px;
      cursor: pointer;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.4);
      z-index: 90;
    }

    /* ═══════════════════════════════════════════
       PROSE — Markdown content styling
       ═══════════════════════════════════════════ */
    .prose h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 2rem;
      font-weight: 800;
      color: var(--tiba-dark);
      margin: 0 0 16px;
      line-height: 1.2;
      border-bottom: 3px solid var(--tiba-green);
      padding-bottom: 12px;
    }
    .prose h2 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.45rem;
      font-weight: 700;
      color: var(--tiba-green);
      margin: 40px 0 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e0ddd5;
    }
    .prose h3 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--tiba-dark);
      margin: 28px 0 8px;
    }
    .prose h4 {
      font-family: 'Outfit', sans-serif;
      font-size: 1rem;
      font-weight: 600;
      color: #555;
      margin: 20px 0 6px;
    }
    .prose p { margin: 12px 0; }
    .prose a {
      color: var(--tiba-green);
      text-decoration: underline;
      text-underline-offset: 3px;
    }
    .prose a:hover { color: var(--tiba-green-light); }
    .prose strong { color: var(--tiba-dark); }
    .prose ul, .prose ol {
      padding-left: 24px;
      margin: 12px 0;
    }
    .prose li { margin: 6px 0; }
    .prose li::marker { color: var(--tiba-green); }
    .prose blockquote {
      border-left: 4px solid var(--tiba-green);
      background: var(--tiba-green-bg);
      padding: 16px 20px;
      margin: 20px 0;
      border-radius: 0 var(--radius) var(--radius) 0;
      font-style: italic;
      color: #3a3a3a;
    }
    .prose code {
      background: #f0ece3;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.85em;
      color: var(--tiba-coral);
    }
    .prose pre {
      background: var(--tiba-dark);
      color: #e0e0e0;
      padding: 20px;
      border-radius: var(--radius);
      overflow-x: auto;
      margin: 20px 0;
      font-size: 0.85rem;
      line-height: 1.6;
    }
    .prose pre code {
      background: none;
      padding: 0;
      color: inherit;
      font-size: inherit;
    }
    .prose table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 0.9rem;
    }
    .prose th {
      background: var(--tiba-green);
      color: #fff;
      font-weight: 600;
      text-align: left;
      padding: 10px 14px;
    }
    .prose th:first-child { border-radius: 8px 0 0 0; }
    .prose th:last-child { border-radius: 0 8px 0 0; }
    .prose td {
      padding: 10px 14px;
      border-bottom: 1px solid #e0ddd5;
    }
    .prose tr:nth-child(even) td { background: #faf8f3; }
    .prose tr:hover td { background: var(--tiba-green-bg); }
    .prose hr {
      border: none;
      border-top: 2px solid #e0ddd5;
      margin: 32px 0;
    }
    .prose img {
      max-width: 100%;
      border-radius: var(--radius);
      margin: 16px 0;
    }

    /* ═══════════════════════════════════════════
       PREV / NEXT NAVIGATION
       ═══════════════════════════════════════════ */
    .prev-next {
      display: flex;
      gap: 16px;
      margin-top: 48px;
      padding-top: 24px;
      border-top: 2px solid #e0ddd5;
    }
    .prev-next-btn {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 16px 20px;
      background: #fff;
      border: 1px solid #e0ddd5;
      border-radius: var(--radius);
      text-decoration: none;
      transition: all 0.2s ease;
      min-height: 72px;
    }
    .prev-next-btn:hover {
      border-color: var(--tiba-green);
      box-shadow: 0 4px 16px rgba(11,142,113,0.12);
      transform: translateY(-2px);
    }
    .prev-next-btn.next { text-align: right; }
    .prev-next-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--tiba-green);
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .prev-next-btn.next .prev-next-label { justify-content: flex-end; }
    .prev-next-title {
      font-family: 'Outfit', sans-serif;
      font-weight: 600;
      font-size: 0.95rem;
      color: var(--tiba-dark);
    }

    /* ═══════════════════════════════════════════
       RESPONSIVE — Tablet
       ═══════════════════════════════════════════ */
    @media (max-width: 900px) {
      .sidebar { transform: translateX(-100%); }
      .sidebar.open {
        transform: translateX(0);
        box-shadow: 4px 0 24px rgba(0,0,0,0.15);
      }
      .overlay.open { display: block; }
      .main-area { margin-left: 0; overflow-x: hidden; }
      .hamburger { display: flex; }
      .topbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 80;
        padding: 0 12px;
        gap: 8px;
      }
      .topbar-title { font-size: 0.95rem; }
      .content-wrap { padding: 20px 14px 48px; margin-top: var(--header-h); }
      .prev-next { flex-direction: column; gap: 10px; }
      .prev-next-btn { min-height: 56px; padding: 12px 16px; }
      .prose h1 { font-size: 1.6rem; }
      .prose h2 { font-size: 1.25rem; margin-top: 28px; }
      .prose h3 { font-size: 1.05rem; }
      .prose pre { padding: 14px; font-size: 0.78rem; }
      .prose table { font-size: 0.8rem; display: block; overflow-x: auto; white-space: nowrap; }
      .prose th, .prose td { padding: 8px 10px; }
      .prose blockquote { padding: 12px 14px; margin: 14px 0; }
    }

    /* ═══════════════════════════════════════════
       RESPONSIVE — Phone
       ═══════════════════════════════════════════ */
    @media (max-width: 480px) {
      :root {
        --header-h: 52px;
      }
      body { font-size: 0.9rem; line-height: 1.65; }
      .topbar-title { font-size: 0.85rem; }
      .topbar-badge { display: none; }
      .hamburger { width: 40px; height: 40px; border-radius: 8px; }
      .content-wrap { padding: 16px 12px 40px; }
      .prose h1 { font-size: 1.3rem; padding-bottom: 8px; }
      .prose h2 { font-size: 1.1rem; margin-top: 24px; padding-bottom: 6px; }
      .prose h3 { font-size: 0.95rem; margin-top: 18px; }
      .prose h4 { font-size: 0.88rem; }
      .prose p { margin: 8px 0; }
      .prose ul, .prose ol { padding-left: 18px; margin: 8px 0; }
      .prose li { margin: 4px 0; }
      .prose pre { padding: 10px; font-size: 0.72rem; border-radius: 8px; }
      .prose code { font-size: 0.8em; padding: 1px 4px; }
      .prose blockquote { padding: 10px 12px; font-size: 0.88rem; }
      .prose table { font-size: 0.75rem; }
      .prose th, .prose td { padding: 6px 8px; }
      .prose img { border-radius: 8px; margin: 10px 0; }
      .prev-next-btn { min-height: 48px; padding: 10px 12px; }
      .prev-next-label { font-size: 0.68rem; }
      .prev-next-title { font-size: 0.85rem; }
      /* Force inline grids to stack */
      [style*="grid-template-columns"] {
        grid-template-columns: 1fr !important;
      }
    }

    /* ═══════════════════════════════════════════
       ACCESSIBILITY
       ═══════════════════════════════════════════ */
    :focus-visible {
      outline: 3px solid var(--tiba-green);
      outline-offset: 2px;
    }
    @media (prefers-reduced-motion: reduce) {
      * { transition: none !important; animation: none !important; }
    }

    /* INJECTED RESPONSIVE CSS */
${responsiveCss}
  </style>
</head>
<body>
  <div class="layout">
    <!-- Overlay for mobile sidebar -->
    <div class="overlay" id="overlay" onclick="toggleSidebar()" aria-hidden="true"></div>

    <!-- Sidebar -->
    <aside class="sidebar" id="sidebar" role="navigation" aria-label="Menu de navigation des documents">
      <div class="sidebar-header">
        <img src="Img/Logogreen.png" alt="Tiba" class="sidebar-logo">
        <h1><span>Tiba</span> Docs</h1>
      </div>
      <div class="sidebar-body">
        ${nav}
      </div>
    </aside>

    <!-- Main -->
    <div class="main-area">
      <div class="topbar" role="banner">
        <button class="hamburger" onclick="toggleSidebar()" aria-label="Ouvrir le menu" aria-expanded="false" id="hamburger-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <div class="topbar-title">${item.title}</div>
        <div class="topbar-badge">${currentIdx} / ${total}</div>
      </div>

      <article class="content-wrap" role="main" aria-label="Contenu du document">
        <div class="prose">
          ${content}
        </div>
        ${prevNext}
      </article>
    </div>
  </div>

  <script>
    function toggleSidebar() {
      const sidebar = document.getElementById('sidebar');
      const overlay = document.getElementById('overlay');
      const btn = document.getElementById('hamburger-btn');
      const isOpen = sidebar.classList.toggle('open');
      overlay.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen);
      if (isOpen) sidebar.querySelector('.nav-link').focus();
    }
    // Close sidebar on nav click (mobile only)
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 900) toggleSidebar();
      });
    });
    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        const sidebar = document.getElementById('sidebar');
        if (sidebar.classList.contains('open')) toggleSidebar();
      }
    });
  </script>
</body>
</html>`;
}

// ═══════════════════════════════════════════
// BUILD ALL PAGES
// ═══════════════════════════════════════════
let firstPageId = null;

config.sections.forEach(section => {
  section.items.forEach(item => {
    if (!firstPageId) firstPageId = item.id;

    const filePath = path.join(__dirname, item.path);
    let htmlContent = '';

    try {
      const rawContent = fs.readFileSync(filePath, 'utf8');

      if (item.path.endsWith('.html')) {
        // HTML content files: passthrough, no markdown parsing
        htmlContent = rawContent;

        // Special case: database-visual page: append SQL code at bottom
        if (item.id === 'database') {
          try {
            const sqlPath = path.join(__dirname, 'content/planning-artifacts/database-schema.sql');
            const sqlContent = fs.readFileSync(sqlPath, 'utf8');
            htmlContent += marked.parse('```sql\n' + sqlContent + '\n```');
          } catch (e) {
            htmlContent += '<p><em>Code SQL non disponible.</em></p>';
          }
        }
      } else {
        // Markdown / SQL / YAML content
        let mdContent = rawContent;

        // Strip YAML frontmatter
        if (mdContent.startsWith('---')) {
          const endFm = mdContent.indexOf('---', 3);
          if (endFm !== -1) mdContent = mdContent.slice(endFm + 3).trim();
        }

        if (item.path.endsWith('.sql')) {
          mdContent = '```sql\n' + mdContent + '\n```';
        } else if (item.path.endsWith('.yaml') || item.path.endsWith('.yml')) {
          mdContent = '```yaml\n' + mdContent + '\n```';
        }

        htmlContent = marked.parse(mdContent);
      }
    } catch (e) {
      htmlContent = `<div style="background:#FEE; border:1px solid #E85D75; border-radius:12px; padding:20px; color:#A33;"><strong>Erreur:</strong> Impossible de charger <code>${item.path}</code></div>`;
    }

    const finalHtml = generatePage(item, htmlContent);
    fs.writeFileSync(path.join(outDir, `${item.id}.html`), finalHtml);
    console.log(`  ${item.id}.html`);
  });
});

// Index redirect
fs.writeFileSync(path.join(outDir, 'index.html'),
  `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${firstPageId}.html"><title>Tiba Docs</title></head><body></body></html>`);

console.log(`\n${allItems.length} pages generees dans docs/`);

// Copy responsive.css to output
fs.copyFileSync(
  path.join(__dirname, 'responsive.css'),
  path.join(outDir, 'responsive.css')
);
console.log('  responsive.css copie');
