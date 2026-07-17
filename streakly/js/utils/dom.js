export function el(html) {
	const t = document.createElement('template');
	t.innerHTML = html.trim();
	return t.content.firstElementChild;
}

export function escapeHtml(str) {
	return String(str)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

export function svgCheck() {
	return '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="currentColor"/></svg>';
}
