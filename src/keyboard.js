// id and HTML unicode for the backspace key
const BACKSPACE_ID = "BACKSPACE";
const BACKSPACE_HTML = "&#x232B;";

// id and display for the submit button
const SUBMIT_ID = "ENTER";
const SUBMIT_HTML = "Submit";

// HTML for line breaks
const LINE_BREAK_HTML = "<br />";

export class Keyboard {
    // the arrangement of the keyboard
    #layout;

    // tiles displaying the keys
    #keyboardTiles;

    constructor(layout) {
        this.#layout = layout;
        this.#keyboardTiles = {};
    }

    // permanently block keys from being clicked or typed
    blockKeys(keys) {
        for (let i = 0; i < keys.length; i++) {
            if (this.#keyboardTiles[keys[i]]) {

                // update the display of the tile
                this.#keyboardTiles[keys[i]].classList.remove("tile-unsolved");
                this.#keyboardTiles[keys[i]].classList.add("tile-solved");

                // remove the tile from the dictionary of tiles
                this.#keyboardTiles[keys[i]] = undefined;
            }
        }
    }

    // create the key tiles for the on-screen keyboard
    initializeKeyboardElement(keyboardElement) {

        // iterate over every row in the layout
        for (let i = 0; i < this.#layout.length; i++) {

            // add a line break between rows of the keyboard
            keyboardElement.insertAdjacentHTML("beforeend", LINE_BREAK_HTML);

            // iterate over every key in the row
            for (let j = 0; j < this.#layout[i].length; j++) {
                const key = this.#layout[i][j];

                // create a tile for each key
                keyboardElement.insertAdjacentHTML("beforeend", `<span id="${key}" class="tile tile-large tile-unsolved">${key}</span>`);

                // save the reference to the tile
                this.#keyboardTiles[key] = document.getElementById(key);
            }
        }

        // add a special backspace tile
        keyboardElement.insertAdjacentHTML("beforeend", `<span id="${BACKSPACE_ID}" class="tile tile-x-large tile-unsolved">${BACKSPACE_HTML}</span>`);
        this.#keyboardTiles[BACKSPACE_ID] = document.getElementById(BACKSPACE_ID);

        // add a special submit button after a line break
        keyboardElement.insertAdjacentHTML("beforeend", LINE_BREAK_HTML);
        keyboardElement.insertAdjacentHTML("beforeend", `<span id="${SUBMIT_ID}" class="tile tile-xx-large tile-unsolved">${SUBMIT_HTML}</span>`);
        this.#keyboardTiles[SUBMIT_ID] = document.getElementById(SUBMIT_ID);
    }

    // create the event listeners for both the on-screen keyboard and keydown events
    initializeEventListeners(puzzle) {
        const keyboard = this;

        // iterate over every key in the layout
        for (const [key, tile] of Object.entries(this.#keyboardTiles)) {

            // add an event listener to each tile
            tile.addEventListener("click", () => { Keyboard.handleKeydown(keyboard, puzzle, key); });
        }

        // add an event listener to detect keydown events
        addEventListener("keydown", (e) => { Keyboard.handleKeydown(keyboard, puzzle, e.key.toUpperCase()); });

        // set the puzzle to block keys that are revealed
        puzzle.setTriggerOnReveal((keys) => { keyboard.blockKeys(keys); });

        // force the puzzle to trigger the function right away
        puzzle.revealLetter();
    }

    // handle a keydown event
    static handleKeydown(keyboard, puzzle, key) {
        if (keyboard.#keyboardTiles[key]) {

            // if the backspace key is pressed, delete a sketched letter from the puzzle
            if (key === BACKSPACE_ID) {
                puzzle.deleteLetter();
            }

            // if the submit button is pressed, submit the puzzle and block all keys
            else if (key === SUBMIT_ID) {
                keyboard.blockKeys(Object.getOwnPropertyNames(keyboard.#keyboardTiles));
                puzzle.submitAnswer();
            }

            // if any other key is pressed, sketch it in the puzzle
            else {
                puzzle.sketchLetter(key.toUpperCase());
            }
        }
    }
}
