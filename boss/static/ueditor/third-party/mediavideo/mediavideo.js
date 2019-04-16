UE.registerUI('mediavideo', function (editor, uiName) {


  var iframeUrl = editor.getOpt('videoDialog');
  var iframeEditorEvents = window.iframeEditorEvents || {};
  window.iframeEditorEvents = iframeEditorEvents;


  //创建dialog
  var dialog = new UE.ui.Dialog({
    //指定弹出层中页面的路径
    iframeUrl: iframeUrl,
    //需要指定当前的编辑器实例
    editor: editor,
    //指定dialog的名字
    name: uiName,
    //dialog的标题
    title: "选择视频",

    //指定dialog的外围样式
    cssRules: "width:1200px;height:480px;"
    //
    // //如果给出了buttons就代表dialog有确定和取消
    // buttons: [
    //   {
    //     className: 'edui-okbutton',
    //     label: '确定',
    //     onclick: function () {
    //       console.info("确定了")
    //       dialog.close(true);
    //     }
    //   },
    //   {
    //     className: 'edui-cancelbutton',
    //     label: '取消',
    //     onclick: function () {
    //       dialog.close(false);
    //     }
    //   }
    // ]
  });

  //参考addCustomizeButton.js
  var btn = new UE.ui.Button({
    name: 'dialogbutton' + uiName,
    title: 'dialogbutton' + uiName,
    //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
    cssRules: 'background-position:-320px -20px;',
    onclick: function () {

      var loadingInstance = null;
      if (window.ELELoading) {
        /**
         * 弹出Loading层
         */
        loadingInstance = window.ELELoading.service({
          text: "正在加载视频素材，一会儿就好······"
        });
      }
      //渲染dialog
      dialog.render();
      dialog.open();
      /**
       * 绑定事件
       */
      (function (window, editor, dialog) {
        var mediaVideoSelectedChanged = function ({selectedList = [], html = ""}) {
          editor.execCommand("inserthtml", html, true);

          if (selectedList && selectedList.length > 0) {
          }
          /**
           * 关闭对话框
           */
          dialog.close(true);
        };
        var windowiFrames = $("iframe[src='" + iframeUrl + "']");
        if (windowiFrames) {
          var frameId = windowiFrames.get(0).id;
          if (frameId) {
            windowiFrames.get(0).contentWindow.selfFrameId = frameId;
            window.iframeEditorEvents[frameId] = mediaVideoSelectedChanged;
          }
        }
      })(window, editor, dialog);

      setTimeout(function () {
        if (loadingInstance) {
          /**
           * 关闭Loading层
           */
          loadingInstance.close();
        }
      }, 500);

    }
  });

  return btn;
}/*index 指定添加到工具栏上的那个位置，默认时追加到最后,editorId 指定这个UI是那个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮*/);
