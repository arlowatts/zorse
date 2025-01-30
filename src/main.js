import { Puzzle } from "./puzzle.js";
import { Keyboard } from "./keyboard.js";
import { Creator } from "./creator.js";

addEventListener("load", main);

function main() {
    const searchParams = new URLSearchParams(window.location.search);

    const encodedPuzzle = [];

    for (let i = 0; i < Puzzle.paramNames.length; i++)
        encodedPuzzle.push(searchParams.get(Puzzle.paramNames[i]) || "");

    const puzzle = Puzzle.decode(encodedPuzzle);

    const shareButton = document.getElementById("sharebutton");

    shareButton.addEventListener("click", () => {
        navigator.clipboard.writeText(Puzzle.shareURL(puzzle));

        shareButton.textContent = "Copied!";
        setTimeout(() => { shareButton.textContent = "Share this zorse"; }, 2000);
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
