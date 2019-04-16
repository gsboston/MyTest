<style scoped>
    .center {
        position: relative;
        padding: 15px;
    }
    .range-css >>> .ivu-tabs-bar{
        margin-bottom: 0;
    }
    .main-table >>> .ivu-table-cell{
        padding-left: 10px;
        padding-right: 10px;
    }
</style>
<template>
    <div class="container">
        <div class="center">
            <Row>
                <ButtonGroup>
                    <Button type="ghost" @click="addBtn">新增</Button>
                    <Button type="ghost" @click="editBtn" :disabled="!contractDefineId">修改</Button>
                    <Button type="ghost" @click="removeBtn" :disabled="!contractDefineId">删除</Button>
                    <Button type="ghost" @click="allotment" :disabled="!contractDefineId">签约配置</Button>
                    <Button type="ghost" @click="auditConfiguration" :disabled="!contractDefineId">审核配置</Button>
                </ButtonGroup>
                <!--<i-col span="5">-->
                    <!--<Input placeholder="请输入用户名搜索" icon="search" v-model="searchText" @on-enter="getUserList(1)" @on-click="getUserList(1)"/>-->
                <!--</i-col>-->
            </Row>
            <br/>
            <Row :gutter="16">
                <i-col span="14">
                    <Table size="small" class="main-table" :data="contractDefineList" :columns="tableColumns" highlight-row  @on-current-change="selectionHandler"></Table>
                    <br>
                    <Page size="small" :current="current" :total="total" :page-size="10" @on-change="changeCurrent"></Page>
                </i-col>
                <i-col v-show="contractDefineId" span="10">
                    <Tabs type="card" class="range-css" :active-key="this.activeKey" :animated="false" @on-click="changeType">
                        <TabPane label="使用范围" name="useRange">
                            <Table width="100%" size="small" :data="useRangeList" :columns="useRangeColumns"></Table>
                        </TabPane>
                        <TabPane label="签约主体" name="contractSubject">
                            <Table size="small" :data="contractSubjectList" :columns="contractSubjectColumns"></Table>
                        </TabPane>
                        <TabPane label="服务单" name="server">
                            <Table size="small" :data="serverList" :columns="serverColumns"></Table>
                        </TabPane>
                        <Page style="margin-top: 15px" size="small" :page-size="10" :total="typeInfoTotal" :current="typeInfoCurrent" @on-change="getTypeInfoList"></Page>
                    </Tabs>
                </i-col>
            </Row>
        </div>
    </div>
</template>

<script>

    export default {
        data () {
            return {
                contractDefineList: [],//合同定义列表
                useRangeList: [],//使用范围列表
                contractSubjectList: [],//合约主体列表
                serverList: [],//服务单列表
                contractDefineId: null,
                contractIsAutoApprove: null,
                total: 0,
                current: 1,
                activeKey: "useRange",
                typeInfoTotal: 0,
                typeInfoCurrent: 1,
                searchText: null,
                tableColumns: [
                    {title: '编码',key: 'code',align: 'center'},
                    {title: '名称',key: 'name'},
//                    {title: '标题',key: 'title',width: 200,align: 'center'},
                    {title: '合同主体数量',key: 'subjectCount',width: 110,align: 'center'},
                    {title: '派单方',key: 'dispatcherTypeName',width: 100,align: 'center'},
                    {title: '是否启用',key: 'isDisableName',width: 90,align: 'center'},
                    {title: '是否配置自动审核',key: 'isAutoApproveName',align: 'center'},
                ],
                useRangeColumns: [
                    {title: '区域编码',key: 'areaCode'},
                    {title: '区域',key: 'areaName',align: 'center'},
                    {title: '组织',key: 'orgName',align: 'center'}
                ],
                contractSubjectColumns: [
                    {title: '编码',key: 'orgCode',align: 'center'},
                    {title: '签约主体名称',key: 'orgName',align: 'center'}
                ],
                serverColumns: [
                    {title: '序号',key: 'idx'},
                    {title: '服务单类型',key: 'name',align: 'center'},
                    {title: '是否默认',key: 'isDefaultName',align: 'center'},
                    {title: '是否启用',key: 'isDisableName',align: 'center'}
                ]
            }
        },
        created:function(){
            this.$api.refreshList = this.refreshList;
            this.getContractDefineList();
        },
        methods:{
            //获取合约定义列表
            changeCurrent(page) {
                this.current = page;
                this.getContractDefineList();
            },
            getContractDefineList () {
                this.request({
                    url: "/systemManage/contractDefine/contractDefine.do",
                    param: {
                        pageNum: this.current,
                    }
                }).then(demand => {
                    this.current = demand.current;
                    this.total = demand.total;
                    for(var i=0;i<demand.data.length;i++){
                        if(demand.data[i].isEnabled){
                            demand.data[i].isDisableName = "是";
                        }else{
                            demand.data[i].isDisableName = "否";
                        }
                        if(demand.data[i].isAutoApprove){
                            demand.data[i].isAutoApproveName = "是";
                        }else{
                            demand.data[i].isAutoApproveName = "否";
                        }
                        if(demand.data[i].dispatcherType && demand.data[i].dispatcherType == "SALE"){
                            demand.data[i].dispatcherTypeName = "销售组织";
                        }else if(demand.data[i].dispatcherType && demand.data[i].dispatcherType == "SIGNED"){
                            demand.data[i].dispatcherTypeName = "签约主体";
                        }else{
                            demand.data[i].dispatcherTypeName = "未设置";
                        }
                    }
                    this.contractDefineList = demand.data;
                });
            },
            selectionHandler (item) {
                this.contractDefineId = item.id;
                this.contractIsAutoApprove = item.isAutoApprove;
                this.getTypeInfoList(1);
            },
            getUseRangeList (contractDefineId) {
                this.request({
                    url: "/systemManage/contractDefine/getUseRangeList.do",
                    data:{
                        id:contractDefineId,
                        current:this.typeInfoCurrent
                    }
                }).then(demand => {
                    this.typeInfoCurrent = demand.current;
                    this.typeInfoTotal = demand.total;
                    if(demand && demand.records){
                        this.useRangeList = demand.records;
                    }else{
                        this.useRangeList = [];
                    }
                });
            },
            //获取合约主体列表
            getContractSubjectList (contractDefineId) {
                this.request({
                    url: "/systemManage/contractDefine/getContractSubjectList.do",
                    data:{
                        id:contractDefineId,
                        current:this.typeInfoCurrent
                    }
                }).then(demand => {
                    this.typeInfoCurrent = demand.current;
                    this.typeInfoTotal = demand.total;
                    if(demand && demand.records){
                        this.contractSubjectList = demand.records;
                    }else{
                        this.contractSubjectList = [];
                    }
                });
            },
            //获取服务单列表
            getServerList (contractDefineId) {
                this.request({
                    url: "/systemManage/contractDefine/getServerList.do",
                    data:{
                        id:contractDefineId,
                        current:this.typeInfoCurrent
                    }
                }).then(demand => {
                    this.typeInfoCurrent = demand.current;
                    this.typeInfoTotal = demand.total;
                    if(demand && demand.records){
                        for(var i=0;i<demand.records.length;i++){
                            if(demand.records[i].isDefault){
                                demand.records[i].isDefaultName = "是";
                            }else{
                                demand.records[i].isDefaultName = "否";
                            }
                        }
                        //郝鹏订的后台数据库  服务单是否启用的值是反的
                        for(var i=0;i<demand.records.length;i++){
                            if(demand.records[i].disable){
                                demand.records[i].isDisableName = "否";
                            }else{
                                demand.records[i].isDisableName = "是";
                            }
                        }
                        this.serverList = demand.records;
                    }else{
                        this.serverList = [];
                    }
                });
            },
            //切换使用范围/签约主体/服务单类型
            changeType (key) {
                if(this.activeKey == key){
                    return;
                }
                this.$set(this,"activeKey",key);
                this.getTypeInfoList(1);
            },
            //使用范围/签约主体/服务单列表
            getTypeInfoList (page) {
                this.typeInfoCurrent = page;
                if(this.activeKey == "useRange"){
                    this.getUseRangeList(this.contractDefineId);
                }else if(this.activeKey == "contractSubject"){
                    this.getContractSubjectList(this.contractDefineId);
                }else if(this.activeKey == "server"){
                    this.getServerList(this.contractDefineId);
                }
            },
            removeBtn () {
                this.$Modal.confirm({
                    content: '确定删除吗?',
                    onOk: () => {
                        this.request({
                            url: "/systemManage/contractDefine/contractDefineDelete.do",
                            param: {
                                id: this.contractDefineId
                            }
                        }).then(() => {
                            this.$Message.success('删除成功');
                            this.contractDefineId = null;
                            this.getContractDefineList();
                        })
                    }
                });
            },
            allotment(){
                this.prompt({
                    code: "allotmentPage",
                    width:800,
                    height:500,
                    title: '分配页面',
                    props: {
                        contractDefId: this.contractDefineId
                    },
                    callback: (close) => {
                        close();
                        this.getContractDefineList();
                    }
                });
            },
            auditConfiguration () {
                this.prompt({
                    code: "auditConfigurationPage",
                    width:800,
                    height:500,
                    title: '自动审核规则配置',
                    props: {
                        contractDefId: this.contractDefineId,
                        contractIsAutoApprove: this.contractIsAutoApprove,
                    },
                    afterClose: this.getContractDefineList,
                });
            },
            addBtn(){
                this.prompt({
                    code: "F0516",
                    width:800,
                    height:520,
                    title: '新增合同定义',
                    callback: (close) => {
                        close();
                        this.getContractDefineList();
                    }
                });
            },
            editBtn(){
                this.prompt({
                    code: "F0516",
                    width:800,
                    height:520,
                    title: '修改合同定义',
                    props: {
                        contractDefineId:this.contractDefineId,
                    },
                    callback: (close) => {
                        close();
                        this.contractDefineId = null;
                        this.getContractDefineList();
                    }
                });
            },
            refreshList (contractDefineId) {
                for(var i=0;i<this.contractDefineList.length;i++){
                    if(this.contractDefineList[i].id == contractDefineId){
                        this.selectionHandler(this.contractDefineList[i]);
                    }
                }
            }
        },
    }
</script>