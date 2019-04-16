<!--
 上传组件
 标签<BSUpload>
 接口方法:
 onSuccess(fileId):上传成功回调，fileId为文件主键
 beforeUpload(file): 上传文件前钩子 file为文件信息
 type:数组类型，接收支持JPG,PNG,BMP等文件后缀集合
 maxSize：上传上限大小限制
 showProcess：是否显示进度条，默认显示

 slot upload组件内部渲染可以自定义展现形式

 图片处理：由于基于阿里云做的图片上传组件，图片处理支持阿里云的x-oss-process的参数设置
 具体方式为
 &x-oss-process=image/resize,w_100,h_100/quality,Q_80
 类似这种形式的请求构造
 具体参数配置可以参考阿里云OSS图片处理文档
 https://help.aliyun.com/document_detail/44705.html?spm=5176.doc44703.6.962.NCtd4C
 -->

<style scoped>
    .upload-process-item {
        position: fixed;
        top: 5px;
        width: 400px;
        left: 50%;
        margin-left: -200px;
        padding: 16px;
        border-radius: 4px;
        box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
        background: #fff;
        line-height: 1;
        overflow: hidden;
        z-index: 6;
    }
</style>
<template>
    <div>
        <div v-if="showProcess">
            <div v-for="item in uploadList">
                <template v-if="item.status === 'finished'">
                </template>
                <template v-else>
                    <div class="upload-process-item">
                        上传中……
                        <Progress style="width: 70%" :percent="item.percentage" hideInfo></Progress>
                    </div>
                </template>
            </div>
        </div>
        <Upload :before-upload="before" ref="upload"
                :action="host"
                :data="uploadData"
                :format="type"
                :multiple="multiple"
                :on-success="uploadSuccess"
                :show-upload-list="false"
                :max-size="maxSize"
                :on-exceeded-size="sizeCheck"
                :on-format-error="typeCheck">
            <slot></slot>
        </Upload>
    </div>
</template>
<script type="text/babel">
    export default {
        name: 'BSUpload',
        mounted () {
            this.uploadList = this.$refs.upload.fileList;
            this.getOssHost();
        },
        data() {
            return {
                uploadData: {},
                percentage: 0,
                uploadList: [],
                host: "",
                server: this.$updateConfig.ossServer
            }
        },
        props: {
            attr:{},
            onSuccess: Function,
            beforeUpload: Function,
            multiple: {
                type: Boolean,
                default: false
            },
            type: Array,
            maxSize: Number,
            showProcess: {
                type: Boolean,
                default: true
            }
        },
        methods: {
            getOssHost: function () {
                var vm = this;
                vm.axios.post("/ossController/oss/getOssHost.do")
                    .then(
                        function (data) {
                            vm.host = data.data.data;
                        }
                    )
                    .catch(function (response) {
                        vm.$Message.error(response.message);
                    });
            },
            before: function (file) {
                var vm = this;
//            var token = Context.getToken();

//            this.request({
//                url: "/ossController/oss/signature.do"
//            }).then(data => {
//                var key = Config.ossDir + data.middleDir+"${filename}";
//                this.uploadData= {
//                    OSSAccessKeyId: data.accessid,
//                    policy: data.policy,
//                    Signature: data.signature,
//                    Expires: data.expire,
//                    success_action_status: "200",
//                    key: key
//                };
//            });
                var flag = true;
                if (vm.beforeUpload) {
                    flag = this.beforeUpload(file);
                    if (flag == undefined)
                        flag = true;
                }
                if (flag) {
                    return vm.axios.post("/ossController/oss/signature.do")
                        .then(
                            function (response) {
                                var rdata = response.data;
                                if (rdata) {
                                    var key = vm.$updateConfig.ossDir + rdata.data.middleDir + "${filename}";
                                    vm.uploadData = {
                                        OSSAccessKeyId: rdata.data.accessid,
                                        policy: rdata.data.policy,
                                        Signature: rdata.data.signature,
                                        Expires: rdata.data.expire,
                                        success_action_status: "200",
                                        key: key
                                    };
                                }
                            }
                        )
                        .catch(function (response) {
                            vm.$Message.error(response.message);
                        });
                } else {
                    return false;
                }

            },
            sizeCheck: function () {
                if(this.maxSize>10240){
                    this.$Message.error("文件上传大小限制为：" + Math.floor(this.maxSize/1024) + "M");
                }else{
                    this.$Message.error("文件上传大小限制为：" + this.maxSize + "kb");
                }

            },
            typeCheck: function () {
                this.$Message.error("文件上传只支持" + this.type + "类型");
            },
            uploadSuccess: function (response, file, fileList) {
                let vm = this;
                let url = this.server + '/oss/file';
                let fileData = {
                    name: file.name,
                    key: vm.uploadData.key.replace("${filename}", file.name)
                };
                vm.axios.post("/ossController/oss/save.do", fileData)
                    .then(
                        function (response) {
                            if (response.data) {
                                if (vm.onSuccess) {
                                    vm.onSuccess(response.data.data,file,vm.attr);
                                }
                            }
                        }
                    )
                    .catch(function (response) {
                        vm.$Message.error(response.message);
                    });
            }
        }
    };
</script>
