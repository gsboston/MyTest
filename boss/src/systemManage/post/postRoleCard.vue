<template>
    <Row>
    <Row type="flex" justify="space-around">
        <Col span="11">
        <Card>
            <div slot="title">
                未绑定角色
            </div>
            <p style="margin-top: -9px;" slot="extra">
                <Input style="width: 200px;" placeholder="请输入..." v-model="roleKey" icon="search" @on-enter="getUnbindRoleList()" @on-click="getUnbindRoleList()"/>
            </p>
            <Table size="small" :columns="roleColumns" :data="roleItems" @on-selection-change="unbindSelect"></Table>
            <br>
            <Page size="small" :currnet="roleCurrent" :total="roleTotal" :page-size="10" @on-change="getUnbindRoleList"></Page>
        </Card>
        </Col>

        <Col span="11">
        <Card>
            <div slot="title">
                已绑定角色
            </div>
            <p style="margin-top: -9px;" slot="extra">
                <Input style="width: 200px;" placeholder="请输入..." v-model="postRoleKey" icon="search" @on-enter="getBindRoleList()" @on-click="getBindRoleList()"/>
            </p>
            <Table size="small" :columns="postRoleColumns" :data="postRoleItems" @on-selection-change="bindSelect"></Table>
            <br>
            <Page size="small" :current="postRoleCurrent" :total="postRoleTotal" :page-size="10" @on-change="getBindRoleList"></Page>
        </Card>
        </Col>
    </Row>
    <br/>
    <Row>
        <i-col span="2" offset="21">
            <Button type="primary" @click="closeCard()">关闭</Button>
        </i-col>
    </Row>
    </Row>
</template>

<script>
    export default {
        props: {
            id: null
        },
        data: function() {
            return {
                postRoleColumns: [{
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },{
                    key: "name",
                    title: "名称"
                }, {
                    key: "describe",
                    width: 120,
                    title: "描述"
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
                    width: 120,
                    title: "描述",
                }],
                roleItems: [],
                roleSelectItem: null,
                roleCurrent: 1,
                roleTotal: 0,
                roleKey: "",
                unbindChecked:[],
                bindChecked:[],
            }
        },
        created: function() {
            this.getBindRoleList();
            this.getUnbindRoleList();
        },
        methods: {
            getBindRoleList (current = 1) {
                this.request({
                    url: "/systemManage/post/postRoleList.do",
                    param: {
                        postId: this.id,
                        current: current,
                        postRoleKey: this.postRoleKey,
                    }
                }).then(demand => {
                    this.postRoleItems = demand.data;
                    this.postRoleCurrent = demand.current;
                    this.postRoleTotal = demand.total;
                });
            },
            getUnbindRoleList (current = 1) {
                this.request({
                    url: "/systemManage/post/roleList.do",
                    param: {
                        postId: this.id,
                        current: current,
                        roleKey: this.roleKey,
                    }
                }).then(demand => {
                    this.roleItems = demand.data;
                    this.roleCurrent = demand.current;
                    this.roleTotal = demand.total;
                });
            },
            bindSelect (selection) {
                this.bindChecked = selection;
                this.moveToUnbind();
            },
            unbindSelect (selection) {
                this.unbindChecked = selection;
                this.moveToBind();
            },
            moveToBind () {
                var roleIds = [];
                for (var i=0;i<this.unbindChecked.length;i++) {
                    roleIds.push(this.unbindChecked[i].id);
                }
                this.addPostRole(roleIds);
                this.postRoleItems = this.postRoleItems.concat(this.unbindChecked);
                for(var i=0;i<this.roleItems.length;i++){
                    for(var j=0;j<this.unbindChecked.length;j++){
                        if(this.roleItems[i].id == this.unbindChecked[j].id){
                            this.roleItems.splice(i,1);
                        }
                    }
                }
                this.unbindChecked = [];
            },
            moveToUnbind () {
                var roleIds = [];
                for (var i=0;i<this.bindChecked.length;i++) {
                    roleIds.push(this.bindChecked[i].id);
                }
                this.deletePostRole(roleIds);
                this.roleItems = this.roleItems.concat(this.bindChecked);
                for(var i=0;i<this.postRoleItems.length;i++){
                    for(var j=0;j<this.bindChecked.length;j++){
                        if(this.postRoleItems[i].id == this.bindChecked[j].id){
                            this.postRoleItems.splice(i,1);
                        }
                    }
                }
                this.bindChecked = [];
            },
            addPostRole(postRole) {
                this.request({
                    url: "/systemManage/post/bindRole.do",
                    param: {
                        postId: this.id,
                        roleIds: postRole,
                    },
                }).then(demand => {
                    this.getBindRoleList();
                    this.getUnbindRoleList();
                });
            },
            deletePostRole(roleIds) {
                this.request({
                    url: "/systemManage/post/unbindRole.do",
                    param: {
                        postId: this.id,
                        roleIds: roleIds,
                    },
                }).then(demand => {
                    this.getBindRoleList();
                    this.getUnbindRoleList();
                });
            },
            closeCard() {
                this.callback();
            },
        }
    };
</script>