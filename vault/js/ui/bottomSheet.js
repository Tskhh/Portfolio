const sheet = document.getElementById('bottomSheet');
const overlay = document.getElementById('overlay');
let returnFocus = null;

function close() {
	if (sheet.hidden) return;
	sheet.hidden = true;
	overlay.hidden = true;
	sheet.innerHTML = '';
	sheet.removeAttribute('aria-labelledby');
	document.body.style.overflow = '';
	returnFocus?.focus();
	returnFocus = null;
}

overlay.addEventListener('click', close);
document.addEventListener('keydown', (event) => {
	if (sheet.hidden) return;
	if (event.key === 'Escape') {
		close();
		return;
	}
	if (event.key !== 'Tab') return;
	const focusable = [...sheet.querySelectorAll('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])')]
		.filter((element) => !element.disabled && element.offsetParent !== null);
	if (!focusable.length) return;
	const first = focusable[0];
	const last = focusable[focusable.length - 1];
	if (event.shiftKey && document.activeElement === first) {
		event.preventDefault();
		last.focus();
	} else if (!event.shiftKey && document.activeElement === last) {
		event.preventDefault();
		first.focus();
	}
});

export function openBottomSheet({ title, content }) {
	returnFocus = document.activeElement;
	sheet.innerHTML = `
		<div class="bottom-sheet__handle"></div>
		${title ? `<h2 class="bottom-sheet__title" id="bottomSheetTitle">${title}</h2>` : ''}
		<div class="bottom-sheet__body"></div>
	`;
	const body = sheet.querySelector('.bottom-sheet__body');
	if (typeof content === 'string') body.innerHTML = content;
	else body.appendChild(content);
	sheet.hidden = false;
	if (title) sheet.setAttribute('aria-labelledby', 'bottomSheetTitle');
	overlay.hidden = false;
	document.body.style.overflow = 'hidden';
	requestAnimationFrame(() => {
		sheet.querySelector('input, select, textarea, button, [tabindex]:not([tabindex="-1"])')?.focus();
	});
	return { body, close };
}

export { close as closeBottomSheet };
