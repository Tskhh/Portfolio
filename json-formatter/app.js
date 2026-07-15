const input = document.getElementById('jsonInput')
const output = document.getElementById('jsonOutput')
const status = document.getElementById('status')

function setStatus(message, type = '') {
	status.textContent = message
	status.className = `status${type ? ` status--${type}` : ''}`
}

function parseJson(text) {
	return JSON.parse(text.trim())
}

function formatJson(compact = false) {
	try {
		const parsed = parseJson(input.value)
		output.value = JSON.stringify(parsed, null, compact ? 0 : 2)
		setStatus(compact ? 'JSON минифицирован.' : 'JSON отформатирован.', 'ok')
	} catch (err) {
		output.value = ''
		setStatus(`Ошибка: ${err.message}`, 'error')
	}
}

document.getElementById('formatBtn')?.addEventListener('click', () => formatJson(false))
document.getElementById('minifyBtn')?.addEventListener('click', () => formatJson(true))

document.getElementById('copyBtn')?.addEventListener('click', async () => {
	if (!output.value) {
		setStatus('Нечего копировать.', 'error')
		return
	}

	try {
		await navigator.clipboard.writeText(output.value)
		setStatus('Скопировано в буфер обмена.', 'ok')
	} catch {
		setStatus('Не удалось скопировать.', 'error')
	}
})

document.getElementById('clearBtn')?.addEventListener('click', () => {
	input.value = ''
	output.value = ''
	setStatus('')
})

input.addEventListener('keydown', (event) => {
	if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
		event.preventDefault()
		formatJson(false)
	}
})
