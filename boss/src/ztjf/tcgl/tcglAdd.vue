<template>
    <Row style="padding: 15px 30px;">
        <Form ref="formValidate" :model="item" :rules="ruleValidate" :label-width="100">
            <FormItem label="购买组织类型" prop="orgType">
                <Select v-model="item.orgType" placeholder="请选择购买组织类型">
                    <Option v-for="level in orgTypeList" :value="level.value" :key="level.value">{{ level.name }}</Option>
                </Select>
            </FormItem>
            <FormItem label="使用时长" prop="packageLength">
                <Select v-model="item.packageLength" placeholder="请选择使用时长">
                    <Option v-for="level in packageLengthList" :value="level.value" :key="level.value">{{ level.name }}</Option>
                </Select>
            </FormItem>
            <FormItem label="账套数量" prop="accountNumber">
                <Input v-model="item.accountNumber" placeholder="请输入账套数量"/>
            </FormItem>
            <FormItem label="价格" prop="amount">
                <Input v-model="item.amount" placeholder="请输入价格" :maxlength="20"/>
            </FormItem>
            <FormItem style="float: right;">
                <Button type="primary" @click="save()">保存</Button>
            </FormItem>
        </Form>
    </Row>
</template>

<script>
    export default {
        data: function () {
            return {
                orgTypeList: [],
                packageLengthList: [],
                ruleValidate: {
                    orgType: [
                        {required: true, message: '请选择购买组织类型'}
                    ],
                    packageLength: [
                        {required: true, message: '请选择使用时长'}
                    ],
                    accountNumber: [
                        {required: true, message: '请输入账套数量'},
                        {
                            validator(rule, value, callback) {
                                if (!value) {
                                    callback([new Error('请输入账套数量')]);
                                } else {
                                    if (value.toString().length > 20) {
                                        callback(new Error('账套数量不允许超过20位数字'));
                                    } else {
                                        if (/^\d+$/.test(value)) {
                                            callback();
                                        } else {
                                            callback(new Error('账套数量必须为整数'));
                                        }
                                    }
                                }
                            }
                        }
                    ],
                    amount: [
                        {required: true, message: '请输入价格'},
                        {
                            validator(rule, value, callback) {
                                if (!value) {
                                    callback([new Error('请输入价格')]);
                                } else {
                                    if (value.toString().length > 20) {
                                        callback(new Error('价格不允许超过20位数字'));
                                    } else {
                                        if (/^0{1}([.]\d{1,2})?$|^[1-9]\d*([.]{1}[0-9]{1,2})?$/.test(value)) {
                                            callback();
                                        } else {
                                            callback(new Error('价格必须为金额'));
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
            }
        },
        props: {item: null},
        created: function () {
            this.getOrgType();
            this.getPackageLength();
        },
        methods: {
            getOrgType() {
                this.request({
                    url: "/tcgl/getKeyBook.do",
                    param: {
                        type: 'orgType',
                    }
                }).then(data => {
                    this.orgTypeList = data;
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
            save: function () {
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        if (this.item.id) {
                            this.request({
                                url: "/tcgl/update.do",
                                param: {
                                    id: this.item.id,
                                },
                                data: this.item,
                            }).then(data => {
                                this.$Message.success('更新成功!');
                                this.callback();
                            }, error => {
                                this.$Message.error(error.stack[0].message);
                            });
                        } else {
                            this.item.creator = window.Context.getCurrentUser().id;
                            this.request({
                                url: "/tcgl/save.do",
                                data: this.item,
                            }).then(res => {
                                this.$Message.success('保存成功!');
                                this.callback();
                            }, error => {
                                this.$Message.error(error.message);
                            });
                        }
                    } else {
                        this.$Message.error("表单验证失败！");
                    }
                });
            },
        }
    };
</script>