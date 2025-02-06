// create HTML elements and insert them into the wrapper
export function createHTML(element, wrapper) {

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

        // recurse on the element's children
        if (element.children)
            for (const child of element.children)
                createHTML(child, element.ref);

        // insert the element in the wrapper
        wrapper.append(element.ref);
    }
}
