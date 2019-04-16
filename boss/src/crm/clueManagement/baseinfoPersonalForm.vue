<template>
    <div>
        <Row>
            <i-col span="4">姓名</i-col>
            <i-col span="8">
                <span v-if="exist">{{personalInfo.name}}</span>
                <Input v-else v-model="personalInfo.name" :maxlength="30"></Input>
            </i-col>
            <i-col span="4">出生日期</i-col>
            <i-col span="8">
                <span v-if="exist">{{birthday}}</span>
                <DatePicker v-else type="date" v-model="base.birthday" placeholder="选择日期"
                            style="width: 100%"></DatePicker>
            </i-col>
        </Row>
        <Row>
            <i-col span="4">性别</i-col>
            <i-col span="8">
                <Select v-model.number="personalInfo.sex" filterable :disabled="exist">
                    <Option v-for="item in sexList" :value="item.code" :key="item.code">{{ item.name }}</Option>
                </Select>
            </i-col>
            <i-col span="4">电话</i-col>
            <i-col span="8">
                <span v-if="exist">{{personalInfo.telephone}}</span>
                <Input v-else v-model="personalInfo.telephone" :maxlength="12"></Input>
            </i-col>
        </Row>
        <Row>
            <i-col span="4">移动电话</i-col>
            <i-col span="8">
                <span v-if="exist">{{personalInfo.mobile}}</span>
                <Input v-else v-model="personalInfo.mobile" :maxlength="11"></Input>
            </i-col>
            <i-col span="4">微信</i-col>
            <i-col span="8">
                <span v-if="exist">{{personalInfo.wechat}}</span>
                <Input v-else v-model="personalInfo.wechat" :maxlength="64"></Input>
            </i-col>
        </Row>
        <Row>
            <i-col span="4">电子邮箱</i-col>
            <i-col span="20">
                <span v-if="exist">{{personalInfo.email}}</span>
                <Input v-else v-model="personalInfo.email" :maxlength="64"></Input>
            </i-col>
        </Row>
        <Row>
            <i-col span="4">兴趣</i-col>
            <i-col span="20">
                <Tag v-if="exist" v-for="(item, index) in interestList" :key="index">{{item.name}}</Tag>
                <Tag closable v-if="!exist" @on-close="delInterest(interestList,item)"
                     v-for="(item, index) in interestList" :key="index">{{item.name}}
                </Tag>
                <Button icon="ios-plus-empty" type="dashed" size="small" @click="addInterest"
                        v-if="!isAddInterest&&!exist">添加兴趣
                </Button>
                <Input v-model="interestVal" style="width: 200px;" v-if="isAddInterest" :maxlength="10"></Input>
                <Button size="small" @click="cancelInterest" v-if="isAddInterest">取消</Button>
                <Button size="small" @click="saveInterest(interestVal)" v-if="isAddInterest">确认</Button>
            </i-col>
        </Row>
        <Row>
            <i-col span="4">备注描述</i-col>
            <i-col span="20" class-name="bizScope">
                <span v-if="exist">{{personalInfo.remark}}</span>
                <Input v-else type="textarea" v-model="personalInfo.remark" :maxlength="200"></Input>
            </i-col>
        </Row>
        <Row v-if="!exist">
            <i-col span="24" class-name="bizScope">
                <Button type="primary" @click="savePersonalBasicInformation()">保存</Button>
            </i-col>
        </Row>
    </div>
</template>

<script>
    export default {
        props: {
            id: null,
            interestTagsList: null,
            personalInfo: null,
            exist: null
        },
        data: function () {
            return {
                base: {
                    birthday: '',
//                    interest: '吃饭睡觉打豆豆', // 兴趣
                },
                sexList: [],//性别列表数据,
                interestList: [],//兴趣列表数据
                interestVal: '',
                isAddInterest: false//兴趣列表数据
            }
        },
        created: function () {
            this.interestList = [];
            for (let i = 1; i < this.interestTagsList.length; i++) {
                if (this.interestTagsList[i].type == 5) this.interestList.push(this.interestTagsList[i]);
            }
            this.getSexList();//请求行业分类列表数据
        },
        methods: {
            /*添加兴趣状态*/
            addInterest: function () {
                this.isAddInterest = true;
            },
            /*取消添加兴趣*/
            cancelInterest: function () {
                this.interestVal = '';
                this.isAddInterest = false;
            },
            /*保存添加兴趣*/
            saveInterest: function (val) {
                if (val) {
                    this.interestList.push({
                        hxId: this.id,
                        name: val,
                        type: 5
                    });
                }
                this.interestVal = '';
                this.isAddInterest = false;
//                console.log(this.interestList);
            },
            /*删除添加兴趣*/
            delInterest: function (arr, item) {
                arr.forEach(function (obj, index) {
                    if (obj.name == item.name) {
                        arr.splice(index, 1);
                    }
                });
            },
            /*请求性别列表数据*/
            getSexList: function () {
                this.request({
                    url: '/crm/myCollection/getSexList.do'
                }).then(sexList => {
                    this.sexList = sexList;
                })
            },
            /*保存*/
            savePersonalBasicInformation: function () {
                this.request({
                    url: '/crm/myCollection/savePersonalBasicInformation.do',
                    data: {
                        personalInfo: this.personalInfo,
                        base: this.base,
                        interestList: this.interestList
                    }
                }).then(() => {
                    this.$Message.success('提交成功!')
                })
            }
        },
        computed: {
            birthday: function () {
                if (this.personalInfo.birthday == null) {
                    return '';
                }
                return window.DateFormat.dateToString(new Date(this.personalInfo.birthday), 'yyyy/MM/dd');
            }
        }
    }
</script>

<style scoped>
    .ivu-row {
        border-top: 1px solid #e7e9ef;
        background: #FCFCFC;
    }

    .ivu-row > .ivu-col {
        padding: 0 5px;
        min-height: 35px;
        line-height: 40px;
        font-size: 14px;
    }

    .ivu-row > .ivu-col:nth-child(odd) {
        text-align: center;
    }

    .ivu-row > .ivu-col:nth-child(even) {
        border-left: 1px solid #e7e9ef;
        border-right: 1px solid #e7e9ef;
        background: #fff;
    }

    .ivu-row > .ivu-col:last-child {
        border-right: none;
    }

    .ivu-col.bizScope {
        padding-top: 5px;
        padding-bottom: 5px;
        padding-right: 100px;
        line-height: 1.6;
    }
</style>