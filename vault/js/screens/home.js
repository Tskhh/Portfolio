import {
	getBalance,
	getMonthStats,
	getCards,
	getCardBalance,
	getTransactions,
	getCategory,
	subscribe
} from '../store.js';
import { greeting, formatDisplayDate } from '../utils/date.js';
import { formatMoney, formatMoneyShort, escapeHtml } from '../utils/helpers.js';
import { openTransactionForm } from './transactionForm.js';

function renderTxItem(tx) {
	const cat = getCategory(tx.categoryId);
	return `
		<div class="tx-item" data-id="${tx.id}">
			<div class="tx-item__icon" style="background:${cat?.color ?? '#64748B'}22">${cat?.icon ?? '📦'}</div>
			<div class="tx-item__body">
				<div class="tx-item__title">${escapeHtml(tx.title)}</div>
				<div class="tx-item__meta">${cat?.name ?? '—'} · ${formatDisplayDate(tx.date)}</div>
			</div>
			<div class="tx-item__amount ${tx.type}">${tx.type === 'income' ? '+' : '−'}${formatMoneyShort(tx.amount)}</div>
		</div>`;
}

export function renderHome({ root }) {
	let unsub = subscribe(() => mount());

	function mount() {
		const balance = getBalance();
		const month = getMonthStats();
		const recent = getTransactions().slice(0, 6);
		const cards = getCards();

		root.innerHTML = `
			<div class="today-greeting" style="font-size:14px;color:var(--text-secondary);margin-bottom:4px">${greeting()}</div>
			<h1 class="page-title">Vault</h1>
			<p class="page-subtitle" style="margin-bottom:20px">Ваши финансы под контролем</p>

			<div class="balance-hero">
				<div class="section-label" style="margin:0">Общий баланс</div>
				<div class="balance-hero__amount">${formatMoney(balance)}</div>
				<div class="balance-hero__change ${month.net >= 0 ? 'is-up' : 'is-down'}">
					${month.net >= 0 ? '↑' : '↓'} ${formatMoneyShort(Math.abs(month.net))} за месяц
				</div>
			</div>

			<div class="home-cards-scroll">
				${cards.map((c) => `
					<div class="bank-card glass-card" style="background:linear-gradient(135deg, ${c.gradientFrom}, ${c.gradientTo})">
						<div class="bank-card__chip"></div>
						<div class="bank-card__number">•••• •••• •••• ${c.last4}</div>
						<div class="bank-card__row">
							<div>
								<div class="bank-card__label">Карта</div>
								<div class="bank-card__value">${escapeHtml(c.name)}</div>
							</div>
							<div style="text-align:right">
								<div class="bank-card__label">Баланс</div>
								<div class="bank-card__balance">${formatMoneyShort(getCardBalance(c.id))}</div>
							</div>
						</div>
					</div>
				`).join('')}
			</div>

			<div class="quick-stats">
				<div class="glass-card quick-stat">
					<div class="quick-stat__value income">+${formatMoneyShort(month.income)}</div>
					<div class="quick-stat__label">Доход за месяц</div>
				</div>
				<div class="glass-card quick-stat">
					<div class="quick-stat__value expense">−${formatMoneyShort(month.expense)}</div>
					<div class="quick-stat__label">Расход за месяц</div>
				</div>
			</div>

			<div class="section-label">Недавние операции</div>
			<div class="glass-card" style="padding:0 16px;margin-bottom:12px" id="recentTx">
				${recent.length ? recent.map(renderTxItem).join('') : '<div class="empty-state"><p>Нет операций</p></div>'}
			</div>
			${recent.length ? '<button type="button" class="btn btn--ghost btn--block" id="viewAllTx">Все операции</button>' : ''}
		`;

		root.querySelector('#viewAllTx')?.addEventListener('click', () => {
			location.hash = '#/transactions';
		});
	}

	mount();
	return { destroy() { unsub(); } };
}

export function setupHomeFab() {
	document.getElementById('globalFab')?.addEventListener('click', () => {
		const path = location.hash.slice(1) || '/';
		if (path === '/' || path === '/transactions') openTransactionForm();
	});
}
