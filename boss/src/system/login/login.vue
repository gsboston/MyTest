<style scoped>
    .container {
        position: relative;
        margin: 0;
        padding-top: 120px;
        width: 100%;
        height: 100%;
        background:url(img/background.jpg)no-repeat center;
        background-size:100% auto ;
        filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='/img/BOSS-login-background.jpg',sizingMethod='scale');
    }

    .login-panel {
        position: relative;
        width: 400px;
        height: 400px;
        margin: 0 auto;
        padding:60px 35px 0 40px ;
        background-color: #fff;
        border-radius: 5px;
    }
    .support-browser{
        text-align: center;
        padding-top: 30px;
        font-size: 16px;
        font-weight: bold;
    }
    .logo {
        height: 50px;
        text-align: center;
        margin-bottom: 20px;
    }
    .logo > img {
        /*width: 226px;*/
        width: auto;
        height: 50px;
        /*vertical-align: middle;*/
    }
    .logo > span {
        margin-left: 10px;
        line-height: 50px;
        font-size: 28px;
        font-family: "Songti SC";
        font-weight: bold;
        vertical-align: middle;
        color: #5b698d;
    }
    .login-input {
        display: inline-block;
        width: 100%;
        height: 50px;
        line-height: 1.5;
        padding: 2px 15px;
        font-size: 14px;
        margin-bottom: 15px;
        border: 1px solid #e8e8e8;
        color: #495060;
        position: relative;
        cursor: text;
        transition: border .2s ease-in-out,background .2s ease-in-out,box-shadow .2s ease-in-out;
    }
    .errorMsg {
        margin: 10px 0 0 0;
        line-height: 18px;
        font-size: 14px;
        color: red;
        text-align: center;
    }
    .login-btn {
        width: 100%;
        height: 50px;
        font-size: 18px;
        font-family:"Helvetica Neue",Helvetica,Arial,"Microsoft Yahei","Hiragino Sans GB","Heiti SC","WenQuanYi Micro Hei",sans-serif;
        background: #ccc;
        border: none;
        margin-top: 10px;
    }
    .login-btn.ready {
        color: white;
        background-color: #58ba9e;
    }

    .copyright{
        position: absolute;
        left: 0;
        right: 0;
        bottom: 10px;
        text-align: center;
        color: #666;
    }
    .copyright > a {
        color: #666;
    }
    .send-validation-btn {
        width: 150px;
        height: 50px;
        font-size: 18px;
        border: none;
        margin-top: -5px;
        margin-left: -3px;
        border-radius: 0px 25px 25px 0px
    }
    .send-activate-btn{
        width: 140px;
        height: 40px;
        font-size: 18px;
        border: none;
        margin-left: 230px;
        margin-top: 20px;
    }
    .login-input:focus {
        border-color: #59b399;
        outline: none;
        box-shadow: none;

    }
</style>

<template>
    <div class="container">
        <div style="position: fixed; top: 15px; left: 15px; font-size: 16px;" v-if="env != 'PRODUCTION'">
            <a href="#/swagger" style="text-decoration: underline;">查看Swagger文档</a>
        </div>
        <div v-if="!this.activate" style="width: 600px;height: 500px;background-color: white;position: absolute;left: 50%;margin-left: -300px;top: 60px;z-index: 10">
            <h1 style="text-align: center;margin-top: 40px">欢迎使用神州顺利办业务管理平台</h1>
            <p style="font-size: 18px;text-align: center;margin-top: 80px">
                <span>我们将向您的手机</span>
                <span style="color: #169BD5">{{userPhone}}</span>
                <span>发送一条验证短信</span>
            </p>
            <input style="border-radius: 25px 0px 0px 25px;width: 270px;margin-left: 90px;margin-top: 80px;outline:none;" class="login-input" v-model="validationCode" placeholder="请输入您收到的验证码"/>
            <Button v-if="!isSendValidationCode" class="send-validation-btn" @click="getValidationCode">获取验证码</Button>
            <Button v-if="isSendValidationCode" class="send-validation-btn" :disabled="isSendValidationCode">{{countdown}}秒后重新获取</Button>
            <Button class="send-activate-btn" @click="activateUser">激活</Button>
            <p style="margin-top: 40px;font-size: 14px;text-align: center">
                <span>使用其他账号登录</span>
                <span style="color: #169BD5;cursor: pointer" @click="switchUser">登录</span>
            </p>
        </div>
        <div v-if="this.activate" class="login-panel" :style="{height:imageCodeIsShow?'450px':'400px'}">
            <div class="logo">
                <img src="./img/boss_logo_gray.jpg" />
                <!--<span>顺利办云管家</span>-->
                <!--<img src="./img/boss-logo.ico">-->
            </div>
            <input ref="name" class="login-input" v-model="name" placeholder="请输入系统账号" @keyup.13="focusPasswordInput" autofocus />
            <input ref="password" class="login-input" type="password" v-model="password" placeholder="请输入登录密码" @keyup.13="focusVerificationCode" />
            <div v-if="imageCodeIsShow" style="height: 50px;margin-bottom: 20px">
                <input style="width: 169px;top: -20px;" ref="verificationCode" class="login-input" v-model="verificationCode" placeholder="请输入验证码" @keyup.13="login"/>
                <img style="border: 1px solid black;cursor: pointer;" :src="this.imageVerificationCode" @click="getCode"/>
            </div>
            <div>
                <div style="display: inline-block;float: left;">
                    <span style="color: #495060; textDecoration:none;" onmouseover="this.style.color='#F00';this.style.textDecoration='underline'" onmouseout="this.style.color='#495060';this.style.textDecoration='none'" @click="openApply">企业开通申请</span>
                </div>
                <div style="display: inline-block;float: right;">
                    <span style="color: #495060; textDecoration:none;" onmouseover="this.style.color='#F00';this.style.textDecoration='underline'" onmouseout="this.style.color='#495060';this.style.textDecoration='none'" @click="forgetPassword">忘记密码</span>
                </div>
            </div>
            <p style="margin-top: 35px" class="errorMsg">{{errorMsg}}</p>
            <Button type="ghost" class="login-btn ready" @click="login">立即登录</Button>
        </div>
        <div class="support-browser">
            <span>推荐使用谷歌Chrome浏览器，分辨率为1280*768以上达到最佳浏览效果</span>
        </div>
        <div class="copyright">
            Copyright © 2016-2019 All Right Reserved.神州顺利办版权所有 京ICP备 10028182号
            <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010802024523" target="_blank" style="display:inline-block;text-decoration:none;">
                <img src="./img/ghs.png" lazysrc="" style="float:left;"/>
                京公网安备 11010802024523号
            </a>
        </div>
    </div>
</template>

<script>
    import md5 from "js-md5";
    export default {
        data: () => {
            return {
                imageVerificationCode: null,
                imageCodeIsShow: false,
                name: null,
                password: null,
                verificationCode: null,
                errorMsg: "",
                activate: true,
                userPhone: "",
                validationCode: null,
                isSendValidationCode: false,
                countdown : 60,
                intervalId : "",
                env: "PRODUCTION"
            };
        },
        created () {
            this.validationCode = null;
            let param = this.$route.params;
            if(param.error == 403) {
                this.errorMsg = param.message;
                setTimeout(() => {
                    this.errorMsg = null;
                }, 2500);
            }
            this.request({
                url: "/portal/getEnv.do"
            }).then(data => {
                this.env = data.env;
            });
        },
        methods: {
            getCode () {
                this.request({
                    url: "/systemManage/getCode.do"
                }).then(data => {
                    this.imageVerificationCode = data;
                });
            },
            focusPasswordInput () {
                this.$refs.password.focus();
            },
            focusVerificationCode () {
                if(this.imageCodeIsShow){
                    this.$refs.verificationCode.focus();
                }else{
                    this.login();
                }
            },
            openApply () {
                this.$router.push({ name: 'CompanyOpenApply'});
            },
            forgetPassword () {
                this.$router.push({ name: 'ForgotPassword', params: { userName: this.name }});
            },
            switchUser () {
                this.$set(this,"activate",true);
                this.$set(this,"name",null);
                this.$set(this,"password",null);
            },
            getValidationCode () {
                this.$set(this,"countdown",60);
                this.isSendValidationCode = true;
                this.intervalId = window.setInterval(this.PerRefresh, 1000);
                this.request({
                    url: "/systemManage/getValidationCode.do",
                    data: {systemCode: "BOSS_SYSTEM",phoneNumbers: this.userPhone,channelCode:"BOSS"}
                }).then(data => {
                }, error => {
                });
            },
            PerRefresh () {
                if(this.countdown == 0){
                    this.isSendValidationCode = false;
                    window.clearInterval(this.intervalId);
                }
                this.countdown--;
                this.$set(this,"countdown",this.countdown);
            },
            activateUser () {
                if(this.validationCode){
                    this.request({
                        url: "/systemManage/activateUser.do",
                        data: {phoneNumber: this.userPhone,validateCode: this.validationCode}
                    }).then(data => {
                        window._frameRouter.push("/");
                    }, error => {
//                        this.$Message.info(error.message);
                    });
                }else{
                    this.$Message.error('请填写验证码！');
                }
            },
            login () {
                this.$refs.password.blur();
                if(!String.notBlank(this.name)) {
                    this.errorMsg = "请输入系统账号";
                    return;
                }
                if(!String.notBlank(this.password)) {
                    this.errorMsg = "请输入登录密码";
                    return;
                }
                if(this.imageCodeIsShow && !String.notBlank(this.verificationCode)) {
                    this.errorMsg = "请输入验证码";
                    return;
                }
                this.request({
                    url: "/systemManage/login.do",
                    data: {
                        name: this.name,
                        password: md5(this.password),
                        verificationCode: this.verificationCode,
                    }
                }).then(data => {
                    if(!data.activate){
                        this.activate = data.activate;
                        this.$set(this,"name",null);
                        this.userPhone = data.phone;
                    }else{
                        // location.replace(location.origin);
                        window._frameRouter.push("/");
                    }
                }, error => {
                    if(error.status == 110) {
                        if(error.message == "已输错3次密码，请输入验证码"){
                            this.imageCodeIsShow = true;
                            this.getCode();
                        }
                        this.errorMsg = error.message
                    }else if(error.status == 120) {
                        this.errorMsg = "无法访问服务器";
                    }else {
                        this.errorMsg = "系统异常";
                    }
                });
            }
        },
        computed: {
            loginEnable () {
                return String.notBlank(this.name) && String.notBlank(this.password);
            }
        }
    }
</script>