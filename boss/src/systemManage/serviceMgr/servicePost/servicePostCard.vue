<template>
    <div style="padding: 15px 20px;">
        <Form ref="form" :model="item" :label-width="100" :rules="ruleValidate">
            <Form-item label="服务岗位名称" prop="name">
                <Input v-model="item.name" placeholder="请输入服务岗位名称" :maxlength="50"/>
            </Form-item>
            <Form-item label="能否派工" prop="disabled">
                <Checkbox v-model="item.disabled"></Checkbox>
            </Form-item>
            <Form-item label="服务说明" prop="remark" class="ivu-form-item-required">
                <Input v-model="item.remark" placeholder="服务说明" :maxlength="50"/>
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
                item: {
                    disabled:null
                },
                ruleValidate: {
                    name: [
                        {required: true, type: 'string', message: '服务岗位名称不能为空', trigger: 'blur'}
                    ],
                    remark: [
                        {required: true, type: 'string', message: '服务说明不能为空', trigger: 'blur'},
                    ],
                },
            }
        },
        props: {
            id: null,
            data: null
        },
        created: function () {
            if(this.data){
                this.item = this.data;
            }
        },
        methods: {
            save: function () {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        if(this.item.disabled === true){
                            this.item.state = "CHARGE";
                        }else{
                            this.item.state = "NORMAL";
                        }
                        this.request({
                            url: "/systemManage/service/serviceSave.do",
                            data: this.item,
                            param:{
                                id:this.id,
                            }
                        }).then(() => {
                            this.$Message.success('提交成功!');
                            this.callback(true);
                        });
                    }
                })
            }
        }
    };
</script>