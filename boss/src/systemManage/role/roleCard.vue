<style scoped>
    .roleCard{
        padding: 20px;
    }
    .roleCard-btn{
        text-align: right;
    }
</style>
<template>
    <div class="roleCard">
        <Row>
            <Form ref="roleData" :rules="ruleForm" :model="roleData" label-position="right" :label-width="80">
                <Form-item label="角色编码" prop="code">
                    <Input v-model="roleData.code"></Input>
                </Form-item>
                <Form-item label="角色名称" prop="name">
                    <Input v-model="roleData.name"></Input>
                </Form-item>
                <Form-item  label="描述" prop="describe">
                    <Input type="textarea" v-model="roleData.describe"></Input>
                </Form-item>
            </Form>
        </Row>
        <br>
        <Row class="roleCard-btn">
            <Button @click="save" :disabled="isSaving">保存</Button>
        </Row>

    </div>
</template>

<script>
    export default {
        props:{
            roleData: {
                type: Object,
                default: function() {
                    return {
                    };
                }
            }
        },
        data: function() {
            return {
                ruleForm: {
                    name:[
                        { required: true, message: '角色名称不能为空', trigger: 'blur' },
                        { max: 20, message: '角色名称不能多于20个字符'},
                    ],
                    code: [
                        { required: true, message: '角色编码不能为空', trigger: 'blur' },
                        { max: 20, message: '角色编码不能多于20个字符'},
                    ],
                    describe:[
                        {max: 500, message: '角色描述不能多于500个字符', trigger: 'blur' }
                    ]
                },
                isSaving: false
            };
        },
        created: function() {

        },
        methods: {
            save:function(){
                this.isSaving = true;
                this.$refs['roleData'].validate((valid) => {
                    if (valid) {
                        this.request({
                            url: "/systemManage/role/add.do",
                            data:this.roleData
                        }).then(() => {
                            this.callback(this.roleData.name);
                        });
                    } else {
                        this.isSaving = false;
                        this.$Message.error('表单验证失败!');
                    }
                })
            }
        }
    };
</script>

