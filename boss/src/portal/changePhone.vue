<style scoped>
    .container {
        width: 800px;
        /*min-height: 500px;*/
        margin: 15px auto;
        padding: 15px 15px 30px 15px;
        background: white;
        border-radius: 5px;
        box-shadow: 0 2px 3px 0 rgba(175, 175, 175, 0.5);
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
        <div class="title">验证手机号</div>
        <Form ref="form" :label-width="80">
            <FormItem label="登录密码">
                <Input type="password" v-model="password" />
            </FormItem>
            <FormItem label="新手机号">
                <Input v-model="phoneNumber" />
            </FormItem>
            <FormItem label="验证码">
                <Input v-model="validCode" style="width: 200px;" />
                <Button style="float: right; width: 92px;" @click="sendValidCode" :disabled="notSendValidCode">{{validCodeText}}</Button>
            </FormItem>
            <FormItem style="margin: 0; color: red;">{{errorMsg}}</FormItem>
            <FormItem>
                <Button @click="submit" :disabled="notSubmit">提交</Button>
                <Button type="ghost" @click="cancel">取消</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    import md5 from "js-md5";
    const TEXT_SEND = "发送验证码";
    const TEXT_RESEND = "重新发送";
    export default {
        data () {
            return {
                password: null,
                phoneNumber: null,
                validCode: null,
                errorMsg: null,
                sending: false,
                validCodeText: TEXT_SEND
            }
        },
        methods: {
            sendValidCode () {
                if(this.sending) {
                    this.errorMsg = "您的操作过于频繁，请稍后再试";
                    return;
                }
                if(String.isNullOrBlank(this.phoneNumber)) {
                    this.errorMsg = "请输入手机号";
                    return;
                }
                if(!/1\d{10,10}/.test(this.phoneNumber)) {
                    this.errorMsg = "请输入合法的11位手机号";
                    return;
                }
                this.request({
                    url: "/system/sms/sendValidCode.do",
                    param: {
                        phoneNumber: this.phoneNumber
                    }
                }).then(() => {
                    let timeout = 60;
                    this.validCodeText = timeout + " 秒";
                    this.sending = true;
                    let interval = setInterval(() => {
                        timeout--;
                        if(timeout == 0) {
                            clearInterval(interval);
                            this.sending = false;
                            this.validCodeText = TEXT_RESEND;
                        }else {
                            this.validCodeText = timeout + " 秒";
                        }
                    }, 1000);
                });
            },
            submit () {
                if(this.sending) {
                    this.errorMsg = "您的操作过于频繁，请稍后再试";
                    return;
                }
                if(String.isNullOrBlank(this.password)) {
                    this.errorMsg = "请输入登录密码";
                    return;
                }
                if(String.isNullOrBlank(this.phoneNumber)) {
                    this.errorMsg = "请输入手机号";
                    return;
                }
                if(!/1\d{10,10}/.test(this.phoneNumber)) {
                    this.errorMsg = "请输入合法的11位手机号";
                    return;
                }
                if(String.isNullOrBlank(this.validCode)) {
                    this.errorMsg = "请输入验证码";
                    return;
                }
                this.request({
                    url: "/system/user/changePhone.do",
                    param: {
                        password: md5(this.password),
                        phoneNumber: this.phoneNumber,
                        validCode: this.validCode
                    }
                }).then(() => {
                    this.$Message.info("验证手机号成功");
                    this.cancel();
                });
            },
            cancel () {
                window._frameRouter.push("userInfo");
            }
        },
        computed: {
            notSendValidCode () {
                return String.isNullOrBlank(this.phoneNumber) || this.sending || !/1\d{10,10}/.test(this.phoneNumber);
            },
            notSubmit () {
                return String.isNullOrBlank(this.password) ||
                    String.isNullOrBlank(this.phoneNumber) ||
                    String.isNullOrBlank(this.validCode)
            }
        }
    };
</script>