import { tileDisplay } from "./tileDisplay.js";
import { Puzzle } from "./puzzle.js";

export class Creator {
    #layout = [[], ["CLUE", []], ["SOLUTION", []], ["REVEALED LETTERS", []], [[["Share"]]], [[["Play"]]], []];

    #cssClasses = [["wrapper"], [], [], ["border", "box", "button"]];

    #refs = [[], [], [], []];

    #puzzle;

    constructor(puzzle) {
        this.#puzzle = puzzle;
    }

    initializeDisplay(wrapper) {
        tileDisplay(this.#layout, this.#cssClasses, wrapper, this.#refs);

        for (let i = 0; i < Puzzle.paramNames.length; i++) {
            this.#refs[2][i].insertAdjacentHTML("beforeend", "<input type=\"text\" class=\"border\">");
            this.#refs[2][i].firstElementChild.value = this.#puzzle.getLines()[i];
        }
    }

    initializeEventListeners() {
        this.#refs[3][0].addEventListener("click", (e) => { this.share(e); });
        this.#refs[3][1].addEventListener("click", () => { this.submit(); });
        addEventListener("keydown", (e) => { if (e.key === "Enter") this.submit(); });
    }

    share(e) {
        navigator.clipboard.writeText("\"" + this.#refs[2][0].children[0].value.toUpperCase() + "\"\n" + window.location.origin + window.location.pathname + "?" + this.getSearchParams().toString());
        e.target.textContent = "Copied!";
    }

    submit() {
        location = location.origin + location.pathname + "?" + this.getSearchParams();
    }

    getSearchParams() {
        const values = this.#refs[2].slice(0, 3).map((x) => x.children[0].value);

        const puzzle = new Puzzle(values[0], values[1], values[2]);
        const encodedPuzzle = Puzzle.encode(puzzle);

        const searchParams = new URLSearchParams();

        for (let i = 0; i < Puzzle.paramNames.length; i++)
            searchParams.set(Puzzle.paramNames[i], encodedPuzzle[i]);

        return searchParams;
    }
}
