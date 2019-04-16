<template>
    <Row style="padding: 15px 30px;">
        <Form ref="formItem" :model="formItem" :rules="ruleInline" :label-width="100">
            <FormItem label="页面名称" prop="pageName">
                <Input v-model="formItem.pageName" placeholder="请输入专题名称"></Input>
            </FormItem>
            <Alert type="warning" show-icon>词语使用“，”区隔</Alert>
            <FormItem label="title" prop="title">
                <Input type="textarea" :autosize="false" v-model="formItem.title"/>
            </FormItem>
            <FormItem label="keywords" prop="keywords">
                <Input type="textarea" :autosize="false" v-model="formItem.keywords"/>
            </FormItem>
            <FormItem label="description" prop="description">
                <Input type="textarea" :autosize="false" v-model="formItem.description"/>
            </FormItem>
            <FormItem style="float: right;">
                <Button type="primary" @click="addSubmit('formItem')">保存</Button>
            </FormItem>
        </Form>
    </Row>
</template>

<script>
    export default {
        props: {
            id: null,
        },
        data() {
            let $self = this;
            return {
                formItem: {
                    pageName: '',
                    title: '',
                    keywords: '',
                    description: '',
                    id: ''
                },
                ruleInline: {
                    pageName: [
                        {required: true, message: '请填写页面名称', trigger: 'blur'},
                        {
                            validator(rule, value, callback) {
                                if (value) {
                                    if (value.length <= 400) {
                                        callback();
                                    } else {
                                        callback(new Error('页面名称长度限制为400个字符'));
                                    }
                                } else {
                                    callback();
                                }
                            }
                        }
                    ],
                    keywords: [
                        {required: true, message: '请填写keywords', trigger: 'blur'},
                        {
                            validator(rule, value, callback) {
                                if (value) {
                                    if (value.length <= 2000) {
                                        callback();
                                    } else {
                                        callback(new Error('keywords长度限制为2000个字符'));
                                    }
                                } else {
                                    callback();
                                }
                            }
                        }
                    ],
                    title: [
                        {required: true, message: '请填写title', trigger: 'blur'},
                        {
                            validator(rule, value, callback) {
                                if (value) {
                                    if (value.length <= 2000) {
                                        callback();
                                    } else {
                                        callback(new Error('title长度限制为2000个字符'));
                                    }
                                } else {
                                    callback();
                                }
                            }
                        }
                    ],
                    description: [
                        {required: true, message: '请填写description', trigger: 'blur'},
                        {
                            validator(rule, value, callback) {
                                if (value) {
                                    if (value.length <= 2000) {
                                        callback();
                                    } else {
                                        callback(new Error('description长度限制为2000个字符'));
                                    }
                                } else {
                                    callback();
                                }
                            }
                        }
                    ],
                }
            }
        },
        created: function () {
            if (this.id) {
                this.request({
                    url: "/metaManagement/getMetaById.do",
                    param: {
                        id: this.id
                    }
                }).then(item => {
                    this.formItem = item;
                });
            }
        },
        methods: {
            addSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.request({
                            url: "/metaManagement/save.do",
                            data: this.formItem,
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