<template>
    <div class="container">
        <i-form :model="formItem" :label-width="80" ref="form">
            <Row>
                <i-col span="11">
                    <Form-item label="公司名称" class="ivu-form-item-required" prop="name">
                        <i-input :readonly="!isEditable" v-model="formItem.name" placeholder="公司名称" :maxlength="100"></i-input>
                    </Form-item>
                </i-col>
            </Row>
            <Row>
                <i-col span="11">
                    <Form-item label="证件号" class="ivu-form-item-required" prop="idnumber">
                        <i-input :readonly="!isEditable" v-model="formItem.idnumber" placeholder="税务登记证/统一社会信用代码" :maxlength="25"></i-input>
                    </Form-item>
                </i-col>
            </Row>
            <Row>
                <i-col span="11">
                    <Form-item label="联系人" class="ivu-form-item-required" prop="linkManName">
                        <i-input :readonly="!isEditable" v-model="formItem.linkManName" placeholder="联系人" :maxlength="20"></i-input>
                    </Form-item>
                </i-col>
                <i-col span="11" offset="2">
                    <Form-item label="联系电话" class="ivu-form-item-required" prop="phone">
                        <i-input :readonly="!isEditable" v-model="formItem.phone" placeholder="联系电话" :maxlength="20"></i-input>
                    </Form-item>
                </i-col>
            </Row>
            <Row>
                <i-col span="11">
                    <Form-item label="电子邮箱">
                        <i-input :readonly="!isEditable" v-model="formItem.email" placeholder="电子邮箱" :maxlength="50"></i-input>
                    </Form-item>
                </i-col>
            </Row>
            <Row>
                <i-col span="24">
                    <Form-item label="联系地址" class="ivu-form-item-required" prop="address">
                        <i-input :readonly="!isEditable" v-model="formItem.address" placeholder="联系地址" :maxlength="100"></i-input>
                    </Form-item>
                </i-col>
            </Row>
        </i-form>
    </div>
</template>

<script>
    export default {
        props: {
            isEditable: {
                type: Boolean,
                default: true
            },
            registerInfo: {
                type: String,
                default: null
            }
        },
        watch: {
            isEditable(val) {
                this.isEditable = val;
            },
            registerInfo(val) {
                this.registerInfo = val;
                this.init();
            }
        },
        data: function() {
            return {
                formItem: {
                    name: '',
                    idnumber: '',
                    linkManName: '',
                    phone: '',
                    email: '',
                    address: '',
                    type: 'COMPANY',
                }
            }
        },
        created () {
            this.init();
        },
        methods: {
            init () {
                if (this.registerInfo) {
                    let content = JSON.parse(this.registerInfo);
                    if (content) {
                        this.formItem = Object.assign(this.formItem, content);
                        return;
                    }
                }
                this.$nextTick(() => {
                    this.$refs['form'].resetFields();
                });
            },
            save (successCallback, state) {
                if (state == '1') {
                    if (String.isNullOrBlank(this.formItem.name)) {
                        this.$Message.error('请输入公司名称');
                        return;
                    }
                    if (String.isNullOrBlank(this.formItem.idnumber)) {
                        this.$Message.error('请输入证件号');
                        return;
                    }else if (!(/^[A-Za-z0-9]+$/.test(this.formItem.idnumber))) {
                        this.$Message.error('证件号只允许输入英文或者数字');
                        return;
                    }
                    if (String.isNullOrBlank(this.formItem.linkManName)) {
                        this.$Message.error('请输入联系人');
                        return;
                    }
                    if (String.isNullOrBlank(this.formItem.phone)) {
                        this.$Message.error('请输入联系电话');
                        return;
                    }
                    if (String.isNullOrBlank(this.formItem.address)) {
                        this.$Message.error('请输入联系地址');
                        return;
                    }
                }
                successCallback(JSON.stringify(this.formItem), state);
            }
        }
    }
</script>

<style scoped>
    .container {
        padding: 10px;
        background: #FFF;
    }

    .container >>> input[readonly] {
        border: 1px solid transparent;
        border-bottom: 1px solid #eee;
        border-radius: 0;
    }
</style>