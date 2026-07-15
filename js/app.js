const isMobile = window.matchMedia('(max-width: 768px)').matches

function initSwiper() {
	const sliderEl = document.querySelector('.swiper')
	if (!sliderEl || typeof Swiper === 'undefined') return null

	return new Swiper('.swiper', {
		speed: isMobile ? 350 : 900,
		autoHeight: isMobile,
		mousewheel: !isMobile,
		allowTouchMove: true,
		simulateTouch: true,
		pagination: {
			el: '.swiper-pagination',
			clickable: true
		},
		navigation: isMobile ? undefined : {
			prevEl: '.swiper-button-prev',
			nextEl: '.swiper-button-next'
		},
		a11y: {
			prevSlideMessage: 'Предыдущий слайд',
			nextSlideMessage: 'Следующий слайд'
		}
	})
}

function bootHero() {
	document.documentElement.classList.add(isMobile ? 'is-mobile' : 'is-desktop')

	const swiper = initSwiper()

	if (isMobile && swiper) {
		window.addEventListener('load', () => swiper.update(), { once: true })
	}
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', bootHero)
} else {
	bootHero()
}
