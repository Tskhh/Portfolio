import {
	getCategoryBreakdown,
	getMonthlyTrend,
	getMonthStats,
	subscribe
} from '../store.js';
import { getMonthLabel } from '../utils/date.js';
import { formatMoneyShort } from '../utils/helpers.js';
import { renderDonutChart, renderLineChart } from '../utils/charts.js';

export function renderAnalytics({ root }) {
	let unsub = subscribe(() => mount());

	function mount() {
		const month = getMonthStats();
		const breakdown = getCategoryBreakdown();
		const trend = getMonthlyTrend(6);

		const donutData = breakdown.slice(0, 6).map((b) => ({
			amount: b.amount,
			color: b.category?.color ?? '#64748B',
			label: b.category?.name
		}));

		root.innerHTML = `
			<p class="page-subtitle" style="margin-bottom:20px">Аналитика за текущий месяц</p>

			<div class="stats-summary" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">
				<div class="glass-card" style="padding:16px">
					<div style="font-size:22px;font-weight:700;color:var(--income)">+${formatMoneyShort(month.income)}</div>
					<div style="font-size:12px;color:var(--text-secondary);margin-top:4px">Доходы</div>
				</div>
				<div class="glass-card" style="padding:16px">
					<div style="font-size:22px;font-weight:700;color:var(--expense)">−${formatMoneyShort(month.expense)}</div>
					<div style="font-size:12px;color:var(--text-secondary);margin-top:4px">Расходы</div>
				</div>
			</div>

			<div class="section-label">Расходы по категориям</div>
			<div class="glass-card chart-wrap">
				${donutData.length ? renderDonutChart(donutData) : '<p style="text-align:center;color:var(--text-secondary)">Нет расходов</p>'}
				${donutData.length ? `
					<div class="chart-legend">
						${donutData.map((d) => `
							<div class="chart-legend-item">
								<span class="chart-legend-dot" style="background:${d.color}"></span>
								${d.label} · ${formatMoneyShort(d.amount)}
							</div>
						`).join('')}
					</div>
				` : ''}
			</div>

			<div class="section-label">Тренд за 6 месяцев</div>
			<div class="glass-card chart-wrap">
				<div class="line-chart">${renderLineChart(trend)}</div>
				<div style="display:flex;justify-content:space-between;margin-top:12px;font-size:11px;color:var(--text-muted)">
					${trend.map((t) => `<span>${getMonthLabel(t.key)}</span>`).join('')}
				</div>
				<div class="chart-legend" style="margin-top:12px">
					<div class="chart-legend-item"><span class="chart-legend-dot" style="background:var(--income)"></span> Доходы</div>
					<div class="chart-legend-item"><span class="chart-legend-dot" style="background:var(--expense)"></span> Расходы</div>
				</div>
			</div>
		`;
	}

	mount();
	return { destroy() { unsub(); } };
}
