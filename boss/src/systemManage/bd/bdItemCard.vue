<style scoped>
    .itemCard{
        padding: 20px;
    }
    .itemCard-btn{
        text-align: right;
    }
</style>
<template>
    <div class="itemCard">
        <Row>
            <Form ref="itemData" :rules="ruleForm" :model="itemData" label-position="right" :label-width="120">
                <Form-item label="档案分类名称" prop="categoryName">
                    <p><span>{{categoryName}}</span></p>
                </Form-item>
                <Form-item v-if="ifTree&&!view" label="父级档案">
                    <Input disabled v-model="parentName">
                    </Input>
                </Form-item>
                <Form-item label="档案名称" prop="name">
                    <Input :disabled="ifPreset" v-model="itemData.name">
                    </Input>
                </Form-item>
                <Form-item label="编码" prop="code">
                    <Input :disabled="ifPreset" v-model="itemData.code">
                    </Input>
                </Form-item>
                <Form-item  label="描述" prop="describe">
                    <Input :disabled="ifPreset" type="textarea" v-model="itemData.describe" :rows="4">
                    </Input>
                </Form-item>
            </Form>
        </Row>
        <br>
        <Row class="itemCard-btn">
            <Button :disabled="ifPreset" @click="save">保存</Button>
        </Row>

    </div>
</template>

<script type="text/babel">
    export default {
        props:{
            itemData: {
                type: Object,
                default: function() {
                    return {
                    };
                }
            },
            categoryId:undefined,
            categoryName:"",
            ifTree:false,
            ifPreset:false,
            parentId:'',
            parentName:'',
            view:false
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
                    describe: [
                        { max: 500, message: '描述不能多于500个字符'}
                    ]
                }
            };
        },
        created: function() {
            if (this.categoryId){
                this.itemData.categoryId = this.categoryId;
            }
            if(this.parentId!=''){
                this.itemData.parentId = this.parentId;
            }
        },
        methods: {
            save:function(){
                this.$refs.itemData.validate(valid => {
                    if (valid) {
                        this.request({
                            url: "/systemManage/bd/saveItem.do",
                            data: this.itemData
                        }).then(data => {

                            if(this.callback)
                                this.callback();
                            else
                                this.$emit("callback");
                        },error => {
                            this.$Message.error("保存失败");
                        });
                    }
                });
            }
        }
    };
</script>

