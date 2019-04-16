<template>
    <div style="padding: 15px 20px;">
        <Form ref="form" :model="item" :label-width="100" :rules="ruleValidate">
            <Form-item label="编码" prop="code">
                <Input v-model= "item.code" placeholder="请输入编码"  :maxlength="50"/>
            </Form-item>
            <Form-item label="接单岗位名称" prop="name">
                <Input v-model="item.name" placeholder="请输入接单岗位名称"  :maxlength="50"/>
            </Form-item>
            <FormItem style="float: right;">
                <Button @click="save">保存</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    export default {
        data () {
            let $self = this;
            return {
                item: {},
                ruleValidate: {
                    code: [
                        {required: true, type: 'string', message: '编码不能为空', trigger: 'blur'},
                        { pattern:  /^[A-Za-z0-9]+$/ ,message:'只能是英文或者数字',trigger: 'change' }
                    ],
                    name: [
                        {required: true, type: 'string', message: '岗位名称不能为空', trigger: 'blur'},
                    ],
                },
            }
        },
        props: {
            contractId: null,
            id: null,
            data: null
        },
        created: function () {
            if(this.data){
                this.item = this.data;
            }
        },
        methods: {
            /*checkCode: function (item) {
                if(item.code){
                    this.request({
                        url: '/systemManage/service/checkServiceCode.do',
                        param: {
                            code:item.code,
                            type:"RECEIVE",
                            id: item.id || ''
                        }
                    }).then((data) => {
                        if(data){
                            this.validateEnd = true;
                            this.$Message.success('编码重复!');
                        }
                    })
                }
            },*/
            save: function () {
                 this.$refs.form.validate(valid => {
                     if (valid) {
                         this.item.state = 'ENABLE';
                         this.request({
                             url: '/systemManage/service/save.do',
                             data: this.item
                         }).then(() => {
                             this.$Message.success('提交成功!');this.callback(true);
                         });
                     } else {
                         this.$Message.error("请输入有效的编码和接单岗位名称后再进行保存！");
                     }
                 })
            }
        }
    };
</script>