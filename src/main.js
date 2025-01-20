import { Puzzle } from "./puzzle.js";
import { Keyboard } from "./keyboard.js";
import { Creator } from "./creator.js";

addEventListener("load", main);

function main() {
    const searchParams = new URLSearchParams(window.location.search);

    const encodedPuzzle = [];

    for (let i = 0; i < Puzzle.paramNames.length; i++) {
        const value = searchParams.get(Puzzle.paramNames[i]);

        if (value)
            encodedPuzzle.push(value);
        else
            break;
    }

    if (encodedPuzzle.length === Puzzle.paramNames.length) {
        const puzzle = Puzzle.decode(encodedPuzzle);
        const keyboard = new Keyboard();

        puzzle.initializeDisplay(document.body);
        puzzle.initializeEventListeners();

        keyboard.initializeDisplay(document.body);
        keyboard.initializeEventListeners();

        keyboard.addTarget(puzzle);
    }
    else {
        const creator = new Creator(Puzzle.paramNames);

        creator.initializeDisplay(document.body);
        creator.initializeEventListeners();
    }
}
