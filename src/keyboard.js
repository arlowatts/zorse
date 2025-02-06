const STYLES_KEY = ["border", "tile", "key"];

export const elements = { children: [
    { children: [
        { styles: STYLES_KEY, children: ["Q"], data: "Q" },
        { styles: STYLES_KEY, children: ["W"], data: "W" },
        { styles: STYLES_KEY, children: ["E"], data: "E" },
        { styles: STYLES_KEY, children: ["R"], data: "R" },
        { styles: STYLES_KEY, children: ["T"], data: "T" },
        { styles: STYLES_KEY, children: ["Y"], data: "Y" },
        { styles: STYLES_KEY, children: ["U"], data: "U" },
        { styles: STYLES_KEY, children: ["I"], data: "I" },
        { styles: STYLES_KEY, children: ["O"], data: "O" },
        { styles: STYLES_KEY, children: ["P"], data: "P" },
    ] },
    { children: [
        { styles: STYLES_KEY, children: ["A"], data: "A" },
        { styles: STYLES_KEY, children: ["S"], data: "S" },
        { styles: STYLES_KEY, children: ["D"], data: "D" },
        { styles: STYLES_KEY, children: ["F"], data: "F" },
        { styles: STYLES_KEY, children: ["G"], data: "G" },
        { styles: STYLES_KEY, children: ["H"], data: "H" },
        { styles: STYLES_KEY, children: ["J"], data: "J" },
        { styles: STYLES_KEY, children: ["K"], data: "K" },
        { styles: STYLES_KEY, children: ["L"], data: "L" },
    ] },
    { children: [
        { styles: STYLES_KEY, children: ["Z"], data: "Z" },
        { styles: STYLES_KEY, children: ["X"], data: "X" },
        { styles: STYLES_KEY, children: ["C"], data: "C" },
        { styles: STYLES_KEY, children: ["V"], data: "V" },
        { styles: STYLES_KEY, children: ["B"], data: "B" },
        { styles: STYLES_KEY, children: ["N"], data: "N" },
        { styles: STYLES_KEY, children: ["M"], data: "M" },
        { styles: STYLES_KEY.concat("large"), children: ["\u232b"], data: "BACKSPACE" },
    ] },
    { children: [
        { styles: STYLES_KEY.concat("x-large"), children: ["Submit"], data: "ENTER" },
    ] },
] };

const backspaceWrapper = elements.children[2].children[7];
const enterWrapper = elements.children[3].children[0];

const targets = [];

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
