<style scoped>
    .categoryCard{
        padding: 20px;
    }
    .categoryCard-btn{
        text-align: right;
    }
</style>
<template>
    <div class="categoryCard">
        <Row>
            <Form ref="categoryData" :rules="ruleForm" :model="categoryData" label-position="right" :label-width="120">
                <Form-item label="档案分类名称" prop="name">
                    <Input v-model="categoryData.name">
                    </Input>
                </Form-item>
                <Form-item label="编码" prop="code">
                    <Input v-model="categoryData.code">
                    </Input>
                </Form-item>
                <Form-item  label="描述" prop="describe">
                    <Input type="textarea" v-model="categoryData.describe">
                    </Input>
                </Form-item>
                <Form-item  label="是否系统预置" prop="ifPreset">
                    <Checkbox v-model="categoryData.ifPreset"></Checkbox>
                </Form-item>
                <Form-item  label="是否树形结构" prop="ifTree">
                    <Checkbox v-model="categoryData.ifTree"></Checkbox>
                </Form-item>
            </Form>
        </Row>
        <br>
        <Row class="categoryCard-btn">
            <Button @click="save">保存</Button>
        </Row>

    </div>
</template>

<script>
    export default {
        name:'bdCard',
        props:{
            categoryData: {
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
                        { required: true, message: '名称不能为空', trigger: 'blur' },
                        { max: 20, message: '名称不能多于20个字符'}
                    ],
                    code: [
                        { required: true, message: '编码不能为空', trigger: 'blur' },
                        { max: 20, message: '编码不能多于20个字符'}
                    ],
                    describe:[
                        { max: 500, message: '描述不能多于500个字符'}
                    ]
                }
            };
        },
        created: function() {

        },
        methods: {
            save:function(){
                this.$refs.categoryData.validate(valid => {
                    if (valid) {
                        this.request({
                            url: "/systemManage/bd/saveCategory.do",
                            data: this.categoryData
                        }).then(data => {
                            this.callback();
                        },error => {
                            this.$Message.error("保存失败");
                        });
                    }
                });
            }
        }
    };
</script>

