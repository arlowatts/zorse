import { tileDisplay } from "./tileDisplay.js";

const KEYBOARD_LAYOUT = [
    [["Q"], ["W"], ["E"], ["R"], ["T"], ["Y"], ["U"], ["I"], ["O"], ["P"]],
    [["A"], ["S"], ["D"], ["F"], ["G"], ["H"], ["J"], ["K"], ["L"]],
    [["Z"], ["X"], ["C"], ["V"], ["B"], ["N"], ["M"], ["\u232B"]],
    [["Submit"]],
];

const KEYBOARD_LAYOUT_FLAT = [
    "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P",
    "A", "S", "D", "F", "G", "H", "J", "K", "L",
    "Z", "X", "C", "V", "B", "N", "M", "\u232B",
    "Submit",
];

const KEYBOARD_CLASSES = [[], ["tile", "key", "open"]];

export class Keyboard {
    #refs;

    constructor() {
        this.#refs = [[], []];
    }

    initializeDisplay(keyboardElement) {
        tileDisplay(keyboardElement, KEYBOARD_LAYOUT, KEYBOARD_CLASSES, this.#refs);
    }

    initializeEventListeners(puzzle) {
        for (let i = 0; i < this.#refs[1].length; i++) {
            if (i === 26) {
                this.#refs[1][i].addEventListener("click", () => {
                    puzzle.deleteLetter();
                });
            }
            else if (i === 27) {
                this.#refs[1][i].addEventListener("click", () => {
                    puzzle.checkSolution();
                });
            }
            else {
                this.#refs[1][i].addEventListener("click", () => {
                    puzzle.sketchLetter(KEYBOARD_LAYOUT_FLAT[i]);
                });
            }
        }

        addEventListener("keydown", (e) => {
            if (e.key === "Backspace") {
                puzzle.deleteLetter();
            }
            else if (e.key === "Enter") {
                puzzle.checkSolution();
            }
            else {
                puzzle.sketchLetter(e.key.toUpperCase());
            }
        });
    }

    blockLetter(letter) {
        const ref = this.#refs[1][KEYBOARD_LAYOUT_FLAT.indexOf(letter)];
        ref.classList.remove("open");
        ref.classList.add("locked");
    }
}
