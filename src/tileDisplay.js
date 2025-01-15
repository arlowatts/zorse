let id = 0;

// recursively create div elements matching the nested arrays
export function tileDisplay(wrapper, elements, classes, refs) {

    for (let i = 0; i < elements.length; i++) {

        if (typeof elements[i] === "string") {

            // if the element is a string, insert it directly
            wrapper.insertAdjacentText("beforeend", elements[i]);
        }
        else {

            // create the div corresponding to the element
            wrapper.insertAdjacentHTML("beforeend", `<div id="${id}"></div>`);
            const ref = document.getElementById(id++);

            // add the ref to the layered array
            refs[0].push(ref);

            // add classes to the div
            for (let j = 0; j < classes[0].length; j++) {
                ref.classList.add(classes[0][j]);
            }

            // recurse on the element's children
            tileDisplay(ref, elements[i], classes.slice(1), refs.slice(1));
        }
    }
}
