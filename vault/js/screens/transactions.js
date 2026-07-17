import {
	getTransactions,
	getCategories,
	getCategory,
	deleteTransaction,
	subscribe
} from '../store.js';
import { formatDisplayDate } from '../utils/date.js';
import { formatMoneyShort, escapeHtml } from '../utils/helpers.js';
import { toast } from '../ui/toast.js';
import { openTransactionForm } from './transactionForm.js';

export function renderTransactions({ root }) {
	let filterType = '';
	let filterCat = '';
	let search = '';
	let unsub = subscribe(() => mount());

	function mount() {
		const txs = getTransactions({ type: filterType || undefined, categoryId: filterCat || undefined, search: search || undefined });
		const cats = getCategories();

		root.innerHTML = `
			<p class="page-subtitle" style="margin-bottom:16px">${txs.length} операций</p>
			<div class="search-bar">
				<span>🔍</span>
				<input type="search" id="txSearch" placeholder="Поиск..." value="${escapeHtml(search)}">
			</div>
			<div class="filter-chips" id="typeFilters">
				<button type="button" data-type="" class="${!filterType ? 'is-active' : ''}">Все</button>
				<button type="button" data-type="expense" class="${filterType === 'expense' ? 'is-active' : ''}">Расходы</button>
				<button type="button" data-type="income" class="${filterType === 'income' ? 'is-active' : ''}">Доходы</button>
			</div>
			<div class="filter-chips" id="catFilters">
				<button type="button" data-cat="" class="${!filterCat ? 'is-active' : ''}">Все категории</button>
				${cats.map((c) => `<button type="button" data-cat="${c.id}" class="${filterCat === c.id ? 'is-active' : ''}">${c.icon} ${c.name}</button>`).join('')}
			</div>
			<div class="glass-card" style="padding:0 16px" id="txList"></div>
		`;

		const list = root.querySelector('#txList');
		if (!txs.length) {
			list.innerHTML = `<div class="empty-state"><div class="empty-state__icon">📭</div><h3>Ничего не найдено</h3><p>Измените фильтры или добавьте операцию</p></div>`;
		} else {
			txs.forEach((tx) => {
				const cat = getCategory(tx.categoryId);
				const row = document.createElement('div');
				row.className = 'tx-item';
				row.innerHTML = `
					<div class="tx-item__icon" style="background:${cat?.color ?? '#64748B'}22">${cat?.icon ?? '📦'}</div>
					<div class="tx-item__body">
						<div class="tx-item__title">${escapeHtml(tx.title)}</div>
						<div class="tx-item__meta">${cat?.name ?? '—'} · ${formatDisplayDate(tx.date)}</div>
					</div>
					<div class="tx-item__amount ${tx.type}">${tx.type === 'income' ? '+' : '−'}${formatMoneyShort(tx.amount)}</div>
				`;
				row.addEventListener('contextmenu', (e) => {
					e.preventDefault();
					if (confirm('Удалить операцию?')) {
						deleteTransaction(tx.id);
						toast('Удалено', 'success');
					}
				});
				list.appendChild(row);
			});
		}

		root.querySelector('#txSearch').addEventListener('input', (e) => {
			search = e.target.value;
			mount();
		});

		root.querySelector('#typeFilters').addEventListener('click', (e) => {
			const btn = e.target.closest('[data-type]');
			if (!btn) return;
			filterType = btn.dataset.type;
			mount();
		});

		root.querySelector('#catFilters').addEventListener('click', (e) => {
			const btn = e.target.closest('[data-cat]');
			if (!btn) return;
			filterCat = btn.dataset.cat;
			mount();
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
