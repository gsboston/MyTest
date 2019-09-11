class Compile {
    constructor(el, vm) {
        this.$el = document.querySelector(el);
        this.$vm = vm;

        if (this.$el) {
            this.$fragment = this.node2Fragment(this.$el);
            this.compile(this.$fragment);
            this.$el.appendChild(this.$fragment);
        }
    }

    node2Fragment(el) {
        const frag = document.createDocumentFragment();

        let child;
        while ((child = el.firstChild)) {
            frag.appendChild(child);
        }
        return frag;
    }

    compile(el) {
        const childNodes = el.childNodes;
        Array.from(childNodes).forEach(node => {
            if (this.isElement(node)) {
                const nodeAttrs = node.attributes;
                Array.from(nodeAttrs).forEach(attr => {
                    const attrName = attr.name;
                    const attrVal = attr.value;
                    if (this.isDirective(attrName)) {
                        const dirName = attrName.substring(3);
                        this[dirName] && this[dirName](node, this.$vm, attrVal);
                    } else if (this.isEvent(attrName)) {
                        const eventName = attrName.substring(1);
                        this.eventHandler(node, this.$vm, attrVal, eventName);
                    }
                })
            } else if (this.isInterpolation(node)) {
                this.compileText(node);
            }

            if (node.childNodes && node.childNodes.length > 0) {
                this.compile(node);
            }
        })
    }

    update(node, vm, val, dir) {
        const updateFn = this[dir + 'Updater'];
        updateFn && updateFn(node, vm[val]);

        new Watcher(vm, val, function (value) {
            updateFn && updateFn(node, value);
        });
    }

    compileText(node) {
        this.update(node, this.$vm, RegExp.$1, "text");
    }

    text(node, vm, attrVal) {
        this.update(node, vm, attrVal, "text");
    }
    textUpdater(node, value) {
        console.log('set:' + value)
        node.textContent = value;
    }

    model(node, vm, attrVal) {
        this.update(node, vm, attrVal, "model");

        node.addEventListener('input', function (e) {
            vm[attrVal] = e.target.value;
        })
    }

    modelUpdater(node, value) {
        node.value = value;
    }

    html(node, vm, attrVal) {
        this.update(node, vm, attrVal, "html");
    }
    htmlUpdater(node, value) {
        node.innerHTML = value;
    }

    eventHandler(node, vm, val, event) {
        let fn = vm.$options.methods && vm.$options.methods[val];
        if (event && fn)
            node.addEventListener(event, fn.bind(vm))
    }

    isDirective(attr) {
        return attr.indexOf('my-') === 0;
    }

    isEvent(attr) {
        return attr.indexOf('@') === 0;
    }

    isElement(node) {
        return node.nodeType === 1;
    }

    isInterpolation(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }
}