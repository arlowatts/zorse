import { Puzzle, SEARCH_PARAM_CLUE, SEARCH_PARAM_SOLUTION, SEARCH_PARAM_LETTERS } from "./puzzle.js";
import { Keyboard } from "./keyboard.js";

// alphabet used to initialize the on-screen keyboard
const KEYBOARD_LAYOUT = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
];

// load the search parameters
const searchParams = new URLSearchParams(window.location.search);

// copy the values of the search parameters
const encodedPuzzle = {
    SEARCH_PARAM_CLUE:     searchParams.get(SEARCH_PARAM_CLUE),
    SEARCH_PARAM_SOLUTION: searchParams.get(SEARCH_PARAM_SOLUTION),
    SEARCH_PARAM_LETTERS:  searchParams.get(SEARCH_PARAM_LETTERS),
};

// decode the puzzle or use the fallback if decoding fails
let puzzle;
try { puzzle = Puzzle.decode(encodedPuzzle); }
catch { puzzle = new Puzzle("the propensity to shoot targets with your toes", "trigger happy feet", "t"); }

// initialize the puzzle display
puzzle.initializeClueElement(document.getElementById("puzzle-clue"));
puzzle.initializeSolutionElement(document.getElementById("puzzle-solution"));

// create the on-screen keyboard
const keyboard = new Keyboard(KEYBOARD_LAYOUT);
keyboard.initializeKeyboardElement(document.getElementById("keyboard"));

// initialize the keyboard events
keyboard.initializeEventListeners(puzzle);
