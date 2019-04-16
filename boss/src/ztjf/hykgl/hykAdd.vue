<template>
    <Row style="padding: 15px 30px;">
        <Form ref="item" :model="item" :rules="itemValidate" :label-width="0">
            <FormItem prop="name">
                <div style="display:inline-block;width: 120px">
                    <Select v-model="type" placeholder="请选择卡类型">
                        <Option v-for="level in typeList" :value="level.value" :key="level.value">{{ level.name }}</Option>
                    </Select>
                </div>
                <div style="display:inline-block;margin-left: -4px;width: 210px">
                    <Input v-model="item.name" placeholder="请输入卡名称" :maxlength="20"/>
                </div>
            </FormItem>
            <FormItem prop="accountNum">
                <Input v-model="item.accountNum" placeholder="请输入卡包含账套数量"/>
            </FormItem>
            <FormItem prop="usageTime">
                <Select v-model="item.usageTime" placeholder="请选择账套使用时限">
                    <Option v-for="level in packageLengthList" :value="level.value" :key="level.value">{{ level.name }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="price">
                <Input v-model="item.price" placeholder="请输入卡面值" :maxlength="20"/>
            </FormItem>
            <FormItem style="float: right;">
                <Button type="primary" @click="save('item')">保存</Button>
            </FormItem>
        </Form>
    </Row>
</template>

<script>
    export default {
        props: {item: null},
        data: function () {
            return {
                typeList: [],
                packageLengthList: [],
                type: '1',
                itemValidate: {
                    name: [
                        {required: true, message: '请输入卡名称', trigger: 'blur'}
                    ],
                    usageTime: [
                        {required: true, message: '请选择账套使用时限', trigger: 'blur'}
                    ],
                    accountNum: [
                        {required: true, message: '请输入卡包含账套数量', trigger: 'blur'},
                        {pattern: /^\d+$/, message: '卡包含账套数量必须为整数', trigger: 'blur'},
                    ],
                    price: [
                        {required: true, message: '请输入卡面值', trigger: 'blur'},
                        {pattern: /^0{1}([.]\d{1,2})?$|^[1-9]\d*([.]{1}[0-9]{1,2})?$/, message: '卡面值必须为金额', trigger: 'blur'},
                    ]
                },
            }
        },
        created: function () {
            this.getCardType();
            this.getPackageLength();
        },
        methods: {
            getCardType() {
                this.request({
                    url: "/tcgl/getKeyBook.do",
                    param: {
                        type: 'cardType',
                    }
                }).then(data => {
                    this.typeList = data;
                });
            },
            getPackageLength() {
                this.request({
                    url: "/tcgl/getKeyBook.do",
                    param: {
                        type: 'packageLength',
                    }
                }).then(data => {
                    this.packageLengthList = data;
                });
            },
            save: function (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.item.type = this.type;
                        this.item.creator = window.Context.getCurrentUser().id;
                        this.request({
                            url: "/hykgl/save.do",
                            data: this.item,
                        }).then(data => {
                            this.$Message.success('保存成功!');
                            this.callback();
                        }, error => {
                            this.$Message.error(error.message);
                        });
                    } else {
                        this.$Message.error("表单验证失败！");
                    }
                });
            },
        }
    };
</script>