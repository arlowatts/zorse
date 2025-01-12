// maximum number of digits in the length of the clue or solution
const MAX_DIGITS = 2;

// radix used to encode the length of the clue and solution
const RADIX = 16;

// name of the search parameter used to store the puzzle
const SEARCH_PARAM_NAME = "q";

// the alphabet used to initialize the on-screen keyboard
const ALPHABET = "QWERTYUIOPASDFGHJKLZXCVBNM";

// default character used in empty tiles
const EMPTY = "\u00A0";

class Puzzle {
    // given as a hint to the player to help solve the puzzle
    clue;

    // the solution to the puzzle
    solution;

    // a string indicating which letters in the solution are revealed
    letters;

    // HTML element displaying the clue
    clueElement;

    // HTML element displaying the solution
    solutionElement;

    // array of HTML elements containing the letters of the solution
    solutionTiles;

    constructor(clue, solution, letters) {
        this.clue     = clue.toUpperCase();
        this.solution = solution.toUpperCase();
        this.letters  = letters.toUpperCase();
    }

    setClueElement(clueElement) {
        this.clueElement = clueElement;
    }

    setSolutionElement(solutionElement) {
        this.solutionElement = solutionElement;
    }

    // load the puzzle clue into the clue element
    initializeClueElement() {
        this.clueElement.textContent = this.clue;
    }

    // set up the blank tiles in the solution element
    initializeSolutionElement() {
        this.solutionTiles = {};

        for (let i = 0; i < this.solution.length; i++) {

            // add a gap where there is a space in the solution
            if (this.solution[i].match(" ")) {
                this.solutionElement.insertAdjacentHTML("beforeend", "&emsp;");
            }

            // add a tile where there is a letter in the solution
            else if (this.solution[i].match("[A-Z]")) {
                this.solutionElement.insertAdjacentHTML("beforeend", "<span id=\"" + i.toString() + "\" class=\"tile tile-unsolved\"></span>");
                this.solutionTiles[i] = document.getElementById(i.toString());
                this.solutionTiles[i].textContent = EMPTY;

                // set the onclick function to reveal letters when the tile is clicked
                const puzzle = this;
                this.solutionTiles[i].addEventListener("click", () => {puzzle.addLetter(puzzle.solution[i]);});
            }

            // add a non-clickable character if it is neither a space nor a letter
            else {
                this.solutionElement.insertAdjacentHTML("beforeend", "<span id=\"" + i.toString() + "\"></span>");

                // set the character using textContent to avoid needing to escape it
                document.getElementById(i.toString()).textContent = this.solution[i];
            }

            // add a small space between elements
            this.solutionElement.insertAdjacentHTML("beforeend", "&hairsp;");
        }

        this.revealLetters();
    }

    // add a letter to the list of revealed letters
    addLetter(letter) {

        // check that the character is a simple letter and that it is not revealed
        if (letter.length === 1 && letter.match("[A-Z]") && this.letters.indexOf(letter) === -1) {
            this.letters += letter;
            this.revealLetters();
        }
    }

    // update tiles to reveal letters
    revealLetters() {
        for (let i = 0; i < this.solution.length; i++) {

            // reveal tiles which appear in the list of shown letters
            if (this.letters.indexOf(this.solution[i]) > -1 && this.solutionTiles[i] && this.solutionTiles[i].classList.contains("tile-unsolved")) {

                // update the content of the tile
                this.solutionTiles[i].textContent = puzzle.solution[i];

                // update the display of the tile
                this.solutionTiles[i].classList.remove("tile-unsolved");
                this.solutionTiles[i].classList.add("tile-solved");
            }
        }
    }

    // add a letter to the first hidden tile
    sketchLetter(letter) {

        // check that the character is a simple letter and that it is not revealed
        if (letter.length === 1 && letter.match("[A-Z]") && this.letters.indexOf(letter) === -1) {

            // find the first empty hidden tile
            for (let i = 0; i < this.solution.length; i++) {
                if (this.solutionTiles[i] && this.solutionTiles[i].classList.contains("tile-unsolved") && this.solutionTiles[i].textContent === EMPTY) {
                    this.solutionTiles[i].textContent = letter;
                    break;
                }
            }
        }
    }

    // delete the last sketched letter
    deleteLetter() {

        // find the last hidden tile with a letter on it
        for (let i = this.solution.length - 1; i >= 0; i--) {
            if (this.solutionTiles[i] && this.solutionTiles[i].classList.contains("tile-unsolved") && this.solutionTiles[i].textContent !== EMPTY) {
                this.solutionTiles[i].textContent = EMPTY;
                break;
            }
        }
    }

    // create a puzzle from an encoded string
    static fromEncodedString(encodedString) {
        let decodedString = atob(encodedString);
        let i = 0;

        // parse the clue length, solution length, and number of revealed letters
        let clueLength     = parseInt(decodedString.slice(i, i += MAX_DIGITS), RADIX);
        let solutionLength = parseInt(decodedString.slice(i, i += MAX_DIGITS), RADIX);
        let lettersLength  = parseInt(decodedString.slice(i, i += MAX_DIGITS), RADIX);

        // parse the clue, solution, and revealed letters
        let clue     = decodedString.slice(i, i += clueLength);
        let solution = decodedString.slice(i, i += solutionLength);
        let letters  = decodedString.slice(i, i += lettersLength);

        return new Puzzle(clue, solution, letters);
    }

    // encode the puzzle as a string
    static toEncodedString(puzzle) {
        let decodedString = "";

        // add the clue length, solution length, and number of revealed letters
        decodedString += puzzle.clue.length.toString(RADIX).padStart(MAX_DIGITS, "0");
        decodedString += puzzle.solution.length.toString(RADIX).padStart(MAX_DIGITS, "0");
        decodedString += puzzle.letters.length.toString(RADIX).padStart(MAX_DIGITS, "0");

        // add the clue, solution, and revealed letters
        decodedString += puzzle.clue;
        decodedString += puzzle.solution;
        decodedString += puzzle.letters;

        return btoa(decodedString);
    }
}

// load the puzzle from the search parameter or use the fallback
const searchParams = new URLSearchParams(window.location.search);
const puzzle = Puzzle.fromEncodedString(searchParams.get(SEARCH_PARAM_NAME) || "MzIxNzAyV0hFUkUgVE8gRElSRUNUIENPTVBMQUlOVFMgQUJPVVQgTkFUVVJBTCBESVNBU1RFUlNUQUxLIFRPIFRIRSBIQU5EIE9GIEdPREFH");

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

// get references to the elements displaying the clue and the solution
puzzle.setClueElement(document.getElementById("puzzle-clue"));
puzzle.setSolutionElement(document.getElementById("puzzle-solution"));

// initialize the puzzle display
puzzle.initializeClueElement();
puzzle.initializeSolutionElement();
