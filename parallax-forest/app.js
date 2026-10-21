const isMobile = window.matchMedia('(max-width: 1024px)').matches ||
	window.matchMedia('(hover: none) and (pointer: coarse)').matches
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (!isMobile && !reduceMotion) {
	const updateScrollPosition = () => {
		document.body.style.setProperty('--scrolltop', `${window.scrollY}px`)
	}

	updateScrollPosition()
	window.addEventListener('scroll', updateScrollPosition, { passive: true })

	if (typeof gsap !== 'undefined') {
		gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
		ScrollSmoother.create({
			wrapper: '.wrapper',
			content: '.content',
			smooth: 1
		})
	}
} else {
	document.documentElement.classList.add('lite-mode')
}
