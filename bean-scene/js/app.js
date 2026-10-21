const subscribeForm = document.getElementById('subscribeForm')
const subscribeStatus = document.getElementById('subscribeStatus')
const navToggle = document.getElementById('navToggle')
const burger = document.querySelector('.burger')

subscribeForm?.addEventListener('submit', (event) => {
	event.preventDefault()
	const email = subscribeForm.elements.email
	if (!email.checkValidity()) {
		email.reportValidity()
		return
	}
	subscribeStatus.textContent = 'Спасибо! Подписка оформлена.'
	subscribeForm.reset()
})

navToggle?.addEventListener('change', () => {
	burger?.setAttribute('aria-expanded', String(navToggle.checked))
})

document.querySelectorAll('a[href="#"]').forEach((link) => {
	link.addEventListener('click', (event) => event.preventDefault())
})
