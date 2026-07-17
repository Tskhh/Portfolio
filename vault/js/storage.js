const KEY = 'vault_v1';
const VERSION = 1;

const CATEGORIES = [
	{ id: 'cat-food', name: 'Еда', icon: '🍔', color: '#F59E0B', type: 'expense' },
	{ id: 'cat-transport', name: 'Транспорт', icon: '🚇', color: '#3B82F6', type: 'expense' },
	{ id: 'cat-shopping', name: 'Покупки', icon: '🛍', color: '#EC4899', type: 'expense' },
	{ id: 'cat-fun', name: 'Развлечения', icon: '🎬', color: '#8B5CF6', type: 'expense' },
	{ id: 'cat-bills', name: 'Счета', icon: '📄', color: '#64748B', type: 'expense' },
	{ id: 'cat-health', name: 'Здоровье', icon: '💊', color: '#14B8A6', type: 'expense' },
	{ id: 'cat-salary', name: 'Зарплата', icon: '💼', color: '#22C55E', type: 'income' },
	{ id: 'cat-freelance', name: 'Фриланс', icon: '💻', color: '#06B6D4', type: 'income' },
	{ id: 'cat-other', name: 'Другое', icon: '📦', color: '#94A3B8', type: 'both' }
];

const CARDS = [
	{ id: 'card-main', name: 'Основная', last4: '4821', gradientFrom: '#1e3a5f', gradientTo: '#0f2744', isDefault: true },
	{ id: 'card-savings', name: 'Накопления', last4: '7733', gradientFrom: '#1a4d3e', gradientTo: '#0d3328', isDefault: false }
];

function randomBetween(a, b) {
	return Math.floor(Math.random() * (b - a + 1)) + a;
}

function buildSeedTransactions() {
	const txs = [];
	const expenseCats = CATEGORIES.filter((c) => c.type === 'expense');
	const incomeCats = CATEGORIES.filter((c) => c.type === 'income');
	const titles = {
		'cat-food': ['Пятёрочка', 'Додо Пицца', 'Кофейня', 'Обед'],
		'cat-transport': ['Метро', 'Яндекс Go', 'Бензин'],
		'cat-shopping': ['Ozon', 'Wildberries', 'DNS'],
		'cat-fun': ['Kion', 'Steam', 'Кино'],
		'cat-bills': ['Интернет', 'Мобильная связь', 'Аренда'],
		'cat-health': ['Аптека', 'Спортзал'],
		'cat-salary': ['Зарплата'],
		'cat-freelance': ['Проект', 'Заказ']
	};

	const today = new Date();
	for (let i = 90; i >= 0; i--) {
		const d = new Date(today);
		d.setDate(d.getDate() - i);
		const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

		if (d.getDate() === 10) {
			txs.push({
				id: `tx-salary-${date}`,
				type: 'income',
				amount: 95000 + randomBetween(-5000, 5000),
				categoryId: 'cat-salary',
				cardId: 'card-main',
				title: 'Зарплата',
				date,
				createdAt: d.toISOString()
			});
		}

		if (d.getDate() === 25 && d.getMonth() % 2 === 0) {
			txs.push({
				id: `tx-freelance-${date}`,
				type: 'income',
				amount: randomBetween(15000, 45000),
				categoryId: 'cat-freelance',
				cardId: 'card-main',
				title: 'Фриланс проект',
				date,
				createdAt: d.toISOString()
			});
		}

		const dailyCount = randomBetween(0, 3);
		for (let j = 0; j < dailyCount; j++) {
			const cat = expenseCats[randomBetween(0, expenseCats.length - 1)];
			const names = titles[cat.id] || ['Покупка'];
			txs.push({
				id: `tx-${date}-${j}-${Math.random().toString(36).slice(2, 6)}`,
				type: 'expense',
				amount: randomBetween(150, cat.id === 'cat-shopping' ? 12000 : 3500),
				categoryId: cat.id,
				cardId: Math.random() > 0.85 ? 'card-savings' : 'card-main',
				title: names[randomBetween(0, names.length - 1)],
				date,
				createdAt: d.toISOString()
			});
		}
	}

	return txs.sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
}

const SEED = {
	version: VERSION,
	profile: { name: 'Егор' },
	categories: CATEGORIES,
	cards: CARDS,
	transactions: []
};

export function loadState() {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) {
			const initial = { ...SEED, transactions: buildSeedTransactions() };
			saveState(initial);
			return initial;
		}
		return JSON.parse(raw);
	} catch {
		const initial = { ...SEED, transactions: buildSeedTransactions() };
		saveState(initial);
		return initial;
	}
}

export function saveState(state) {
	localStorage.setItem(KEY, JSON.stringify(state));
}

export function resetState() {
	localStorage.removeItem(KEY);
	return loadState();
}
