<!--
 资料清单组件
 接口参数:
 isAllowAddRow: 是否允许添加新资料记录
 isAllowEdit: 是否允许编辑资料信息
 billId：关联服务单ID
 fileType：资料类型(准备/产出)
 isShowFileType: 是否显示资料类型(控制加载单一资料类型)
 nodeId：关联服务单流程节点ID
 billCycleId：关联服务单流程期数ID

 isShowConfirmReceive: 资料移交记录是否显示确认接收表单
 -->

<template>
    <div class="main-container">
        <Row style="margin-bottom: 15px;">
            <i-col span="18">
                <p class="title-desc">* 提前按以下清单准备资料，可根据需要上传备用。</p>
            </i-col>
            <i-col span="6">
                <Button type="ghost" style="float: right;" @click="openFileHistory">移交记录</Button>
            </i-col>
        </Row>

        <!-- 资料清单 -->
        <Row :gutter="16">
            <i-col span="24" v-for="(item, index) in fileData" :key="index" class="file-panel">
                <i-col span="5" v-if="isShowFileType">
                    <Input v-if="item.isDef || !(!item.id || item.id == '')" :value="fileTypeEnum[item.place]" :readonly="true"/>
                    <Select v-else v-model="item.place" size="large" placeholder="资料类别">
                        <Option v-for="(type, index1) in fileTypeList" :key="index1" :value="type.code">{{ type.name }}</Option>
                    </Select>
                </i-col>
                <i-col :span="isShowFileType ? '4' : '8'">
                    <Input v-model="item.name" :readonly="item.isDef || !(item.id == null)" placeholder="资料名称"/>
                </i-col>
                <i-col span="5">
                    <Input v-if="item.isDef || !(!item.id || item.id == '')" :value="item.place == 'PREPARE' ? fromTypeEnum[item.from] : (item.isReverted ? '返还客户' : '无需返还')" :readonly="true"/>
                    <Select v-else-if="item.place == 'PREPARE'" v-model="item.from" size="large" placeholder="资料准备方">
                        <Option v-for="(type, index1) in fromTypeList" :key="index1" :value="type.code">{{ type.name }}</Option>
                    </Select>
                    <Select v-else v-model="item.isReverted" size="large" placeholder="是否返还客户">
                        <Option v-for="(type, index1) in returnTypeList" :key="index1" :value="type.code">{{ type.name }}</Option>
                    </Select>
                </i-col>
                <i-col :span="isShowFileType ? '4' : '5'">
                    <Input v-if="item.isDef || !(!item.id || item.id == '')" :value="typeEnum[item.type]" :readonly="true"/>
                    <Select v-else v-model="item.type" size="large">
                        <Option v-for="(type, index1) in typeList" :key="index1" :value="type.code">{{ type.name }}</Option>
                    </Select>
                </i-col>
                <i-col v-if="isAllowEdit && item.attList.length < 9" span="2" class="operate-btn-div">
                    <BSUpload v-if="item.isStored == 1" :onSuccess="handleSuccess">
                        <Button v-if="item.attList.length == 0" type="ghost" icon="upload" class="operate-btn" @click="selectedFile(item)"></Button>
                        <Poptip v-else placement="left" trigger="hover" :transfer="true" width="350" style="max-width: 350px;">
                            <Button type="ghost" icon="upload" class="operate-btn active" @click="selectedFile(item)"></Button>
                            <div slot="content">
                                <Row>
                                    <i-col span="6" style="margin: 10px 0;height: 65px;" v-for="(fileItem, fileIndex) in item.attList" :key="fileIndex">
                                        <div class="attachment-upload-list">
                                            <template v-if="!fileItem.status || fileItem.status == 'finished'">
                                                <img v-if="imgTypeEnum.indexOf(fileItem.attType)>=0" :src="fileItem.url ? fileItem.url : (server + fileItem.attId)">
                                                <Icon v-else class="file-pdf-show" type="clipboard"></Icon>
                                                <div class="attachment-upload-list-cover">
                                                    <Icon type="ios-eye-outline" @click.native="handleFileView(fileItem.attId, fileItem.attType)"></Icon>
                                                    <Icon type="ios-cloud-download-outline" style="font-size: 18px;" @click.native="handleFileDown(fileItem.attId, fileItem.attType)"></Icon>
                                                    <div style="cursor:pointer;" class="ivu-badge-count" @click="handleFileRemove(item, fileItem, fileIndex)">x</div>
                                                </div>
                                            </template>
                                            <div v-else class="upload-progress">
                                                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                                            </div>
                                        </div>
                                    </i-col>
                                </Row>
                            </div>
                        </Poptip>
                    </BSUpload>
                    <Button v-else icon="minus-round" type="ghost" class="operate-stop" :disabled="true"></Button>
                </i-col>
                <i-col v-else span="2" class="operate-btn-div">
                    <Poptip placement="left" trigger="hover" :transfer="true" width="350" style="max-width: 350px;">
                        <Button type="ghost" icon="upload" :class="item.attList.length > 0 ? 'operate-btn active' : 'operate-btn'"></Button>
                        <div slot="content">
                            <i-col v-if="item.attList.length > 0" span="6" style="margin: 10px 0;height: 65px;" v-for="(fileItem, fileIndex) in item.attList" :key="fileIndex">
                                <div class="attachment-upload-list">
                                    <template>
                                        <img v-if="imgTypeEnum.indexOf(fileItem.attType)>=0" :src="fileItem.url ? fileItem.url : (server + fileItem.attId)">
                                        <Icon v-else class="file-pdf-show" type="clipboard"></Icon>
                                        <div class="attachment-upload-list-cover">
                                            <Icon type="ios-eye-outline" @click.native="handleFileView(fileItem.attId, fileItem.attType)"></Icon>
                                            <Icon type="ios-cloud-download-outline" style="font-size: 18px;" @click.native="handleFileDown(fileItem.attId, fileItem.attType)"></Icon>
                                        </div>
                                    </template>
                                </div>
                            </i-col>
                            <p v-else style="text-align: center;font-size: 14px;font-weight: 600;">暂无附件</p>
                        </div>
                    </Poptip>
                </i-col>
                <i-col span="2" class="operate-btn-div" v-if="isAllowAddRow && (((index + 1) == oldFIleDataLength) || item.isManualAdd)">
                    <Button v-if="item.isDef || item.id" icon="plus-round" type="ghost" class="operate-btn" @click="addFileRow"></Button>
                    <Button v-else icon="checkmark-round" type="ghost" class="operate-btn" @click="saveFileRow(item, index)"></Button>
                </i-col>

                <i-col span="2" class="operate-btn-div" v-if="(isAllowEdit && ((!item.isDef && (item.createUserId == currentUser.id)) || (fileData.length >1 && item.isManualAdd != undefined)))">
                    <Button icon="close-round" type="ghost" class="operate-btn" @click="removeFileRow(item, index)"></Button>
                </i-col>
            </i-col>
        </Row>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                host: "",
                server: '/ossController/oss/file.do?id=',
                uploadData: {},

                fileData: [],
                typeList: [
                    {name: '原件', code: 'ORIGINAL'},
                    {name: '电子版', code: 'ELECTRONIC'},
                    {name: '复印件', code: 'COPY'},
                    {name: '纸质', code: 'PAPER'},
                ],
                typeEnum: {
                    ORIGINAL: '原件',
                    ELECTRONIC: '电子版',
                    COPY: '复印件',
                    PAPER: '纸质'
                },
                oldFIleDataLength: 0,
                selectedFileItem: null,
                currentUser: {},

                fileTypeList: [
                    {name: '准备资料', code: 'PREPARE'},
                    {name: '产出资料', code: 'OUTPUT'},
                ],
                fileTypeEnum: {
                    PREPARE: '准备资料',
                    OUTPUT: '产出资料'
                },
                fromTypeList: [
                    {name: '客户', code: 'CUSTOMER'},
                    {name: '服务公司', code: 'COMPANY'},
                    {name: '其他', code: 'OTHER'}
                ],
                fromTypeEnum: {
                    CUSTOMER: '客户',
                    COMPANY: '服务公司',
                    OTHER: '其他'
                },
                returnTypeList: [
                    {name: '返还客户', code: 1},
                    {name: '无需返还', code: 0}
                ],
                imgTypeEnum: ['bmp','gif','ico','jpg','jpeg','png']
            }
        },
        props: {
            isAllowAddRow: {
                type: Boolean,
                default: true
            },
            isAllowEdit: {
                type: Boolean,
                default: true
            },
            billId: null,
            isShowFileType: {
                type: Boolean,
                default: true
            },
            fileType: {
                type: String,
                default: 'PREPARE'
            },
            isShowConfirmReceive: {
                type: Boolean,
                default: true
            },
            nodeId: null,
            billCycleId: null
        },
        filters: {
            formatDate(value) {
                if (value) {
                    let newDate = new Date(value);
                    if (newDate) {
                        let h = newDate.getHours();
                        let m = newDate.getMinutes();
                        h = h < 10 ? ('0' + h) : h;
                        m = m < 10 ? '0' + m : m;
                        return h + ':' + m;
                    }
                }
                return value;
            }
        },
        watch: {
            billId(val) {
                this.billId = val;
                if (val) {
                    this.getServiceFileList();
                }
            },
            nodeId(val) {
                this.nodeId = val;
                if (val) {
                    this.getServiceFileList();
                }
            }
        },
        created() {
            this.currentUser = window.Context.getCurrentUser();
            if (this.billId) {
                this.getServiceFileList();
            }
        },
        methods: {
            getServiceFileList() {
                this.request({
                    url: '/serviceCloud/billMaterial/list.do',
                    param: {
                        billId: this.billId,
                        place: this.isShowFileType ? null : this.fileType,
                        nodeId: this.nodeId ? this.nodeId : null,
                        billCycleId: this.billCycleId ? this.billCycleId : null
                    }
                }).then(data => {
                    if (data) {
                        this.fileData = Object.assign([], data);
                    }
                    this.oldFIleDataLength = this.fileData.length;
                    if (this.isAllowAddRow) {
                        if (this.fileData.length == 0) {
                            this.addFileRow();
                        }else if (this.fileData[this.fileData.length - 1].isDef) {
                            this.addFileRow();
                        }
                    }
                });
            },
            addFileRow() {
                //新增资料
                let fileObj = {id: null, name: '', type: '', place: this.fileType, attList: [], isStored: true, isManualAdd: true, isDef: false, createUserId: null, isReverted: 0};
                this.fileData.push(fileObj);
            },
            removeFileRow(item, index) {
                //删除资料
                this.$Modal.confirm({
                    title: '确认对话框',
                    content: '<p>请核实是否真的要删除该资料？</p>',
                    onOk: () => {
                        if (item.id) {
                            this.request({
                                url: '/serviceCloud/billMaterial/delete.do',
                                param: {
                                    id: item.id
                                }
                            }).then(() => {
                                this.getServiceFileList();
                            });
                        }else {
                            this.fileData.splice(index, 1);
                            if (this.fileData.length == 0) {
                                this.addFileRow();
                            }
                        }
                    },
                    onCancel: () => {

                    }
                });
            },
            saveFileRow(item, index) {
                //保存资料
                if (String.isNullOrBlank(item.name)) {
                    this.$Message.error('资料名称不能为空');
                }else if (String.isNullOrBlank(item.type)) {
                    this.$Message.error('资料类型不能为空');
                }else {
                    item.billId = this.billId;
                    item.nodeId = this.nodeId;
                    item.billCycleId = this.billCycleId;
                    this.request({
                        url: '/serviceCloud/billMaterial/save.do',
                        data: item
                    }).then(data => {
                        item.id = data;
                    });
                }
            },
            handleSuccess (id, file) {
                let vm = this;
                if (id) {
                    if (vm.selectedFileItem) {
                        let fileObj = {
                            attId: id,
                            id: id,
                            attName: file.name,
                            url: vm.server + id,
                            attType: file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length),
                            status: 'finished'
                        }
                        if (vm.selectedFileItem.id) {
                            fileObj['materialId'] = vm.selectedFileItem.id;
                            this.request({
                                url: "/serviceCloud/billMaterial/saveFile.do",
                                data: fileObj
                            }).then(data => {
                                vm.selectedFileItem.attList.push(fileObj);
                            });
                        }else {
                            vm.selectedFileItem.attList.push(fileObj);
                        }
                    }
                }
            },
            handleFileView(name, type) {
                window.open(this.server + name);
            },
            handleFileDown(name, type) {
                let url = '/ossController/oss/downloadFile.do?id=' + name + '&type=' + type;
                if (this.imgTypeEnum.indexOf(type) > -1) {
                    this.request({
                        url: url + '&isImage=' + true
                    }).then(data => {
                        var $a = document.createElement('a');
                        $a.setAttribute("href", data);
                        $a.setAttribute("download", name + '.' + type);

                        var evObj = document.createEvent('MouseEvents');
                        evObj.initMouseEvent('click', true, true, document.defaultView, 0, 0, 0, 0, 0, false, false, true, false, 1, null);
                        $a.dispatchEvent(evObj);
                    });
                }else {
                    location = url;
                }
            },
            handleFileRemove(item, fileItem, fileIndex) {
                if (item.id) {
                    if (fileItem.id) {
                        this.request({
                            url: '/serviceCloud/billMaterial/deleteFile.do',
                            param: {
                                id: fileItem.id
                            }
                        }).then(() => {
                            item.attList.splice(fileIndex, 1);
                        });
                    }
                }else {
                    item.attList.splice(fileIndex, 1);
                }
            },
            selectedFile(item) {
                this.selectedFileItem = item;
            },
            openFileHistory() {
                if (this.fileData.length > 0 && this.fileData[0].id) {
                    this.prompt({
                        code: 'SDFileHistoryList',
                        title: '资料移交记录',
                        width: 900,
                        height: 500,
                        props: {
                            fileData: this.fileData,
                            isShowConfirmReceive: this.isShowConfirmReceive
                        },
                        callback: (close) => {
                            close();
                        }
                    });
                }else {
                    this.$Message.info("暂无资料移交记录");
                }
            }
        }
    }
</script>

<style scoped>
    .main-container {
        padding: 0 25px;
    }

    .main-container .title-desc {
        color: #A1A1A1;
        font-size: 14px;
        line-height: 32px;
    }

    .main-container .file-panel {
        margin-bottom: 10px;
    }

    .main-container .operate-btn {
        padding: 8px 12.5px;
    }

    .main-container .operate-btn.active {
        background: #59b399;
        color: #FFF;
    }

    .main-container .operate-btn >>> .ivu-icon::before {
        font-weight: bolder;
    }

    .main-container .upload-input >>> .ivu-input-group-append {
        padding: 0;
        width: 36px;
        height: 36px;
        border: 0;
    }

    .main-container .upload-input .operate-btn {
        margin: 0;
        background: #FFF;
        height: 36px;
    }

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
        bottom: -1px;
        left: 0;
        right: -1px;
        background: rgba(0,0,0,.6);
    }

    .attachment-upload-list:hover .attachment-upload-list-cover{
        display: block;
    }

    .attachment-upload-list-cover i{
        color: #fff;
        font-weight: 600;
        font-size: 24px;
        cursor: pointer;
        margin: 0 2px;
        display: block;
    }

    .attachment-upload-list-cover i:first-child {
        border-bottom: 1px dashed #FFF;
        margin: 4px 10px;
    }

    .file-pdf-show {
        position: absolute;
        width: 100%;
        left: 0;
        top: 0;
        line-height: 60px;
        height: 60px;
        font-size: 48px;
        color: #cccccc;
    }

    .operate-stop {
        width: 36px;
        height: 36px;
        padding: 0;
    }

    .operate-stop >>> .ivu-icon {
        width: 16px;
        height: 16px;
        font-size: 18px;
        line-height: 12px;
        border: 2px solid;
        text-align: center;
        border-radius: 50%;
        transform: rotate(135deg);
    }

    .main-container >>> input[readonly] {
        border: 1px solid transparent;
        border-bottom: 1px solid #eee;
        border-radius: 0;
    }
</style>