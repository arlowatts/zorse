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

    // share the puzzle URL when the share button is clicked
    wrappers.share.ref.addEventListener("click", () => {
        puzzle.set(wrappers.clue.ref.value, wrappers.solution.ref.value, wrappers.letters.ref.value);
        navigator.share({ text: puzzle.shareURL() });
    });

    // navigate to the puzzle page when the play button is clicked
    wrappers.play.ref.addEventListener("click", () => {
        puzzle.set(wrappers.clue.ref.value, wrappers.solution.ref.value, wrappers.letters.ref.value);
        location = puzzle.getURL();
    });

    // navigate to the puzzle page when the enter key is pressed
    addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            puzzle.set(wrappers.clue.ref.value, wrappers.solution.ref.value, wrappers.letters.ref.value);
            location = puzzle.getURL();
        }
    });
}
