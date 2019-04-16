<template>
    <div>
        <Row>
            <i-col span="4">统一社会信用代码</i-col>
            <i-col span="8">
                <span v-if="exist">{{company.socialCreditCode}}</span>
                <Input v-model="company.socialCreditCode" v-else :maxlength="18"></Input>
            </i-col>
            <i-col span="4">营业期限</i-col>
            <i-col span="8">
                <span v-if="exist">{{bizTerm}}</span>
                <DatePicker v-else type="daterange" v-model="base.businessTerm" confirm placement="bottom-end" placeholder="选择日期" style="width: 100%;"></DatePicker>
            </i-col>
        </Row>
        <Row>
            <i-col span="4">注册号</i-col>
            <i-col span="8">
                <span v-if="exist">{{company.registerCode}}</span>
                <Input v-else v-model="company.registerCode" :maxlength="10"></Input>
            </i-col>
            <i-col span="4">发照日期</i-col>
            <i-col span="8">
                <span v-if="exist">{{authortyDate}}</span>
                <DatePicker type="date" v-else v-model="base.authortyDate" placeholder="选择日期" style="width: 100%"></DatePicker>
            </i-col>
        </Row>
        <Row>
            <i-col span="4">所属行业</i-col>
            <i-col span="8">
                <Select v-model.number="company.industryCode" filterable :disabled="exist">
                    <Option v-for="item in industryTypeList" :value="item.code" :key="item.code">{{ item.name }}</Option>
                </Select>
            </i-col>
            <i-col span="4">成立日期</i-col>
            <i-col span="8">
                <span v-if="exist">{{foundingTime}}</span>
                <DatePicker type="date" v-else v-model="base.foundingTime" placeholder="选择日期" style="width: 100%"></DatePicker>
            </i-col>
        </Row>
        <Row>
            <i-col span="4">企业类型</i-col>
            <i-col span="8">
                <Select v-model="company.type" filterable :disabled="exist">
                    <Option v-for="item in companyTypeList" :value="item.code" :key="item.code">{{ item.name }}</Option>
                </Select>
            </i-col>
            <i-col span="4">组织结构代码</i-col>
            <i-col span="8">
                <span v-if="exist">{{company.registerCode}}</span>
                <Input v-else v-model="base.registerCode" :maxlength="18"></Input>
            </i-col>
        </Row>
        <Row>
            <i-col span="4">法定代表人</i-col>
            <i-col span="8">
                <span v-if="exist">{{company.legalRepresentative}}</span>
                <Input v-else v-model="company.legalRepresentative" :maxlength="30"></Input>
            </i-col>
            <i-col span="4">经营状态</i-col>
            <i-col span="8">
                <Select v-model="company.state" filterable :disabled="exist">
                    <Option v-for="item in enterpriseStatusList" :value="item.code" :key="item.code">{{ item.name }}</Option>
                </Select>
            </i-col>
        </Row>
        <Row>
            <i-col span="4">注册资本</i-col>
            <i-col span="8">
                <span v-if="exist">{{company.registeredCapital}}</span>
                <Input v-else v-model="company.registeredCapital" :maxlength="10"></Input>
            </i-col>
            <i-col span="4">登记机关</i-col>
            <i-col span="8">
                <span v-if="exist">{{company.registrationAuthority}}</span>
                <Input v-else v-model="company.registrationAuthority" :maxlength="200"></Input>
            </i-col>
        </Row>
        <Row>
            <i-col span="4">企业地址</i-col>
            <i-col span="20">
                <span v-if="exist">{{company.companyAddress}}</span>
                <Input v-else v-model="company.companyAddress" :disabled="false" :maxlength="200"></Input>
            </i-col>
        </Row>
        <Row>
            <i-col span="4">经商范围</i-col>
            <i-col span="20" class-name="bizScope">
                <span v-if="exist">{{company.businessScope}}</span>
                <Input v-else type="textarea" v-model="company.businessScope" :maxlength="500"></Input>
            </i-col>
        </Row>
        <Row v-if="!exist">
            <i-col span="24" class-name="bizScope">
                <Button type="primary" @click="saveEnterpriseBasicInformation()">保存</Button>
            </i-col>
        </Row>
    </div>
</template>

<script>
    export default {
        props: {
            id: null,
            company: null,
            exist: null
        },
        data: function () {
            return {
                base: {
                    foundingTime: '', //成立日期
                    startTime: '',
                    endTime: '',
                    authortyDate: '', // 发照日期 // 核准日期
                    businessScope: '', // 经商范围
                },
                companyTypeList: [],//公司类型列表数据
                enterpriseStatusList: [],//企业状态列表数据
                industryTypeList: []//行业分类列表数据
            }
        },
        created: function () {
//            if(this.company.industryCode)this.company.industryCode = Number(this.company.industryCode);
//            this.init();
            this.getCompanyTypeList();//公司类型列表数据
            this.getEnterpriseStatusList();//请求企业状态列表数据
            this.getIndustryTypeList();//请求行业分类列表数据
        },
        methods: {
            /*请求公司类型列表数据*/
            getCompanyTypeList: function () {
                this.request({
                    url: '/crm/myCollection/companyTypeList.do'
                }).then(companyTypeList => {
                    this.companyTypeList = companyTypeList;
                })
            },
            init: function () {
                this.request({
                    url: '/crm/clueManagement/baseinfoCompany.do',
                    param: {
                        id: this.id
                    }
                }).then(data => {
                    this.base = data;
                });
            },
            /*请求企业状态列表数据*/
            getEnterpriseStatusList: function () {
                this.request({
                    url: '/crm/myCollection/enterpriseStatusList.do'
                }).then(enterpriseStatusList => {
                    this.enterpriseStatusList = enterpriseStatusList;
                })
            },
            /*请求行业分类列表数据*/
            getIndustryTypeList: function () {
                this.request({
                    url: '/crm/myCollection/industryTypeList.do'
                }).then(industryTypeList => {
                    this.industryTypeList = industryTypeList;
                })
            },
            /*保存*/
            saveEnterpriseBasicInformation: function () {
                this.request({
                    url: '/crm/myCollection/saveEnterpriseBasicInformation.do',
                    data: {
                        company: this.company,
                        base: this.base
                    }
                }).then(() => {
                    this.$Message.success('提交成功!')
                })
            }
        },
        computed: {
            bizTerm: function () {
                return window.DateFormat.dateToString(new Date(this.company.startTime), 'yyyy/MM/dd') + '-' + window.DateFormat.dateToString(new Date(this.company.endTime), 'yyyy/MM/dd');
            },
            authortyDate: function () {
                return window.DateFormat.dateToString(new Date(this.company.authortyDate), 'yyyy/MM/dd');
            },
            foundingTime: function () {
                return window.DateFormat.dateToString(new Date(this.company.foundingTime), 'yyyy/MM/dd');
            }
        }
    }
</script>

<style scoped>
    .ivu-row{
        border-top: 1px solid #e7e9ef;
        background: #FCFCFC;
    }
    .ivu-row>.ivu-col {
        padding: 0 5px;
        min-height: 40px;
        line-height: 35px;
        font-weight: 700;
        color: #666;
        font-size: 14px;

    }
    .ivu-row>.ivu-col:nth-child(odd){
        text-align: center;
    }
    .ivu-row>.ivu-col:nth-child(even){
        border-left: 1px solid #e7e9ef;
        border-right: 1px solid #e7e9ef;
        background: #fff;
    }
    .ivu-row>.ivu-col:last-child{
        border-right: none;
    }
    .ivu-col.bizScope{
        padding-top: 5px;
        padding-bottom: 5px;
        padding-right: 100px;
        line-height: 1.6;
    }
</style>