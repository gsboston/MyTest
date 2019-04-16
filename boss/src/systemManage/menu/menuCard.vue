<template>
    <div class="container">
        <Form ref="form" :model="item" :label-width="80">
            <FormItem label="排序" prop="sort">
                <Input v-model="item.sort" />
            </FormItem>
            <FormItem label="编码" prop="code" :rules="[{required: true, message: '编码不能为空'},{max:20,message:'编码不能多于20个字符'}]">
                <Input v-model="item.code" />
            </FormItem>
            <FormItem label="名称" prop="title" :rules="[{required: true, message: '名称不能为空'},{max:20,message:'名称不能多于20个字符'}]">
                <Input v-model="item.title" />
            </FormItem>
            <FormItem label="是否目录" v-if="!item.parentId">
                <i-switch v-model="item.category">
                    <span slot="open">是</span>
                    <span slot="close">否</span>
                </i-switch>
            </FormItem>
            <FormItem label="图标编码" v-if="item.category">
                <Input v-model="item.icon" />
            </FormItem>
            <FormItem label="功能" v-if="!item.category"  prop="funcId" :rules="{validator: funcIdValidator}">
                <Select v-model="item.funcId" :label="item.funcName" :remote-method="funcSearcher" :loading="funcSearching" filterable remote >
                    <Option v-for="(item, index) in funcItems" :value="item.id" :key="index">{{item.name}}</Option>
                </Select>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="save">保存</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    export default {
        props: {
            id: null,
            moduleId: null,
            parentId: null
        },
        data () {
            return {
                item: {
                    parentId: null,
                    category: false
                },
                funcItems: [],
                funcSearching: false,
                _funcItems: []
            }
        },
        created () {
            if(this.id) {
                this.getMenu();
            }else {
                this.item.moduleId = this.moduleId;
                this.item.parentId = this.parentId;
            }
        },
        methods: {
            getMenu () {
                this.request({
                    url: "/systemManage/menu/info.do",
                    param: {
                        id: this.id
                    }
                }).then(item => {
                    this.item = item;
                });
            },
            funcSearcher (query) {
                if(query !== "") {
                    this.funcSearching = true;
                    this.request({
                        url: "/systemManage/menu/searchFunc.do",
                        param: {
                            moduleId: this.item.moduleId,
                            searchText: query
                        }
                    }).then(items => {
                        this.funcItems = items;
                        this.funcSearching = false;
                    });
                }else {
                    this.funcItems = [];
                }
            },
            save () {
                this.$refs.form.validate(valid => {
                    if(valid) {
                        this.request({
                            url: "/systemManage/menu/save.do",
                            data: this.item
                        }).then(item => {
                            this.callback(item);
                        });
                    }
                });
            },
            funcIdValidator (rule, value, callback) {
                if(!this.item.category && this.item.funcId == null) {
                    return callback(new Error("请关联功能"));
                }
                callback();
            }
        }
    };
</script>

<style scoped>
    .container {
        padding: 15px;
    }
</style>