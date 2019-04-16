<template>
    <div style="margin: 8px 6px;">
        <Form ref="form" :model="form" :label-width="80" inline>
            <FormItem label="组织体系" prop="name" :rules="[{required: true, message: '组织体系不能为空', trigger: 'blur'},{max:20,message:'组织体系不能多于20个字符'}]">
                <Input v-model="form.name" placeholder="请输入组织体系"></Input>
            </FormItem>
            <FormItem label="体系编码" prop="code" :rules="[{required: false, message: '体系编码不能为空', trigger: 'blur'},{max:20,message:'体系编码不能多于20个字符'}]">
            <Input v-model="form.code" placeholder="请输入体系编码"></Input>
            </FormItem>
            <FormItem label="生效日期" prop="effective_date" :rules="{required: true, message: '生效日期不能为空'}">
                <DatePicker type="datetime" placeholder="选择日期和时间" v-model="form.effective_date"></DatePicker>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="save">保存</Button>
            </FormItem>
        </Form>
        <Row class-name="">
            <i-col span="15" class-name="colHeight">
                <Card dis-hover>
                    <Row type="flex" justify="end" align="middle">
                        <i-col>
                            <Input placeholder="请输入组织名称" style="width: 200px;" v-model="searchText" icon="search" @on-enter="search" @on-click="search" />
                        </i-col>
                    </Row>
                    <br/>
                    <Table height="290" highlight-row :columns="columns" :data="orgData" @on-current-change="orgItemPick"></Table>
                    <br/>
                    <Page size="small" :total="orgDataTotal" :current="curPage" :page-size="pageSize" @on-change="changePage"></Page>
                </Card>
            </i-col>
            <i-col span="2" class-name="colHeight colOperation">
                <div>
                    <Button type="ghost" icon="arrow-right-a" title="右移" :disabled="isDisableRight" @click="arrowRight"></Button>
                    <br/>
                    <Button type="ghost" icon="arrow-left-a" title="左移" :disabled="isDisableLeft" @click="arrowLeft"></Button>
                </div>
            </i-col>
            <i-col span="7" class-name="colHeight custom-card">
                <Card dis-hover :bordered="false">
                    <Tree class="systemTree" :data="treeData" @on-select-change="treeItemPick"  ref="tree"></Tree>
                </Card>
            </i-col>
        </Row>
    </div>
</template>

<script>
    export default {
        props: {
            id: {
                type: String,
                default: function () {
                    return '';
                }
            }
        },
        data: function () {
            return {
                columns: [
                    {
                        title: '组织编码',
                        key: 'orgCode'
                    },
                    {
                        title: '组织名称',
                        key: 'orgName'
                    },
                    {
                        title: '组织类型',
                        key: 'orgtypeName',
                        width: 110
                    }
                ],
                orgData: [],
                selectedOrgItem: null,
                selectedTreeItem: null,
                searchText: '',
                form: {},
                treeData: [],
                orgDataTotal: 0,
                curPage: 1,
                pageSize: 10
            }
        },
        created: function () {
            this.getInfo();
            this.treeRender();
            this.search();
        },
        methods: {
            orgItemPick: function (currentRow) {
                this.selectedOrgItem = currentRow;
            },
            treeItemPick: function (selection) {
                if(selection && selection.length > 0) {
                    this.selectedTreeItem = selection[0];
                }else {
                    this.selectedTreeItem = null;
                }
            },
            treeRender: function () {
                this.request({
                    url: '/systemManage/organizationSystem/getOrgSystemMember.do',
                    param: {
                        id: this.id
                    }
                }).then(data => {
                    this.treeData = data;
                })
            },
            treeItemAdd: function (item, callback) {
                this.request({
                    url: '/systemManage/organizationSystem/AddOrgTree.do',
                    data: {
                        id: this.id,
                        item: item
                    }
                }).then(id => {
                    callback(id);
                })
            },
            treeItemDel: function () {
                this.request({
                    url: '/systemManage/organizationSystem/delOrgTree.do',
                    data: {
                        orgSystemId: this.id,
                        orgSystemOrgId: this.selectedTreeItem.orgSystemOrgId
                    }
                }).then(() => {
                    this.getTreeItemDel(this.treeData, this.selectedTreeItem.orgSystemOrgId);
                    this.search();
                })
            },
            getTreeItemDel: function (data, id) {
                for (var i in data) {
                    if (data[i].orgSystemOrgId == id) {
                        data.splice(i, 1);
                        break;
                    } else {
                        this.getTreeItemDel(data[i].children, id);
                    }
                }
                this.selectedOrgItem = null;
                this.selectedTreeItem = null;
            },
            arrowLeft: function () {
                if(this.selectedTreeItem.children && this.selectedTreeItem.children.length){
                    this.$Message.warning('当前选中组织不能删除！');
                } else {
                    this.treeItemDel();
                }
            },
            arrowRight: function () {
                var _item = Object.assign({}, this.selectedOrgItem);
                _item.title = _item.orgName;
                _item.children = [];
                if(this.selectedTreeItem){
                    _item.parentId = this.selectedTreeItem.orgSystemOrgId;
                    this.treeItemAdd(_item, (orgSysMemberId) => {
                        _item.orgSystemOrgId = orgSysMemberId;
                        if(!this.selectedTreeItem.children) {
                            this.selectedTreeItem.children = [];
                        }
                        this.selectedTreeItem.children.push(_item);
                        this.selectedTreeItem.expand = true;
                        this.search();
                    });
                } else {
                    this.treeItemAdd(_item, (orgSysMemberId) => {
                        _item.orgSystemOrgId = orgSysMemberId;
                        this.treeData.push(_item);
                        this.search();
                    });
                }
            },
            search: function () {
                this.selectedOrgItem = null;
                this.request({
                    url: '/systemManage/organizationSystem/getOrgOuterList.do',
                    data: {
                        orgsystem_id: this.id,
                        name: this.searchText,
                        page: this.curPage,
                        size: this.pageSize
                    }
                }).then(data => {
                    this.orgData = data.records;
                    this.orgDataTotal = data.total;
                })
            },
            save: function () {
                this.$refs.form.validate(valid => {
                    if(valid){
                        this.request({
                            url: '/systemManage/organizationSystem/update.do',
                            data: this.form
                        }).then(() => {
                            this.$Message.success('修改成功');
                            this.callback();
                        }, () => {
                            this.$Message.error('修改失败');
                        })
                    } else {
                        this.$Message.error('修改失败');
                    }
                })
            },
            getInfo: function () {
                if(this.id) {
                    this.request({
                        url: "/systemManage/organizationSystem/info.do",
                        param: {
                            id: this.id
                        }
                    }).then(data => {
                        this.form = data;
                    });
                }
            },
            changePage (pageIndex) {
                this.curPage = pageIndex;
                this.search();
            }
        },
        computed: {
            isDisableRight() {
                if(!this.selectedOrgItem){
                    return true;
                } else if(this.treeData.length && !this.selectedTreeItem) {
                    return true;
                }

                return false;
            },
            isDisableLeft() {
                if(!this.selectedTreeItem){
                    return true;
                } else if(this.selectedTreeItem.children.length) {
                    return true;
                }

                return false;
            }
        }
    };
</script>

<style scoped>
    .colHeight{
        height: 430px;
        overflow: auto;
    }
    .colHeight > div{
        height: 100%;
    }
    .colOperation{
        border-top: 1px solid #dddee1;
        border-bottom: 1px solid #dddee1;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        font-size: 0;
        text-align: center;
    }
    .colOperation:after {
        content: '';
        height: 100%;
        width: 0;
    }
    .colOperation:after,
    .colOperation>div{
        display: inline-block;
        vertical-align: middle;
    }
    .colOperation>div{
        height: auto;
        text-align: center;
    }
    .colOperation button:first-child{
        margin-bottom: 15px;
    }

    .custom-card {
        border: 1px solid #e9eaec;
    }
</style>