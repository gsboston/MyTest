<style scoped>
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

    .container >>> .ivu-table-body {
        overflow: visible;
    }

    .container >>> .ivu-table-cell {
        overflow: visible;
    }

    .container >>> .ivu-table-small th {
        height: 40px;
    }

    .org-select-panel {
        position: relative;
        margin-bottom: 20px;
    }

    .org-select-panel > .org-selected {
        cursor: default;
    }

    .org-select-panel > .org-selected >>> input {
        cursor: default;
    }

    .org-select-panel > .org-maintain {

    }

    .org-select-panel > .org-selection {
        position: absolute;
        top: 32px;
        left: 0;
        width: 319px;
        max-height: 500px;
        background: white;
        border: solid 1px #dddee1;
        border-radius: 5px;
        box-shadow: 5px 5px 2px #dddee1;
        z-index: 1;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .dept-list {
        width: 100%!important;
    }

    .dept-list.ivu-menu-vertical.ivu-menu-light:after{
        display: none;
    }

    .dept-list .dept-item {
        position: relative;
        width: 100%;
        padding: 15px 8px!important;
        line-height: 24px;
        border: 0;
        border-bottom: 1px solid #eee!important;
        height: auto!important;
    }

    .dept-list .dept-item:hover {
        background: #f3f3f3;
    }

    .dept-list .dept-item.ivu-menu-item-selected {
        background: #f8f8f9;
    }

    .btn-add {
        margin-bottom: 10px;
    }

    .ivu-menu {
        z-index: 0;
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
</style>

<template>
    <div class="container">
        <div class="left">
            <div class="org-select-panel">
                <Input class="org-selected" placeholder="请选择机构" :value="selectedOrg ? selectedOrg.title : null" @click.native="showOrgSelection" readonly />
                <div class="org-selection" v-show="orgSelectMode">
                    <Tree :data="orgSystemData" ref="tree1" @on-select-change="selectOrg"></Tree>
                </div>
                <br/>
            </div>
            <div>
                <Button @click="editOrUpdate('dept', 'add')" :disabled="!selectedOrg" class="btn-add">添加部门</Button>

                <Menu mode="vertical" active-name="selectedDeptIndex" class="dept-list" @on-select="currentDeptChange">
                    <MenuItem v-for="(item, index) in deptData" :key="index" :name="index" class="dept-item">
                        {{item.name}}
                        <ButtonGroup style="float: right;">
                            <Button type="ghost" icon="ios-compose-outline" title="修改" size="small" @click="editOrUpdate('dept', 'update', item)"></Button>
                            <Button type="ghost"  icon="ios-trash-outline" title="删除" size="small" @click="removeDept(item)"></Button>
                        </ButtonGroup>
                    </MenuItem>
                </Menu>
            </div>
        </div>
        <div class="center">
            <div>
                <!-- 用户编辑功能 -->
                <Row>
                    <i-col span="12">
                        <Button @click="editOrUpdate('user', 'add')" :disabled="!selectedDept" class="btn-add">添加业务用户</Button>
                        <Button @click="editOrUpdate('userManager', 'add')" :disabled="!selectedDept" class="btn-add">添加机构管理员</Button>
                    </i-col>
                    <i-col span="12" style="display: flex;">
                        <Input placeholder="请输入用户名进行搜索" icon="search" :disabled="!selectedDept" @on-enter="searchUser" @on-click="searchUser" v-model="searchUserName"/>
                    </i-col>
                </Row>
                <Table size="small" :data="userData" :columns="userColumns" highlight-row></Table>
                <br/>
                <Page size="small" :total="userTotal" :current="userPage" @on-change="changeUserPage"></Page>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
    import OrganizationCard from './organizationCard.vue';
    import LPOrgSetting from '../leadPage/LPOrgSetting';

    export default {
        props: {
            B050508: false,
            B050509: false,
            B050510: false,
            B050511: false,
        },
        watch: {
            selectedOrg() {
                this.deptData = [];
                this.selectedDept = null;
                this.userData = [];
                this.deptDataPage = 1;
                this.searchDeptName = null;
                this.userPage = 1;
                this.searchUserName = null;
                this.getDeptData();
            },
            selectedDept(val) {
                this.userData = [];
                this.userPage = 1;
                this.searchUserName = null;
                if (val && val != null) {
                    this.getUserData(val.id);
                }
            },
        },
        data () {
            return {
                orgId: null,
                orgSystemData: [],
                orgSelectMode: false,
                selectedOrg: null,

                deptData:[],
                selectedDept: null,
                selectedDeptIndex: null,
                deptDataTotal: 0,
                deptDataPage: 1,
                searchDeptName: null,
                userColumns: [
                    {title: '姓名', key: 'realName', align: 'center', width: '120'},
                    {title: '手机', align: 'center', key: 'phone',},
                    {title: '用户名', align: 'center', key: 'userName'},
                    {title: '修改日期', align: 'center', key: 'tsUpdate', width: '180', render: (h, params) => {
                            return this.getLocalTime(this.userData[params.index].tsUpdate);
                        }},
                    {title: '是否停用', align: 'center', key: 'isStart', render: (h, params) => {
                            if(params.row.startUp==0){
                                return '否'
                            }else{
                                return '是'
                            }
                        }},
                    {
                        title: '操作',
                        key: 'action',
                        width: 260,
                        align: 'center',
                        render: (h, params) => {
                            return h('ButtonGroup', [
                                h('Tooltip', {
                                    props: {
                                        content: '编辑',
                                        placement: 'top',
                                        // transfer: true
                                    },
                                    style: {
                                        'margin-right': '2px'
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'ghost',
                                            icon: 'edit',
                                        },
                                        on: {
                                            click: () => {
                                                if (params.row.permissionLevel == 'ORGANIZATION_LEVEL') {
                                                    this.editOrUpdate('userManager', 'update', params.row);
                                                }else {
                                                    this.editOrUpdate('user', 'update', params.row);
                                                }
                                            }
                                        }
                                    })
                                ]),
                                h('Tooltip', {
                                    props: {
                                        content: '删除',
                                        placement: 'top',
                                        // transfer: true
                                    },
                                    style: {
                                        'margin-right': '2px'
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'ghost',
                                            icon: 'trash-a',
                                        },
                                        on: {
                                            click: () => {
                                                this.removeUser(params.row)
                                            }
                                        }
                                    })
                                ]),
                                h('Tooltip', {
                                    props: {
                                        content: '岗位信息',
                                        placement: 'top',
                                        // transfer: true
                                    },
                                    style: {
                                        'margin-right': '2px'
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'ghost',
                                            icon: 'ios-people',
                                        },
                                        on: {
                                            click: () => {
                                                this.editOrUpdate('post', 'update', params.row)
                                            }
                                        }
                                    })
                                ]),
                                h('Tooltip', {
                                    props: {
                                        content: '重置密码',
                                        placement: 'top',
                                        // transfer: true
                                    },
                                    style: {
                                        'margin-right': '2px'
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            type: 'ghost',
                                            icon: 'android-settings',
                                        },
                                        on: {
                                            click: () => {
                                                this.resetPwd(params.row)
                                            }
                                        }
                                    })
                                ]),
                            ]);
                        }
                    }
                ],
                userData:[],
                userTotal: 0,
                userPage: 1,
                searchUserName: null,
                operateOrgType: 'update',
                isStart:'启用',
            }
        },
        created: function () {
            this.getOrgSystemData();
        },
        methods: {
            showOrgSelection () {
                this.orgSelectMode = !this.orgSelectMode;
            },
            /** 数据获取函数 -- Data */
            getOrgSystemData () {
                this.request({
                    url: `/systemManage/orgSystems/getCurOrg.do`
                }).then(data => {
                    this.orgSystemData = data;
                    let item = data[0];
                    this.selectedOrg = item;
                });
            },
            getDeptData () {
                if( this.selectedOrg){
                    this.request({
                        url: `/systemManage/organization/getDeptByOrg.do`,
                        param: {
                            orgID: this.selectedOrg.id,
                            searchText: this.searchDeptName,
                        }
                    }).then(data => {
                        this.deptData = data;
                    });
                }
            },
            getUserData (currentId) {
                this.request({
                    url: "/systemManage/user/userlistInfo.do",
                    data: {
                        orgId: this.selectedOrg.id,
                        deptId: this.selectedDept.id,
                        searchText: this.searchUserName,
                        current: currentId ? this.userPage=1 : this.userPage,
                        key: 'yes'
                    }
                }).then(items => {
                    this.userData = items.records;
                    this.userTotal = items.total;
                    this.userPage = items.current;
                });
            },
            /** 组件操作函数 -- Event */
            selectOrg (selection) {
                // if(selection.length > 0) {
                //     let item = selection[0];
                //     this.selectedOrg = item;
                //     this.operateOrgType = 'update';
                // }else {
                //     this.selectedOrg = null;
                // }
            },
            currentDeptChange(index){
                this.selectedDept = this.deptData[index];
            },
            changeDeptPage (pageIndex) {
                this.deptDataPage = pageIndex;
                this.getDeptData();
            },
            searchDept () {
                if ('' == this.searchDeptName){
                    this.searchDeptName = null;
                }
                this.deptDataPage = 1;
                this.getDeptData();
            },
            changeUserPage (pageIndex) {
                //分页事件
                this.userPage = pageIndex;
                this.getUserData();
            },
            searchUser () {
                //用户搜索
                if ('' == this.searchUserName){
                    this.searchUserName = null;
                }
                this.userPage = 1;
                this.getUserData();
            },
            editOrUpdate (cardType, operateType, item) {
                if (cardType == 'org') {
                    this.operateOrgType = operateType;
                }else if (cardType == 'dept') {
                    this.prompt({
                        title: operateType == 'add' ? '新增部门' : '修改部门',
                        code: 'departmentCard',
                        props: {
                            param: operateType == 'add' ? {'orgId': this.selectedOrg.id} : item,
                            isSaveMoreTimes: operateType == 'add' ? true : false,
                            handleSavedFunc: this.getDeptData
                        },
                        width: 600,
                        height: 400,
                        callback: (flag, close) => {
                            if (flag) {
                                close();
                                this.getDeptData();
                            }
                        }
                    });
                }else if (cardType == 'user') {
                    this.prompt({
                        title: operateType == 'add' ? '新增业务用户' : '修改业务用户',
                        code: 'orgUserCard',
                        props: {
                            orgId: this.selectedOrg.id,
                            deptId: this.selectedDept.id,
                            userId: operateType == 'add' ? null : item.id,
                            isShowPostSetting: false,
                            isShowUserLevelSetting: false
                        },
                        width: 600,
                        height: 400,
                        callback: (flag, close) => {
                            if (flag) {
                                close();
                                this.getUserData();
                            }
                        }
                    });
                }else if (cardType == 'post') {
                    this.prompt({
                        title: '岗位信息编辑',
                        code: 'orgUserCard',
                        props: {
                            orgId: this.selectedOrg.id,
                            deptId: this.selectedDept.id,
                            userId: item.id,
                            isShowUserSetting: false
                        },
                        width: 600,
                        height: 400,
                        callback: (flag, close) => {
                            if (flag) {
                                close();
                                this.getUserData();
                            }
                        }
                    });
                }else if (cardType == 'userManager') {
                    let data = {};
                    if (operateType == 'add') {
                        data = {
                            param: {
                                orgId: this.selectedOrg.id
                            }
                        }
                    }else {
                        data = {
                            id: item.id
                        }
                    }
                    this.prompt({
                        title: operateType == 'add' ? '新增机构管理员' : '修改机构管理员',
                        code: 'orgCardManagement',
                        props: data,
                        width: 600,
                        height: 400,
                        callback: (flag, close) => {
                            if (flag) {
                                close();
                                this.getUserData();
                            }
                        }
                    });
                }
            },
            cancelShowCard(type) {
                if (type == 'org') {
                    this.getOrgSystemData(this.selectedOrg);
                }
            },
            removeOrg () {
                //删除组织
                this.$Modal.confirm({
                    content: '确定删除吗?',
                    onOk: () => {
                        this.request({
                            url: "/systemManage/orgRelation/delete.do",
                            param: {
                                id: this.selectedOrg.id,
                            }
                        }).then(() => {
                            this.$Message.success('删除成功');
                            this.getOrgSystemData();
                        });
                    }
                });
            },
            removeDept (item) {
                //删除部门
                this.$Modal.confirm({
                    content: '确定删除吗?',
                    onOk: () => {
                        this.request({
                            url: "/systemManage/dept/delete.do",
                            param: {
                                deptId: item.id
                            }
                        }).then(() => {
                            this.$Message.success('删除成功');
                            this.getDeptData();
                        });
                    }
                });
            },
            removeUser (item) {
                //删除用户
                this.$Modal.confirm({
                    content: '确定删除吗?',
                    onOk: () => {
                        this.request({
                            url: "/systemManage/userOrgManage/delete.do",
                            param: {
                                id: item.id,
                                orgId: this.selectedOrg.id,
                                deptId: this.selectedDept.id
                            }
                        }).then(() => {
                            this.$Message.success('删除成功');
                            this.getUserData();
                        });
                    }
                });
            },
            resetPwd(item) {
                this.$Modal.confirm({
                    content: '确定重置密码吗?',
                    onOk: () => {
                        this.request({
                            url: "/systemManage/user/resetPassword.do",
                            param: {
                                userId: item.id,
                            }
                        }).then(() => {
                            this.$Message.success('密码重置成功,默认密码为『123456』');
                        });
                    }
                });
            },
            getLocalTime(nS) {
                return new Date(parseInt(nS)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
            },
            hideLeadPage() {
                this.isShowLeadPage = false;
            }

        },
        components: {
            OrganizationCard,
            LPOrgSetting
        }
    };
</script>