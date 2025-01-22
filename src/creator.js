import { tileDisplay } from "./tileDisplay.js";
import { Puzzle } from "./puzzle.js";

export class Creator {
    #layout = ["CLUE", [], "SOLUTION", [], "REVEALED LETTERS", [], [["Play!"]]];

    #cssClasses = [[], [], ["tile", "button"]];

    #refs = [[], [], []];

    #paramNames;

    constructor(paramNames) {
        this.#paramNames = paramNames;
    }

    initializeDisplay(wrapper) {
        tileDisplay(this.#layout, this.#cssClasses, wrapper, this.#refs);

        for (let i = 0; i < this.#paramNames.length; i++)
            this.#refs[1][i].insertAdjacentHTML("beforeend", "<input type=\"text\">");
    }

    initializeEventListeners() {
        this.#refs[2][0].addEventListener("click", () => { this.submit(); });
        addEventListener("keydown", (e) => { if (e.key === "Enter") this.submit(); });
    }

    submit() {
        const values = this.#refs[1].slice(0, 3).map((x) => x.children[0].value);

        const puzzle = new Puzzle(values[0], values[1], values[2]);
        const encodedPuzzle = Puzzle.encode(puzzle);

        const searchParams = new URLSearchParams();

        for (let i = 0; i < this.#paramNames.length; i++)
            searchParams.set(this.#paramNames[i], encodedPuzzle[i]);

        window.location.search = searchParams;
    }
}
