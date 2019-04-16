<template>
    <div class="container" id="org">
        <div class="center">
            <Row>
                <i-col span="18">
                    <ButtonGroup>
                        <Button type="ghost" @click="addOrg">新增</Button>
                        <Button type="ghost" :disabled="!selectedItem" @click="updateOrg">修改</Button>
                        <Button type="ghost" :disabled="!selectedItem" @click="removeOrg">删除</Button>
                    </ButtonGroup>
                </i-col>
                <i-col span="6">
                    <Input placeholder="请输入查询条件" icon="search" @on-enter="search" @on-click="search" v-model="searchName"/>
                </i-col>
            </Row>
            <br/>
            <Table ref="table" :data="orgData" :columns="orgColumns" highlight-row @on-current-change="orgDataPick" size="small" stripe></Table>
            <br/>
            <Page size="small" :total="orgDataTotal" :current="curPage" :page-size="pageSize" @on-change="changePage"></Page>
        </div>
        <div class="right">
            <div style="text-align: center;">
                <Button type="primary" style="width: 160px;" :disabled="!selectedItem" @click="addOrganizationMager">创建机构管理员</Button>
            </div>
            <br/>
            <div>
                <div class="dept-item" v-for="(item, index) in departmentData" :key="index">
                    {{item.realName}}
                    <ButtonGroup style="float: right;">
                        <Button type="ghost" icon="ios-compose-outline" size="small" @click="updateUser(item)"></Button>
                        <Button type="ghost"  icon="ios-trash-outline" size="small" @click="removeUser(item.id)"></Button>
                    </ButtonGroup>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        data () {
            return {
                /** 组织列表相关参数 */
                orgData: [],
                orgColumns: [
                    {title: '编码', key: 'code',width:120},
                    {title: '名称', key: 'name'},
                    {title: '所属区域', key: 'province',align:'center'},
                    {title: '是否签约主体', key: 'signSubject', align:'center',render:(h,params) =>{
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: params.row.signSubject?'android-checkbox-outline':'android-checkbox-outline-blank'
                                    },
                                    style:{
                                        fontSize:'18px',
                                        color: params.row.signSubject?'':'#cccccc'
                                    }
                                })
                            ]);

                    }}
                ],
                selectedItem: null,

                /** 机构管理员相关参数 */
                departmentData: [],
                departmentColumns: [
                    {title: '部门名称',key: 'name'},
                ],
                departmentSelectedItem: null,
                orgDataTotal: 0,
                curPage: 1,
                pageSize: 10,
                searchName: null,
                isOrg:false
            }
        },
        props: {
            B050201: false
        },
        created: function () {
            this.getOrgList(); //获取组织数据列表
        },
        methods: {
            /** 数据获取函数 -- Data */
            getDepartmentList (orgID = '') {
                this.request({
                    url: `/systemManage/organization/getOrgManager.do`,
                    param:{
                        orgID:orgID
                    }
                }).then(data => {
                    this.departmentData = data;
                });
            },
            getOrgList (isSelected = false) {
                this.selectedItem = null;
                this.departmentData = [];
                this.departmentSelectedItem = null;
                this.request({
                    url: '/systemManage/organization/list.do',
                    param: {
                        curPage: this.curPage,
                        pageSize: this.pageSize,
                        searchName: this.searchName
                    }
                }).then(data => {
                    data.records.forEach(function (item) {
                        item.province = (item.province?item.province:"") + "-" + (item.city?item.city:"") + "-" + (item.area?item.area:"");
                    });
                    this.orgData = data.records;
                    this.orgDataTotal = data.total;
                    if (isSelected && data.records) {
                        data.records.forEach((item, index) => {
                            if (item.name == this.searchName) {
                                this.$nextTick(() => {
                                    this.$refs['table'].objData[index]._isHighlight = true;
                                    this.orgDataPick(item);
                                });
                            }
                        });
                    }
                });
            },
            /** 组件操作函数 -- Event */
            changePage (pageIndex) {
                this.curPage = pageIndex;
                this.tableData1 = this.getOrgList();
            },
            orgDataPick: function (currentRow) {
                this.selectedItem = currentRow;
                this.getDepartmentList(this.selectedItem.id); //获取机构管理列表
            },
            departmentDataPick: function (currentRow) {
                this.departmentSelectedItem = currentRow;
            },
            addOrg () {
                //新增组织信息
                this.prompt({
                    title: "新增组织",
                    code: 'organizationCard',
                    props: {
                        B050201: this.B050201,
                        isOrg:this.isOrg,
                        isFilterOrgType: false,
                        isAllowEdit: true
                    },
                    width: 800,
                    height: 560,
                    top: 10,
                    callback: (flag, name, close) => {
                        if (flag) {
                            close();
                            this.curPage = 1;
                            this.searchName = name;
                            this.getOrgList(true);
                        }
                    }
                });
            },
            updateOrg () {
                //组织信息修改
                this.prompt({
                    title: "修改组织",
                    code: "organizationCard",
                    width: 800,
                    height: 560,
                    top: 10,
                    props: {
                        id: this.selectedItem.id,
                        B050201: this.B050201,
                        isOrg:this.isOrg,
                        isFilterOrgType: false,
                        isAllowEdit: true
                    },
                    callback: (flag, name, close) => {
                        if (flag) {
                            close();
                            this.getOrgList();
                        }
                    }
                });
            },
            addOrganizationMager () {
                //新增机构管理员
                this.prompt({
                    title: "新增机构管理员",
                    code: 'orgCardManagement',
                    props: {
                        param: {
                            orgId: this.selectedItem.id
                        }
                    },
                    width:600,
                    height:400,
                    callback: (flag, close) => {
                        if (flag) {
                            close();
                            this.getDepartmentList(this.selectedItem.id);
                        }
                    }
                });
            },
            updateUser (item) {
                this.departmentSelectedItem = item;
                //部门信息修改
                this.prompt({
                    title: "编辑机构管理员",
                    code: "orgCardManagement",
                    width:600,
                    height:400,
                    props: {
                        id: item.id
                    },
                    callback: (flag, close) => {
                        if (flag) {
                            close();
                            this.getDepartmentList(this.selectedItem.id);
                        }
                    }
                });
            },
            removeOrg () {
                this.$Modal.confirm({
                    content: "请确认删除操作",
                    onOk: () => {
                        this.request({
                            url: "/systemManage/organization/delete.do",
                            param: {
                                id: this.selectedItem.id,
                            }
                        }).then(() => {
                            this.$Message.success('删除成功!');
                            close();
                            this.getOrgList();
                        }, error => {
                          /*  this.$Message.error(error.message);*/
                        });
                    }
                });
            },
            removeUser (id) {
                this.$Modal.confirm({
                    content: "请确认删除操作",
                    onOk: () => {
                        this.request({
                            url: "/systemManage/orgManager/delete.do",
                            param: {
                                orgId: this.selectedItem.id,
                                id: id
                            }
                        }).then(() => {
                            this.$Message.success('删除成功!');
                            close();
                            this.getDepartmentList(this.selectedItem.id);
                        });
                    }
                });
            },
            search () {
                this.curPage = 1;
                this.getOrgList();
            },

            /** 常用工具类函数 -- Utils */
            customSubString (str, start, length, replaceStr) {
                if (str != null && str.length > (start + length)){
                    str = str.substr(start, length) + replaceStr;
                }
                return str;
            }
        }
    };
</script>

<style scoped>
    .center {
        position: relative;
        height: 100%;
        margin-right: 300px;
        padding: 15px;
    }
    .right {
        position: absolute;
        top: 0;
        right: 0;
        width: 300px;
        height: 100%;
        padding: 15px 7px;
        border-left: solid 1px #f5f5f5;
    }
    .dept-item {
        position: relative;
        width: 100%;
        padding: 7px 8px;
        line-height: 24px;
        border-radius: 3px;
    }
    .dept-item:not(:last-child) {
        /*border-bottom: dashed 1px #dddee1;*/
    }
    .dept-item:hover {
        background: #f3f3f3;
    }
</style>

<style>
    .custom-tooltip .ivu-tooltip-inner {
        white-space: normal;
    }
</style>