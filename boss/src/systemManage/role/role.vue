<template>
    <div class="container">
        <div class="center">
            <Row>
                <i-col span="18">
                    <ButtonGroup>
                        <Button type="ghost" @click="addRole">新增</Button>
                        <Button type="ghost" @click="editRole" :disabled="!selectedRole">修改</Button>
                        <Button type="ghost" :disabled="!selectedRole" @click="removeRole">删除</Button>
                    </ButtonGroup>
                </i-col>
                <i-col span="6">
                    <Input placeholder="名称" icon="search" @on-enter="search" @on-click="search" v-model="searchText"/>
                </i-col>
            </Row>
            <br/>
            <Table ref="table" :columns="roleColumns" :data="roleData.records" highlight-row @on-current-change="selectRole"></Table>
            <br/>
            <Page size="small" :total="roleData.total" :page-size="pageSize" show-total :current="roleData.current" @on-change="pageChange"></Page>
        </div>
        <div class="right">
            <div>
                <div style="text-align: center;">
                    <Button type="primary" style="width: 160px;" @click="refDuty" :disabled="selectedRole==undefined">关联职责</Button>
                </div>
                <ul>
                    <li class="roleItem" v-for="item in dutyData">
                        <div>
                            <b style="font-size: 14px;">{{item.name}}</b>
                            <div style="float: right;"  @click="removeDuty(item)">
                                <Icon type="close" style="cursor: pointer;"></Icon>
                            </div>
                        </div>
                        <p style="text-indent: 1em;">{{item.describe}}</p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data: function() {
            return {
                searchText:'',
                roleColumns: [{
                    key: "code",
                    title: "编码"
                }, {
                    key: "name",
                    title: "名称"
                }, {
                    key: "describe",
                    title: "角色描述"
                }],
                roleData: {},
                selectedRole:undefined,
                dutyColumns: [{
                    key: "name",
                    title: "名称"
                },{
                    key: "code",
                    title: "编码"
                }, {
                    key: "describe",
                    title: "职责描述"
                }],
                dutyData: {},
                pageSize: 10,
            };
        },
        created: function() {
            this.loadRoleData(1);
        },
        methods: {
            loadRoleData:function(page, isSelected = false){
                this.request({
                    url: "/systemManage/role/search.do",
                    data:{
                        page:page,
                        name:this.searchText,
                        pageSize: this.pageSize
                    }
                }).then(data => {
                    this.roleData = data;
                    this.selectedRole = undefined;
                    this.dutyData = {};
                    if (isSelected && data.records) {
                        data.records.forEach((item, index) => {
                            if (item.name == this.searchText) {
                                this.$nextTick(() => {
                                    this.$refs['table'].objData[index]._isHighlight = true;
                                    this.selectRole(item);
                                });
                            }
                        });
                    }
                });
            },
            loadDutyData:function(id,page){
                this.request({
                    url: "/systemManage/role/findDutyByRole.do?id="+id
                }).then(data => {
                    this.dutyData = data;
                });
            },
            selectRole:function(row){
                this.selectedRole=row;
                this.loadDutyData(row.id,1);
            },
            addRole:function(){
                this.prompt({
                    code: "roleCard",
                    title:"新增角色",
                    width:400,
                    callback: (name, close) => {
                        this.$Message.info("保存成功");
                        this.searchText = name;
                        this.loadRoleData(1, true);
                        close();
                    }
                });
            },
            editRole:function(){
                this.prompt({
                    code: "roleCard",
                    title:"编辑角色",
                    width:400,
                    props:{roleData:this.selectedRole},
                    callback: (name, close) => {
                        this.$Message.info("保存成功");
                        this.loadRoleData(this.roleData.current);
                        close();
                    }
                });
            },
            removeRole:function(){
                this.$Modal.confirm({
                    title:'删除角色确认',
                    content:'是否删除【'+this.selectedRole.name+'】角色',
                    onOk:() => {
                        this.request({
                            url: "/systemManage/role/removeRole.do?id="+this.selectedRole.id
                        }).then(data => {
                            this.$Message.info("删除成功");
                            this.loadRoleData(this.roleData.current);
                        });
                    }
                });
            },
            search:function(){
                /*this.loadRoleData(this.roleData.current==undefined?1:this.roleData.current);*/
               this.loadRoleData(1);
            },
            refDuty:function(){
                this.prompt({
                    code: "roleDutyCard",
                    title:"关联职责",
                    width:800,
                    props:{roleId:this.selectedRole.id},
                    callback: () => {
                        this.loadDutyData(this.selectedRole.id);
                    }
                });
            },
            pageChange:function(page){
                this.selectedRole = undefined;
                this.dutyData = {};
                this.loadRoleData(page);
            },
            removeDuty:function(row){
                this.$Modal.confirm({
                    content: "请确认删除操作",
                    onOk: () => {
                        this.request({
                            url: "/systemManage/role/removeDutyByRole.do?roleId="+this.selectedRole.id+"&dutyId="+row.id
                        }).then(data => {
                            this.loadDutyData(this.selectedRole.id);
                        });
                    }
                });
            }
        }
    };
</script>

<style scoped>
    .center {
        position: relative;
        margin-right: 200px;
        padding: 15px;
    }
    .right {
        position: absolute;
        top: 0;
        right: 0;
        width: 200px;
        height: 100%;
        padding: 15px;
        border-left: solid 1px #f5f5f5;
    }
    .roleItem {
        width: 100%;
        margin: 0;
        line-height: 20px;
        margin-top: 10px;
    }
</style>

