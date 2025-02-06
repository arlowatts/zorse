import * as puzzle from "./puzzle.js";
import * as keyboard from "./keyboard.js";
import * as creator from "./creator.js";
import { createHTML } from "./createHTML.js";

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
        createHTML(creator.elements, document.body);
        creator.initializeEventListeners();
    }
    else {
        createHTML(puzzle.elements, document.body);
        createHTML(keyboard.elements, document.body);

        puzzle.addTarget(keyboard);
        keyboard.addTarget(puzzle);

        puzzle.initializeEventListeners();
        keyboard.initializeEventListeners();
    }
}
