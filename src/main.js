import * as puzzle from "./puzzle.js";
import * as keyboard from "./keyboard.js";
import * as creator from "./creator.js";
import { createHTML } from "./createHTML.js";

addEventListener("load", main);

function main() {
    const searchParams = new URLSearchParams(location.search);

    const encodedPuzzle = [];

    for (let i = 0; i < puzzle.paramNames.length; i++)
        encodedPuzzle.push(searchParams.get(puzzle.paramNames[i]) || "");

    puzzle.decode(encodedPuzzle);

    if (!encodedPuzzle[1]) {
        createHTML(creator.elements, document.body);
        creator.initializeEventListeners();
    }
    else {
        const shareButton = document.getElementById("share-button");
        shareButton.addEventListener("click", puzzle.shareURL);
        shareButton.classList.remove("hidden");

        createHTML(puzzle.elements, document.body);
        createHTML(keyboard.elements, document.body);

        puzzle.initializeEventListeners();
        keyboard.initializeEventListeners();
    }
}
