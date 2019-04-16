<template>
    <div class="container">
        <div class="center">
            <Row>
                <i-col span="19">
                    <ButtonGroup>
                        <Button type="ghost" @click="addBtn">新增</Button>
                        <Button type="ghost" :disabled="!metaId" @click="editBtn">编辑</Button>
                    </ButtonGroup>
                </i-col>
            </Row>
            <br/>
            <div class="menu-panel">
                <Row class="header">
                    <i-col span="4">页面名称</i-col>
                    <i-col span="6">title</i-col>
                    <i-col span="6">keywords</i-col>
                    <i-col span="6">description</i-col>
                </Row>
                <div v-for="(item, index) in items" :key="index">
                    <Row class="menu-item" :class="{selected: item === selectedItem}" @click.native="selectionHandler(item)">
                        <i class="ivu-icon ivu-icon-arrow-right-b" :class="{expand: item.expand}" v-if="item.category && item.children && item.children.length > 0"
                           @click.stop="shrink(item)"></i>
                        <i-col span="4">{{item.pageName}}</i-col>
                        <i-col span="6">{{item.title}}</i-col>
                        <i-col span="6">{{item.keywords}}</i-col>
                        <i-col span="6">{{item.description}}</i-col>
                    </Row>
                    <div class="menu-children" v-if="item.children && item.children.length > 0 && item.expand">
                        <Row class="menu-item" v-for="(childItem, index) in item.children" :key="index" :class="{selected: childItem === selectedItem}"
                             @click.native="selectionHandler(childItem, item)">
                            <i-col span="4">{{item.pageName}}</i-col>
                            <i-col span="6">{{item.title}}</i-col>
                            <i-col span="6">{{item.keywords}}</i-col>
                            <i-col span="6">{{item.description}}</i-col>
                        </Row>
                    </div>
                </div>
            </div>
            <br/>
            <Page size="small" :total="total" :current="current" :page-size="pageSize" @on-change="changePage"></Page>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                curPage: 1,
                pageSize: 10,
                items: [],
                selectedItem: null,
                metaId: null,
                total: 0,
                current: 1
            }
        },
        created: function () {
            this.getMetaList();
        },
        methods: {
            getMetaList() {
                this.request({
                    url: "/metaManagement/getMetaList.do",
                    param: {
                        curPage: this.curPage,
                        pageSize: this.pageSize
                    }
                }).then(demand => {
                    this.items = demand.records;
                    this.current = demand.current;
                    this.total = demand.total;
                });
            },
            changePage(pageIndex) {
                this.curPage = pageIndex;
                this.getMetaList();
            },
            selectionHandler(item) {
                this.selectedItem = item;
                this.metaId = item.id;
            },
            editBtn() {
                this.prompt({
                    title: '编辑tdk',
                    code: "metaManagementAdd",
                    width: 600,
                    height: 480,
                    props: {
                        id: this.metaId
                    },
                    callback: (close) => {
                        close();
                        this.getMetaList();
                    }
                });
            },
            addBtn() {
                this.prompt({
                    title: '新增tdk',
                    code: "metaManagementAdd",
                    width: 600,
                    height: 480,
                    callback: (close) => {
                        close();
                        this.getMetaList();
                    }
                });
            },
        }
    }
</script>

<style scoped>
    .center {
        position: relative;
        padding: 15px;
    }

    .infoDiv label {
        margin: 0 20px 0 12px;
    }

    .menu-panel {
        border: solid 1px #e8e8e8;
    }

    .menu-panel .header {
        padding-left: 20px;
        background: #f8f8f8;
        font-size: 12px;
        font-weight: 700;
        line-height: 32px;
    }

    .menu-panel .header > .ivu-col,
    .menu-panel .menu-item > .ivu-col {
        padding-left: 7px;
        padding-right: 7px;
    }

    .menu-panel .menu-item {
        padding-left: 20px;
        font-size: 14px;
        line-height: 40px;
        border-top: solid 1px #e8e8e8;
    }

    .menu-panel .menu-item > .ivu-icon {
        position: absolute;
        top: 12px;
        left: 12px;
        color: #666;
        font-size: 16px;
        transition: transform .2s ease-in-out;
        cursor: pointer;
    }

    .menu-panel .menu-item > .ivu-icon.expand {
        transform: rotate(90deg);
    }

    .menu-panel .menu-children > .menu-item > .ivu-col:first-of-type {
        padding-left: 30px;
    }

    .menu-item:hover,
    .menu-item.selected {
        background: #f3f3f3;
    }

</style>