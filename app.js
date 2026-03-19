document.addEventListener('DOMContentLoaded', async () => {
    const navContainer = document.getElementById('nav-container');
    const contentDiv = document.getElementById('content');
    const pageTitle = document.getElementById('page-title');
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    let config = null;

    // Theme toggle logic
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
        updateThemeIcon(true);
    } else {
        htmlElement.classList.remove('dark');
        updateThemeIcon(false);
    }

    themeToggle.addEventListener('click', () => {
        const isDark = htmlElement.classList.toggle('dark');
        localStorage.theme = isDark ? 'dark' : 'light';
        updateThemeIcon(isDark);
    });

    function updateThemeIcon(isDark) {
        document.getElementById('theme-icon').textContent = isDark ? '☀️' : '🌙';
        document.getElementById('theme-text').textContent = isDark ? 'Mode Clair' : 'Mode Sombre';
    }

    // Configure marked for custom styling
    marked.setOptions({
        gfm: true,
        breaks: true,
        highlight: function(code, lang) {
            return `<pre class="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto text-sm"><code>${code}</code></pre>`;
        }
    });

    // Load configuration
    try {
        const response = await fetch('config.json');
        config = await response.json();
        buildNavigation(config);
        handleRoute();
    } catch (e) {
        contentDiv.innerHTML = `<div class="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">Erreur de chargement de la configuration. ${e.message}</div>`;
    }

    // Router
    window.addEventListener('hashchange', handleRoute);

    function buildNavigation(config) {
        navContainer.innerHTML = '';
        config.sections.forEach(section => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'mb-6';
            
            const title = document.createElement('h3');
            title.className = 'text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 px-3';
            title.textContent = section.title;
            sectionDiv.appendChild(title);

            const list = document.createElement('ul');
            list.className = 'space-y-1';

            section.items.forEach(item => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = `#${item.id}`;
                a.className = 'flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-tiba-green dark:hover:text-teal-400 transition-colors nav-link';
                a.dataset.id = item.id;
                a.dataset.path = item.path;
                a.textContent = item.title;
                
                li.appendChild(a);
                list.appendChild(li);
            });

            sectionDiv.appendChild(list);
            navContainer.appendChild(sectionDiv);
        });
    }

    async function handleRoute() {
        const hash = window.location.hash.slice(1) || 'ideation'; // Default to first page
        
        // Update active state in nav
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.dataset.id === hash) {
                link.classList.add('bg-tiba-green/10', 'text-tiba-green', 'dark:bg-teal-900/30', 'dark:text-teal-400');
                pageTitle.textContent = link.textContent;
                loadContent(link.dataset.path);
            } else {
                link.classList.remove('bg-tiba-green/10', 'text-tiba-green', 'dark:bg-teal-900/30', 'dark:text-teal-400');
            }
        });
    }

    async function loadContent(path) {
        contentDiv.innerHTML = `<div class="text-center py-20"><div class="w-10 h-10 border-4 border-tiba-green border-t-transparent rounded-full animate-spin mx-auto mb-6"></div><p class="text-slate-500">Chargement...</p></div>`;
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error('Fichier introuvable');
            
            let text = await response.text();
            
            // Handle raw SQL or YAML files by wrapping them in code blocks
            if(path.endsWith('.sql')) {
                text = '```sql\\n' + text + '\\n```';
            } else if (path.endsWith('.yaml') || path.endsWith('.yml')) {
                text = '```yaml\\n' + text + '\\n```';
            }

            contentDiv.innerHTML = marked.parse(text);
        } catch (e) {
            contentDiv.innerHTML = `
                <div class="p-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800/30">
                    <h3 class="text-lg font-semibold mb-2">Erreur 404</h3>
                    <p>Impossible de charger le document : ${path}</p>
                    <p class="text-sm mt-2 opacity-80">Si vous utilisez un navigateur local sans serveur, les requêtes fetch() pour les fichiers locaux peuvent être bloquées par les règles CORS.</p>
                </div>`;
        }
    }
});
