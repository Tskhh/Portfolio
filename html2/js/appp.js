const isMobile = window.matchMedia('(max-width: 768px)').matches

if (!isMobile) {
	let zSpacing = -1000
	let lastPos = zSpacing / 5
	const frames = Array.from(document.getElementsByClassName('frame'))
	const zVals = frames.map((_, i) => (i * zSpacing) + zSpacing)

	window.addEventListener('scroll', () => {
		const top = document.documentElement.scrollTop
		const delta = lastPos - top
		lastPos = top

		frames.forEach((frame, i) => {
			zVals[i] += delta * -5.5
			const transform = `translateZ(${zVals[i]}px)`
			const opacity = zVals[i] < Math.abs(zSpacing) / 1.8 ? 1 : 0
			frame.setAttribute('style', `transform: ${transform}; opacity: ${opacity}`)
		})
	}, { passive: true })

	window.scrollTo(0, 1)
} else {
	document.documentElement.classList.add('is-mobile-gallery')
	document.querySelectorAll('.frame').forEach((frame) => {
		frame.style.opacity = '1'
		frame.style.transform = 'none'
	})
	document.querySelectorAll('video').forEach((video) => {
		video.removeAttribute('autoplay')
		video.pause()
	})
}

const soundButton = document.querySelector('.soundbutton')
const audio = document.querySelector('.audio')

if (soundButton && audio && !isMobile) {
	soundButton.addEventListener('click', () => {
		soundButton.classList.toggle('paused')
		audio.paused ? audio.play() : audio.pause()
	})

	window.addEventListener('focus', () => {
		if (!soundButton.classList.contains('paused')) {
			audio.play()
		}
	})

	window.addEventListener('blur', () => {
		audio.pause()
	})
}

if (isMobile && soundButton) {
	soundButton.style.display = 'none'
}
