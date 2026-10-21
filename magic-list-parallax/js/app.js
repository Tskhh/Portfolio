const isMobile = window.matchMedia('(max-width: 1024px)').matches ||
	window.matchMedia('(hover: none) and (pointer: coarse)').matches
const items = document.querySelectorAll('.magic-list_item')

items.forEach((item) => {
	item.setAttribute('role', 'button')
	item.setAttribute('aria-label', item.querySelector('.magic-list_header')?.textContent?.trim() || 'Открыть изображение')
	item.addEventListener('click', () => {
		items.forEach((element) => element.classList.remove('is-active'))
		item.classList.add('is-active')
	})
	item.addEventListener('keydown', (event) => {
		if (event.key !== 'Enter' && event.key !== ' ') return
		event.preventDefault()
		item.click()
	})
})

if (!isMobile) {
	document.addEventListener('mousemove', (e) => {
		document.body.style.cssText = `--move-x: ${e.clientX}px; --move-y: ${e.clientY}px;`
	}, { passive: true })
} else {
	document.documentElement.classList.add('is-mobile-list', 'lite-mode')
}
