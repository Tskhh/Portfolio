document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('contact-form')
	const status = document.getElementById('form-status')

	if (!form || !status) return

	form.addEventListener('submit', (event) => {
		event.preventDefault()

		const name = form.name.value.trim()
		const email = form.email.value.trim()
		const message = form.message.value.trim()

		status.className = 'form-status'
		status.textContent = ''

		if (!name || !email || !message) {
			status.textContent = 'Заполните все поля.'
			status.classList.add('form-status--error')
			return
		}

		if (!email.includes('@') || !email.includes('.')) {
			status.textContent = 'Введите корректный email.'
			status.classList.add('form-status--error')
			return
		}

		const subject = encodeURIComponent(`Сообщение с портфолио от ${name}`)
		const body = encodeURIComponent(`Имя: ${name}\nEmail: ${email}\n\n${message}`)
		const mailto = `mailto:egortolstyh1358@yandex.ru?subject=${subject}&body=${body}`

		window.location.href = mailto

		status.textContent = 'Открываю почтовый клиент...'
		status.classList.add('form-status--success')
	})
})
