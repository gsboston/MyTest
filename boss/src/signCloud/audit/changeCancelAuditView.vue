<template>
    <Form :model="formItem" :label-width="100" :rules="ruleInline" ref="formItem">
        <i-col span="12">
            <FormItem label="协议编号:" style="font-size: 14px;margin-bottom: 20px">
                <span style="font-size: 14px;font-weight: bold">{{contractInfo.code}}</span>
            </FormItem>
        </i-col>
        <i-col span="12">
            <FormItem label="原合约编号:" style="font-size: 14px;margin-bottom: 20px">
                <span style="font-size: 14px;font-weight: bold">{{contractInfo.signedContractCode}}</span>
            </FormItem>
        </i-col>
        <FormItem label="甲方:" style="font-size: 14px;margin-bottom: 20px">
            <p style="font-size: 14px;font-weight: bold">{{subjectAName}}</p>
        </FormItem>
        <FormItem label="取消原因:" style="font-size: 14px" prop="cancelReason">
            <Input v-model="formItem.cancelReason" style="width: 450px;" type="textarea" :maxlength="100" :rows="5" :autosize="{minRows: 5,maxRows: 20}" placeholder="请说明取消审核的原因"></Input>
        </FormItem>
        <Row style="margin-top: 50px;text-align: center">
            <Button type="ghost" size="large" class="save-button" @click="cancelCommit">暂不取消</Button>
            <Button type="primary" size="large" class="audit-button" @click="addSubmit('formItem')">确认取消</Button>
        </Row>
    </Form>
</template>

<script>
    import ICol from "../../../node_modules/iview/src/components/grid/col.vue";
    export default {
        components: {ICol},
        props: {
            contractInfo:null,  //合同
            subjectAName:null
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
                            url: '/signCloud/audit/changeCancel.do',
                            data: {
                                id: this.contractInfo.id,
                                remark: this.formItem.cancelReason + ""
                            }
                        }).then(() => {
                            this.$Message.success('变更协议取消审核成功!');
                            this.callback("changeCancelAudit");
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
