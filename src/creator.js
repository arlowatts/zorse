import { createHTML } from "./tileDisplay.js";
import * as puzzle from "./puzzle.js";

export class Creator {
    #elements = { tag: "div", styles: ["wrapper"], children: [
        { tag: "div", styles: [], children: [] },
        { tag: "div", styles: [], children: ["CLUE", { tag: "input", styles: ["border"], children: [] }] },
        { tag: "div", styles: [], children: ["SOLUTION", { tag: "input", styles: ["border"], children: [] }] },
        { tag: "div", styles: [], children: ["REVEALED LETTERS", { tag: "input", styles: ["border"], children: [] }] },
        { tag: "div", styles: [], children: [{ tag: "div", styles: ["border", "box", "button"], children: ["Share"] }] },
        { tag: "div", styles: [], children: [{ tag: "div", styles: ["border", "box", "button"], children: ["Play"] }] },
        { tag: "div", styles: [], children: [] },
    ] };

    #clue = this.#elements.children[1].children[1];
    #solution = this.#elements.children[2].children[1];
    #letters = this.#elements.children[3].children[1];

    #shareButton = this.#elements.children[4].children[0];
    #playButton = this.#elements.children[5].children[0];

    constructor(wrapper) {
        createHTML(this.#elements, wrapper);

        puzzle.loadPuzzle([this.#clue.ref, this.#solution.ref, this.#letters.ref]);

        this.#shareButton.ref.addEventListener("click", () => {
            navigator.share({ text: puzzle.shareURL() });
        });

        this.#playButton.ref.addEventListener("click", () => {
            location = puzzle.getURL();
        });

        addEventListener("keydown", (e) => {
            if (e.key === "Enter")
                location = puzzle.getURL();
        });
    }
}
