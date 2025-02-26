import * as keyboard from "./keyboard.js";

export const PARAM_NAMES = ["c", "s", "l"];

const STYLES_WORD = ["word"];
const STYLES_TILE = ["border", "tile", "letter"];
const STYLES_INDICATOR = ["border", "indicator"];

const REGEX_SPACE = /\s+/g;
const REGEX_TILE = /^[A-Z]$/;

const MAX_REVEALS = 5;

const EMOJI_HORSES = ["\u{1f984}", "\u{1f3A0}", "\u{1f3C7}", "\u{1f40E}", "\u{1f993}", "\u{1f434}"];
const EMOJI_LETTER = "\u{2709}";
const EMOJI_FAIL = "\u{1f937}";

const KEYBOARD_KEY_SUBMIT = keyboard.getKey("ENTER");

// array of HTML elements to create on the page
export const elements = [
    { styles: ["hidden", "title"] },
    { styles: ["hidden"] },
    { styles: ["hidden"] },
    { styles: ["hidden"] },
    { styles: ["hidden"] },
    { styles: ["hidden", "border", "button"], children: ["Share"], listeners: { "click": shareScore } },
];

// dictionary of commonly used wrappers
const wrappers = {
    clue: elements[0],
    solution: elements[1],
    indicators: elements[2],
    message: elements[3],
    score: elements[4],
    share: elements[5],
};

// dictionary of puzzle properties
const puzzle = {
    clue: "",
    solution: "",
    letters: "",

    reveals: 0,
    revealedLetters: [],

    url: location.origin + location.pathname,
    score: "",
};

// initialize event listeners on the HTML elements
export function init() {

    // reveal the tiles containing revealed letters
    for (const letter of puzzle.letters)
        revealLetter(letter, false);

    // show the HTML elements
    wrappers.clue.ref.classList.remove("hidden");
    wrappers.solution.ref.classList.remove("hidden");
    wrappers.indicators.ref.classList.remove("hidden");
}

// set the puzzle and update the puzzle properties
export function set(clue, solution, letters) {

    // clean and set the main puzzle properties
    puzzle.clue = cleanString(clue);
    puzzle.solution = cleanString(solution);
    puzzle.letters = sortString(letters);

    // update the URL
    const encodedPuzzle = encode();
    const searchParams = new URLSearchParams();

    for (let i = 0; i < encodedPuzzle.length; i++)
        searchParams.set(PARAM_NAMES[i], encodedPuzzle[i]);

    puzzle.url = location.origin + location.pathname + "?" + searchParams;

    // update the HTML elements
    wrappers.clue.children = [puzzle.clue];
    wrappers.solution.children = [];
    wrappers.indicators.children = [];
    wrappers.message.children = [puzzle.solution];

    // repopulate the solution tile elements
    for (const wordText of puzzle.solution.split(" ")) {

        // create a word element
        const word = { styles: STYLES_WORD, children: [] };

        for (const tileText of wordText) {

            // add a tile to the word if the character is a tile character
            if (tileText.match(REGEX_TILE)) {
                word.children.push({
                    styles: STYLES_TILE,
                    data: tileText,
                    listeners: { "click": () => { revealLetter(tileText); } },
                });
            }

            // otherwise add the character itself to the word
            else
                word.children.push(tileText);
        }

        wrappers.solution.children.push(word);
    }

    // add the reveal indicators
    for (let i = 0; i < MAX_REVEALS; i++)
        wrappers.indicators.children.push({ styles: STYLES_INDICATOR });
}

// encode the puzzle as three url-safe base64 strings
export function encode() {
    const encoder = new TextEncoder();

    return [puzzle.clue, puzzle.solution, puzzle.letters].map((s) => {

        // encode the string as an array of bytes
        s = encoder.encode(s);

        // encode the array of bytes as a base64 string
        s = String.fromCharCode.apply(null, s);
        s = btoa(s);

        // make the base64 string url-safe
        s = s.replaceAll("+", "-");
        s = s.replaceAll("/", "_");
        s = s.replaceAll("=", "");

        return s;
    });
}

// decode a puzzle from three url-safe base64 strings
export function decode(encodedPuzzle) {
    const decoder = new TextDecoder();

    const decodedPuzzle = encodedPuzzle.map((s) => {

        // restore the original form of the base64 string
        s = s.replaceAll("_", "/");
        s = s.replaceAll("-", "+");

        // decode the base64 string as an array of bytes
        s = atob(s);
        s = Array.from(s, (t) => t.charCodeAt());
        s = new Uint8Array(s);

        // decode the array of bytes as a string
        s = decoder.decode(s);

        return s;
    });

    // load the puzzle
    set(...decodedPuzzle);
}

// sketch a letter in an empty tile in the solution
export function addLetter(tileText) {

    // check that the letter is valid and hasn't been revealed already
    if (tileText.match(REGEX_TILE) && !puzzle.revealedLetters.includes(tileText)) {

        // iterate over every tile in the solution
        for (const word of wrappers.solution.children) {
            for (const tile of word.children) {

                // if the tile is empty, add the letter and return
                if (tile.data && !tile.ref.textContent) {
                    tile.ref.textContent = tileText;

                    // if the solution is complete, unlock the submit button
                    if (isComplete())
                        keyboard.unlockKey(KEYBOARD_KEY_SUBMIT);

                    return;
                }
            }
        }
    }
}

// remove the last sketched letter in the solution
export function removeLetter() {

    // search backwards from the end to find a tile with a sketched letter
    for (const word of wrappers.solution.children.toReversed()) {
        for (const tile of word.children.toReversed()) {

            // if the tile has a letter and hasn't been revealed yet, clear it
            if (tile.data && tile.ref.textContent && !puzzle.revealedLetters.includes(tile.data)) {
                tile.ref.textContent = "";

                // if the solution is incomplete, lock the submit button
                if (!isComplete())
                    keyboard.lockKey(KEYBOARD_KEY_SUBMIT);

                return;
            }
        }
    }
}

// check the sketched letters against the actual solution and generate a score
export function submit() {

    // check that the puzzle is complete and hasn't already been submitted
    if (!puzzle.score && isComplete()) {

        let correct = true;

        // iterate over every tile and compare it to the solution
        for (const word of wrappers.solution.children) {
            for (const tile of word.children) {
                if (tile.data) {

                    // if the tile hasn't been revealed, mark it as revealed
                    if (!puzzle.revealedLetters.includes(tile.data))
                        puzzle.revealedLetters.push(tile.data);

                    // if the tile is correct, color it green
                    if (tile.data === tile.ref.textContent)
                        tile.ref.classList.add("filled");

                    // otherwise, color it gray and mark the solution as wrong
                    else {
                        tile.ref.classList.add("locked");
                        correct = false;
                    }
                }
            }
        }

        // update the score based on the number of reveals
        puzzle.score = EMOJI_LETTER.repeat(puzzle.reveals) + (correct ? EMOJI_HORSES[puzzle.reveals] : EMOJI_FAIL);
        wrappers.score.ref.textContent = puzzle.score;

        // hide the keyboard
        keyboard.hide();

        // show the score message HTML elements
        wrappers.message.ref.classList.remove("hidden");
        wrappers.score.ref.classList.remove("hidden");
        wrappers.share.ref.classList.remove("hidden");
    }
}

// access the puzzle's URL
export function getURL() {
    return puzzle.url;
}

// share the puzzle's URL using the browser's built-in share feature
export function shareURL() {
    navigator.share({ text: "\"" + puzzle.clue + "\"\n" + puzzle.url });
}

// share the puzzle's score using the browser's built-in share feature
function shareScore() {
    navigator.share({ text: "\"" + puzzle.clue + "\"\n" + puzzle.score });
}

// reveal all instances of a letter in the solution
function revealLetter(tileText, updateCounter = true) {

    // check that the letter is valid and hasn't been revealed already
    if (tileText.match(REGEX_TILE) && !puzzle.revealedLetters.includes(tileText) && puzzle.reveals < MAX_REVEALS) {

        // add the letter to the array of revealed letters
        puzzle.revealedLetters.push(tileText);

        // update the reveals indicators, unless the flag is set otherwise
        if (updateCounter)
            wrappers.indicators.children[puzzle.reveals++].ref.classList.add("filled");

        // lock the associated key on the keyboard
        keyboard.lockKey(keyboard.getKey(tileText));

        // iterate over every tile in the solution
        for (const word of wrappers.solution.children) {
            for (const tile of word.children) {
                if (tile.data) {

                    // if the tile matches the letter, fill it in
                    if (tile.data === tileText) {
                        tile.ref.classList.add("filled");
                        tile.ref.textContent = tileText;
                    }

                    // if the tile contains the letter already, remove it
                    else if (tile.ref.textContent === tileText)
                        tile.ref.textContent = "";
                }
            }
        }
    }

    // if the solution is complete, unlock the submit button
    if (isComplete())
        keyboard.unlockKey(KEYBOARD_KEY_SUBMIT);

    // otherwise, lock the submit button
    else
        keyboard.lockKey(KEYBOARD_KEY_SUBMIT);
}

// return true if every tile in the solution contains a letter
function isComplete() {

    // iterate over every tile
    for (const word of wrappers.solution.children)
        for (const tile of word.children)

            // return false if a tile is empty
            if (tile.data && !tile.ref.textContent)
                return false;

    return true;
}

// remove redundant whitespace from a string and convert it to upper case
function cleanString(string) {
    return string.trim().normalize().toWellFormed().replaceAll(REGEX_SPACE, " ").toUpperCase();
}

// get all unique alphabetic characters in a string, ordered alphabetically
function sortString(string) {
    return Array.from(new Set(string.toUpperCase())).filter((c) => c.match(REGEX_TILE)).sort().join("");
}
