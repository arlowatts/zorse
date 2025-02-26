import * as puzzle from "./puzzle.js";

// array of HTML elements to create on the page
export const elements = [
    { styles: ["hidden"], children: ["CLUE", { tag: "textarea", styles: ["border"] }] },
    { styles: ["hidden"], children: ["SOLUTION", { tag: "textarea", styles: ["border"] }] },
    { styles: ["hidden"], children: ["REVEALED LETTERS", { tag: "textarea", styles: ["border"] }] },
    { styles: ["hidden", "border", "button"], children: ["Share"], listeners: { click: share } },
    { styles: ["hidden", "border", "button"], children: ["Play"], listeners: { click: play } },
];

// dictionary of commonly used wrappers
const wrappers = {
    clue: elements[0],
    clueInput: elements[0].children[1],

    solution: elements[1],
    solutionInput: elements[1].children[1],

    letters: elements[2],
    lettersInput: elements[2].children[1],

    share: elements[3],
    play: elements[4],
};

// initialize event listeners on the HTML elements
export function init() {

    // navigate to the puzzle page when the enter key is pressed
    addEventListener("keydown", (e) => { if (e.key === "Enter") play(); });

    // show the HTML elements
    wrappers.clue.ref.classList.remove("hidden");
    wrappers.solution.ref.classList.remove("hidden");
    wrappers.letters.ref.classList.remove("hidden");
    wrappers.share.ref.classList.remove("hidden");
    wrappers.play.ref.classList.remove("hidden");
}

// share the link to the new puzzle
function share() {
    setPuzzle();
    puzzle.shareURL();
}

// load the new puzzle in the same tab
function play() {
    setPuzzle();
    location = puzzle.getURL();
}

// update the puzzle with the input values
function setPuzzle() {
    puzzle.set(wrappers.clueInput.ref.value, wrappers.solutionInput.ref.value, wrappers.lettersInput.ref.value);
}
