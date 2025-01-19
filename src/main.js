import { Puzzle } from "./puzzle.js";
import { Keyboard } from "./keyboard.js";

// default puzzle if the puzzle in the URL cannot be decoded
const DEFAULT_PUZZLE = new Puzzle("the warmest days of winter, spent by the sea", "beach dog days", "eo");

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

    const puzzle = Uint8Array.fromBase64 ? Puzzle.decode(encodedPuzzle) : DEFAULT_PUZZLE;

    const keyboard = new Keyboard();

    puzzle.initializeDisplay(document.body);
    puzzle.initializeEventListeners();

    keyboard.initializeDisplay(document.body);
    keyboard.initializeEventListeners();

    keyboard.addTarget(puzzle);
}
