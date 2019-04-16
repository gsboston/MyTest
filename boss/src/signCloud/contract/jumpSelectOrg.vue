<template>
    <div>
        <i-col span="24">
            <!-- 组织列表 -->
            <i-col span="12">
                <div style="padding: 5px">
                    <Input type="text" v-model="searchOrgText" placeholder="组织名称" style="width: 200px"></Input>
                    <Button size="small" @click="searchOrgByName">搜索</Button>
                    <Table :columns="orgColumns" highlight-row :data="orgList" style="margin-top: 10px" @on-current-change="selectOrg"></Table>
                    <Page style="margin-top: 5px" :page-size="10" size="small" :total="orgTotal" :current="orgPage" @on-change="changeOrgPage"></Page>
                </div>
            </i-col>
            <!-- 业务员列表 -->
            <i-col span="12">
                <div v-if="this.selectedOrg" style="padding: 5px">
                    <Input type="text" v-model="searchUserText" placeholder="业务员名称/电话" style="width: 200px"></Input>
                    <Button size="small" @click="searchUserByName">搜索</Button>
                    <Table :columns="userColumns" highlight-row :data="userList" style="margin-top: 10px" @on-current-change="selectUser"></Table>
                    <Page style="margin-top: 5px" :page-size="10" size="small" :total="userTotal" :current="userPage" @on-change="changeUserPage"></Page>
                </div>
            </i-col>
        </i-col>
        <div style="text-align: center">
            <Button size="small" type="ghost" @click="cancelCommit">取消</Button>
            <Button size="small" type="primary" @click="selectOrgBack">确定</Button>
        </div>
    </div>
</template>

<script>
    import ICol from "../../../node_modules/iview/src/components/grid/col.vue";

    export default {
        components: {ICol},
        created:function(){
            this.searchOrgList();
        },
        data () {
            return {
                orgPage: 1,
                orgTotal: 0,
                userPage: 1,
                userTotal: 0,
                searchOrgText: "",
                searchUserText: "",
                orgList: [],
                userList: [],
                selectedOrg:null,
                selectedUser:null,
                orgColumns: [
                    {
                        title: '组织名称',
                        key: 'name'
                    },
                ],
                userColumns: [
                    {
                        title: '业务员名称',
                        key: 'realName'
                    },
                    {
                        title: '电话',
                        key: 'phone'
                    },
                ],
            }
        },
        methods: {
            searchOrgByName(){
                this.orgPage = 1;
                this.searchOrgList();
                this.userList = [];
            },
            searchUserByName(){
                this.userPage = 1;
                this.searchUserList();
            },
            searchOrgList() {
                this.request({
                    url: "/signCloud/jumpSelectOrg/searchOrgList.do",
                    data: {
                        page: this.orgPage,
                        name: this.searchOrgText
                    }
                }).then((data)=>{
                    if(data && data.records){
                        this.orgList = data.records;
                        this.orgPage = data.current;
                        this.orgTotal = data.total;
                    }
                });
            },
            searchUserList() {
                this.request({
                    url: "/signCloud/jumpSelectOrg/searchUserList.do",
                    data: {
                        page: this.userPage,
                        name: this.searchUserText,
                        orgId: this.selectedOrg.id
                    }
                }).then((data)=>{
                    if(data && data.records){
                        this.userList = data.records;
                        this.userPage = data.current;
                        this.userTotal = data.total;
                    }
                });
            },
            changeOrgPage (page) {
                this.orgPage = page;
                this.searchOrgList();
            },
            changeUserPage (page) {
                this.userPage = page;
                this.searchUserList();
            },
            selectOrg (currentRow) {
                this.selectedOrg = currentRow;
                this.getAllUserByOrg();
            },
            selectUser (currentRow) {
                this.selectedUser = currentRow;
            },
            getAllUserByOrg () {
                this.searchUserList();
            },
            cancelCommit (){
                this.close();
            },
            selectOrgBack(){
                if(this.selectedOrg && this.selectedUser){
                    this.callback(this.selectedOrg,this.selectedUser);
                }else{
                    if(!this.selectedOrg && !this.selectedUser){
                        this.$Message.error("请选择归属组织和业务员！");
                    }else if(!this.selectedOrg){
                        this.$Message.error("请选择归属组织！");
                    }else if(!this.selectedUser){
                        this.$Message.error("请选择业务员！");
                    }
                }
            }
        },
    }
</script>
<style scoped>
</style>
