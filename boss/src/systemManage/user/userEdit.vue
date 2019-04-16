<template>
    <div id="userAddId" class="userAddWrap">
        <Form :model="formItem" :label-width="80" :rules="ruleInline" ref="formItem">
            <Row>
                <i-col span="11">
                    <Form-item label="用户名" prop="userName">
                        <Input v-model="formItem.userName" placeholder="请输入"></Input>
                    </Form-item>
                </i-col>
                <i-col span="11">
                    <Form-item label="姓名" prop="realName">
                        <Input v-model="formItem.realName" placeholder="请输入"></Input>
                    </Form-item>
                </i-col>
            </Row>
            <Row>
                <i-col span="11" style="position:relative" v-if="formItem.permissionLevel == 'GENERAL_USER_LEVEL'">
                    <Form-item label="手机号"  prop="phone">
                        <Input :value="formItem.phone" :class="{active:isPhone}" v-model="formItem.phone" @input="onChange" placeholder="请输入"></Input>
                        <div v-if="isPhone" class="error">{{isContent}}</div>
                    </Form-item>
                </i-col>
                <i-col span="11">
                    <Form-item label="性别">
                        <Radio-group v-model="formItem.sex">
                            <Radio label="1">男</Radio>
                            <Radio label="0">女</Radio>
                        </Radio-group>
                    </Form-item>
                </i-col>
            </Row>
            <Row>
                <i-col span="11">
                    <Form-item label="权限级别" prop="permissionLevel">
                        <Select v-model="formItem.permissionLevel" filterable @on-change="changePermissionLevel">
                            <Option v-for="item in levelItem" :value="item.value" :key="item.value">{{item.label}}</Option>
                        </Select>
                    </form-item>
                </i-col>
            </Row>
            <i-col span="2" offset="18">
                <Button type="primary"  @click="editSubmit('formItem')">保存</Button>
            </i-col>
        </Form>
    </div>
</template>

<script>
    export default {
        props: {
            id: null,  //用户id
            orgId: null, //组织id
            deptId:null //部门id
        },
        data () {
            let $self = this;
            return {
                formItem: {
                    realName: '',
                    phone:'',
                    userName:'',
                    sex: '1',
                    postLevel:'',
                    permissionName:''
                },
                levelItem:[],
                ruleInline: {
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
                          { required: true, length:11, message: '请填写手机号码', trigger: 'blur' },
                            { validator(rule, value, callback) {
                                    if (value){
                                        if (value.length == 11) {
                                            callback();
                                        }else {
                                            callback([new Error('请输入11位手机号码')]);
                                        }
                                    }else {
                                        callback();
                                    }
                                }}
                    ],
                    userName:[
                        { required: true, message: '请填写用户名', trigger: 'blur' },
                        { validator(rule, value, callback) {
                            if (value && value != $self.oldUserData.userName){
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
                    permissionLevel: [
                        { required: true, message: '请选择权限级别', trigger: 'blur' }
                    ]
                },
                oldUserData: {},
                isPhone:false,
                isContent:'该手机号已存在'

            }
        },
        methods: {
            getPowerLevel(){
                this.request({
                    url: "/systemManage/user/accessPowerLevel.do",
                    param: {
                        id: this.id
                    }
                }).then(item => {
                    if (undefined !== item && null !== item){
                        this.levelItem = item;
                    }
                });
            },
            onChange(){
                if (this.formItem.phone && this.formItem.phone != this.oldUserData.phone){
                        this.isPhone = false;
                        this.request({
                            url: '/systemManage/userOrgManage/validation.do',
                            param: {
                                phone: this.formItem.phone
                            }
                        }).then((data) => {
                            if (data) {
                                this.isPhone = true;
                                this.isContent = '该手机号已存在';
                            } else {
                                this.isPhone = false;
                            }
                        });
                }else {

                }
            },
            editSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.request({
                            url: "/systemManage/user/userEditSave.do",
                            data: {
                                id:this.id,
                                realName: this.formItem.realName,
                                phone: this.formItem.phone,
                                userName:this.formItem.userName,
                                sex:this.formItem.sex,
                                permissionLevel:this.formItem.permissionLevel
                            }
                        }).then(() => {
                            this.$Message.success('提交成功!');
                            this.callback()
                        });
                    } else {
//                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            changePermissionLevel(value) {
                if (this.oldUserData.permissionLevel != value) {
                    this.$Message.warning('切换权限后，已关联岗位将被清空!');
                }
            }
        },
        created () {
            this.getPowerLevel(),
            this.request({
                url: "/systemManage/user/userEdit.do",
                param: {
                    id: this.id
                }
            }).then(item => {
                item.userVo.sex = item.userVo.sex + "";
                this.formItem = Object.assign(this.formItem, item.userVo);
                this.oldUserData = Object.assign({}, item.userVo);
            })
        }
    }
</script>

<style scoped>
    .userAddWrap{
        width: 600px;
        margin: 25px auto;
    }
    .ivu-input-wrapper.active >>> .ivu-input{
        border-color:#f00;
    }
    .error{
        color:#f00;
        position: absolute;
        left: 0;
    }
</style>