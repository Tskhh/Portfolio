(function () {
	const isLite =
		window.matchMedia('(max-width: 1024px)').matches ||
		window.matchMedia('(hover: none) and (pointer: coarse)').matches

	if (!isLite) return

	document.documentElement.classList.add('lite-mode')

	const blockFonts = () => {
		document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
			const href = link.getAttribute('href') || ''
			if (href.includes('fonts.googleapis.com') || href.includes('fonts.gstatic.com')) {
				link.remove()
			}
		})
	}

	blockFonts()
	document.addEventListener('DOMContentLoaded', blockFonts, { once: true })

	const toLiteUrl = (url) => {
		if (!url || url.startsWith('data:') || url.includes('lite_')) return url
		const clean = url.replace(/^url\(["']?|["']?\)$/g, '')
		const file = clean.split('/').pop()
		if (!file) return url
		const liteName = `lite_${file.replace(/\.(png|jpe?g|webp)$/i, '.jpg')}`
		return clean.replace(file, liteName)
	}

	const applyLiteBackground = (el) => {
		const inline = el.getAttribute('style') || ''
		const match = inline.match(/background-image:\s*url\(([^)]+)\)/i)
		if (!match) return

		const lite = toLiteUrl(match[1])
		if (lite === match[1]) return
		el.style.backgroundImage = `url(${lite})`
	}

	document.addEventListener('DOMContentLoaded', () => {
		document.querySelectorAll('video').forEach((video) => {
			video.pause()
			video.removeAttribute('src')
			video.removeAttribute('autoplay')
			video.load()
			video.style.display = 'none'
		})

		document.querySelectorAll('audio').forEach((audio) => {
			audio.pause()
			audio.removeAttribute('src')
			audio.removeAttribute('autoplay')
		})

		document.querySelectorAll('img[src]').forEach((img) => {
			const src = img.getAttribute('src')
			if (!src || src.includes('lite_') || src.endsWith('.svg')) return
			const lite = toLiteUrl(src)
			if (lite !== src) img.src = lite
		})

		document.querySelectorAll('[style*="background-image"]').forEach(applyLiteBackground)
	})
})()
