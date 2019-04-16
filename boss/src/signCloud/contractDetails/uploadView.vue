<template>
    <div>
        <div class="attachment-upload-list" v-for="item in uploadList">
            <template v-if="item.status === 'finished'">
                <img v-if="item.type != 'pdf'" :src="item.url">
                <span v-else class="file-pdf-show">PDF需下载预览</span>
                <div class="attachment-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item.attachmentId, item.type)"></Icon>
                    <!--<Icon v-if="isEdit" type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>-->
                    <div v-if="isEdit" style="cursor:pointer;" class="ivu-badge-count" @click="handleRemove(item)">x</div>
                </div>
            </template>
            <div v-else class="upload-progress">
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </div>
        </div>
        <Upload v-if="isEdit"
                v-show="uploadList.length < 9"
                ref="upload"
                :action="host"
                :data="uploadData"
                :format="['bmp','gif','ico','jpg','jpeg','png','pdf']"
                type="drag"
                :multiple="multiple"
                :show-upload-list="false"
                :default-file-list="defaultList"
                :on-success="handleSuccess"
                :before-upload="handleBeforeUpload"
                :on-format-error="handleFormatError"
                style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="camera" size="20"></Icon>
            </div>
        </Upload>
        <Modal title="查看附件" v-model="visible" class="topModal">
            <img :src="server + imgName" v-if="visible" style="width: 100%">
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                imgName: '',
                visible: false,
                uploadList: [],
                uploadData: {},
                host: "",
                server: '/ossController/oss/file.do?id=',
                ossDir: this.$updateConfig.ossDir,
            }
        },
        props: {
            onSuccess: Function,
            onRemove: Function,
            multiple: {
                type: Boolean,
                default: false
            },
            defaultList: {
                type: Array,
                default () {
                    return [];
                }
            },
            isEdit: {
                type: Boolean,
                default: true
            }
        },
        watch: {
            defaultList(val) {
                if (val) {
                    val.forEach(item => {
                        item.url = this.server + item.attachmentId;
                        item.status = 'finished';
                    });
                    this.defaultList = val;
                    this.uploadList = val;
                }
            }
        },
        methods: {
            getOssHost: function () {
                this.request({
                    url: '/ossController/oss/getOssHost.do'
                }).then(data => {
                    this.host = data;
                });
            },
            handleView (name, type) {
                if (type != 'pdf') {
                    this.imgName = name;
                    this.visible = true;
                }else {
                    window.open(this.server + name);
                }
            },
            handleRemove (file) {
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
                if (this.onRemove) {
                    this.onRemove(file.attachmentId, file);
                }
            },
            handleSuccess (res, file) {
                let vm = this;
                let fileData = {
                    name: file.name,
                    key: vm.uploadData.key.replace("${filename}", file.name)
                };
                this.request({
                    url: "/ossController/oss/save.do",
                    data: fileData
                }).then(response => {
                    if (response) {
                        let item = vm.uploadList[vm.uploadList.length - 1];
                        if (item) {
                            item.attachmentId = response;
                            item.url = vm.server + response;
                            item.type = item.name.substring(item.name.lastIndexOf('.') + 1, item.name.length);
                            item.fileName = item.name;
                            vm.uploadList.pop();
                            vm.uploadList.push(item);
                        }
                        if (vm.onSuccess) {
                            vm.onSuccess(response, file);
                        }
                    }
                });
            },
            handleBeforeUpload () {
                let vm = this;
                vm.$emit('on-change-upload-state', false);
                return vm.axios.post("/ossController/oss/signature.do")
                    .then(
                        function (response) {
                            var rdata = response.data;
                            if (rdata) {
                                var key = vm.ossDir + rdata.data.middleDir + "${filename}";
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
            },
            handleFormatError (file) {
                this.$Message.error('上传文件类型只支持图片或者PDF文件');
                this.$emit('on-change-upload-state', true);
            }
        },
        updated () {
            if (this.$refs.upload) {
                this.uploadList = this.$refs.upload.fileList;
            }
        },
        created () {
            this.getOssHost();
            if (!Array.isEmpty(this.defaultList)) {
                this.defaultList.forEach(item => {
                    item.url = this.server + item.attachmentId;
                    item.status = 'finished';
                });
                this.uploadList = this.defaultList;
            }
        }
    }
</script>
<style>
    .attachment-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .attachment-upload-list img{
        width: 100%;
        height: 100%;
    }
    .attachment-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .attachment-upload-list:hover .attachment-upload-list-cover{
        display: block;
    }
    .attachment-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }

    .topModal .ivu-modal-mask, .topModal .ivu-modal-wrap{
        z-index: 1001;
    }

    .upload-progress {
        position: absolute;
        width: 100%;
    }

    .file-pdf-show {
        position: absolute;
        width: 100%;
        left: 0;
        top: 0;
        line-height: 20px;
        height: 60px;
        padding-top: 10px;
        font-size: 12px;
    }
</style>