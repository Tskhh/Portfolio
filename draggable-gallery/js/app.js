const initGallery = () => {
	setTimeout(() => {
		document.body.classList.add('loaded')

		if (window.matchMedia('(min-width: 1025px)').matches && typeof Draggable !== 'undefined') {
			Draggable.create('.gallery', {
				bounds: 'body',
				inertia: true
			})
		}
	}, 200)
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initGallery, { once: true })
} else {
	initGallery()
}
