<template>
    <Row style="padding: 15px 30px;">
        <Form ref="formItem" :model="formItem" inline :rules="ruleInline" :label-width="80">
            <FormItem label="专题名称" prop="name">
                <Input v-model="formItem.name" placeholder="请输入专题名称"></Input>
            </FormItem>
            <FormItem label="专题链接" prop="specialLine">
                <Input v-model="formItem.specialLine" placeholder="请输入岗位名称"></Input>
            </FormItem>
            <FormItem label="上传图片" prop="specialImg">
                <BSUpload :onSuccess="onSuccessEnterprise" :type="['png','jpeg','jpg']">
                    <div class="upload">
                        <div v-if="!formItem.specialImg">
                            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                            <!--<p style="line-height: 20px;">80px*80px</p>-->
                            <p style="line-height: 20px;">支持上传png,jpeg,jpg</p>
                        </div>
                        <img :src="$updateConfig.file+formItem.specialImg+'&x-oss-process=image/resize,w_100,h_100/quality,Q_80'" v-else>
                    </div>
                </BSUpload>
            </FormItem>
            <FormItem style="float: right;">
                <Button type="primary" @click="addSubmit('formItem')">发布</Button>
            </FormItem>
        </Form>
    </Row>
</template>

<script>
    export default {
        data() {
            let $self = this;
            return {
                formItem: {
                    name: '',
                    specialLine: '',
                    specialImg: '',
                    status: 1
                },
                ruleInline: {
                    name: [
                        {required: true, message: '请填写专题名称', trigger: 'blur'},
                        {
                            validator(rule, value, callback) {
                                if (value) {
                                    if (value.length <= 200) {
                                        callback();
                                    } else {
                                        callback(new Error('专题名称长度限制为200个字符'));
                                    }
                                } else {
                                    callback();
                                }
                            }
                        }
                    ],
                    specialLine: [
                        {required: true, message: '请填写专题链接', trigger: 'blur'},
                        {
                            validator(rule, value, callback) {
                                let Expression=/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
                                let objExp=new RegExp(Expression);
                                if(objExp.test(value)!=true) {
                                    callback(new Error('链接错误,请以http(s)开头'));
                                }
                                if (value) {
                                    if (value.length <= 200) {
                                        callback();
                                    } else {
                                        callback(new Error('专题链接长度限制为200个字符'));
                                    }
                                } else {
                                    callback();
                                }
                            }
                        }
                    ],
                    specialImg: [
                        {required: true, message: '请上传图片', trigger: 'blur'}
                    ],
                }
            }
        },
        methods: {
            addSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.request({
                            url: "/thematicManagement/save.do",
                            data: {
                                name: this.formItem.name,
                                specialLine: this.formItem.specialLine,
                                specialImg: this.formItem.specialImg,
                                status: this.formItem.status
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
            /*上传专题图片*/
            onSuccessEnterprise: function (id) {
                this.formItem.specialImg = id;
            },
            cancel() {
                this.close();
            }
        }
    }
</script>

<style scoped>

    /*上传*/
    .upload {
        width: 130px;
        height: 130px;
        border: 1px dotted #ccc;
        text-align: center;
        cursor: pointer;
    }

    .upload div {
        padding-top: 15px;
    }

    .upload img {
        width: 100%;
        height: 100%;
    }
</style>