export function renderDonutChart(data, size = 180) {
	const total = data.reduce((s, d) => s + d.amount, 0) || 1;
	const cx = size / 2;
	const cy = size / 2;
	const r = size * 0.38;
	const stroke = size * 0.14;
	const C = 2 * Math.PI * r;
	let offset = 0;

	const segments = data.map((d) => {
		const pct = d.amount / total;
		const len = pct * C;
		const seg = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${d.color}" stroke-width="${stroke}"
			stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cy})"/>`;
		offset += len;
		return seg;
	}).join('');

	return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">
		<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="${stroke}"/>
		${segments}
		<text x="${cx}" y="${cy - 6}" text-anchor="middle" class="donut-center">Расходы</text>
		<text x="${cx}" y="${cy + 18}" text-anchor="middle" class="donut-value">${Math.round(total).toLocaleString('ru-RU')} ₽</text>
	</svg>`;
}

export function renderLineChart(points, width = 320, height = 140) {
	if (!points.length) return '';
	const maxVal = Math.max(...points.map((p) => Math.max(p.income, p.expense)), 1);
	const pad = 8;
	const w = width - pad * 2;
	const h = height - pad * 2;

	const toY = (v) => pad + h - (v / maxVal) * h;
	const step = w / Math.max(points.length - 1, 1);

	const incomePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${pad + i * step} ${toY(p.income)}`).join(' ');
	const expensePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${pad + i * step} ${toY(p.expense)}`).join(' ');

	return `<svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true">
		<path d="${incomePath}" fill="none" stroke="var(--income)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
		<path d="${expensePath}" fill="none" stroke="var(--expense)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
	</svg>`;
}
