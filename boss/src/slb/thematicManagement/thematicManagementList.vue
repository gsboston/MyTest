<template>
    <div class="container">
        <div class="center">
            <Row>
                <i-col span="19">
                    <ButtonGroup>
                        <Button type="ghost" @click="addBtn">新增</Button>
                        <Button type="ghost" :disabled="!thematicId||status==0" @click="updateBtn">下线</Button>
                        <Button type="ghost" :disabled="!thematicId||status==1" @click="onlineBtn">上线</Button>
                    </ButtonGroup>
                </i-col>
            </Row>
            <br/>
            <div class="menu-panel">
                <Row class="header">
                    <i-col span="4">专题名称</i-col>
                    <i-col span="8">专题链接</i-col>
                    <i-col span="6">专题图片</i-col>
                    <i-col span="4">状态</i-col>
                </Row>
                <div v-for="(item, index) in items" :key="index">
                    <Row class="menu-item" :class="{selected: item === selectedItem}" @click.native="selectionHandler(item)">
                        <i class="ivu-icon ivu-icon-arrow-right-b" :class="{expand: item.expand}" v-if="item.category && item.children && item.children.length > 0"
                           @click.stop="shrink(item)"></i>
                        <i-col span="4">{{item.name}}</i-col>
                        <i-col span="8">{{item.specialLine}}</i-col>
                        <i-col span="6">
                            <img :src="$updateConfig.file+item.specialImg+'&x-oss-process=image/resize,w_100,h_100/quality,Q_80'">
                        </i-col>
                        <i-col span="4">
                            <Tag v-if="item.status==1" color="green">已上线</Tag>
                            <Tag v-if="item.status==0">已下线</Tag>
                        </i-col>
                    </Row>
                    <div class="menu-children" v-if="item.children && item.children.length > 0 && item.expand">
                        <Row class="menu-item" v-for="(childItem, index) in item.children" :key="index" :class="{selected: childItem === selectedItem}"
                             @click.native="selectionHandler(childItem, item)">
                            <i-col span="4">{{childItem.name}}</i-col>
                            <i-col span="4">{{childItem.specialLine}}</i-col>
                            <i-col span="10">
                                <img :src="$updateConfig.file+item.specialImg+'&x-oss-process=image/resize,w_100,h_100/quality,Q_80'">
                            </i-col>
                            <i-col span="4">
                                <Tag v-if="item.status==1" color="green">已上线</Tag>
                                <Tag v-if="item.status==0">已下线</Tag>
                            </i-col>
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
                thematicId: null,
                status: null,
                total: 0,
                current: 1
            }
        },
        created: function () {
            this.getThematicList();
        },
        methods: {
            getThematicList() {
                this.request({
                    url: "/thematicManagement/getThematicList.do",
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
                this.getThematicList();
            },
            selectionHandler(item) {
                this.selectedItem = item;
                this.thematicId = item.id;
                this.status = item.status;
            },
            updateBtn() {
                if (this.selectedItem.status === 0) {
                    this.$Message.success('已下线!');
                } else {
                    this.request({
                        url: "/thematicManagement/offset.do",
                        param: {
                            id: this.thematicId
                        }
                    }).then(data => {
                        this.getThematicList();
                        this.$Message.success('下线成功!');
                    });
                }

            },
            onlineBtn() {
                if (this.selectedItem.status === 1) {
                    this.$Message.success('已上线!');
                } else {
                    this.request({
                        url: "/thematicManagement/online.do",
                        param: {
                            id: this.thematicId
                        }
                    }).then(data => {
                        this.getThematicList();
                        this.$Message.success('上线成功!');
                    });
                }
            },
            addBtn() {
                this.prompt({
                    title: '新增专题',
                    code: "thematicManagementAdd",
                    width: 400,
                    height: 380,
                    callback: (close) => {
                        close();
                        this.getThematicList();
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