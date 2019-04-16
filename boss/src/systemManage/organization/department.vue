<template>
    <div class="container">
        <div class="left">
            <div style="text-align: center;" >
                <ButtonGroup>
                    <Button @click="editOrUpdate('add')" v-if="B050501">新增</Button>
                    <Button :disabled="!selectedItem" @click="editOrUpdate('update')" v-if="B050502">修改</Button>
                    <Button :disabled="!selectedItem" @click="deleteDept" v-if="B050503">删除</Button>
                </ButtonGroup>
            </div>
            <br/>
            <Tree :data="departmentData" ref="tree" @on-select-change="selectDept"></Tree>
        </div>
        <div class="center">
            <Row>
                <i-col span="18">
                    <ButtonGroup>
                        <Button :disabled="!selectedItem" @click="editOrUpdateUser('add')" v-if="B050501">新增</Button>
                        <Button :disabled="!(this.selectedItem && this.selectedUserItem)" @click="editOrUpdateUser('update')" v-if="B050501">修改</Button>
                        <Button :disabled="!(this.selectedItem && this.selectedUserItem)" @click="remove" v-if="B050501">删除</Button>
                    </ButtonGroup>
                </i-col>
                <i-col span="6">
                    <Input placeholder="请输入用户名进行搜索" icon="search" :disabled="!selectedItem" @on-enter="search" @on-click="search" v-model="searchName"/>
                </i-col>
            </Row>
            <br/>
            <Table size="small" :data="userData" :columns="userColumns" highlight-row @on-current-change="currentChange"></Table>
            <br/>
            <Page size="small" :total="total" :current="page" @on-change="changePage"></Page>
            <br/>
            <Row v-if="postData.length>0" :gutter="16">
                <header class="org-header">
                    <span>岗位设置</span>
                </header>
                <br/>
                <i-col span="4" v-for="item in postData" :key="item.id" style="margin-bottom: 16px;">
                    <Card>
                        <Checkbox :value="item.checked" @on-change="choosePost(item.id, $event)" :disabled="!B050507">{{ item.name }}</Checkbox>
                    </Card>
                </i-col>
            </Row>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            B050501: false,
            B050502: false,
            B050503: false,
            B050504: false,
            B050505: false,
            B050506: false,
            B050507: false
        },
        data () {
            return {
                departmentData: [],
                selectedItem: null,
                orgID: null,
                userColumns: [
                    {title: '用户名', key: 'realName', align: 'center'},
                    {title: '联系电话', align: 'center', key: 'phone',},
                    {title: '登录账号', align: 'center', key: 'userName'},
                    {title: '创建日期', align: 'center', key: 'tsInsert', render: (h, params) => {
                        return this.getLocalTime(this.userData[params.index].tsInsert);
                    }}
                ],
                userData:[],
                postColumns: [
                    {title: '组织', key: 'orgName', align: 'center'},
                    {title: '部门', key: 'deptName', align: 'center'},
                    {title: '姓名', key: 'realName', align: 'center'},
                    {title: '岗位', key: 'name', align: 'center'}
                ],
                postData:[],
                total: 0,
                page: 1,
                searchName: null,
                selectedUserItem: null
            }
        },
        created: function () {
            this.getDepartmentList(); //获取部门数据列表
        },
        methods: {
            /** 数据获取函数 -- Data */
            getDepartmentList () {
                //部门类型模拟数据
                this.request({
                    url: `/systemManage/organization/getDeptByCurOrg.do`,
                }).then(data => {
                    if(data.id) {
                        this.orgID = data.id;
                        this.departmentData = [];
                        this.departmentData.push(data);
                    }
                });
            },
            getUserData () {
                this.request({
                    url: "/systemManage/user/userlistInfo.do",
                    data: {
                        orgId: this.orgID,
                        deptId: this.selectedItem.id,
                        searchText: this.searchName,
                        page: this.page
                    }
                }).then(items => {
                    this.userData = items.records;
                    this.total = items.total;
                    this.postData = [];
                    this.selectedUserItem = null;
                });
            },
            getPostData (userId) {
                this.request({
                    url: '/systemManage/posts/getPosts.do',
                    param: {
                        orgId: this.orgID,
                        userId: userId
                    }
                }).then(data => {
                    if(data != null){
                        this.postData = data;
                    }else{
                        this.postData = [];
                    }
                })
            },
            /** 组件操作函数 -- Event */
            selectDept (selection) {
                if(selection.length > 0) {
                    let item = selection[0];
                    this.selectedItem = item;
                    this.getUserData();
                }else {
                    this.selectedItem = null;
                }
            },
            editOrUpdate (type) {
                //新增或修改部门信息
                let title = '', param = {};
                if (type == 'add') {
                    title = '新增部门';
                    param = {
                        orgId: this.orgID,
                        parentId: (this.selectedItem ? this.selectedItem.id : null)
                    };
                }else {
                    title = '修改部门';
                    param = {
                        id: this.selectedItem.id,
                    };
                }
                this.prompt({
                    title: title,
                    code: 'departmentCard',
                    props: {
                        param: param
                    },
                    width: 400,
                    height: 300,
                    callback: (flag, close) => {
                        if (flag) {
                            close();
                            this.getDepartmentList();
                            this.userData = [];
                            this.postData = [];
                            this.selectedItem = null;
                        }
                    }
                });
            },
            deleteDept () {
                //删除部门
                this.request({
                    url: "/systemManage/dept/delete.do",
                    param: {
                        deptId: this.selectedItem.id,
                    }
                }).then(() => {
                    this.$Message.success('删除成功!');
                    this.getDepartmentList();
                    this.userData = [];
                    this.postData = [];
                    this.selectedItem = null;
                });
            },
            changePage (pageIndex) {
                //分页事件
                this.page = pageIndex;
                this.getUserData();
            },
            search () {
                //用户搜索
                if ('' !== this.searchName){
                    this.page = 1;
                    this.getUserData();
                }
            },
            currentChange(currentRow){
                //获取选中用户的详细信息
                this.selectedUserItem = currentRow;
                this.getPostData(currentRow.id);
            },
            editOrUpdateUser(type){
                let props = {}, title = '';
                if (type == 'add') {
                    title = '新增用户';
                    props = {
                        orgId: this.orgID,
                        deptId: this.selectedItem.id
                    };
                }else {
                    title = '用户姓名：'+ this.selectedUserItem.realName;
                    props = {
                        userId: this.selectedUserItem.id,
                        orgId: this.orgID,
                        deptId: this.selectedItem.id
                    };
                }
                this.prompt({
                    code: "OrgUserCard",
                    width:600,
                    props: props,
                    title: title,
                    callback: (flag, close) => {
                        if (flag) {
                            close();
                            this.getUserData();
                        }
                    }
                });
            },
            reset(){
                this.prompt({
                    code: "relevancePostCode",
                    width:600,
                    height:400,
                    props: {
                        id: this.selectedUserItem.id,
                        orgId: this.orgID,
                        deptId: this.selectedItem.id
                    },
                    title:'用户姓名：'+ this.selectedUserItem.realName,
                    callback: (close) => {
                        close();
                        this.getDepartmentList();
                    }
                });
            },
            remove () {
                //删除用户
                this.$Modal.confirm({
                    content: '确定删除吗?',
                    onOk: () => {
                        this.request({
                            url: "/systemManage/userOrgManage/delete.do",
                            param: {
                                id: this.selectedUserItem.id,
                                orgId: this.orgID,
                                deptId: this.selectedItem.id
                            }
                        }).then(() => {
                            this.$Message.success('删除成功');
                            this.getUserData();
                        });
                    }
                });
            },
            choosePost(id, event) {
//                if(!this.B050507) {
//                    return;
//                }
                if (!event.constructor){
                    return;
                }
                this.$emit('change',id);
                let isChoose = arguments[1];
                if (isChoose) {
                    this.request({
                        url: "/systemManage/userOrgManage/userPostRelation.do",
                        data: {
                            userId: this.selectedUserItem.id,
                            orgId: this.orgID,
                            postId: id
                        }
                    }).then(() => {
                        this.$Message.success('关联岗位成功');
                        this.getPostData(this.selectedUserItem.id);
                    });
                }else {
                    this.request({
                        url: "/systemManage/userOrgManage/removeUserPostRelation.do",
                        data: {
                            userId: this.selectedUserItem.id,
                            orgId: this.orgID,
                            postId: id
                        }
                    }).then(() => {
                        this.$Message.success('删除岗位关联成功');
                        this.getPostData(this.selectedUserItem.id);
                    });
                }
            },
            getLocalTime(nS) {
                return new Date(parseInt(nS)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
            }
        }
    };
</script>

<style scoped>
    .left {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 300px;
        padding: 15px;
        border-right: solid 1px #dddee1;
    }
    .center {
        position: relative;
        margin-left: 300px;
        padding: 15px;
    }
    #departmentList .ivu-menu li {
        width: 100%;
        margin: 0;
    }

    .org-header:before {
        content: "";
        display: block;
        width: 100%;
        height: 1px;
        background: #eee;
        position: absolute;
        top: 10px;
        left: 0;
    }

    .org-header span {
        display: inline-block;
        background: #fff;
        padding: 0 5px 0 18px;
        position: relative;
        margin-left: 30px;
        font-size: 14px;
    }

    #departmentList > .ivu-tree > .ivu-tree-children > li > .ivu-tree-title {
        font-weight: 700;
    }
</style>