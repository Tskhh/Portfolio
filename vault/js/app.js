import { register, setRoot, start, onNavigate, navigate } from './router.js';
import { subscribe, getGlobalStats } from './store.js';
import { renderHome, setupHomeFab } from './screens/home.js';
import { renderTransactions } from './screens/transactions.js';
import { renderAnalytics } from './screens/analytics.js';
import { renderCards } from './screens/cards.js';
import { formatMoneyShort } from './utils/helpers.js';

const NAV = [
	{ path: '/', label: 'Главная', icon: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/>' },
	{ path: '/transactions', label: 'Операции', icon: '<path d="M4 6h16M4 12h16M4 18h10"/>' },
	{ path: '/analytics', label: 'Аналитика', icon: '<path d="M18 20V10M12 20V4M6 20v-6"/>' },
	{ path: '/cards', label: 'Карты', icon: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>' }
];

const TITLES = {
	'/': 'Vault',
	'/transactions': 'Операции',
	'/analytics': 'Аналитика',
	'/cards': 'Карты'
};

function renderNav(activePath) {
	const nav = document.getElementById('bottomNav');
	nav.innerHTML = NAV.map(({ path, label, icon }) => `
		<a href="#${path}" class="${activePath === path ? 'is-active' : ''}" data-path="${path}">
			<svg viewBox="0 0 24 24">${icon}</svg><span>${label}</span>
		</a>
	`).join('');
	nav.querySelectorAll('a').forEach((a) => {
		a.addEventListener('click', (e) => { e.preventDefault(); navigate(a.dataset.path); });
	});
}

function renderHeader(path) {
	const header = document.getElementById('appHeader');
	if (path === '/') { header.innerHTML = ''; return; }
	header.innerHTML = `<h1 class="page-title">${TITLES[path] ?? 'Vault'}</h1>`;
}

function renderSidebar() {
	const sidebar = document.getElementById('appSidebar');
	function update() {
		const stats = getGlobalStats();
		sidebar.className = 'app-sidebar glass-card';
		sidebar.innerHTML = `
			<div class="app-sidebar__brand">Vault</div>
			<p class="app-sidebar__desc">Персональный финансовый трекер с картами, категориями и SVG-аналитикой. Mobile-first PWA demo.</p>
			<div class="app-sidebar__stats">
				<div class="app-sidebar__stat"><strong>${formatMoneyShort(stats.balance)}</strong><span>Баланс</span></div>
				<div class="app-sidebar__stat"><strong style="color:var(--income)">+${formatMoneyShort(stats.income)}</strong><span>Доход за месяц</span></div>
				<div class="app-sidebar__stat"><strong style="color:var(--expense)">−${formatMoneyShort(stats.expense)}</strong><span>Расход за месяц</span></div>
				<div class="app-sidebar__stat"><strong>${stats.count}</strong><span>Операций в месяце</span></div>
			</div>
		`;
	}
	update();
	subscribe(update);
}

function initFab() {
	const fab = document.createElement('button');
	fab.type = 'button';
	fab.className = 'fab';
	fab.id = 'globalFab';
	fab.hidden = true;
	fab.setAttribute('aria-label', 'Добавить операцию');
	fab.textContent = '+';
	document.body.appendChild(fab);
	setupHomeFab();
}

register('/', renderHome);
register('/transactions', renderTransactions);
register('/analytics', renderAnalytics);
register('/cards', renderCards);

setRoot(document.getElementById('screenRoot'));

onNavigate((path) => {
	renderNav(path);
	renderHeader(path);
	const fab = document.getElementById('globalFab');
	if (fab) fab.hidden = !(path === '/' || path === '/transactions');
});

renderSidebar();
initFab();
renderNav('/');

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.matchMedia('(min-width: 768px)').matches) {
	import('https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm').then(({ gsap }) => {
		gsap.from('.app-shell', { opacity: 0, y: 16, duration: 0.5, ease: 'power2.out' });
	}).catch(() => {});
}

await start('/');
