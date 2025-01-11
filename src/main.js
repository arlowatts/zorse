const MAX_DIGITS = 2;

class Puzzle {
    #clue;
    #solution;
    #letters;

    constructor(clue, solution, letters) {
        this.clue     = clue;
        this.solution = solution;
        this.letters  = letters;
    }

    static fromEncodedString(encodedString) {
        let decodedString = atob(encodedString);

        let i = 0;

        let clueLength     = Number(decodedString.slice(i, i += MAX_DIGITS));
        let solutionLength = Number(decodedString.slice(i, i += MAX_DIGITS));
        let lettersLength  = Number(decodedString.slice(i, i += MAX_DIGITS));

        let clue     = decodedString.slice(i, i += clueLength);
        let solution = decodedString.slice(i, i += solutionLength);
        let letters  = decodedString.slice(i, i += lettersLength);

        return new Puzzle(clue, solution, letters);
    }

    static toEncodedString(puzzle) {
        let decodedString = "";

        decodedString += puzzle.clue.length;
        decodedString += puzzle.solution.length;
        decodedString += puzzle.letters.length;

        decodedString += puzzle.clue;
        decodedString += puzzle.solution;
        decodedString += puzzle.letters;

        return btoa(decodedString);
    }
}

let p = new Puzzle("this is the clue", "this is the solution", "these are the letters");
console.log(p);

let s = Puzzle.toEncodedString(p)
console.log(e);

let q = Puzzle.fromEncodedString(s);
console.log(q);
