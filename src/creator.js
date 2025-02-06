import * as puzzle from "./puzzle.js";

export const elements = { styles: ["wrapper"], children: [
    { },
    { children: ["CLUE", { tag: "input", styles: ["border"] }] },
    { children: ["SOLUTION", { tag: "input", styles: ["border"] }] },
    { children: ["REVEALED LETTERS", { tag: "input", styles: ["border"] }] },
    { children: [{ styles: ["border", "tile", "button"], children: ["Share"] }] },
    { children: [{ styles: ["border", "tile", "button"], children: ["Play"] }] },
    { },
] };

const wrappers = {
    clue: elements.children[1].children[1],
    solution: elements.children[2].children[1],
    letters: elements.children[3].children[1],
    share: elements.children[4].children[0],
    play: elements.children[5].children[0],
};

export function initializeEventListeners() {
    // set the puzzle parameters
    puzzle.loadPuzzle([wrappers.clue.ref, wrappers.solution.ref, wrappers.letters.ref]);

    // share the puzzle URL when the share button is clicked
    wrappers.share.ref.addEventListener("click", () => {
        navigator.share({ text: puzzle.shareURL() });
    });

    // navigate to the puzzle page when the play button is clicked
    wrappers.play.ref.addEventListener("click", () => {
        location = puzzle.getURL();
    });

    // navigate to the puzzle page when the enter key is pressed
    addEventListener("keydown", (e) => {
        if (e.key === "Enter")
            location = puzzle.getURL();
    });
}
