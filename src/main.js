import { Puzzle } from "./puzzle.js";
import { Keyboard } from "./keyboard.js";
import { Create } from "./create.js";

// default puzzle if the puzzle in the URL cannot be decoded
const DEFAULT_PUZZLE = new Puzzle("the warmest days of winter, spent by the sea", "beach dog days", "eo");

// search parameters used in the URL for parts of the puzzle
const SEARCH_PARAM_CLUE     = "clue";
const SEARCH_PARAM_SOLUTION = "solution";
const SEARCH_PARAM_LETTERS  = "letters";

// HTML element ids used to display the page content
const ELEMENT_ID_CLUE     = "clue";
const ELEMENT_ID_SOLUTION = "solution";
const ELEMENT_ID_KEYBOARD = "keyboard";
const ELEMENT_ID_CREATE   = "button";

addEventListener("load", main);

function main() {

    // load the search parameters
    const searchParams = new URLSearchParams(window.location.search);

    const encodedPuzzle = [
        searchParams.get(SEARCH_PARAM_CLUE),
        searchParams.get(SEARCH_PARAM_SOLUTION),
        searchParams.get(SEARCH_PARAM_LETTERS),
    ];

    const clueElement = document.getElementById(ELEMENT_ID_CLUE);
    const solutionElement = document.getElementById(ELEMENT_ID_SOLUTION);
    const keyboardElement = document.getElementById(ELEMENT_ID_KEYBOARD);
    const createElement = document.getElementById(ELEMENT_ID_CREATE);

    // decode the puzzle or use the fallback if decoding isn't possible
    const puzzle = Uint8Array.fromBase64 ? Puzzle.decode(encodedPuzzle) : DEFAULT_PUZZLE;

    // create the on-screen keyboard
    const keyboard = new Keyboard();

    // create the creator page to run when the "create" button is pressed
    const create = new Create(clueElement, solutionElement);

    // initialize displays
    puzzle.initializeDisplay(clueElement, solutionElement);
    keyboard.initializeDisplay(keyboardElement);

    // initialize event listeners
    puzzle.initializeEventListeners(keyboard);
    keyboard.initializeEventListeners(puzzle);
    create.initializeEventListeners(createElement);
}
