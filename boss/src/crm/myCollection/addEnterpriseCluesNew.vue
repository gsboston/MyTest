<template>
    <div @click="clickDivWrap">
        <Form ref="enterprise" :model="enterprise" :rules="ruleValidate" :label-width="80">
            <Row>
                <i-Col span="24">
                    <Button type="primary" class="in-the-query" @click.stop="eyeSearch(enterprise.name)">天眼查询</Button>
                </i-Col>
            </Row>
            <!--基本信息-->
            <Row class="basic-info-wrap">
                <i-Col span="4">
                    <BSUpload :beforeUpload="beforeUpload" :onSuccess="onSuccess" :type="['png','jpeg','jpg']">
                        <div class="upload">
                            <div v-if="!logo">
                                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                <p style="line-height: 20px;">80px*80px</p>
                                <p style="line-height: 20px;">支持上传png,jpeg,jpg</p>
                            </div>
                            <img :src="logo+'&x-oss-process=image/resize,w_100,h_100/quality,Q_80'" v-else>
                        </div>
                    </BSUpload>
                </i-Col>
                <i-Col span="20" class="basic-info-box">
                    <Row>
                        <i-Col span="12">
                            <FormItem label="公司名称" prop="name" :rules="{required: true, message: '公司名称不能为空', trigger: 'blur'}" class="enterprise-name-wrap">
                                <Input class="name" v-model.trim="enterprise.name" :disabled="isDisable" @on-change="companyNameChange(enterprise.name)" :maxlength="200"></Input>
                                <div class="enterprise-name-box" v-show="isShow">
                                    <a href="javascript:;" class="item" v-for="item in companyNameList" @click="selectCompanyName(item)">{{ item.name }}</a>
                                </div>
                            </FormItem>
                        </i-Col>
                        <i-Col span="12">
                            <FormItem label="企业类型" prop="type">
                                <Select v-model="enterprise.type" filterable>
                                    <Option v-for="item in companyTypeList" :value="item.code" :key="item.code">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                        </i-Col>
                    </Row>
                    <Row>
                        <i-Col span="12">
                            <FormItem label="联系电话" prop="companyContactsMobile">
                                <Input v-model="enterprise.companyContactsMobile" :maxlength="13"></Input>
                            </FormItem>
                        </i-Col>
                        <i-Col span="12">
                            <FormItem label="企业邮箱" prop="companyEmail">
                                <Input v-model="enterprise.companyEmail" :maxlength="64"></Input>
                            </FormItem>
                        </i-Col>
                    </Row>
                    <Row>
                        <i-Col span="8">
                            <FormItem label="省份" prop="provinceCode" :rules="{required: true, message: '省份不能为空', trigger: 'change'}">
                                <Select v-model="enterprise.provinceCode" filterable @on-change="provinceChange">
                                    <Option v-for="item in provinceList" :value="item.code" :key="item.code" v-if="item.code != '100000'">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                        </i-Col>
                        <i-Col span="8">
                            <FormItem label="城市" prop="cityCode" :rules="{required: true, message: '城市不能为空', trigger: 'change'}">
                                <Select v-model="enterprise.cityCode" filterable @on-change="cityChange">
                                    <Option v-for="item in cityList" :value="item.code" :key="item.code">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                        </i-Col>
                        <i-Col span="8">
                            <FormItem label="地区" prop="districtCode">
                                <Select v-model="enterprise.districtCode" filterable>
                                    <Option v-for="item in districtList" :value="item.code" :key="item.code">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                        </i-Col>
                    </Row>
                </i-Col>
            </Row>
            <Row class="basic-info-wrap">
                <i-Col span="24">
                    <FormItem label="地址" prop="companyAddress">
                        <Input v-model="enterprise.companyAddress" :maxlength="50"></Input>
                    </FormItem>
                </i-Col>
            </Row>
            <Row class="basic-info-wrap">
                <i-Col span="8">
                    <FormItem label="法人代表" prop="legalRepresentative">
                        <Input v-model="enterprise.legalRepresentative" :maxlength="30"></Input>
                    </FormItem>
                </i-Col>
                <i-Col span="8">
                    <FormItem label="所属行业" prop="industryCode">
                        <Select v-model="enterprise.industryCode" filterable>
                            <Option v-for="item in industryTypeList" :value="item.code" :key="item.code">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                </i-Col>
                <i-Col span="8">
                    <FormItem label="网址" prop="companyWebSite">
                        <Input v-model="enterprise.companyWebSite" :maxlength="64"></Input>
                    </FormItem>
                </i-Col>
            </Row>
            <Row class="basic-info-wrap">
                <i-Col span="8">
                    <FormItem label="注册时间" prop="foundingTime">
                        <DatePicker type="date" v-model="enterprise.foundingTime" placeholder="选择日期" style="width: 100%"></DatePicker>
                    </FormItem>
                </i-Col>
                <i-Col span="7">
                    <FormItem label="注册资本" prop="registeredCapital">
                        <Input v-model="enterprise.registeredCapital" :maxlength="7"></Input>
                    </FormItem>
                </i-Col>
                <i-Col span="1">
                    <span style="line-height: 32px;">万元</span>
                </i-Col>
                <i-Col span="8">
                    <FormItem label="社会信用码" prop="socialCreditCode" :rules="{type: 'string',pattern:/^[a-zA-Z0-9]{15,18}$/,message:'输入15-18位数字或字母组合',trigger:'change'}">
                        <Input v-model="enterprise.socialCreditCode" :maxlength="18"></Input>
                    </FormItem>
                </i-Col>
            </Row>
            <Row class="basic-info-wrap">
                <i-Col span="8">
                    <FormItem label="注册号" prop="registerCode" :rules="{type: 'string',pattern:/^[a-zA-Z0-9]{15,18}$/,message:'请输入15-18位数字或字母组合',trigger:'change'}">
                        <Input v-model="enterprise.registerCode" :maxlength="18" ></Input>
                    </FormItem>
                </i-Col>
                <i-Col span="8">
                    <FormItem label="组织机构码" prop="taxCode" :rules="{type: 'string',pattern:/^[a-zA-Z0-9]{9,18}$/,message:'请输入9-18位数字或字母组合',trigger:'change'}">
                        <Input v-model="enterprise.taxCode" :maxlength="18"></Input>
                    </FormItem>
                </i-Col>
                <i-Col span="8">
                    <FormItem label="企业状态" prop="state">
                        <Select v-model="enterprise.state" filterable>
                            <Option v-for="item in enterpriseStatusList" :value="item.code" :key="item.code">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                </i-Col>
            </Row>
            <Row class="basic-info-wrap">
                <i-Col span="7">
                    <FormItem label="人员规模" prop="staffSize">
                        <Input v-model="enterprise.staffSize" :maxlength="6"></Input>
                    </FormItem>
                </i-Col>
                <i-Col span="1">
                    <span style="line-height: 32px;">&nbsp;&nbsp;人</span>
                </i-Col>
                <i-Col span="16">
                    <FormItem label="经营范围" prop="businessScope">
                        <Input v-model="enterprise.businessScope" type="textarea" :rows="1" placeholder="请输入描述信息" :maxlength="500"></Input>
                    </FormItem>
                </i-Col>
            </Row>
            <FormItem>
                <Row style="text-align: center; margin-top: -4px; padding-right: 80px;">
                    <i-Col span="24" v-if="!hxId">
                        <Button type="primary" @click="saveEnterprise('enterprise')">保存</Button>
                        <Button type="primary" @click="handleReset('enterprise')" >重置</Button>
                    </i-Col>
                    <i-Col span="24" v-else>
                        <Button type="primary" @click="confirm('enterprise')">修改</Button>
                        <Button type="primary" @click="cancelModify" v-if="!addFlagOld">取消</Button>
                        <Button type="primary" @click="continueAdd" v-if="addFlagOld">继续新增</Button>
                    </i-Col>
                </Row>
            </FormItem>
        </Form>
    </div>
</template>

<script>

    export default {
        props: {
            addFlagOld: null,
            addFlag: null,
            clueId: null,
            addType: null
        },
        data: function () {
            return {
                logo: '',
                enterprise: {
                    logo: '',
                    name: '',
                    type: '',
                    companyContactsMobile: '',
                    companyEmail: '',
                    industryCode: '',
                    legalRepresentative: '',
                    companyWebSite: '',
                    companyAddress: '',
                    foundingTime: '',
                    registeredCapital: '',
                    socialCreditCode: '',
                    registerCode: '',
                    taxCode: '',
                    state: 100,
                    staffSize: '',
                    businessScope: '',
                    provinceCode: '',
                    cityCode: '',
                    districtCode: ''
                },
                companyNameList: [],
                companyTypeList: [],//公司类型列表数据
                industryTypeList: [],//行业分类列表数据
                enterpriseStatusList: [],//企业状态列表数据
                provinceList: [],//省份列表数据
                cityList: [],//城市列表数据
                districtList: [],//地区列表数据
                isShow: false,
                isDisable: false,//是否禁用
                clue: {},//线索
                hxId: '',//线索id
                ruleValidate: {
                    companyContactsMobile: [
                        { required: true, message: '联系电话不能为空', trigger: 'blur' },
                        //{ validator: this.validatorMobile, trigger: 'blur' },
                        { type: 'string', message: '请输入正确的联系电话',pattern:/((\(\d{3,4}\)|\d{3,4}-|\d{3,4})?\d{7,8}$)|((1[2-9]\d{9})$)/, trigger: 'blur' }
                    ],
                    companyEmail:[
//                        { type: 'email', message: '请输入正确邮箱格式', trigger: 'blur' }
                        { type: 'string', message: '请输入正确邮箱格式', pattern:/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/, trigger: 'blur' }
                    ],
                    companyWebSite:[
                        { type: 'string', message: '请输入正确网址格式',pattern:/^((https|http):\/\/)?(([0-9a-z_!~*'().&=+$%-]+:)?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)$/, trigger: 'blur' }
                    ],
                    registeredCapital:[
                        {validator: this.validatorRegisteredCapital, trigger: 'blur' }
                    ],
                    staffSize:[
                        {validator: this.validatorStaffSize, trigger: 'blur' }
                    ]
                },
                companyNameTimer: null, // 公司名称实时搜索变量，防止下拉数据错误显示
                isAddTypeCollection: false, // 是否是从线索跳转而来，默认否
            }
        },
        created: function () {
            this.isAddTypeCollection = this.addType === 'collection';

            this.getCompanyTypeList();//公司类型列表数据
            this.getIndustryTypeList();//请求行业分类列表数据
            this.getEnterpriseStatusList();//请求企业状态列表数据
            this.getRegionList();//请求省份列表数据
            if(!this.addFlag){
//                this.isDisable = true;
                this.hxIdGetClue(this.clueId);
            }
        },
        methods: {
            confirm (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Modal.confirm({
                            title: '确认对话框',
                            content: '<p>请核实是否真的要修改该信息？</p>',
                            onOk: () => {
                                this.modify('enterprise');
                            },
                            onCancel: () => {
//                        this.$Message.info('点击了取消');
                            }
                        });
                    }
                })
            },
            cancelModify: function () {
                this.$emit('closeClues');
            },
            foundingTimeChange: function () {
//                console.log(a);
//                console.log(this.enterprise.foundingTime);
            },
            eyeSearch: function (key) {
                if(!key.trim()) return;
                key = key || '';
                window.open('https://www.tianyancha.com/search?key=' + key);
            },
            /*上传*/
            beforeUpload:function(){
//                alert("我要上传了");
            },
            onSuccess:function(id){
                this.logo = this.$updateConfig.file+id;
//                alert("我上传的文件是"+id);
                this.enterprise.logo = id;
            },
            /*处理保存成功后后台返回的数据*/
            handleDate (data) {
//                console.log(data);
                this.cityList = [];
                this.districtList = [];
                this.clue = data;


                this.enterprise = data.company;

//                if(this.enterprise.industryCode)this.enterprise.industryCode = Number(this.enterprise.industryCode);
                /*if(!this.enterprise.registeredCapital)
                {
                    this.enterprise.registeredCapital = '-';
                }else {*/
                    this.enterprise.registeredCapital = Number(this.enterprise.registeredCapital) / 10000;
                /*}*/
               /* if(!this.enterprise.staffSize)
                {
                    this.enterprise.staffSize = '-';
                }*/

                this.hxId = this.enterprise.hxId;
                if(this.enterprise.logo)this.logo = this.$updateConfig.file+this.enterprise.logo;
                if(this.enterprise.cityCode){
                    let tempCityCode = this.enterprise.cityCode;
                    /*请求城市列表数据*/
                    this.request({
                        url: '/crm/myCollection/loadInferior.do',
                        param: {
                            code: this.enterprise.provinceCode
                        }
                    }).then(data => {
                        this.cityList = data;
                        setTimeout( ()=> {
                            this.enterprise.cityCode = tempCityCode;
                        })
                    });
                }
                if(this.enterprise.districtCode){
                    let tempDistrictCode = this.enterprise.districtCode;
                    /*请求城市列表数据*/
                    this.request({
                        url: '/crm/myCollection/loadInferior.do',
                        param: {
                            code: this.enterprise.cityCode
                        }
                    }).then(data => {
                        this.districtList = data;
                        setTimeout( ()=> {
                            this.enterprise.districtCode = tempDistrictCode;
                        })
                    });
                }

//                if(!this.enterprise.type)this.enterprise.type = '';
            },
            /*根据输入的公司名称向后台查找相关公司*/
            companyNameChange: function (name) {
                if (!/[\u4e00-\u9fa5]/.test(name) && name.length < 5) {
                    this.companyNameList = [];
                    this.isShow = false;
                    return;
                }
                if(!name) {
                    this.companyNameList = [];
                    this.isShow = false;
                    return;
                }
                let timestamp = new Date().getTime();
                this.companyNameTimer = timestamp;
                let current = timestamp;
                this.request({
                    url: '/crm/myCollection/companyNameList.do',
                    param: {
                        name: name
                    }
                }).then(companyNameList => {
                    if(this.companyNameTimer === current){
                        this.companyNameList = companyNameList;
                        if(this.companyNameList.length > 0) this.isShow = true;
                    }
                });
            },
            selectCompanyName: function (item) {
                if(item.isCreateYouself){
                    this.hxIdGetClue(item.hxId);
                }else {
                    let tempObj = {
                        name: item.name,
                        provinceCode: item.provinceCode
                    };
                    this.$emit('searchByName', tempObj);
                }
            },
            /*根据线索id查找相关线索*/
            hxIdGetClue: function (hxId) {
                this.request({
                    url: '/crm/myCollection/enterprise.do',
                    param: {
                        hxId: hxId
                    }
                }).then(data => {
                    this.isDisable = true;
                    this.handleReset('enterprise');
                    this.handleDate(data);
//                    this.$Message.success('获取信息成功!');
                });
            },
            /*请求公司类型列表数据*/
            getCompanyTypeList: function () {
                this.request({
                    url: '/crm/myCollection/companyTypeList.do'
                }).then(companyTypeList => {
                    this.companyTypeList = companyTypeList;
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
            /*请求企业状态列表数据*/
            getEnterpriseStatusList: function () {
                this.request({
                    url: '/crm/myCollection/enterpriseStatusList.do'
                }).then(enterpriseStatusList => {
                    this.enterpriseStatusList = enterpriseStatusList;
                    setTimeout( ()=> {
                        this.enterprise.state = this.enterprise.state;
                    });
                })
            },
            /*请求省份列表数据*/
            getRegionList: function () {
                this.request({
                    url: '/crm/myCollection/regionList.do'
                }).then(data => {
                    this.provinceList = data;
                })
            },
            /*省份改变*/
            provinceChange: function (code) {
                /*请求城市列表数据*/
                this.request({
                    url: '/crm/myCollection/loadInferior.do',
                    param: {
                        code: code
                    }
                }).then(data => {
                    this.cityList = data;
                });
            },
            /*城市改变*/
            cityChange: function (code) {
                /*请求地区列表数据*/
                this.request({
                    url: '/crm/myCollection/loadInferior.do',
                    param: {
                        code: code
                    }
                }).then(data => {
                    this.districtList = data;
                });
            },
            /*点击最外层关闭自定义下拉菜单*/
            clickDivWrap: function () {
                this.isShow = false;
            },
            /*重置*/
            handleReset (name) {
                this.logo = '';
                this.$refs[name].resetFields();
            },
            /*保存*/
            saveEnterprise: function (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.request({
                            url: '/crm/myCollection/saveEnterprise.do',
                            data: {
                                enterprise: this.enterprise,
                                addType: this.addType || ''
                            }
                        }).then(data => {
                            this.isDisable = true;
                            this.handleReset('enterprise');
                            this.handleDate(data);
                            this.$emit('refreshData');
                            if (!this.isAddTypeCollection) {
                                this.$Message.success({
                                    content: '线索新增成功，如有需要请收藏!',
                                    duration: 2
                                });
                            } else {
                                this.$Message.success({
                                    content: '线索新增成功，请新增商机!',
                                    duration: 2
                                });
                            }
                        })
                    } else {
//                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            /*修改*/
            modify: function (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.request({
                            url: '/crm/myCollection/modifyEnterprise.do',
                            data: {
                                clue: this.clue,
                                enterprise: this.enterprise
                            }
                        }).then(data => {
                            this.isDisable = true;
                            this.handleReset('enterprise');
                            this.handleDate(data);
                            this.$emit('refreshData');
                            this.$Message.success({
                                content: '修改成功!',
                                duration: 2
                            });
                        })
                    } else {
//                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            /*继续新增*/
            continueAdd: function () {
                this.handleReset('enterprise');
                this.isDisable = false;
                this.hxId = '';
            },
            validatorMobile (rule, value, callback){
//                if (!/^1(3|5|7|8|9)[0-9]{9}$/.test(Number(value))) {
                if (!/^((\d{3}-\d{8}|\d{4}-\{7,8})|(1[2-9]\d{9}))$/.test(Number(value))) {
                    callback(new Error('请输入正确的联系电话'));
                } else {
                    callback();
                }
            },
            validatorStaffSize (rule, value, callback){
                if(value == null)value='';
                if ((value != '') && !/^\+?[1-9][0-9]*$/.test(value)) {
                    callback(new Error('请输入正确的人员规模'));
                } else {
                    callback();
                }
            },
            validatorRegisteredCapital (rule, value, callback){
                if(value == null)value='';
                if (value != '' && (!/^\d+(\.\d+)?$/.test(value) || Number(value) == 0)) {
                    callback(new Error('请输入正确的注册资本'));
                } else {
                    callback();
                }
            }
        }
    };
</script>

<style scoped>
    /*上传*/
    .upload{
        width: 130px;
        height: 130px;
        border: 1px dotted #ccc;
        text-align: center;
        cursor: pointer;
    }
    .upload div{
        padding-top: 15px;
    }
    .upload img{
        width: 100%;
        height: 100%;
    }
    .basic-info-wrap{
        padding: 0 60px;
    }
    .basic-info-box .ivu-form-item{
        padding-left: 20px;
    }
    .describe-wrap{
        padding: 20px 60px 0;
    }
    .in-the-query{
        float: right;
        margin: 0 60px 10px 0;
    }
    .enterprise-name-wrap{
        position: relative;
    }
    .enterprise-name-box{
        width: 100%;
        position: absolute;
        left: 0;
        top: 34px;
        background: #fff;
        border-radius: 5px;
        z-index: 1;
        border: 1px solid #ccc;
        max-height: 210px;
        overflow-x: hidden;
        overflow-y: scroll;
    }
    .enterprise-name-box .item{
        padding: 0 5px;
        width: 100%;
        display: block;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .enterprise-name-box .item:hover{
        background: #bbb;
    }
</style>