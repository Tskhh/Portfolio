const isMobile = window.matchMedia('(max-width: 768px)').matches

if (!isMobile) {
	document.addEventListener('mousemove', (e) => {
		document.body.style.cssText = `--move-x: ${e.clientX}px; --move-y: ${e.clientY}px;`
	}, { passive: true })
} else {
	document.documentElement.classList.add('is-mobile-list')

	document.querySelectorAll('.magic-list_item').forEach((item) => {
		item.addEventListener('click', () => {
			document.querySelectorAll('.magic-list_item').forEach((el) => el.classList.remove('is-active'))
			item.classList.add('is-active')
		})
	})
}
