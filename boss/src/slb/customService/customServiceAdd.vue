<template>
    <div id="userAddId" class="userAddWrap">
        <Form :model="formItem" :label-width="80" inline :rules="ruleInline" ref="formItem">
            <i-col span="11">
                <Form-item label="小能ID" prop="xnId">
                    <Input v-model="formItem.xnId" placeholder="请输入小能ID"></Input>
                </Form-item>
            </i-col>
            <i-col span="2" offset="18">
                <Button type="primary" @click="addSubmit('formItem')">保存</Button>
            </i-col>
        </Form>
    </div>
</template>

<script>
    export default {
        props: {
          customServiceId: '',
          xnId: '',
        },
        data() {
            let $self = this;
            return {
                formItem: {
                    itemId: 0,
                    xnId: ''
                },
                ruleInline: {
                    xnId: [
                        {required: true, message: '请填写小能ID', trigger: 'blur'},
                        {
                            validator(rule, value, callback) {
                                if (value) {
                                    if (value.length <= 80) {
                                        callback();
                                    } else {
                                        callback(new Error('用户名长度限制为80个字符'));
                                    }
                                } else {
                                    callback();
                                }
                            }
                        }
                    ]
                }
            }
        },
        created: function () {
            this.formItem.xnId = this.xnId;
        },
        methods: {
            addSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.request({
                            url: "/serviceIcon/updateInfo.do",
                            data: {
                                itemId: this.customServiceId,
                                xnId: this.formItem.xnId
                            }
                        }).then(() => {
                            this.$Message.success('提交成功!');
                            this.callback();
                        });
                    } else {
//                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            cancel() {
                this.close();
            }
        }
    }
</script>

<style scoped>
    .userAddWrap {
        width: 600px;
        margin: 25px auto;
    }

</style>