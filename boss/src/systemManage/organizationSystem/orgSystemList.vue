<template>
    <div>
        <div class="systemList">
            <Row type="flex" justify="space-between" >
                <i-col>
                    <ButtonGroup>
                        <Button @click="add">新增</Button>
                        <Button :disabled="!selectedItem" @click="update">修改</Button>
                    </ButtonGroup>
                    <Button :disabled="!selectedItem" @click.native="del">删除</Button>
                </i-col>
                <i-col>
                    <Input placeholder="请输入体系名称" style="width: 200px;" v-model="searchText" icon="search" @on-enter="search" @on-click="search" />
                </i-col>
            </Row>
            <br/>
            <Table highlight-row :columns="columns" :data="systemData" @on-current-change="systemDataPick"></Table>
            <br/>
            <Page size="small" :total="total" :current="page" @on-change="searchPage"></Page>
        </div>
        <div class="systemTree">
            <Tree :data="treeData"></Tree>
        </div>
    </div>
</template>

<script>
    export default {
        data: function() {
            return {
                columns: [
                    {
                        title: '体系编码',
                        key: 'code'
                    },
                    {
                        title: '体系名称',
                        key: 'name'
                    },
                    {
                        title: '生效日期',
                        key: 'effectiveDate'
                    }
                ],
                systemData: [],
                treeData: [],
                selectedItem: null,
                searchText: '',
                page: 1,
                total: 0
            }
        },
        created: function () {
            this.search();
        },
        methods: {
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
            add: function () {
                this.prompt({
                    code: 'orgSystemAdd',
                    title: '新增组织体系',
                    width: 950,
                    height: 560,
                    callback: () => {
                        /*close();*/
                        this.search();
                    }
                })
            },
            update: function () {
                this.prompt({
                    code: 'orgSystemEdit',
                    title: '修改组织体系',
                    width: 950,
                    height: 520,
                    props: {
                        id: this.selectedItem.id
                    },
                    callback: (close) => {
                        close();
                        this.search();
//                        close();
                    }
                })
            },
            del: function () {
                this.$Modal.confirm({
                    content: '确定删除吗?',
                    onOk: () => {
                        this.request({
                            url: '/systemManage/organizationSystem/orgSystemDel.do',
                            param: {
                                orgSystemId: this.selectedItem.id
                            }
                        }).then(() => {
                            this.$Message.success('删除成功');
                            this.search();
                        }, () => {
                            this.$Message.error('删除失败');
                        })
                    }
                });
            },
            search: function () {
                this.page = this.page || 1;
                this.selectedItem = null;
                this.request({
                    url: '/systemManage/organizationSystem/getOrgSystemList.do',
                    data: {
                        orgName: this.searchText,
                        page: this.page
                    }
                }).then(data => {
                    this.systemData = data.records;
                    this.total = data.total;
                })
            },
            searchPage: function (page) {
                this.page = page;
                this.search();
            }
        }
    }
</script>

<style scoped>
    .systemList{
        position: relative;
        margin-right: 400px;
        padding: 15px;
    }
    .systemTree {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width: 400px;
        padding: 15px;
        overflow: auto;
        border-left: solid 1px #dddee1;
    }
</style>