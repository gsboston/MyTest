UE.registerUI('imagegallery', function (editor, uiName) {
    var ueditorImageGallery = null;

    editor.registerCommand(uiName, {
        execCommand: function () {
            if (ueditorImageGallery) {
                //检查图库组件是否初始化
                ueditorImageGallery.show();
            }
        }
    });


    function initImageGallery() {
        //页面增加弹层iframe
        var __imageGalleryFrameId = "edui_image_gallery_iframe_holder_" + (+new Date()).toString(16);
        //由Ueditor.config.js 配置 图库URL地址
        var __imageGalleryUrl = editor.getOpt('imageGalleryUrl');
        var __imageGalleryFIeldName = editor.getOpt('imageGalleryFieldName');
        var __editorZIndex = editor.getOpt('zIndex');
        var imageAutoSize = editor.getOpt('imageAutoSize');
        var imageAutoSizeStyle = editor.getOpt('imageAutoSizeStyle');
        var __imageGalleryFrame = document.createElement("iframe");
        __imageGalleryFrame.id = __imageGalleryFrameId;
        __imageGalleryFrame.scrolling = "no";
        __imageGalleryFrame.style.position = "fixed";
        __imageGalleryFrame.style.width = "100%";
        __imageGalleryFrame.style.height = "100%";
        __imageGalleryFrame.style.top = 0;
        __imageGalleryFrame.style.left = 0;
        __imageGalleryFrame.style.bottom = 0;
        __imageGalleryFrame.style.right = 0;
        __imageGalleryFrame.style.border = 0;
        __imageGalleryFrame.style.display = 'none';
        __imageGalleryFrame.style.zIndex = __editorZIndex + 10;
        __imageGalleryFrame.src = __imageGalleryUrl;
        __imageGalleryFrame.onload = function () {
            ueditorImageGallery = window.ImageGallery.selectedSuccess({
                successCallback: function (params) {
                    console.log(JSON.stringify(params));
                    editor.execCommand('insertimage', {
                        src: params[__imageGalleryFIeldName],
                        style: (imageAutoSize ? imageAutoSizeStyle : '')
                    });
                },
                hideCallback: function () {
                    //窗口关闭
                    console.log('窗口关闭');
                },
                layerElementId: '#' + __imageGalleryFrameId
            });
        };
        document.body.appendChild(__imageGalleryFrame);
    }


    var btn = new UE.ui.Button({
        name: uiName,
        title: uiName,
        // cssRules: 'background:url(' + editor.getOpt('UEDITOR_HOME_URL') + 'third-party/imagegallery/images/pic_icon.png);',
        cssRules: 'background-position: -380px 0px;',
        onclick: function () {
            //触发操作
            editor.execCommand(uiName);
        }
    });
    editor.afterConfigReady(initImageGallery);
    return btn;
});