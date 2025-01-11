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

    constructor(clue, solution, letters) {
        this.clue     = clue.toUpperCase();
        this.solution = solution.toUpperCase();
        this.letters  = letters.toUpperCase();
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
const clueLine = document.getElementById("puzzle-clue");
const solutionLine = document.getElementById("puzzle-solution");

// set the clue element to display the puzzle's clue
clueLine.textContent = puzzle.clue;

// set the solution element to display the puzzle's solution
for (let i = 0; i < puzzle.solution.length; i++) {

    // add an empty space where there is a space in the solution
    if (puzzle.solution[i].match(" ")) {
        solutionLine.insertAdjacentHTML("beforeend", "&ensp;");
    }

    // add a button where there is a letter in the solution
    else if (puzzle.solution[i].match("[A-Z]")) {
        solutionLine.insertAdjacentHTML("beforeend", "<div class=\"letter-unsolved\" id=\"" + i.toString() + "\">_</div>");
    }

    // add a non-clickable character if it is neither a space nor a letter
    else {
        solutionLine.insertAdjacentHTML("beforeend", "<p style=\"display: inline;\" id=\"" + i.toString() + "\"></p>");
    }

    // add a small space between elements
    solutionLine.insertAdjacentHTML("beforeend", "&hairsp;");

    // display the character if it has been revealed or if it is not a letter or a space
    if (puzzle.letters.indexOf(puzzle.solution[i]) > -1 || !puzzle.solution[i].match("[ A-Z]")) {
        document.getElementById(i.toString()).textContent = puzzle.solution[i];
    }
}
