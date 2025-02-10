import * as puzzle from "./puzzle.js";

const STYLES_KEY = ["border", "tile", "key"];

// array of HTML elements to create on the page
export const elements = [
    { styles: ["hidden"], children: [
        { children: getKeyboardRow("QWERTYUIOP") },
        { children: getKeyboardRow("ASDFGHJKL") },
        { children: [
            { styles: ["large", "blank", ...STYLES_KEY] },
            ...getKeyboardRow("ZXCVBNM"),
            getKeyboardKey("\u232b", "BACKSPACE", ["large"]),
        ] },
        { children: [
            getKeyboardKey("Submit", "ENTER", ["x-large", "locked"]),
        ] },
    ] },
];

// dictionary of commonly used wrappers
const wrappers = {
    main: elements[0],
    backspace: elements[0].children[2].children[8],
    enter: elements[0].children[3].children[0],
};

// initialize event listeners on the HTML elements
export function init() {

    // detect key presses on the physical keyboard
    addEventListener("keydown", handleKeyDown);

    // show the HTML elements
    wrappers.main.ref.classList.remove("hidden");
}

// hide the HTML elements
export function hide() {
    wrappers.main.ref.classList.add("hidden");
}

// access a key by its string
export function getKey(character) {
    for (const row of wrappers.main.children)
        for (const key of row.children)
            if (key.data === character)
                return key;
}

// change the text color of a key to gray
export function lockKey(key) {
    key.ref.classList.add("locked");
}

// restore the text color of a key
export function unlockKey(key) {
    key.ref.classList.remove("locked");
}

// generate a row of keyboard keys from an iterable
function getKeyboardRow(characters) {
    return Array.from(characters, (character) => getKeyboardKey(character, character.toUpperCase()));
}

// generate a single keyboard key
function getKeyboardKey(display, data, styles = []) {
    return {
        styles: STYLES_KEY.concat(styles),
        children: [display],
        data: data,
        listeners: {
            pointerdown: (e) => {
                e.target.classList.add("pressed");
                handleKeyDown({ key: data });
            },
            pointerup: (e) => {
                e.target.classList.remove("pressed");
            },
        },
    };
}

// respond to keydown events and key presses on the virtual keyboard
function handleKeyDown(e) {
    if (!e.ctrlKey) {
        const key = e.key.toUpperCase();

        if (key === wrappers.enter.data)
            puzzle.submit();
        else if (key === wrappers.backspace.data)
            puzzle.removeLetter();
        else
            puzzle.addLetter(key);
    }
}
