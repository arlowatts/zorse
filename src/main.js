// alphabet used to initialize the on-screen keyboard
const ALPHABET = "QWERTYUIOPASDFGHJKLZXCVBNM";

// names of the search parameters used to store the puzzle
const SEARCH_PARAM_CLUE     = "clue";
const SEARCH_PARAM_SOLUTION = "solution";
const SEARCH_PARAM_LETTERS  = "letters";

// regex matches for gaps and tiles in the solution
const LETTER_SPACE = "^ $";
const LETTER_TILE = "^[A-Z]$";

// HTML for gaps
const HTML_WORD_GAP = "&emsp;";
const HTML_LETTER_GAP = "&hairsp;";

// default character used in empty tiles
const EMPTY_TILE = "\u00A0";

// escape codes for dangerous characters
const ESCAPE_CODES = {
    "&": "&amp;",
    "<": "&lt;",
};

class Puzzle {
    // elements of the puzzle
    #clue;
    #solution;
    #letters;

    // tiles displaying the puzzle
    #solutionTiles;

    constructor(clue, solution, letters) {
        this.#clue     = clue.toUpperCase();
        this.#solution = solution.toUpperCase();
        this.#letters  = letters.toUpperCase();

        this.#solutionTiles = {};
    }

    // load the puzzle clue into the clue element
    initializeClueElement(clueElement) {
        clueElement.textContent = this.#clue;
    }

    // set up the blank tiles in the solution element
    initializeSolutionElement(solutionElement) {
        for (let i = 0; i < this.#solution.length; i++) {

            // add a gap where there is a space in the solution
            if (this.#solution[i].match(LETTER_SPACE)) {
                solutionElement.insertAdjacentHTML("beforeend", HTML_WORD_GAP);
            }

            // add a tile where there is a letter in the solution
            else if (this.#solution[i].match(LETTER_TILE)) {
                solutionElement.insertAdjacentHTML("beforeend", `<span id="${i}" class="tile tile-unsolved"></span>`);

                // save the reference to the tile
                this.#solutionTiles[i] = document.getElementById(i);

                // set the tile to contain an empty character to preserve consistent formatting
                this.#solutionTiles[i].textContent = EMPTY_TILE;

                // set the onclick function to reveal letters when the tile is clicked
                const puzzle = this;
                this.#solutionTiles[i].addEventListener("click", () => {puzzle.addLetter(puzzle.#solution[i]);});
            }

            // add a non-clickable character where there is a special character in the solution
            else {
                solutionElement.insertAdjacentHTML("beforeend", `${ESCAPE_CODES[this.#solution[i]] || this.#solution[i]}`);
            }

            // add a small space between elements
            solutionElement.insertAdjacentHTML("beforeend", HTML_LETTER_GAP);
        }

        this.revealLetter();
    }

    // add a letter to the list of revealed letters
    addLetter(letter) {

        // check that the character is a simple letter and that it is not revealed
        if (letter.match(LETTER_TILE) && this.#letters.indexOf(letter) === -1) {
            this.#letters += letter;
            this.revealLetter();
        }
    }

    // update tiles to reveal letters
    revealLetter() {
        for (let i = 0; i < this.#solution.length; i++) {

            // reveal tiles which appear in the list of shown letters
            if (this.#solutionTiles[i] && this.#letters.indexOf(this.#solution[i]) > -1) {

                // update the content of the tile
                this.#solutionTiles[i].textContent = this.#solution[i];

                // update the display of the tile
                this.#solutionTiles[i].classList.remove("tile-unsolved");
                this.#solutionTiles[i].classList.add("tile-solved");

                // remove the tile from the dictionary of tiles
                this.#solutionTiles[i] = undefined;
            }
        }
    }

    // add a letter to the first hidden tile
    sketchLetter(letter) {

        // check that the character is a simple letter and that it is not revealed
        if (letter.match(LETTER_TILE) && this.#letters.indexOf(letter) === -1) {

            // find the first empty hidden tile
            for (let i = 0; i < this.#solution.length; i++) {
                if (this.#solutionTiles[i] && this.#solutionTiles[i].textContent === EMPTY_TILE) {
                    this.#solutionTiles[i].textContent = letter;
                    break;
                }
            }
        }
    }

    // delete the last sketched letter
    deleteLetter() {

        // find the last hidden tile with a letter on it
        for (let i = this.#solution.length - 1; i >= 0; i--) {
            if (this.#solutionTiles[i] && this.#solutionTiles[i].textContent !== EMPTY_TILE) {
                this.#solutionTiles[i].textContent = EMPTY_TILE;
                break;
            }
        }
    }

    // encode the puzzle as three url-safe base64 strings
    static encode(puzzle) {
        const encoder = new TextEncoder();

        // encode the parts of the puzzle as arrays of bytes
        const clueBytes     = encoder.encode(puzzle.clue);
        const solutionBytes = encoder.encode(puzzle.solution);
        const lettersBytes  = encoder.encode(puzzle.letters);

        // encode the arrays of bytes as url-safe base64 strings
        const encodedPuzzle = {
            SEARCH_PARAM_CLUE:     clueBytes.toBase64({ alphabet: "base64url" }),
            SEARCH_PARAM_SOLUTION: solutionBytes.toBase64({ alphabet: "base64url" }),
            SEARCH_PARAM_LETTERS:  lettersBytes.toBase64({ alphabet: "base64url" }),
        };

        return encodedPuzzle;
    }

    // create a puzzle from an encoded string
    static decode(encodedPuzzle) {
        const decoder = new TextDecoder();

        // decode the url-safe base64 strings as arrays of bytes
        const clueBytes     = Uint8Array.fromBase64(encodedPuzzle[SEARCH_PARAM_CLUE], { alphabet: "base64url" });
        const solutionBytes = Uint8Array.fromBase64(encodedPuzzle[SEARCH_PARAM_SOLUTION], { alphabet: "base64url" });
        const lettersBytes  = Uint8Array.fromBase64(encodedPuzzle[SEARCH_PARAM_LETTERS], { alphabet: "base64url" });

        // decode the arrays of bytes as parts of the puzzle
        const clue     = decoder.decode(clueBytes);
        const solution = decoder.decode(solutionBytes);
        const letters  = decoder.decode(lettersBytes);

        return new Puzzle(clue, solution, letters);
    }
}

// load the puzzle from the search parameter or use the fallback
const searchParams = new URLSearchParams(window.location.search);

// copy the values of the search parameters into a dictionary to decode
const encodedPuzzle = {
    SEARCH_PARAM_CLUE:     searchParams.get(SEARCH_PARAM_CLUE),
    SEARCH_PARAM_SOLUTION: searchParams.get(SEARCH_PARAM_SOLUTION),
    SEARCH_PARAM_LETTERS:  searchParams.get(SEARCH_PARAM_LETTERS),
};

// decode the puzzle or use the fallback if decoding fails
let puzzle;
try { puzzle = Puzzle.decode(encodedPuzzle); }
catch { puzzle = new Puzzle("A 24-hour drive with 30 passengers", "The wheels on the bus go round and round the clock", "wkul"); }

// initialize the on-screen keyboard
for (let i = 0; i < ALPHABET.length; i++) {
    document.getElementById(ALPHABET[i]).addEventListener("click", () => {puzzle.sketchLetter(ALPHABET[i]);});
}

// initialize the on-screen backspace key
document.getElementById("backspace").addEventListener("click", () => {puzzle.deleteLetter();});

// initialize event listeners for keyboard typing
addEventListener("keydown", (e) => {
    // if a single letter is pressed, sketch it in
    if (!e.ctrlKey && e.key.length === 1 && e.key.match("[a-zA-Z]")) {
        puzzle.sketchLetter(e.key.toUpperCase());
    }

    // if the backspace key is pressed, delete a sketched letter
    else if (!e.ctrlKey && e.key === "Backspace") {
        puzzle.deleteLetter();
    }
});

// initialize the puzzle display
puzzle.initializeClueElement(document.getElementById("puzzle-clue"));
puzzle.initializeSolutionElement(document.getElementById("puzzle-solution"));
