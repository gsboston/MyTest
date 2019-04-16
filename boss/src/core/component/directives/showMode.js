export default {
    bind (el, binding, vnode) {
        // setTimeout(() => {
            let input = el.querySelector("input");
            input.setAttribute("disabled", "disabled");
            input.style.cursor = "default";
            input.style.backgroundColor = "white";
            input.style.borderColor = "white";
        // }, 1);
    },
};