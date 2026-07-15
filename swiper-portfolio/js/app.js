const isMobile = window.matchMedia('(max-width: 768px)').matches

const desktopConfig = {
	freeMode: true,
	centerSlides: true,
	direction: 'vertical',
	mousewheel: true,
	slidesPerView: 1.75,
	slidesOffsetBefore: -125
}

const mobileConfig = {
	direction: 'horizontal',
	slidesPerView: 1.15,
	spaceBetween: 12,
	freeMode: true,
	mousewheel: false
}

document.querySelectorAll('.slider').forEach((slider, i) => {
	window[`slider${i + 1}`] = new Swiper(slider, isMobile ? mobileConfig : desktopConfig)
})

if (!isMobile && typeof bindSwipers === 'function') {
	bindSwipers(slider1, slider2, slider3, slider4)
}

if (isMobile) {
	document.documentElement.classList.add('is-mobile-swiper')
}
