var globalFs;

function fontSize() {
    var view_width = document.getElementsByTagName('html')[0].getBoundingClientRect().width;
    var _html = document.getElementsByTagName('html')[0];
    var fs = view_width > 768 ? 100 * 768 / 375 : view_width * 100 / 375;
    globalFs = fs;
    _html.style.fontSize = fs + 'px'
}

window.onresize = function () {
    fontSize();
}
fontSize();