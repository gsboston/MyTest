<template>
    <div class="container">
        <div class="center">
            <Row>
                <i-col span="19">
                    <ButtonGroup>
                        <Button type="ghost" @click="addBtn">新增</Button>
                        <Button type="ghost" @click="remove" :disabled="!userId">删除</Button>
                        <Button type="ghost" @click="resetPassword" :disabled="!userId">重置密码</Button>
                    </ButtonGroup>
                </i-col>
            </Row>
            <br/>
            <Table  size="small" :data="items" :columns="tableColumns" highlight-row  @on-current-change="selectionHandler"></Table>
            <br/>
            <Page size="small" :total="total" :current="current" @on-change="getUserList"></Page>
        </div>
    </div>
</template>

<script>
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
                    key: 'userName'
                }, {
                    title: '姓名',
                    key: 'realName'
                }, {
                    title: '手机号',
                    key: 'phone'
                },  {title: '性别', key: 'sex', align: 'center' , render: (h, params) => {
                        if(params.row.sex==0){
                               return '女'
                        }else{
                               return '男'
                        }
                    }}]
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
                    this.items = demand.records;
                    this.current = demand.current;
                    this.total = demand.total;
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
                    code: "systemAdd",
                    width:600,
                    height:400,
                   /* props: {
                        orgId:this.orgId,
                        deptId:this.deptId
                    },*/
                    callback: (close) => {
                        close();
                        this.getUserList();
                    }
                });
            },
        }
    }
</script>

<style scoped>
    .center {
        position: relative;
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