<template>
    <div id="userAddId" class="userAddWrap">
        <i-form :model="formItem" :label-width="80" inline :rules="ruleInline" ref="formItem"  >
            <Form-item label="账号" prop="realName">
                <i-input :value="formItem.realName"  v-model="formItem.realName" placeholder="请输入" style="width:200px"></i-input>

            </Form-item>
            <Form-item label="密码"  prop="password">
                <i-input :value="formItem.password" v-model="formItem.password" placeholder="请输入" style="width:200px"></i-input>
            </Form-item>
            <Form-item label="姓名" prop="userName">
                <i-input :value="formItem.userName" v-model="formItem.userName" placeholder="请输入" style="width:200px"></i-input>
            </Form-item>
            <Form-item label="单选框">
                <Radio-group v-model="formItem.sex">
                    <Radio label="1" >男</Radio>
                    <Radio label="0">女</Radio>
                </Radio-group>
            </Form-item>
            <Form-item label="岗位信息">
                <CheckboxGroup v-model="formItem.checkboxId" style="text-align: center">
                    <Checkbox  v-for="item in formItem.checkboxLabel " :label="item.id" :key="item.id">{{item.name}}</Checkbox>
                </CheckboxGroup>
            </Form-item>
            <Row>
                <Form-item>
                    <i-button type="primary"  @click="addSubmit('formItem')">保存</i-button>
                </Form-item>
            </Row>
        </i-form>
    </div>
</template>

<script>
    export default {
        props: {
            orgId:null,  //组织id
            deptId:null  //部门id
        },
        data () {
            return {
                formItem: {
                    realName: '',
                    password:'',
                    userName:'',
                    sex:'1',
                    checkboxLabel:[],
                    checkboxId:[]
                },
                ruleInline: {
                    realName: [
                        { required: true, message: '请填写账号', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请填写密码', trigger: 'blur' },
                        { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
                    ],
                    userName:[
                        { required: true, message: '请填写姓名', trigger: 'blur' }
                    ]
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
                                orgId:this.orgId,
                                deptId:this.deptId,
                                realName: this.formItem.realName,
                                password: this.formItem.password,
                                userName:this.formItem.userName,
                                sex:this.formItem.sex,
                                postIds:this.formItem.checkboxId
                            }
                        }).then(() => {
                            this.$Message.success('提交成功!');
                            this.callback();
                        }, error => {
                            this.$Modal.error({
                                title: '温馨提示',
                                content: "121"
                            });
                        });

                        this.$Message.success('提交成功!');
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            }
        },
        created:function(){
            this.request({
                url: "/systemManage/user/userPost.do",
                param: {
                    orgId:this.orgId,
                }
            }).then(items => {
                this.formItem.checkboxLabel =items
            })

        }
    }
</script>

<style scoped>
    .userAddWrap{
        width: 600px;
        margin: 25px auto;
    }

</style>