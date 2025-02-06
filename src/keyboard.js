import { tileDisplay } from "./createHTML.js";

const layout = [
    [["Q"], ["W"], ["E"], ["R"], ["T"], ["Y"], ["U"], ["I"], ["O"], ["P"]],
    [["A"], ["S"], ["D"], ["F"], ["G"], ["H"], ["J"], ["K"], ["L"]],
    [["Z"], ["X"], ["C"], ["V"], ["B"], ["N"], ["M"], ["\u232b"]],
    [["Submit"]],
];

const layoutFlat = [
    "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P",
    "A", "S", "D", "F", "G", "H", "J", "K", "L",
    "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE",
    "ENTER",
];

const cssClasses = [[], [], ["border", "tile", "key"]];

const targets = [];

const refs = [[], [], []];

export function initializeDisplay(wrapper) {
    tileDisplay(layout, cssClasses, wrapper, refs);

    refs[2][26].style.width = "20%";
    refs[2][27].style.width = "100%";
}

export function clearDisplay() {
    refs[0][0].remove();

    for (let i = 0; i < refs.length; i++)
        refs[i] = [];
}

export function lockKey(key) {
    if (layoutFlat.includes(key)) {
        const index = layoutFlat.indexOf(key);

        refs[2][index].classList.add("locked");
    }
}

export function unlockKey(key) {
    if (layoutFlat.includes(key)) {
        const index = layoutFlat.indexOf(key);

        refs[2][index].classList.remove("locked");
    }
}

export function initializeEventListeners() {
    addEventListener("keydown", (e) => { if (!e.ctrlKey) keyDown(e.key.toUpperCase()); });

    for (let i = 0; i < layoutFlat.length; i++) {
        refs[2][i].addEventListener("pointerdown", (e) => {
            e.target.style["background-color"] = "lightgray";
            keyDown(layoutFlat[i]);
        });

        refs[2][i].addEventListener("pointerup", (e) => {
            e.target.style["background-color"] = "transparent";
        });
    }
}

export function addTarget(target) {
    targets.push(target);
}

function keyDown(key) {
    if (layoutFlat.includes(key)) {
        const index = layoutFlat.indexOf(key);

        for (let i = 0; i < targets.length; i++) {
            if (index === 27) {
                targets[i].submit();
                document.activeElement.blur();
            }
            else if (index === 26)
                targets[i].removeLetter();
            else
                targets[i].addLetter(key);
        }
    }
}
