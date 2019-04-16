<style scoped>
.root{
    padding: 20px;
}
.title-text{
    font-size: 18px;
    font-weight: bold;
}
</style>

<template>
    <div class="root">
        <div class="title"><span class="title-text">派单岗位基本信息</span></div>
        <br>
        <div>
            <Form ref="servicePostForm" :model="servicePost" :rules="ruleForm" label-position="right"  :label-width="100">
                <Row>
                    <FormItem label="岗位编码" prop="code">
                        <Input :maxlength="50"  type="text" v-model="servicePost.code" placeholder="岗位编码">
                        </Input>
                    </FormItem>
                    <FormItem label="岗位名称" prop="name">
                        <Input :maxlength="50"  type="text" v-model="servicePost.name" placeholder="岗位名称">
                        </Input>
                    </FormItem>
                </Row>
                <!--<Row>-->
                    <!--<FormItem label="是否启用" prop="state">-->
                        <!--<RadioGroup v-model="servicePost.state">-->
                            <!--<Radio label="ENABLE">启用</Radio>-->
                            <!--<Radio label="DISABLED">停用</Radio>-->
                        <!--</RadioGroup>-->
                    <!--</FormItem>-->
                <!--</Row>-->
                <Row>
                    <FormItem label="备注">
                        <Input :maxlength="500"  type="textarea" v-model="servicePost.remark" :rows="3">
                        </Input>
                    </FormItem>
                </Row>
                <br>
                <Row style="float: right">
                    <Button type="ghost" @click="save">保存</Button>
                </Row>
            </Form>
        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        props:{
            servicePost:{
                state:'ENABLE'
            }
        },
        data () {
            return {
                ruleForm:{
                    code: [
                        { required: true, message: '该项不能为空',trigger: 'change' },
                        { pattern:  /^[A-Za-z0-9]+$/ ,message:'只能是英文或者数字',trigger: 'change' }
                    ],
                    name: [
                        {required: true, message: '该项不能为空',trigger: 'change' }
                    ]
                }
            }
        },
        created: function () {
        },
        methods: {
           save(){
               this.$refs['servicePostForm'].validate((valid)=>{
                   if (valid) {
                       this.request({
                           url: "/systemManage/serviceSend/savePost.do",
                           data:this.servicePost
                       }).then(data => {
                           this.$Message.info("保存成功");
                           this.callback();
                       });
                   }else{
                       this.$Message.error({content:"信息项录入不完整，请完善后再提交！",duration:3});
                   }
               });
           }
        }
    };
</script>

