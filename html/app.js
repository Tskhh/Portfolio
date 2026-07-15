document.getElementById('subscribeBtn')?.addEventListener('click', () => {
	const emailField = document.getElementById('emailField')
	const status = document.getElementById('emailStatus')
	const email = emailField?.value.trim() || ''

	if (!status) return

	status.className = 'email-status'

	if (!email) {
		status.textContent = 'Введите email.'
		status.classList.add('email-status--error')
		return
	}

	if (!email.includes('@')) {
		status.textContent = 'Email должен содержать символ @.'
		status.classList.add('email-status--error')
		return
	}

	if (!email.includes('.')) {
		status.textContent = 'Email должен содержать домен (например, .ru).'
		status.classList.add('email-status--error')
		return
	}

	status.textContent = 'Спасибо! Email принят.'
	status.classList.add('email-status--success')
})
