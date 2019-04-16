<template>
    <Row style="padding: 15px 30px;">
        <div>{{item.orgName}}</div>
        <div>机构编码：{{item.orgCode}}</div>
        <Form ref="item" :model="item" :rules="itemValidate" :label-width="0">
            <FormItem prop="code">
                <Input v-model="item.code" placeholder="请输入发票代码" :maxlength="12"/>
            </FormItem>
            <FormItem prop="no">
                <Input v-model="item.no" placeholder="请输入发票号码" :maxlength="8"/>
            </FormItem>
            <Form-item>
                <RadioGroup v-model="state">
                    <Radio label="1">快递</Radio>
                    <Radio label="0">自取</Radio>
                </RadioGroup>
            </Form-item>
            <FormItem prop="expressName" v-if="state==1">
                <Select v-model="item.expressName" placeholder="请选择快递公司">
                    <Option v-for="level in expressNameList" :value="level.name" :key="level.value">{{ level.name }}</Option>
                </Select>
            </FormItem>
            <FormItem prop="trackingNo" v-if="state==1">
                <Input v-model="item.trackingNo" placeholder="请输入快递单号" :maxlength="40"/>
            </FormItem>
            <FormItem style="float: right;">
                <Button type="primary" @click="save('item')">保存</Button>
            </FormItem>
        </Form>
    </Row>
</template>

<script>
    export default {
        props: {item: null},
        data: function () {
            return {
                state: 1,
                expressNameList: [],
                itemValidate: {
                    code: [
                        {required: true, message: '请输入发票代码', trigger: 'blur'}
                    ],
                    no: [
                        {required: true, message: '请输入发票号码', trigger: 'blur'}
                    ],
                    expressName: [
                        {required: true, message: '请选择快递公司', trigger: 'blur'}
                    ],
                    trackingNo: [
                        {required: true, message: '请输入快递单号', trigger: 'blur'}
                    ]
                },
            }
        },
        created: function () {
            this.getExpressName();
        },
        methods: {
            getExpressName() {
                this.request({
                    url: "/tcgl/getKeyBook.do",
                    param: {
                        type: 'expressName',
                    }
                }).then(data => {
                    this.expressNameList = data;
                });
            },
            save: function (name) {
                if (this.state == 0) {
                    this.item.expressName = '';
                    this.item.trackingNo = '';
                }
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.request({
                            url: "/kpgl/save.do",
                            data: {
                                'id': this.item.id,
                                'code': this.item.code,
                                'no': this.item.no,
                                'expressName': this.item.expressName,
                                'trackingNo': this.item.trackingNo
                            },
                        }).then(data => {
                            this.$Message.success('发送成功!');
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