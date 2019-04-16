<template>
    <div style="margin: 8px 6px;">
        <Form ref="form" :model="form" :label-width="80" inline>
            <FormItem label="组织体系" prop="name" :rules="[{required: true, message: '组织体系不能为空', trigger: 'blur'},{max:50,message:'组织体系不能多于20个字符'}]">
                <Input v-model="form.name" placeholder="请输入组织体系"></Input>
            </FormItem>
            <FormItem label="体系编码" prop="code" :rules="[{required: true, message: '体系编码不能为空', trigger: 'blur'},{max:20,message:'体系编码不能多于20个字符'}]">
                <Input v-model="form.code" placeholder="请输入体系编码" ></Input>
            </FormItem>
            <FormItem label="生效日期" prop="effective_date" :rules="{required: true, message: '生效日期不能为空'}">
                <!--<Input v-model="formValidate.name" placeholder="请选择日期和时间"></Input>-->
                <DatePicker type="datetime" placeholder="选择日期和时间" v-model="form.effective_date"></DatePicker>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="add">保存</Button>
            </FormItem>
        </Form>

        <Alert type="warning" show-icon>完成保存组织体系基本信息后，方可操作组织体系下-组织管理</Alert>

        <Row class-name="">
            <i-col span="15" class-name="colHeight">
                <Card dis-hover>
                    <Row type="flex" justify="end" align="middle">
                        <i-col>
                            <Input placeholder="请输入组织名称" :disabled="orgSystemId == 0" style="width: 200px;" v-model="searchText" icon="search" @on-enter="search" @on-click="search" />
                        </i-col>
                    </Row>
                    <br/>
                    <Table height="290" highlight-row :columns="columns" :data="orgData" @on-current-change="orgItemPick"></Table>
                    <br/>
                    <Page size="small" :total="5"></Page>
                </Card>
            </i-col>
            <i-col span="2" class-name="colHeight colOperation">
                <div>
                    <Button type="ghost" icon="arrow-right-a" title="右移" :disabled="isDisableRight" @click="arrowRight"></Button>
                    <br/>
                    <Button type="ghost" icon="arrow-left-a" title="左移" :disabled="isDisableLeft" @click="arrowLeft"></Button>
                </div>
            </i-col>
            <i-col span="7" class-name="colHeight">
                <Card dis-hover>
                    <Tree class="systemTree" :data="treeData" @on-select-change="treeItemPick"  ref="tree"></Tree>
                </Card>
            </i-col>
        </Row>
    </div>
</template>

<script>
    export default {
        props: {
            item: {
                type: Object,
                default: function () {
                    return {};
                }
            },
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
                treeData: [],
                selectedOrgItem: null,
                selectedTreeItem: null,
                searchText: '',
                form: {},
                orgSystemId: 0
            }
        },
        created: function () {

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
                        id: this.selectedItem.id
                    }
                }).then(data => {
                    this.treeData = data;
                })
            },
            treeItemAdd: function (item, callback) {
                this.request({
                    url: '/systemManage/organizationSystem/AddOrgTree.do',
                    data: {
                        id: this.orgSystemId,
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
                        orgSystemId: this.orgSystemId,
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
                        orgsystem_id: this.orgSystemId,
                        name: this.searchText
                    }
                }).then(data => {
                    this.orgData = data.records;
                })
            },
            add: function () {
                this.$refs.form.validate(valid => {
                    if(valid){
                        this.request({
                            url: '/systemManage/organizationSystem/add.do',
                            data: this.form
                        }).then(data => {
                            this.$Message.success('保存成功');
                            if (data){
                                this.orgSystemId = data;
                                this.search();
                                this.callback();
                            }
                        })
                    } else {
                        this.$Message.error('表单验证失败');
                    }
                })
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
</style>