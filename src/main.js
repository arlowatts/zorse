import { Puzzle } from "./puzzle.js";
import { Keyboard } from "./keyboard.js";
import { Creator } from "./creator.js";

// search parameters used in the URL for parts of the puzzle
const SEARCH_PARAM_CLUE     = "clue";
const SEARCH_PARAM_SOLUTION = "solution";
const SEARCH_PARAM_LETTERS  = "letters";

addEventListener("load", main);

function main() {
    // load the search parameters
    const searchParams = new URLSearchParams(window.location.search);

    const encodedPuzzle = [
        searchParams.get(SEARCH_PARAM_CLUE),
        searchParams.get(SEARCH_PARAM_SOLUTION),
        searchParams.get(SEARCH_PARAM_LETTERS),
    ];

    if (encodedPuzzle[0] && encodedPuzzle[1] && encodedPuzzle[2]) {
        const puzzle = Puzzle.decode(encodedPuzzle);
        const keyboard = new Keyboard();

        puzzle.initializeDisplay(document.body);
        puzzle.initializeEventListeners();

        keyboard.initializeDisplay(document.body);
        keyboard.initializeEventListeners();

        keyboard.addTarget(puzzle);
    }
    else {
        const creator = new Creator();

        creator.setSearchParams(SEARCH_PARAM_CLUE, SEARCH_PARAM_SOLUTION, SEARCH_PARAM_LETTERS);

        creator.initializeDisplay(document.body);
        creator.initializeEventListeners();
    }
}
