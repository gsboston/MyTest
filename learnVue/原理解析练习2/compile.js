class Compile {
    constructor(el, vm) {
        this.$el = document.querySelector(el);
        this.$vm = vm;
        console.log(this.$el)
        if (this.$el) {
            this.$fragment = this.node2Fragment(this.$el);
            console.log(this.$fragment)
            this.compile(this.$fragment);
            this.$el.appendChild(this.$fragment);
        }
    }

    node2Fragment(el) {
        const frag = document.createDocumentFragment();

        let child;
        while (child = el.firstChild) {
            frag.appendChild(child);
        }

        return frag;
    }

    compile(frag) {
        const nodes = frag.childNodes;
       
        nodes.forEach(node => {
            if (this.isElement(node)) {
                const attrs = node.attributes;
                console.log(attrs, Array.from(attrs));
                Array.from(attrs).forEach(attr => {
                    const attrName = attr.name;
                    const attrValue = attr.value;

                    if (this.isEvent(attrName)) {
                        this.eventHandler(node, this.$vm, attrName.substring(1), attrValue);
                    } else if (this.isDireactive(attrName)) {
                        this[attrName.substring(3)] && this[attrName.substring(3)](node, attrValue);
                    }
                })
            } else if (this.isText(node)) {
                this.compileText(node);
            }

            if (node.childNodes && node.childNodes.length > 0) {
                this.compile(node);
            }
        })
    }

    compileText(node) {
        this.update(node, this.$vm, RegExp.$1, 'text');
    }

    text(node, value) {
        this.update(node, this.$vm, value, 'text');
    }
    textUpdater(node, value) {
        node.textContent = value;
    }
    html(node, value) {
        this.update(node, this.$vm, value, 'html');
    }
    htmlUpdater(node, value) {
        node.innerHTML = value;
    }
    model(node, value) {
        this.update(node, this.$vm, value, 'model');

        node.addEventListener('input', e => {
            this.$vm[value] = e.target.value;
        })
    }
    modelUpdater(node, value) {
        node.value = value;
    }

    update(node, vm, exp, dir) {
        const updateFn = this[dir + 'Updater'];
        updateFn && updateFn(node, vm[exp])

        new Watcher(vm, exp, function () {
            updateFn && updateFn(node, vm[exp]);
        })

    }

    eventHandler(node, vm, aName, aValue) {
        const fn = vm.$options.methods && vm.$options.methods[aValue];

        if (aName && fn)
            node.addEventListener(aName, fn.bind(vm))
    }

    isEvent(attrName) {
        return attrName.indexOf('@') === 0;
    }
    isDireactive(attrName) {
        return attrName.indexOf('my-') === 0;
    }
    isElement(node) {
        return node.nodeType === 1;
    }
    isText(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
    }
}