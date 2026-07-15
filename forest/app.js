window.addEventListener('scroll', () => {
	document.body.style.setProperty('--scrolltop', `${window.scrollY}px`)
})
gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
ScrollSmoother.create({
    wrapper:'.wrapper', 
    content:'.content'
})