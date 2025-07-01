function setTexts(
	note, {
	step = '#step',
	octave = '#octave',
	clef = '#clef',
	clefOctave = '#clef-octave',
	alter = '#alter',
	noteType = '#note-type',
	duration = '#duration'
} = {}) {
	//const FIFTHS = Note.getRandomFifths();
	//sel('#fifths').innerText = FIFTHS;

	setText(step, note.step);

	setText(octave, note.octave);

	setText(clef, note.properClef);
	setText(clefOctave, Math.min(note.properClefOctave, 1));

	setText(alter, note.alter);

	setText(noteType, note.noteType);
	setText(duration, note.duration(sel('divisions').innerText));
	// sel('#work-title').innerText = note.inLiteral;
}

function getBrailleCells(el, ignoreBlank = true) {
	let results = [];
	el.querySelectorAll('td')
	.forEach((cell) => {
		let val = 0;
		const points = cell.querySelectorAll('input[type="checkbox"]');
		for (let i = 0; i < 6; i++) {
			val += (points[i]?.checked ?? 0) * (2 ** ((i + 5*(i%2)) / 2));
		}
		if ((val > 0) || !ignoreBlank) results.push(val + 0x2800);
	});
	return results.map((v) => String.fromCharCode(v)).join('');
}


function button_onClick(
	self,
	userInputQuery = '.braille-cells',
	userAnswerQuery = '#user-answer',
	rightAnswerQuery = '#right-answer'
) { try {
	// const button = sel('#button');
	if (!self.classList.contains('restart')) {
		const userAnswer = getBrailleCells(sel(userInputQuery));
		const userAnswerNode = sel(userAnswerQuery);
		userAnswerNode.innerText = userAnswer + ' ≠ ';
		userAnswerNode.hidden = userAnswer == sel(rightAnswerQuery).innerText;
		userAnswerNode.parentNode.hidden = false;
		
		
		self.innerText = '재도전!';
		button.classList.toggle('restart');
	} else {
		location.reload();
	}
} catch (e) { alert(e); } }
