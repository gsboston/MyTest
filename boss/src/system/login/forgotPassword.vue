<style scoped>
    .container {
        width: 800px;
        /*min-height: 500px;*/
        margin: 15px auto;
        padding: 15px 15px 30px 15px;
        background: white;
        border-radius: 5px;
        box-shadow: 1px 2px 2px 3px rgba(175, 175, 175, 0.5);
    }
    .title {
        padding: 0 15px;
        line-height: 34px;
        color: #666;
        font-size: 16px;
        font-weight: bold;
        border-bottom: solid 1px #dddee1;
    }

    .ivu-form {
        width: 400px;
        margin-top: 30px;
    }
</style>

<template>
    <div class="container">
        <div class="title">忘记密码</div>
        <Form ref="form" :model="item" :label-width="80" :rules="itemRules">
            <FormItem label="帐号" prop="userName">
                <Input v-model="item.userName" placeholder="请输入要找回密码的帐号" />
            </FormItem>
            <FormItem>
                <Button :disabled="!show" @click="sendCheckNum">
                    <span v-if="show">{{title}}</span>
                    <span v-else>重新发送({{count}})</span>
                </Button>
                <span v-if="!show">已发送短信至：{{ mobile | changeMobile }}</span>
            </FormItem>
            <FormItem label="验证码" prop="checkCode">
                <Input v-model="item.checkCode" />
            </FormItem>
            <FormItem label="新密码" prop="password">
                <Input type="password" v-model="item.password" />
            </FormItem>
            <FormItem label="确认密码" prop="confirmPassword">
                <Input type="password" v-model="item.confirmPassword" />
            </FormItem>
            <FormItem style="margin: 0; color: red;">
                {{errorMsg}}
            </FormItem>
            <FormItem>
                <Button @click="submit">提交</Button>
                <Button type="ghost" @click="cancel">取消</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script type="text/javascript">
    import md5 from "js-md5";
    export default {
        props: {
            userName: null,
        },
        data () {
            const passwordValidator = (rule, value, callback) => {
                value = String(value).trim();
                if(String.isBlank(value)) {
                    callback(new Error("请输入密码"));
                    return;
                }
                let reg = /^[\x20-\x7e]{6,18}$/g;
                if(reg.test(value)) {
                    callback();
                }else {
                    callback(new Error("请输入6-30位任意字符"));
                }
            };
            const checkConfirm = (rule, value, callback) => {
                if(Object.isNull(value) || String.isBlank(value)) {
                    callback(new Error("请再次输入密码"));
                }else if(value !== this.item.password) {
                    callback(new Error("两次输入密码不一致！"));
                }else {
                    callback();
                }
            };
            return {
                mobile: "",
                title: "发送验证码",
                show: true,
                count: '',
                timer: null,
                item: {},
                itemRules: {
                    userName: [{required: true, message: "请输入要找回密码的帐号"}],
                    checkCode: [{required: true, message: "请输入您收到的验证码"}],
                    password: [{required: true, message: "新密码不能为空"}, {validator: passwordValidator}],
                    confirmPassword: [{required: true, message: "确认密码不能为空"}, {validator: checkConfirm}]
                },
                errorMsg: null
            }
        },
        created: function() {
            this.item.userName = this.$route.params.userName;
        },
        filters: {
            changeMobile : function (value) {
                return value.substring(0,3) + "****" + value.substring(value.length-4,value.length);
            },
        },
        methods: {
            /**
             * 发送验证码
             */
            sendCheckNum () {
                if (this.item.userName) {
                    const TIME_COUNT = 60;
                    this.count = TIME_COUNT;
                    this.show = false;
                    this.request({
                        url: "/systemManage/forgotPasswordSendCode.do",
                        param: {
                            userName: this.item.userName,
                        }
                    }).then(data => {
                        if (data.SUCCESS == "SUCCESS") {
                            if (!this.timer) {
                                this.timer = setInterval(() => {
                                    this.$set(this, "mobile", data.phoneNumbers);
                                    if (this.count > 0 && this.count <= TIME_COUNT) {
                                        this.count--;
                                    } else {
                                        this.$set(this, "mobile", "");
                                        this.show = true;
                                        clearInterval(this.timer);
                                        this.timer = null;
                                        this.title = "重新发送";
                                    }
                                }, 1000);
                            }
                        } else {
                            this.show = true;
                            this.timer = null;
                            this.title = "发送验证码";
                            this.$Message.info("手机号验证次数超出，请明日再试！");
                        }
                    }, error => {
                        this.show = true;
                        this.timer = null;
                        this.title = "发送验证码";
                    });
                } else {
                    this.$Message.info("请输入要找回密码的帐号");
                }
            },
            submit () {
                this.$refs.form.validate(valid => {
                    if(valid) {
                        this.request({
                            url: "/systemManage/forgotPasswordChangePassword.do",
                            data: {
                                userName : this.item.userName,
                                validateCode : this.item.checkCode,
                                newPassword : md5(this.item.password),
                                confirmPassword : md5(this.item.confirmPassword),
                            },
                        }).then(() => {
                            this.$Message.info("密码修改成功!");
                            window._frameRouter.push("/login");
                            this.cancel();
                        }, error => {
                            this.errorMsg = error.message;
                        });
                    }
                });
            },
            cancel () {
                window._frameRouter.push("login");
            }
        }
    };
</script>