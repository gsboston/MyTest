<style scoped>
    .save-button{
        width: 100px;
        height: 30px;
        border: 1px solid #59b399;
        color: #59b399;
        border-radius: 5px;
    }
    .audit-button{
        width: 100px;
        height: 30px;
        background-color: #59b399;
        border: 1px solid #59b399;
        border-radius: 5px;
    }
    .system-table{
        height: 365px;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .system-table >>> .ivu-table-cell{
        padding-left: 8px;
        padding-right: 8px;
    }
    .systemTree{
        height: 400px;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .btn-css{
        text-align: center;
        margin-top: 10px;
    }
</style>
<template>
    <div>
        <Row :gutter="16">
            <i-col span="8">
                <div class="system-table">
                    <Table highlight-row :columns="columns" :data="systemData" @on-current-change="systemDataPick"></Table>
                </div>
                <Page size="small" style="margin-top: 10px" :total="total" :current="page" @on-change="searchPage"></Page>
            </i-col>
            <i-col span="16">
                <div class="systemTree">
                    <Tree :data="treeData" @on-select-change="selectCurrentOrg"></Tree>
                </div>
            </i-col>
        </Row>
        <Row class="btn-css">
            <Button type="ghost" class="save-button" @click="cancelCommit">取消</Button>
            <Button type="primary" class="audit-button" @click="addSubmit">确定</Button>
        </Row>
    </div>
</template>

<script>
    import ICol from "../../../node_modules/iview/src/components/grid/col.vue";

    export default {
        components: {ICol},
        props: {
            id:null,
        },
        data () {
            return {
                systemData: [],
                columns: [
                    {title: '体系编码',width:100,key: 'code'},
                    {title: '体系名称',key: 'name'},
                ],
                selectedItem: null,
                treeData: [],
                selectedTree: [],
                page: 1,
                total: 0,
            }
        },
        created: function(){
            this.search();
        },
        methods: {
            search: function () {
                this.page = this.page || 1;
                this.selectedItem = null;
                this.request({
                    url: '/systemManage/organizationSystem/getOrgSystemList.do',
                    data: {
                        orgName: "",
                        page: this.page
                    }
                }).then(data => {
                    this.systemData = data.records;
                    this.total = data.total;
                })
            },
            systemDataPick: function (currentRow) {
                this.selectedItem = currentRow;
                this.treeRender();
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
            selectCurrentOrg (currentTree) {
                if(currentTree){
                    this.selectedTree = currentTree[0];
                }
            },
            searchPage: function (page) {
                this.page = page;
                this.search();
            },
            cancelCommit (){
                this.callback("");
            },
            addSubmit() {
                if(this.selectedTree == []){
                    this.$Message.info("请先选择上级组织！");
                    return;
                }
                this.request({
                    url: "/systemManage/companyOpenAudit/auditSuccess.do",
                    param: {
                        parentId: this.selectedTree.orgSystemOrgId,
                        id: this.id
                    }
                }).then((data)=>{
                    if(data == null){
                        this.callback("success");
                    }
                });
            },
        },
    }
</script>
