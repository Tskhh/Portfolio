import {
	getActiveHabits,
	isCompleted,
	toggleHabit,
	getTodayProgress,
	getStreak,
	getDayCompletion,
	subscribe
} from '../store.js';
import {
	greeting,
	formatWeekday,
	todayKey,
	formatDateKey,
	getWeekDates,
	formatShortWeekday
} from '../utils/date.js';
import { el, escapeHtml, svgCheck } from '../utils/dom.js';

export function renderToday({ root }) {
	let unsub = subscribe(() => mount());

	function mount() {
		const date = todayKey();
		const habits = getActiveHabits();
		const progress = getTodayProgress(date);
		const week = getWeekDates();

		root.innerHTML = `
			<div class="today-greeting">${greeting()}</div>
			<h1 class="page-title">${formatWeekday()}</h1>
			<p class="page-subtitle" style="margin-bottom:20px">${new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</p>

			<div class="week-strip">
				${week.map((d) => {
					const key = formatDateKey(d);
					const pct = getDayCompletion(key);
					const isToday = key === date;
					const complete = pct === 1 && habits.length > 0;
					return `
						<div class="week-day${isToday ? ' is-today' : ''}${complete ? ' is-complete' : ''}">
							<div class="week-day__name">${formatShortWeekday(d)}</div>
							<div class="week-day__num">${d.getDate()}</div>
						</div>`;
				}).join('')}
			</div>

			<div class="glass-card progress-card">
				<div class="progress-ring-wrap">
					<svg width="120" height="120" viewBox="0 0 120 120">
						<circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="10"/>
						<circle cx="60" cy="60" r="52" fill="none" stroke="var(--accent)" stroke-width="10"
							stroke-dasharray="${326.7 * progress.percent / 100} 326.7"
							stroke-linecap="round"/>
					</svg>
					<span>${progress.percent}%</span>
				</div>
				<div class="progress-card__label">${progress.done} из ${progress.total} выполнено</div>
			</div>

			<div class="section-label">Привычки на сегодня</div>
			<div class="habit-list" id="todayHabits"></div>
		`;

		const list = root.querySelector('#todayHabits');
		if (!habits.length) {
			list.innerHTML = `
				<div class="empty-state glass-card">
					<div class="empty-state__icon">🌱</div>
					<h3>Пока нет привычек</h3>
					<p>Добавьте первую привычку во вкладке «Привычки»</p>
				</div>`;
			return;
		}

		habits.forEach((habit) => {
			const done = isCompleted(habit.id, date);
			const streak = getStreak(habit.id);
			const card = el(`
				<button type="button" class="glass-card habit-card${done ? ' is-done' : ''}" data-id="${habit.id}">
					<div class="habit-card__icon" style="background:${habit.color}22">${habit.icon}</div>
					<div class="habit-card__body">
						<div class="habit-card__title">${escapeHtml(habit.title)}</div>
						<div class="habit-card__meta">${streak > 0 ? `🔥 ${streak} дн. подряд` : 'Начните streak сегодня'}</div>
					</div>
					<div class="habit-card__check">${svgCheck()}</div>
				</button>
			`);
			card.addEventListener('click', () => {
				const nowDone = toggleHabit(habit.id, date);
				card.classList.toggle('is-done', nowDone);
				updateProgressRing();
			});
			list.appendChild(card);
		});
	}

	function updateProgressRing() {
		const progress = getTodayProgress();
		const span = root.querySelector('.progress-ring-wrap span');
		const circle = root.querySelector('.progress-ring-wrap circle:last-child');
		const label = root.querySelector('.progress-card__label');
		if (span) span.textContent = `${progress.percent}%`;
		if (circle) circle.setAttribute('stroke-dasharray', `${326.7 * progress.percent / 100} 326.7`);
		if (label) label.textContent = `${progress.done} из ${progress.total} выполнено`;
	}

	mount();

	return {
		destroy() {
			unsub();
		}
	};
}
