import { tileDisplay } from "./tileDisplay.js";

export class Keyboard {
    #layout = [
        [["Q"], ["W"], ["E"], ["R"], ["T"], ["Y"], ["U"], ["I"], ["O"], ["P"]],
        [["A"], ["S"], ["D"], ["F"], ["G"], ["H"], ["J"], ["K"], ["L"]],
        [["Z"], ["X"], ["C"], ["V"], ["B"], ["N"], ["M"], ["\u232B"]],
        [[], ["Space"], ["\u21B5"]],
    ];

    #layoutFlat = [
        "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P",
        "A", "S", "D", "F", "G", "H", "J", "K", "L",
        "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE",
        "", " ", "ENTER",
    ];

    #cssClasses = [["wrapper"], [], ["tile", "key"]];

    #targets = [];

    #refs = [[], [], []];

    initializeDisplay(wrapper) {
        tileDisplay(this.#layout, this.#cssClasses, wrapper, this.#refs);

        this.#refs[2][26].style.width = "20%";
        this.#refs[2][27].style.visibility = "hidden";
        this.#refs[2][27].style.width = "20%";
        this.#refs[2][28].style.width = "50%";
        this.#refs[2][29].style.width = "20%";
    }

    initializeEventListeners() {
        addEventListener("keydown", (e) => { this.keyDown(e.key.toUpperCase()); });

        for (let i = 0; i < this.#layoutFlat.length; i++)
            this.#refs[2][i].addEventListener("click", () => { this.keyDown(this.#layoutFlat[i]); });
    }

    addTarget(target) {
        this.#targets.push(target);
    }

    keyDown(key) {
        if (this.#layoutFlat.includes(key)) {
            const index = this.#layoutFlat.indexOf(key);

            for (let i = 0; i < this.#targets.length; i++) {
                if (index === 26)
                    this.#targets[i].removeLetter();
                else if (index === 29)
                    this.#targets[i].submit();
                else
                    this.#targets[i].addLetter(key);
            }
        }
    }
}
