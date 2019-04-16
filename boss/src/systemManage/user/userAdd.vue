<template>
    <div id="userAddId" class="userAddWrap">
        <Form :model="formItem" :label-width="80" :rules="ruleInline" ref="formItem">
            <Row>
                <i-col span="11">
                    <Form-item label="用户名" prop="userName">
                        <Input v-model="formItem.userName" placeholder="请输入" ></Input>
                    </Form-item>
                </i-col>
                <i-col span="11">
                    <Form-item label="姓名" prop="realName">
                        <Input v-model="formItem.realName" placeholder="请输入" ></Input>
                    </Form-item>
                </i-col>
            </Row>
            <Row>
                <i-col span="11">
                    <Form-item label="手机号"  prop="phone">
                        <Input :value="formItem.phone" v-model="formItem.phone" placeholder="请输入"></Input>
                    </Form-item>
                </i-col>
                <i-col span="11">
                    <Form-item label="性别">
                        <Radio-group v-model="formItem.sex">
                            <Radio label="1" >男</Radio>
                            <Radio label="0">女</Radio>
                        </Radio-group>
                    </Form-item>
                </i-col>
            </Row>
            <Row>
                <i-col span="11">
                    <Form-item label="权限级别" prop="postLevel">
                        <Select v-model="formItem.postLevel" filterable>
                            <Option v-for="item in levelItem" :value="item.value" :key="item.value">{{item.label}}</Option>
                        </Select>
                    </form-item>
                </i-col>
            </Row>
            <i-col span="2" offset="18">
                    <Button type="primary"  @click="addSubmit('formItem')">保存</Button>
            </i-col>
        </Form>
    </div>
</template>

<script>
    export default {
        props: {
            orgId:null,  //组织id
            deptId:null  //部门id
        },
        data () {
            let $self = this;
            return {
                formItem: {
                    realName: '',
                    phone:'',
                    userName:'',
                    sex:'1',
                    postLevel:''
                },
                levelItem:[],
                ruleInline: {
                    userName:[
                        { required: true, message: '请填写用户名', trigger: 'blur' },
                        { validator(rule, value, callback) {
                            if (value){
                                if (value.length <= 50) {
                                    $self.request({
                                        url: '/systemManage/userOrgManage/checkUserName.do',
                                        param: {
                                            userName: value
                                        }
                                    }).then((data) => {
                                        if (data) {
                                            callback(new Error('该用户名已存在'));
                                        }else {
                                            callback();
                                        }
                                    });
                                }else {
                                    callback(new Error('用户名长度限制为50个字符'));
                                }
                            }else {
                                callback();
                            }
                        }}
                    ],
                    realName: [
                        { required: true, message: '请填写姓名', trigger: 'blur' },
                        { validator(rule, value, callback) {
                            if (value){
                                if (value.length <= 50) {
                                    callback();
                                }else {
                                    callback(new Error('姓名长度限制为50个字符'));
                                }
                            }else {
                                callback();
                            }
                        }}
                    ],
                    phone: [
                        { required: true, length: 11, message: '请填写手机号码', trigger: 'blur' },
                        { pattern: /^[0-9]*$/, message: '手机号格式不正确', trigger: 'blur' },
                        { validator(rule, value, callback) {
                            if (value){
                                if (value.length == 11) {
                                    $self.request({
                                        url: '/systemManage/userOrgManage/validation.do',
                                        param: {
                                            phone: value
                                        }
                                    }).then((data) => {
                                        if (data) {
                                            callback(new Error('该手机号已存在'));
                                        }else {
                                            callback();
                                        }
                                    });
                                }else {
                                    callback([new Error('请输入11位手机号码')]);
                                }
                            }else {
                                callback();
                            }
                        }}
                    ],
                    postLevel: [
                        { required: true, message: '请选择权限级别', trigger: 'change' }
                    ],

                }
            }
        },
        methods: {
            addSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.request({
                            url: "/systemManage/user/saveUser.do",
                            data: {
                                realName: this.formItem.realName,
                                phone: this.formItem.phone,
                                userName:this.formItem.userName,
                                sex:this.formItem.sex,
                                permissionLevel:this.formItem.postLevel
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
            getPowerLevel(){
                this.request({
                    url: "/systemManage/user/accessPowerLevel.do"
                }).then(item => {
                    if (undefined !== item && null !== item){
                        this.levelItem = item;
                    }
                });
            }
        },
        created:function(){
            this.getPowerLevel();
        }
    }
</script>

<style scoped>
    .userAddWrap{
        width: 600px;
        margin: 25px auto;
    }

</style>