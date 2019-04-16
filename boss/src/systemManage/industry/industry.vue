<template>
    <div class="container" id="org">
        <div class="center">
            <Row>
                <i-col span="18">
                    <ButtonGroup>
                        <Button type="ghost" :disabled="!isAllowAdd" @click="addIndustry">新增</Button>
                        <Button type="ghost" :disabled="!selectedItem" @click="updateIndustry">修改</Button>
                        <Button type="ghost" :disabled="!selectedItem" @click="removeIndustry">删除</Button>
                    </ButtonGroup>
                </i-col>
                <i-col span="6">
                    <Input placeholder="请输入查询条件" icon="search" @on-enter="search" @on-click="search" v-model="searchName"/>
                </i-col>
            </Row>
            <br/>
                <Table :data="industryData" ref="dataTable" :columns="industryColumns" highlight-row @on-row-click="industryDataPick" size="small" border :show-header="false">
                    <template slot="header">
                        <div class="custom-header">
                            <div>
                                <div class="multiple-head">代码</div>
                                <div class="multiple-head">门类</div>
                                <div class="multiple-head">大类</div>
                                <div class="multiple-head">中类</div>
                            </div>
                            <div>类别名称</div>
                            <div>说明</div>
                        </div>
                    </template>
                </Table>
            <br/>
            <Page size="small" :total="industryDataTotal" :current="curPage" :page-size="pageSize" @on-change="changePage"></Page>
        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        data () {
            let reg = new RegExp(/^[A-Za-z]+$/);
            return {
                /** 行业档案相关参数 */
                industryData: [],
                industryColumns: [
                    {title: '门类', align: 'center', key: 'code', width: 120, render: (h, params) => {
                        let code = this.industryData[params.index].code;
                        return (code.length == 1 ? code : '') ? code : '';
                    }},
                    {title: '大类', align: 'center', key: 'code', width: 120, render: (h, params) => {
                        let code = this.industryData[params.index].code;
                        return reg.test(code) ? '' : (code.length == 3 ? code : '');
                    }},
                    {title: '中类', align: 'center', key: 'code', width: 120, render: (h, params) => {
                        let code = this.industryData[params.index].code;
                        return reg.test(code) ? '' : (code.length == 4 ? code : '');
                    }},
                    {title: '类别名称', key: 'name', width: 360, render: (h, params) => {
                        let item = this.industryData[params.index];
                        let code = item.code;
                        if (code.length == 3) {
                            return '    ' + item.name;
                        }else if (code.length == 4) {
                            return '        ' + item.name;
                        }else {
                            return item.name;
                        }
                    }},
                    {title: '说明', key: 'describe'}
                ],
                selectedItem: null,
                industryDataTotal: 0,
                curPage: 1,
                pageSize: 10,
                searchName: null,
                isAllowAdd: true
            }
        },
        watch: {
            selectedItem(value) {
                this.selectedItem = value;
                if (value) {
                    if (value.code.length >= 4) {
                        this.isAllowAdd = false;
                    }else {
                        this.isAllowAdd = true;
                    }
                }else {
                    this.isAllowAdd = true;
                }
            }
        },
        props: {
            B050201: false
        },
        created: function () {
            this.getIndustryList(); //获取行业档案数据列表
        },
        methods: {
            /** 数据获取函数 -- Data */
            getIndustryList () {
                this.selectedItem = null;
                this.request({
                    url: '/systemManage/industry/list.do',
                    param: {
                        curPage: this.curPage,
                        pageSize: this.pageSize,
                        searchName: this.searchName
                    }
                }).then(data => {
                    this.industryData = data.records;
                    this.industryDataTotal = data.total;
                });
            },
            /** 组件操作函数 -- Event */
            changePage (pageIndex) {
                this.curPage = pageIndex;
                this.getIndustryList();
            },
            industryDataPick (currentRow) {
                if (this.selectedItem) {
                    if (this.selectedItem.id == currentRow.id) {
                        this.selectedItem = null;
                        this.$refs['dataTable'].clearCurrentRow();
                    }else {
                        this.selectedItem = currentRow;
                    }
                }else {
                    this.selectedItem = currentRow;
                }
            },
            addIndustry () {
                //新增行业档案信息
                let _title = '';
                if(this.selectedItem) {
                    if (this.selectedItem.code.length == 1) {
                        _title = ' -- 大类';
                    }else if (this.selectedItem.code.length == 3) {
                        _title = ' -- 中类';
                    }else {
                        return;
                    }
                }else {
                    _title = ' -- 门类';
                }
                this.prompt({
                    title: "新增行业类别" + _title,
                    code: 'industryCard',
                    props: {
                        parentId: this.selectedItem ? this.selectedItem.id : null
                    },
                    width: 600,
                    height: 400,
                    callback: (flag, close) => {
                        if (flag) {
                            this.getIndustryList();
                        }
                        close();
                    }
                });
            },
            updateIndustry () {
                //修改行业档案信息
                this.prompt({
                    title: "修改行业类别",
                    code: "industryCard",
                    width: 600,
                    height: 400,
                    props: {
                        id: this.selectedItem.id
                    },
                    callback: (flag, close) => {
                        if (flag) {
                            this.getIndustryList();
                        }
                        close();
                    }
                });
            },
            removeIndustry () {
                this.$Modal.confirm({
                    content: "请确认删除操作",
                    onOk: () => {
                        this.request({
                            url: "/systemManage/industry/delete.do",
                            param: {
                                id: this.selectedItem.id,
                            }
                        }).then(() => {
                            this.$Message.success('删除成功!');
                            this.getIndustryList();
                            close();
                        }, error => {
                            this.$Message.error(error.message);
                        });
                    }
                });
            },
            search () {
                this.curPage = 1;
                this.getIndustryList();
            }
        }
    };
</script>

<style scoped>
    .container {
        padding: 15px;
    }

    .custom-header {
        width: 100%;
        margin: 0;
        height: 100%;
        display: flex;
        background: #f8f8f9;
        text-align: center;
        font-weight: bold;
        border-bottom: 1px solid #e9eaec;
    }

    .custom-header > div {
        width: 0;
        flex: 360px 0 0;
        flex-wrap: wrap;
        border-right: 1px solid #e9eaec;
    }

    .custom-header > div:first-child {
        display: inline-flex;
    }

    .custom-header > div:last-child {
        flex: 1;
        border-right: 0;
    }

    .custom-header .multiple-head {
        flex: 1;
        line-height: 30px;
        height: 30px;
        border-right: 1px solid #e9eaec;
    }

    .custom-header .multiple-head:first-child {
        width: 100%;
        flex: 360px 0 0;
        border-bottom: 1px solid #e9eaec;
        border-right: 0;
    }

    .custom-header .multiple-head:last-child {
        border-right: 0;
    }

    .container >>> .ivu-table-title {
        height: 60px;
        line-height: 60px;
        border-bottom: 0;
    }

    .container >>> .ivu-table td {
        vertical-align: baseline;
        padding: 10px 0;
        border-bottom: 0;
    }

    .container >>> .ivu-table td:nth-child(4) .ivu-table-cell {
        white-space: pre;
    }
</style>