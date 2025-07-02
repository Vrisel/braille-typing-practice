function sel(query) {
	return document.querySelector(query);
}

function setText(query, text) {
	const node = sel(query);
	if (node) node.innerText = text;
}

function getRandomInt(min, max) {
	const minCeiled = Math.ceil(min);
	const maxFloored = Math.floor(max);
	return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // 최댓값은 제외, 최솟값은 포함
}

function addCharInt(char, num) {
	return String.fromCharCode(char.charCodeAt(0) + num);
}
