const stack = document.getElementById('toastStack');

export function toast(message, type = 'info', duration = 2800) {
	const node = document.createElement('div');
	node.className = `toast toast--${type}`;
	node.textContent = message;
	stack.appendChild(node);
	setTimeout(() => {
		node.style.opacity = '0';
		node.style.transition = 'opacity 0.2s';
		setTimeout(() => node.remove(), 200);
	}, duration);
}
