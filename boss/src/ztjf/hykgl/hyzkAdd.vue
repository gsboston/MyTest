<template>
    <Row style="padding: 15px 30px;">
        <div v-if="isShow">
            <div style="font-size: 16px"><label>{{item.name}}</label></div>
            <div style="font-size: 12px"><label>{{item.typeDict.name}}</label></div>
            <div style="font-size: 12px;color: #999999"><label>未制卡数：{{item.newNum}}</label></div>
            <Form ref="item" :model="item" :rules="itemValidate" :label-width="0">
                <FormItem prop="total">
                    <Input v-model="item.total" placeholder="请输入制卡数量"/>
                </FormItem>
                <FormItem style="float: right;">
                    <Button type="primary" @click="save('item')">确定</Button>
                </FormItem>
            </Form>
        </div>
        <div v-if="!isShow">
            <Alert show-icon>点击下载按钮即可下载制卡Excel表格文件</Alert>
            <div class="ivu-upload" @click="downloadCard()">
                <div class="ivu-upload ivu-upload-drag">
                    <div style="padding: 20px 0px;"><i class="ivu-icon ivu-icon-ios-cloud-download-outline" style="font-size: 52px; color: rgb(51, 153, 255);"></i>
                        <p>点击下载制卡Excel表格文件</p></div>
                </div>
            </div>
        </div>
    </Row>
</template>

<script>
    export default {
        props: {item: null},
        data: function () {
            return {
                isShow: true,
                serialNo: '',
                data: {},
                itemValidate: {
                    total: [
                        {required: true, message: '请输入制卡数量', trigger: 'blur'},
                        {pattern: /^[1-9]\d*$/, message: '制卡数量必须为整数', trigger: 'blur'},
                    ]
                },
            }
        },
        created: function () {
            this.item.total = '';
        },
        methods: {
            save: function (name) {
                if (this.item.total > this.item.newNum) {
                    this.$Message.error('剩余卡号不足以制卡，请先到“管理”界面生成卡号');
                    return;
                }
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.data.userId = window.Context.getCurrentUser().id;
                        this.data.total = this.item.total;
                        this.data.cardId = this.item.id;
                        this.request({
                            url: "/hykgl/getPrint.do",
                            param: {
                                userId: this.data.userId,
                                cardId: this.data.cardId,
                                total: this.data.total
                            }
                        }).then(res => {
                            this.serialNo = res.serialNo;
                            this.isShow = false;
                            this.callback();
                        });
                    } else {
                        this.$Message.error("表单验证失败！");
                    }
                });
            },
            downloadCard() {
                this.request({
                    url: "/hykgl/getHost.do"
                }).then(res => {
                    const a = document.createElement('a');
                    const objectUrl = '/ztjf-api/ztjf/free/vipcard/ztjfVipCardRecord/printExport?serialNo=' + this.serialNo;
                    document.body.appendChild(a);
                    a.setAttribute('style', 'display:none');
                    a.setAttribute('href', objectUrl);
                    a.setAttribute('download', this.item.name + ".xls");
                    a.click();
                    URL.revokeObjectURL(objectUrl);
                });
            }
        }
    };
</script>