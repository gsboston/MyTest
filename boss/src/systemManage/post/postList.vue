<template>
    <div class="container">
        <div class="left">
            <div style="text-align: center;">
                <ButtonGroup>
                    <Button type="ghost" @click="openOrgTypeEditModal('add')">新增</Button>
                    <Button type="ghost" @click="openOrgTypeEditModal('update')" :disabled="!orgTypeSelectedItem || orgTypeSelectedItem.id==0">修改</Button>
                    <Button type="ghost" @click="removeOrgType" :disabled="!orgTypeSelectedItem || orgTypeSelectedItem.id==0">删除</Button>
                </ButtonGroup>
            </div>
            <br/>
            <div class="ivu-menu ivu-menu-vertical">
                <div class="ivu-menu-item" v-for="(item, index) in orgTypeItem" :key="index" :class="{selected: item === orgTypeSelectedItem}" @click="orgTypeSelectHandler(item)">{{item.name}}</div>
            </div>
        </div>
        <div class="body">
            <Row type="flex" justify="space-between">
                <Col span="12">
                <ButtonGroup>
                    <Button @click.native="add" :disabled="!orgTypeSelectedItem">新增</Button>
                    <Button @click.native="edit" :disabled="!postSelectedItem">修改</Button>
                    <Button @click.native="bindRole" :disabled="!postSelectedItem">绑定角色</Button>
                </ButtonGroup>
                <Button @click.native="del" :disabled="!postSelectedItem">删除</Button>
                </Col>
                <Col >
                    <Input style="width: 400px;" v-model="postKey" placeholder="岗位名称" icon="search" @on-enter="getPostList()" @on-click="getPostList()"/>
                </Col>
            </Row>
            <br>
            <Table ref="table" size="small" :columns="postColumns" :data="postItems" highlight-row @on-current-change="postSelectHandler"></Table>
            <br>
            <Page size="small" :current="postCurrent" :total="postTotal" :page-size="10" @on-change="getPostList"></Page>
        </div>
        <div class="right-body">
            <h3 style="margin-bottom: 3px;">已关联角色</h3>
            <div class="role-item" v-for="(item, index) in postRoleItems">{{item.code}}:{{item.name}}</div>
        </div>
    </div>
</template>

<script type="text/babel">
    import TableDescription from "./tableDescription.vue";
    export default {
        data: function() {
            return {
                currentOrgTypeName: null,
                orgTypeItem: [],
                orgTypeSelectedItem: null,
                postKey: '',
                postColumns: [{
                    key: "code",
                    width:100,
                    title: "编码"
                }, {
                    key: "name",
                    width:200,
                    title: "名称"
                }, {
                    key: "orgTypeName",
                    width:250,
                    title: "所属组织类型"
                }, {
                    title: "描述",
                    render (createElement, row) {
                        return createElement(TableDescription, {
                            props: {
                                describe: row.row.describe
                            }
                        });
                    }
                }],
                postItems: [],
                postSelectedItem: null,
                postCurrent: 1,
                postTotal: 0,
                postRoleColumns: [{
                    key: "code",
                    title: "角色编码"
                },{
                    key: "name",
                    title: "名称"
                }],
                postRoleItems: [],
                postRoleSelectedItem: null,
                postRoleKey: "",
                postRoleCurrent: 1,
                postRoleTotal: 0,
                roleColumns: [{
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },{
                    key: "name",
                    title: "名称",
                },{
                    key: "describe",
                    title: "描述",
                }],
                roleItems: [],
                roleSelectItem: null,
                roleCurrent: 1,
                roleTotal: 0,
                roleKey: "",
                unbindChecked:[],
                bindChecked:[],

            };
        },
        created () {
            this.getOrgTypeList();
        },
        methods: {
            getOrgTypeList () {
                this.request({
                    url: "/systemManage/post/getOrgTypeList.do"
                }).then(items => {
                    this.orgTypeItem = items;
                    this.currentOrgTypeName = this.orgTypeItem[0].id;
                    this.orgTypeSelectedItem = this.orgTypeItem[0];
                    this.getPostList();
                });
            },
            getPostList (current = 1, isSelected = false) {
                this.request({
                    url: "/systemManage/post/search.do",
                    param: {
                        orgTypeId: this.orgTypeSelectedItem.id,
                        current: current,
                        postKey: this.postKey,
                    },
                }).then(demand => {
                    this.postItems = demand.data;
                    this.postCurrent = demand.current;
                    this.postTotal = demand.total;

                    if (isSelected && demand.data) {
                        demand.data.forEach((item, index) => {
                            if (item.name == this.postKey) {
                                this.$nextTick(() => {
                                    this.$refs['table'].objData[index]._isHighlight = true;
                                    this.postSelectHandler(item);
                                });
                            }
                        });
                    }
                });
            },
            getBindRoleList (current = 1) {
                this.request({
                    url: "/systemManage/post/postRoleList.do",
                    param: {
                        postId: this.postSelectedItem.id,
                        current: current,
                        postRoleKey: this.postRoleKey,
                    }
                }).then(demand => {
                    this.postRoleItems = demand.data;
                    this.postRoleCurrent = demand.current;
                    this.postRoleTotal = demand.total;
                });
            },
//            getUnbinRoleList (current = 1) {
//                this.request({
//                    url: "/systemManage/post/roleList.do",
//                    param: {
//                        postId: this.postSelectedItem.id,
//                        current: current,
//                        roleKey: this.roleKey,
//                    }
//                }).then(demand => {
//                    this.roleItems = demand.data;
//                    this.roleCurrent = demand.current;
//                    this.roleTotal = demand.total;
//                });
//            },
            orgTypeSelectHandler: function(item) {
                this.orgTypeSelectedItem = item;
                this.getPostList();
                this.postSelectedItem = null;
            },
            postSelectHandler: function(item) {//选择岗位后分别请求岗位角色列表和未绑定的角色列表
                this.postSelectedItem = item;
                this.getBindRoleList();
//                this.getUnbinRoleList();
            },
            postRoleSelectHandler: function(item) {
                this.postRoleSelectedItem = item;
            },
            roleSelectHandler: function(item) {
                this.roleSelectItem = item;
            },
            del: function () {
                this.$Modal.confirm({
                    title:"确认删除",
                    content:"确认要删除『"+this.postSelectedItem.name+"』吗？",
                    onOk: () => {
                        this.request({
                            url: "/systemManage/post/delete.do",
                            param: {
                                postId: this.postSelectedItem.id,
                            }
                        }).then(demand => {
                            this.getPostList();
                        });
                    },
                });

            },
            add: function() {
                this.prompt({
                    code: "postAdd",
                    title: "新增岗位",
                    width: 400,
                    height: 345,
                    props: {
                        orgTypeId: this.orgTypeSelectedItem.id,
                    },
                    callback: (name, close) => {
                        close();
                        this.postKey = name;
                        this.getPostList(1, true);
                    },
                });
            },
            edit: function() {
                this.prompt({
                    code: "postAdd",
                    title: "编辑岗位",
                    width: 400,
                    height: 345,
                    props: {
                        id: this.postSelectedItem.id
                    },
                    callback: (close) => {
                        close();
                        this.getPostList(this.postCurrent);
                    },
                });
            },
            bindRole: function() {
                this.prompt({
                    code: "postRoleCard",
                    title: "绑定角色",
                    width: 1000,
                    height: 500,
                    props: {
                        id: this.postSelectedItem.id
                    },
                    callback: (close) => {
                        close();
                        this.getBindRoleList();
                    },
                });
            },
            postSearch: function() {
                this.request({
                    url: "/systemManage/post/search.do",
                    param: {
                        current: this.postCurrent,
                        postKey: this.postKey,
                    },
                }).then(demand => {
                    this.postItems = demand.data;
                    this.postCurrent = demand.current;
                    this.postTotal = demand.total;
                });
            },
            bindSelect (selection) {
                this.bindChecked = selection;
            },
            unbindSelect (selection) {
                this.unbindChecked = selection;
            },
            openOrgTypeEditModal(type){
                //打开模态窗口，新增或修改部门信息
                let _title, _props = {};
                if (type == 'add') {
                    _title = '新增组织类型';
                }else {
                    _title = '修改组织类型';
                    _props = {
                        id: this.orgTypeSelectedItem.id,
                    };
                }

                this.prompt({
                    title: _title,
                    code: 'organizationTypeCard',
                    height: 350,
                    props: _props,
                    callback: (flag, close) => {
                        if (flag) {
                            close();
                            this.getOrgTypeList();
                        }
                    }
                });
            },
            removeOrgType () {
                this.$Modal.confirm({
                    title:"确认删除",
                    content:"确认要删除『"+this.orgTypeSelectedItem.name+"』吗？",
                    onOk: () => {
                        this.request({
                            url: "/systemManage/organizationType/delete.do",
                            param: {
                                orgTypeId: this.orgTypeSelectedItem.id,
                            }
                        }).then(() => {
                            this.$Message.success('删除成功!');
                            this.getOrgTypeList();
                        }, error => {
                            this.$Message.error('删除失败!');
                        });
                    },
                });
            },

        }
    };
</script>

<style scoped>
    h1, h2 {
        font-weight: normal;
    }

    .left {
        position: absolute;
        top: 0;
        left: 0;
        width: 200px;
        height: 100%;
        padding: 15px 0;
        border-right: solid 1px #e8e8e8;
    }
    .body {
        position: relative;
        margin-left: 200px;
        margin-right: 200px;
        padding: 15px;
    }
    .org-type:after {
        background: transparent;
    }

    .right-body {
        position: absolute;
        top: 0;
        right: 0;
        width: 200px;
        height: 100%;
        padding: 15px ;
        border-left: solid 1px #e8e8e8;
    }

    .ivu-menu-item {
        padding: 7px 24px;
    }
    .ivu-menu-item.selected {
        color: #2d8cf0;
        /*border-right: solid 2px #2d8cf0;*/
    }
    .ivu-menu-item.selected:after {
        content: "";
        position: absolute;
        top: 3px;
        right: 0;
        bottom: 3px;
        width: 2px;
        background: #2d8cf0;
    }

    .role-item {
        font-size: 13px;
        line-height: 24px;
    }

</style>