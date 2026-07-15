const isMobile = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches

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

function initDesktopVideo(swiper) {
	const video = document.querySelector('.video-background')
	if (!video || !swiper) return

	const src = video.dataset.src
	if (!src) return

	video.src = src
	video.preload = 'metadata'

	video.addEventListener('loadedmetadata', () => {
		video.currentTime = 0
	}, { once: true })

	swiper.on('slideChange', function () {
		if (!video.duration || Number.isNaN(video.duration) || typeof gsap === 'undefined') return

		const maxIndex = Math.max(this.slides.length - 1, 1)
		gsap.to(video, {
			duration: 0.9,
			currentTime: (video.duration / maxIndex) * this.realIndex,
			ease: 'power2.out'
		})
	})

	swiper.on('slideChangeTransitionStart', () => {
		video.classList.add('change')
	}).on('slideChangeTransitionEnd', () => {
		video.classList.remove('change')
	})
}

function bootHero() {
	document.documentElement.classList.add(isMobile ? 'is-mobile' : 'is-desktop')

	const swiper = initSwiper()

	if (isMobile && swiper) {
		window.addEventListener('load', () => swiper.update(), { once: true })
	}

	if (isMobile) {
		const video = document.querySelector('.video-background')
		if (video) video.remove()
		return
	}

	const gsapScript = document.createElement('script')
	gsapScript.src = 'libs/gsap/gsap.min.js'
	gsapScript.onload = () => initDesktopVideo(swiper)
	document.head.appendChild(gsapScript)
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', bootHero)
} else {
	bootHero()
}
