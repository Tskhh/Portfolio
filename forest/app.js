const isMobile = window.matchMedia('(max-width: 768px)').matches

window.addEventListener('scroll', () => {
	document.body.style.setProperty('--scrolltop', `${window.scrollY}px`)
}, { passive: true })

if (!isMobile && typeof gsap !== 'undefined') {
	gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
	ScrollSmoother.create({
		wrapper: '.wrapper',
		content: '.content',
		smooth: 1.2
	})
}
