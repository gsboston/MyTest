<template>
    <Form :model="formItem" :label-width="80" :rules="ruleInline" ref="formItem">
        <FormItem label="合同编号:" style="font-size: 14px;margin-bottom: 20px">
            <p style="font-size: 14px;font-weight: bold">{{contractInfo.code}}</p>
        </FormItem>
        <FormItem label="甲方:" style="font-size: 14px;margin-bottom: 20px">
            <p style="font-size: 14px;font-weight: bold">{{contractInfo.subjectName}}</p>
        </FormItem>
        <FormItem label="作废原因:" style="font-size: 14px" prop="nullifyReason">
            <Input v-model="formItem.nullifyReason" style="width: 450px;" type="textarea" :maxlength="100" :rows="5" :autosize="{minRows: 5,maxRows: 20}" placeholder="请说明合约作废的原因"></Input>
        </FormItem>
        <Row style="margin-top: 50px;text-align: center">
            <Button type="ghost" size="large" class="save-button" @click="cancelCommit">暂不作废</Button>
            <Button type="primary" size="large" class="audit-button" @click="addSubmit('formItem')">确认作废</Button>
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
                    nullifyReason: ''
                },
                ruleInline: {
                    nullifyReason: [
                        { required: true, message: '请填写合约作废原因', trigger: 'blur' },
                        { type: 'string', min: 5, message: '作废原因不能少于5个字符', trigger: 'blur' }
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
                        //判断该合约是否收过款或者开过票
                        this.request({
                            url: "/signCloud/contractView/getContractById.do",
                            data:{id:this.contractInfo.id}
                        }).then(item => {
                            //合约收过款、开过票
                            var content = "";
                            if(item.statusReceipt != "NONE" && item.statusInvoice != "NONE"){
                                content = '<p>该合约已经收过款，开过票，是否确认作废该合约？</p>'
                            }else if(item.statusReceipt != "NONE"){//合约收过款
                                content = '<p>该合约已经收过款，是否确认作废该合约？</p>'
                            }else if(item.statusInvoice != "NONE"){//合约开过票
                                content = '<p>该合约已经开过票，是否确认作废该合约？</p>'
                            }
                            if(content != ""){
                                this.$Modal.confirm({
                                    title: '确认对话框',
                                    content: content,
                                    onOk: () => {
                                        this.nullify();
                                    },
                                    onCancel: () => {
                                    }
                                });
                            }else{
                                this.nullify();
                            }
                        });
                    }
                })
            },
            nullify(){
                this.request({
                    url: "/signCloud/audit/nullify.do",
                    data: {
                        id: this.contractInfo.id,
                        nullifyReason: this.formItem.nullifyReason + ""
                    }
                }).then(() => {
                    this.$Message.success('作废成功!');
                    this.callback("nullify");
                });
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
