const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const root = path.join(__dirname, '..')

const jobs = [
	{ dir: 'forest/img_2', max: 900, quality: 62 },
	{ dir: 'html2/images', max: 800, quality: 65 },
	{ dir: 'html3/img/photos', max: 600, quality: 65 },
	{ dir: 'html4/ready-html/img', max: 700, quality: 65 },
	{ dir: 'html5/ready-html/img', max: 700, quality: 65 },
	{ dir: 'HTMLLL7/html/img', max: 700, quality: 65 },
]

async function makeLite(filePath, max, quality) {
	const ext = path.extname(filePath).toLowerCase()
	if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return

	const dir = path.dirname(filePath)
	const base = path.basename(filePath, ext)
	const out = path.join(dir, `lite_${base}.jpg`)

	const image = sharp(filePath)
	const meta = await image.metadata()
	if (!meta.width) return

	const width = meta.width > max ? max : meta.width
	await image
		.resize({ width, withoutEnlargement: true })
		.jpeg({ quality, mozjpeg: true })
		.toFile(out)

	const before = fs.statSync(filePath).size
	const after = fs.statSync(out).size
	console.log(`${path.relative(root, out)}  ${Math.round(before / 1024)}KB -> ${Math.round(after / 1024)}KB`)
}

async function run() {
	for (const { dir, max, quality } of jobs) {
		const fullDir = path.join(root, dir)
		if (!fs.existsSync(fullDir)) {
			console.warn('skip missing', dir)
			continue
		}

		for (const name of fs.readdirSync(fullDir)) {
			if (name.startsWith('lite_')) continue
			await makeLite(path.join(fullDir, name), max, quality)
		}
	}
}

run().catch((err) => {
	console.error(err)
	process.exit(1)
})
