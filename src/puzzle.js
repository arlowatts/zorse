import { tileDisplay } from "./tileDisplay.js";

export class Puzzle {
    static regexSpace = / +/;
    static regexTile = /^[A-Z]$/;

    #cssClasses = [["wrapper"], ["word"], ["tile", "letter"]];

    #refs = [[], [], []];

    // elements of the puzzle
    #clue;
    #solution;
    #letters;

    // the processed solution
    #solutionNested;
    #solutionFlat;
    #revealedLetters = [];

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
    }

    // encode the puzzle as three url-safe base64 strings
    static encode(puzzle) {
        const encoder = new TextEncoder();

        // encode the parts of the puzzle as arrays of bytes
        const clueBytes     = encoder.encode(puzzle.#clue);
        const solutionBytes = encoder.encode(puzzle.#solution);
        const lettersBytes  = encoder.encode(puzzle.#letters);

        // encode the arrays of bytes as url-safe base64 strings
        return [
            clueBytes.toBase64({ alphabet: "base64url" }),
            solutionBytes.toBase64({ alphabet: "base64url" }),
            lettersBytes.toBase64({ alphabet: "base64url" }),
        ];
    }

    // decode a puzzle from three url-safe base64 strings
    static decode(encodedPuzzle) {
        const decoder = new TextDecoder();

        // decode the url-safe base64 strings as arrays of bytes
        const clueBytes     = Uint8Array.fromBase64(encodedPuzzle[0], { alphabet: "base64url" });
        const solutionBytes = Uint8Array.fromBase64(encodedPuzzle[1], { alphabet: "base64url" });
        const lettersBytes  = Uint8Array.fromBase64(encodedPuzzle[2], { alphabet: "base64url" });

        // decode the arrays of bytes as parts of the puzzle
        const clue     = decoder.decode(clueBytes);
        const solution = decoder.decode(solutionBytes);
        const letters  = decoder.decode(lettersBytes);

        return new Puzzle(clue, solution, letters);
    }
}
