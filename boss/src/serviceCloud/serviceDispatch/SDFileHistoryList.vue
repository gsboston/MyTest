<template>
    <div class="info-main">
        <div class="left-view">
            <ul>
                <li v-for="(item, index) in fileData" v-if="item.id" :class="index == selectedInfoIndex ? 'active' : ''" :key="index" @click="selectedInfo(item, index)">
                    <Tooltip placement="right" :content="item.name">
                        {{ item.name }}
                    </Tooltip>
                </li>
            </ul>
        </div>
        <div class="content-view" v-if="selectedInfoItem">
            <Form class="info-form" :model="historyInfo" ref="fileHistoryForm" :rules="ruleValidate" label-position="right" :label-width="120">
                <Row :gutter="16">
                    <FormItem label="移交资料名称：">
                        <i-col span="24">
                            <span class="info-name">{{ selectedInfoItem.name }}</span>
                            <Button type="ghost" size="small" class="info-type">{{ typeEnum[selectedInfoItem.type] }}</Button>
                        </i-col>
                    </FormItem>

                    <!-- 移交记录明细 -->
                    <FormItem label="移交记录明细：" class="file-history" v-if="fileHistoryList.length > 0">
                        <div class="file-all-view" :style="isShowForm ? 'height: 188px;' : 'height: 100%;'">
                            <i-col span="23" offset="1">
                                <Timeline class="file-all-list">
                                    <TimelineItem v-for="(item, index) in fileHistoryList" :key="index" :class="item.autoAffirm ? 'file-send' : (transferReceiveStateEnum[item.transferReceiveState] ? transferReceiveStateEnum[item.transferReceiveState].class : '')">
                                        <p class="time">{{ item.operatorTime | formatDate }}</p>
                                        <div class="content">
                                            <div style="width: 100%;white-space: nowrap;">
                                                <i-col span="18">
                                                    <span style="padding-right: 20px;">{{item.autoAffirm ? '已移交' : (transferReceiveStateEnum[item.transferReceiveState] ? transferReceiveStateEnum[item.transferReceiveState].name : '')}}</span>
                                                    <Poptip trigger="hover" placement="bottom-start" width="350" style="max-width: 350px;">
                                                        <span style="color: #59b399;text-decoration: underline;">证明</span>
                                                        <div slot="content">
                                                            <Row v-if="item.secBillDataInstanceTransferRecordAffixVos.length>0">
                                                                <i-col span="6" style="margin: 10px 0;height: 65px;" v-for="(fileItem, fileIndex) in item.secBillDataInstanceTransferRecordAffixVos" :key="fileIndex">
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
                                                            </Row>
                                                            <p v-else style="text-align: center;font-size: 14px;font-weight: 600;">暂无附件</p>
                                                        </div>
                                                    </Poptip>
                                                </i-col>
                                                <i-col span="22">
                                                    <div>
                                                        <span>{{item.operatorType == 'RECEIVE' ? item.receiveUserName : item.submitUserName}}</span>
                                                        <span>&emsp;{{item.operatorType == 'RECEIVE' ? item.receiveUserPhone : item.submitUserPhone}}</span>
                                                    </div>
                                                </i-col>
                                                <i-col span="2" style="text-align: right;margin-top: -15px;" v-if="isAllowEdit && index == 0 && isAllowRemove">
                                                    <Button icon="ios-trash-outline" type="ghost" class="operate-btn" style="padding: 0;font-size: 18px;border: 0;" @click="deleteHistoryData(item.id)"></Button>
                                                </i-col>
                                            </div>
                                        </div>
                                    </TimelineItem>
                                    <TimelineItem></TimelineItem>
                                </Timeline>
                            </i-col>
                        </div>
                    </FormItem>
                    <FormItem label="移交记录明细：" class="file-history" v-else-if="!isAllowEdit">
                        <div class="file-all-view no-change" style="height: 100%;">
                            <span>暂无移交记录</span>
                        </div>
                    </FormItem>

                    <template v-if="isShowForm && isAllowEdit">
                        <FormItem :label="(isShowConfirmReceive && isHaveUnReceive) ? '确认资料接收：' : '添加移交记录：'" :style="fileHistoryList.length > 0 ? 'padding-top: 15px;border-top: 1px solid #e5e5e5;' : ''">
                            <i-col span="12">
                                <DatePicker v-model="historyInfo.operatorTime" placement="right" :editable="false" type="datetime" format="yyyy-MM-dd HH:mm" :placeholder="isHaveUnReceive ? '请确认接收时间' : '请确认移交时间'" style="width: 100%"></DatePicker>
                            </i-col>
                            <i-col span="12" v-if="!isHaveUnReceive">
                                <Checkbox v-model="isNeedConfirm">勾选代表需要接收人确认</Checkbox>
                            </i-col>
                        </FormItem>
                        <FormItem label="" v-if="!isNeedConfirm">
                            <i-col span="12">
                                <Input v-model="historyInfo.receiveUserName" placeholder="接收人" :maxlength="20"/>
                            </i-col>
                            <i-col span="12">
                                <Input v-model="historyInfo.receiveUserPhone" placeholder="接收人联系电话" :maxlength="20"/>
                            </i-col>
                        </FormItem>
                        <FormItem label="" v-for="(item, index) in historyInfo.secBillDataInstanceTransferRecordAffixVos" :key="index">
                            <i-col span="20">
                                <Input :value="item.attName" class="upload-input" :placeholder="isHaveUnReceive ? '接收证明' : '移交证明'" :readonly="true">
                                <div slot="append">
                                    <BSUpload :onSuccess="handleSuccess">
                                        <Button :disabled="item.attName != null" type="ghost" icon="upload" class="operate-btn" style="padding: 6px 10.5px;margin: 0;" @click="selectFile(index)"></Button>
                                    </BSUpload>
                                </div>
                                </Input>
                            </i-col>
                            <i-col span="2">
                                <Button icon="plus-round" type="ghost" class="operate-btn" @click="addFileRow"></Button>
                            </i-col>
                            <i-col span="2" v-if="historyInfo.attachmentList.length > 1">
                                <Button icon="close-round" type="ghost" class="operate-btn" @click="removeFileRow(index)"></Button>
                            </i-col>
                        </FormItem>
                        <FormItem label="">
                            <i-col span="24" class="saveBtn">
                                <i-col span="6" offset="4">
                                    <Button type="ghost" @click="handleReset">取消</Button>
                                </i-col>
                                <i-col span="6" offset="4">
                                    <Button type="primary" @click="save">确定</Button>
                                </i-col>
                            </i-col>
                        </FormItem>
                    </template>
                </Row>
            </Form>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                host: "",
                server: '/ossController/oss/file.do?id=',
                ossDir: this.$updateConfig.ossDir,
                uploadData: {},

                typeEnum: {
                    ORIGINAL: '原件',
                    ELECTRONIC: '电子版',
                    COPY: '复印件',
                    PAPER: '纸质'
                },
                transferReceiveStateEnum: {
                    HANDED_TRANSFER: {
                        name: '已移交',
                        class: 'file-send',
                        userTitle: '接收人'
                    },
                    HANDED_RECEIVED: {
                        name: '已接收',
                        class: 'file-receive',
                        userTitle: '移交人'
                    }
                },

                selectedInfoIndex: 0,
                selectedInfoItem: null,
                fileHistoryList: [],
                historyInfo: {
                    autoAffirm: true,
                    operatorTime: '',
                    operatorType: 'HAND_OVER',
                    receiveUserName: '',
                    receiveUserPhone: '',
                    transferReceiveState: 'HANDED_RECEIVED',
                    attachmentList: [],
                    secBillDataInstanceTransferRecordAffixVos: []
                },
                isNeedConfirm: false,
                selectedFileIndex: null,
                ruleValidate: {},
                isHaveUnReceive: false,
                currentUser: {},
                imgTypeEnum: ['bmp','gif','ico','jpg','jpeg','png']
            }
        },
        props: {
            fileData: {
                type: Array,
                default: []
            },
            isShowConfirmReceive: {
                type: Boolean,
                default: true
            },
            isAllowEdit: {
                type: Boolean,
                default: true
            }
        },
        filters: {
            formatDate(value) {
                if (value) {
                    let newDate = new Date(value);
                    if (newDate) {
                        let day1 = new Date(window.DateFormat.dateToString(new Date(value), 'yyyy/MM/dd'));
                        let day2 = new Date(window.DateFormat.dateToString(new Date(), 'yyyy/MM/dd'));
                        let dayNum = (day2 - day1) / (1000 * 60 * 60 * 24);

                        let h = newDate.getHours();
                        let m = newDate.getMinutes();
                        h = h < 10 ? ('0' + h) : h;
                        m = m < 10 ? '0' + m : m;
                        return h + ':' + m + ' ' + (dayNum == 1 ? '昨天' : (dayNum == 0 ? '' : window.DateFormat.dateToString(new Date(value), 'MM-dd')));
                    }
                }
                return value;
            }
        },
        watch: {
            isNeedConfirm(val) {
                if (val) {
                    this.historyInfo.autoAffirm = false;
                    this.historyInfo.receiveUserName = null;
                    this.historyInfo.receiveUserPhone = null;
                    this.historyInfo.transferReceiveState = 'HANDED_TRANSFER';
                }else {
                    this.historyInfo.autoAffirm = true;
                    this.historyInfo.transferReceiveState = 'HANDED_RECEIVED';
                }
            },
            isHaveUnReceive(val) {
                if (val) {
                    this.isNeedConfirm = false;
                    this.historyInfo.operatorType = 'RECEIVE';
                    this.historyInfo.transferReceiveState = 'HANDED_RECEIVED';
                }else {
                    this.historyInfo.operatorType = 'HAND_OVER';
                    this.historyInfo.transferReceiveState = 'HANDED_TRANSFER';
                }
            }
        },
        computed: {
            isShowForm () {
                return ((this.isShowConfirmReceive && this.isHaveUnReceive && (this.fileHistoryList.length > 0 ? this.currentUser.id != this.fileHistoryList[0].submitUserId : true)) || !this.isHaveUnReceive);
            },
            isAllowRemove() {
                if (this.fileHistoryList.length > 0) {
                    let item = this.fileHistoryList[0];
                    //（（需要接收人确认 && 未确认） || 不需要接收人确认）&& 当前用户提交的数据
                    return ((item.transferReceiveState == 'HANDED_TRANSFER' && !item.autoAffirm) || item.autoAffirm) && this.currentUser.id == item.submitUserId;
                }
                return false;
            }
        },
        created() {
            this.getOssHost();
            this.currentUser = window.Context.getCurrentUser();
            if (this.fileData.length > 0) {
                this.selectedInfoItem = this.fileData[0];
                this.getFileHistoryList();
            }
            this.addFileRow();
        },
        methods: {
            getOssHost: function () {
                this.request({
                    url: '/ossController/oss/getOssHost.do'
                }).then(data => {
                    this.host = data;
                });
            },
            getFileHistoryList() {
                if (this.selectedInfoItem.id) {
                    this.request({
                        url: '/serviceCloud/transferRecords/list.do',
                        param: {
                            fileId: this.selectedInfoItem.id
                        }
                    }).then(data => {
                        if (data) {
                            this.fileHistoryList = data;
                            if (this.fileHistoryList.length > 0 ) {
                                //判断是否存在已移交未接受记录
                                if (this.fileHistoryList[0].transferReceiveState == 'HANDED_TRANSFER' && !this.fileHistoryList[0].autoAffirm) {
                                    this.isHaveUnReceive = true;
                                }else {
                                    this.isHaveUnReceive = false;
                                }
                            }else {
                                this.isHaveUnReceive = false;
                            }
                        }else {
                            this.isHaveUnReceive = false;
                        }

                        if (this.isShowConfirmReceive && this.isHaveUnReceive) {
                            this.historyInfo.receiveUserName = this.currentUser.realName;
                            this.historyInfo.receiveUserPhone = this.currentUser.phone;
                        }
                    });
                }else {
                    this.isHaveUnReceive = false;
                    if (this.isShowConfirmReceive && this.isHaveUnReceive) {
                        this.historyInfo.receiveUserName = this.currentUser.realName;
                        this.historyInfo.receiveUserPhone = this.currentUser.phone;
                    }
                }
            },
            addFileRow() {
                //新增资料
                let fileObj = {id: null, name: '', type: '', url: ''};
                this.historyInfo.attachmentList.push('');
                this.historyInfo.secBillDataInstanceTransferRecordAffixVos.push(fileObj);
            },
            removeFileRow(index) {
                this.historyInfo.attachmentList.splice(index, 1);
                this.historyInfo.secBillDataInstanceTransferRecordAffixVos.splice(index, 1);
            },
            handleBeforeUpload () {
                let vm = this;
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
            handleSuccess (id, file) {
                let vm = this;
                if (id) {
                    let fileObj = {
                        attId: id,
                        attName: file.name,
                        url: vm.server + id,
                        attType: file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length),
                        status: 'finished'
                    }
                    vm.historyInfo.attachmentList[vm.selectedFileIndex] = id;
                    vm.historyInfo.secBillDataInstanceTransferRecordAffixVos[vm.selectedFileIndex] = Object.assign(vm.historyInfo.secBillDataInstanceTransferRecordAffixVos[vm.selectedFileIndex], fileObj);
                    this.addFileRow();
                }
            },
            selectedInfo(item, index) {
                this.selectedInfoItem = item;
                this.selectedInfoIndex = index;
                this.getFileHistoryList();
            },
            selectFile(index) {
                this.selectedFileIndex = index;
            },
            save() {
                if (String.isNullOrBlank(this.historyInfo.operatorTime)) {
                    this.$Message.error((this.isShowConfirmReceive && this.isHaveUnReceive) ? '请选择接收时间' : '请选择移交时间');
                    return;
                }else if (this.fileHistoryList.length > 0 ) {
                    let startDate = this.fileHistoryList[0].operatorTime;
                    let endDate = this.historyInfo.operatorTime;
                    let months = Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()));
                    if (months <= 0) {
                        this.$Message.error('请选择（' + window.DateFormat.dateToString(new Date(startDate), 'yyyy/MM/dd HH:mm') + '）之后的时间');
                        return;
                    }
                }

                if (this.isShowConfirmReceive && this.isHaveUnReceive) {
                    this.historyInfo.autoAffirm = false;
                }
                // if (!this.isNeedConfirm) {
                //     if (String.isNullOrBlank(this.historyInfo.receiveUserName)) {
                //         this.$Message.error('请输入接收人');
                //         return;
                //     }
                //     if (String.isNullOrBlank(this.historyInfo.receiveUserPhone)) {
                //         this.$Message.error('请输入接收人联系电话');
                //         return;
                //     }
                // }
                this.historyInfo.dataInstanceId = this.selectedInfoItem.id;
                let newAttachmentList = this.historyInfo.attachmentList.filter(item => {
                    return !String.isNullOrBlank(item);
                });
                this.historyInfo.attachmentList = newAttachmentList;

                let newFileList = this.historyInfo.secBillDataInstanceTransferRecordAffixVos.filter(item => {
                    return !String.isNullOrBlank(item.attId);
                });
                this.historyInfo.secBillDataInstanceTransferRecordAffixVos = newFileList;
                this.request({
                    url: "/serviceCloud/transferRecords/save.do",
                    data: this.historyInfo
                }).then(data => {
                    this.$Message.success('添加移交记录成功');
                    if (this.isNeedConfirm) {
                        this.isHaveUnReceive = true;
                    }else {
                        this.isHaveUnReceive = false;
                    }
                    this.handleReset();
                    this.getFileHistoryList();
                });
            },
            handleReset () {
                this.$refs['fileHistoryForm'].resetFields();
                this.isNeedConfirm = false;
                this.historyInfo = {
                    autoAffirm: true,
                    operatorTime: '',
                    operatorType: 'HAND_OVER',
                    receiveUserName: '',
                    receiveUserPhone: '',
                    transferReceiveState: 'HANDED_RECEIVED',
                    attachmentList: [],
                    secBillDataInstanceTransferRecordAffixVos: []
                };
                this.addFileRow();
            },
            deleteHistoryData(id) {
                this.$Modal.confirm({
                    title: '确认对话框',
                    content: '<p>请核实是否真的要删除该记录？</p>',
                    onOk: () => {
                        this.request({
                            url: '/serviceCloud/transferRecords/delete.do',
                            param: {
                                id: id
                            }
                        }).then(() => {
                            this.getFileHistoryList();
                        });
                    },
                    onCancel: () => {

                    }
                });
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
        }
    }
</script>

<style scoped>
    .info-main {
        display: flex;
        padding: 20px 10px 0;
        height: 490px;
    }

    .info-main .left-view {
        padding: 0 15px;
        border-right: 1px solid #e5e5e5;
        width: 180px;
        height: 100%;
        overflow: auto;
    }

    .info-main .left-view ul {
        border: 1px solid #ddd;
        font-size: 14px;
    }

    .info-main .left-view ul li {
        padding: 0 10px;
        text-align: center;
        height: 35px;
        line-height: 35px;
        border-bottom: 1px solid #ddd;
    }

    .info-main .ivu-tooltip, .info-main >>> .ivu-tooltip-rel {
        width: 100%;
        height: 100%;
    }

    .info-main .left-view ul li >>> .ivu-tooltip-rel {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .info-main .left-view ul li:last-child {
        border-bottom: 0;
    }

    .info-main .left-view ul li.active {
        color: #FFF;
        background: #50B599;
    }

    .info-main .content-view {
        flex: 1;
        padding: 0 15px;
        height: 100%;
        overflow: auto;
    }

    .info-main .content-view >>> .ivu-input-group-append {
        padding: 0;
        width: 32px;
        height: 32px;
        border: 0;
    }

    .info-main .content-view >>> .ivu-form-item {
        margin-bottom: 15px;
    }

    .info-main .content-view .info-name {
        font-size: 14px;
    }

    .info-main .content-view .info-type {
        margin-left: 20px;
        margin-top: -2px;
        padding: 0 10px;
        font-size: 12px;
        color: #54B499;
        border-color: #54B499;
    }

    .file-all-list .time {
        position: absolute;
        left: -30px;
        width: 45px;
        text-align: center;
        line-height: 20px;
    }

    .file-all-list .content{
        position: relative;
        align-items: center;
        padding: 6px 30px;
        width: 100%;
        min-height: 60px;
        color: #333;
        font-size: 14px;
    }

    .file-all-list .content>div {
        line-height: 20px;
    }

    .file-all-list .invoice-info span:first-child {
        display: inline-block;
    }

    .file-all-list >>> .ivu-timeline-item-head {
        width: 16px;
        height: 16px;
        left: 22px;
    }

    .file-all-list >>> .ivu-timeline-item-head-blue {
        background: #59b399;
        border-color: #59b399;
        color: #59b399;
    }

    .file-all-list >>> .ivu-timeline-item-content {
        display: block;
    }

    .file-all-list >>> .ivu-timeline-item:last-child .ivu-timeline-item-head {
        display: none;
    }

    .file-all-list .ivu-timeline-item {
        padding: 0 0 20px 0;
    }

    .file-all-list .ivu-timeline-item:nth-last-child(2) {
        padding: 0;
    }

    .file-all-list .ivu-timeline-item >>> .ivu-timeline-item-content {
        padding: 0 0 0 40px;
    }

    .file-all-list .invoiced-price span{
        font-size: 14px;
    }

    .file-all-list >>> .ivu-timeline-item-tail {
        left: 28px;
    }

    .file-all-list .file-receive >>> .ivu-timeline-item-head::after {
        content: '接';
        font-size: 12px;
        color: #FFF;
        position: absolute;
        top: 1px;
        left: 1px;
        line-height: 12px;
    }

    .file-all-list .file-send >>> .ivu-timeline-item-head::after {
        content: '移';
        font-size: 12px;
        color: #FFF;
        position: absolute;
        top: 1px;
        left: 1px;
        line-height: 12px;
    }

    .file-all-list .file-return >>> .ivu-timeline-item-head::after {
        content: '返';
        font-size: 12px;
        color: #FFF;
        position: absolute;
        top: 1px;
        left: 1px;
        line-height: 12px;
    }

    .file-history .file-all-view {
        position: relative;
        padding: 10px 0px 0px;
        overflow-y: auto;
    }

    .file-history.auto-height .file-all-view {
        position: relative;
        padding: 10px 0px 0px;
        height: 400px;
        overflow-y: auto;
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

    .no-change{
        position: relative;
        width: 100%;
        height: auto;
        padding: 145px 10px 145px 60px!important;
        background: #FFF url("../../signCloud/image/no-contract.png") 100px 100px no-repeat;
        text-align: center;
        font-size: 14px;
    }

    .required:before {
        content: '*';
        display: inline-block;
        margin-right: 4px;
        line-height: 1;
        font-family: SimSun;
        font-size: 12px;
        color: #ed3f14;
    }
</style>