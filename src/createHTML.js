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

let GLOBAL_ID = 0;

// recursively create div elements matching the nested arrays
export function tileDisplay(element, classes, wrapper, refs = null, depth = 0) {

    if (typeof element === "string") {

        // insert the element as text
        wrapper.insertAdjacentText("beforeend", element);
    }

    else {
        const id = GLOBAL_ID++;

        // create the div corresponding to the element
        wrapper.insertAdjacentHTML("beforeend", `<div id="${id}"></div>`);
        const ref = document.getElementById(id);

        // add classes to the div by depth
        for (let i = 0; i < classes[depth].length; i++)
            ref.classList.add(classes[depth][i]);

        // add the ref to the array by depth
        if (refs)
            refs[depth].push(ref);

        // recurse on the element's children
        for (let i = 0; i < element.length; i++)
            tileDisplay(element[i], classes, ref, refs, depth + 1);
    }
}
