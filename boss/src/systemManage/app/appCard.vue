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
            };
        },
        methods: {
            init (id) {
                this.resetForm();
                if(id) {
                    this.request({
                        url: "/systemManage/app/info.do",
                        param: {
                            id: id
                        }
                    }).then(item => {
                        this.item = item;
                    });
                }
            },
            save () {
                this.$refs.form.validate(valid => {
                    if(valid) {
                        this.request({
                            url: "/systemManage/app/save.do",
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