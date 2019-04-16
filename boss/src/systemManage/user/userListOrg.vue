<template>
    <div id="userListOrgId" class="userWrap">
        <div class="userMenu">
            <Tree :data="baseDataOrg"  ref="tree" @on-select-change="selectOrgUser"></Tree>
        </div>

        <div class="userInfo">
            <Row style="margin:0 0 8px 0;">
                <!--<Button  @click="addBtn" :disabled="selectedOrgitems == null">新增</Button>-->
                <Button  @click="addBtn" >新增</Button>
            </Row>
            <Table  size="small"  :data="tableData" :columns="tableColumns" highlight-row stripe border @on-current-change="currentChange"></Table>
            <Row style="margin: 10px;overflow: hidden">
                <Row style="float: right;">
                    <Page  size="small" :total="total" :current="page" @on-change="changePage"></Page>
                </Row>
            </Row>
            <Row class="infoDiv" v-show="isShow">
                <h3 class="infoTitle">岗位信息</h3>

                <Checkbox  v-for="item in checkboxLabel" v-model="item.checked" @on-change="checkAllGroupChange" :label="item.id" :key="item.id">{{item.name}}</Checkbox>
                <Button type="primary" @click="handleSubmit()" class="saveBtn" :disabled="disabled">保存</Button>
            </Row>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                disabled: true,
                baseDataOrg: [],
                treeVal:null,
                inputVal:null,
                total: 0,
                page: 1,
                orgId:null,
                deptId: null,
                isShow:false,
                selectedOrgitems:null,
                savePostInfo:null, //保存岗位信息存储
                tableColumns: [
                    {
                        title: '名字',
                        key: 'realName',
                        align: 'center'
                    },
                    {
                        title: '联系电话',
                        align: 'center',
                        key: 'tel',
                    },
                    {
                        title: '登录账号',
                        align: 'center',
                        key: 'userName'
                    },
                    {
                        title: '创建日期',
                        align: 'center',
                        key: 'date'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 260,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.editBtn(params.row)
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                tableData:[],
                checkboxLabel:[]
            }
        },
        methods:{
            orgTableData:function() {
                /*this.$Loading.start();*/
                this.page = this.page || 1;
                this.request({
                    url: "/organizeManage/user/userlistInfo.do",
                    data: {
                        deptId:this.deptId,
                        userName:this.inputVal,
                        page:this.page
                    }
                }).then(items => {
                    /* this.$Loading.finish();*/
                    this.tableData = items.records;
                    this.total = items.total;
                })

            },
            remove (index) {
                this.$Modal.confirm({
                    content: '确定删除吗?',
                    onOk: () => {
                        this.request({
                            url: "/organizeManage/user/userDelete.do",
                            param: {
                                id: index.row.id
                            }
                        }).then(data => {
                            this.$Message.success('删除成功');
                            this.mockTableData();
                        }, error => {
                            this.$Message.error('删除失败');
                        })
                    }
                });
            },
            changePage (row) {
                this.page = row;
                this.orgTableData();
            },
            addBtn(row){
                this.prompt({
                    code: "userAddOrgList",
                    width:600,
                    height:400,
                    props: {
                        /*orgId:this.orgId,
                        deptId:this.deptId*/
                        orgId:1232323232323,
                        deptId:234123412345,
                    },
                    callback: (attr1, attr2, attr3, close) => {
                        close();
                        this.orgTableData();
                    }
                });
            },
            editBtn(row){
                this.prompt({
                    code: "userEditOrgList",
                    width:600,
                    height:400,
                    props: {
                        id:row.id,
                        /*orgId:this.orgId,
                        deptId:this.deptId*/
                        orgId:1232323232323,
                        deptId:234123412345,
                    },
                    callback: (close) => {
                        close();
                    }
                });
            },
            currentChange(currentRow){
                /*this.savePostInfo = currentRow
                this.isShow = true
                this.checkboxLabel = currentRow.checkboxLabel*/


                /*this.savePostInfo = currentRow*/
                this.isShow = true
                /* this.checkboxLabel = currentRow.checkboxLabel*/

                this.request({
                    url: "/organizeManage/user/userEdit.do",
                    param: {
                        id: currentRow.id,
                        orgId: 1232323232323 //this.orgId
                    }
                }).then(item => {
                    this.checkboxLabel = item.posts
                })

            },
            selectOrgUser(selection){
                if(selection.length > 0) {
                    let item = selection[0];
                    this.selectedOrgitems = item;
                    this.deptId = selection[0].id
                    this.orgTableData();
                }else {
                    this.selectedUser = null;
                }
            },
            handleSubmit(){
                this.request({
                    url: '/saveOrgListPost/save.do',
                    param: {
                        item :JSON.stringify(Object.assign({}, this.checkboxLabel)),
                        id:this.savePostInfo.id
                    }
                }).then(data => {

                })
            },
            checkAllGroupChange(data){
                 this.disabled = false;
            }
        },

        created:function(){
            this.request({
                url: "/organizeManage/userListOrg/getOrgMenuList.do"
            }).then(items => {
                this.baseDataOrg = items;
            })

            this.orgTableData();
        }
    }
</script>

<style scoped>
    .userWrap{
        overflow: auto;
        width:100%;
    }
    .searchBtn{
        width:180px;
        margin-left:58%;
    }
    .userMenu{
        position: absolute;
        top: 0;
        left: 0;
        width: 200px;
        min-height: 100%;
        padding: 15px;
        border-right: solid 1px #dddee1;
        border-top: solid 1px #dddee1;
    }
    .userInfo{
        position: relative;
        width:80%;
        margin-left: 200px;
    }
    .infoDiv{
        width:560px;
        margin: 27px 0 0 0;
        padding: 10px;
        overflow: hidden;
    }
    .infoDiv label{
        margin:0 20px 0 12px;
    }
    .infoTitle{
        margin: 0 0 10px 0;
    }
    .saveBtn{
        margin: 20px 0 20px 0;
        float: right;
    }

</style>