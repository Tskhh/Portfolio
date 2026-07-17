import { addHabit, updateHabit, getHabit } from '../store.js';
import { closeBottomSheet, openBottomSheet } from '../ui/bottomSheet.js';
import { toast } from '../ui/toast.js';
import { el } from '../utils/dom.js';

const COLORS = ['#6C5CE7', '#00D2A0', '#3B82F6', '#F59E0B', '#FF6B6B', '#EC4899', '#14B8A6', '#8B5CF6'];
const ICONS = ['💪', '📚', '💧', '🧘', '🏃', '😴', '🥗', '💻', '🎯', '✍️', '🎸', '🧠'];

export function openHabitForm(habitId = null) {
	const existing = habitId ? getHabit(habitId) : null;
	let selectedColor = existing?.color ?? COLORS[0];
	let selectedIcon = existing?.icon ?? ICONS[0];

	const form = el(`
		<form id="habitForm">
			<div class="field">
				<label for="habitTitle">Название</label>
				<input id="habitTitle" name="title" required maxlength="48" placeholder="Например: Утренняя пробежка" value="${existing?.title ?? ''}">
			</div>
			<div class="field">
				<label>Иконка</label>
				<div class="icon-picker" id="iconPicker">
					${ICONS.map((ic) => `<button type="button" data-icon="${ic}" class="${ic === selectedIcon ? 'is-active' : ''}">${ic}</button>`).join('')}
				</div>
			</div>
			<div class="field">
				<label>Цвет</label>
				<div class="color-picker" id="colorPicker">
					${COLORS.map((c) => `<button type="button" data-color="${c}" style="background:${c}" class="${c === selectedColor ? 'is-active' : ''}"></button>`).join('')}
				</div>
			</div>
			<div class="form-actions">
				<button type="submit" class="btn btn--primary btn--block">${existing ? 'Сохранить' : 'Создать'}</button>
				<button type="button" class="btn btn--ghost btn--block" id="cancelForm">Отмена</button>
			</div>
		</form>
	`);

	form.querySelector('#iconPicker').addEventListener('click', (e) => {
		const btn = e.target.closest('[data-icon]');
		if (!btn) return;
		selectedIcon = btn.dataset.icon;
		form.querySelectorAll('#iconPicker button').forEach((b) => b.classList.toggle('is-active', b === btn));
	});

	form.querySelector('#colorPicker').addEventListener('click', (e) => {
		const btn = e.target.closest('[data-color]');
		if (!btn) return;
		selectedColor = btn.dataset.color;
		form.querySelectorAll('#colorPicker button').forEach((b) => b.classList.toggle('is-active', b === btn));
	});

	form.querySelector('#cancelForm').addEventListener('click', closeBottomSheet);

	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const title = form.querySelector('#habitTitle').value.trim();
		if (!title) return;

		if (existing) {
			updateHabit(existing.id, { title, icon: selectedIcon, color: selectedColor });
			toast('Привычка обновлена', 'success');
		} else {
			addHabit({ title, icon: selectedIcon, color: selectedColor });
			toast('Привычка создана', 'success');
		}
		closeBottomSheet();
	});

	openBottomSheet({
		title: existing ? 'Редактировать' : 'Новая привычка',
		content: form
	});
}
