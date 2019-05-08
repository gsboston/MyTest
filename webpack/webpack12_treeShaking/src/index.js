// Tree Shaking 只支持 ES Module
// esmodule模块的引入底层是静态的引入方式
// commonJs是动态引入方式

import { add } from './math.js';

add(1, 7);

// 正常打包后，math中的方法都会被打包进来，尽管没有使用
// 使用tree shaking 就可以剔除没有使用的方法