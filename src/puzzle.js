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
let lines = [];

// the processed solution
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

    clueWrapper.children = [];
    solutionWrapper.children = [];
    indicatorsWrapper.children = [];
    messageSolutionWrapper.children = [];

    messageSolutionWrapper.children.push(lines[1].value);

    // add the puzzle's clue as text
    clueWrapper.children.push(lines[0].value);

    for (const word of lines[1].value.split(regexSpace)) {

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

    for (const letter of lines[2].value)
        revealLetter(letter, false);

    shareWrapper.ref.addEventListener("click", () => {
        navigator.share({ text: "\"" + lines[0].value + "\"\n" + score });
    });
}

function revealLetter(letter, updateCounter = true) {
    if (letter.match(regexTile) && !revealedLetters.includes(letter) && reveals < maxReveals) {
        revealedLetters.push(letter);

        if (updateCounter) {
            indicatorsWrapper.children[reveals].ref.classList.add("filled");
            reveals++;
        }

        for (let i = 0; i < targets.length; i++)
            targets[i].lockKey(letter);

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
        for (let i = 0; i < targets.length; i++)
            targets[i].unlockKey("ENTER");
    else
        for (let i = 0; i < targets.length; i++)
            targets[i].lockKey("ENTER");
}

export function addLetter(letter) {
    if (letter.match(regexTile) && !revealedLetters.includes(letter)) {
        for (const wordWrapper of solutionWrapper.children) {
            for (const tile of wordWrapper.children) {
                if (tile.data && !tile.ref.textContent) {
                    tile.ref.textContent = letter;

                    if (isComplete())
                        for (let i = 0; i < targets.length; i++)
                            targets[i].unlockKey("ENTER");

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
                    for (let i = 0; i < targets.length; i++)
                        targets[i].lockKey("ENTER");

                return;
            }
        }
    }
}

export function submit() {
    if (!submitted && isComplete()) {
        submitted = true;
        let correct = true;

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

        for (let i = 0; i < targets.length; i++)
            targets[i].clearDisplay();

        targets = [];

        scoreWrapper.ref.textContent = getScore(correct);

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
