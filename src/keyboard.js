// id and HTML unicode for the backspace key
const BACKSPACE_ID = "Backspace";
const BACKSPACE_HTML = "&#x232B;";

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
    }

    // create the event listeners for both the on-screen keyboard and keydown events
    initializeEventListeners(puzzle) {

        // iterate over every key in the layout
        for (let i = 0; i < this.#layout.length; i++) {
            for (let j = 0; j < this.#layout[i].length; j++) {
                const key = this.#layout[i][j];

                // add an event listener to sketch a letter when the tile is clicked
                this.#keyboardTiles[key].addEventListener("click", () => { puzzle.sketchLetter(key); });
            }
        }

        // add an event listener for the special backspace key
        this.#keyboardTiles[BACKSPACE_ID].addEventListener("click", () => { puzzle.deleteLetter(); });

        // add an event listener to sketch a letter when a key is pressed
        addEventListener("keydown", (e) => {

            // check that the control key is not pressed and that the key has a tile
            if (!e.ctrlKey && (this.#keyboardTiles[e.key] || this.#keyboardTiles[e.key.toUpperCase()])) {
                puzzle.sketchLetter(e.key.toUpperCase());
            }

            // add a condition for the special backspace key
            if (!e.ctrlKey && e.key === BACKSPACE_ID && this.#keyboardTiles[BACKSPACE_ID]) {
                puzzle.deleteLetter();
            }
        });
    }
}
