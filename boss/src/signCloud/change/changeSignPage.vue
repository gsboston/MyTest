<style scoped>
    .container {
        background: white;
    }
</style>

<template>
    <div class="container">
        <Row>
            <span style="font-size: 18px;font-weight: bold;margin-left: 20px;">确认签署信息</span>
            <span style="font-size: 16px;float: right; margin-right: 50px">创建 {{changeInfo.signedDate | formatDate}}</span>
        </Row>
        <div style="width: 100%;margin-top: 15px">
            <div style="background-color: #e5e5e5;height: 30px;line-height: 30px;margin: 0 auto;width: 920px;cursor: pointer;"  @click="showChangeInfo">
                <div style="width: 20px;display: inline-block">
                    <Icon v-if="!isShowChangeInfo" type="chevron-right" style="color: #59b399;font-size: 16px;margin-left: 20px"></Icon>
                    <Icon v-if="isShowChangeInfo" type="chevron-down" style="color: #59b399;font-size: 16px;margin-left: 20px"></Icon>
                </div>
                <span v-if="this.changeInfo.alertType =='CONTENT'" style="font-size: 14px;margin-left: 20px;display: inline-block">内容变更详情</span>
                <span v-if="this.changeInfo.alertType =='SUBJECT'" style="font-size: 14px;margin-left: 20px;display: inline-block">主体变更详情</span>
            </div>
            <div v-if="isShowChangeInfo">
                <ContentChange v-if="this.changeInfo.alertType =='CONTENT'" :contractId="this.contractId" :changeContractId="this.changeInfo.id" :isEdited="false"></ContentChange>
                <SubjectChange v-if="this.changeInfo.alertType =='SUBJECT'" :contractId="this.contractId" :changeContractId="this.changeInfo.id" :isEdited="false"></SubjectChange>
            </div>
        </div>
        <div style="width: 100%;margin-top: 15px">
            <div style="margin: 0 auto;width: 920px">
                <Form ref="form" :label-width="80">
                    <!-- 甲方 -->
                    <i-col span="11" v-if="subjectsData.length>0" style="margin-bottom: 10px">
                        <Card style="border: 1px solid #e5e5e5" :bordered="false">
                            <p slot="title">甲方</p>
                            <Form-item label="甲方">
                                <Input v-model="subjectsData[0].name" disabled/>
                            </Form-item>
                            <Form-item label="负责人">
                                <Input v-model="subjectsData[0].legalName" placeholder="请输入负责人" :maxlength="20" disabled/>
                            </Form-item>
                            <Form-item label="电话">
                                <Input v-model="subjectsData[0].legalPhone" placeholder="请输入电话" :maxlength="11" disabled/>
                            </Form-item>
                            <Form-item label="签约日期">
                                <DatePicker v-model="subjectsData[0].signedDate" type="date" placement="top-start" placeholder="请选择签约日期" style="width: 100%" @on-change="signedDateChange(0, $event)"></DatePicker>
                            </Form-item>
                        </Card>
                    </i-col>
                    <!-- 主体变更 的中间 -->
                    <i-col span="2" v-if="subjectsData.length > 2 && changeInfo.alertType == 'SUBJECT'" style=" text-align: center;color: #59b399;font-size: 30px;margin-top: 110px;">
                        <Icon type="arrow-right-a"></Icon>
                        <div style="color: #999999;font-size: 14px">
                            <span>变更为</span>
                        </div>
                    </i-col>
                    <!-- 内容变更 的中间 -->
                    <i-col span="2" v-else>
                        <div style="width: 10px;height: 10px">

                        </div>
                    </i-col>
                    <!-- 内容变更的乙方 -->
                    <i-col span="11" v-if="subjectsData.length>1 && changeInfo.alertType == 'CONTENT'" style="margin-bottom: 10px">
                        <Card style="border: 1px solid #e5e5e5" :bordered="false">
                            <p slot="title">乙方</p>
                            <Form-item label="乙方">
                                <Input v-model="subjectsData[1].name" disabled/>
                            </Form-item>
                            <Form-item label="负责人">
                                <Input v-model="subjectsData[1].legalName" placeholder="请输入负责人" :maxlength="20" disabled/>
                            </Form-item>
                            <Form-item label="电话">
                                <Input v-model="subjectsData[1].legalPhone" placeholder="请输入电话" :maxlength="11" disabled/>
                            </Form-item>
                            <Form-item label="签约日期">
                                <DatePicker v-model="subjectsData[1].signedDate" type="date" placement="top-start" placeholder="请选择签约日期" style="width: 100%" @on-change="signedDateChange(1, $event)"></DatePicker>
                            </Form-item>
                        </Card>
                    </i-col>
                    <!-- 内容变更的丙方 -->
                    <i-col span="11" v-if="subjectsData.length > 2 && changeInfo.alertType == 'CONTENT'" style="margin-bottom: 10px">
                        <Card style="border: 1px solid #e5e5e5" :bordered="false">
                            <p slot="title">丙方</p>
                            <Form-item label="丙方">
                                <Input v-model="subjectsData[2].name" disabled/>
                            </Form-item>
                            <Form-item label="负责人">
                                <Input v-model="subjectsData[2].contactName" placeholder="请输入负责人" :maxlength="20"/>
                            </Form-item>
                            <Form-item label="电话">
                                <Input v-model="subjectsData[2].contactPhone" placeholder="请输入电话" :maxlength="11"/>
                            </Form-item>
                            <Form-item label="签约日期">
                                <DatePicker v-model="subjectsData[2].signedDate" type="date" placement="top-start" placeholder="请选择签约日期" style="width: 100%" @on-change="signedDateChange(2, $event)"></DatePicker>
                            </Form-item>
                        </Card>
                    </i-col>
                    <!-- 主体变更的丙方 -->
                    <i-col span="11" v-if="subjectsData.length > 2 && changeInfo.alertType == 'SUBJECT'" style="margin-bottom: 10px">
                        <Card style="border: 1px solid #e5e5e5" :bordered="false">
                            <p slot="title">丙方</p>
                            <Form-item label="丙方">
                                <Input v-model="subjectsData[2].name" disabled/>
                            </Form-item>
                            <Form-item label="负责人">
                                <Input v-model="subjectsData[2].contactName" placeholder="请输入负责人" :maxlength="20" disabled/>
                            </Form-item>
                            <Form-item label="电话">
                                <Input v-model="subjectsData[2].contactPhone" placeholder="请输入电话" :maxlength="11" disabled/>
                            </Form-item>
                            <Form-item label="签约日期">
                                <DatePicker v-model="subjectsData[2].signedDate" type="date" placement="top-start" placeholder="请选择签约日期" style="width: 100%" @on-change="signedDateChange(2, $event)"></DatePicker>
                            </Form-item>
                        </Card>
                    </i-col>
                    <!-- 主体变更的乙方 -->
                    <i-col span="11" v-if="subjectsData.length>1 && changeInfo.alertType == 'SUBJECT'">
                        <Card style="border: 1px solid #e5e5e5" :bordered="false">
                            <p slot="title">乙方</p>
                            <Form-item label="乙方">
                                <Input v-model="subjectsData[1].name" disabled/>
                            </Form-item>
                            <Form-item label="负责人">
                                <Input v-model="subjectsData[1].legalName" placeholder="请输入负责人" :maxlength="20" disabled/>
                            </Form-item>
                            <Form-item label="电话">
                                <Input v-model="subjectsData[1].legalPhone" placeholder="请输入电话" :maxlength="11" disabled/>
                            </Form-item>
                            <Form-item label="签约日期">
                                <DatePicker v-model="subjectsData[1].signedDate" type="date" placement="top-start" placeholder="请选择签约日期" style="width: 100%" @on-change="signedDateChange(1, $event)"></DatePicker>
                            </Form-item>
                        </Card>
                    </i-col>
                </Form>
            </div>
        </div>
        <i-col span="24" style="padding-top: 20px;padding-bottom: 20px;text-align: center">
            <Button type="primary" @click="sign" size="large">确认签署</Button>
            <div style="text-align: center;margin-top: 10px;padding-bottom: 20px">
                <span style="text-decoration: underline;font-size: 12px;color: #738096;cursor: pointer;" @click="nullifyAgreement">客户需求变更，作废当前合约</span>
            </div>
        </i-col>
    </div>
</template>

<script>
    import ContentChange from "../change/contractChange.vue";
    import SubjectChange from "../change/newSubjectChange.vue";
    import ICol from "../../../node_modules/iview/src/components/grid/col.vue";
    export default {
        props:{
            changeInfo: null,
            contractId: ''
        },
        data () {
            return {
                contractInfo: null,
                isShowChangeInfo: false,
                subjectsData: []
            }
        },
        filters: {
            wordLengthLimit : function (value) {
                if(value && value.length > 10){
                    return value.substring(0,10) + "..." ;
                }
                return value;
            },
            formatDate(value) {
                if (value) {
                    let newDate = new Date(value);
                    if (newDate) {
                        let y = newDate.getFullYear();
                        let m = newDate.getMonth() + 1;
                        m = m < 10 ? '0' + m : m;
                        let d = newDate.getDate();
                        d = d < 10 ? ('0' + d) : d;
                        return y + '/' + m + '/' + d;
                    }
                }
                return value;
            }
        },
        created: function () {
            this.getSubjectList();
        },
        components: {
            ICol,
            ContentChange,
            SubjectChange
        },
        methods: {
            showChangeInfo () {
                this.isShowChangeInfo = !this.isShowChangeInfo;
            },
            getSubjectList () {
                this.request({
                    url: '/signCloud/changeSignPage/getSubjects.do',
                    param: {
                        id: this.changeInfo.id
                    }
                }).then(subjectsData => {
                    this.subjectsData = subjectsData;
                    this.subjectsData.forEach(function (item) {
                        item.signedDate = '';
                    });
                });
            },
            signedDateChange(index, event) {
                this.subjectsData[index].signedDate = event;
            },
            sign () {
                this.isSignSubmit = true;
                let flag = true, itemTitle = '', errorItem = '', $self = this;
                this.subjectsData.every(function (item) {
                    if (item.legalName == '') {
                        flag = false;
                        errorItem = '负责人姓名不能为空';
                    }
                    if (flag) {
                        if (item.legalPhone == '') {
                            flag = false;
                            errorItem = '负责人电话格式不正确';
                        }
                    }
                    if (flag) {
                        if (item.signedDate == '') {
                            flag = false;
                            errorItem = '签约日期不能为空';
                        }
                    }
                    switch (item.subjectAlias) {
                        case 'A':
                            itemTitle = '甲方';
                            break;
                        case 'B':
                            itemTitle = '乙方';
                            break;
                        case 'C':
                            itemTitle = '丙方';
                            break;
                    }
                    if (!flag) {
                        $self.$Message.error(itemTitle + errorItem);
                    }
                    return flag;
                });
                if (flag) {
                    this.request({
                        url: '/signCloud/changeSignPage/changeContractSign.do',
                        timeout: 60000,
                        data: {
                            id: this.changeInfo.id,
                            list: this.subjectsData
                        }
                    }).then(() => {
                        this.$Message.success('合约变更协议签署成功！');
                        this.$api.getApiChangeList(this.contractId);
                    });
                }
            },
            nullifyAgreement () {
                this.prompt({
                    code: "changeNullifyView",
                    title: "请填写变更协议作废原因",
                    width:600,
                    height:360,
                    props: {
                        changeContractId:this.changeInfo.id,
                    },
                    callback: (flag,close) => {
                        close();
                        if(flag=="nullify"){
                            this.$api.getApiChangeList(this.contractId);
                        }
                    }
                });
            },
        }
    }
</script>