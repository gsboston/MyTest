/**
 * Created with JetBrains PhpStorm.
 * User: xuheng
 * Date: 12-8-8
 * Time: 下午2:09
 * To change this template use File | Settings | File Templates.
 */
(function () {
  var me = editor,
    preview = $G("preview"),
    preitem = $G("preitem"),
    tmps = templates,
    currentTmp;



  var initPre = function () {
    var str = "";
    for (var i = 0, tmp; tmp = tmps[i++];) {
      str += '<div class="preitem" onclick="pre(' + i + ')"><img src="' + tmp.fullPre + '" ' + (tmp.title ? "alt=" + tmp.title + " title=" + tmp.title + "" : "") + '/></div>';
    }
    preitem.innerHTML = str;
  };
  var pre = function (n) {
    var tmp = tmps[n - 1];
    currentTmp = tmp;
    clearItem();
    domUtils.setStyles(preitem.childNodes[n - 1], {
      "background-color": "lemonChiffon",
      "border": "#ccc 1px solid"
    });
    preview.innerHTML = tmp.prehtml ? tmp.prehtml : "";
  };
  var clearItem = function () {
    var items = preitem.children;
    for (var i = 0, item; item = items[i++];) {
      domUtils.setStyles(item, {
        "background-color": "",
        "border": "white 1px solid"
      });
    }
  };
  dialog.onok = function () {
    if (!$G("issave").checked) {
      me.execCommand("cleardoc");
    }
    var obj = {
      html: currentTmp && currentTmp.html
    };
    me.execCommand("template", obj);
  };


  /**
   * 加载模板数据
   */
  parent.window.$Component.HttpClient.ajax({
    url: parent.window.$Component.Configuration.api().UEDITOR_TEMPLATES,
    dataType: "json",
    data: {},
    success: function (response) {
      if (response.success) {
        /**
         * 获取list
         */
        tmps = response.data.list;
        /**
         * 初始化
         */
        initPre();
        window.pre = pre;
        pre(1);
      } else {
        console.info("加载模板数据失败");
      }
    }
  });

})();
