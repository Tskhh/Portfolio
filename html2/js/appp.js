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
})

window.scrollTo(0, 1)

const soundButton = document.querySelector('.soundbutton')
const audio = document.querySelector('.audio')

if (soundButton && audio) {
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
