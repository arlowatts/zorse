import * as keyboard from "./keyboard.js";

export const paramNames = ["c", "s", "l"];

const regexSpace = / +/;
const regexTile = /^[A-Z]$/;

export const elements = { styles: ["wrapper"], children: [
    { },
    { },
    { },
    { },
    { styles: ["hidden"] },
    { styles: ["hidden"] },
    { children: [
        { styles: ["hidden", "border", "tile", "button"], children: ["Share"] },
    ] },
    { },
] };

const clueWrapper = elements.children[1];
const solutionWrapper = elements.children[2];
const indicatorsWrapper = elements.children[3];
const messageSolutionWrapper = elements.children[4];
const scoreWrapper = elements.children[5];
const shareWrapper = elements.children[6].children[0];

const stylesWord = ["word"];
const stylesTile = ["border", "tile", "letter"];
const stylesIndicator = ["border", "indicator"];

const emoji = [0x1F984, 0x1F3A0, 0x1F3C7, 0x1F40E, 0x1F993, 0x1F434];
const letterEmoji = 0x2709;
const shrugEmoji = 0x1F937;

// elements of the puzzle
const puzzle = {
    clue: "",
    solution: "",
    letters: "",
};

// the processed solution
let revealedLetters = [];
let reveals = 0;
let maxReveals = 5;

let submitted = false;
let correct = false;

export function set(clue, solution, letters) {
    puzzle.clue = clue.trim().normalize().toWellFormed().replaceAll(/\s+/g, " ").toUpperCase();
    puzzle.solution = solution.trim().normalize().toWellFormed().replaceAll(/\s+/g, " ").toUpperCase();
    puzzle.letters = Array.from(new Set(letters.toUpperCase())).filter((letter) => letter.match(regexTile)).sort().join("");
    console.log('"' + puzzle.clue + '"');
    console.log('"' + puzzle.solution + '"');

    clueWrapper.children = [];
    solutionWrapper.children = [];
    indicatorsWrapper.children = [];
    messageSolutionWrapper.children = [];

    messageSolutionWrapper.children.push(puzzle.solution);

    // add the puzzle's clue as text
    clueWrapper.children.push(puzzle.clue);

    for (const word of puzzle.solution.split(regexSpace)) {

        // add a word to the solution
        const wordWrapper = { styles: stylesWord, children: [] };

        // add a tile or raw character to the word
        for (const character of word) {
            if (character.match(regexTile))
                wordWrapper.children.push({ styles: stylesTile, data: character });
            else
                wordWrapper.children.push(character);
        }

        solutionWrapper.children.push(wordWrapper);
    }

    // add the reveal indicators
    for (let i = 0; i < maxReveals; i++)
        indicatorsWrapper.children.push({ styles: stylesIndicator });
}

export function initializeEventListeners() {
    for (const wordWrapper of solutionWrapper.children)
        for (const tile of wordWrapper.children)
            if (tile.data)
                tile.ref.addEventListener("click", () => { revealLetter(tile.data); });

    for (const letter of puzzle.letters)
        revealLetter(letter, false);

    shareWrapper.ref.addEventListener("click", shareScore);
}

function revealLetter(letter, updateCounter = true) {
    if (letter.match(regexTile) && !revealedLetters.includes(letter) && reveals < maxReveals) {
        revealedLetters.push(letter);

        if (updateCounter) {
            indicatorsWrapper.children[reveals].ref.classList.add("filled");
            reveals++;
        }

        keyboard.lockKey(letter);

        for (const wordWrapper of solutionWrapper.children) {
            for (const tile of wordWrapper.children) {
                if (tile.data) {
                    if (tile.data === letter) {
                        tile.ref.classList.add("filled");
                        tile.ref.textContent = letter;
                    }

                    else if (tile.ref.textContent === letter)
                        tile.ref.textContent = "";
                }
            }
        }
    }

    if (isComplete())
        keyboard.unlockKey("ENTER");
    else
        keyboard.lockKey("ENTER");
}

export function addLetter(letter) {
    if (letter.match(regexTile) && !revealedLetters.includes(letter)) {
        for (const wordWrapper of solutionWrapper.children) {
            for (const tile of wordWrapper.children) {
                if (tile.data && !tile.ref.textContent) {
                    tile.ref.textContent = letter;

                    if (isComplete())
                        keyboard.unlockKey("ENTER");

                    return;
                }
            }
        }
    }
}

export function removeLetter() {
    for (const wordWrapper of solutionWrapper.children.toReversed()) {
        for (const tile of wordWrapper.children.toReversed()) {
            if (tile.data && !revealedLetters.includes(tile.data) && tile.ref.textContent) {
                tile.ref.textContent = "";

                if (!isComplete())
                    keyboard.lockKey("ENTER");

                return;
            }
        }
    }
}

export function submit() {
    if (!submitted && isComplete()) {
        submitted = true;
        correct = true;

        for (const wordWrapper of solutionWrapper.children) {
            for (const tile of wordWrapper.children) {
                if (tile.data) {
                    if (!revealedLetters.includes(tile.data))
                        revealedLetters.push(tile.data);

                    if (tile.data === tile.ref.textContent)
                        tile.ref.classList.add("filled");
                    else {
                        tile.ref.classList.add("locked");
                        correct = false;
                    }
                }
            }
        }

        keyboard.hide();

        scoreWrapper.ref.textContent = getScore();

        messageSolutionWrapper.ref.classList.remove("hidden");
        scoreWrapper.ref.classList.remove("hidden");
        shareWrapper.ref.classList.remove("hidden");
    }
}

function isComplete() {
    let complete = true;

    for (const wordWrapper of solutionWrapper.children) {
        for (const tile of wordWrapper.children) {
            if (tile.data && !tile.ref.textContent) {
                complete = false;
                break;
            }
        }
    }

    return complete;
}

function getScore() {
    let score = String.fromCodePoint(letterEmoji).repeat(reveals);

    if (correct)
        score += String.fromCodePoint(emoji[reveals]);
    else
        score += String.fromCodePoint(shrugEmoji);

    return score;
}

function shareScore() {
    navigator.share({ text: "\"" + puzzle.clue + "\"\n" + getScore() });
}

export function shareURL() {
    navigator.share({ text: "\"" + puzzle.clue + "\"\n" + getURL() });
}

export function getURL() {
    const encodedPuzzle = encode();

    const searchParams = new URLSearchParams();

    for (let i = 0; i < encodedPuzzle.length; i++)
        searchParams.set(paramNames[i], encodedPuzzle[i]);

    return location.origin + location.pathname + "?" + searchParams;
}

// encode the puzzle as three base64 strings
export function encode() {
    const encoder = new TextEncoder();

    // encode the parts of the puzzle as arrays of bytes
    const clueBytes     = encoder.encode(puzzle.clue.toUpperCase());
    const solutionBytes = encoder.encode(puzzle.solution.toUpperCase());
    const lettersBytes  = encoder.encode(puzzle.letters.toUpperCase());

    // encode the arrays of bytes as base64 strings
    return [
        btoa(String.fromCharCode.apply(null, clueBytes)),
        btoa(String.fromCharCode.apply(null, solutionBytes)),
        btoa(String.fromCharCode.apply(null, lettersBytes)),
    ];
}

// decode a puzzle from three base64 strings
export function decode(encodedPuzzle) {
    const decoder = new TextDecoder();

    // decode the base64 strings as arrays of bytes
    const clueBytes     = new Uint8Array(Array.from(atob(encodedPuzzle[0])).map((x) => x.charCodeAt()));
    const solutionBytes = new Uint8Array(Array.from(atob(encodedPuzzle[1])).map((x) => x.charCodeAt()));
    const lettersBytes  = new Uint8Array(Array.from(atob(encodedPuzzle[2])).map((x) => x.charCodeAt()));

    // decode the arrays of bytes as parts of the puzzle
    const clue     = decoder.decode(clueBytes).toUpperCase();
    const solution = decoder.decode(solutionBytes).toUpperCase();
    const letters  = decoder.decode(lettersBytes).toUpperCase();

    // load the puzzle
    set(clue, solution, letters);
}
