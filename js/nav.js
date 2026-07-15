document.addEventListener('DOMContentLoaded', () => {
	const burger = document.querySelector('.burger')
	const nav = document.querySelector('#main-nav')

	if (!burger || !nav) return

	const closeMenu = () => {
		nav.classList.remove('nav--open')
		burger.classList.remove('burger--active')
		burger.setAttribute('aria-expanded', 'false')
		burger.setAttribute('aria-label', 'Открыть меню')
	}

	burger.addEventListener('click', (event) => {
		event.stopPropagation()
		const isOpen = nav.classList.toggle('nav--open')
		burger.classList.toggle('burger--active', isOpen)
		burger.setAttribute('aria-expanded', String(isOpen))
		burger.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню')
	})

	nav.querySelectorAll('a').forEach((link) => {
		link.addEventListener('click', closeMenu)
	})

	document.addEventListener('click', (event) => {
		if (!nav.classList.contains('nav--open')) return
		if (nav.contains(event.target) || burger.contains(event.target)) return
		closeMenu()
	})

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') closeMenu()
	})
})
