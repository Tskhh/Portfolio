export function uid() {
	return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatMoney(n) {
	return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(n);
}

export function formatMoneyShort(n) {
	if (Math.abs(n) >= 1000000) return `${(n / 1000000).toFixed(1)}M ₽`;
	if (Math.abs(n) >= 1000) return `${Math.round(n / 1000)}K ₽`;
	return formatMoney(n);
}

export function escapeHtml(str) {
	return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function el(html) {
	const t = document.createElement('template');
	t.innerHTML = html.trim();
	return t.content.firstElementChild;
}
