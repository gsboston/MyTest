<template>
    <div style="padding: 15px 50px;">
        <Form ref="form" :model="item" :label-width="80">
            <FormItem label="按钮编码" prop="code" :rules="[{required: true, message: '按钮编码不能为空'},{max:20,message:'按钮编码不能多于20个字符'}]" >
                <Input v-model="item.code"/>
            </FormItem>
            <FormItem label="按钮名称" prop="name" :rules="[{required: true, message: '按钮名称不能为空'},{max:20,message:'按钮名称不能多于20个字符'}]" >
                <Input v-model="item.name"  />
            </FormItem>
            <FormItem>
                <Button type="primary" @click="save">保存</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script type="text/babel">
    export default {
        props: {
            id: null,
            parentId: null,
            moduleId: null
        },
        data () {
            return {
                item: {}
            }
        },
        created () {
            if(this.id) {
                this.request({
                    url: "/systemManage/resource/info.do",
                    param: {
                        id: this.id
                    }
                }).then(item => {
                    this.item = item;
                });
            }else {
                this.item.parentId = this.parentId;
            }
            this.item.moduleId = this.moduleId;
        },
        methods: {
            save: function() {
                this.$refs.form.validate(valid => {
                    if(valid) {
                        this.request({
                            url: "/systemManage/resource/save.do",
                            data: this.item
                        }).then(() => {
                            this.callback(this.item);
                        });
                    }
                })
            }
        }
    };
</script>