//创建一个在选中的图片单击时添加边框的插件，其实质就是在baidu.editor.plugins塞进一个闭包
UE.plugins["videoplayer"] = function () {
  var me = this;
  /**
   *  绑定播放按钮的class名称为:video-fake-play-trigger
   */
  var videoPlayerId = "edui_video_player_layer";


  var Player = function (videoPlayerId) {
    var self = this;
    self.options = {
      success: false,
      videoPlayerId
    };
    self.create = function () {
      if ($("#" + videoPlayerId).length === 0) {
        /**
         * 判断是否进行过初始化，如果以初始化，则跳过
         */
        var editorZIndex = me.getOpt('zIndex');
        var playerFrame = document.createElement('iframe');
        playerFrame.id = videoPlayerId;
        playerFrame.style.display = 'none';
        playerFrame.scrolling = "no";
        playerFrame.style.position = "fixed";
        playerFrame.style.width = "800px";
        playerFrame.style.height = "600px";
        playerFrame.style.top = '50px';
        playerFrame.style.left = ($(window).width() - 800) / 2 + 'px';
        playerFrame.style.bottom = 0;
        playerFrame.style.right = 0;
        playerFrame.style.border = 0;
        playerFrame.style.display = 'none';
        playerFrame.style.zIndex = editorZIndex + 10;
        playerFrame.onload = function () {
          self.options.success = true;
        };
        $(document.body).append(playerFrame);
      }
    };
    self.open = function (video) {
      var loadingInstance = null;
      if (window.ELELoading) {
        /**
         * 弹出Loading层
         */
        loadingInstance = window.ELELoading.service({
          text: "正在加载视频，一会儿就好······"
        });
      }
      var player = self.element();
      var playerUrl = me.getOpt('playerUrl');
      if (playerUrl) {
        playerUrl += "?vid=" + video.fileMediaId + "&vTitle=" + encodeURIComponent(video.fileName) + "&timestamp=" + (new Date()).getTime();
        player.onload = function () {
          self.show();
          setTimeout(function () {
            if (loadingInstance) {
              /**
               * 关闭Loading层
               */
              loadingInstance.close();
            }
          }, 100);
        };
        player.src = playerUrl;
      }
    };
    self.show = function () {
      var player = self.element();
      if (player) {
        player.style.display = 'block';
      }
    };

    self.close = function () {
      var player = self.element();
      if (player) {
        player.style.display = 'none';
      }
    };

    self.element = function () {
      if (self.options.success) {
        return $('#' + self.options.videoPlayerId).get(0);
      }
    }
  };

  /**
   * 创建播放器
   */
  var player = new Player(videoPlayerId);
  player.create();

  /**
   * 绑定播放器
   * @type {Player}
   */
  window.PlayerFrameHolder = player;
  //创建一个改变图片边框的命令
  me.commands["videoplayer"] = {
    execCommand: function () {
      //获取当前选区
      var range = me.selection.getRange();
      //选区没闭合的情况下操作
      if (!range.collapsed) {
        //图片判断
        var img = range.getClosedNode();
        if (img && img.tagName == "IMG") {
          let videoData = img.dataset['video'];
          if (videoData) {
            videoData = JSON.parse(decodeURIComponent(videoData.toString()));
            /**
             * 2018年2月7日13:10:43
             * 事件处理机制存在问题  待优化
             */
            //player.open(videoData);
          }
        }
      }
    }
  };

  //注册一个触发命令的事件，同学们可以在任意地放绑定触发此命令的事件
  me.addListener('click', function () {
    me.execCommand("videoplayer");
  });
};
