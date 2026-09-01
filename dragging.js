// let dom;
//
// window.addEventListener("mousedown", mouseDown)
// window.addEventListener("mouseup", mouseUp)
//
// function mouseDown(e) {
//     // initialise object
//     if (e.target.tagName === "svg") {
//         dom = e.target.parentElement;
//         dom.addEventListener("mousemove", mouseMove);
//     } else if (e.target.tagName === "path") {
//         dom = e.target.parentElement.parentElement;
//         dom.addEventListener("mousemove", mouseMove);
//     } else if (e.target.classList.contains("bored")) {
//         dom = e.target;
//         dom.addEventListener("mousemove", mouseMove);
//     }
//     console.log("adding " + dom);
// }
//
// function mouseMove(e) {
//     // drag
//     dom.style.left = e.clientX + "px";
//     dom.style.top = e.clientY + "px";
// }
//
// function mouseUp(e) {
//     // drop
//     if (dom === null || dom === undefined) return;
//
//     console.log("removign")
//
//     dom.removeEventListener("mousemove", mouseMove);
//     dom = null;
// }