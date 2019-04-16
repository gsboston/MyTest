<style scoped>
    .content{
        padding: 20px 100px 20px 100px;
    }
    .baseInfo-box{
        padding: 40px 10px 0px 0px
    }
    .baseInfo-title{
        font-size: 18px;
        font-weight: bold;
    }
    .personTag{
        font-size: 16px;
        height: 40px;
        line-height: 40px;
    }
    .baseInfo-person-box{
        overflow: auto;
        padding: 20px;
        width: 100%;
        height: 600px;
        border: 1px #dddee1 solid;
    }
    .baseInfo-person-box div{
        margin-left: 10px;
        margin-right: 10px;
    }
    .baseInfo-form-input2{
        width: 340px;
    }
    .baseInfo-form-input{
        width: 700px;
    }

    /*引导页*/
    .lead-page {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 10;
    }

    .org-header{
    }

    .org-header:before {
        content: "";
        display: block;
        width: 95%;
        height: 1px;
        background: #eee;
        position: absolute;
        top: 50px;
        left: 5px;
    }

    .org-header span {
        display: inline-block;
        background: #fff;
        padding: 0 10px 0 10px;
        position: relative;
        margin-left: 30px;
        font-size: 16px;
        font-weight: 600;
    }
    .baseInfo-tools{
        position: absolute;
        top: 5px;
        right: 0px;
    }
</style>
<template>
    <div class="content">
        <Row>
            <i-col span="8" class="baseInfo-box">
                <header class="org-header">
                    <span>派单岗位列表</span>
                </header>
                <br>
                <div>
                    <ButtonGroup>
                        <Button @click="add">新增</Button>
                        <Button @click="edit" type="ghost" :disabled="selectedPosition==''">修改</Button>
                        <Button @click="start" type="ghost" v-if="selectedPosition.state=='DISABLED'" :disabled="selectedPosition==''">启用</Button>
                        <Button @click="stop" type="ghost" v-if="selectedPosition.state=='ENABLE'" :disabled="selectedPosition==''">停用</Button>
                    </ButtonGroup>
                    <Checkbox style="float: right;padding-top: 5px;" v-model="isShowStop" @on-change="changeShow">是否显示停用</Checkbox>
                </div>
                <br>
                <div>
                    <Table height="600" highlight-row :columns="sendPermissionColumns" :data="sendPermissionList" @on-current-change="selectPermissionTable"></Table>
                </div>
            </i-col>
            <i-col span="7" class="baseInfo-box">
                <header class="org-header">
                    <span>岗位人员列表</span>
                </header>
                <br>
                <div>
                    <Button type="ghost"  :disabled="selectedPosition==''" @click="choosePerson">选择人员</Button>
                </div>
                <br>
                <div class="baseInfo-person-box">
                    <Tag class="personTag" v-for="person in personList" :key="person.id">{{person.realName}}</Tag>
                </div>
            </i-col>
            <i-col span="9" class="baseInfo-box">
                <header class="org-header">
                    <span>可派合约列表</span>
                </header>
                <br>
                <div>
                    <Button type="ghost":disabled="selectedPosition==''" @click="chooseAgreement">选择合约</Button>
                </div>
                <br>
                <div>
                    <Table height="600" :columns="agreementColumns" :data="agreementList"></Table>
                </div>
            </i-col>
            <div class="baseInfo-tools">
                <span>派单权限：</span>
                <i-switch v-model="permissionState" @on-change="permissionChange">
                    <span slot="open">开</span>
                    <span slot="close">关</span>
                </i-switch>
                <Button type="ghost" style="padding-left:40px;background: #FFF;z-index: 2;border: 0;" @click="isShowLeadPage = true">
                    操作指引
                    <Icon type="document-text"></Icon>
                </Button>
            </div>
        </Row>

        <!-- 引导页 -->
        <div v-show="isShowLeadPage" class="lead-page">
            <component is="LPServiceSendPermission" @on-hide-page="hideLeadPage"></component>
        </div>
    </div>
</template>

<script type="text/babel">
    import LPServiceSendPermission from '../../leadPage/LPServiceSendPermission';

    export default {
        data () {
            return {
                permissionState:false,
                isShowStop:false,
                selectedPosition:'',
                sendPermissionColumns:[
                    {
                        title: '编码',
                        key: 'code',
                        align:'center'
                    },
                    {
                        title: '派单岗位',
                        key: 'name',
                        width:"50%",
                        align:'center'
                    },
                    {
                        title: '是否启用',
                        key: 'disable',
                        width:'30%',
                        align:"center",
                        render:(h, params) => {
                            return h('Checkbox',{
                                props:{
                                    value:!(params.row.state=='DISABLED'),
                                    disabled:true
                                }
                            });
                        }
                    }
                ],
                sendPermissionList:[],
                personList:[],
                agreementList:[],
                agreementColumns:[
                    {
                        title: '编码',
                        key: 'code'
                    },
                    {
                        title: '合约名称',
                        key: 'name',
                        width:'50%'
                    }
                ],

                isShowLeadPage: false,
                checkKey: 'SEND_RIGHTS_MANAGEMENT',
                sendPostTotal:0,
                orgInfo: {}
            }
        },
        props: {
        },
        created: function () {
            //判断是否显示引导页
            this.request({
                url: '/systemManage/organization/checkUserVisitInfo.do',
                param: {
                    key: this.checkKey
                }
            }).then(data => {
                if (data) {
                    this.isShowLeadPage = false;
                }else {
                    this.isShowLeadPage = true;
                    this.request({
                        url: '/systemManage/organization/saveUserVisitInfo.do',
                        param: {
                            key: this.checkKey
                        }
                    }).then(() => {});
                }
            });
            this.loadPermissionList();
            this.getOrgInfo();
        },
        methods: {
            getPermission() {
                this.request({
                    url: `/systemManage/organization/getPermissionState.do`,
                    param: {
                        orgId: this.orgInfo.id,
                        type: 'DISPATCH'
                    }
                }).then(data => {
                    this.permissionState = data;
                });
            },
            getOrgInfo() {
                this.request({
                    url: `/systemManage/organization/currentOrgInfo.do`
                }).then(data => {
                    if (undefined !== data && null !== data){
                        this.orgInfo = data;
                        this.getPermission();
                    }
                });
            },
            permissionChange(state){
                this.request({
                    url: '/systemManage/post/getSendPostList.do',
                    param: {
                        size: 6
                    }
                }).then(data => {
                    this.sendPostTotal = data.total;
                    if (state && this.sendPostTotal == 0) {
                        this.$Message.warning("设置好派单人员后方可开启");
                        this.$nextTick(() => {
                            this.permissionState = false;
                        });
                    }else{
                        let saveData = {
                            orgId: this.orgInfo.id,
                            type: 'DISPATCH',
                            value: state ? 'ENABLE' :'DISABLE'
                        };
                        this.$Modal.confirm({
                            content: state?'开启派单权限后，仅“派单权限”列表中账号可派单，确定开启吗？':'关闭派单权限后，组织成员中派单岗位人员均可派单，确定关闭吗？',
                            onOk: () => {
                                this.request({
                                    url: '/systemManage/organization/updatePermission.do',
                                    data: saveData
                                }).then(() => {
                                    if (state) {
                                        this.$Message.success("派单权限已开启");
                                    }else {
                                        this.$Message.success("派单权限已关闭");
                                    }
                                    this.getPermission();
                                });
                            },
                            onCancel: () => {
                                this.permissionState = !this.permissionState;
                            }
                        });
                    }
                });

            },
            start(){
                this.request({
                    url: "/systemManage/serviceSend/startPost.do?id="+this.selectedPosition.id
                }).then(data => {
                    this.$Message.info("已启用该岗位");
                    this.loadPermissionList();
                    this.personList=[];
                    this.agreementList=[];
                    this.selectedPosition = '';
                });
            },
            changeShow(){
              this.loadPermissionList();
            },
            choosePerson(){
                this.prompt({
                    code: "F052701",
                    title:"选择人员",
                    width:500,
                    height:500,
                    props:{
                        id:this.selectedPosition.id
                    },
                    callback: (close) => {
                        this.loadPersonList();
                    }
                });
            },
            chooseAgreement(){
                this.prompt({
                    code: "F052702",
                    title:"选择合约",
                    width:500,
                    height:500,
                    props:{
                        id:this.selectedPosition.id
                    },
                    callback: (close) => {
                        this.loadAgreementList();
                    }
                });
            },
            loadAgreementList(){
                this.request({
                    url: "/systemManage/serviceSend/agreementList.do?id="+this.selectedPosition.id
                }).then(data => {
                    if(data==null)
                        data=[];
                    this.agreementList=data;
                });
            },
            loadPermissionList(){
                this.request({
                    url: "/systemManage/serviceSend/permissionList.do",
                    param:{
                        state:this.isShowStop?'':'ENABLE'
                    }
                }).then(data => {
                    if(data==null)
                        data=[];
                    this.sendPermissionList=data;
                });
            },
            add(){
                this.prompt({
                    code: "F052703",
                    title:"新增岗位",
                    width:400,
                    height:400,
                    props:{
                        servicePost:{
                            state:"ENABLE"
                        }
                    },
                    callback: (close) => {
                        this.loadPermissionList();
                        this.personList=[];
                        this.agreementList=[];
                        this.selectedPosition = '';
                        close();
                    }
                });
            },
            edit(){
                this.prompt({
                    code: "F052703",
                    title:"编辑岗位",
                    width:400,
                    height:400,
                    props:{
                        servicePost:this.selectedPosition
                    },
                    callback: (close) => {
                        this.loadPermissionList();
                        this.personList=[];
                        this.agreementList=[];
                        this.selectedPosition = '';
                        close();
                    }
                });
            },
            stop(){
                this.$Modal.confirm({
                    content: '确定停用吗?',
                    onOk: () => {
                        this.request({
                            url: "/systemManage/serviceSend/stopPost.do?id="+this.selectedPosition.id
                        }).then(data => {
                            this.$Message.info("已停用该岗位");
                            this.loadPermissionList();
                            this.personList=[];
                            this.agreementList=[];
                            this.selectedPosition = '';
                        });
                    }
                });

            },
            loadPersonList(){
                this.request({
                    url: "/systemManage/serviceSend/personList.do?id="+this.selectedPosition.id
                }).then(data => {
                    this.personList=data;
                });
            },
            selectPermissionTable(row){
                this.selectedPosition = row;
                this.loadPersonList();
                this.loadAgreementList();
            },
            hideLeadPage() {
                this.isShowLeadPage = false;
            }
        },
        components: {
            LPServiceSendPermission
        }
    };
</script>

