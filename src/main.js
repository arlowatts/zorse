import { Puzzle } from "./puzzle.js";
import { Keyboard } from "./keyboard.js";
import { Creator } from "./creator.js";

addEventListener("load", main);
addEventListener("hashchange", () => { location.reload(); });

function main() {
    const searchParams = new URLSearchParams(window.location.search);

    const encodedPuzzle = [];

    for (let i = 0; i < Puzzle.paramNames.length; i++)
        encodedPuzzle.push(searchParams.get(Puzzle.paramNames[i]) || "");

    const puzzle = Puzzle.decode(encodedPuzzle);

    if (window.location.hash === "#create" || !encodedPuzzle[0] || !encodedPuzzle[1]) {
        const creator = new Creator(puzzle);

        creator.initializeDisplay(document.body);
        creator.initializeEventListeners();
    }
    else {
        const keyboard = new Keyboard();

        puzzle.initializeDisplay(document.body);
        puzzle.initializeEventListeners();

        keyboard.initializeDisplay(document.body);
        keyboard.initializeEventListeners();

        puzzle.addTarget(keyboard);
        keyboard.addTarget(puzzle);
    }
}
