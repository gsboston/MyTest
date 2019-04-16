<template>
    <Form :model="formItem" :label-width="80" :rules="ruleInline" ref="formItem" style="padding: 20px;">
        <FormItem label="作废金额:" style="font-size: 14px;margin-bottom: 20px">
            <p style="font-size: 14px;font-weight: bold">￥{{invoiceInfo.mergePrice}}</p>
        </FormItem>
        <FormItem label="发票号码:" style="font-size: 14px;margin-bottom: 20px">
            <p style="font-size: 14px;font-weight: bold" v-if="invoiceInfo.mergeNumbers">
                <Tag checkable v-for="(item, index) in invoiceInfo.mergeNumbers" :key="index">{{ item }}{{ invoiceInfo.mergeNumbers.length > 1 ? ';' : '' }}</Tag>
            </p>
        </FormItem>
        <FormItem label="作废原因:" style="font-size: 14px" prop="remark">
            <Input v-model="formItem.remark" style="width: 450px;" type="textarea" :maxlength="100" :rows="5" :autosize="{minRows: 5,maxRows: 20}" placeholder="请说明发票作废的原因"></Input>
        </FormItem>
        <Row style="margin-top: 50px;text-align: center">
            <Button type="ghost" size="large" class="save-button" @click="cancelCommit">暂不作废</Button>
            <Button type="primary" size="large" class="audit-button" @click="addSubmit">确认作废</Button>
        </Row>
    </Form >
</template>

<script>
    export default {
        props: {
            invoiceInfo: null,
            isTermination: false
        },
        data () {
            return {
                formItem: {
                    remark: ''
                },
                ruleInline: {
                    remark: [
                        { required: true, message: '请填写发票作废原因', trigger: 'blur' },
                        { type: 'string', min: 5, message: '作废原因不能少于5个字符', trigger: 'blur' },
                        { type: 'string', max: 50, message: '作废原因不能大于50个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            cancelCommit (){
                if (this.isTermination) {
                    this.callback(false, null);
                }else {
                    this.callback(false);
                }
            },
            addSubmit() {
                this.$refs['formItem'].validate((valid) => {
                    if (valid) {
                        if (this.isTermination) {
                            this.formItem.invoiceId = this.invoiceInfo.ids[0];
                            this.callback(true, this.formItem);
                        }else {
                            this.request({
                                url: "/signCloud/invoice/invoiceInvalidated.do",
                                data: {
                                    invoiceIds: this.invoiceInfo.ids,
                                    remark: this.formItem.remark + ''
                                }
                            }).then(() => {
                                this.$Message.success('发票作废成功!');
                                this.callback(true);
                            });
                        }
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
