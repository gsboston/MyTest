<template>
    <Row style="padding: 15px 30px;">
        <div style="font-size: 16px"><label>{{item.name}}</label></div>
        <div style="font-size: 12px"><label>{{item.typeDict.name}}</label></div>
        <Form ref="item" :model="item" :rules="itemValidate" :label-width="0">
            <FormItem prop="total">
                <Input v-model="item.total" placeholder="输入需要生成卡号数量"/>
            </FormItem>
            <FormItem style="float: right;">
                <Button type="primary" @click="save('item')">生成</Button>
            </FormItem>
        </Form>
    </Row>
</template>

<script>
    export default {
        props: {item: null},
        data: function () {
            return {
                data: {},
                itemValidate: {
                    total: [
                        {required: true, message: '输入需要生成卡号数量', trigger: 'blur'},
                        {pattern: /^[1-9]\d*$/, message: '卡号数量必须为整数', trigger: 'blur'},
                    ]
                },
            }
        },
        created: function () {
            this.item.total = '';
        },
        methods: {
            save: function (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.data.userId = window.Context.getCurrentUser().id;
                        this.data.total = this.item.total;
                        this.data.cardId = this.item.id;
                        this.request({
                            url: "/hykgl/generate.do",
                            data: this.data,
                        }).then(res => {
                            this.$Message.success('生成成功!');
                            this.callback();
                        }, error => {
                            this.$Message.error(error.message);
                        });
                    } else {
                        this.$Message.error("表单验证失败！");
                    }
                });
            },
        }
    };
</script>