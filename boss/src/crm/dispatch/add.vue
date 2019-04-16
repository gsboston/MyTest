<template>
    <div class="dispatch">
        <Form ref="formItem" :model="formItem" :label-width="80" :rules="ruleValidate" inline>
            <div class="tabs">
                <span :class="{active:type==2}" @click="selType(2)">新增企业</span>
                <span :class="{active:type==1}" @click="selType(1)">新增个人</span>
            </div>
            <Row>
                <Col span="12" class="main-left">
                    <div class="head">线索信息</div>
                    <div class="formItem">

                        <FormItem label="公司名称" style="width:100%;" prop="name" v-if="type==2">
                            <Row>
                                <Col span="10"><Input v-model="formItem.name" placeholder="请输入公司名称"></Input></Col>
                                <Col span="5" offset="1"><Button @click="searchTYC">天眼查</Button></Col>
                            </Row>
                        </FormItem>
                        <FormItem label="姓名" style="width:45%;" prop="name" v-if="type==1">
                            <Input v-model="formItem.name" placeholder="请输入姓名"></Input>
                        </FormItem>
                        <FormItem label="电话" prop="phone" style="width:45%;">
                            <Input v-model="formItem.phone" placeholder="请输入电话" :maxlength="13"></Input>
                        </FormItem>
                        <FormItem label="法人代表" v-if="type==2" style="width:45%;" class="faren" prop="legal">
                            <Input v-model="formItem.legal" placeholder="请输入法人代表"></Input>
                        </FormItem>

                        <FormItem label="所属行业" style="width:45%;" prop="industryCode" v-if="type==2">
                            <!--<Input v-model="formItem.industryName" placeholder="请输入行业"></Input>-->
                            <Select v-model="formItem.industryCode" filterable>
                                <Option v-for="item in industryTypeList" :value="item.code" :key="item.code">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="区域" style="width:45%;" prop="region">
                            <Cascader class="region-cascader" :clearable="false" :data="regionList" :load-data="loadInferior" change-on-select v-model="formItem.region"></Cascader>
                        </FormItem>
                        <FormItem label="地址" style="width:100%;" prop="companyAddress">
                            <Input v-model="formItem.companyAddress" placeholder="请输入地址"></Input>
                        </FormItem>
                        <FormItem label="添加服务" style="width:100%; position: relative;">
                            <span style="font-family: SimSun; font-size: 12px; color: #ed3f14; position: absolute; left: -74px; top: 0;">*</span>
                            <!--<Tag class="tag-item" v-for="(item, index) in serviceList" :key="index" :name="item.code" :checked="false" checkable>{{item.name}}</Tag>-->
                            <div class="tag-item" v-for="(item, index) in serviceList" :key="index" :class="{tag_active:item.check==true}" @click="selService(item, index)">{{item.name}}</div>
                        </FormItem>
                        <FormItem label="备注" style="width:100%;" prop="remark">
                            <Input v-model="formItem.remark" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder=""></Input>
                        </FormItem>


                    </div>
                </Col>
                <Col span="12" class="main-right">
                    <div class="head">派单</div>
                    <div class="dispatchHistory" v-if="orgHistory.length">
                        <span>派单历史：</span>
                        <Tag type="border" color="green" v-for="(item, index) in orgHistory" :key="index" @click.native="toOrgTree(item)">{{ item.name }}</Tag>
                    </div>
                    <Dispatch ref="Dis" @orgSelected="orgSelected">
                        <div slot="btn"></div>
                    </Dispatch>
                </Col>

            </Row>
            <div class="foot">
                <FormItem>
                    <Button type="primary" @click="handleSubmit('formItem')">保存</Button>
                    <Button type="ghost" @click="handleReset('formItem')" style="margin-left: 8px">重置</Button>
                </FormItem>
            </div>
        </Form>
    </div>
</template>

<script>
    import Dispatch from '../clueManagement/dispatch.vue';

    export default {
        data: function () {
            return {
                formItem: {
                    name: '',
                    legal: '',
                    phone: '',
                    industryName: '',
                    companyAddress:'',
                    remark: '',
                    industryCode: '',
                    region: []
                },
                optMen: {
                    orgId: '',
                    userId: '',
                    haveUsers: false,
                    noUsersTips: '',
                },
                ruleValidate:{
                    name: [
                        {required: true, message: '名字必须填写！'}
                    ],
                    phone: [
                        {required: true, message: '电话必须填写!', trigger: 'blur'},
                        { validator: this.validatorMobile, trigger: 'blur' },
                    ],
                    region: [
                        {required: true, message: '请选择区域！'}
                    ],
                    legal: [
                        {required: false}
                    ],
                    companyAddress: [
                        {required: false}
                    ],
                    industryCode: [
                        {required: false}
                    ],
                    remark: [
                        {required: false}
                    ]
                },
                industryTypeList: [],//行业分类列表数据
                regionList: [],
                userRegionInfo: {},
                type: 2,
                serviceList: [],
                //areaList: [],   //选择的区域
                orgHistory: [], // 派单历史记录
            }
        },
        created: function () {
            this.getRegionList();//请求区域列表数据
            this.getServiceList();
            this.getIndustryTypeList();//请求行业分类列表数据
            this.initDispatchHistory(); // 获取派单历史记录
        },
        methods: {
            orgSelected(item) {
                this.optMen = item;
            },
            handleSubmit (name) {
                let that = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {

                        if(that.type == 1) {
                            that.savePersonalDispatch();
                        }else if(that.type == 2) {
                            that.saveEnterDispatch();
                        }




                    } else {
                        this.$Message.error('请输入必填项!');
                    }
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
            selService(item, index) {
                this.serviceList[index].check = !this.serviceList[index].check;
            },
            //商机类型
            getServiceList() {
                this.request({
                    url: '/crm/dispatch/serviceList.do'
                }).then(data => {
                    this.serviceList = [];
                    data.forEach((item, index) => {
                        item.check = false;
                        this.serviceList.push(item);
                    })
                })
            },
            searchTYC(){
                if(this.formItem.name == '') {
                    return ;
                }
                this.request({
                    url:'/crm/dispatch/searchLBS.do',
                    data: {
                        name: this.formItem.name
                    }
                }).then(data => {
                    if(data !== null) {
                        this.formItem.name = data.name;
                        this.formItem.phone = data.companyContactsMobile;
                        this.formItem.legal = data.legalRepresentative;
                        this.formItem.industryName = data.industryName;
                        this.formItem.industryCode = data.industryCode;
                        this.formItem.companyAddress = data.companyAddress;
                        /*if(data.provinceCode) {
                            this.formItem.region[0] = data.provinceCode;
                        }
                        if(data.cityCode) {
                            this.formItem.region[1] = data.cityCode;
                        }
                        if(data.areaCode) {
                            this.formItem.region[2] = data.areaCode;
                        }*/
                    }else {
                        this.$Message.success('没有查到结果，输入完整公司名称试试!');
                    }

                })
            },
            selType(val){
                this.type = val;
                this.$refs['formItem'].resetFields();
            },
            /*请求区域列表数据*/
            getRegionList: function () {
                this.request({
                    url: '/crm/myCollection/regionList.do'
                }).then(regionList => {
                    if (regionList && regionList.length > 0) {
                        regionList.splice(0, 1);
                        regionList.push({value: "999999", label: "其他", code: "999999"});
                    }
                    this.regionList = regionList;
                    /*请求用户所在组织区域信息*/
                    /*this.request({
                        url: '/crm/myCollection/userRegionInfo.do'
                    }).then(data => {
                        setTimeout(() => {
                            if(!this.userRegionInfo.code){
                                if (!data || !data.code) {
                                    this.userRegionInfo = {
                                        code: ['999999'],
                                        name: ['其他']
                                    };
                                } else {
                                    this.userRegionInfo = data;
                                }
                                this.formItem.region = this.userRegionInfo.code;

                            }else{
                                let tempCode = this.userRegionInfo.code;
                                let tempName = this.getProvinceName(tempCode);
                                this.userRegionInfo.name = [tempName];
                                this.formItem.region = [tempCode[0]];
                                this.handleChange(tempCode, [{
                                    code: tempCode[0],
                                    label: tempName,
                                    value: tempCode[0]
                                }]);
                            }
                        })
                    })*/
                })
            },
            /*请求下级区域列表数据*/
            loadInferior(item, callback) {
                item.loading = true;
                this.request({
                    url: '/crm/myCollection/loadInferior.do',
                    param: {
                        code: item.value
                    }
                }).then(data => {
                    item.children = data;
                    item.loading = false;
                    callback();
                });
            },
            handleChange: function (value, selectedData) {

            },
            handleReset (name) {
                this.serviceList.forEach(item => {
                    item.check = false;
                })
                this.formItem.region = new Array();
                this.$refs[name].resetFields();
            },
            validatorMobile (rule, value, callback){

                if(this.type == 1) {
                    if (!/^1[2-9][0-9]{9}$/.test(Number(value))) {
                        callback(new Error('请输入正确的移动电话'));
                    } else {
                        callback();
                    }
                }

                if(this.type == 2) {
                    if(value.length>11) {
                        if (!/((\(\d{3,4}\)|\d{3,4}-){1}\d{7,8}$)/.test(value)) {
                            callback(new Error('请输入正确的电话'));
                        } else {
                            callback();
                        }
                    } else {
                        if (!/((\d{3,4})?\d{7,8}$)|((1[2-9]\d{9})$)/.test(value)) {
                            callback(new Error('请输入正确的电话'));
                        } else {
                            callback();
                        }
                    }

                }




            },
            //添加企业派单
            saveEnterDispatch() {
                let that = this;
                if(that.formItem.region.length<2) {
                    this.$Message.error('请选择到二级区域！');
                    return ;
                }
                if(that.optMen.orgId == ''){
                    this.$Message.error('请选择指派的组织！');
                    return ;
                }
                if(that.optMen.userId == '' || that.optMen.userId == undefined) {
                    if (!that.optMen.haveUsers) {
                        this.$Message.error(that.optMen.noUsersTips);
                        return;
                    }
                }
                let datas = {
                    comments: '',
                    enterprise: {},
                    codes: [],
                    orgId:'',
                    userIds:[]
                };

                //指派的组织 和 人
                datas.orgId = that.optMen.orgId;
                datas.userIds.push(that.optMen.userId);

                //备注
                datas.comments = this.formItem.remark;


                //省市区
                datas.enterprise.provinceCode = that.formItem.region[0];
                datas.enterprise.cityCode = that.formItem.region[1];
                datas.enterprise.districtCode = that.formItem.region[2];

                //公司信息
                datas.enterprise.companyAddress = that.formItem.companyAddress;
                datas.enterprise.companyContactsMobile = that.formItem.phone;
                datas.enterprise.name = that.formItem.name;
                datas.enterprise.industryCode = that.formItem.industryCode;
                datas.enterprise.legalRepresentative = that.formItem.legal;


                //服务
                that.serviceList.forEach(item => {
                    if(item.check) {
                        datas.codes.push(item.code);
                    }
                })
                if(datas.codes && datas.codes.length == 0) {
                    this.$Message.error('请选择添加服务！');
                    return
                }


                that.request({
                    url: '/crm/dispatch/addEnterprise.do',
                    data: datas
                }).then(data => {
                    this.cleanOptMen();
                    this.$Message.success('派单成功');
                    that.$refs['formItem'].resetFields();

                    that.formItem.region = new Array();
                    that.serviceList.forEach(item => {
                        item.check = false;
                    })
                })
            },
            //添加个人派单
            savePersonalDispatch() {
                let that = this;
                if(that.formItem.region.length<2) {
                    this.$Message.error('请选择到二级区域');
                    return ;
                }
                if(that.optMen.orgId == ''){
                    this.$Message.error('请选择指派的组织！');
                    return ;
                }
                if(that.optMen.userId == '' || that.optMen.userId == undefined) {
                    if(!that.optMen.haveUsers) {
                        this.$Message.error(that.optMen.noUsersTips);
                        return ;
                    }
                }

                let datas = {
                    comments: '',
                    personal: {},
                    codes: [],
                    orgId:'',
                    userIds:[]
                };

                //指派的组织 和 人
                datas.orgId = that.optMen.orgId;
                datas.userIds.push(that.optMen.userId);

                //备注
                datas.comments = this.formItem.remark;


                //省市区
                datas.personal.provinceCode = that.formItem.region[0];
                datas.personal.cityCode = that.formItem.region[1];
                datas.personal.districtCode = that.formItem.region[2];

                //个人信息
                datas.personal.address = that.formItem.companyAddress;
                datas.personal.mobile = that.formItem.phone;
                datas.personal.name = that.formItem.name;


                //服务
                that.serviceList.forEach(item => {
                    if(item.check) {
                        datas.codes.push(item.code);
                    }
                })


                that.request({
                    url: '/crm/dispatch/addPersonal.do',
                    data: datas
                }).then(data => {
                    this.cleanOptMen();
                    this.$Message.success('派单成功');
                    that.$refs['formItem'].resetFields();

                    that.formItem.region = new Array();
                    that.serviceList.forEach(item => {
                        item.check = false;
                    })
                })
            },
            //清空右侧选择的数据
            cleanOptMen() {
                this.optMen.orgId = '';
                this.optMen.userId = '';
                this.$refs.Dis.search();
            },
            initDispatchHistory() {
                this.request({
                    url: "/crm/clueManagement/dispatch/orgHistory.do",
                }).then((data = []) => {
                    if (!data.length) {
                        return;
                    }
                    for (let item of data) {
                        if (item.operationNote == 1) {
                            item.name = item.org.name;
                        } else {
                            item.name = `${item.org.name} - ${item.user.realName}`;
                        }
                    }
                    this.orgHistory = data;
                });
            },
            /**
             * 定位到组织树相应的组织和人
             * @param item
             */
            toOrgTree(item) {
                this.$refs.Dis.toOrgTree(item);
            }
        },
        components: {
            Dispatch
        }
    };
</script>

<style scoped>
    .foot{
        display: block;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 18px;
        padding-top:30px;
    }
    .tabs{
        display: block;
        /*background-color: #f6f8fa;*/
        height: 40px;
        line-height: 40px;
        /* text-align: center; */
        font-size: 18px;
         margin-top: 20px;
        margin-bottom: 10px;
        padding-left: 250px;
    }
    .tabs span{
        height: 37px;
        line-height: 37px;
        width: 100px;
        display: inline-block;
        cursor: pointer;
        text-align: center;
    }
    .tabs .active{
        border-bottom: 3px solid #59b399;
        color: #59b399;
    }
    .dispatch{
        margin:0 15px;
        background-color: #fff;
        height:auto;
        /*padding-top:15px;*/
        padding-bottom: 50px;
    }
    .head{
        display: block;
        line-height: 30px;
        font-size:18px;
        padding-left:20px;
    }
    .main-left{
        border-right:1px solid #ccc;
        padding-right:20px;
        margin-top:10px;
        height: 465px;
    }
    .main-right {
        padding-left: 20px;
        height: 465px;
        overflow-y: scroll;
    }

    .tag-item{
        border: 1px solid #8c8c8c;
        background-color: #ffffff;
        /*width: 80px;*/
        width:auto;
        padding:0 5px;
        float: left;
        height:25px;
        line-height: 25px;
        text-align: center;
        margin: 5px 5px;
        border-radius: 3px;
        cursor: pointer;
    }
    
    .tag_active{
        border: 1px solid #59b399;
        color: #59b399;
    }
    .industry-type-select >>> .ivu-select-selection {
        max-height: 68px;
        overflow: auto;
    }

    .industry-type-select >>> .ivu-tag-text {
        max-width: 100px;
        overflow: hidden;
        max-height: 25px;
        display: inline-block;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .industry-type-select >>> .ivu-icon-ios-close-empty {
        position: relative;
        top: -7px;
    }
    .faren>>>.ivu-form-item-label:before{
        content: '';
    }
    .region-cascader >>> .ivu-input[readonly]{
        cursor: pointer;
    }
    .dispatchHistory {
        padding: 15px 0;
    }
</style>