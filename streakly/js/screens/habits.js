import {
	getHabits,
	deleteHabit,
	getStreak,
	getCompletionCount,
	getBestStreak,
	subscribe
} from '../store.js';
import { el, escapeHtml } from '../utils/dom.js';
import { toast } from '../ui/toast.js';
import { openHabitForm } from './habitForm.js';

export function renderHabits({ root }) {
	let unsub = subscribe(() => mount());

	function mount() {
		const habits = getHabits();

		root.innerHTML = `
			<p class="page-subtitle" style="margin-bottom:20px">Управляйте своими целями</p>
			<div id="habitsList"></div>
		`;

		const list = root.querySelector('#habitsList');

		if (!habits.length) {
			list.innerHTML = `
				<div class="empty-state glass-card">
					<div class="empty-state__icon">✨</div>
					<h3>Список пуст</h3>
					<p>Создайте привычку — маленький шаг каждый день меняет всё</p>
					<button type="button" class="btn btn--primary" id="addFirst">Добавить привычку</button>
				</div>`;
			list.querySelector('#addFirst')?.addEventListener('click', () => openHabitForm());
			return;
		}

		habits.forEach((habit) => {
			const streak = getStreak(habit.id);
			const total = getCompletionCount(habit.id);
			const best = getBestStreak(habit.id);
			const item = el(`
				<div class="glass-card habits-list-item" data-id="${habit.id}">
					<div class="habit-card__icon" style="background:${habit.color}22">${habit.icon}</div>
					<div class="habit-card__body">
						<div class="habit-card__title">${escapeHtml(habit.title)}</div>
						<div class="habit-card__meta">🔥 ${streak} · лучший ${best} · всего ${total}</div>
					</div>
					<div class="habits-list-item__actions">
						<button type="button" class="icon-btn edit-btn" aria-label="Редактировать">✏️</button>
						<button type="button" class="icon-btn delete-btn" aria-label="Удалить">🗑</button>
					</div>
				</div>
			`);

			item.querySelector('.edit-btn').addEventListener('click', () => openHabitForm(habit.id));
			item.querySelector('.delete-btn').addEventListener('click', () => {
				if (confirm(`Удалить «${habit.title}»?`)) {
					deleteHabit(habit.id);
					toast('Привычка удалена', 'success');
				}
			});
			list.appendChild(item);
		});

		const fab = document.getElementById('globalFab');
		if (fab) fab.hidden = false;
	}

	mount();

	return {
		destroy() {
			unsub();
			const fab = document.getElementById('globalFab');
			if (fab) fab.hidden = true;
		}
	};
}

export function setupHabitsFab() {
	document.getElementById('globalFab')?.addEventListener('click', () => {
		if (location.hash.includes('/habits') || location.hash === '#/habits') {
			openHabitForm();
		}
	});
}
