import { tileDisplay } from "./tileDisplay.js";
import { Puzzle } from "./puzzle.js";

export class Creator {
    #layout = ["CLUE", [], "SOLUTION", [], "REVEALED LETTERS", [], [["Share"]], [["Play"]]];

    #cssClasses = [[], [], ["tile", "button"]];

    #refs = [[], [], []];

    #paramNames;

    constructor(paramNames) {
        this.#paramNames = paramNames;

        if (this.#paramNames.length !== 3)
            throw new RangeError("Incorrect number of parameters");
    }

    initializeDisplay(wrapper) {
        tileDisplay(this.#layout, this.#cssClasses, wrapper, this.#refs);

        for (let i = 0; i < this.#paramNames.length; i++)
            this.#refs[1][i].insertAdjacentHTML("beforeend", "<input type=\"text\">");
    }

    initializeEventListeners() {
        this.#refs[2][0].addEventListener("click", (e) => { this.share(e); });
        this.#refs[2][1].addEventListener("click", () => { this.submit(); });
        addEventListener("keydown", (e) => { if (e.key === "Enter") this.submit(); });
    }

    share(e) {
        navigator.clipboard.writeText("\"" + this.#refs[1][0].children[0].value.toUpperCase() + "\"\n" + window.location.origin + window.location.pathname + "?" + this.getSearchParams().toString());
        e.target.textContent = "Copied!";
    }

    submit() {
        window.location.search = this.getSearchParams();
    }

    getSearchParams() {
        const values = this.#refs[1].slice(0, 3).map((x) => x.children[0].value);

        const puzzle = new Puzzle(values[0], values[1], values[2]);
        const encodedPuzzle = Puzzle.encode(puzzle);

        const searchParams = new URLSearchParams();

        for (let i = 0; i < this.#paramNames.length; i++)
            searchParams.set(this.#paramNames[i], encodedPuzzle[i]);

        return searchParams;
    }
}
