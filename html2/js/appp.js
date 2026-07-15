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
			frame.setAttribute('style', `transform: translateZ(${zVals[i]}px); opacity: ${zVals[i] < Math.abs(zSpacing) / 1.8 ? 1 : 0}`)
		})
	}, { passive: true })

	window.scrollTo(0, 1)
} else {
	document.documentElement.classList.add('lite-mode')
	document.querySelectorAll('.frame').forEach((frame) => {
		frame.style.opacity = '1'
		frame.style.transform = 'none'
	})
}

const soundButton = document.querySelector('.soundbutton')
if (soundButton) soundButton.style.display = 'none'
