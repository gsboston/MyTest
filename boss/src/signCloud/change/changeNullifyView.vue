<template>
    <Form :model="formItem" :label-width="100" :rules="ruleInline" ref="formItem">
        <i-col span="12">
            <FormItem label="协议编号:" style="font-size: 14px;margin-bottom: 20px">
                <span style="font-size: 14px;font-weight: bold">{{contract.agreementCode}}</span>
            </FormItem>
        </i-col>
        <i-col span="12">
            <FormItem label="原合约编号:" style="font-size: 14px;margin-bottom: 20px">
                <span style="font-size: 14px;font-weight: bold">{{contract.contractCode}}</span>
            </FormItem>
        </i-col>
        <i-col span="12">
            <FormItem label="甲方:" style="font-size: 14px;margin-bottom: 20px">
                <span style="font-size: 14px;font-weight: bold">{{contract.customerName}}</span>
            </FormItem>
        </i-col>
        <i-col span="24">
            <FormItem label="作废原因:" style="font-size: 14px" prop="nullifyReason">
                <Input v-model="formItem.nullifyReason" style="width: 450px;" type="textarea" :maxlength="100" :rows="5" :autosize="{minRows: 5,maxRows: 20}" placeholder="请说明合约作废的原因"></Input>
            </FormItem>
        </i-col>
        <i-col span="24">
            <Row style="text-align: center">
                <Button type="ghost" size="large" class="save-button" @click="cancelCommit">暂不作废</Button>
                <Button type="primary" size="large" class="audit-button" @click="nullify('formItem')">确认作废</Button>
            </Row>
        </i-col>

    </Form >
</template>

<script>
    import ICol from "../../../node_modules/iview/src/components/grid/col.vue";

    export default {
        components: {ICol},
        props: {
            changeContractId: null,
        },
        data () {
            return {
                contract: {},
                formItem: {
                    nullifyReason: ''
                },
                ruleInline: {
                    nullifyReason: [
                        { required: true, message: '请填写变更协议作废原因', trigger: 'blur' },
                        { type: 'string', min: 5, message: '作废原因不能少于5个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        created: function () {
            this.initChangeInfo();
        },
        methods: {
            initChangeInfo () {
                this.request({
                    url: '/signCloud/changeNullifyView/getContractChangeInfo.do',
                    param: {
                        changeId: this.changeContractId
                    }
                }).then(data => {
                    this.contract = data;
                });
            },
            cancelCommit (){
                this.callback("");
            },
            nullify(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.request({
                            url: "/signCloud/changeNullifyView/nullify.do",
                            data: {
                                changeContractId: this.changeContractId,
                                nullifyReason: this.formItem.nullifyReason + ""
                            }
                        }).then(() => {
                            this.$Message.success('作废成功!');
                            this.callback("nullify");
                        });
                    }
                })
            },
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
