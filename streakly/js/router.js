const routes = new Map();
let current = null;
let root = null;
let onRouteChange = null;

export function register(path, handler) {
	routes.set(path, handler);
}

export function setRoot(el) {
	root = el;
}

export function onNavigate(fn) {
	onRouteChange = fn;
}

export function navigate(path, replace = false) {
	const hash = path.startsWith('#') ? path : `#${path}`;
	if (replace) {
		location.replace(hash);
	} else {
		location.hash = hash;
	}
}

export async function start(defaultRoute = '/') {
	window.addEventListener('hashchange', render);
	await render(defaultRoute);
}

async function render(forcedPath) {
	const hash = forcedPath || location.hash.slice(1) || '/';
	const path = hash.split('?')[0] || '/';
	const handler = routes.get(path) ?? routes.get('/');

	if (!handler || !root) return;

	if (current?.destroy) current.destroy();
	root.innerHTML = '';
	root.classList.remove('screen-enter');
	void root.offsetWidth;
	root.classList.add('screen-enter');

	current = await handler({ path, root });
	onRouteChange?.(path);
}

export function getCurrentPath() {
	return location.hash.slice(1) || '/';
}
