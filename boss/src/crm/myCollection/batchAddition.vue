<template>
    <div class="batchAdditionWrap">
        <div class="batchAddition" v-if="!result">
            <Row class="batchAdditionHeader" type="flex" align="middle" justify="space-between">
                <i-Col>
                    <div class="header">
                        <span>提供人所在机构：{{ batch.orgName || '未选择' | cutString}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <span>商机提供人： {{ batch.realName || '未选择' }}</span>
                        <Checkbox v-model="orgTreeCheck" class="checkbox">选择提供人</Checkbox>
                    </div>
                </i-Col>
                <i-col span="8">
                    <Row type="flex" justify="center">
                        <clueUploadTemplate></clueUploadTemplate>
                    </Row>
                </i-col>
            </Row>
            <Row class="batchAdditionMain">
                <i-Col span="16" style="height: 100%;">
                    <div style="border-right: 1px solid #ddd;height: 100%;">
                        <Dispatch ref="Dis" :orgId="currentUser.orgId" :orgName="currentUser.orgName" :userId="currentUser.userId" @orgSelected="orgSelected" :disabled="!orgTreeCheck"></Dispatch>
                    </div>
                </i-Col>
                <i-Col span="8" class="batchAdditionUpload">
                    <div class="img-wrap">
                        <p class="img-wrap__name" v-if="fileInput && fileInput.value">{{fileName}}</p>
                        <p class="img-wrap__name" v-else>仅上传Excel批量添加数据</p>
                        <input type="file" ref="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" id="uploadFile" name="uploadFile" @change="fileChange()">
                    </div>


                    <!--<div>-->
                        <!--<BSUpload :beforeUpload="beforeUpload" :onSuccess="onSuccess" :type="['xls','xlsx']">-->
                            <!--<div class="upload">-->
                                <!--<div class="oss-wrap">-->
                                    <!--<img src="../../image/upload-excel.png" alt="">-->
                                    <!--<p style="line-height: 20px;" v-if="!ossObj.name">仅上传Excel批量添加数据</p>-->
                                    <!--<p style="line-height: 20px;"v-else>{{ossObj.name}}</p>-->
                                <!--</div>-->
                            <!--</div>-->
                        <!--</BSUpload>-->
                    <!--</div>-->

                </i-Col>
            </Row>
            <Row style="text-align: center; margin-top: 20px;">
                <i-Col span="24">
                    <Button type="primary" @click="upload()">保存</Button>
                    <!--<Button type="primary" @click="saveOss()">保存Oss</Button>-->
                    <Button type="primary" @click="handleReset()" >重置</Button>
                </i-Col>
            </Row>
        </div>
        <div class="batchComplete" v-else>
            <img width="120" src="../../image/resultImg.png" alt="">
            <div style="margin-top: 20px; text-align: center; line-height: 30px;">
                <div style="display: inline-block; text-align: left;">
                    您本次总共上传数：{{resultObj.total || 0}}条 ，成功数据：{{resultObj.rightSize || 0}}条，失败数据：{{resultObj.errorSize || 0}}条，重复数据：{{resultObj.repetitionSize || 0}}条<br/>
                    <a :href="$updateConfig.file+resultObj.ossResult" class="add-template-btn" v-if="resultObj.ossResult != '0'">请下载失败数据，查看具体原因，</a>感谢你的使用。
                </div>
            </div>
            <div style="text-align: center; padding-top: 50px;"><Button type="primary" @click="resultOk">知道了</Button></div>
        </div>
        <!--<div class="mark">-->
            <!--<div class="looding">-->
                <!--<div style="color: #ccc;">Uploading...Please Wait.{{loodWidth/200*100 + '%'}}</div>-->
                <!--<div class="looding-wrap">-->
                    <!--<div class="lood" :style="{'width': loodWidth + 'px'}"></div>-->
                <!--</div>-->
            <!--</div>-->
        <!--</div>-->

        <template v-if="status !== 'finished'">
            <div class="upload-process-item">
                上传中……
                <Progress style="width: 70%" :percent="percentage" hideInfo></Progress>
            </div>
        </template>
    </div>
</template>

<script>
    import Dispatch from './dispatchNew.vue';
    import clueUploadTemplate from '../clueManagement/clueUploadTemplate.vue'; // 下载 excel 模版
    import axios from 'axios';

    export default {
        props: {
            addFlagOld: null,
            addFlag: null,
            clueId: null,
            addType: null
        },
        data: function () {
            return {
                result: false,
//                batch:{
//                    userId: '930690320951750657',
//                    realName: '王小兰',
//                    orgId: '918012303725584385',
//                    orgName: '宝盛广场店',
//                    phone: '18792145066',
//                },
                batch:{
                    userId: '',
                    realName: '',
                    orgId: '',
                    orgName: '',
                    phone: '',
                },
                resultObj: {
                    ossResult: '999528689120506881'
                },
                formData: null,
                percentage: 0,
                status: 'finished',
                loodWidth: 100,
                fileInput: null,
                fileName: '',
                timer: null,
                ossObj: {
                    id: '',
                    name: ''
                },
                currentUser:{
                    orgId: '',
                    orgName: '',
                    userId: ''
                },
                orgTreeCheck: false, // 组织树是否可修改编辑
            }
        },
        created: function () {
            this.currentUser.orgId = this.$context._organization.id;
            this.currentUser.orgName = this.$context._organization.name;
            this.currentUser.userId = this.$context._user.id;
            this.getGatewayHost();
//            var request = new XMLHttpRequest();
            //            request.send(this.formData);
            this.formData = new FormData();
//            window.open(this.$updateConfig.file+'998489275140801537');
        },
        mounted () {

        },
        methods: {
            /*上传*/
            beforeUpload:function(f){
                this.ossObj.name = f.name;
            },
            onSuccess:function(id){
                this.ossObj.id = id;
            },


            fileChange() {
//                this.fileInput = document.getElementById("fileInput");
                this.fileInput = this.$refs.file;
                this.fileName = this.fileInput.files[0].name;
                this.formData.append('uploadFile', this.fileInput.files[0]);
            },
            orgSelected(item) {
                this.batch = item;
            },
            handleReset() {
//                if(this.fileInput)this.fileInput.value = null; //虽然file的value不能设为有字符的值，但是可以设置为空值
                if(this.$refs.Dis)this.$refs.Dis.search();
                this.batch = {
                    userId: '',
                    realName: '',
                    orgId: '',
                    orgName: '',
                    phone: '',
                };
            },
            resultOk() {
                this.result = false;
                this.handleReset();
            },
            save() {
                if(!this.batch.userId){
                    this.$Message.warning('请选择商机提供人!');
                    return
                }
                if(!this.fileInput || !this.fileInput.value){
                    this.$Message.warning('请选择文件!');
                    return
                }
                if( this.fileInput.files[0].type!="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && this.fileInput.files[0].type!="application/vnd.ms-excel" ){
                    alert("只能上传.xls和.xlsx的文件！");
                    return
                }
                /*上传进度条*/
                this.status = '';
                window.clearInterval(this.timer)
                this.timer = setInterval( () =>{
                    if(this.percentage<80){
                        this.percentage += 10;
                    }else{
                        window.clearInterval(this.timer);
                    }
                },100);
                this.request({
                    url: '/crm/myCollection/saveBatchAddition.do',
                    param: {
                        userId: this.batch.userId,
                        realName: this.batch.realName,
                        orgId: this.batch.orgId,
                        orgName: this.batch.orgName,
                        phone: this.batch.phone,
                    },
                    data: this.formData,
                    headers: {'Content-Type': 'multipart/form-data'}
                }).then(data => {
                    this.resultObj = data;
                    window.clearInterval(this.timer);
                    this.percentage = 100;
                    this.status = 'finished';
                    this.result = true;
                })
            },
            saveOss() {
                if(!this.batch.userId){
                    this.$Message.warning('请选择商机提供人!');
                    return
                }
                if(!this.ossObj.id){
                    this.$Message.warning('请选择文件!');
                    return
                }


                this.request({
                    url: '/crm/myCollection/saveBatchAdditionOss.do',
                    data: {
                        fileName: this.ossObj.name,
                        ossId: this.ossObj.id,
                        userId: this.batch.userId,
                        realName: this.batch.realName,
                        orgId: this.batch.orgId,
                        orgName: this.batch.orgName,
                        phone: this.batch.phone,
                    },
                }).then(data => {
                    this.resultObj = data;
                    this.result = true;
                })
            },
            async upload() {
                if(!this.batch.userId){
                    this.$Message.warning('请选择商机提供人!');
                    return
                }
                if(!this.fileInput || !this.fileInput.value){
                    this.$Message.warning('请选择文件!');
                    return
                }
                if( this.fileInput.files[0].type!="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && this.fileInput.files[0].type!="application/vnd.ms-excel" ){
                    alert("只能上传.xls和.xlsx的文件！");
                    return
                }
                /*上传进度条*/
                this.status = '';
                window.clearInterval(this.timer)
                this.timer = setInterval( () =>{
                    if(this.percentage<80){
                        this.percentage += 10;
                    }else{
                        window.clearInterval(this.timer);
                    }
                },100);
                if (!this.gatewayHost) {
                    await this.getGatewayHost();
                }
//                let formData = new FormData();
//
//                formData.append('uploadFile', document.querySelector('#uploadFile').files[0]);

                axios({
                    method: 'post',
                    url: `${this.gatewayHost}/crm-api/excel/importCompanyOpportunityOssByParam2`,
                    headers: {
                        token: this.$context.getToken()
                    },
                    data: this.formData,
                    params: {
                        userId: this.batch.userId,
                        realName: this.batch.realName,
                        orgId: this.batch.orgId,
                        orgName: this.batch.orgName,
                        phone: this.batch.phone,
                    }
                }).then(data => {
                    this.resultObj = data.data.data;
                    window.clearInterval(this.timer);
                    this.percentage = 100;
                    this.status = 'finished';
                    this.result = true;
                });
            },
            getGatewayHost() {
                let url = window.location.origin;

                if (url.indexOf('boss') > -1) {
                    this.gatewayHost = url;
                } else {
                    this.request({
                        url: '/crm/clueManagement/gatewayHost.do'
                    }).then(gatewayHost => {
                        this.gatewayHost = `http://${gatewayHost}`;
                    });
                }
            }

        },
        components: {
            Dispatch,
            clueUploadTemplate
        },
        filters: {
            cutString(val) {
                if(val.length>21) {
                    val = val.slice(0,21);
                    val = val+'...'
                }
                return val;
            },
        },
    };
</script>

<style scoped>
    .batchAddition {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    .batchAdditionMain {
        flex: 1;
        overflow: auto;
    }
    .batchAdditionHeader,
    .batchAdditionMain {
        padding: 0 6px;
    }
    .batchAdditionUpload {
    }
    .header{
        line-height: 60px;
    }
    .oss-wrap{
        width: 170px;
        height: 150px;
        border: dashed 1px #ccc;
        margin: 100px 0 50px 60px;
        text-align: center;
        cursor: pointer;
    }
    .oss-wrap img{
        width: 70px;
        display: block;
        margin: 20px auto;
    }
    .img-wrap {
        position: relative;
        margin: 100px auto 50px;
        width: 160px;
        height: 150px;
        text-align: center;
        border: dashed 1px #ccc;
        background: url(../../image/upload-excel.png) no-repeat center 40px;
        background-size: 45px;
    }
    .img-wrap:hover {
        box-shadow: 0 2px 8px #ddd;
    }
    .img-wrap__name {
        margin-top: 100px;
    }
    .img-wrap input{
        width: 160px;
        height: 150px;
        position: absolute;
        left: 0;
        top: 0;
        cursor: pointer;
        opacity: 0;
    }
    .img-wrap img{
        width: 70px;
        display: block;
        margin: 20px auto;
    }
    .mark{
        display: none;
        position: fixed;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        left: 0;
        top: 0;
        z-index: 100;
    }
    .mark .looding{
        width: 240px;
        padding: 20px;
        background: #f0f0f0;
        margin: 200px auto;
        text-align: center;
    }
    .mark .looding-wrap{
        width: 200px;
        height: 20px;
        margin: 0 auto;
        background: #c3c4cf;
        text-align: center;
        border-radius: 8px;
    }
    .mark .lood{
        width: 20px;
        height: 20px;
        background: #24f63c;
        border-radius: 8px;
    }
    .upload-process-item {
        position: fixed;
        top: 200px;
        width: 400px;
        left: 50%;
        margin-left: -200px;
        padding: 16px;
        border-radius: 4px;
        box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
        background: #fff;
        line-height: 1;
        overflow: hidden;
        z-index: 11;
    }
    .checkbox {
        margin-left: 30px;
    }
    .batchComplete {
        height: 90%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>