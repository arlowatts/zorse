import { tileDisplay } from "./tileDisplay.js";
import { Puzzle } from "./puzzle.js";

export class Creator {
    #layout = ["CLUE", [], "SOLUTION", [], "REVEALED LETTERS", [], [["Play!"]]];

    #cssClasses = [[], [], ["tile"]];

    #refs = [[], [], []];

    #paramNames;

    constructor(paramNames) {
        this.#paramNames = paramNames;
    }

    initializeDisplay(wrapper) {
        tileDisplay(this.#layout, this.#cssClasses, wrapper, this.#refs);

        this.#refs[2][0].style.width = "50%";
        this.#refs[2][0].style.margin = "1em 0em 0em 0em";

        for (let i = 0; i < this.#paramNames.length; i++)
            this.#refs[1][i].insertAdjacentHTML("beforeend", "<input type=\"text\">");
    }

    initializeEventListeners() {
        this.#refs[2][0].addEventListener("click", () => { this.submit(); });
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
