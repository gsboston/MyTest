<template>
    <Form :model="formItem" :label-width="80" :rules="ruleInline" ref="formItem">
        <FormItem label="驳回原因:" style="font-size: 14px" prop="rejectReason">
            <Input v-model="formItem.rejectReason" style="width: 450px;" type="textarea" :maxlength="100" :rows="5" :autosize="{minRows: 5,maxRows: 20}" placeholder="请告知业务人员变更协议审核不通过的原因"></Input>
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
            contractId:null,  //原合约Id
            changeContractId:null,  //变更协议Id
        },
        data () {
            return {
                formItem: {
                    rejectReason: ''
                },
                ruleInline: {
                    rejectReason: [
                        { required: true, message: '请填写驳回原因', trigger: 'blur' },
                        { type: 'string', min: 5, message: '驳回原因不能少于5个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            cancelCommit (){
                this.close();
            },
            addSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.request({
                            url: "/signCloud/audit/changeReject.do",
                            data: {
                                id: this.changeContractId,
                                remark: this.formItem.rejectReason + ""
                            }
                        }).then(() => {
                            this.$Message.success('驳回成功!');
                            this.close();
                            this.$api.apiSureReject(this.contractId);
                        });
                    } else {
                    }
                })
            }
        },
    }
</script>
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
