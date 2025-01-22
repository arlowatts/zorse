import { tileDisplay } from "./tileDisplay.js";

export class Puzzle {
    static paramNames = ["c", "s", "l"];

    static regexSpace = / +/;
    static regexTile = /^[A-Z]$/;

    #cssClasses = [[], ["word"], ["tile", "letter"]];

    #refs = [[], [], []];

    // elements of the puzzle
    #clue;
    #solution;
    #letters;

    // the processed solution
    #solutionNested;
    #solutionFlat;
    #revealedLetters = [];
    #revealedCount = 0;

    #targets = [];

    constructor(clue, solution, letters) {
        this.#clue     = clue.toUpperCase();
        this.#solution = solution.toUpperCase();
        this.#letters  = letters.toUpperCase();

        this.#solutionNested =
            this.#solution
            .split(Puzzle.regexSpace)
            .map((x) => Array.from(x).map((y) => y.match(Puzzle.regexTile) ? [] : y));

        this.#solutionFlat = Array.from(this.#solution).filter((x) => x.match(Puzzle.regexTile));
    }

    initializeDisplay(wrapper) {
        tileDisplay([this.#clue], this.#cssClasses, wrapper);
        tileDisplay(this.#solutionNested, this.#cssClasses, wrapper, this.#refs);
    }

    initializeEventListeners() {
        for (let i = 0; i < this.#solutionFlat.length; i++) {
            this.#refs[2][i].addEventListener("click", () => { this.revealLetter(this.#solutionFlat[i]); });
        }

        for (let i = 0; i < this.#letters.length; i++) {
            this.revealLetter(this.#letters[i]);
        }
    }

    revealLetter(letter) {
        if (letter.match(Puzzle.regexTile) && !this.#revealedLetters.includes(letter)) {
            this.#revealedLetters.push(letter);
            this.#revealedCount++;

            for (let i = 0; i < this.#solutionFlat.length; i++) {
                if (this.#solutionFlat[i] === letter) {
                    this.#refs[2][i].classList.add("correct");
                    this.#refs[2][i].textContent = letter;
                }

                else if (this.#refs[2][i].textContent === letter)
                    this.#refs[2][i].textContent = "";
            }
        }
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
    }

    removeLetter() {
        for (let i = this.#solutionFlat.length - 1; i >= 0; i--) {
            if (!this.#revealedLetters.includes(this.#solutionFlat[i]) && this.#refs[2][i].textContent) {
                this.#refs[2][i].textContent = "";
                break;
            }
        }
    }

    submit() {
        let complete = true;

        for (let i = 0; i < this.#solutionFlat.length; i++) {
            if (!this.#refs[2][i].textContent) {
                complete = false;
                break;
            }
        }

        if (complete) {
            for (let i = 0; i < this.#solutionFlat.length; i++) {
                if (!this.#revealedLetters.includes(this.#solutionFlat[i]))
                    this.#revealedLetters.push(this.#solutionFlat[i]);

                if (this.#refs[2][i].textContent === this.#solutionFlat[i])
                    this.#refs[2][i].classList.add("correct");
                else
                    this.#refs[2][i].classList.add("locked");
            }
        }

        for (let i = 0; i < this.#targets.length; i++)
            this.#targets[i].clearDisplay();
    }

    addTarget(target) {
        this.#targets.push(target);
    }

    // encode the puzzle as three base64 strings
    static encode(puzzle) {
        const encoder = new TextEncoder();

        // encode the parts of the puzzle as arrays of bytes
        const clueBytes     = encoder.encode(puzzle.#clue);
        const solutionBytes = encoder.encode(puzzle.#solution);
        const lettersBytes  = encoder.encode(puzzle.#letters);

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
        const clue     = decoder.decode(clueBytes);
        const solution = decoder.decode(solutionBytes);
        const letters  = decoder.decode(lettersBytes);

        return new Puzzle(clue, solution, letters);
    }
}
