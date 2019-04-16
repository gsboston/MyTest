<style scoped>
    .save-button{
        width: 129px;
        height: 39px;
        border: 1px solid #59b399;
        color: #59b399;
        border-radius: 5px;
    }
    .audit-button{
        width: 129px;
        height: 39px;
        background-color: #59b399;
        border: 1px solid #59b399;
        border-radius: 5px;
    }
</style>
<template>
    <Form :model="formItem" :label-width="100" :rules="ruleInline" ref="formItem">
        <FormItem label="不通过原因:" style="font-size: 14px" prop="nullifyReason">
            <Input v-model="formItem.nullifyReason" style="width: 450px;" type="textarea" :maxlength="100" :rows="5" :autosize="{minRows: 5,maxRows: 20}" placeholder="请说明不通过的原因"></Input>
        </FormItem>
        <Row style="margin-top: 50px;text-align: center">
            <Button type="ghost" size="large" class="save-button" @click="cancelCommit">取消</Button>
            <Button type="primary" size="large" class="audit-button" @click="addSubmit('formItem')">确定</Button>
        </Row>
    </Form >
</template>

<script>
    export default {
        props: {
            id:null,
        },
        data () {
            return {
                formItem: {
                    nullifyReason: ''
                },
                ruleInline: {
                    nullifyReason: [
                        { required: true, message: '请填写不通过原因', trigger: 'blur' },
                        { type: 'string', min: 5, message: '不通过原因不能少于5个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            cancelCommit (){
                this.callback("");
            },
            addSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.nullify();
                    }
                })
            },
            nullify(){
                this.request({
                    url: "/systemManage/companyOpenAudit/auditFailure.do",
                    data: {
                        id: this.id,
                        nullifyReason: this.formItem.nullifyReason + ""
                    }
                }).then(() => {
                    this.callback("refuse");
                });
            }
        },
    }
</script>
