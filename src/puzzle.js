import { tileDisplay } from "./tileDisplay.js";

// regex for space characters and tile characters in the solution
const REGEX_SPACE    = / +/;
const REGEX_TILE     = /^[A-Z]$/;
const REGEX_NOT_TILE = /[^A-Z]/g;

// CSS classes for elements in the solution
const SOLUTION_CLASSES = [["word"], ["tile", "letter", "open"]];

export class Puzzle {
    // tiles displaying the puzzle
    #refs;
    #solutionTiles;
    #revealedLetters;

    // elements of the puzzle
    #clue;
    #solution;
    #letters;

    constructor(clue, solution, letters) {
        this.#clue     = clue.toUpperCase();
        this.#solution = solution.toUpperCase();
        this.#letters  = letters.toUpperCase();

        this.#refs = [[], []];
        this.#solutionTiles = this.#solution.replaceAll(REGEX_NOT_TILE, "");
        this.#revealedLetters = "";
    }

    // create the letter tiles for the puzzle solution and populate the clue element
    initializeDisplay(clueElement, solutionElement) {
        const solution = this.#solution.split(REGEX_SPACE).map((x) => (Array.from(x).map((y) => y.match(REGEX_TILE) ? [] : y)));
        tileDisplay(solutionElement, solution, SOLUTION_CLASSES, this.#refs);
        clueElement.textContent = this.#clue;
    }

    initializeEventListeners(keyboard) {
        for (let i = 0; i < this.#refs[1].length; i++) {
            this.#refs[1][i].addEventListener("click", () => {
                this.revealLetter(this.#solutionTiles[i]);
                keyboard.blockLetter(this.#solutionTiles[i]);
            });
        }

        for (let i = 0; i < this.#letters.length; i++) {
            this.revealLetter(this.#letters[i]);
            keyboard.blockLetter(this.#letters[i]);
        }
    }

    revealLetter(letter) {
        if (letter.match(REGEX_TILE) && this.#revealedLetters.indexOf(letter) === -1) {
            this.#revealedLetters += letter;

            for (let i = 0; i < this.#refs[1].length; i++) {
                if (this.#solutionTiles[i] === letter) {
                    this.#refs[1][i].classList.remove("open");
                    this.#refs[1][i].classList.add("correct");
                    this.#refs[1][i].textContent = letter;
                }
                else if (this.#refs[1][i].textContent === letter) {
                    this.#refs[1][i].textContent = "";
                }
            }
        }
    }

    sketchLetter(letter) {
        if (letter.match(REGEX_TILE) && this.#revealedLetters.indexOf(letter) === -1) {
            for (let i = 0; i < this.#refs[1].length; i++) {
                if (this.#refs[1][i].textContent === "") {
                    this.#refs[1][i].textContent = letter;
                    break;
                }
            }
        }
    }

    deleteLetter() {
        for (let i = this.#refs[1].length - 1; i >= 0; i--) {
            if (this.#revealedLetters.indexOf(this.#solutionTiles[i]) === -1 && this.#refs[1][i].textContent !== "") {
                this.#refs[1][i].textContent = "";
                break;
            }
        }
    }

    checkSolution() {
        let correct = true;

        for (let i = 0; i < this.#refs[1].length; i++) {
            this.#refs[1][i].classList.remove("open");

            if (this.#refs[1][i].textContent === this.#solutionTiles[i]) {
                this.#refs[1][i].classList.add("correct");
            }
            else {
                this.#refs[1][i].classList.add("incorrect");
                correct = false;
            }

            this.#refs[1][i].outerHTML = this.#refs[1][i].outerHTML;
        }

        if (correct) {
            alert(`You win!\n${this.#solution}`);
        }
        else {
            alert(`Better luck next time...\n${this.#solution}`);
        }
    }

    // encode the puzzle as three url-safe base64 strings
    static encode(puzzle) {
        const encoder = new TextEncoder();

        // encode the parts of the puzzle as arrays of bytes
        const clueBytes     = encoder.encode(puzzle.clue);
        const solutionBytes = encoder.encode(puzzle.solution);
        const lettersBytes  = encoder.encode(puzzle.letters);

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
