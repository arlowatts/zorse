import { tileDisplay } from "./tileDisplay.js";
import { Puzzle } from "./puzzle.js";

export class Creator {
    #layouts = [["CLUE", []], ["SOLUTION", []], ["REVEALED LETTERS", []], [[["Submit"]]]];

    #cssClasses = [["wrapper"], [], ["tile"]];

    #searchParamClue;
    #searchParamSolution;
    #searchParamLetters;

    #refs = [[], [], []];

    initializeDisplay(wrapper) {
        this.#layouts.forEach((layout) => { tileDisplay(layout, this.#cssClasses, wrapper, this.#refs); });

        this.#refs[2][0].style.width = "50%";

        for (let i = 0; i < 3; i++)
            this.#refs[1][i].insertAdjacentHTML("beforeend", "<input type=\"text\">");
    }

    initializeEventListeners() {
        this.#refs[2][0].addEventListener("click", () => { this.submit(); });
    }

    setSearchParams(searchParamClue, searchParamSolution, searchParamLetters) {
        this.#searchParamClue = searchParamClue;
        this.#searchParamSolution = searchParamSolution;
        this.#searchParamLetters = searchParamLetters;
    }

    submit() {
        const clue     = this.#refs[1][0].children[0].value;
        const solution = this.#refs[1][1].children[0].value;
        const letters  = this.#refs[1][2].children[0].value;

        const puzzle = new Puzzle(clue, solution, letters);
        const encodedPuzzle = Puzzle.encode(puzzle);

        const searchParams = new URLSearchParams(window.location.search);

        searchParams.set(this.#searchParamClue, encodedPuzzle[0]);
        searchParams.set(this.#searchParamSolution, encodedPuzzle[1]);
        searchParams.set(this.#searchParamLetters, encodedPuzzle[2]);
    }
}
