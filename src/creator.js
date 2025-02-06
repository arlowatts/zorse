import { createHTML } from "./createHTML.js";
import * as puzzle from "./puzzle.js";

const elements = { styles: ["wrapper"], children: [
    { },
    { children: [
        "CLUE",
        { tag: "input", styles: ["border"] },
    ] },
    { children: [
        "SOLUTION",
        { tag: "input", styles: ["border"] },
    ] },
    { children: [
        "REVEALED LETTERS",
        { tag: "input", styles: ["border"] },
    ] },
    { children: [
        { styles: ["border", "tile", "button"], children: ["Share"] },
    ] },
    { children: [
        { styles: ["border", "tile", "button"], children: ["Play"] },
    ] },
    { },
] };

const clue = elements.children[1].children[1];
const solution = elements.children[2].children[1];
const letters = elements.children[3].children[1];

const shareButton = elements.children[4].children[0];
const playButton = elements.children[5].children[0];

export function initializeDisplay(wrapper) {
    createHTML(elements, wrapper);

    puzzle.loadPuzzle([clue.ref, solution.ref, letters.ref]);

    shareButton.ref.addEventListener("click", () => {
        navigator.share({ text: puzzle.shareURL() });
    });

    playButton.ref.addEventListener("click", () => {
        location = puzzle.getURL();
    });

    addEventListener("keydown", (e) => {
        if (e.key === "Enter")
            location = puzzle.getURL();
    });
}
