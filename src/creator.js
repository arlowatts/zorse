import { createHTML } from "./createHTML.js";
import * as puzzle from "./puzzle.js";

const elements = { tag: "div", styles: ["wrapper"], children: [
    { tag: "div", styles: [], children: [] },
    { tag: "div", styles: [], children: [
        "CLUE",
        { tag: "input", styles: ["border"], children: [] },
    ] },
    { tag: "div", styles: [], children: [
        "SOLUTION",
        { tag: "input", styles: ["border"], children: [] },
    ] },
    { tag: "div", styles: [], children: [
        "REVEALED LETTERS",
        { tag: "input", styles: ["border"], children: [] },
    ] },
    { tag: "div", styles: [], children: [
        { tag: "div", styles: ["border", "tile", "button"], children: ["Share"] },
    ] },
    { tag: "div", styles: [], children: [
        { tag: "div", styles: ["border", "tile", "button"], children: ["Play"] },
    ] },
    { tag: "div", styles: [], children: [] },
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
