import { tileDisplay } from "./tileDisplay.js";

export const paramNames = ["c", "s", "l"];

const regexSpace = / +/;
const regexTile = /^[A-Z]$/;

const cssClassesClue       = [["text"]];
const cssClassesSolution   = [[], ["word"], ["border", "box", "tile"]];
const cssClassesIndicators = [[], ["border", "indicator"]];

const refs = [[], [], []];
const refsIndicators = [[], []];

const emoji = [0x1F984, 0x1F3A0, 0x1F3C7, 0x1F40E, 0x1F993, 0x1F434];
const letterEmoji = 0x2709;
const shrugEmoji = 0x1F937;

// elements of the puzzle
let lines = [];

// the processed solution
let solutionNested;
let solutionFlat;
let indicators;
let revealedLetters = [];
let reveals = 0;
let maxReveals = 5;

let targets = [];
let submitted = false;

export function loadPuzzle(clue, solution, letters) {
    if (!(typeof clue === "string")) {
        lines = clue;
    }
    else {
        lines[0] = {value: clue.toUpperCase()};
        lines[1] = {value: solution.toUpperCase()};
        lines[2] = {value: letters.toUpperCase()};
    }

    solutionNested =
        lines[1].value
        .split(regexSpace)
        .map((x) => Array.from(x).map((y) => y.match(regexTile) ? [] : y));

    solutionFlat = Array.from(lines[1].value).filter((x) => x.match(regexTile));

    indicators = [];

    for (let i = 0; i < maxReveals; i++)
        indicators.push([]);
}

export function initializeDisplay(wrapper) {
    tileDisplay([lines[0].value], cssClassesClue, wrapper);
    tileDisplay(solutionNested, cssClassesSolution, wrapper, refs);
    tileDisplay(indicators, cssClassesIndicators, wrapper, refsIndicators);
}

export function initializeEventListeners() {
    for (let i = 0; i < solutionFlat.length; i++) {
        refs[2][i].addEventListener("click", () => { revealLetter(solutionFlat[i]); });
    }

    for (let i = 0; i < lines[2].value.length; i++) {
        revealLetter(lines[2].value[i], false);
    }
}

function revealLetter(letter, updateCounter = true) {
    if (letter.match(regexTile) && !revealedLetters.includes(letter) && reveals < maxReveals) {
        revealedLetters.push(letter);

        if (updateCounter) {
            refsIndicators[1][reveals].classList.add("filled");
            reveals++;
        }

        for (let i = 0; i < targets.length; i++)
            targets[i].lockKey(letter);

        for (let i = 0; i < solutionFlat.length; i++) {
            if (solutionFlat[i] === letter) {
                refs[2][i].classList.add("filled");
                refs[2][i].textContent = letter;
            }

            else if (refs[2][i].textContent === letter)
                refs[2][i].textContent = "";
        }
    }

    if (isComplete())
        for (let i = 0; i < targets.length; i++)
            targets[i].unlockKey("ENTER");
    else
        for (let i = 0; i < targets.length; i++)
            targets[i].lockKey("ENTER");
}

export function addLetter(letter) {
    if (letter.match(regexTile) && !revealedLetters.includes(letter)) {
        for (let i = 0; i < solutionFlat.length; i++) {
            if (!refs[2][i].textContent) {
                refs[2][i].textContent = letter;
                break;
            }
        }
    }

    if (isComplete())
        for (let i = 0; i < targets.length; i++)
            targets[i].unlockKey("ENTER");
}

export function removeLetter() {
    for (let i = solutionFlat.length - 1; i >= 0; i--) {
        if (!revealedLetters.includes(solutionFlat[i]) && refs[2][i].textContent) {
            refs[2][i].textContent = "";
            break;
        }
    }

    if (!isComplete())
        for (let i = 0; i < targets.length; i++)
            targets[i].lockKey("ENTER");
}

export function submit() {
    if (!submitted && isComplete()) {
        submitted = true;
        let correct = true;

        for (let i = 0; i < solutionFlat.length; i++) {
            if (!revealedLetters.includes(solutionFlat[i]))
                revealedLetters.push(solutionFlat[i]);

            if (refs[2][i].textContent === solutionFlat[i])
                refs[2][i].classList.add("filled");
            else {
                refs[2][i].classList.add("locked");
                correct = false;
            }
        }

        for (let i = 0; i < targets.length; i++)
            targets[i].clearDisplay();

        targets = [];

        displayMessage(correct);
    }
}

function isComplete() {
    let complete = true;

    for (let i = 0; i < solutionFlat.length; i++) {
        if (!refs[2][i].textContent) {
            complete = false;
            break;
        }
    }

    return complete;
}

function displayMessage(correct) {
    const score = getScore(correct);
    const messageRef = [[], [], []];

    tileDisplay([[lines[1].value], [score], [["Share"]]], [["message"], [], ["border", "box", "button"]], refs[0][0].parentElement, messageRef);

    messageRef[2][0].addEventListener("click", (e) => {
        navigator.share({ text: "\"" + lines[0].value + "\"\n" + score });
    });
}

function getScore(correct) {
    let score = String.fromCodePoint(letterEmoji).repeat(reveals);

    if (correct)
        score += String.fromCodePoint(emoji[reveals]);
    else
        score += String.fromCodePoint(shrugEmoji);

    return score;
}

export function addTarget(target) {
    targets.push(target);
    target.lockKey("ENTER");
}

function getLines() {
    return lines;
}

export function shareURL() {
    return "\"" + lines[0].value.toUpperCase() + "\"\n" + getURL();
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
    const clueBytes     = encoder.encode(lines[0].value.toUpperCase());
    const solutionBytes = encoder.encode(lines[1].value.toUpperCase());
    const lettersBytes  = encoder.encode(lines[2].value.toUpperCase());

    // encode the arrays of bytes as base64 strings
    return [
        btoa(String.fromCharCode.apply(null, clueBytes)),
        btoa(String.fromCharCode.apply(null, solutionBytes)),
        btoa(String.fromCharCode.apply(null, lettersBytes)),
    ];
}

// decode a puzzle from three url-safe base64 strings
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

    return loadPuzzle(clue, solution, letters);
}
