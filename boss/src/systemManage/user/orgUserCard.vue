<template>
    <div id="userAddId" class="userAddWrap">
        <Alert show-icon closable v-if="(editType == 'addToDept')&&(userTips != '')">
            {{userTips}}
            <Button type="ghost" class="reset-form" @click="resetForm">重新输入</Button>
        </Alert>
        <i-form :model="formItem" :label-width="80" inline :rules="ruleInline" ref="form">
            <Row v-if="isShowUserSetting">
                <i-col span="24">
                    <Form-item label="手机"  prop="phone">
                        <i-input :disabled="phoneIsDisabled" :value="formItem.phone" v-model="formItem.phone" placeholder="请输入" style="width:200px"></i-input>
                    </Form-item>
                </i-col>
                <i-col span="12">
                    <Form-item label="用户名" prop="userName">
                        <i-input :disabled="userInfoDisabled" :value="formItem.userName"  v-model="formItem.userName" placeholder="请输入" style="width:200px"></i-input>
                    </Form-item>
                </i-col>
                <i-col span="12">
                    <Form-item label="姓名" prop="realName">
                        <i-input :disabled="userInfoDisabled" :value="formItem.realName" v-model="formItem.realName" placeholder="请输入" style="width:200px"></i-input>
                    </Form-item>
                </i-col>
                <i-col span="12" v-if="isShowUserLevelSetting || editType == 'update'">
                    <Form-item label="权限级别" prop="permissionLevel">
                        <Select v-model="formItem.permissionLevel" clearable style="width: 200px;" :disabled="(userInfoDisabled || editType == 'update')" @on-change="choosePermissionLevel">
                            <Option v-for="item in authLevel" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </Form-item>
                </i-col>
                <i-col span="12">
                    <Form-item label="性别">
                        <Radio-group v-model="formItem.sex">
                            <Radio :disabled="userInfoDisabled" label="1" >男</Radio>
                            <Radio :disabled="userInfoDisabled" label="0">女</Radio>
                        </Radio-group>
                    </Form-item>
                </i-col>
                <i-col span="2" offset="18">
                    <i-button v-if="cancelBtn" type="ghost" @click="cancel">取消</i-button>
                    <i-button type="primary" @click="save">保存</i-button>
                </i-col>
            </Row>
            <Row v-if="isShowPostSetting">
                <Form-item :label="!isShowPostSetting ? '岗位信息' : ''" :label-width="!isShowPostSetting ? 80 : 20">
                    <CheckboxGroup v-model="formItem.postIds" v-if="editType == 'add'">
                        <Checkbox v-for="item in formItem.postValues" :label="item.id" :key="item.id">{{item.name}}</Checkbox>
                    </CheckboxGroup>
                    <div v-else>
                        <Checkbox v-for="item in formItem.postValues" :key="item.id" :value="item.checked" @on-change="choosePost(item.id, $event)">{{ item.name }}</Checkbox>
                    </div>
                </Form-item>
            </Row>
        </i-form>
    </div>
</template>

<script>
    export default {
        props: {
            orgId: null,  //组织id
            deptId: null,  //部门id
            userId: null,
            cancelBtn: {
                type: Boolean,
                default: false
            },
            isComponent: {
                type: Boolean,
                default: false
            },
            isShowUserSetting: {
                type: Boolean,
                default: true
            },
            isShowPostSetting: {
                type: Boolean,
                default: true
            },
            isShowUserLevelSetting: {
                type: Boolean,
                default: true
            },
            userLevelName: {
                type: Boolean,
                default: true
            },
        },
        watch: {
            orgId(value) {
                this.orgId = value;
            },
            deptId(value) {
                this.deptId = value;
            },
            userId(value) {
                this.userId = value;
                if (value) {
                    this.phoneIsDisabled = true;
                    this.editType = 'update';
                }else {
                    this.phoneIsDisabled = false;
                    this.editType = 'add';
                }
                this.$refs['form'].resetFields();
                this.getUserData();
            }
        },
        data () {
            let $self = this;
            return {
                formItem: {
                    realName: '',
                    phone:'',
                    userName:'',
                    sex:'1',
                    postIds: [],
                    postValues: [],
                    permissionLevel: ''
                },
                ruleInline: {
                    realName: [
                        { required: true, message: '请填写姓名', trigger: 'blur' },
                        { validator(rule,value,callback){
                            if(value){
                                if(value.length <=50){
                                    callback();
                                }else{
                                    callback(new Error('姓名长度限制为50个字符'));
                                }
                            }else{
                                callback();
                            }
                        }}
                    ],
                    phone: [
                        { required: true,  message: '请填写手机号码',length: 11, trigger: 'blur' },
                        { pattern: /^[0-9]*$/, message: '手机号格式不正确', trigger: 'blur' },
                        {validator(rule, value, callback) {
                            if (value && $self.editType == 'add'){
                                if (value.length == 11) {
                                    $self.request({
                                        url: '/systemManage/userOrgManage/validation.do',
                                        param: {
                                            phone: value
                                        }
                                    }).then((data) => {
                                        if (data) {
                                            if (data.userVo.permissionLevel == 'ORGANIZATION_LEVEL' || data.userVo.permissionLevel == 'GENERAL_USER_LEVEL') {
                                                $self.formItem = Object.assign($self.formItem, data.userVo);
                                                if (data.posts.length > 0) {
                                                    data.posts.forEach(function (item) {
                                                        $self.formItem.postIds.push(item.id);
                                                    });
                                                }
                                                $self.getPostsData(data.userVo.permissionLevel);
                                                $self.phoneIsDisabled = true;
                                                $self.userInfoDisabled = true;
                                                $self.editType = 'addToDept';
                                                $self.userTips = '该用户已存在，可以直接新增到部门下';
                                                callback();
                                            }else {
                                                callback([new Error('当前手机号对应用户权限级别超出机构管理员权限')]);
                                            }
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
                    userName:[
                        { required: true, message: '请填写用户名', trigger: 'blur' },
                        { max:20,message:'用户名不能多于20个字符'}
                    ],
                    permissionLevel:[
                        { required: true, message: '请选择岗位级别', trigger: 'blur'}
                    ]
                },
                phoneIsDisabled: false,
                userInfoDisabled: false,
                editType: 'add',
                userTips: '',
                postData: [],
                authLevel: []
            }
        },
        created: function () {
            this.getUserData();
            this.getAuthLevelData();
        },
        methods: {
            getUserData() {
                if (this.editType != 'add' || this.userId) {
                    this.phoneIsDisabled = true;
                    this.editType = 'update';
                    this.request({
                        url: "/systemManage/user/userEdit.do",
                        param: {
                            id: this.userId ? this.userId : this.formItem.id
                        }
                    }).then(data => {
                        this.formItem = Object.assign(this.formItem, data.userVo);
                        if (data.posts.length > 0) {
                            let $self = this;
                            data.posts.forEach(function (item) {
                                $self.formItem.postIds.push(item.id);
                            });
                        }
                        this.getPostsData(data.userVo.permissionLevel);
                    });
                }else {
                    if (!this.isShowUserLevelSetting) {
                        this.getPostsData('GENERAL_USER_LEVEL');
                    }else {
                        this.getPostsData();
                    }
                }
            },
            getPostsData(authLevel, key = 'no') {
                this.request({
                    url: "/systemManage/posts/getPosts.do",
                    param: {
                        orgId: this.orgId,
                        userId: this.userId ? this.userId : (this.formItem.id ? this.formItem.id : null),
                        authLevel: authLevel,
                        key: key
                    }
                }).then(data => {
                    this.formItem.postValues = data;
                });
            },
            getAuthLevelData() {
                this.request({
                    url: "/systemManage/user/accessPowerLevel.do",
                    param:{
                        key: 'yes'
                    }
                }).then(data => {
                    this.authLevel = data;
                    if (!this.isShowUserLevelSetting) {
                        this.formItem.permissionLevel = 'GENERAL_USER_LEVEL';
                    }
                });
            },
            save() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let url = '', postData = {};
                        if (this.editType == 'add'){
                            url = '/systemManage/userOrgManage/save.do';
                            postData['orgId'] = this.orgId;
                            postData['deptId'] = this.deptId;
                            postData['userVo'] = Object.assign({}, this.formItem);
                            postData['postIds'] = this.formItem.postIds;
                            delete postData['userVo'].postIds;
                            delete postData['userVo'].postValues;
                        }else if (this.editType == 'addToDept'){
                            url = 'systemManage/userOrgManage/userOrgRef.do';
                            postData['userId'] = this.formItem.id;
                            postData['orgId'] = this.orgId;
                            postData['deptId'] = this.deptId;
                        }else {
                            url = '/systemManage/user/userEditSave.do';
                            if (this.userId){
                                this.formItem['id'] = this.userId;
                            }
                            postData = this.formItem;
                        }
                        this.request({
                            url: url,
                            data: postData
                        }).then(() => {
                            this.$Message.success('提交成功!');
                            if (this.isComponent) {
                                this.cancel();
                            }else {
                                this.callback(true);
                            }
                        });
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            cancel() {
                this.$emit('on-cancel', 'user');
            },
            choosePost(id, event) {
                if (!event.constructor){
                    return;
                }
                this.$emit('change',id);
                let isChoose = arguments[1];
                if (isChoose) {
                    this.request({
                        url: "/systemManage/userOrgManage/userPostRelation.do",
                        data: {
                            userId: this.userId ? this.userId : this.formItem.id,
                            orgId: this.orgId,
                            postId: id
                        }
                    }).then(() => {
                        this.$Message.success('关联岗位成功');
                        this.callback(false);
                    });
                }else {
                    this.request({
                        url: "/systemManage/userOrgManage/removeUserPostRelation.do",
                        data: {
                            userId: this.userId ? this.userId : this.formItem.id,
                            orgId: this.orgId,
                            postId: id
                        }
                    }).then(() => {
                        this.$Message.success('删除岗位关联成功');
                        this.callback(false);
                    });
                }
            },
            choosePermissionLevel(val) {
                this.getPostsData(val);
            },
            resetForm() {
                this.phoneIsDisabled = false;
                this.userInfoDisabled = false;
                this.editType = 'add';
                this.userTips = '';
                this.formItem = {
                    realName: '',
                    phone: '',
                    userName: '',
                    sex: '1',
                    postIds: [],
                    postValues: [],
                    permissionLevel: 'GENERAL_USER_LEVEL'
                };
            }
        }
    }
</script>

<style scoped>
    .userAddWrap form {
        padding-top: 15px;
    }
    .userAddWrap .reset-form {
        border: 0;
        padding: 2px 0;
        margin: 0 20px;
        color: #59b399;
        line-height: 1;
        border-radius: 0;
        border-bottom: 1px solid;
    }

    .userAddWrap >>> .ivu-form-item-error-tip {
        white-space: nowrap;
    }
</style>