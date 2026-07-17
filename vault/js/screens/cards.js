import { getCards, getCardBalance, addCard, resetAll, getProfile, subscribe } from '../store.js';
import { formatMoney, formatMoneyShort, escapeHtml, el } from '../utils/helpers.js';
import { closeBottomSheet, openBottomSheet } from '../ui/bottomSheet.js';
import { toast } from '../ui/toast.js';

export function renderCards({ root }) {
	let unsub = subscribe(() => mount());

	function openAddCard() {
		const form = el(`
			<form id="cardForm">
				<div class="field"><label>Название</label><input id="cardName" required placeholder="Накопления"></div>
				<div class="field"><label>Последние 4 цифры</label><input id="cardLast4" required maxlength="4" pattern="\\d{4}" inputmode="numeric" placeholder="1234"></div>
				<div class="form-actions">
					<button type="submit" class="btn btn--primary btn--block">Добавить карту</button>
					<button type="button" class="btn btn--ghost btn--block" id="cancelCard">Отмена</button>
				</div>
			</form>
		`);
		form.querySelector('#cancelCard').addEventListener('click', closeBottomSheet);
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			addCard({
				name: form.querySelector('#cardName').value.trim(),
				last4: form.querySelector('#cardLast4').value,
				gradientFrom: '#334155',
				gradientTo: '#1e293b'
			});
			toast('Карта добавлена', 'success');
			closeBottomSheet();
		});
		openBottomSheet({ title: 'Новая карта', content: form });
	}

	function mount() {
		const cards = getCards();
		const profile = getProfile();

		root.innerHTML = `
			<p class="page-subtitle" style="margin-bottom:16px">${profile.name ?? 'Пользователь'}</p>
			<div class="cards-actions">
				<button type="button" class="btn btn--primary" id="addCardBtn">+ Карта</button>
				<button type="button" class="btn btn--ghost" id="resetBtn">Сброс</button>
			</div>
			<div id="cardsList"></div>
			<p style="font-size:12px;color:var(--text-muted);text-align:center;margin-top:24px">
				Vault · данные локально · Portfolio demo
			</p>
		`;

		const list = root.querySelector('#cardsList');
		cards.forEach((c) => {
			list.insertAdjacentHTML('beforeend', `
				<div class="card-mini glass-card" style="--card-from:${c.gradientFrom};--card-to:${c.gradientTo};background:linear-gradient(135deg,${c.gradientFrom},${c.gradientTo})">
					<div class="card-mini__name">${escapeHtml(c.name)} ${c.isDefault ? '· основная' : ''}</div>
					<div class="card-mini__balance">${formatMoney(getCardBalance(c.id))}</div>
					<div class="card-mini__last">•••• ${c.last4}</div>
				</div>
			`);
		});

		root.querySelector('#addCardBtn').addEventListener('click', openAddCard);
		root.querySelector('#resetBtn').addEventListener('click', () => {
			if (confirm('Сбросить все данные Vault?')) {
				resetAll();
				toast('Данные сброшены', 'success');
			}
		});
	}

	mount();
	return { destroy() { unsub(); } };
}
