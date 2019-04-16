<template>
    <div id="userAddId" class="userAddWrap">
        <Form :model="formItem" :label-width="80" :rules="ruleInline" ref="formItem">
            <Row>
                <i-col span="11">
                    <Form-item label="用户名" prop="userName">
                        <Input v-if="id" disabled v-model="formItem.userName" placeholder="请输入用户名" ></Input>
                        <Input v-else  v-model="formItem.userName" placeholder="请输入用户名" ></Input>
                    </Form-item>
                </i-col>
                <i-col span="11" offset="1">
                    <Form-item label="姓名" prop="realName">
                        <Input  v-model="formItem.realName" placeholder="请输入名称" ></Input>
                    </Form-item>
                </i-col>
            </Row>
            <!--<i-col span="11">-->
                <!--<Form-item label="手机号"  prop="phone" >-->
                    <!--<Input :value="formItem.phone" v-model="formItem.phone" placeholder="请输入手机号"></Input>-->
                <!--</Form-item>-->
            <!--</i-col>-->
            <Row>
                <i-col span="11">
                    <Form-item label="性别">
                        <Radio-group v-model="formItem.sex">
                            <Radio label="1" >男</Radio>
                            <Radio label="0">女</Radio>
                        </Radio-group>
                    </Form-item>
                </i-col>
                <i-col span="11" offset="1">
                    <Form-item label="权限级别" prop="postLevel">
                        <Select v-if="!id" v-model="formItem.postLevel" disabled>
                            <Option  value="ORGANIZATION_LEVEL">机构管理员</Option>
                        </Select>
                        <Select v-else v-model="formItem.postLevel" disabled>
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
            id: null,
            param:{}
        },
        watch: {
            id(value) {
                this.id = value;
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
                    postLevel:''
                },
                levelItem:[],
                ruleInline: {
                    userName:[
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { validator(rule, value, callback) {
                                if (value){
                                    if (value.length <= 20) {
                                        callback();
                                    }else {
                                        callback(new Error('用户名长度限制为20个字符'));
                                    }
                                }else {
                                    callback();
                                }
                            }}
                    ],
                    realName: [
                        { required: true, message: '请输入姓名', trigger: 'blur' },
                        { validator(rule, value, callback) {
                                if (value){
                                    if (value.length <= 10) {
                                        callback();
                                    }else {
                                        callback(new Error('姓名长度限制为10个字符'));
                                    }
                                }else {
                                    callback();
                                }
                            }}
                    ],
                    phone: [
                        {required: true, message: '请输入手机号', trigger: 'blur' },
                        {pattern: /^[0-9]*$/, message: '手机号格式不正确', trigger: 'blur' },
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
                    postLevel: [
                        { required: true, message: '请选择权限级别', trigger: 'change' }
                    ],

                }
            }
        },
        methods: {
            getInfo(){
                if (this.id) {
                    this.request({
                        url: "/systemManage/org/orgEdit.do",
                        param: {
                            id: this.id
                        }
                    }).then(item => {
                        item.userVo.sex = item.userVo.sex + "";
                        this.formItem = item.userVo;
                    })
                }
            },
            getOrgList(){
                if(this.id){
                    this.request({
                        url: "/systemManage/orgManager/orgList.do",
                    }).then(item => {
                        console.log(item)
                        this.levelItem = item;
                        this.formItem.postLevel = item[0].value;
                    })
                }
            },
            addSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let _url = '';
                        if(this.id){
                            this.request({
                                url: "/systemManage/user/userEditSave.do",
                                data: {
                                    realName: this.formItem.realName,
                                    phone: this.formItem.phone,
                                    userName:this.formItem.userName,
                                    sex:this.formItem.sex,
                                    permissionLevel:this.formItem.permissionLevel,
                                    id:this.id
                                }
                            }).then(() => {
                                this.$Message.success('提交成功!');
                                this.callback(true);
                            });
                        }else{
                            this.request({
                                url: "/systemManage/organization/orgSave.do",
                                data: {
                                    realName: this.formItem.realName,
                                    phone: this.formItem.phone,
                                    userName:this.formItem.userName,
                                    sex:this.formItem.sex,
                                    permissionLevel:this.formItem.postLevel,
                                    loginOrgId:this.param.orgId
                                }
                            }).then(() => {
                                this.$Message.success('提交成功!');
                                this.callback(true);
                            });
                        }

                    } else {
//                        this.$Message.error('表单验证失败!');
                    }
                })
            },
        },
        created:function(){
           this.formItem.postLevel = 'ORGANIZATION_LEVEL';
           this.getInfo();
           this.getOrgList();
        },
    }
</script>

<style scoped>
    .userAddWrap{
        width: 100%;
        margin: 25px auto;
    }

</style>