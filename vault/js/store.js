import { loadState, saveState, resetState } from './storage.js';
import { uid } from './utils/helpers.js';
import { todayKey, isInCurrentMonth, getWeekStart } from './utils/date.js';

const listeners = new Set();
let state = loadState();

function emit() { listeners.forEach((fn) => fn(state)); }
function persist() { saveState(state); emit(); }

export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
export function getState() { return state; }

export function getCategories(type = null) {
	if (!type) return state.categories;
	return state.categories.filter((c) => c.type === type || c.type === 'both');
}

export function getCategory(id) {
	return state.categories.find((c) => c.id === id);
}

export function getCards() {
	return state.cards;
}

export function getCard(id) {
	return state.cards.find((c) => c.id === id);
}

export function getDefaultCard() {
	return state.cards.find((c) => c.isDefault) ?? state.cards[0];
}

export function getTransactions(filter = {}) {
	let list = [...state.transactions];
	if (filter.type) list = list.filter((t) => t.type === filter.type);
	if (filter.categoryId) list = list.filter((t) => t.categoryId === filter.categoryId);
	if (filter.cardId) list = list.filter((t) => t.cardId === filter.cardId);
	if (filter.search) {
		const q = filter.search.toLowerCase();
		list = list.filter((t) => t.title.toLowerCase().includes(q));
	}
	if (filter.month) list = list.filter((t) => t.date.startsWith(filter.month));
	return list.sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
}

export function getBalance() {
	return state.transactions.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
}

export function getCardBalance(cardId) {
	return state.transactions
		.filter((t) => t.cardId === cardId)
		.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
}

export function getMonthStats(month = null) {
	const m = month ?? `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
	const txs = state.transactions.filter((t) => t.date.startsWith(m));
	const income = txs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
	const expense = txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
	return { income, expense, net: income - expense, count: txs.length };
}

export function getWeekStats() {
	const start = getWeekStart();
	const txs = state.transactions.filter((t) => {
		const [y, m, d] = t.date.split('-').map(Number);
		const dt = new Date(y, m - 1, d);
		return dt >= start;
	});
	const expense = txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
	const income = txs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
	return { expense, income };
}

export function getCategoryBreakdown(month = null) {
	const m = month ?? `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
	const txs = state.transactions.filter((t) => t.type === 'expense' && t.date.startsWith(m));
	const map = {};
	txs.forEach((t) => {
		map[t.categoryId] = (map[t.categoryId] || 0) + t.amount;
	});
	return Object.entries(map)
		.map(([categoryId, amount]) => ({ categoryId, amount, category: getCategory(categoryId) }))
		.sort((a, b) => b.amount - a.amount);
}

export function getMonthlyTrend(count = 6) {
	const keys = [];
	const d = new Date();
	for (let i = count - 1; i >= 0; i--) {
		const dt = new Date(d.getFullYear(), d.getMonth() - i, 1);
		keys.push(`${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`);
	}
	return keys.map((key) => ({ key, ...getMonthStats(key) }));
}

export function addTransaction({ type, amount, categoryId, cardId, title, date = todayKey() }) {
	const tx = {
		id: uid(),
		type,
		amount: Math.abs(Number(amount)),
		categoryId,
		cardId: cardId || getDefaultCard()?.id,
		title: title.trim(),
		date,
		createdAt: new Date().toISOString()
	};
	state.transactions.unshift(tx);
	persist();
	return tx;
}

export function deleteTransaction(id) {
	state.transactions = state.transactions.filter((t) => t.id !== id);
	persist();
}

export function addCard({ name, last4, gradientFrom, gradientTo }) {
	const card = { id: uid(), name, last4, gradientFrom, gradientTo, isDefault: false };
	state.cards.push(card);
	persist();
	return card;
}

export function resetAll() {
	state = resetState();
	emit();
}

export function getProfile() {
	return state.profile;
}

export function getGlobalStats() {
	const month = getMonthStats();
	const balance = getBalance();
	return { balance, ...month };
}
