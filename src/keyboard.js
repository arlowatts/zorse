import { tileDisplay } from "./tileDisplay.js";

export class Keyboard {
    #layout = [
        [["Q"], ["W"], ["E"], ["R"], ["T"], ["Y"], ["U"], ["I"], ["O"], ["P"]],
        [["A"], ["S"], ["D"], ["F"], ["G"], ["H"], ["J"], ["K"], ["L"]],
        [["\u21B5"], ["Z"], ["X"], ["C"], ["V"], ["B"], ["N"], ["M"], ["\u232B"]],
    ];

    #layoutFlat = [
        "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P",
        "A", "S", "D", "F", "G", "H", "J", "K", "L",
        "ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE",
    ];

    #cssClasses = [[], [], ["tile", "key"]];

    #targets = [];

    #refs = [[], [], []];

    initializeDisplay(wrapper) {
        tileDisplay(this.#layout, this.#cssClasses, wrapper, this.#refs);

        this.#refs[2][19].style.width = "15%";
        this.#refs[2][27].style.width = "15%";
    }

    clearDisplay() {
        this.#refs[0][0].remove();

        for (let i = 0; i < this.#refs.length; i++)
            this.#refs[i] = [];
    }

    lockKey(key) {
        if (this.#layoutFlat.includes(key)) {
            const index = this.#layoutFlat.indexOf(key);

            this.#refs[2][index].classList.add("locked");
        }
    }

    unlockKey(key) {
        if (this.#layoutFlat.includes(key)) {
            const index = this.#layoutFlat.indexOf(key);

            this.#refs[2][index].classList.remove("locked");
        }
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
                if (index === 19)
                    this.#targets[i].submit();
                else if (index === 27)
                    this.#targets[i].removeLetter();
                else
                    this.#targets[i].addLetter(key);
            }
        }
    }
}
