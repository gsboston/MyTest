<style scoped>
    .left {
        position: absolute;
        top: 55px;
        left: 0;
        bottom: 0;
        width: 300px;
        padding-bottom: 10px;
        padding-left: 10px;
        border-right: solid 1px #dddee1;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .content-info {
        position: absolute;
        top: 55px;
        left: 300px;
        right: 0;
        bottom: 0;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .location{
        display: inline-block;
    }
    .location >>> .ivu-form-item-content{
        margin-left: 0 !important;
    }
    .no-service{
        position: relative;
        width: 100%;
        height: 500px;
        padding-top: 253px;
        padding-bottom: 20px;
        background: #FFF url("../../signCloud/image/no-contract.png") center 100px no-repeat;
        text-align: center;
        font-size: 16px;
    }
    .search-condition{
        width: 100px;
    }
    .search-condition-state{
        width: 200px;
    }
    .search-condition >>> .ivu-select-selection,.search-condition-state >>> .ivu-select-selection{
        border-radius: 0;
    }
    .search-condition-date{
        width: 200px;
    }
    .search-condition-date >>> .ivu-input{
        border-radius: 0;
    }
    .search-text{
        width: 200px;
    }
    .search-text >>> .ivu-input{
        border-radius: 0;
    }
    .service-item{
        width: 100%;
        border-bottom: 1px solid #e5e5e5;
        background-color: white;
        font-size: 14px;
    }
    .service-item-state{
        border: 1px solid #59b399;
        border-radius: 4px;
        background: #59b399;
        color: white;
        padding: 0 2px 0 2px;
        font-size: 12px;
    }
    .service-item-selected{
        background: #59b399;
        color: white;
        border-bottom: 1px solid #59b399;
    }
    .service-item-selected .service-item-state{
        border: 1px solid white;
        border-radius: 4px;
        background: white;
        color: #59b399;
        padding: 0 2px 0 2px;
        font-size: 12px;
    }
    .content-head{
        font-size: 18px;
        font-weight: bold;
    }
    .content-hr{
        margin: 10px 0;
    }
</style>
<template>
    <div class="container">
        <div class="center">
            <div style="padding: 10px 50px 10px 10px">
                <i-col span="24">
                    <div style="display:inline-block;">
                        <Select class="search-condition" v-model="searchCondition" @on-change="changeSearchType">
                            <Option v-for="(searchConditionInfo,index) in searchConditionList" :key="index" :value="index">{{searchConditionInfo.name}}</Option>
                        </Select>
                    </div>
                    <div style="display:inline-block;margin-left: -4px">
                        <Input v-if="searchCondition=='0'" :maxlength="50" v-model="searchText" class="search-text"></Input>
                        <Select v-if="searchCondition=='1'" clearable class="search-condition-state" v-model="applyState">
                            <Option v-for="(applyStateInfo,index) in applyStateList" :key="index" :value="applyStateInfo.value">{{applyStateInfo.name}}</Option>
                        </Select>
                        <DatePicker v-model="dateRange" v-if="searchCondition=='2'" @on-change="changeDateRange" clearable class="search-condition-date" type="daterange" placement="bottom-start" placeholder="选择时间段"></DatePicker>
                    </div>
                    <div style="display: inline-block;margin-left: -4px">
                        <Button style="border-radius: 0" @click="getCompanyOpenApplyList(null)">查询</Button>
                    </div>
                </i-col>
                <div class="left" v-if="companyApplyList && companyApplyList.length>0">
                    <div v-for="companyApplyInfo in companyApplyList" :key="companyApplyInfo.id" class="service-item" @click="selectApply(companyApplyInfo)" :class="{'service-item-selected':selectedId == companyApplyInfo.id}">
                        <div style="padding: 5px;">
                            <div style="padding: 5px 10px;margin: 5px 5px 5px 10px;">
                                <div :title="companyApplyInfo.name" style="height: 30px;line-height: 30px;font-weight: bold">
                                    <span>{{companyApplyInfo.name | wordLengthLimit}}</span>
                                </div>
                            </div>
                            <div style="display: inline-block;width: 150px;margin-left: 20px">
                                <span>{{companyApplyInfo.applyTime | formatDate}}</span>
                            </div>
                            <div style="display: inline-block;margin-left: 20px">
                                <div class="service-item-state">
                                    <span>{{companyApplyInfo.stateName}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Page style="margin-top: 10px" size="small" :total="total" :current="page" :page-size="pageSize" @on-change="changePage"></Page>
                </div>
                <div class="content-info" v-if="companyApplyList && companyApplyList.length>0">
                    <div v-if="this.selectedId" style="padding: 10px 15px 10px 15px">
                        <Form ref="form" :model="selectedCompanyInfo" label-position="right" :label-width="100" :rules="ruleValidate">
                            <div style="font-size: 14px;padding: 10px 15px 10px 17px;color: #5d5d5d">
                                <div class="content-head">
                                    <span>申请公司信息</span>
                                </div>
                                <hr class="content-hr"/>
                                <FormItem label="公司名称" prop="name" :title="selectedCompanyInfo.name">
                                    <Input v-model="selectedCompanyInfo.name" style="width: 638px;" :maxlength="50" disabled></Input>
                                </FormItem>
                                <FormItem label="所在地" prop="provinceCode" style="display: inline-block">
                                    <Select v-model="selectedCompanyInfo.provinceCode" style="width: 200px" placeholder="请选择省份" disabled>
                                        <Option v-for="provinceInfo in provinceList" :key="provinceInfo.code" :value="provinceInfo.code">{{provinceInfo.label}}</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="" prop="cityCode" class="location">
                                    <Select v-model="selectedCompanyInfo.cityCode" style="width: 200px;margin-left: 10px" placeholder="请选择城市" disabled>
                                        <Option v-for="cityInfo in cityList" :key="cityInfo.code" :value="cityInfo.code">{{cityInfo.label}}</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="" prop="areaId" class="location">
                                    <Select v-model="selectedCompanyInfo.areaId" style="width: 200px;margin-left: 20px" placeholder="请选择区县" disabled>
                                        <Option v-for="areaInfo in areaList" :key="areaInfo.code" :value="areaInfo.value">{{areaInfo.label}}</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="详细地址" prop="address">
                                    <Input :maxlength="50" style="width: 638px" v-model="selectedCompanyInfo.address" disabled/>
                                </FormItem>
                                <Row>
                                    <FormItem label="联系方式" prop="phone" style="display: inline-block">
                                        <Input :maxlength="11" style="width: 200px" v-model="selectedCompanyInfo.phone" disabled/>
                                    </FormItem>
                                    <FormItem label="微信公众号" style="display: inline-block">
                                        <Input :maxlength="50" style="width: 200px" v-model="selectedCompanyInfo.wechatPublicNum" disabled/>
                                    </FormItem>
                                </Row>
                                <Row>
                                    <FormItem label="公司负责人" style="display: inline-block">
                                        <Input :maxlength="250" style="width: 200px" v-model="selectedCompanyInfo.leader" disabled/>
                                    </FormItem>
                                    <FormItem label="负责人电话" style="display: inline-block">
                                        <Input :maxlength="11" style="width: 200px" v-model="selectedCompanyInfo.leaderPhone" disabled/>
                                    </FormItem>
                                </Row>
                                <Row>
                                    <FormItem label="公司联系人" style="display: inline-block">
                                        <Input :maxlength="250" style="width: 200px" v-model="selectedCompanyInfo.linkman" disabled/>
                                    </FormItem>
                                    <FormItem label="联系人电话" style="display: inline-block">
                                        <Input :maxlength="11" style="width: 200px" v-model="selectedCompanyInfo.linkmanPhone" disabled/>
                                    </FormItem>
                                </Row>
                                <Row>
                                    <FormItem label="联系人邮箱" style="display: inline-block">
                                        <Input :maxlength="250" style="width: 200px" v-model="selectedCompanyInfo.linkmanEmail" disabled/>
                                    </FormItem>
                                    <FormItem label="加盟性质" style="display: inline-block;">
                                        <Select v-model="selectedCompanyInfo.partnerType" style="width: 200px" placeholder="请选择合伙人类型" disabled>
                                            <Option value="NONE">无</Option>
                                            <Option value="A">A轮</Option>
                                            <Option value="B">B轮</Option>
                                            <Option value="C">C轮</Option>
                                            <Option value="CITY_LIGHT_HOUSE">城市灯塔</Option>
                                        </Select>
                                    </FormItem>
                                </Row>
                                <Row v-if="selectedCompanyInfo.partnerType == 'A' || selectedCompanyInfo.partnerType == 'B' ||selectedCompanyInfo.partnerType == 'C'">
                                    <FormItem label="原公司名称" style="display: inline-block">
                                        <Input :maxlength="250" style="width: 200px" v-model="selectedCompanyInfo.oldNameA" disabled/>
                                    </FormItem>
                                    <FormItem label="原公司名称2" style="display: inline-block">
                                        <Input :maxlength="250" style="width: 200px" v-model="selectedCompanyInfo.oldNameB" disabled/>
                                    </FormItem>
                                </Row>
                                <FormItem label="电子邮箱" prop="email">
                                    <Input :maxlength="50" style="width: 200px" v-model="selectedCompanyInfo.email" disabled/>
                                </FormItem>
                                <FormItem label="公司简介">
                                    <Input type="textarea" style="width: 638px" :rows="4" v-model="selectedCompanyInfo.synopsis" :maxlength="500" disabled/>
                                </FormItem>
                                <div class="content-head">
                                    <span>申请人信息</span>
                                </div>
                                <hr class="content-hr"/>
                                <FormItem label="申请人姓名" :title="selectedCompanyInfo.applyerName">
                                    <Input v-model="selectedCompanyInfo.applyerName" style="width: 638px;" :maxlength="50" disabled></Input>
                                </FormItem>
                                <FormItem label="申请人性别" :title="selectedCompanyInfo.applyerSex">
                                    <RadioGroup v-model="selectedCompanyInfo.applyerSex">
                                        <Radio label="1" disabled>男</Radio>
                                        <Radio label="0" disabled>女</Radio>
                                    </RadioGroup>
                                </FormItem>
                                <FormItem label="申请人电话" :title="selectedCompanyInfo.testPhone">
                                    <Input :maxlength="11" style="width: 200px" v-model="selectedCompanyInfo.testPhone" disabled/>
                                </FormItem>
                            </div>
                        </Form>
                        <div v-if="selectedCompanyInfo.state=='NONE'" style="margin-left: 117px;padding-bottom: 20px">
                            <Button type="primary" @click="auditSuccess">选择上级组织</Button>
                            <Button type="ghost" @click="auditFailure">不通过</Button>
                        </div>
                    </div>
                </div>
                <i-col v-else span="24">
                    <div class="no-service">
                        <span>暂无可显示的企业开通申请记录</span>
                    </div>
                </i-col>
            </div>
        </div>
    </div>
</template>
<script>
    import ICol from "../../../node_modules/iview/src/components/grid/col.vue";

    export default {
        components: {ICol},
        created :function () {
            this.initList();
        },
        filters: {
            wordLengthLimit : function (value) {
                if(value && value.length > 15){
                    return value.substring(0,15) + "..." ;
                }
                return value;
            },
            formatDate(time) {
                var date = new Date(time);
                return date.format('yyyy-MM-dd hh:mm:ss');
            },
        },
        data () {
            return {
                searchConditionList: [
                    {name:"申请公司"},
                    {name:"申请状态"},
                    {name:"申请日期"}
                ],
                applyStateList: [
                    {name:"待审核",value:"NONE"},
                    {name:"审核通过",value:"AUDITED"},
                    {name:"未通过",value:"REJECTED"}
                ],
                provinceList: [],
                cityList: [],
                areaList: [],
                provinceCode: "",
                cityCode: "",
                areaCode: "",
                applyState: "",
                total: 0,
                page: 1,
                pageSize: 10,
                companyApplyList: [],
                searchCondition: 0,
                searchText: "",
                dateRange: null,
                startTime: "",
                endTime: "",
                selectedId: null,
                selectedCompanyInfo:{
                },
                ruleValidate: {
                    name: [
//                        {required: true, message: "请输入公司名称"}
                    ],
                    provinceCode: [
//                        {required: true, message: "请选择公司所在省",trigger: 'change' }
                    ],
                    cityCode: [
//                        {required: true, message: "请选择公司所在市",trigger: 'change' }
                    ],
                    areaId: [
//                        {required: true, message: "请选择公司所在区",trigger: 'change' }
                    ],
                    address: [
//                        {required: true, message: "请输入公司详细地址"}
                    ],
                    phone: [
//                        {required: true, message: "请输入联系电话"},
//                        { pattern:  /^((\d{3}-\d{8}|\d{4}-\{7,8})|(1[2-9]\d{9}))$/ ,message:'请输入有效的联系电话'}
                    ],
                    email: [
//                        { required: true, message: '邮箱不能为空'},
//                        { pattern:  /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/ ,message:'请输入正确的邮箱格式'}
                    ],
                }
            }
        },
        methods: {
            initList () {
                this.getCompanyOpenApplyList("NONE");
            },
            changeSearchType (item) {
                if(item == 0){//公司名称
                    this.applyState = "";
                    this.startTime = "";
                    this.endTime = "";
                }else if(item == 1){//申请状态
                    this.startTime = "";
                    this.endTime = "";
                    this.searchText = "";
                }else if(item == 2){//申请时间
                    this.applyState = "";
                    this.searchText = "";
                }
                this.page = 1;
            },
            changePage (pageIndex) {
                this.page = pageIndex;
                this.getCompanyOpenApplyList(null);
            },
            changeDateRange (dateRangeArray) {
                if(dateRangeArray && dateRangeArray.length>1){
                    if(dateRangeArray[0] == "" || dateRangeArray[0] == undefined || dateRangeArray[1] == "" || dateRangeArray[1] == undefined){
                        this.startTime = null;
                        this.endTime = null;
                    }else{
                        this.selectedDateRange = dateRangeArray;
                        this.startTime = dateRangeArray[0];
                        this.endTime = dateRangeArray[1];
                    }
                }
            },
            getCompanyOpenApplyList (applyState1) {
                var tempApplyState = "";
                if(applyState1){
                    tempApplyState = applyState1;
                }else{
                    tempApplyState = this.applyState;
                }
                this.request({
                    url: "/systemManage/companyOpenAudit/getCompanyOpenApplyList.do",
                    data: {
                        page: this.page,
                        name: this.searchText,
                        state: tempApplyState,
                        startTime: this.startTime,
                        endTime: this.endTime
                    }
                }).then((data)=>{
                    if(data && data.records.length>0){
                        for(var i = 0;i<data.records.length;i++){
                            if(data.records[i].state == "NONE"){
                                data.records[i].stateName = "待审核";
                            }else if(data.records[i].state == "AUDITED"){
                                data.records[i].stateName = "审核通过";
                            }else{
                                data.records[i].stateName = "未通过";
                            }
                        }
                        this.companyApplyList = data.records;
                        this.selectApply(data.records[0]);
                        this.current = data.current;
                        this.total = data.total;
                    }else{
                        this.companyApplyList = [];
                    }
                })
            },
            selectApply (companyApplyInfo) {
                this.selectedId = companyApplyInfo.id;
                this.getCompanyInfoById(companyApplyInfo.id);
            },
            getCompanyInfoById (id) {
                this.request({
                    url: "/systemManage/companyOpenAudit/getCompanyInfoById.do",
                    param:{
                        id: id
                    }
                }).then((data)=>{
                    this.selectedCompanyInfo = data;
                    this.getAreaCodeById(data.areaId);
                })
            },
            getAreaCodeById (areaId) {
                this.request({
                    url: "/systemManage/companyOpenAudit/getAreaCodeById.do",
                    param: {
                        areaId: areaId
                    }
                }).then(item => {
                    if(item && item.code){
                        this.provinceCode = item.code.substring(0,2) + "0000";
                        this.cityCode =  item.code.substring(0,4) + "00";
                        this.areaCode = item.code;
                        this.getProvinceList('1', '');
                    }
                });
            },
            getProvinceList (level, code) {
                this.request({
                    url: "/systemManage/bd/getAreaDataByCodeForNoLogin.do",
                    param: {
                        code: code
                    }
                }).then(items => {
                    if (level == '1') {
                        this.provinceList = items;
                        this.cityList = [];
                        this.areaList = [];
                        this.selectedCompanyInfo.provinceCode = this.provinceCode;
                        this.getProvinceList('2',this.provinceCode);
                    }else if (level == '2') {
                        this.cityList = items;
                        this.areaList = [];
                        this.selectedCompanyInfo.cityCode = this.cityCode;
                        this.getProvinceList('3',this.cityCode);
                    }else {
                        this.areaList = items;
                        this.selectedCompanyInfo.areaId = this.areaCode;
                    }
                });
            },
            auditSuccess () {
                this.prompt({
                    code: "companyOpenSuccess",
                    title: "请选择该组织的上级组织机构",
                    width:800,
                    height:460,
                    props: {
                        id:this.selectedId,
                    },
                    callback: (flag,close) => {
                        close();
                        if(flag=="success"){
                            this.$Message.info("审核通过！");
                            this.selectedId = null;
                            this.getCompanyOpenApplyList(null);
                        }
                    }
                });
            },
            auditFailure () {
                this.prompt({
                    code: "companyOpenRefuse",
                    title: "请填写不通过原因",
                    width:600,
                    height:260,
                    props: {
                        id:this.selectedId,
                    },
                    callback: (flag,close) => {
                        close();
                        if(flag=="refuse"){
                            this.selectedId = null;
                            this.getCompanyOpenApplyList(null);
                        }
                    }
                });
            },
        },
    }
</script>