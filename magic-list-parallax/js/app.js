const isMobile = window.matchMedia('(max-width: 1024px)').matches ||
	window.matchMedia('(hover: none) and (pointer: coarse)').matches

if (!isMobile) {
	document.addEventListener('mousemove', (e) => {
		document.body.style.cssText = `--move-x: ${e.clientX}px; --move-y: ${e.clientY}px;`
	}, { passive: true })
} else {
	document.documentElement.classList.add('is-mobile-list', 'lite-mode')

	document.querySelectorAll('.magic-list_item').forEach((item) => {
		item.addEventListener('click', () => {
			document.querySelectorAll('.magic-list_item').forEach((el) => el.classList.remove('is-active'))
			item.classList.add('is-active')
		})
	})
}
