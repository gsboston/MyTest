<template>
    <div style="padding: 15px 20px 0 20px;">
        <Form ref="form" :model="item" :label-width="60">
            <FormItem label="排序" prop="sort">
                <Input v-model="item.sort" />
            </FormItem>
            <FormItem label="编码" prop="code" :rules="[{required: true, message: '编码不能为空'},{max:20,message:'编码不能多于20个字符'}]">
                <Input v-model="item.code" />
            </FormItem>
            <FormItem label="名称" prop="name" :rules="[{required: true, message: '名称不能为空'},{max:20,message:'名称不能多于20个字符'}]">
                <Input v-model="item.name" />
            </FormItem>
            <FormItem label="所属应用" prop="appId" :rules="{required: true, message: '所属应用不能为空'}">
                <Select v-model="item.appId">
                    <Option v-for="item in appItems" :key="item.id" :value="item.id">{{item.name}}</Option>
                </Select>
            </FormItem>
            <FormItem label="描述" prop="describe" :rules="{max:500,message:'描述不能多于500个字符'}">
                <Input type="textarea" :autosize="false" v-model="item.describe" />
            </FormItem>
            <FormItem>
                <Button @click="save">保存</Button>
                <Button type="ghost" @click="callback">取消</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script type="text/babel">
    export default {
        data () {
            return {
                item: {},
                appItems: []
            };
        },
        methods: {
            init (id) {
                this.resetForm();
                this.getAppList();
                if(id) {
                    this.request({
                        url: "/systemManage/module/info.do",
                        param: {
                            id: id
                        }
                    }).then(item => {
                        this.item = item;
                    });
                }
            },
            getAppList () {
                this.request({
                    url: "/systemManage/app/search.do"
                }).then(items => {
                    this.appItems = items;
                });
            },
            save () {
                this.$refs.form.validate(valid => {
                    if(valid) {
                        this.request({
                            url: "/systemManage/module/save.do",
                            data: this.item
                        }).then(() => {
                            this.callback();
                        });
                    }
                });
            },
            callback () {
                this.resetForm();
                this.$emit("callback");
            },
            resetForm () {
                this.$set(this.item, "id", null);
                this.$set(this.item, "sort", null);
                this.$set(this.item, "code", null);
                this.$set(this.item, "name", null);
                this.$set(this.item, "describe", null);
                this.$refs.form.resetFields();

            }
        }
    };
</script>