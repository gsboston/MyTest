<template>
    <Row style="padding: 15px 30px;">
        <Form ref="item" :model="item" :rules="itemValidate" :label-width="0">
            <Row>
                <i-col span="9">
                    <FormItem prop="minNo">
                        <Input v-model="item.minNo" placeholder="请输入起始卡号"/>
                    </FormItem>
                </i-col>
                <i-col span="1"><label>至</label></i-col>
                <i-col span="9">
                    <FormItem prop="maxNo">
                        <Input v-model="item.maxNo" placeholder="请输入截止卡号"/>
                    </FormItem>
                </i-col>
            </Row>
            <FormItem style="float: right;">
                <Button type="primary" @click="save('item')">提交</Button>
            </FormItem>
        </Form>
    </Row>
</template>

<script>
    export default {
        props: {item: null},
        data: function () {
            return {
                data: {},
                itemValidate: {
                    minNo: [
                        {required: true, message: '请输入起始卡号', trigger: 'blur'},
                        {pattern: /^[1-9]\d*$/, message: '卡号必须为整数', trigger: 'blur'},
                    ],
                    maxNo: [
                        {required: true, message: '请输入截止卡号', trigger: 'blur'},
                        {pattern: /^[1-9]\d*$/, message: '卡号必须为整数', trigger: 'blur'},
                    ],
                },
            }
        },
        created: function () {
            this.item.minNo = '';
            this.item.maxNo = '';
        },
        methods: {
            save: function (name) {
                if (this.item.minNo > this.item.maxNo) {
                    this.$Message.error('起始卡号不能大于截止卡号');
                    return;
                }
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.close();
                        this.prompt({
                            title: '入库确认',
                            code: "hyrkQr",
                            width: 460,
                            height: 200,
                            props: {
                                item: this.item,
                            },
                            callback: (close) => {
                                close();
                            }
                        });
                    } else {
                        this.$Message.error("表单验证失败！");
                    }
                });
            },
        }
    };
</script>