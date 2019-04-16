<template>
    <Row style="padding: 15px 30px;">
        <div style="font-size: 18px">{{item.orgTypeDict.name}}</div>
        <div>已使用账套数：{{count}}</div>
        <Form ref="form" :model="item" :label-width="0">
            <FormItem prop="totalNums" :rules="[{required: true, message: '请输入账套总量'}]">
                <Input v-model="item.totalNums" placeholder="输入账套总量" :maxlength="12"/>
            </FormItem>
            <div style="color: #878787">套餐总量需大于已使用账套数</div>
            <FormItem style="float: right;">
                <Button type="primary" @click="save()">保存</Button>
            </FormItem>
        </Form>
    </Row>
</template>

<script>
    export default {
        props: {item: null},
        data: function () {
            return {
                count: 0,
                packageLengthList: []
            }
        },
        created: function () {
            this.item.totalNums = '';
            this.item.packageTypes = '';
            this.getCount();
            this.getExpressName();
        },
        methods: {
            getCount() {
                this.request({
                    url: '/getHttpOtherPlatform.do',
                    data: {
                        url: '/api/wechat/getOrgByParam.do',
                        orgId: this.item.orgId
                    }
                }).then(res => {
                    if (JSON.parse(res).data.numberOfUsed) {
                        this.count = JSON.parse(res).data.numberOfUsed;
                    }
                })
            },
            getExpressName() {
                this.request({
                    url: "/tcgl/getKeyBook.do",
                    param: {
                        type: 'packageLength',
                    }
                }).then(data => {
                    this.packageLengthList = data;
                });
            },
            save: function () {
                if (this.item.totalNums < this.count) {
                    this.$Message.error('套餐总量需大于已使用账套数');
                    return;
                }
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.request({
                            url: "/zhzt/modifier.do",
                            data: {
                                'id': this.item.id,
                                'userId': window.Context.getCurrentUser().id,
                                'totalNum': this.item.totalNums,
                                'userName': window.Context.getCurrentUser().realName
                            },
                        }).then(data => {
                            this.$Message.success('设置成功!');
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