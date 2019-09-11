class MyVue {
    constructor(options) {
        this.$options = options;
        this.$data = options.data;

        this.observe(this.$data);

        new Compile(this.$options.el, this);
    }

    observe(data) {
        if (!data || typeof data !== 'object') {
            return;
        }
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key]);
            this.proxyData(key);
        })
    }

    defineReactive(data,key,value){
        this.observe(value);

        const dep=new Dep();
        Object.defineProperty(data,key,{
            get(){
                Dep.target && dep.addDep(Dep.target);
                return value;
            },
            set(newValue){
                if(newValue===value) return;
                value=newValue;
                dep.notify();
            }
        })
    }

    proxyData(key) {
        Object.defineProperty(this, key, {
            get() {
                return this.$data[key];
            },
            set(newValue) {
                this.$data[key] = newValue;
            }
        })
    }

}

class Dep {
    constructor() {
        this.deps = [];
    }

    addDep(dep) {
        this.deps.push(dep);
    }

    notify() {
        this.deps.forEach(dep => dep.update());
    }
}

class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm;
        this.key = key;
        this.cb = cb;

        Dep.target = this;
        this.vm[this.key];
        Dep.target = null;
    }

    update() {
        this.cb.call(this.vm, this.vm[this.key]);
    }
}