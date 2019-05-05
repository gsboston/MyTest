// es Module
import avatar from './avatar.jpg';
// import style from './index.css';
import style from './index.scss'; // 如此引入文件会作用在当前页面的所有标签，相当于全局样式
import createAvatar from './createAvatar';
import f from './font_index.scss';


var root = document.getElementById('root');
// font
root.innerHTML = `<div class="${f.iconfont} ${f['icon-changjingguanli']}"></div>`;
// font

createAvatar();

var img = new Image();
img.src = avatar;
img.classList.add(style.avatar);

root.append(img);
