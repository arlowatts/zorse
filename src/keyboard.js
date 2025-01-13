// id and HTML unicode for the backspace key
const BACKSPACE_ID = "Backspace";
const BACKSPACE_HTML = "&#x232B;";

// id and display for the submit button
const SUBMIT_ID = "Enter";
const SUBMIT_HTML = "&emsp;Submit&emsp;";

export class Keyboard {
    // the arrangement of the keyboard
    #layout;

    // tiles displaying the keys
    #keyboardTiles;

    constructor(layout) {
        this.#layout = layout;
        this.#keyboardTiles = {};
    }

    // create the key tiles for the on-screen keyboard
    initializeKeyboardElement(keyboardElement) {

        // iterate over every key in the layout
        for (let i = 0; i < this.#layout.length; i++) {

            // add a line break between rows of the keyboard
            keyboardElement.insertAdjacentHTML("beforeend", "<br />");

            for (let j = 0; j < this.#layout[i].length; j++) {
                const key = this.#layout[i][j];

                // create a tile for each key
                keyboardElement.insertAdjacentHTML("beforeend", `<span id="${key}" class="tile tile-unsolved">${key}</span>`);

                // save the reference to the tile
                this.#keyboardTiles[key] = document.getElementById(key);
            }
        }

        // add a special backspace tile
        keyboardElement.insertAdjacentHTML("beforeend", `<span id="${BACKSPACE_ID}" class="tile tile-unsolved" style="width: auto;">${BACKSPACE_HTML}</span>`);

        // save the reference to the backspace tile
        this.#keyboardTiles[BACKSPACE_ID] = document.getElementById(BACKSPACE_ID);

        // add a special submit button after a line break
        keyboardElement.insertAdjacentHTML("beforeend", "<br />");
        keyboardElement.insertAdjacentHTML("beforeend", `<span id="${SUBMIT_ID}" class="tile tile-unsolved" style="width: auto;">${SUBMIT_HTML}</span>`);

        // save the reference to the submit button
        this.#keyboardTiles[SUBMIT_ID] = document.getElementById(SUBMIT_ID);
    }

    // create the event listeners for both the on-screen keyboard and keydown events
    initializeEventListeners(puzzle) {

        // set the puzzle to block keys that are revealed
        const keyboard = this;
        puzzle.setTriggerOnReveal((keys) => { keyboard.blockKeys(keys); });
        puzzle.revealLetter();

        // iterate over every key in the layout
        for (let i = 0; i < this.#layout.length; i++) {
            for (let j = 0; j < this.#layout[i].length; j++) {
                const key = this.#layout[i][j];

                // add an event listener to sketch a letter when the tile is clicked
                const keyboard = this;

                if (this.#keyboardTiles[key]) {
                    this.#keyboardTiles[key].addEventListener("click", () => {
                        if (keyboard.#keyboardTiles[key]) {
                            puzzle.sketchLetter(key);
                        }
                    });
                }
            }
        }

        // add an event listener for the special backspace key
        this.#keyboardTiles[BACKSPACE_ID].addEventListener("click", () => { puzzle.deleteLetter(); });

        // add an event listened for the submit button
        this.#keyboardTiles[SUBMIT_ID].addEventListener("click", () => {
            if (keyboard.#keyboardTiles[SUBMIT_ID]) {
                puzzle.submitAnswer();
                keyboard.blockKeys([SUBMIT_ID]);
            }
        });

        // add an event listener to sketch a letter when a key is pressed
        addEventListener("keydown", (e) => {
            if (!e.ctrlKey) {

                // add a condition for the special backspace key
                if (e.key === BACKSPACE_ID && this.#keyboardTiles[BACKSPACE_ID]) {
                    puzzle.deleteLetter();
                }

                // add a condition for the submit button
                else if (e.key === SUBMIT_ID && this.#keyboardTiles[SUBMIT_ID]) {
                    puzzle.submitAnswer();
                    this.blockKeys([SUBMIT_ID]);
                }

                // check that the key has a tile
                else if (this.#keyboardTiles[e.key] || this.#keyboardTiles[e.key.toUpperCase()]) {
                    puzzle.sketchLetter(e.key.toUpperCase());
                }
            }
        });
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
}
