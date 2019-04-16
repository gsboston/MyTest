<template>
    <Row style="padding: 15px 30px;">
        <div style="font-size: 16px"><label>{{item.name}}</label></div>
        <div style="font-size: 12px"><label>{{item.typeDict.name}}</label></div>
        <div style="font-size: 12px;color: #999999"><label>可派卡数：{{item.printedNum}}</label></div>
        <Form ref="item" :model="item" :rules="itemValidate" :label-width="0">
            <FormItem prop="num">
                <label>请输入派卡数量</label>
                <Input v-model="item.num" placeholder="派卡数量只支持非0整数"/>
            </FormItem>
            <FormItem prop="unitPrice">
                <label>请输入派卡收款单价</label>
                <Input v-model="item.unitPrice" placeholder="此处输入与派卡对象协商后的价格"/>
            </FormItem>
            <Form-item>
                <RadioGroup v-model="payState">
                    <Radio label="1">已收款</Radio>
                    <Radio label="0">未收款</Radio>
                </RadioGroup>
            </Form-item>
            <Dispatch ref="Dis" @orgSelected="orgSelected">
                <div slot="btn"></div>
            </Dispatch>
            <FormItem prop="reciever">
                <label>请输入领卡人</label>
                <Input v-model="item.reciever" placeholder="请输入领卡人"/>
            </FormItem>
            <FormItem style="float: right;">
                <Button type="primary" @click="save('item')">确定</Button>
            </FormItem>
        </Form>
    </Row>
</template>

<script>
    import Dispatch from '../hykgl/dispatch.vue';

    export default {
        components: {
            Dispatch
        },
        props: {item: null},
        data: function () {
            return {
                payState: '1',
                data: {},
                optMen: {
                    orgId: '',
                    orgName: ''
                },
                itemValidate: {
                    num: [
                        {required: true, message: '请输入派卡数量', trigger: 'blur'},
                        {pattern: /^[1-9]\d*$/, message: '派卡数量必须为整数', trigger: 'blur'},
                    ],
                    unitPrice: [
                        {required: true, message: '请输入派卡收款单价', trigger: 'blur'},
                        {pattern: /^0{1}([.]\d{1,2})?$|^[1-9]\d*([.]{1}[0-9]{1,2})?$/, message: '派卡收款单价必须为金额', trigger: 'blur'},
                    ],
                    reciever: [
                        {required: true, message: '请输入领卡人', trigger: 'blur'}
                    ],
                },
            }
        },
        created: function () {
        },
        methods: {
            orgSelected(item) {
                this.optMen = item;
            },
            save: function (name) {
                if (this.item.num > this.item.printedNum) {
                    this.$Message.error('派卡量大于库存，请重新派卡');
                    return;
                }
                if (!this.optMen.orgId) {
                    this.$Message.error('请选择派卡对象');
                    return;
                }
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.close();
                        this.item.payState = this.payState;
                        this.item.orgId = this.optMen.orgId;
                        this.item.orgName = this.optMen.orgName;
                        this.prompt({
                            title: '派卡确认',
                            code: "hypkQr",
                            width: 460,
                            height: 300,
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