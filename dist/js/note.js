class Note {
	#noteType = 'quarter';
	get noteType() {
		return this.#noteType;
	}
	set noteType(value) {
		if (!Object.keys(this.constructor.TYPE_DICT).includes(value)) throw new RangeError('유효하지 않은 음표 종류');
		this.#noteType = value;
	}
	duration(division) {
		return 4 * division / this.constructor.TYPE_DICT[this.noteType];
	}
	
	#step = 'C';
	get step() {
		return this.#step;
	}
	set step(value) {
		if (!'ABCDEFG'.includes(value)) throw new RangeError('유효하지 않은 음이름');
		this.#step = value;
	}
	
	#alter = null;
	get alter() {
		return this.#alter;
	}
	set alter(value) {
		if ((value != null) && ((value < -2) || (value > 2))) throw new RangeError('유효하지 않은 임시표값')
		this.#alter = value;
	}
	
	octave = 4;
	get properClef() {
		return addCharInt('G', -(
			(((this.octave == 4) 
			 && 'CDE'.includes(this.step)) 
			|| ((this.octave == 3) 
			 && 'AB'.includes(this.step)))
			? getRandomInt(0, 1+1)
			: (this.octave < 4)
			? 1
			: 0
		));
	}
	get properClefOctave() {
		return this.octave <= 1 ? -1 : Math.max(this.octave - 6, 0);
	}
	
	static toLiteral(note) { return (
		note.noteType + ' '
		+ note.step
		+ ['𝄫', '♭', '', '♯', '𝄪'][note.alter + 2]
		+ note.octave.toString()
	); }
	
	get inLiteral() {
		return this.constructor.toLiteral(this);
	}
	
	get inBraille() {
		return this.constructor.toBraille(this);
	}
	
	static get TYPE_DICT() { return ({
		'whole': 1,
		'half': 2,
		'quarter': 4,
		'eighth': 8,
		'16th': 16,
		'32th': 32,
		'64th': 64,
		'128th': 128
	}); }
	
	static get ALTER_DICT() { return ({
		'x': 2,
		'##': 2,
		'#': 1,
		'b': -1,
		'bb': -2,
		
		'𝄪': 2,
		'♯': 1,
		'♮': 0,
		'♭': -1,
		'𝄫': -2,

		'': '',

		'+2': 2,
		'2': 2,
		'+1': 1,
		'1': 1,
		'0': 0,
		'-1': -1,
		'-2': -2
	}); }
	
	static fromLiteral(lit) {
		const ex = lit.exec(/(?<noteType>maxima|long|breve|whole|half|quarter|(?:eigh|16|32|64|128|256|512|1024)th)? ?(?<step>[A-G])(?<alter>##?|bb?|[♯♭♮𝄪𝄫])?(?<octave>[0-8])/);
		if (!ex) throw new RangeError('유효하지 않은 음표 표현');
		const {noteType, step, alter, octave} = ex.groups;
		return this.fromArgs(noteType, step, alter, octave);
	}
	
	static fromArgs(noteType, step, alter, octave) {
		let note = new this();
		note.noteType = noteType;
		note.step = step;
		note.alter = this.ALTER_DICT[alter ?? ''];
		note.octave = octave;
		return note;
	}
	
	static getRandom(noteType = true, step = true, alter = true, octave = true) {
		let result;
		try {
			result = this.fromArgs(
				noteType ? Object.keys(this.TYPE_DICT)[getRandomInt(0, 8)] : 'eighth',
				step ? addCharInt('A', getRandomInt(0, 6+1)) : 'A',
				alter ? getRandomInt(-2, 2+1) : null,
				octave ? getRandomInt(1, 7+1) : 4
			);
			result.inLiteral;
			result.inBraille;
		} catch {
			result = this.getRandom();
		}
		return result;
	}

	static getRandomFifths() {
		return getRandomInt(-7, 7+1);
	}
	
	static inBraille_octave(note) {
		return '⠈⠘⠸⠐⠨⠰⠠'[note.octave - 1];
	}
	
	static inBraille_alter(note) {
		return ['⠣⠣', '⠣', '', '⠩', '⠩⠩'][note.alter + 2];
	}
	
	static inBraille_stepAndType(note) { return (
		String.fromCharCode(
			0x2800 // Braille blank
			+ [0b001010, 0b011010, 0b011001, 0b010001, 0b001011, 0b011011, 0b010011][note.step.charCodeAt(0) - 65] // ijdefgh
			+ ({
				'whole': 0b100100,
				'half': 0b000100,
				'quarter': 0b100000,
				'eighth': 0,
				'16th': 0b100100,
				'32th': 0b000100,
				'64th': 0b100000,
				'128th': 0
			})[note.noteType]
		)
	); }
	
	static toBraille(note) { return (
		this.inBraille_octave(note)
		+ this.inBraille_alter(note)
		+ this.inBraille_stepAndType(note)
	); }
	
	get fullString() {
		return `${this.inBraille} (${this.inLiteral})`;
	}
}
