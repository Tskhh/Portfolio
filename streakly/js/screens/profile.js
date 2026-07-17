import { getProfile, updateProfile, resetAll, exportData, importData, getGlobalStats, subscribe } from '../store.js';
import { toast } from '../ui/toast.js';

export function renderProfile({ root }) {
	let unsub = subscribe(() => mount());

	function mount() {
		const profile = getProfile();
		const stats = getGlobalStats();
		const joined = profile.joinedAt
			? new Date(profile.joinedAt).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
			: 'недавно';

		root.innerHTML = `
			<p class="page-subtitle" style="margin-bottom:20px">Настройки и данные</p>

			<div class="glass-card profile-hero">
				<div class="profile-avatar">${profile.name?.charAt(0)?.toUpperCase() ?? 'S'}</div>
				<h2 style="font-size:20px;margin-bottom:4px">${profile.name ?? 'Пользователь'}</h2>
				<p style="font-size:13px;color:var(--text-secondary)">С нами с ${joined}</p>
				<div style="display:flex;gap:8px;justify-content:center;margin-top:16px;flex-wrap:wrap">
					<span class="streak-badge">🔥 ${stats.bestStreak} лучший streak</span>
					<span class="streak-badge" style="background:var(--success-soft);color:var(--success)">${stats.totalCompletions} выполнений</span>
				</div>
			</div>

			<div class="field">
				<label for="profileName">Имя</label>
				<input id="profileName" value="${profile.name ?? ''}" maxlength="32" placeholder="Ваше имя">
			</div>

			<div class="profile-menu glass-card" style="margin-top:8px">
				<button type="button" id="exportBtn">Экспорт данных <span>JSON</span></button>
				<button type="button" id="importBtn">Импорт данных <span>JSON</span></button>
				<button type="button" id="resetBtn" style="color:var(--danger)">Сбросить всё <span>⚠</span></button>
			</div>

			<p style="font-size:12px;color:var(--text-muted);text-align:center;margin-top:24px">
				Streakly · данные хранятся локально<br>Portfolio demo · Егор Толстых
			</p>
		`;

		root.querySelector('#profileName').addEventListener('change', (e) => {
			updateProfile({ name: e.target.value.trim() || 'Пользователь' });
			toast('Имя сохранено', 'success');
		});

		root.querySelector('#exportBtn').addEventListener('click', () => {
			const blob = new Blob([exportData()], { type: 'application/json' });
			const a = document.createElement('a');
			a.href = URL.createObjectURL(blob);
			a.download = 'streakly-backup.json';
			a.click();
			toast('Файл скачан', 'success');
		});

		root.querySelector('#importBtn').addEventListener('click', () => {
			const input = document.createElement('input');
			input.type = 'file';
			input.accept = '.json,application/json';
			input.onchange = async () => {
				const file = input.files?.[0];
				if (!file) return;
				try {
					const text = await file.text();
					importData(text);
					toast('Данные импортированы', 'success');
				} catch {
					toast('Ошибка импорта', 'error');
				}
			};
			input.click();
		});

		root.querySelector('#resetBtn').addEventListener('click', () => {
			if (confirm('Сбросить все привычки и статистику? Действие необратимо.')) {
				resetAll();
				toast('Данные сброшены', 'success');
			}
		});
	}

	mount();

	return { destroy() { unsub(); } };
}
