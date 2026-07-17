const sheet = document.getElementById('bottomSheet');
const overlay = document.getElementById('overlay');
let closeFn = null;

function close() {
	sheet.hidden = true;
	overlay.hidden = true;
	sheet.innerHTML = '';
	document.body.style.overflow = '';
	if (closeFn) closeFn();
	closeFn = null;
}

overlay.addEventListener('click', close);

export function openBottomSheet({ title, content, onClose }) {
	closeFn = onClose;
	sheet.innerHTML = `
		<div class="bottom-sheet__handle"></div>
		${title ? `<h2 class="bottom-sheet__title">${title}</h2>` : ''}
		<div class="bottom-sheet__body"></div>
	`;
	const body = sheet.querySelector('.bottom-sheet__body');
	if (typeof content === 'string') body.innerHTML = content;
	else if (content) body.appendChild(content);

	sheet.hidden = false;
	overlay.hidden = false;
	document.body.style.overflow = 'hidden';
	return { body, close };
}

export { close as closeBottomSheet };
