<template>
    <Form :model="formItem" :label-width="80" :rules="ruleInline" ref="formItem">
        <FormItem label="合同编号:" style="font-size: 14px;margin-bottom: 20px">
            <p style="font-size: 14px;font-weight: bold">{{contractInfo.code}}</p>
        </FormItem>
        <FormItem label="甲方:" style="font-size: 14px;margin-bottom: 20px">
            <p style="font-size: 14px;font-weight: bold">{{contractInfo.subjectName}}</p>
        </FormItem>
        <FormItem label="取消原因:" style="font-size: 14px" prop="cancelReason">
            <Input v-model="formItem.cancelReason" style="width: 450px;" type="textarea" :maxlength="100" :rows="5" :autosize="{minRows: 5,maxRows: 20}" placeholder="请说明取消审核的原因"></Input>
        </FormItem>
        <Row style="margin-top: 50px;text-align: center">
            <Button type="ghost" size="large" class="save-button" @click="cancelCommit">暂不取消</Button>
            <Button type="primary" size="large" class="audit-button" @click="addSubmit('formItem')">确认取消</Button>
        </Row>
    </Form >
</template>

<script>
    export default {
        props: {
            contractInfo:null,  //合同
        },
        data () {
            return {
                formItem: {
                    cancelReason: ''
                },
                ruleInline: {
                    cancelReason: [
                        { required: true, message: '请填写取消审核原因', trigger: 'blur' },
                        { type: 'string', min: 5, message: '取消审核不能少于5个字符', trigger: 'blur' }
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
                        this.request({
                            url: '/signCloud/contractView/cancelAgreement.do',
                            data: {
                                id: this.contractInfo.id,
                                cancelReason: this.formItem.cancelReason + ""
                            }
                        }).then(() => {
                            this.$Message.success('取消审核成功!');
                            this.callback("cancel");
                        });
                    }
                })
            }
        },
        created:function(){

        }
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
