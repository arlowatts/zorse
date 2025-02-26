import * as puzzle from "./puzzle.js";
import * as keyboard from "./keyboard.js";
import * as creator from "./creator.js";

addEventListener("load", main);

// array of HTML elements to create on the page
const elements = [
    { tag: "header", children: [
        { styles: ["link"], children: ["How to play"], listeners: { "click": gotoTutorial } },
        { styles: ["link"], children: ["Create"], listeners: { "click": gotoCreate } },
        { styles: ["link", "hidden"], children: ["Share"], listeners: { "click": puzzle.shareURL } },
    ] },
    { tag: "main", children: [
        { },
        ...creator.elements,
        ...puzzle.elements,
        { },
        ...keyboard.elements,
    ] },
];

// dictionary of commonly used wrappers
const wrappers = {
    share: elements[0].children[2],
};

function main() {

    // decode the puzzle from the search parameters
    const searchParams = new URLSearchParams(location.search);
    const encodedPuzzle = puzzle.PARAM_NAMES.map((paramName) => searchParams.get(paramName) || "");
    puzzle.decode(encodedPuzzle);

    // create the HTML elements
    createHTML(elements, document.body);

    // if the puzzle is incomplete, display the creator screen
    if (!encodedPuzzle[1])
        creator.init();

    // otherwise, display the puzzle and keyboard
    else {
        puzzle.init();
        keyboard.init();

        // show the share link
        wrappers.share.ref.classList.remove("hidden");
    }
}

// create HTML elements and insert them into the page
function createHTML(elements, wrapper) {

    // iterate over all elements in the array
    for (const element of elements) {

        // insert text directly
        if (typeof element === "string")
            wrapper.append(element);

        // recursively insert HTML elements
        else {

            // create the reference to the new element
            element.ref = document.createElement(element.tag || "div");

            // apply the element's styles
            if (element.styles)
                for (const style of element.styles)
                    element.ref.classList.add(style);

            // add the element's event listeners
            if (element.listeners)
                for (const listener in element.listeners)
                    element.ref.addEventListener(listener, element.listeners[listener]);

            // recurse on the element's children
            if (element.children)
                createHTML(element.children, element.ref);

            // insert the element in the wrapper
            wrapper.append(element.ref);
        }
    }
}

// navigate to the tutorial page
function gotoTutorial() {
    location = location.origin + location.pathname + "tutorial/";
}

// navigate to the create page
function gotoCreate() {
    location = location.origin + location.pathname;
}
