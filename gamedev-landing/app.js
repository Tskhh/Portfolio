document.getElementById('subscribeForm')?.addEventListener('submit', (event) => {
	event.preventDefault()
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

	if (!emailField.checkValidity()) {
		status.textContent = 'Введите корректный email.'
		status.classList.add('email-status--error')
		return
	}

	status.textContent = 'Спасибо! Email принят.'
	status.classList.add('email-status--success')
	event.currentTarget.reset()
})
