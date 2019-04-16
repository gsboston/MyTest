<style scoped>
    .dutyCard{
        padding: 20px;
    }
    .dutyCard-btn{
        text-align: right;
    }
</style>
<template>
    <div class="dutyCard">
        <Row>
            <Form ref="dutyData" :rules="ruleForm" :model="dutyData" label-position="right" :label-width="80">
                <Form-item label="职责编码" prop="code">
                    <Input v-model="dutyData.code"></Input>
                </Form-item>
                <Form-item label="职责名称" prop="name">
                    <Input v-model="dutyData.name"></Input>
                </Form-item>
                <Form-item  label="描述" prop="describe">
                    <Input type="textarea" v-model="dutyData.describe"></Input>
                </Form-item>
            </Form>
        </Row>
        <br>
        <Row class="dutyCard-btn">
            <Button @click="save" :disabled="isSaving">保存</Button>
        </Row>

    </div>
</template>

<script>
    export default {
        props:{
            dutyData: {
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
                        { required: true, message: '职责名称不能为空', trigger: 'blur' },
                        { max: 20, message: '职责名称不能多于20个字符'},
                    ],
                    code: [
                        { required: true, message: '职责编码不能为空', trigger: 'blur' },
                        { max: 20, message: '职责编码不能多于20个字符'},
                    ],
                    describe:[
                        {max: 500, message: '职责描述不能多于500个字符'}
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
                this.$refs['dutyData'].validate((valid) => {
                    if (valid) {
                        this.request({
                            url: "/systemManage/duty/save.do",
                            data:this.dutyData
                        }).then(data => {
                            this.callback(this.dutyData.name);
                        });
                    }else {
                        this.isSaving = false;
                        this.$Message.error('表单验证失败!');
                    }

                })
            }




        }
    };
</script>

