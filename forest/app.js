const isMobile = window.matchMedia('(max-width: 768px)').matches

if (!isMobile) {
	window.addEventListener('scroll', () => {
		document.body.style.setProperty('--scrolltop', `${window.scrollY}px`)
	}, { passive: true })

	if (typeof gsap !== 'undefined') {
		gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
		ScrollSmoother.create({
			wrapper: '.wrapper',
			content: '.content',
			smooth: 1
		})
	}
}
