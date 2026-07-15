const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const root = __dirname.replace(/\\scripts$/, '')
const svg = path.join(root, 'favicon.svg')

async function run() {
	const sizes = [
		{ file: 'favicon-16x16.png', size: 16 },
		{ file: 'favicon-32x32.png', size: 32 },
		{ file: 'apple-touch-icon.png', size: 180 },
		{ file: 'favicon-192.png', size: 192 },
	]

	for (const { file, size } of sizes) {
		await sharp(svg)
			.resize(size, size)
			.png()
			.toFile(path.join(root, file))
		console.log('created', file)
	}

	await sharp(svg)
		.resize(32, 32)
		.png()
		.toFile(path.join(root, 'favicon.ico'))

	console.log('created favicon.ico')
}

run().catch((err) => {
	console.error(err)
	process.exit(1)
})
