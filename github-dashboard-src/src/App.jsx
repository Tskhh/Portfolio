import { useEffect, useState } from 'react'
import './App.css'

const DEFAULT_USER = 'Tskhh'

export default function App() {
	const [username, setUsername] = useState(DEFAULT_USER)
	const [query, setQuery] = useState('')
	const [profile, setProfile] = useState(null)
	const [repos, setRepos] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	async function loadUser(name) {
		const trimmed = name.trim()
		if (!trimmed) {
			setError('Введите имя пользователя GitHub.')
			return
		}

		setLoading(true)
		setError('')
		setProfile(null)
		setRepos([])

		try {
			const [userRes, reposRes] = await Promise.all([
				fetch(`https://api.github.com/users/${encodeURIComponent(trimmed)}`),
				fetch(`https://api.github.com/users/${encodeURIComponent(trimmed)}/repos?sort=updated&per_page=6`),
			])

			if (!userRes.ok) {
				throw new Error(userRes.status === 404 ? 'Пользователь не найден.' : 'Не удалось загрузить профиль.')
			}

			const userData = await userRes.json()
			const reposData = reposRes.ok ? await reposRes.json() : []

			setProfile(userData)
			setRepos(Array.isArray(reposData) ? reposData : [])
			setQuery(trimmed)
		} catch (err) {
			setError(err.message || 'Ошибка сети. Попробуйте позже.')
		} finally {
			setLoading(false)
		}
	}

	function handleSubmit(event) {
		event.preventDefault()
		loadUser(username)
	}

	useEffect(() => {
		loadUser(DEFAULT_USER)
	}, [])

	return (
		<div className="app">
			<a className="back" href="/portfolio.html">← К портфолио</a>

			<header className="header">
				<p className="header__label">Pet project · React + GitHub API</p>
				<h1>GitHub Dashboard</h1>
				<p>Поиск разработчика, профиль, статистика и последние репозитории. Реализованы loading, error states и работа с REST API через fetch.</p>
			</header>

			<form className="search" onSubmit={handleSubmit}>
				<input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder="Имя пользователя GitHub"
					aria-label="Имя пользователя GitHub"
				/>
				<button type="submit" disabled={loading}>
					{loading ? 'Загрузка…' : 'Найти'}
				</button>
			</form>

			{loading && <p className="status status--loading">Загружаем данные с GitHub API…</p>}
			{error && <p className="status status--error" role="alert">{error}</p>}

			{profile && (
				<>
					<section className="profile">
						<img src={profile.avatar_url} alt="" width="88" height="88" />
						<div className="profile__info">
							<h2>{profile.name || profile.login}</h2>
							<p>@{profile.login}{profile.location ? ` · ${profile.location}` : ''}</p>
							{profile.bio && <p style={{ marginTop: 8 }}>{profile.bio}</p>}
						</div>
					</section>

					<div className="stats">
						<div className="stat">
							<strong>{profile.public_repos}</strong>
							<span>Репозитории</span>
						</div>
						<div className="stat">
							<strong>{profile.followers}</strong>
							<span>Подписчики</span>
						</div>
						<div className="stat">
							<strong>{profile.following}</strong>
							<span>Подписки</span>
						</div>
					</div>

					<section className="repos">
						<h3>Последние репозитории {query}</h3>
						<div className="repo-list">
							{repos.length === 0 && <p className="status">Нет публичных репозиториев.</p>}
							{repos.map((repo) => (
								<article className="repo" key={repo.id}>
									<h4>
										<a href={repo.html_url} target="_blank" rel="noopener noreferrer">
											{repo.name}
										</a>
									</h4>
									{repo.description && <p>{repo.description}</p>}
									<div className="repo-meta">
										{repo.language && <span className="lang">{repo.language}</span>}
										<span>★ {repo.stargazers_count}</span>
										<span>Forks {repo.forks_count}</span>
									</div>
								</article>
							))}
						</div>
					</section>
				</>
			)}

			<p className="footer-note">Данные: GitHub REST API · React 19 · Vite</p>
		</div>
	)
}
