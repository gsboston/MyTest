<template>
    <div>
        <Row>
            <i-col span="12">
                <Button @click="openEditModal('add')">新增</Button>
            </i-col>
            <i-col span="6" offset="6">
                <Input placeholder="请输入查询条件" icon="search" @on-enter="search" @on-click="search" v-model="searchName"/>
            </i-col>
        </Row>
        <br/>
        <Table :data="tableData1" :columns="tableColumns1" stripe></Table>
        <br/>
        <Page size="small" :total="orgTypeDataTotal" :current="curPage" :page-size="pageSize" @on-change="changePage"></Page>
    </div>
</template>

<script type="text/babel">
    export default {
        data () {
            return {
                /** 组织类型列表设置 */
                tableData1: [],
                tableColumns1: [
                    {type: 'selection', width: 60, align: 'center'},
                    {title: 'ID', key: 'id', align: 'center'},
                    {title: '名称', key: 'name', align: 'center'},
                    {title: '编码', key: 'code', align: 'center'},
                    {title: '描述', key: 'describe', align: 'center', render: (h, params) => {
                        return h('div', {class: 'custom-tooltip'}, [
                            h('Tooltip', {
                                props: {
                                    content: this.tableData1[params.index].describe,
                                    placement: 'right'
                                }
                            }, this.customSubString(this.tableData1[params.index].describe, 0, 5, '…'))
                        ]);
                    }},
                    {title: '创建时间', key: 'ts_insert', align: 'center' , render: (h, params) => {
                        if (!this.tableData1[params.index].ts_insert) {
                            return '';
                        }else {
                            return h('div', this.formatDate(this.tableData1[params.index].ts_insert));
                        }
                    }},
                    {title: '操作', key: 'operate', align: 'center', render: (h, params) => {
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
                                        this.openEditModal('update', this.tableData1[params.index].id)
                                    }
                                }
                            }, '修改'),
                            h('Button', {
                                props: {
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.remove(this.tableData1[params.index].id)
                                    }
                                }
                            }, '删除')
                        ]);
                    }}
                ],
                orgTypeDataTotal: 0,
                curPage: 1,
                pageSize: 10,
                searchName: null
            }
        },
        created: function () {
            this.getOrgTypeList(); //获取组织类型数据列表
        },
        methods: {
            /** 数据获取函数 -- Data */
            getOrgTypeList () {
                this.request({
                    url: `/systemManage/organizationType/list.do`,
                    param: {
                        curPage: this.curPage,
                        pageSize: this.pageSize,
                        searchName: this.searchName
                    }
                }).then(data => {
                    if (undefined !== data && null !== data){
                        this.tableData1 = data.records;
                        this.orgTypeDataTotal = data.total;
                    }
                });
            },
            /** 组件操作函数 -- Event */
            changePage (pageIndex) {
                // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
                this.curPage = pageIndex;
                this.tableData1 = this.getOrgTypeList();
            },
            openEditModal(type, orgTypeId){
                //打开模态窗口，新增或修改部门信息
                let _title, _props = {};
                if (type == 'add') {
                    _title = '新增组织类型';
                }else {
                    _title = '修改组织类型';
                    _props = {
                        id: orgTypeId
                    };
                }

                this.prompt({
                    title: _title,
                    code: 'organizationTypeCard',
                    height: 350,
                    props: _props,
                    callback: (flag, close) => {
                        if (flag) {
                            close();
                            this.getOrgTypeList();
                        }
                    }
                });
            },
            remove (orgTypeId) {
                this.request({
                    url: "/systemManage/organizationType/delete.do",
                    param: {
                        orgTypeId: orgTypeId,
                    }
                }).then(() => {
                    this.$Message.success('删除成功!');
                    close();
                    this.getOrgTypeList();
                });
            },
            search () {
                if ('' !== this.searchName){
                    this.curPage = 1;
                    this.getOrgTypeList();
                }
            },

            /** 常用工具类函数 -- Utils */
            formatDate (date) {
                const y = date.getFullYear();
                let m = date.getMonth() + 1;
                m = m < 10 ? '0' + m : m;
                let d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                return y + '-' + m + '-' + d;
            },
            customSubString (str, start, length, replaceStr) {
                if (str.length > (start + length)){
                    str = str.substr(start, length) + replaceStr;
                }
                return str;
            }
        }
    };
</script>

<style>
    .org-menu-list .ivu-form-item {
        margin: 24px 0;
    }

    .custom-tooltip .ivu-tooltip-inner {
        white-space: normal;
    }
</style>