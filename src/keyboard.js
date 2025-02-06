import { createHTML } from "./createHTML.js";

const STYLES_KEY = ["border", "tile", "key"];

const elements = { tag: "div", styles: [], children: [
    { tag: "div", styles: [], children: [
        { tag: "div", styles: STYLES_KEY, children: ["Q"], data: "Q" },
        { tag: "div", styles: STYLES_KEY, children: ["W"], data: "W" },
        { tag: "div", styles: STYLES_KEY, children: ["E"], data: "E" },
        { tag: "div", styles: STYLES_KEY, children: ["R"], data: "R" },
        { tag: "div", styles: STYLES_KEY, children: ["T"], data: "T" },
        { tag: "div", styles: STYLES_KEY, children: ["Y"], data: "Y" },
        { tag: "div", styles: STYLES_KEY, children: ["U"], data: "U" },
        { tag: "div", styles: STYLES_KEY, children: ["I"], data: "I" },
        { tag: "div", styles: STYLES_KEY, children: ["O"], data: "O" },
        { tag: "div", styles: STYLES_KEY, children: ["P"], data: "P" },
    ] },
    { tag: "div", styles: [], children: [
        { tag: "div", styles: STYLES_KEY, children: ["A"], data: "A" },
        { tag: "div", styles: STYLES_KEY, children: ["S"], data: "S" },
        { tag: "div", styles: STYLES_KEY, children: ["D"], data: "D" },
        { tag: "div", styles: STYLES_KEY, children: ["F"], data: "F" },
        { tag: "div", styles: STYLES_KEY, children: ["G"], data: "G" },
        { tag: "div", styles: STYLES_KEY, children: ["H"], data: "H" },
        { tag: "div", styles: STYLES_KEY, children: ["J"], data: "J" },
        { tag: "div", styles: STYLES_KEY, children: ["K"], data: "K" },
        { tag: "div", styles: STYLES_KEY, children: ["L"], data: "L" },
    ] },
    { tag: "div", styles: [], children: [
        { tag: "div", styles: STYLES_KEY, children: ["Z"], data: "Z" },
        { tag: "div", styles: STYLES_KEY, children: ["X"], data: "X" },
        { tag: "div", styles: STYLES_KEY, children: ["C"], data: "C" },
        { tag: "div", styles: STYLES_KEY, children: ["V"], data: "V" },
        { tag: "div", styles: STYLES_KEY, children: ["B"], data: "B" },
        { tag: "div", styles: STYLES_KEY, children: ["N"], data: "N" },
        { tag: "div", styles: STYLES_KEY, children: ["M"], data: "M" },
        { tag: "div", styles: STYLES_KEY, children: ["\u232b"], data: "BACKSPACE" },
    ] },
    { tag: "div", styles: [], children: [
        { tag: "div", styles: STYLES_KEY, children: ["Submit"], data: "ENTER" },
    ] },
] };

const backspaceWrapper = elements.children[2].children[7];
const enterWrapper = elements.children[3].children[0];

const targets = [];

export function initializeDisplay(wrapper) {
    createHTML(elements, wrapper);

    backspaceWrapper.ref.style.width = "20%";
    enterWrapper.ref.style.width = "100%";
}

export function clearDisplay() {
    elements.ref.remove();
}

export function lockKey(key) {
    for (const rowWrapper of elements.children)
        for (const keyWrapper of rowWrapper.children)
            if (keyWrapper.data === key)
                keyWrapper.ref.classList.add("locked");
}

export function unlockKey(key) {
    for (const rowWrapper of elements.children)
        for (const keyWrapper of rowWrapper.children)
            if (keyWrapper.data === key)
                keyWrapper.ref.classList.remove("locked");
}

export function initializeEventListeners() {
    addEventListener("keydown", (e) => {
        if (!e.ctrlKey)
            for (const rowWrapper of elements.children)
                for (const keyWrapper of rowWrapper.children)
                    if (keyWrapper.data === e.key.toUpperCase())
                        handleKeyDown(keyWrapper);
    });

    for (const rowWrapper of elements.children) {
        for (const keyWrapper of rowWrapper.children) {
            keyWrapper.ref.addEventListener("pointerdown", () => {
                keyWrapper.ref.classList.add("pressed");
                handleKeyDown(keyWrapper);
            });

            keyWrapper.ref.addEventListener("pointerup", () => {
                keyWrapper.ref.classList.remove("pressed");
            });
        }
    }
}

export function addTarget(target) {
    targets.push(target);
}

function handleKeyDown(keyWrapper) {
    for (const target of targets) {
        if (keyWrapper === enterWrapper) {
            target.submit();
            document.activeElement.blur();
        }
        else if (keyWrapper === backspaceWrapper)
            target.removeLetter();
        else
            target.addLetter(keyWrapper.data);
    }
}
