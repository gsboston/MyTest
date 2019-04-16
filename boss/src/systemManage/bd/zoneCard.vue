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
                <Form-item label="战区名称" prop="name">
                    <Input v-model="itemData.name">
                    </Input>
                </Form-item>
                <Form-item label="战区编码" prop="code">
                    <Input v-model="itemData.code">
                    </Input>
                </Form-item>
                <Form-item  label="战区描述" prop="describe">
                    <Input type="textarea" v-model="itemData.describe" :rows="4">
                    </Input>
                </Form-item>
            </Form>
        </Row>
        <br>
        <Row class="itemCard-btn">
            <Button @click="save">保存</Button>
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
            }
        },
        data: function() {
            return {
                ruleForm: {
                    name:[
                        { required: true, message: '名称不能为空' },
                        { max: 20, message: '名称不能多于20个字符'}
                    ],
                    code:[
                        { required: true, message: '编码不能为空' },
                        { max: 20, message: '编码不能多于20个字符'}
                    ],
                    describe: [
                        { max: 500, message: '描述不能多于500个字符'}
                    ]
                }
            };
        },
        created: function() {
        },
        methods: {
            save:function(){
                this.$refs.itemData.validate(valid => {
                    if (valid) {
                        this.request({
                            url: "/systemManage/zoneMgr/saveZone.do",
                            data: this.itemData
                        }).then(data => {
                            this.$Message.info("保存成功");
                            if(this.callback)
                                this.callback();
                        });
                    }
                });
            }
        }
    };
</script>

