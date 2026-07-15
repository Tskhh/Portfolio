if (window.matchMedia('(max-width: 768px)').matches) {
	document.documentElement.classList.add('lite-mode')
}

document.addEventListener('DOMContentLoaded', () => {
	if (!document.documentElement.classList.contains('lite-mode')) return

	document.querySelectorAll('video').forEach((video) => {
		video.pause()
		video.removeAttribute('src')
		video.load()
		video.style.display = 'none'
	})

	document.querySelectorAll('audio').forEach((audio) => {
		audio.pause()
		audio.removeAttribute('src')
	})
})
