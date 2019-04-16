<template>
    <div class="container">
        <Row>
            <i-col span="18">
                <Select placeholder="请选择模块" v-model="selectedModuleId" @on-change="selectModule">
                    <Option v-for="(item, index) in moduleItems" :key="index" :value="item.id">{{item.name}}</Option>
                </Select>
                <ButtonGroup>
                    <Button type="ghost" @click="add">新增</Button>
                    <Button type="ghost" @click="edit" :disabled="!selectedItem">修改</Button>
                    <Button type="ghost" @click="remove" :disabled="!selectedItem">删除</Button>
                </ButtonGroup>
            </i-col>
            <i-col span="6">
                <Input placeholder="功能编码 / 名称" icon="search" @on-enter="search(1)" @on-click="search(1)" />
            </i-col>
        </Row>
        <br/>
        <Table size="small" :columns="columns" :data="items" highlight-row @on-current-change="selectHandler"></Table>
        <br/>
        <Page size="small" :current="current" :total="total" @on-change="search"></Page>
    </div>
</template>

<script>
    import FuncBtn from "./funcBtn.vue";
    export default {
        data () {
            return {
                moduleItems: [],
                selectedModuleId: null,
                columns: [{
                    type: "expand",
                    width: 50,
                    render: (createElement, params) => {
                        return createElement(FuncBtn, {
                            props: {
                                item: params.row,
                                items: params.row.children
                            }
                        });
                    }
                }, {
                    key: "sort",
                    title: "排序",
                    width: 100
                }, {
                    key: "code",
                    title: "编码",
                    width: 150
                }, {
                    key: "name",
                    title: "名称"
                }],
                items: [],
                selectedItem: null,
                current: 0,
                total: 0
            };
        },
        created () {
            this.getModuleList();
        },
        methods: {
            getModuleList () {
                this.request({
                    url: "/systemManage/module/search.do"
                }).then(items => {
                    this.moduleItems = items;
                    if(Array.notEmpty(items)) {
                        this.selectedModuleId = items[0].id;
                    }
                });
            },
            selectModule (moduleId) {
                this.selectedModuleId = moduleId;
                this.search();
            },
            search (current = 1) {
                this.request({
                    url: "/systemManage/resource/search.do",
                    param: {
                        current: current,
                        moduleId: this.selectedModuleId
                    }
                }).then(demand => {
                    this.items = demand.data;
                    this.current = demand.current;
                    this.total = demand.total;
                });
            },
            selectHandler (item) {
                let index = this.items.indexOf(item);
                this.selectedItem = item;
            },
            add () {
                this.prompt({
                    code: "resourceAdd",
                    props: {
                        moduleId: this.selectedModuleId
                    },
                    height: 400,
                    callback: (close) => {
                        close();
                        this.search();
                    },
                    title: "新增功能",
                });
            },
            edit () {
                this.prompt({
                    title: "修改功能基本信息",
                    code: "resourceEdit",
                    width: 400,
                    height: 280,
                    props: {
                        id: this.selectedItem.id
                    },
                    callback: (close) => {
                        close();
                        this.search(this.current);
                    }
                });
            },
            remove: function() {
                this.$Modal.confirm({
                    content: "请确认删除操作",
                    onOk: () => {
                        this.request({
                            url: "/systemManage/resource/remove.do",
                            param: {
                                id: this.selectedItem.id
                            }
                        }).then(() => {
                            this.search(this.current);
                        });
                    }
                });
            }
        }
    };
</script>

<style scoped>
    .container {
        padding: 15px;
    }
    .container .ivu-select {
        width: 200px;
        margin-right: 20px;
    }
</style>