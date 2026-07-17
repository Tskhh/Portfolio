export function todayKey() {
	const d = new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function formatDisplayDate(key) {
	const [y, m, day] = key.split('-').map(Number);
	const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
	if (key === todayKey()) return 'Сегодня';
	return `${day} ${months[m - 1]}`;
}

export function getMonthKeys(count = 6) {
	const keys = [];
	const d = new Date();
	for (let i = count - 1; i >= 0; i--) {
		const dt = new Date(d.getFullYear(), d.getMonth() - i, 1);
		keys.push(`${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`);
	}
	return keys;
}

export function getMonthLabel(key) {
	const [y, m] = key.split('-').map(Number);
	const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
	return months[m - 1];
}

export function getWeekStart() {
	const d = new Date();
	const day = d.getDay();
	const diff = day === 0 ? -6 : 1 - day;
	d.setDate(d.getDate() + diff);
	d.setHours(0, 0, 0, 0);
	return d;
}

export function isInCurrentMonth(dateKey) {
	const [y, m] = dateKey.split('-');
	const now = new Date();
	return Number(y) === now.getFullYear() && Number(m) === now.getMonth() + 1;
}

export function greeting() {
	const h = new Date().getHours();
	if (h < 6) return 'Доброй ночи';
	if (h < 12) return 'Доброе утро';
	if (h < 18) return 'Добрый день';
	return 'Добрый вечер';
}
