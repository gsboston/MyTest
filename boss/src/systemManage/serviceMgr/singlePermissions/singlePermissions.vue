<template>
    <div class="content">
        <Row>
            <i-col span="8" class="baseInfo-box">
                <header class="org-header">
                    <span>接单岗位列表</span>
                </header>
                <br>
                <div>
                    <ButtonGroup>
                        <Button @click="editOrUpdate('add')">新增</Button>
                        <Button type="ghost" :disabled="!this.selectedOrders" @click="editOrUpdate('update')">修改</Button>
                        <Button type="ghost" :disabled="!this.selectedOrders" v-if="this.selectedOrders&&this.selectedOrders.state=='ENABLE'" @click="removeServiceProvider">停用</Button>
                        <Button @click="enablePost" type="ghost" v-if="this.selectedOrders&&this.selectedOrders.state=='DISABLED'" :disabled="!this.selectedOrders">启用</Button>
                    </ButtonGroup>
                    <Checkbox style="float: right;padding-top: 5px;" v-model="isShowStop" @on-change="changeShow">是否显示停用</Checkbox>
                </div>
                <br>
                <Table height="600" ref="serviceTable" size="small" :data="ordersData"  :columns="ordersList" highlight-row @on-row-click="currentServiceChange"></Table>
                <br/>
                <Page size="small" :total="ordersDataTotal"  :current="ordersDataPage" @on-change="changeServicePage"></Page>
            </i-col>
            <i-col span="7" class="baseInfo-box">
                <header class="org-header">
                    <span>岗位人员列表</span>
                </header>
                <br>
                <div>
                    <Button type="primary" @click="transferModal('personnel')" :disabled="!this.selectedOrders" >选择人员</Button>
                </div>
                <br>
                <div class="staff-box">
                    <Tag class="staffTag" v-for="(item, index) in personnelData" :key="item.id">{{item.realName}}</Tag>
                </div>
                <br/>
                <Page size="small" :total="personnelDataTotal" :page-size="12" :current="personnelDataPage" @on-change="changeServiceProviderPage"></Page>
            </i-col>
            <i-col span="9" class="baseInfo-box">
                <header class="org-header">
                    <span>可接服务单列表</span>
                </header>
                <br>
                <div>
                    <Button  @click="transferModal('service')" :disabled="!this.selectedOrders">选择服务单</Button>
                </div>
                <br>
                <Table height="600" ref="serviceListTable" size="small" :data="serviceListData" :columns="serviceList" highlight-row @on-row-click="currentServiceProviderChange"></Table>
                <br/>
                <Page size="small" :total="serviceListDataTotal" :current="serviceListDataPage" @on-change="changeServiceListPage"></Page>
            </i-col>
            <div class="baseInfo-tools">
                <span>接单权限：</span>
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
        <!--<div class="left">-->
            <!--<Row>-->
                <!--<i-col span="24">-->
                    <!--<header class="org-header">-->
                        <!--<span>接单岗位列表</span>-->
                    <!--</header>-->
                <!--</i-col>-->
            <!--</Row>-->
            <!--<br/>-->
            <!--<Row>-->
                <!--<i-col span="24">-->
                    <!--<ButtonGroup>-->
                        <!--<Button @click="editOrUpdate('add')">新增</Button>-->
                        <!--<Button type="ghost" :disabled="!this.selectedOrders" @click="editOrUpdate('update')">修改</Button>-->
                        <!--<Button type="ghost" :disabled="!this.selectedOrders" v-if="this.selectedOrders&&this.selectedOrders.state=='ENABLE'" @click="removeServiceProvider">停用</Button>-->
                        <!--<Button @click="enablePost" type="ghost" v-if="this.selectedOrders&&this.selectedOrders.state=='DISABLED'" :disabled="!this.selectedOrders">启用</Button>-->
                    <!--</ButtonGroup>-->
                    <!--<Checkbox style="float: right;padding-top: 5px;" v-model="isShowStop" @on-change="changeShow">是否显示停用</Checkbox>-->
                <!--</i-col>-->
            <!--</Row>-->
            <!--<br/>-->
            <!--<Row>-->
                <!--<i-col span="24">-->
                    <!--<Table ref="serviceTable" size="small" :data="ordersData"  :columns="ordersList" highlight-row @on-row-click="currentServiceChange"></Table>-->
                    <!--<br/>-->
                    <!--<Page size="small" :total="ordersDataTotal"  :current="ordersDataPage" @on-change="changeServicePage"></Page>-->
                <!--</i-col>-->
            <!--</Row>-->
        <!--</div>-->
        <!--<div class="center">-->
            <!--<div>-->
                <!--<Row>-->
                    <!--<i-col span="24">-->
                        <!--<header class="org-header">-->
                            <!--<span>岗位人员列表</span>-->
                        <!--</header>-->
                        <!--<Button type="ghost" style="position: absolute;top: 0px;right: 0px;background: #FFF;z-index: 2;border: 0;" @click="isShowLeadPage = true">-->
                            <!--操作指引-->
                            <!--<Icon type="document-text"></Icon>-->
                        <!--</Button>-->
                    <!--</i-col>-->
                <!--</Row>-->
                <!--<br/>-->
                <!--<Row>-->
                    <!--<i-col span="24">-->
                        <!--<ButtonGroup>-->
                            <!--<Button type="primary" @click="transferModal('personnel')" :disabled="!this.selectedOrders" >选择人员</Button>-->
                        <!--</ButtonGroup>-->
                    <!--</i-col>-->
                <!--</Row>-->
                <!--<br/>-->
                <!--<Row>-->
                    <!--<i-col span="24">-->
                        <!--<div class="staff-box">-->
                            <!--<Tag class="staffTag" v-for="(item, index) in personnelData" :key="item.id">{{item.realName}}</Tag>-->

                        <!--</div>-->
                        <!--<br/>-->
                        <!--<Page size="small" :total="personnelDataTotal" :page-size="12" :current="personnelDataPage" @on-change="changeServiceProviderPage"></Page>-->
                    <!--</i-col>-->
                <!--</Row>-->
            <!--</div>-->
            <!--<div>-->
                <!--<Row>-->
                    <!--<i-col span="24">-->
                        <!--<header class="org-header">-->
                            <!--<span>可接服务单列表</span>-->
                        <!--</header>-->
                    <!--</i-col>-->
                <!--</Row>-->
                <!--<br/>-->
                <!--<Row>-->
                    <!--<i-col span="24">-->
                        <!--<ButtonGroup>-->
                            <!--<Button  @click="transferModal('service')" :disabled="!this.selectedOrders">选择服务单</Button>-->
                        <!--</ButtonGroup>-->
                    <!--</i-col>-->
                <!--</Row>-->
                <!--<br/>-->
                <!--<Row>-->
                    <!--<i-col span="24">-->
                        <!--<Table ref="serviceListTable" size="small" :data="serviceListData" :columns="serviceList" highlight-row @on-row-click="currentServiceProviderChange"></Table>-->
                        <!--<br/>-->
                        <!--<Page size="small" :total="serviceListDataTotal" :current="serviceListDataPage" @on-change="changeServiceListPage"></Page>-->
                    <!--</i-col>-->
                <!--</Row>-->
            <!--</div>-->
        <!--</div>-->

        <!-- 引导页 -->
        <div v-show="isShowLeadPage" class="lead-page">
            <component is="LPSinglePermissions" @on-hide-page="hideLeadPage"></component>
        </div>
    </div>
</template>

<script type="text/babel">
    import LPSinglePermissions from "../../leadPage/LPSinglePermissions";

    export default {
        data () {
            return {
                isShowStop:false,
                ordersList: [
                    {title: '编码', align: 'center', key: 'code'},
                    {title: '接单岗位名称', align: 'center', key: 'name'},
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
                ordersData:[],
                selectedOrders: null,
                ordersDataTotal: 0,
                ordersDataPage: 1,
                personnelData:[],
                personnelDataTotal: 0,
                personnelDataPage: 1,
                serviceList: [
                    {title: '编码', align: 'center', key: 'code'},
                    {title: '服务单类型', align: 'center', key: 'name'},
                    {
                        title: '是否启用',
                        key: 'disable',
                        width:'30%',
                        align:"center",
                        render:(h, params) => {
                            return h('Checkbox',{
                                props:{
                                    value:!(params.row.disable == true),
                                    disabled:true
                                }
                            });
                        }
                    }
                ],
                serviceListData:[],
                serviceListDataTotal: 0,
                serviceListDataPage: 1,
                sureServiceList: [
                    {title: '编码', align: 'center', key: 'code'},
                ],

                isShowLeadPage: false,
                checkKey: 'ORDER_RIGHTS_MANAGEMENT',
                receivePostTotal:0,
                orgInfo: {},
                permissionState:false
            }
        },
        watch: {
            selectedOrders (value) {
                this.selectedOrders = value;
                this.personnelData = [];
                this.serviceListData = [];
                this.personnelDataTotal = 0;
                this.personnelDataPage = 1;
                if (value) {
                    this.getPersonnelListData();
                    this.getServiceListData();
                }
            }
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
            this.getOrderseData();
            this.getOrgInfo();
        },
        methods: {
            getPermission() {
                this.request({
                    url: `/systemManage/organization/getPermissionState.do`,
                    param: {
                        orgId: this.orgInfo.id,
                        type: 'RECEIVE'
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
                    url: '/systemManage/post/getRecevPostList.do',
                    param: {
                        size: 6
                    }
                }).then(data => {
                    this.recevPostTotal = data.total;
                    if (state && this.recevPostTotal == 0) {
                        this.$Message.warning("设置好接单人员后方可开启");
                        this.$nextTick(() => {
                            this.permissionState = false;
                        });
                    }else{
                        let saveData = {
                            orgId: this.orgInfo.id,
                            type: 'RECEIVE',
                            value: state ? 'ENABLE' :'DISABLE'
                        };
                        this.$Modal.confirm({
                            content: state?'开启接单权限后，仅“接单权限”列表中账号可接单，确定开启吗？':'关闭接单权限后，组织成员中接单岗位人员均可接单，确定关闭吗？',
                            onOk: () => {
                                this.request({
                                    url: '/systemManage/organization/updatePermission.do',
                                    data: saveData
                                }).then(() => {
                                    if (state) {
                                        this.$Message.success("接单权限已开启");
                                    }else {
                                        this.$Message.success("接单权限已关闭");
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
            changeShow(){
                this.getOrderseData();
            },
            enablePost(){
                this.request({
                    url: "/systemManage/serviceSend/startPost.do?id="+this.selectedOrders.id
                }).then(data => {
                    this.$Message.success('启用成功');
                    this.getOrderseData();
                });
            },
            /** 数据获取函数 -- Data */
            getOrderseData () {
                this.request({
                    url: `/systemManage/service/ordersList.do`,
                    param: {
                        type: 'RECEIVE',
                        page:this.ordersDataPage,
                        size:10,
                        state:this.isShowStop?'':'ENABLE'
                    }
                }).then(data => {
                    if(data){
                        this.ordersData = data.records;
                        this.ordersDataTotal = data.total;
                    }else{
                        this.ordersData = [];
                    }
                });
            },
            getServiceListData () {
                this.request({
                    url: `/systemManage/service/postBillDefPage.do`,
                    param: {
                        id:this.selectedOrders.id,
                        page:this.serviceListDataPage,
                        size:10,
                    }
                }).then(data => {
                    if(data){
                        this.serviceListData = data.records;
                        this.serviceListDataTotal = data.total;
                    }
                });
            },
            getPersonnelListData () {
                if( this.selectedOrders){
                    this.request({
                        url: `/systemManage/service/personnelList.do`,
                        param: {
                            id:this.selectedOrders.id,
                            page:this.personnelDataPage,
                            size:12
                        }
                    }).then(data => {
                        if(data){
                            this.personnelData = data.records;
                            this.personnelDataTotal = data.total;
                        }
                    });
                }
            },
            /** 组件操作函数 -- Event */
            currentServiceChange(currentRow){
                if (this.selectedOrders) {
                    if (this.selectedOrders.id == currentRow.id) {
                        this.selectedOrders = null;
                        this.$refs['serviceTable'].clearCurrentRow();
                    }else {
                        this.selectedOrders = currentRow;
                    }
                }else {
                    this.selectedOrders = currentRow;
                }
            },
            changeServicePage (pageIndex) {
                this.ordersDataPage = pageIndex;
                this.getOrderseData();
            },
            currentServiceProviderChange(currentRow){
                if (this.selectedOrdersProvider) {
                    if (this.selectedOrdersProvider.id == currentRow.id) {
                        this.selectedOrdersProvider = null;
                        this.$refs['serviceProviderTable'].clearCurrentRow();
                    }else {
                        this.selectedOrdersProvider = currentRow;
                    }
                }else {
                    this.selectedOrdersProvider = currentRow;
                }
            },
            changeServiceProviderPage (pageIndex) {
                this.personnelDataPage = pageIndex;
                this.getPersonnelListData();
            },
            changeServiceListPage (pageIndex) {
                this.serviceListDataPage = pageIndex;
                this.getServiceListData();
            },
            editOrUpdate (operateType) {
                let _title = '', _props = {};
                if (operateType == 'add') {
                    _title = '新增接单岗位';
                    _props = {
                        contractId: 1
                    };
                }else if (operateType == 'update') {
                    _title = '修改接单岗位';
                    _props = {
                        data: this.selectedOrders
                    };
                }
                this.prompt({
                    code: 'singlePermissionsCard',
                    title: _title,
                    width: 600,
                    height: 200,
                    props: _props,
                    callback: (status, close) => {
                        close();
                        this.getOrderseData();
                        this.personnelData = [];
                        this.serviceListData = [];
                        this.selectedOrders = null;
                    }
                })
            },
            /*选择人员列表*/
            transferModal (type) {
                let _title = '', _props = {};
                if (type === 'personnel') {
                    _title = '选择人员';
                    _props = {
                        choiceType:type,
                        selectedOrders: this.selectedOrders
                    };
                }else if (type === 'service') {
                    _title = '选择服务单';
                    _props = {
                        choiceType:type,
                        selectedOrders: this.selectedOrders
                    };
                }
                this.prompt({
                    code: 'singlePermissionsPersonnel',
                    title: _title,
                    width: 600,
                    height: 300,
                    props: _props,
                    callback: (status, close) => {
                        close();
                        if (type === 'personnel') {
                            this.getPersonnelListData();
                        }else if (type === 'service') {
                            this.getServiceListData();
                        }
                    }
                })
            },
            removeServiceProvider () {
                //停用接单岗位
                this.$Modal.confirm({
                    content: '确定停用吗?',
                    onOk: () => {
                        this.selectedOrders.state = "DISABLED";
                        this.request({
                            url: "/systemManage/service/save.do",
                            data: this.selectedOrders
                        }).then(() => {
                            this.$Message.success('停用成功');
                            this.getOrderseData();
                        });
                    }
                });
            },
            hideLeadPage() {
                this.isShowLeadPage = false;
            }
        },
        components: {
            LPSinglePermissions
        }
    };
</script>

<style scoped>
    .content{
        padding: 20px 100px 20px 100px;
    }
    .baseInfo-box{
        padding: 40px 10px 0px 0px
    }
    .left {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 350px;
        padding: 15px;
        border-right: solid 1px #dddee1;
        overflow: auto;
    }
    .center {
        position: relative;
        margin-left: 350px;
        padding: 15px;
    }
    #departmentList .ivu-menu li {
        width: 100%;
        margin: 0;
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

    #departmentList > .ivu-tree > .ivu-tree-children > li > .ivu-tree-title {
        font-weight: 700;
    }

    .container >>> .ivu-table-body {
        overflow: hidden;
    }
    .staff-box{
        padding: 20px;
        width: 100%;
        height: 600px;
        border: 1px #dddee1 solid;
    }
    .staff-box div{
        margin-left: 10px;
        margin-right: 10px;
    }
    .staffTag{
        font-size: 14px;
        height: 40px;
        line-height: 40px;
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
    .baseInfo-tools{
        position: absolute;
        top: 5px;
        right: 0px;
    }
</style>