export function createHTML(element, wrapper) {
    if (typeof element === "string")
        wrapper.append(element);

    else {
        element.ref = document.createElement(element.tag);

        for (const style of element.styles)
            element.ref.classList.add(style);

        for (const child of element.children)
            createHTML(child, element.ref);

        wrapper.append(element.ref);
    }
}
