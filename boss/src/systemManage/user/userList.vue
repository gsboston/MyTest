<template>
    <div class="container">
        <div class="center">
            <Row>
                <i-col span="18">
                    <OrgDeptSearcher ref="orgDeptSearcher" @on-select="selectOrgForSearch"></OrgDeptSearcher>
                    <ButtonGroup>
                        <Button type="ghost" @click="addBtn">新增</Button>
                        <Button type="ghost" @click="editBtn" :disabled="!userId">修改</Button>
                        <Button type="ghost" @click="remove" :disabled="!userId">删除</Button>
                        <Button type="ghost" @click="resetPassword" :disabled="!userId">重置密码</Button>
                    </ButtonGroup>
                </i-col>
                <i-col span="6">
                    <Input placeholder="请输入用户名/手机号进行搜索" icon="search" v-model="searchText" @on-enter="getUserList(1)" @on-click="getUserList(1)"/>
                </i-col>
            </Row>
            <br/>
            <Table  size="small" :data="items" :columns="tableColumns" highlight-row  @on-current-change="selectionHandler"></Table>
            <br/>
            <Page size="small" :total="total" :current="current" @on-change="getUserList"></Page>
        </div>
        <div class="right">
            <RelatListRight ref="relatListRight" :userId="userId"></RelatListRight>
        </div>
    </div>
</template>

<script>
    import OrgDeptSearcher from "./orgDeptSearcher.vue";
    import RelatListRight from "./relationListRight.vue";

    export default {
        data () {
            return {
                items: [],
                userId: null,
                total: 0,
                current: 1,
                orgId: 0,
                deptId: 0,
                searchText: null,
                userName: null,
                tableColumns: [{
                    title: '用户名',
                    key: 'userName',
                    width: 200
                }, {
                    title: '姓名',
                    key: 'realName',
                    width: 200
                }, {
                    title: '联系电话',
                    key: 'phone'
                }]
            }
        },
        created:function(){
            this.getUserList();
        },
        methods:{
            getUserList (current = 1) {
                this.request({
                    url: "/systemManage/user/userlistInfo.do",
                    param: {
                        orgId: this.orgId,
                        deptId: this.deptId,
                        searchText: this.searchText,
                        current: current
                    }
                }).then(demand => {
                    if (demand) {
                        this.items = demand.records;
                        this.current = demand.current;
                        this.total = demand.total;
                    }else {
                        this.items = [];
                        this.current = 1;
                        this.total = 0;
                    }
                });
            },
            selectionHandler (item) {
                this.userId = item.id;
                this.userName = item.realName;
            },
            selectOrgForSearch (item) {
                this.orgId = item.orgId;
                this.deptId = item.deptId;
                this.getUserList();
            },
            remove () {
                this.$Modal.confirm({
                    content: '确定删除吗?',
                    onOk: () => {
                        this.request({
                            url: "/systemManage/user/userDelete.do",
                            param: {
                                id: this.userId
                            }
                        }).then(data => {
                            this.$Message.success('删除成功');
                            this.getUserList();
                        })
                    }
                });
            },
            resetPassword(){
                this.request({
                    url: "/systemManage/user/resetPassword.do",
                    param: {
                        userId: this.userId
                    }
                }).then(data => {
                    this.$Message.success('重置成功!');
                });
            },
            addBtn(){
                this.prompt({
                    title: '新增用户',
                    code: "userAddList",
                    width:600,
                    height:400,
                    props: {
                        orgId:this.orgId,
                        deptId:this.deptId
                    },
                    callback: (close) => {
                        close();
                        this.getUserList();
                    }
                });
            },
            editBtn(){
                this.prompt({
                    code: "userEditList",
                    width:600,
                    height:400,
                    props: {
                        id:this.userId,
                        orgId:this.orgId,
                        deptId:this.deptId
                    },
                    title: '用户修改',
                    callback: (close) => {
                        close();
                        this.getUserList();
                        this.$refs['relatListRight'].getOrgPostList();
                    }
                });
            },
        },
        components: {
            OrgDeptSearcher,
            RelatListRight
        }
    }
</script>

<style scoped>
    .center {
        position: relative;
        margin-right: 360px;
        padding: 15px;
    }
    .right {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        width: 360px;
        min-height: 100%;
        padding: 15px;
        border-left: solid 1px #f5f5f5;
    }

    .infoDiv{
        margin: 27px 0 0 0;
        border: solid 2px #ccc;
        padding: 10px;
        overflow: hidden;
    }
    .infoDiv label{
        margin:0 20px 0 12px;
    }
    .infoTitle{
        margin: 0 0 10px 0;
    }
    .saveBtn{
        margin: 20px 0 20px 0;
        float: right;
    }

</style>