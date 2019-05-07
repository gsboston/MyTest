// import './style.css';
// var btn = document.createElement('button');
// btn.innerHTML = '新增';
// document.body.appendChild(btn);

// btn.onclick = function() {
// 	var div = document.createElement('div');
// 	div.innerHTML = 'item';
// 	document.body.appendChild(div);
// }

import counter from './counter';
import number from './number';

counter();
number();


// 在引入css代码时，使用hmr也需要以下步骤，不过在cssloader中已经帮我们实现了
// vueloader中也实现了

// 如果当前项目开启了hmr功能
if(module.hot) {
	module.hot.accept('./number', () => {
		document.body.removeChild(document.getElementById('number'));
		number();
	})
}
