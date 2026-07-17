const KEY = 'streakly_v1';
const VERSION = 1;

const SEED = {
	version: VERSION,
	profile: { name: 'Егор', joinedAt: '2025-01-15' },
	habits: [
		{ id: 'h1', title: 'Утренняя зарядка', icon: '💪', color: '#6C5CE7', goal: 'daily', createdAt: '2025-06-01' },
		{ id: 'h2', title: 'Читать 30 мин', icon: '📚', color: '#00D2A0', goal: 'daily', createdAt: '2025-06-01' },
		{ id: 'h3', title: '2L воды', icon: '💧', color: '#3B82F6', goal: 'daily', createdAt: '2025-06-10' },
		{ id: 'h4', title: 'Медитация', icon: '🧘', color: '#F59E0B', goal: 'daily', createdAt: '2025-06-15' },
		{ id: 'h5', title: 'Без соцсетей до 12:00', icon: '📵', color: '#FF6B6B', goal: 'daily', createdAt: '2025-07-01' }
	],
	logs: []
};

function buildSeedLogs() {
	const logs = [];
	const habitIds = SEED.habits.map((h) => h.id);
	const today = new Date();

	for (let i = 60; i >= 0; i--) {
		const d = new Date(today);
		d.setDate(d.getDate() - i);
		const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
		const dow = d.getDay();
		if (dow === 0) continue;

		habitIds.forEach((hid, idx) => {
			const chance = 0.72 - idx * 0.06;
			if (Math.random() < chance) {
				logs.push({ id: `l-${key}-${hid}`, habitId: hid, date: key, completedAt: d.toISOString() });
			}
		});
	}
	return logs;
}

export function loadState() {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) {
			const initial = { ...SEED, logs: buildSeedLogs() };
			saveState(initial);
			return initial;
		}
		const data = JSON.parse(raw);
		if (!data.version) data.version = VERSION;
		return data;
	} catch {
		const initial = { ...SEED, logs: buildSeedLogs() };
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

export function exportState() {
	return JSON.stringify(loadState(), null, 2);
}

export function importState(json) {
	const data = JSON.parse(json);
	if (!data.habits || !Array.isArray(data.logs)) throw new Error('Неверный формат');
	saveState({ ...data, version: VERSION });
	return data;
}
