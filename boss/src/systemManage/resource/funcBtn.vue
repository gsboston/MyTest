<template>
    <div>
        <Button type="ghost" size="small" v-for="(item, index) in items" :key="item.code" @click.native="editBtn(item, index)">
            {{item.code}} : {{item.name}}
            <Icon type="close-round" @click.native.stop="removeBtn(item.id, index)" style="margin-left: 15px;"></Icon>
        </Button>
        <Button type="ghost" icon="plus" @click="addBtn" style="background: white;"></Button>
    </div>
</template>

<script>
    export default {
        props: {
            item: {
                type: Object,
                default: {}
            }
        },
        methods: {
            addBtn: function() {
                this.prompt({
                    title: "新增按钮",
                    code: "resourceList_FuncBtnInfo",
                    width: 500,
                    height: 220,
                    props: {
                        parentId: this.item.id,
                        moduleId: this.item.moduleId
                    },
                    callback: (item, close) => {
                        close();
                        this.items.push(item);
                    }
                });
            },
            editBtn: function(item, index) {
                this.prompt({
                    title: "修改按钮",
                    code: "resourceList_FuncBtnInfo",
                    width: 500,
                    height: 220,
                    props: {
                        id: item.id,
                        moduleId: this.item.moduleId
                    },
                    callback: (_item, close) => {
                        close();
                        item.code = _item.code;
                        item.name = _item.name;
                    }
                });
            },
            removeBtn: function(id, index) {
                this.$Modal.confirm({
                    content: "请确认删除操作",
                    onOk: () => {
                        this.request({
                            url: "/systemManage/resource/remove.do",
                            param: {
                                id: id
                            }
                        }).then(() => {
                            this.items.splice(index, 1);
                        });
                    }
                });
            }
        },
        computed: {
            items () {
                if(this.item && this.item.children == null) {
                    this.item.children = [];
                }
                return this.item.children;
            }
        }
    };
</script>

<style scoped>
    .ivu-btn {
        padding-top: 5px;
        padding-bottom: 5px;
        background: white;
    }
</style>