const searchForm = document.querySelector('.search-form')
const searchStatus = document.getElementById('searchStatus')
const searchTabs = document.querySelectorAll('.search-tabs .tab')
const propertyTypeInput = document.getElementById('property-type')
const filterInputs = document.querySelectorAll('.controls input[type="radio"]')
const propertyCards = document.querySelectorAll('.objects .card')
const navToggle = document.getElementById('navToggle')
const burger = document.querySelector('.burger')

searchTabs.forEach((tab) => {
	tab.addEventListener('click', () => {
		searchTabs.forEach((item) => item.classList.toggle('active', item === tab))
		propertyTypeInput.value = tab.textContent.trim()
	})
})

searchForm?.addEventListener('submit', (event) => {
	event.preventDefault()
	const location = document.getElementById('location').value.trim()
	searchStatus.textContent = location
		? `Показаны демонстрационные предложения для: ${location}.`
		: 'Введите локацию для поиска.'
})

filterInputs.forEach((input, index) => {
	input.addEventListener('change', () => {
		if (!input.checked) return
		const type = ['rent', 'buy', 'sell'][index]
		propertyCards.forEach((card) => {
			card.hidden = card.dataset.type !== type
		})
	})
})

navToggle?.addEventListener('change', () => {
	burger?.setAttribute('aria-expanded', String(navToggle.checked))
})

document.querySelectorAll('a[href="#"]').forEach((link) => {
	link.addEventListener('click', (event) => event.preventDefault())
})
