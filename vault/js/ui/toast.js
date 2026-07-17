const stack = document.getElementById('toastStack');
export function toast(message, type = 'info', duration = 2800) {
	const node = document.createElement('div');
	node.className = `toast toast--${type}`;
	node.textContent = message;
	stack.appendChild(node);
	setTimeout(() => node.remove(), duration);
}
