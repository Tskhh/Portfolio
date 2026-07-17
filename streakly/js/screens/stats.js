import {
	getActiveHabits,
	getStreak,
	getBestStreak,
	getTotalCompletions,
	getHeatmapData,
	getTodayProgress,
	subscribe
} from '../store.js';
import { getHeatmapDays } from '../utils/date.js';
import { escapeHtml } from '../utils/dom.js';

export function renderStats({ root }) {
	let unsub = subscribe(() => mount());

	function mount() {
		const habits = getActiveHabits();
		const heatmap = getHeatmapData();
		const days = getHeatmapDays(12);
		const maxCount = Math.max(1, ...Object.values(heatmap));
		const today = getTodayProgress();

		const topHabits = [...habits]
			.map((h) => ({ ...h, streak: getStreak(h.id), best: getBestStreak(h.id) }))
			.sort((a, b) => b.streak - a.streak)
			.slice(0, 5);

		root.innerHTML = `
			<p class="page-subtitle" style="margin-bottom:20px">Ваш прогресс за 12 недель</p>

			<div class="stats-summary">
				<div class="glass-card stat-box">
					<div class="stat-box__value">${today.percent}%</div>
					<div class="stat-box__label">Сегодня</div>
				</div>
				<div class="glass-card stat-box">
					<div class="stat-box__value">${getTotalCompletions()}</div>
					<div class="stat-box__label">Выполнений</div>
				</div>
				<div class="glass-card stat-box">
					<div class="stat-box__value">${habits.length}</div>
					<div class="stat-box__label">Привычек</div>
				</div>
				<div class="glass-card stat-box">
					<div class="stat-box__value">${topHabits[0]?.streak ?? 0}</div>
					<div class="stat-box__label">Лучший streak</div>
				</div>
			</div>

			<div class="section-label">Активность</div>
			<div class="glass-card" style="padding:16px;margin-bottom:20px">
				<div class="heatmap">
					<div class="heatmap-grid" id="heatmapGrid"></div>
				</div>
				<div class="heatmap-legend">
					<span>Меньше</span>
					<span class="heatmap-cell" data-level="0"></span>
					<span class="heatmap-cell" data-level="1"></span>
					<span class="heatmap-cell" data-level="2"></span>
					<span class="heatmap-cell" data-level="3"></span>
					<span class="heatmap-cell" data-level="4"></span>
					<span>Больше</span>
				</div>
			</div>

			<div class="section-label">Топ привычек</div>
			<div id="topHabits"></div>
		`;

		const grid = root.querySelector('#heatmapGrid');
		days.forEach((day) => {
			const count = heatmap[day] || 0;
			const level = count === 0 ? 0 : Math.min(4, Math.ceil((count / maxCount) * 4));
			const cell = document.createElement('span');
			cell.className = 'heatmap-cell';
			cell.dataset.level = level;
			cell.title = `${day}: ${count}`;
			grid.appendChild(cell);
		});

		const topEl = root.querySelector('#topHabits');
		if (!topHabits.length) {
			topEl.innerHTML = `<div class="empty-state glass-card"><p>Нет данных</p></div>`;
			return;
		}

		topHabits.forEach((h, i) => {
			topEl.insertAdjacentHTML('beforeend', `
				<div class="glass-card habits-list-item">
					<div style="font-size:18px;font-weight:700;color:var(--text-muted);width:24px">${i + 1}</div>
					<div class="habit-card__icon" style="background:${h.color}22">${h.icon}</div>
					<div class="habit-card__body">
						<div class="habit-card__title">${escapeHtml(h.title)}</div>
						<div class="habit-card__meta">🔥 ${h.streak} дн. · рекорд ${h.best}</div>
					</div>
				</div>
			`);
		});
	}

	mount();

	return { destroy() { unsub(); } };
}
