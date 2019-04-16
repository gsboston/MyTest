<template>
    <div class="container">
        <div>
            <Select placeholder="请选择模块" v-model="selectedModuleId" @on-change="selectModule">
                <Option v-for="(item, index) in moduleItems" :key="index" :value="item.id">{{item.name}}</Option>
            </Select>
            <ButtonGroup>
                <Button type="ghost" @click="add" :disabled="!addMode">新增</Button>
                <Button type="ghost" @click="edit" :disabled="selectedModuleId == null || selectedItem == null">修改</Button>
                <Button type="ghost" @click="remove" :disabled="!removeMode">删除</Button>
            </ButtonGroup>
        </div>
        <br/>
        <div class="menu-panel">
            <Row class="header">
                <i-col span="4">编码</i-col>
                <i-col span="4">名称</i-col>
                <i-col span="1">排序</i-col>
                <i-col span="2" style="text-align: center;">是否目录</i-col>
                <i-col span="13">关联功能</i-col>
            </Row>
            <div v-for="(item, index) in items" :key="index">
                <Row class="menu-item" :class="{selected: item === selectedItem}" @click.native="selectionHandler(item)">
                    <i class="ivu-icon ivu-icon-arrow-right-b" :class="{expand: item.expand}" v-if="item.category && item.children && item.children.length > 0" @click.stop="shrink(item)"></i>
                    <i-col span="4">{{item.code}}</i-col>
                    <i-col span="4">{{item.title}}</i-col>
                    <i-col span="1">{{item.sort || 0}}</i-col>
                    <i-col span="2" style="text-align: center;"><Icon type="checkmark-round" v-if="item.category"></Icon><span v-else>&nbsp;</span></i-col>
                    <i-col span="13">{{item.funcName}}</i-col>
                </Row>
                <div class="menu-children" v-if="item.children && item.children.length > 0 && item.expand">
                    <Row class="menu-item" v-for="(childItem, index) in item.children" :key="index" :class="{selected: childItem === selectedItem}" @click.native="selectionHandler(childItem, item)">
                        <i-col span="4">{{childItem.code}}</i-col>
                        <i-col span="4">{{childItem.title}}</i-col>
                        <i-col span="1">{{childItem.sort || 0}}</i-col>
                        <i-col span="2">&nbsp;</i-col>
                        <i-col span="13">{{childItem.funcName}}</i-col>
                    </Row>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                moduleItems: [],
                selectedModuleId: null,
                selectedParentModule: null,
                items: [],
                selectedItem: null
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
            search () {
                this.request({
                    url: "/systemManage/menu/getMenuList.do",
                    param: {
                        moduleId: this.selectedModuleId
                    }
                }).then(items => {
                    this.items = items;
                });
            },
            selectionHandler (item, parentItem) {
                this.selectedItem = (this.selectedItem !== item ? item : null);
                this.selectedParentItem = parentItem;
                if(item.category) {
                    this.$set(item, "expand", true);
                }
            },
            shrink (item) {
                this.$set(item, "expand", !item.expand);
            },
            add () {
                this.prompt({
                    code: "50010602",
                    title: "新增菜单",
                    width: 400,
                    height: 400,
                    props: {
                        moduleId: this.selectedModuleId,
                        parentId: (this.selectedItem ? this.selectedItem.id : null)
                    },
                    callback: (item, close) => {
                        close();
                        let selectedItem = this.selectedItem;
                        if(selectedItem) {
                            if(Object.isNull(selectedItem.children)) {
                                this.$set(selectedItem, "children", []);
                            }
                            selectedItem.children.push(item);
                            this.$set(selectedItem, "expand", true);
                        }else {
                            this.items.push(item);
                        }
                    }
                });
            },
            edit () {
                this.prompt({
                    code: "50010602",
                    title: "修改菜单",
                    width: 400,
                    height: 400,
                    props: {
                        id: this.selectedItem.id
                    },
                    callback: (item, close) => {
                        close();
                        if(this.selectedParentItem) {
                            let index = this.selectedParentItem.children.indexOf(this.selectedItem);
                            this.$set(this.selectedParentItem.children, index, Object.assign(this.selectedItem, item));
                        }else {
                            let index = this.items.indexOf(this.selectedItem);
                            this.$set(this.items, index, Object.assign(this.selectedItem, item));
                        }
                    }
                });
            },
            remove () {
                this.$Modal.confirm({
                    content: "请确认删除操作",
                    onOk: () => {
                        this.request({
                            url: "/systemManage/menu/remove.do",
                            param: {
                                id: this.selectedItem.id
                            }
                        }).then(() => {
                            if(this.selectedParentItem) {
                                let index = this.selectedParentItem.children.indexOf(this.selectedItem);
                                this.selectedParentItem.children.splice(index, 1);
                            }else {
                                let index = this.items.indexOf(this.selectedItem);
                                this.items.splice(index, 1);
                            }
                            this.selectedItem = null;
                            this.selectedParentItem = null;
                        });
                    }
                });
            }
        },
        computed: {
            addMode () {
                return Object.notNull(this.selectedModuleId) && (Object.isNull(this.selectedItem) || this.selectedItem.category);
            },
            removeMode () {
                return Object.notNull(this.selectedItem) && (Object.isNull(this.selectedItem.children) || Array.isEmpty(this.selectedItem.children));
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