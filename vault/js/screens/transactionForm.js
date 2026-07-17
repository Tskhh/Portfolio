import {
	addTransaction,
	getCategories,
	getCards,
	getDefaultCard,
	subscribe
} from '../store.js';
import { todayKey } from '../utils/date.js';
import { el } from '../utils/helpers.js';
import { closeBottomSheet, openBottomSheet } from '../ui/bottomSheet.js';
import { toast } from '../ui/toast.js';

export function openTransactionForm() {
	let type = 'expense';
	let categoryId = getCategories('expense')[0]?.id;

	const form = el(`
		<form id="txForm">
			<div class="type-toggle">
				<button type="button" data-type="expense" class="is-active">Расход</button>
				<button type="button" data-type="income">Доход</button>
			</div>
			<div class="field">
				<label for="txTitle">Описание</label>
				<input id="txTitle" required maxlength="64" placeholder="Например: Обед">
			</div>
			<div class="field">
				<label for="txAmount">Сумма, ₽</label>
				<input id="txAmount" type="number" required min="1" step="1" inputmode="numeric" placeholder="0">
			</div>
			<div class="field">
				<label for="txCategory">Категория</label>
				<select id="txCategory"></select>
			</div>
			<div class="field">
				<label for="txCard">Карта</label>
				<select id="txCard"></select>
			</div>
			<div class="field">
				<label for="txDate">Дата</label>
				<input id="txDate" type="date" value="${todayKey()}">
			</div>
			<div class="form-actions">
				<button type="submit" class="btn btn--primary btn--block">Добавить</button>
				<button type="button" class="btn btn--ghost btn--block" id="cancelTx">Отмена</button>
			</div>
		</form>
	`);

	const catSelect = form.querySelector('#txCategory');
	const cardSelect = form.querySelector('#txCard');

	function fillCategories() {
		const cats = getCategories(type);
		catSelect.innerHTML = cats.map((c) => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join('');
		if (!cats.find((c) => c.id === categoryId)) categoryId = cats[0]?.id;
		catSelect.value = categoryId;
	}

	getCards().forEach((c) => {
		cardSelect.insertAdjacentHTML('beforeend', `<option value="${c.id}" ${c.isDefault ? 'selected' : ''}>${c.name} ••${c.last4}</option>`);
	});

	fillCategories();

	form.querySelector('.type-toggle').addEventListener('click', (e) => {
		const btn = e.target.closest('[data-type]');
		if (!btn) return;
		type = btn.dataset.type;
		form.querySelectorAll('.type-toggle button').forEach((b) => b.classList.toggle('is-active', b === btn));
		fillCategories();
	});

	form.querySelector('#cancelTx').addEventListener('click', closeBottomSheet);

	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const amount = Number(form.querySelector('#txAmount').value);
		const title = form.querySelector('#txTitle').value.trim();
		if (!amount || !title) return;

		addTransaction({
			type,
			amount,
			title,
			categoryId: form.querySelector('#txCategory').value,
			cardId: form.querySelector('#txCard').value,
			date: form.querySelector('#txDate').value
		});
		toast('Операция добавлена', 'success');
		closeBottomSheet();
	});

	openBottomSheet({ title: 'Новая операция', content: form });
}
