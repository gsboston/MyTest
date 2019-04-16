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
        <div class="title">修改密码</div>
        <Form ref="form" :model="item" :label-width="80" :rules="itemRules">
            <FormItem label="原密码" prop="oldPassword">
                <Input type="password" v-model="item.oldPassword" />
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
                item: {},
                itemRules: {
                    oldPassword: [{required: true, message: "原密码不能为空"}],
                    password: [{required: true, message: "新密码不能为空"}, {validator: passwordValidator}],
                    confirmPassword: [{validator: checkConfirm}]
                },
                errorMsg: null
            }
        },
        methods: {
            submit () {
                this.$refs.form.validate(valid => {
                    if(valid) {
                        this.request({
                            url: "/system/user/changePassword.do",
                            param: {
                                oldPassword: md5(this.item.oldPassword),
                                password: md5(this.item.password)
                            }
                        }).then(() => {
                            this.$Message.info("密码修改成功");
                            Context.logout();
                            window._frameRouter.push("/login");
//                            this.cancel();
                        }, error => {
                            this.errorMsg = error.message;
                            this.$Message.info("密码修改失败");
                        });
                    }
                });
            },
            cancel () {
                this.$Message.info("密码修改失败");
                window._frameRouter.push("userInfo");
            }
        }
    };
</script>