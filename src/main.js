import * as puzzle from "./puzzle.js";
import { Keyboard } from "./keyboard.js";
import { Creator } from "./creator.js";

addEventListener("load", main);

function main() {
    const searchParams = new URLSearchParams(window.location.search);

    const encodedPuzzle = [];

    for (let i = 0; i < puzzle.paramNames.length; i++)
        encodedPuzzle.push(searchParams.get(puzzle.paramNames[i]) || "");

    puzzle.decode(encodedPuzzle);

    const shareButton = document.getElementById("share-button");

    shareButton.addEventListener("click", () => {
        navigator.share({ text: puzzle.shareURL() });
    });

    if (!encodedPuzzle[1]) {
        const creator = new Creator(document.body);
    }
    else {
        const keyboard = new Keyboard();

        puzzle.initializeDisplay(document.body);
        keyboard.initializeDisplay(document.body);

        puzzle.addTarget(keyboard);
        keyboard.addTarget(puzzle);

        puzzle.initializeEventListeners();
        keyboard.initializeEventListeners();
    }
}
