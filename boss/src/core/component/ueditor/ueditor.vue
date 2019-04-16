<template>
    <div>
        <script id="editor" type="text/plain"></script>
    </div>
</template>

<script>
    import '../../../../static/ueditor/ueditor.config.js' //根据自己文件的路径接入
    import '../../../../static/ueditor/ueditor.all.min.js'
    import '../../../../static/ueditor/lang/zh-cn/zh-cn.js'
    import '../../../../static/ueditor/ueditor.parse.min.js'

    export default {
        props: {
            value: '',
            config: {
                BaseUrl: '',
                //toolbars:[['fullscreen', 'source', 'undo', 'redo', 'bold']]  //编辑器里需要用的功能
            }
        },
        data () {
            return {
                editor: null
            };
        },
        mounted() {
            const _this = this;
            this.editor = UE.getEditor('editor', this.config);
            let uex = this.editor;
            this.editor.addListener("ready", function () {
                uex.execCommand('serverparam', {
                    'orgId': '100',
                    'byteSize': '10000000',
                    'fileStrategyType': '1'
                });
                _this.editor.setContent(_this.value); // 确保UE加载完成后，放入内容。
            });
        },
        methods: {
            getUEContent () {
                return this.editor.getContent()
            },
            setUEContent(html, isAppendTo=false) {
                return this.editor.setContent(html, isAppendTo);
            }
        },
        destroyed() {
            this.editor.destroy();
        }
    };
</script>