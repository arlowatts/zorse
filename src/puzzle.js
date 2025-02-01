import { tileDisplay } from "./tileDisplay.js";

export class Puzzle {
    static paramNames = ["c", "s", "l"];

    static regexSpace = / +/;
    static regexTile = /^[A-Z]$/;

    #cssClassesClue       = [["text"]];
    #cssClassesSolution   = [[], ["word"], ["border", "box", "tile"]];
    #cssClassesIndicators = [[], ["border", "indicator"]];

    #refs = [[], [], []];
    #refsIndicators = [[], []];

    #emoji = [0x1F984, 0x1F3A0, 0x1F3C7, 0x1F40E, 0x1F993, 0x1F434];
    #letterEmoji = 0x2709;
    #shrugEmoji = 0x1F937;

    // elements of the puzzle
    #lines = [];

    // the processed solution
    #solutionNested;
    #solutionFlat;
    #indicators;
    #revealedLetters = [];
    #reveals = 0;
    #maxReveals = 5;

    #targets = [];
    #submitted = false;

    constructor(clue, solution, letters) {
        if (!(typeof clue === "string")) {
            this.#lines = clue;
        }
        else {
            this.#lines[0] = {value: clue.toUpperCase()};
            this.#lines[1] = {value: solution.toUpperCase()};
            this.#lines[2] = {value: letters.toUpperCase()};
        }

        this.#solutionNested =
            this.#lines[1].value
            .split(Puzzle.regexSpace)
            .map((x) => Array.from(x).map((y) => y.match(Puzzle.regexTile) ? [] : y));

        this.#solutionFlat = Array.from(this.#lines[1].value).filter((x) => x.match(Puzzle.regexTile));

        this.#indicators = [];

        for (let i = 0; i < this.#maxReveals; i++)
            this.#indicators.push([]);
    }

    initializeDisplay(wrapper) {
        tileDisplay([this.#lines[0].value], this.#cssClassesClue, wrapper);
        tileDisplay(this.#solutionNested, this.#cssClassesSolution, wrapper, this.#refs);
        tileDisplay(this.#indicators, this.#cssClassesIndicators, wrapper, this.#refsIndicators);
    }

    initializeEventListeners() {
        for (let i = 0; i < this.#solutionFlat.length; i++) {
            this.#refs[2][i].addEventListener("click", () => { this.revealLetter(this.#solutionFlat[i]); });
        }

        for (let i = 0; i < this.#lines[2].value.length; i++) {
            this.revealLetter(this.#lines[2].value[i], false);
        }
    }

    revealLetter(letter, updateCounter = true) {
        if (letter.match(Puzzle.regexTile) && !this.#revealedLetters.includes(letter) && this.#reveals < this.#maxReveals) {
            this.#revealedLetters.push(letter);

            if (updateCounter) {
                this.#refsIndicators[1][this.#reveals].classList.add("filled");
                this.#reveals++;
            }

            for (let i = 0; i < this.#targets.length; i++)
                this.#targets[i].lockKey(letter);

            for (let i = 0; i < this.#solutionFlat.length; i++) {
                if (this.#solutionFlat[i] === letter) {
                    this.#refs[2][i].classList.add("filled");
                    this.#refs[2][i].textContent = letter;
                }

                else if (this.#refs[2][i].textContent === letter)
                    this.#refs[2][i].textContent = "";
            }
        }

        if (this.isComplete())
            for (let i = 0; i < this.#targets.length; i++)
                this.#targets[i].unlockKey("ENTER");
        else
            for (let i = 0; i < this.#targets.length; i++)
                this.#targets[i].lockKey("ENTER");
    }

    addLetter(letter) {
        if (letter.match(Puzzle.regexTile) && !this.#revealedLetters.includes(letter)) {
            for (let i = 0; i < this.#solutionFlat.length; i++) {
                if (!this.#refs[2][i].textContent) {
                    this.#refs[2][i].textContent = letter;
                    break;
                }
            }
        }

        if (this.isComplete())
            for (let i = 0; i < this.#targets.length; i++)
                this.#targets[i].unlockKey("ENTER");
    }

    removeLetter() {
        for (let i = this.#solutionFlat.length - 1; i >= 0; i--) {
            if (!this.#revealedLetters.includes(this.#solutionFlat[i]) && this.#refs[2][i].textContent) {
                this.#refs[2][i].textContent = "";
                break;
            }
        }

        if (!this.isComplete())
            for (let i = 0; i < this.#targets.length; i++)
                this.#targets[i].lockKey("ENTER");
    }

    submit() {
        if (!this.#submitted && this.isComplete()) {
            this.#submitted = true;
            let correct = true;

            for (let i = 0; i < this.#solutionFlat.length; i++) {
                if (!this.#revealedLetters.includes(this.#solutionFlat[i]))
                    this.#revealedLetters.push(this.#solutionFlat[i]);

                if (this.#refs[2][i].textContent === this.#solutionFlat[i])
                    this.#refs[2][i].classList.add("filled");
                else {
                    this.#refs[2][i].classList.add("locked");
                    correct = false;
                }
            }

            for (let i = 0; i < this.#targets.length; i++)
                this.#targets[i].clearDisplay();

            this.#targets = [];

            this.displayMessage(correct);
        }
    }

    isComplete() {
        let complete = true;

        for (let i = 0; i < this.#solutionFlat.length; i++) {
            if (!this.#refs[2][i].textContent) {
                complete = false;
                break;
            }
        }

        return complete;
    }

    displayMessage(correct) {
        const score = this.getScore(correct);
        const messageRef = [[], [], []];

        tileDisplay([[this.#lines[1].value], [score], [["Share"]]], [["message"], [], ["border", "box", "button"]], this.#refs[0][0].parentElement, messageRef);

        messageRef[2][0].addEventListener("click", (e) => {
            navigator.share({ text: "\"" + this.#lines[0].value + "\"\n" + score });
        });
    }

    getScore(correct) {
        let score = String.fromCodePoint(this.#letterEmoji).repeat(this.#reveals);

        if (correct)
            score += String.fromCodePoint(this.#emoji[this.#reveals]);
        else
            score += String.fromCodePoint(this.#shrugEmoji);

        return score;
    }

    addTarget(target) {
        this.#targets.push(target);
        target.lockKey("ENTER");
    }

    getLines() {
        return this.#lines;
    }

    static shareURL(puzzle) {
        return "\"" + puzzle.#lines[0].value.toUpperCase() + "\"\n" + Puzzle.getURL(puzzle);
    }

    static getURL(puzzle) {
        const encodedPuzzle = Puzzle.encode(puzzle);

        const searchParams = new URLSearchParams();

        for (let i = 0; i < encodedPuzzle.length; i++)
            searchParams.set(Puzzle.paramNames[i], encodedPuzzle[i]);

        return location.origin + location.pathname + "?" + searchParams;
    }

    // encode the puzzle as three base64 strings
    static encode(puzzle) {
        const encoder = new TextEncoder();

        // encode the parts of the puzzle as arrays of bytes
        const clueBytes     = encoder.encode(puzzle.#lines[0].value.toUpperCase());
        const solutionBytes = encoder.encode(puzzle.#lines[1].value.toUpperCase());
        const lettersBytes  = encoder.encode(puzzle.#lines[2].value.toUpperCase());

        // encode the arrays of bytes as base64 strings
        return [
            btoa(String.fromCharCode.apply(null, clueBytes)),
            btoa(String.fromCharCode.apply(null, solutionBytes)),
            btoa(String.fromCharCode.apply(null, lettersBytes)),
        ];
    }

    // decode a puzzle from three url-safe base64 strings
    static decode(encodedPuzzle) {
        const decoder = new TextDecoder();

        // decode the base64 strings as arrays of bytes
        const clueBytes     = new Uint8Array(Array.from(atob(encodedPuzzle[0])).map((x) => x.charCodeAt()));
        const solutionBytes = new Uint8Array(Array.from(atob(encodedPuzzle[1])).map((x) => x.charCodeAt()));
        const lettersBytes  = new Uint8Array(Array.from(atob(encodedPuzzle[2])).map((x) => x.charCodeAt()));

        // decode the arrays of bytes as parts of the puzzle
        const clue     = decoder.decode(clueBytes).toUpperCase();
        const solution = decoder.decode(solutionBytes).toUpperCase();
        const letters  = decoder.decode(lettersBytes).toUpperCase();

        return new Puzzle(clue, solution, letters);
    }
}
