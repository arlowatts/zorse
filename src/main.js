// maximum number of digits in the length of the clue or solution
const MAX_DIGITS = 2;

// radix used to encode the length of the clue and solution
const RADIX = 16;

// name of the search parameter used to store the puzzle
const SEARCH_PARAM_NAME = "q";

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
        for (let i = 0; i < this.solution.length; i++) {

            // add an empty space where there is a space in the solution
            if (this.solution[i].match(" ")) {
                this.solutionElement.insertAdjacentHTML("beforeend", "&emsp;");
            }

            // add a button where there is a letter in the solution
            else if (this.solution[i].match("[A-Z]")) {
                this.solutionElement.insertAdjacentHTML("beforeend", "<span id=\"" + i.toString() + "\" class=\"letter letter-unsolved\">_</span>");
            }

            // add a non-clickable character if it is neither a space nor a letter
            else {
                this.solutionElement.insertAdjacentHTML("beforeend", "<span id=\"" + i.toString() + "\"></span>");
                document.getElementById(i.toString()).textContent = this.solution[i];
            }

            // add a small space between elements
            this.solutionElement.insertAdjacentHTML("beforeend", "&hairsp;");
        }

        this.revealLetters();
    }

    // update tiles to reveal letters
    revealLetters() {
        for (let i = 0; i < this.solution.length; i++) {

            // reveal tiles which appear in the list of shown letters
            if (this.letters.indexOf(this.solution[i]) > -1) {
                const letter = document.getElementById(i.toString());

                // update the display and content of the tile
                if (letter.classList.contains("letter-unsolved")) {
                    letter.textContent = puzzle.solution[i];
                    letter.classList.remove("letter-unsolved");
                    letter.classList.add("letter-solved");
                }
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

// load the puzzle from the search parameter
const searchParams = new URLSearchParams(window.location.search);
const puzzle = Puzzle.fromEncodedString(searchParams.get(SEARCH_PARAM_NAME));

// get references to the elements displaying the clue and the solution
puzzle.setClueElement(document.getElementById("puzzle-clue"));
puzzle.setSolutionElement(document.getElementById("puzzle-solution"));

// initialize the puzzle display
puzzle.initializeClueElement();
puzzle.initializeSolutionElement();
