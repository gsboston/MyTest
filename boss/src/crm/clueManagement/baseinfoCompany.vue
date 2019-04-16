<template>
    <div class="ivu-hidden-box">
        <Row>
            <i-col span="4"><b>统一社会信用代码</b></i-col>
            <i-col span="8"><b>{{base.socialCreditCode || '-' }}</b></i-col>
            <i-col span="4"><b>组织结构代码</b></i-col>
            <i-col span="8"><b>{{base.taxCode || '-' }}</b></i-col>
        </Row>
        <Row>
            <i-col span="4"><b>注册号</b></i-col>
            <i-col span="8"><b>{{base.registerCode || '-' }}</b></i-col>
            <i-col span="4"><b>企业状态</b></i-col>
            <i-col span="8"><b>{{base.stateName || '-' }}</b></i-col>
        </Row>
        <Row>
            <i-col span="4"><b>所属行业</b></i-col>
            <i-col span="8"><b>{{base.industryName|| '-'}}</b></i-col>
            <i-col span="4"><b>成立日期</b></i-col>
            <i-col span="8"><b>{{base.foundingTime|| '-'}}</b></i-col>
        </Row>
        <Row>
            <i-col span="4"><b>公司类型</b></i-col>
            <i-col span="8"><b>{{base.typeName|| '-'}}</b></i-col>
            <!--<i-col span="4">营业期限</i-col>-->
            <!--<i-col span="8">{{bizTerm}}</i-col>-->
            <i-col span="4"><b>法定代表人</b></i-col>
            <i-col span="8"><b>
            {{base.legalRepresentative==""?"-":base.legalRepresentative}}
                </b></i-col>
        </Row>
        <!--<Row>-->
            <!--<i-col span="4">法定代表人</i-col>-->
            <!--<i-col span="8">-->
                <!--{{base.legalRepresentative}}-->
                <!--&lt;!&ndash;<Button size="small" icon="ios-download-outline">法人对外投资</Button>&ndash;&gt;-->
            <!--</i-col>-->
            <!--<i-col span="4">发照日期</i-col>-->
            <!--<i-col span="8">{{base.authortyDate}}</i-col>-->
        <!--</Row>-->
        <Row>
            <i-col span="4"><b>注册资本</b></i-col>
            <i-col span="8"><b>{{base.registeredCapital || '-'}} 万元</b></i-col>
            <i-col span="4"><b>人员规模</b></i-col>
            <i-col span="8"><b>{{base.staffSize || '-'}}人</b></i-col>
        </Row>
        <Row>
            <i-col span="4"><b>企业地址</b></i-col>
            <i-col span="20"><b>{{base.companyAddress|| '-'}}</b></i-col>
            <!--<i-col span="4">登记机关</i-col>-->
            <!--<i-col span="8">{{base.registrationAuthority}}</i-col>-->
        </Row>
        <Row>
            <i-col span="4"><b>经商范围</b></i-col>
            <i-col span="20" class-name="bizScope"><b>{{base.businessScope|| '-'}}</b></i-col>
        </Row>
    </div>
</template>

<script>
    export default {
        props: {
            id: null,
            company: null
        },
        data: function () {
            return {
                base: {
//                    socialCreditCode: '325325325325326', // 统一社会信用代码
//                    registerCode: 325325325325326, // 注册号
//                    stateName: '存续', // 企业状态
//                    industryName: '电器行业', // 所属行业
//                    foundingTime: '2011年1月1日', //成立日期
//                    type: '股份有限公司', // 公司类型
//                    bizTerm: '2011年1月1日-2011年1月1日', // 营业期限
//                    startTime: '',
//                    endTime: '',
//                    legalRepresentative: '夏立博', // 法定代表人
//                    authortyDate: '2011年1月1日', // 发照日期 // 核准日期
//                    registeredCapital: '500万人民币', // 注册资本
//                    registrationAuthority: '上海市工商管理局', // 登记机关
//                    companyAddress: '上海市工商管理局上海市工商管理局上海市工商管理局',
//                    businessScope: '上海市工商管理局上海市工商管理局上海市工商管理局上海市工商管理局上海市工商管理局上海市工商管理局上海市工商管理局上海市工商管理局上海市工商管理局上海市工商管理局', // 经商范围
                }
            }
        },
        created: function () {
//            console.log('company');
//            console.log(this.company);
//            console.log(this.base);

            this.base = this.company;
//            this.init();
        },
        methods: {
            init: function () {
                this.request({
                    url: '/crm/clueManagement/baseinfoCompany.do',
                    param: {
                        id: this.id
                    }
                }).then(data => {
                    this.base = data;
                });
            }
        },
        computed: {
            bizTerm: function () {
                return `${this.base.startTime}-${this.base.endTime}`;
            }
        }
    }
</script>

<style scoped>
    .ivu-hidden-box {
        overflow: hidden;
    }
    .ivu-row{
        border-top: 1px solid #e7e9ef;
        background: #FCFCFC;
        display: flex;
    }
    .ivu-row>.ivu-col {
        padding: 0 5px;
        min-height: 35px;
        line-height: 40px;
        font-weight: 700;
        color: #666;
        font-size: 14px;
        overflow: hidden;
        margin-bottom: -10000px;
        padding-bottom: 10000px;
        display: flex;

    }
    .ivu-col.ivu-col:nth-child(even) b {
        font-weight: 700;
        padding: 10px 0;
        word-wrap: break-word;
        float: left;
        margin: auto;
        width: 100%;
    }
    .ivu-col.ivu-col:nth-child(odd) b {
        margin: auto;
        font-weight: 700;
    }
    .ivu-row>.ivu-col:nth-child(odd){
        text-align: center;
    }
    .ivu-row>.ivu-col:nth-child(even){
        border-left: 1px solid #e7e9ef;
        border-right: 1px solid #e7e9ef;
        background: #fff;
        line-height: 20px;
    }
    .ivu-row>.ivu-col:last-child{
        border-right: none;
    }
    .ivu-col.bizScope{
        /*padding-top: 5px;
        padding-bottom: 5px;
        padding-right: 100px;
        line-height: 1.6;*/
    }
</style>