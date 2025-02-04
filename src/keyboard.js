import { tileDisplay } from "./tileDisplay.js";

export class Keyboard {
    #layout = [
        [["Q"], ["W"], ["E"], ["R"], ["T"], ["Y"], ["U"], ["I"], ["O"], ["P"]],
        [["A"], ["S"], ["D"], ["F"], ["G"], ["H"], ["J"], ["K"], ["L"]],
        [[], ["Z"], ["X"], ["C"], ["V"], ["B"], ["N"], ["M"], ["\u232b"]],
        [["Submit"]],
    ];

    #layoutFlat = [
        "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P",
        "A", "S", "D", "F", "G", "H", "J", "K", "L",
        "", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE",
        "ENTER",
    ];

    #cssClasses = [[], [], ["border", "box", "key"]];

    #targets = [];

    #refs = [[], [], []];

    initializeDisplay(wrapper) {
        tileDisplay(this.#layout, this.#cssClasses, wrapper, this.#refs);

        this.#refs[2][19].style.width = "15%";
        this.#refs[2][19].style.visibility = "hidden";
        this.#refs[2][27].style.width = "15%";
        this.#refs[2][28].style.width = "100%";
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
        addEventListener("keydown", (e) => { if (!e.ctrlKey) this.keyDown(e.key.toUpperCase()); });

        for (let i = 0; i < this.#layoutFlat.length; i++) {
            this.#refs[2][i].addEventListener("pointerdown", (e) => {
                e.target.style["background-color"] = "lightgray";
                this.keyDown(this.#layoutFlat[i]);
            });

            this.#refs[2][i].addEventListener("pointerup", (e) => {
                e.target.style["background-color"] = "transparent";
            });
        }
    }

    addTarget(target) {
        this.#targets.push(target);
    }

    keyDown(key) {
        if (this.#layoutFlat.includes(key)) {
            const index = this.#layoutFlat.indexOf(key);

            for (let i = 0; i < this.#targets.length; i++) {
                if (index === 28) {
                    this.#targets[i].submit();
                    document.activeElement.blur();
                }
                else if (index === 27)
                    this.#targets[i].removeLetter();
                else
                    this.#targets[i].addLetter(key);
            }
        }
    }
}
