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

    .container >>> td:last-child .ivu-table-cell {
        overflow: visible;
    }

    .container >>> .ivu-table-small th {
        height: 40px;
    }

    .org-select-panel {
        position: relative;
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
        z-index: 2;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .dept-list, .post-list {
        width: 100%!important;
    }

    .dept-list.ivu-menu-vertical.ivu-menu-light:after, .post-list.ivu-menu-vertical.ivu-menu-light:after{
        display: none;
    }

    .dept-list .dept-item, .post-list .post-item {
        position: relative;
        width: 100%;
        padding: 15px 8px!important;
        line-height: 24px;
        border: 0;
        border-bottom: 1px solid #eee!important;
        height: auto!important;
    }

    .dept-list .dept-item:hover, .post-list .post-item:hover {
        background: #f3f3f3;
    }

    .dept-list .dept-item.ivu-menu-item-selected, .post-list .post-item.ivu-menu-item-selected {
        background: #eee;
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

    /** 机构管理修改 -- 2018-06-12 */
    .container >>> .ivu-tabs-ink-bar {
        background-color: #59b399;
    }
    .container >>> .ivu-tabs-nav .ivu-tabs-tab-active {
        color: #59b399;
    }
    .container >>> .ivu-tabs-nav .ivu-tabs-tab:hover {
        color: #59b399;
    }
    .post-list .post-item {
        text-align: left;
    }
    .post-list .post-item span {
        float: right;
        display: inline-block;
        text-align: center;
        width: 24px;
        color: #FFF;
        margin-left: 10px;
        background-color: #59b399;
        border-radius: 50%;
    }
    .post-user-list {
        height: 600px;
        border: 1px solid #DDDDDD;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .post-user-item {
        margin-bottom: 30px;
    }
    .post-user-item>p {
        font-size: 16px;
        font-weight: 600;
        background: #DDDDDD;
        padding: 0 15px;
        line-height: 32px;
    }
    .post-user-item>div {
        padding: 10px 20px;
    }
    .post-user-item >>> .ivu-tag {
        display: flex;
        width: 100%;
        height: 50px;
        line-height: 50px;
        font-size: 14px;
    }
    .post-user-item >>> .ivu-tag span {
        flex: 1;
    }
    .post-user-item >>> .ivu-tag i {
        display: inline-flex;
        align-items: center;
        margin: 15px 0;
        padding-left: 10px;
        transform: scale(1);
        font-size: 24px;
        border-left: 1px solid #DDDDDD;
    }
    .post-user-legend-list {
        height: 570px;
        overflow: auto;
        margin: 15px 0;
    }
    .post-user-legend-list li {
        text-align: center;
        padding: 5px 0;
    }

    .post-user-legend-list li a {
        font-size: 14px;
        color: #59b399;
        font-weight: 600;
    }
    .container >>> .post-name .ivu-tooltip, .container >>> .post-name .ivu-tooltip-rel {
        width: 100%;
    }
    .container >>> .post-name .ivu-tooltip-rel {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .container >>> .post-name .ivu-tooltip-inner {
        white-space: normal;
    }
    .no-change{
        position: relative;
        width: 100%;
        height: auto;
        padding-top: 253px;
        padding-bottom: 20px;
        background: #FFF url("../../signCloud/image/no-contract.png") center 100px no-repeat;
        text-align: center;
        font-size: 16px;
    }
</style>

<template>
    <div class="container">
        <div class="left">
            <div class="org-select-panel" v-if="!isShowOrgCard">
                <Input class="org-selected" placeholder="请选择机构" :value="selectedOrg ? selectedOrg.title : null" @click.native="showOrgSelection" readonly>
                    <Button class="org-maintain" slot="append" :disabled="!selectedOrg" @click.native.stop="isShowOrgCard = true">维护机构</Button>
                </Input>
                <div class="org-selection" v-show="orgSelectMode">
                    <Tree :data="orgSystemData" ref="tree1" @on-select-change="selectOrg"></Tree>
                </div>
                <br/>
            </div>
            <div v-show="isShowOrgCard">
                <ButtonGroup>
                    <Button :disabled="!B050509 || !selectedOrg" @click="editOrUpdate('org', 'add')">新增</Button>
                    <!--<Button :disabled="!B050510 || !selectedOrg" @click="editOrUpdate('org', 'update')">修改</Button>-->
                    <Button :disabled="!B050511 || (!(selectedOrg && (selectedOrg ? selectedOrg.children.length == 0 : true)))" @click="removeOrg">删除</Button>
                </ButtonGroup>
                <Button @click.native="isShowOrgCard = false">取消维护</Button>
                <br/>
                <Tree :data="orgSystemData" ref="tree" @on-select-change="selectOrg"></Tree>
            </div>
            <div v-if="!isShowOrgCard">
                <Tabs v-model="activePanel" @on-click="changePanel">
                    <TabPane label="按部门显示" name="panel1">
                        <Button @click="editOrUpdate('dept', 'add')" :disabled="!selectedOrg" class="btn-add">添加部门</Button>

                        <Menu mode="vertical" :active-name="selectedDeptIndex" class="dept-list" @on-select="currentDeptChange">
                            <MenuItem v-for="(item, index) in deptData" :key="index" :name="index" class="dept-item">
                                {{item.name}}
                                <ButtonGroup style="float: right;">
                                    <Button type="ghost" icon="ios-compose-outline" title="修改" size="small" @click="editOrUpdate('dept', 'update', item)"></Button>
                                    <Button type="ghost"  icon="ios-trash-outline" title="删除" size="small" @click="removeDept(item)"></Button>
                                </ButtonGroup>
                            </MenuItem>
                        </Menu>
                    </TabPane>
                    <TabPane label="按岗位显示" name="panel2">
                        <Menu mode="vertical" :active-name="selectedPostIndex" class="post-list" @on-select="currentPostChange">
                            <MenuItem v-for="(item, index) in postsData" :key="index" :name="index" class="post-item">
                                {{item.name}}
                                <span>{{ item.userCount }}</span>
                            </MenuItem>
                        </Menu>
                    </TabPane>
                </Tabs>
            </div>
        </div>
        <div class="center">
            <!-- 组织编辑功能 -->
            <Row v-if="isShowOrgCard && selectedOrg">
                <i-col span="24">
                    <OrganizationCard :id="operateOrgType == 'add' ? null : selectedOrg.id" :orgSystemData="selectedOrg" :B050201="B050508" :isOrg = "true" :cancelBtn="true" :isComponent="true" :isSaveOrgSystem="true" @on-cancel="cancelShowCard"></OrganizationCard>
                </i-col>
            </Row>
            <div v-else>
                <!-- 用户编辑功能 -->
                <template v-if="activePanel == 'panel1'">
                    <Row>
                        <i-col span="12">
                            <Button @click="editOrUpdate('user', 'add')" :disabled="!selectedDept" class="btn-add">添加业务用户</Button>
                            <Button @click="editOrUpdate('userManager', 'add')" :disabled="!selectedDept" class="btn-add">添加机构管理员</Button>
                        </i-col>
                        <i-col span="12" style="display: flex;">
                            <Input placeholder="请输入姓名/手机/用户名进行搜索" icon="search" :disabled="!selectedDept" @on-enter="searchUser" @on-click="searchUser" v-model="searchUserName"/>
                            <Button type="ghost" style="margin-left: 20px;background: #FFF;z-index: 2;border: 0;" @click="isShowLeadPage = true">
                                操作指引
                                <Icon type="document-text"></Icon>
                            </Button>
                        </i-col>
                    </Row>
                    <Table size="small" :data="userData" :columns="userColumns" highlight-row @on-selection-change="selectUserData"></Table>
                    <br/>
                    <Row>
                        <i-col span="12">
                            <Button type="ghost" @click="editOrUpdate('batchSet', 'post')" :disabled="selectedUsers.length == 0" class="btn-add">批量设置岗位信息</Button>
                        </i-col>
                        <i-col span="12" style="padding: 4px 0;">
                            <Page size="small" :total="userTotal" :current="userPage" @on-change="changeUserPage"></Page>
                        </i-col>
                    </Row>
                </template>
                <!-- 岗位信息 -->
                <template v-else>
                    <Button @click="editOrUpdate('batchSet', 'user')" :disabled="!selectedPost" class="btn-add">选择业务人员</Button>
                    <Row>
                        <i-col span="22">
                            <div class="post-user-list">
                                <template v-if="postUsersData.length>0">
                                    <div class="post-user-item" v-for="(item, index) in postUsersData" :key="index" :id="item.key">
                                        <p>{{ item.key }}</p>
                                        <Row :gutter="16">
                                            <i-col span="6" v-for="(userInfo, index1) in item.list" :key="index1">
                                                <Tag closable :name="userInfo.id" @on-close="removeUserPost">{{ userInfo.realName }}</Tag>
                                            </i-col>
                                        </Row>
                                    </div>
                                </template>
                                <div v-else class="no-change">
                                    <span>暂无岗位人员</span>
                                </div>
                            </div>
                        </i-col>
                        <i-col span="2">
                            <ul class="post-user-legend-list">
                                <li v-for="(item, index) in postUsersData" :key="index">
                                    <a :href="'#' + item.key">{{ item.key }}</a>
                                </li>
                            </ul>
                        </i-col>
                    </Row>
                </template>
            </div>
        </div>

        <!-- 引导页 -->
        <div v-show="isShowLeadPage" class="lead-page">
            <component is="LPOrgSetting" @on-hide-page="hideLeadPage"></component>
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
            selectedOrg(val) {
                this.selectedOrg = val;
                this.deptData = [];
                this.selectedDept = null;
                this.userData = [];
                this.deptDataPage = 1;
                this.searchDeptName = null;
                this.userPage = 1;
                this.searchUserName = null;
                this.postsData = [];
                this.selectedPost = null;
                if (!String.isNullOrBlank(val)) {
                    if (this.activePanel == 'panel1') {
                        this.getDeptData();
                    }else {
                        this.getPostsData();
                    }
                }
            },
            selectedDept(val) {
                this.isShowOrgCard = false;
                this.userData = [];
                this.userPage = 1;
                this.searchUserName = null;
                if (!String.isNullOrBlank(val)) {
                    this.getUserData(val.id);
                }
            },
            selectedPost(val) {
                this.postUsersData = [];
                this.selectedUsers = [];
                if (!String.isNullOrBlank(val)) {
                    this.getPostUsersData();
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
                    {type: 'selection', width: 60, align: 'center'},
                    {title: '姓名', key: 'realName', align: 'center', ellipsis: true, render: (h, params) => {
                        return h('Tooltip', {
                            props: {
                                content: params.row.realName,
                                placement: 'bottom',
                            },
                            attrs: {
                                class: 'post-name'
                            },
                            style: {
                                'margin-right': '2px'
                            }
                        }, params.row.realName);
                    }},
                    {title: '手机', align: 'center', key: 'phone', width: '120', render: (h, params) => {
                        return params.row.phone == '0' ? '暂无' : params.row.phone;
                    }},
                    {title: '用户名', align: 'center', key: 'userName'},
                    {title: '岗位信息', align: 'center', key: 'posts', render: (h, params) => {
                        if (params.row.posts) {
                            if(params.row.posts.length > 0 && !String.isNullOrBlank(params.row.posts[0])){
                                return h('Tooltip', {
                                    props: {
                                        placement: 'left',
                                    },
                                    attrs: {
                                        class: 'post-name'
                                    },
                                    style: {
                                        'margin-right': '2px'
                                    }
                                }, [
                                    h('span', params.row.posts[0]),
                                    h('pre', {
                                        slot: 'content',
                                        style: {
                                            'margin': '0px'
                                        }
                                    }, params.row.posts[0].split(',').join('\n'))
                                ]);
                            }
                        }
                        return '无';
                    }},
                    {renderHeader: (h, params) => {
                        return h('div', {
                            attrs: {
                                style: 'white-space: nowrap;'
                            }}, [
                            '所属其他组织',
                            h('Tooltip', {
                                props: {
                                    content: '该用户属于除本组织外的其他组织',
                                    placement: 'top',
                                },
                                style: {
                                    'margin-right': '2px',
                                    'vertical-align': 'middle'
                                }
                            }, [
                                h('Icon', {
                                    props: {
                                        type: 'ios-help-outline'
                                    },
                                    style: {
                                        'font-size': '18px',
                                        'margin-left': '5px'
                                    }
                                })
                            ])
                        ]);
                        }, align: 'center', key: 'orgs', render: (h, params) => {
                            if(params.row.orgs){
                                if(params.row.orgs.length > 0 && !String.isNullOrBlank(params.row.orgs[0])){
                                    return h('Tooltip', {
                                        props: {
                                            placement: 'bottom',
                                        },
                                        style: {
                                            'margin-right': '2px'
                                        }
                                    }, [
                                        h('span', '查看组织'),
                                        h('pre', {
                                            slot: 'content',
                                            style: {
                                                'margin': '0px',
                                                'white-space': 'pre-wrap'
                                            }
                                        }, params.row.orgs[0].split(',').join('\n'))
                                    ]);
                                }
                            }
                            return '无';
                        }
                    },
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
                isShowOrgCard: false,
                operateOrgType: 'update',
                isStart:'启用',

                isShowLeadPage: false,
                checkKey: 'ORGANIZATION_MANAGEMENT_SETTINGS',

                activePanel: 'panel1',
                postsData: [],
                selectedPost: null,
                selectedPostIndex: null,
                postUsersData: [],
                selectedUsers: [],
                selectedUserLevel: null,
                isShowBatchPostCard: true
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
            this.getOrgSystemData();
        },
        methods: {
            showOrgSelection () {
                this.orgSelectMode = !this.orgSelectMode;
            },
            /** 数据获取函数 -- Data */
            getOrgSystemData (defaultShowNode) {
                this.request({
                    url: `/systemManage/orgSystems/getCurOrgSysTree.do`,
                    param: {
                        defaultOrgId: defaultShowNode ? defaultShowNode.id : null
                    }
                }).then(data => {
                    if (data) {
                        if (defaultShowNode) {
                            this.selectedOrg = defaultShowNode;
                        }else {
                            if (data.length > 0) {
                                data[0].selected = true;
                                this.selectedOrg = data[0];
                            }
                        }
                        this.orgSystemData = data;
                    }else {
                        this.orgSystemData = [];
                    }
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
                    if (items) {
                        this.userData = items.records;
                        this.userTotal = items.total;
                        this.userPage = items.current;
                    }else {
                        this.userData = [];
                        this.userTotal = 0;
                        this.userPage = 1;
                    }
                });
            },
            getPostsData () {
                if( this.selectedOrg) {
                    this.request({
                        url: "/systemManage/posts/getOrgPostsByOrgId.do",
                        data: {
                            orgId: this.selectedOrg.id,
                            page: 1,
                            size: 1000
                        }
                    }).then(data => {
                        if (data) {
                            this.postsData = data.records;
                        }else {
                            this.postsData = [];
                        }
                    });
                }
            },
            getPostUsersData () {
                if( this.selectedPost) {
                    this.request({
                        url: "/systemManage/userOrgManage/getUsersByPostId.do",
                        param: {
                            orgId: this.selectedOrg.id,
                            postId: this.selectedPost.id,
                            permissionLevel: this.selectedPost.permissionLevel
                        }
                    }).then(data => {
                        if (data) {
                            this.postUsersData = data;
                        }else {
                            this.postUsersData = [];
                        }
                    });
                }
            },
            refreshPostPage() {
                this.getPostsData();
                if (this.selectedPost) {
                    this.getPostUsersData();
                }
            },
            refreshDeptPage() {
                this.getDeptData();
                if (this.selectedDept) {
                    this.getUserData();
                }
            },
            /** 组件操作函数 -- Event */
            selectOrg (selection) {
                if(selection.length > 0) {
                    let item = selection[0];
                    this.selectedOrg = item;
                    this.operateOrgType = 'update';
                }else {
                    this.selectedOrg = null;
                }
                if(this.isShowOrgCard) {
                }else {
                    this.orgSelectMode = false;
                }
            },
            currentDeptChange(index){
                this.selectedDeptIndex = index;
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
                    this.isShowOrgCard = true;
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
                        afterClose: this.getUserData,
                        callback: (flag, close) => {
                            if (flag) {
                                close();
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
                }else if (cardType == 'batchSet') {
                    if (this.isShowBatchPostCard) {
                        let data = {};
                        if (operateType == 'post') {
                            data = {
                                orgId: this.selectedOrg.id,
                                deptId: this.selectedDept.id,
                                userData: this.selectedUsers,
                                authLevel: this.selectedUserLevel,
                                type: operateType,
                            }
                        }else {
                            data = {
                                orgId: this.selectedOrg.id,
                                type: operateType,
                                userData: [],
                                authLevel: this.selectedPost.permissionLevel,
                                postId: this.selectedPost.id,
                                callbackFunc: this.refreshPostPage
                            }
                        }
                        this.prompt({
                            title: operateType == 'post' ? '批量设置岗位信息' : '选择业务人员',
                            code: 'postBatchSetCard',
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
                    }else {
                        this.$Message.error("请选择相同岗位级别人员进行设置");
                    }
                }
            },
            cancelShowCard(type) {
                if (type == 'org') {
                    this.getOrgSystemData(this.selectedOrg);
                }
            },
            /** 删除方法 */
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
            removeUserPost(event, name) {
                this.request({
                    url: "/systemManage/userOrgManage/removeUserPostRelation.do",
                    data: {
                        userId: name,
                        orgId: this.selectedOrg.id,
                        postId: this.selectedPost.id
                    }
                }).then(() => {
                    this.$Message.success('删除岗位关联成功');
                    this.refreshPostPage();
                });
            },
            getLocalTime(nS) {
                return new Date(parseInt(nS)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
            },
            hideLeadPage() {
                this.isShowLeadPage = false;
            },
            changePanel(name) {
                if (name == 'panel1') {
                    this.refreshDeptPage();
                }else {
                    this.refreshPostPage();
                }
            },
            currentPostChange(index){
                this.selectedPostIndex = index;
                this.selectedPost = this.postsData[index];
            },
            selectUserData(selection) {
                let vm = this;
                vm.isShowBatchPostCard = true;
                vm.selectedUsers = selection;
                if (selection.length > 0) {
                    vm.selectedUserLevel = selection[0].permissionLevel;
                    selection.forEach((item) => {
                        if (item.permissionLevel != vm.selectedUserLevel) {
                            vm.isShowBatchPostCard = false;
                        }
                    });
                }
            },
        },
        components: {
            OrganizationCard,
            LPOrgSetting
        }
    };
</script>