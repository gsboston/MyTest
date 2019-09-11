// 用法 new Compile(el, vm)

class Compile {
  constructor(el, vm) {
    // 要遍历的宿主节点
    this.$el = document.querySelector(el);

    this.$vm = vm;

    // 编译
    if (this.$el) {
      // 转换内部内容为片段Fragment
      this.$fragment = this.node2Fragment(this.$el);
      // 执行编译
      this.compile(this.$fragment);
      // 将编译完的html结果追加至$el
      this.$el.appendChild(this.$fragment);
    }
  }

  // 将宿主元素中代码片段拿出来遍历，这样做比较高效
  node2Fragment(el) {
    const frag = document.createDocumentFragment();
    // 将el中所有子元素搬家至frag中
    let child;
    while ((child = el.firstChild)) {
      frag.appendChild(child);
    }
    return frag;
  }
  // 编译过程
  compile(el) {
    const childNodes = el.childNodes;
    Array.from(childNodes).forEach(node => {
      // 类型判断
      // 元素
      if (this.isElement(node)) {
        // 获取节点属性
        const nodeAttrs = node.attributes;
        Array.from(nodeAttrs).forEach(attr => {
          const attrName = attr.name; //属性名
          const exp = attr.value; // 属性值
          // 如果是指令 k-text
          if (this.isDirective(attrName)) {
            const dir = attrName.substring(2);
            // 执行指令
            this[dir] && this[dir](node, this.$vm, exp);
          }
          // 如果是事件
          if (this.isEvent(attrName)) {
            const dir = attrName.substring(1); // @click
            this.eventHandler(node, this.$vm, exp, dir);
          }
        });
      } else if (this.isInterpolation(node)) {
        // 文本
        this.compileText(node);
      }

      // 递归子节点
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node);
      }
    });
  }

  // 插值文本
  compileText(node) {
    this.update(node, this.$vm, RegExp.$1, "text");
  }

  // text指令
  text(node, vm, exp) {
    this.update(node, vm, exp, "text");
  }

  textUpdater(node, value) {
    node.textContent = value;
  }

  // 双绑指令
  model(node, vm, exp) {
    // 指定input的value属性
    this.update(node, vm, exp, "model");

    // 视图对模型响应
    node.addEventListener("input", e => {
      vm[exp] = e.target.value;
    });
  }

  modelUpdater(node, value) {
    node.value = value;
  }

  // html指令
  html(node, vm, exp) {
    this.update(node, vm, exp, "html");
  }

  htmlUpdater(node, value) {
    node.innerHTML = value;
  }

  // 更新函数
  update(node, vm, exp, dir) {
    const updaterFn = this[dir + "Updater"];
    // 初始化
    updaterFn && updaterFn(node, vm[exp]);
    // 依赖收集
    new Watcher(vm, exp, function (value) {
      updaterFn && updaterFn(node, value);
    });
  }

  // 事件处理器
  eventHandler(node, vm, exp, dir) {
    // @click="onClick"
    let fn = vm.$options.methods && vm.$options.methods[exp];
    if (dir && fn) {
      node.addEventListener(dir, fn.bind(vm));
    }
  }

  isDirective(attr) {
    return attr.indexOf("k-") == 0;
  }
  isEvent(attr) {
    return attr.indexOf("@") == 0;
  }
  isElement(node) {
    return node.nodeType === 1;
  }
  // 插值文本
  isInterpolation(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }
}