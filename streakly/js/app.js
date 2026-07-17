import { register, setRoot, start, onNavigate, navigate } from './router.js';
import { subscribe, getGlobalStats } from './store.js';
import { renderToday } from './screens/today.js';
import { renderHabits, setupHabitsFab } from './screens/habits.js';
import { renderStats } from './screens/stats.js';
import { renderProfile } from './screens/profile.js';

const NAV = [
	{ path: '/', label: 'Сегодня', icon: '<path d="M3 12h18M12 3v18"/><circle cx="12" cy="12" r="9"/>' },
	{ path: '/habits', label: 'Привычки', icon: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>' },
	{ path: '/stats', label: 'Статистика', icon: '<path d="M18 20V10M12 20V4M6 20v-6"/>' },
	{ path: '/profile', label: 'Профиль', icon: '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>' }
];

const TITLES = {
	'/': 'Streakly',
	'/habits': 'Привычки',
	'/stats': 'Статистика',
	'/profile': 'Профиль'
};

function renderNav(activePath) {
	const nav = document.getElementById('bottomNav');
	nav.innerHTML = NAV.map(({ path, label, icon }) => `
		<a href="#${path}" class="${activePath === path ? 'is-active' : ''}" data-path="${path}">
			<svg viewBox="0 0 24 24">${icon}</svg>
			<span>${label}</span>
		</a>
	`).join('');

	nav.querySelectorAll('a').forEach((a) => {
		a.addEventListener('click', (e) => {
			e.preventDefault();
			navigate(a.dataset.path);
		});
	});
}

function renderHeader(path) {
	const header = document.getElementById('appHeader');
	if (path === '/') {
		header.innerHTML = '';
		return;
	}
	header.innerHTML = `<div class="header-row"><h1 class="page-title">${TITLES[path] ?? 'Streakly'}</h1></div>`;
}

function renderSidebar() {
	const sidebar = document.getElementById('appSidebar');
	if (!sidebar) return;

	function update() {
		const stats = getGlobalStats();
		sidebar.className = 'app-sidebar glass-card';
		sidebar.innerHTML = `
			<div class="app-sidebar__brand">Streakly</div>
			<p class="app-sidebar__desc">Трекер привычек с streak, heatmap и локальным хранением. Mobile-first PWA demo.</p>
			<div class="app-sidebar__stats">
				<div class="app-sidebar__stat"><strong>${stats.todayPercent}%</strong><span>Сегодня</span></div>
				<div class="app-sidebar__stat"><strong>${stats.totalHabits}</strong><span>Активных привычек</span></div>
				<div class="app-sidebar__stat"><strong>${stats.bestStreak}</strong><span>Лучший streak</span></div>
				<div class="app-sidebar__stat"><strong>${stats.totalCompletions}</strong><span>Всего выполнений</span></div>
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
	fab.setAttribute('aria-label', 'Добавить привычку');
	fab.textContent = '+';
	document.body.appendChild(fab);
	setupHabitsFab();
}

async function maybeLoadGsap() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
	if (window.matchMedia('(max-width: 767px)').matches) return null;

	try {
		const { gsap } = await import('https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm');
		return gsap;
	} catch {
		return null;
	}
}

register('/', renderToday);
register('/habits', renderHabits);
register('/stats', renderStats);
register('/profile', renderProfile);

setRoot(document.getElementById('screenRoot'));

onNavigate((path) => {
	renderNav(path);
	renderHeader(path);
	const fab = document.getElementById('globalFab');
	if (fab) fab.hidden = path !== '/habits';
});

renderSidebar();
initFab();
renderNav('/');

const gsap = await maybeLoadGsap();
if (gsap) {
	gsap.from('.app-shell', { opacity: 0, y: 16, duration: 0.5, ease: 'power2.out' });
}

await start('/');

if ('serviceWorker' in navigator && location.protocol === 'https:') {
	// optional offline shell — register when sw.js exists
	navigator.serviceWorker.register('/streakly/sw.js').catch(() => {});
}
