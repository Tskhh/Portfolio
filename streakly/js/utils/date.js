const MONTHS = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
const WEEKDAYS = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
const WEEKDAYS_FULL = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];

export function todayKey() {
	return formatDateKey(new Date());
}

export function formatDateKey(date) {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, '0');
	const d = String(date.getDate()).padStart(2, '0');
	return `${y}-${m}-${d}`;
}

export function parseDateKey(key) {
	const [y, m, d] = key.split('-').map(Number);
	return new Date(y, m - 1, d);
}

export function formatDisplayDate(key) {
	const date = parseDateKey(key);
	const today = todayKey();
	if (key === today) return 'Сегодня';
	const yesterday = formatDateKey(addDays(new Date(), -1));
	if (key === yesterday) return 'Вчера';
	return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

export function formatWeekday(date = new Date()) {
	return WEEKDAYS_FULL[date.getDay()];
}

export function formatShortWeekday(date) {
	return WEEKDAYS[date.getDay()];
}

export function addDays(date, n) {
	const d = new Date(date);
	d.setDate(d.getDate() + n);
	return d;
}

export function getWeekDates(base = new Date()) {
	const day = base.getDay();
	const mondayOffset = day === 0 ? -6 : 1 - day;
	const monday = addDays(base, mondayOffset);
	return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

export function getLastNDays(n, end = new Date()) {
	return Array.from({ length: n }, (_, i) => formatDateKey(addDays(end, -(n - 1 - i))));
}

export function getHeatmapDays(weeks = 12) {
	const total = weeks * 7;
	const end = new Date();
	const start = addDays(end, -(total - 1));
	return Array.from({ length: total }, (_, i) => formatDateKey(addDays(start, i)));
}

export function greeting() {
	const h = new Date().getHours();
	if (h < 6) return 'Доброй ночи';
	if (h < 12) return 'Доброе утро';
	if (h < 18) return 'Добрый день';
	return 'Добрый вечер';
}
