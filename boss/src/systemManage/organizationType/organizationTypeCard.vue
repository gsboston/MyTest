<template>
    <div style="padding: 15px 50px;">
        <Form ref="form" :model="item" :label-width="80" :rules="ruleValidate">
            <Form-item label="编码" prop="code">
                <Input v-model="item.code" placeholder="请输入编码"/>
            </Form-item>
            <Form-item label="名称" prop="name">
                <Input v-model="item.name" placeholder="请输入名称"/>
            </Form-item>
            <Form-item label="介绍" prop="describe">
                <Input v-model="item.describe" type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="请输入..."/>
            </Form-item>
            <FormItem style="float: right;">
                <Button @click="save">保存</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    export default {
        data () {
            let $self = this;
            return {
                item: {},
                ruleValidate: {
                    name: [
                        {required: true, type: 'string', message: '组织类型名称不能为空', trigger: 'blur'},
                        {max: 20, message: '组织类型名称不能多于20个字符'}
                    ],
                    code: [
                        {required: true, message: '组织类型编码不能为空', trigger: 'change'},
                        {max: 20, message: '组织类型编码不能多于20个字符'},
                        {validator(rule, value, callback) {
                            $self.request({
                                url: '/systemManage/organizationType/checkCode.do',
                                param: {
                                    id: $self.item.id,
                                    code: value
                                }
                            }).then((data) => {
                                if (!data) {
                                    callback([new Error('组织类型编码已存在')]);
                                }else {
                                    callback();
                                }
                            });
                        }}
                    ],
                    describe:[
                        {max: 500, message: '组织类型介绍不能多于500个字符',trigger: 'blur'}
                    ]
                },
            }
        },
        props: {
            id: null
        },
        created: function () {
            if (this.id) {
                this.request({
                    url: "/systemManage/organizationType/info.do",
                    param: {
                        orgTypeId: this.id
                    }
                }).then((data) => {
                    this.item = data;
                });
            }
        },
        methods: {
            save: function () {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        let _url = '';
                        if (this.id) {
                            _url = '/systemManage/organizationType/update.do';
                        }else {
                            _url = '/systemManage/organizationType/save.do';
                        }
                        this.request({
                            url: _url,
                            data: this.item
                        }).then(() => {
                            this.$Message.success('提交成功!');
                            this.callback(true);
                        });
                    } else {
                        this.$Message.error("表单验证失败！");
                    }
                })
            }
        }
    };
</script>