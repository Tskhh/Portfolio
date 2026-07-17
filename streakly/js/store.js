import { loadState, saveState, resetState, exportState, importState } from './storage.js';
import { uid } from './utils/id.js';
import { todayKey, formatDateKey, addDays, parseDateKey } from './utils/date.js';

const listeners = new Set();
let state = loadState();

function emit() {
	listeners.forEach((fn) => fn(state));
}

export function subscribe(fn) {
	listeners.add(fn);
	return () => listeners.delete(fn);
}

export function getState() {
	return state;
}

function persist() {
	saveState(state);
	emit();
}

export function getHabits() {
	return [...state.habits].sort((a, b) => a.title.localeCompare(b.title, 'ru'));
}

export function getActiveHabits() {
	return getHabits();
}

export function getHabit(id) {
	return state.habits.find((h) => h.id === id);
}

export function isCompleted(habitId, date = todayKey()) {
	return state.logs.some((l) => l.habitId === habitId && l.date === date);
}

export function toggleHabit(habitId, date = todayKey()) {
	const existing = state.logs.find((l) => l.habitId === habitId && l.date === date);
	if (existing) {
		state.logs = state.logs.filter((l) => l.id !== existing.id);
	} else {
		state.logs.push({ id: uid(), habitId, date, completedAt: new Date().toISOString() });
	}
	persist();
	return !existing;
}

export function addHabit({ title, icon, color, goal = 'daily' }) {
	const habit = { id: uid(), title, icon, color, goal, createdAt: todayKey() };
	state.habits.push(habit);
	persist();
	return habit;
}

export function updateHabit(id, patch) {
	const idx = state.habits.findIndex((h) => h.id === id);
	if (idx === -1) return null;
	state.habits[idx] = { ...state.habits[idx], ...patch };
	persist();
	return state.habits[idx];
}

export function deleteHabit(id) {
	state.habits = state.habits.filter((h) => h.id !== id);
	state.logs = state.logs.filter((l) => l.habitId !== id);
	persist();
}

export function getTodayProgress(date = todayKey()) {
	const habits = getActiveHabits();
	if (!habits.length) return { done: 0, total: 0, percent: 0 };
	const done = habits.filter((h) => isCompleted(h.id, date)).length;
	return { done, total: habits.length, percent: Math.round((done / habits.length) * 100) };
}

export function getStreak(habitId) {
	let streak = 0;
	let d = new Date();
	while (true) {
		const key = formatDateKey(d);
		if (isCompleted(habitId, key)) {
			streak++;
			d = addDays(d, -1);
		} else if (key === todayKey() && !isCompleted(habitId, key)) {
			d = addDays(d, -1);
		} else {
			break;
		}
	}
	return streak;
}

export function getBestStreak(habitId) {
	const dates = state.logs
		.filter((l) => l.habitId === habitId)
		.map((l) => l.date)
		.sort();
	if (!dates.length) return 0;

	let best = 1;
	let current = 1;
	for (let i = 1; i < dates.length; i++) {
		const prev = parseDateKey(dates[i - 1]);
		const curr = parseDateKey(dates[i]);
		const diff = (curr - prev) / 86400000;
		if (diff === 1) {
			current++;
			best = Math.max(best, current);
		} else if (diff > 1) {
			current = 1;
		}
	}
	return best;
}

export function getCompletionCount(habitId) {
	return state.logs.filter((l) => l.habitId === habitId).length;
}

export function getHeatmapData() {
	const map = {};
	state.logs.forEach((l) => {
		map[l.date] = (map[l.date] || 0) + 1;
	});
	return map;
}

export function getDayCompletion(date) {
	const habits = getActiveHabits();
	if (!habits.length) return 0;
	const done = habits.filter((h) => isCompleted(h.id, date)).length;
	return done / habits.length;
}

export function getTotalCompletions() {
	return state.logs.length;
}

export function getProfile() {
	return state.profile;
}

export function updateProfile(patch) {
	state.profile = { ...state.profile, ...patch };
	persist();
}

export function resetAll() {
	state = resetState();
	emit();
}

export function exportData() {
	return exportState();
}

export function importData(json) {
	state = importState(json);
	emit();
}

export function getGlobalStats() {
	const habits = getActiveHabits();
	const streaks = habits.map((h) => getStreak(h.id));
	return {
		totalHabits: habits.length,
		totalCompletions: getTotalCompletions(),
		bestStreak: streaks.length ? Math.max(...streaks) : 0,
		todayPercent: getTodayProgress().percent
	};
}
