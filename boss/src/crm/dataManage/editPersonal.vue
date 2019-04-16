<template>
    <div>
        <errorList :clueId="clueId" style="margin-top: -5px;"></errorList>
        <Row>
            <i-Col span="12">
                <div class="header">联系人信息</div>
                <Form class="basic-info-wrap basic-info-wrap-line" ref="personal" :model="personal" :rules="ruleValidRelated" :label-width="80">
                    <Row>
                        <i-Col span="4">
                            <BSUpload :onSuccess="onSuccessPersonal" :type="['png','jpeg','jpg']">
                                <div class="upload">
                                    <div v-if="!personal.logo">
                                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                        <p style="line-height: 20px;">80px*80px</p>
                                        <p style="line-height: 20px;">支持上传png,jpeg,jpg</p>
                                    </div>
                                    <img :src="$updateConfig.file+personal.logo+'&x-oss-process=image/resize,w_100,h_100/quality,Q_80'" v-else>
                                </div>
                            </BSUpload>
                        </i-Col>
                        <i-Col span="20">
                            <Row>
                                <i-Col span="12">
                                    <Row>
                                        <i-Col span="19">
                                            <FormItem label="姓名" prop="name" :rules="{required: true, message: '姓名不能为空', trigger: 'blur'}">
                                                <Input v-model="personal.name" :maxlength="30"></Input>
                                            </FormItem>
                                        </i-Col>
                                        <i-Col span="5">
                                            <Button class="in-the-query" type="primary" size="small" @click.stop="eyeSearchPersonal(personal.name)">天眼查</Button>
                                        </i-Col>
                                    </Row>
                                </i-Col>
                                <i-Col span="12">
                                    <FormItem label="移动电话" prop="mobile">
                                        <span style="position: absolute; left: -72px; top: 0; font-family: SimSun; font-size: 12px; color: #ed3f14;">*</span>
                                        <Input v-model="personal.mobile"  @on-blur="verifyPersonalMobile(personal)"></Input>
                                        <div class="ivu-form-item-error-tip" v-show="invalidPersonalMobile">{{personalMobileErrorInfo}}</div>
                                    </FormItem>
                                </i-Col>
                            </Row>
                            <Row>
                                <i-Col span="12">
                                    <FormItem label="微信" prop="wechat">
                                        <Input v-model="personal.wechat" :maxlength="20"></Input>
                                    </FormItem>
                                </i-Col>
                                <i-Col span="12">
                                    <FormItem label="固定电话" prop="telephone">
                                        <Input v-model="personal.telephone" :maxlength="12"></Input>
                                    </FormItem>
                                </i-Col>
                            </Row>
                            <Row>
                                <i-Col span="8">
                                    <FormItem label="省份" prop="provinceCode" :rules="{required: true, message: '省份不能为空', trigger: 'change'}">
                                        <Select v-model="personal.provinceCode" filterable @on-change="provinceChange">
                                            <Option v-for="item in provinceList" :value="item.code" :key="item.code" v-if="item.code != '100000'">{{ item.label }}</Option>
                                        </Select>
                                    </FormItem>
                                </i-Col>
                                <i-Col span="8">
                                    <FormItem label="城市" :label-width="50" prop="cityCode" :rules="{required: true, message: '城市不能为空', trigger: 'change'}">
                                        <Select v-model="personal.cityCode" filterable @on-change="cityChange">
                                            <Option v-for="item in cityList" :value="item.code" :key="item.code">{{ item.label }}</Option>
                                        </Select>
                                    </FormItem>
                                </i-Col>
                                <i-Col span="8">
                                    <FormItem label="地区" :label-width="50" prop="districtCode">
                                        <Select v-model="personal.districtCode" filterable>
                                            <Option v-for="item in districtList" :value="item.code" :key="item.code">{{ item.label }}</Option>
                                        </Select>
                                    </FormItem>
                                </i-Col>
                            </Row>
                        </i-Col>
                    </Row>
                    <Row>
                        <i-Col span="24">
                            <FormItem label="地址" prop="address">
                                <Input v-model="personal.address" :maxlength="50"></Input>
                            </FormItem>
                        </i-Col>
                    </Row>
                    <Row>
                        <i-Col span="8">
                            <FormItem label="出生日期" prop="birthday">
                                <DatePicker type="date" :options="verifyBirthday" v-model="personal.birthday" placeholder="选择日期" style="width: 100%"></DatePicker>
                            </FormItem>
                        </i-Col>
                        <i-Col span="8">
                            <FormItem label="邮箱" prop="email">
                                <Input v-model="personal.email" :maxlength="64"></Input>
                            </FormItem>
                        </i-Col>
                        <i-Col span="8">
                            <FormItem label="QQ" prop="qq">
                                <Input v-model="personal.qq" :maxlength="15"></Input>
                            </FormItem>
                        </i-Col>
                    </Row>
                    <Row>
                        <i-Col span="8">
                            <FormItem label="性别" prop="sex">
                                <Select v-model.number="personal.sex" filterable>
                                    <Option v-for="item in sexList" :value="item.code" :key="item.code">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                        </i-Col>
                        <i-col span="16">
                            <FormItem label="兴趣">
                                <Tag type="border" closable @on-close="delInterest(interestList,item)" v-for="(item, index) in interestList" :key="index" v-if="item.type == 5">{{item.name}}</Tag>
                                <Button class="ivu-btn2" icon="ios-plus-empty" type="dashed" size="small" @click="addInterest" v-if="!isAddInterest">添加兴趣</Button>
                                <Input v-model="interestVal" style="width: 200px;" v-if="isAddInterest" :maxlength="10"></Input>
                                <Button size="small" @click="saveInterest(interestVal)" v-if="isAddInterest">确认</Button>
                                <Button size="small" @click="cancelInterest" v-if="isAddInterest">取消</Button>
                            </FormItem>
                        </i-col>
                    </Row>
                    <Row>
                        <i-Col span="24">
                            <FormItem label="描述" prop="remark">
                                <Input v-model="personal.remark" type="textarea" :rows="5" placeholder="请输入描述信息" :maxlength="200"></Input>
                            </FormItem>
                        </i-Col>
                    </Row>
                </Form>
            </i-Col>
            <i-Col span="12">
                <div class="header">
                    <Row>
                        <i-Col span="4">
                            企业基本信息
                        </i-Col>
                        <i-Col span="8">
                            <!--自定义下拉菜单-->
                            <div class="related-hints-menu" v-if="relatedHintsList && relatedHintsList.length > 0" v-clickoutside="handleClose">
                                <Tag type="border" style="width: 100%; height: 32px; padding-top: 3px;" @click.native="isShowRelatedHintsMenu = !isShowRelatedHintsMenu">
                                    <Row>
                                        <i-col span="23">
                                            <span class="related-hints-menu-input-content" :title="relatedHintsName">{{ relatedHintsName }}</span>
                                        </i-col>
                                        <i-col span="1">
                                            <Icon type="arrow-up-b" v-if="isShowRelatedHintsMenu"></Icon>
                                            <Icon type="arrow-down-b" v-else></Icon>
                                        </i-col>
                                    </Row>
                                </Tag>
                                <div class="related-hints-menu-list" v-if="isShowRelatedHintsMenu">
                                    <div v-for="item in relatedHintsList" :key="item.id" @click="selectRelatedHints(item)">
                                        <div class="item" :class="{'active': item.id == relatedHintsState}">
                                            {{item.name}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </i-Col>
                    </Row>
                </div>
                <Form v-if="relatedHintsList && relatedHintsList.length > 0" class="basic-info-wrap" ref="enterprise" :model="enterprise" :rules="ruleValidate" :label-width="80">
                    <Row>
                        <i-Col span="4">
                            <BSUpload :onSuccess="onSuccessEnterprise" :type="['png','jpeg','jpg']">
                                <div class="upload">
                                    <div v-if="!enterprise.logo">
                                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                        <p style="line-height: 20px;">80px*80px</p>
                                        <p style="line-height: 20px;">支持上传png,jpeg,jpg</p>
                                    </div>
                                    <img :src="$updateConfig.file+enterprise.logo+'&x-oss-process=image/resize,w_100,h_100/quality,Q_80'" v-else>
                                </div>
                            </BSUpload>
                        </i-Col>
                        <i-Col span="20" class="basic-info-box">
                            <Row>
                                <i-Col span="12">
                                    <Row>
                                        <i-Col span="19">
                                            <FormItem label="公司名称" prop="name">
                                                <span style="position: absolute; left: -72px; top: 0; font-family: SimSun; font-size: 12px; color: #ed3f14;">*</span>
                                                <Input v-model.trim="enterprise.name" @on-blur="verifyEnterpriseName(enterprise)"></Input>
                                                <div class="ivu-form-item-error-tip" v-show="invalidEnterpriseName">{{enterpriseNameErrorInfo}}</div>
                                            </FormItem>
                                        </i-Col>
                                        <i-Col span="5">
                                            <Button class="in-the-query" type="primary" size="small" @click.stop="eyeSearch(enterprise.name)">天眼查</Button>
                                        </i-Col>
                                    </Row>
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
                                    <FormItem label="省份" :label-width="54" prop="provinceCode" :rules="{required: true, message: '省份不能为空', trigger: 'change'}">
                                        <Select v-model="enterprise.provinceCode" filterable @on-change="provinceRelatedChange">
                                            <Option v-for="item in provinceRelatedList" :value="item.code" :key="item.code" v-if="item.code != '100000'">{{ item.label }}</Option>
                                        </Select>
                                    </FormItem>
                                </i-Col>
                                <i-Col span="8">
                                    <FormItem label="城市" :label-width="50" prop="cityCode" :rules="{required: true, message: '城市不能为空', trigger: 'change'}">
                                        <Select v-model="enterprise.cityCode" filterable @on-change="cityRelatedChange">
                                            <Option v-for="item in cityRelatedList" :value="item.code" :key="item.code">{{ item.label }}</Option>
                                        </Select>
                                    </FormItem>
                                </i-Col>
                                <i-Col span="8">
                                    <FormItem label="地区" :label-width="50" prop="districtCode">
                                        <Select v-model="enterprise.districtCode" filterable>
                                            <Option v-for="item in districtRelatedList" :value="item.code" :key="item.code">{{ item.label }}</Option>
                                        </Select>
                                    </FormItem>
                                </i-Col>
                            </Row>
                        </i-Col>
                    </Row>
                    <Row>
                        <i-Col span="24">
                            <FormItem label="地址" prop="companyAddress">
                                <Input v-model="enterprise.companyAddress" :maxlength="50"></Input>
                            </FormItem>
                        </i-Col>
                    </Row>
                    <Row>
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
                    <Row>
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
                    <Row>
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
                    <Row>
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
                                <Input v-model="enterprise.businessScope" type="textarea" :rows="2" placeholder="请输入描述信息" :maxlength="500"></Input>
                            </FormItem>
                        </i-Col>
                    </Row>
                </Form>
                <div class="none-data" v-else>
                    <img src="../dataManage/images/nodata.png" alt="">
                </div>
            </i-Col>
        </Row>
        <Row>
            <i-Col span="12" style="text-align: right; padding-right: 10px;">
                <Button type="primary" @click="saveEnterprise">保存</Button>
            </i-Col>
            <i-Col span="12" style="padding-left: 10px;">
                <Button type="primary" @click="cancelModify">取消</Button>
            </i-Col>
        </Row>
    </div>
</template>

<script>
    import clickoutside from '@/core/component/directives/clickoutside';
    import errorList from './errorList.vue'; // 错误列表

    export default {
        props: {
            clueId: null
        },
        data: function () {
            return {
                invalidEnterpriseName: false,//企业名称是否有效
                enterpriseNameErrorInfo: '',//企业名称错误信息内容
                invalidPersonalMobile: false,//个人手机号是否有效
                personalMobileErrorInfo: '',//个人手机号错误信息内容
                mainClue: {},//主线索
                personal: {},//主线索-个人线索
                interestList: [],//兴趣列表数据
                interestVal: '',
                isAddInterest: false,//兴趣列表数据
                provinceList: [],//省份列表数据
                cityList: [],//城市列表数据
                districtList: [],//地区列表数据
                sexList: [],//性别列表数据,
                ruleValidRelated: {
                    mobile: [
                        {required: true, message: '移动电话不能为空', trigger: 'blur'},
                        { validator: this.validatorMobile, trigger: 'blur' },
                    ],
                    email:[
                        { type: 'string', message: '请输入正确邮箱格式', pattern:/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/, trigger: 'blur' }
                    ],
                    qq: [
                        { type: 'string', message: '请输入正确 的qq格式',pattern:/^\d{5,15}$/, trigger: 'blur' }
                    ],
                    telephone: [
                        { type: 'string', message: '请输入正确的电话格式',pattern:/(\(\d{3,4}\)|\d{3,4}-|\d{3,4})?\d{7,8}$/, trigger: 'blur' }
                    ]
                },//个人验证
                verifyBirthday: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now() - 86400000;
                    }
                },//出生日期验证
                relatedHintsList: [],//人员线索列表
                relatedHintsState: -1,//选中线索列表状态
                relatedHintsName: '请选择',//选中人员线索列值
                isShowRelatedHintsMenu: false,//显示线索列表下拉菜单
                enterprise: {},//企业线索
                provinceRelatedList: [],//省份列表数据
                cityRelatedList: [],//城市列表数据
                districtRelatedList: [],//地区列表数据
                companyTypeList: [],//公司类型列表数据
                industryTypeList: [],//行业分类列表数据
                enterpriseStatusList: [],//企业状态列表数据
                ruleValidate: {
                    companyContactsMobile: [
                        { required: true, message: '联系电话不能为空', trigger: 'blur' },
                        { type: 'string', message: '请输入正确的联系电话',pattern:/((\(\d{3,4}\)|\d{3,4}-|\d{3,4})?\d{7,8}$)|((1[2-9]\d{9})$)/, trigger: 'blur' }
                    ],
                    companyEmail:[
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
                },//企业验证
            }
        },
        created: function () {
            this.getDetails();//根据线索id查找要修改的相线索详情
            this.getRegionList();//请求省份列表数据
            this.getSexList();//请求性别列表数据
            this.getCompanyTypeList();//公司类型列表数据
            this.getIndustryTypeList();//请求行业分类列表数据
            this.getEnterpriseStatusList();//请求企业状态列表数据
        },
        methods: {
            /*验证公司名称*/
            verifyEnterpriseName(enterprise){
                this.invalidEnterpriseName = false;
                if(enterprise.name == ''){
                    this.invalidEnterpriseName = true;
                    this.enterpriseNameErrorInfo = '公司名称不能为空';
                    return;
                }
                if(enterprise.name == enterprise.oldName) return;
                this.request({
                    url: '/crm/dataManage/isRepeatEnterpriseName.do',
                    param: {
                        id: enterprise.id,
                        name: enterprise.name
                    }
                }).then(data => {
                    if(data){
                        this.invalidEnterpriseName = true;
                        this.enterpriseNameErrorInfo = '公司名称已重复';
                    }
                });
            },
            /*验证个人手机号*/
            verifyPersonalMobile(personal){
                this.invalidPersonalMobile = false;
                if(!/^1[2-9][0-9]{9}$/.test(Number(personal.mobile)) || personal.mobile == '' || personal.mobile == personal.oldMobile) return;
                this.request({
                    url: '/crm/dataManage/isRepeatPersonalMobile.do',
                    param: {
                        id: personal.id,
                        mobile: personal.mobile
                    }
                }).then(data => {
                    if(data){
                        this.invalidPersonalMobile = true;
                        this.personalMobileErrorInfo = '移动电话已重复';
                    }
                });
            },
            /*处理个人后台返回的数据*/
            handlePersonalData (personal, tags) {
                this.cityList = [];
                this.districtList = [];
                this.personal = personal;
                if(this.personal.cityCode){
                    let tempCityCode = this.personal.cityCode;
                    /*请求城市列表数据*/
                    this.request({
                        url: '/crm/myCollection/loadInferior.do',
                        param: {
                            code: this.personal.provinceCode
                        }
                    }).then(data => {
                        this.cityList = data;
                        setTimeout( ()=> {
                            this.personal.cityCode = tempCityCode;
                        })
                    });
                }
                if(this.personal.districtCode){
                    let tempDistrictCode = this.personal.districtCode;
                    /*请求城市列表数据*/
                    this.request({
                        url: '/crm/myCollection/loadInferior.do',
                        param: {
                            code: this.personal.cityCode
                        }
                    }).then(data => {
                        this.districtList = data;
                        setTimeout( ()=> {
                            this.personal.districtCode = tempDistrictCode;
                        })
                    });
                }
                /*标签处理*/
                this.interestList = tags || [];
            },
            /*根据线索id查找要修改的相线索详情*/
            getDetails() {
                this.request({
                    url: '/crm/dataManage/personalDetails.do',
                    param: {
                        hxId: this.clueId
                    }
                }).then(data => {
                    this.mainClue = data.mainClue;
                    this.handlePersonalData (this.mainClue.personal, this.mainClue.tags);
                    this.relatedHintsList = data.relatedHintsList;
                    if(this.relatedHintsList && this.relatedHintsList.length > 0)this.changeRelatedHints(this.relatedHintsList[0]);
                });
            },
            /*上传个人头像*/
            onSuccessPersonal:function(id){
                this.personal.logo = id;
            },
            /*查个人(天眼查)*/
            eyeSearchPersonal: function (key) {
                if(!key.trim()) return;
                key = key || '';
                window.open('https://www.tianyancha.com/humansearch/' + key + '?searchfrom=human');
            },
            /*请求省份列表数据*/
            getRegionList: function () {
                this.request({
                    url: '/crm/myCollection/regionList.do'
                }).then(data => {
                    this.provinceList = data;
                    this.provinceRelatedList = data;
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
            /*请求性别列表数据*/
            getSexList: function () {
                this.request({
                    url: '/crm/myCollection/getSexList.do'
                }).then(sexList => {
                    this.sexList = sexList;
                })
            },
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
                if(val.trim()){
                    let tempSign = true;
                    for(let i=0; i<this.interestList.length; i++){
                        if(this.interestList[i].name == val.trim()) tempSign = false;
                    }
                    if(tempSign){
                        this.interestList.push({
                            hxId: this.hxId || '',
                            name: val.trim(),
                            type: 5
                        });
                        this.interestVal = '';
                        this.isAddInterest = false;
                    }else{
                        this.$Message.warning('不能重复!');
                    }
                }else{
                    this.$Message.warning('不能为空!');
                }
            },
            /*删除添加兴趣*/
            delInterest: function (arr,item) {
                arr.forEach(function (obj, index) {
                    if(obj.name == item.name){
                        arr.splice(index, 1);
                    }
                });
            },
            /*处理企业后台返回的数据*/
            handleEnterpriseData (company) {
                this.cityRelatedList = [];
                this.districtRelatedList = [];
                this.enterprise = company;
                if(this.enterprise.cityCode){
                    let tempCityCode = this.enterprise.cityCode;
                    /*请求城市列表数据*/
                    this.request({
                        url: '/crm/myCollection/loadInferior.do',
                        param: {
                            code: this.enterprise.provinceCode
                        }
                    }).then(data => {
                        this.cityRelatedList = data;
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
                        this.districtRelatedList = data;
                        setTimeout( ()=> {
                            this.enterprise.districtCode = tempDistrictCode;
                        }, 500)
                    });
                }
            },
            /*上传公司头像*/
            onSuccessEnterprise:function(id){
                this.enterprise.logo = id;
            },
            /*查公司(天眼查)*/
            eyeSearch: function (key) {
                if(!key.trim()) return;
                key = key || '';
                window.open('https://www.tianyancha.com/search?key=' + key);
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
                        this.enterprise.state = 100;
                    });
                })
            },
            /*改变关联线索*/
            changeRelatedHints(item){
                if(this.relatedHintsState != item.id){
                    this.relatedHintsState = item.id;
                    this.relatedHintsName = item.name;
                    this.isShowRelatedHintsMenu = false;
                    this.handleEnterpriseData (item.value.company);
                }
            },
            /*选择线索*/
            selectRelatedHints(item){
                this.$refs["enterprise"].validate((valid) => {
                    if (valid && !this.invalidEnterpriseName) {
                        this.invalidEnterpriseName = false;
                        this.changeRelatedHints(item);
                    } else {
                        this.$Message.error('企业信息表单验证失败!');
                    }
                })
            },
            /*手动关闭线索列表下拉菜单*/
            handleClose: function () {
                this.isShowRelatedHintsMenu = false;
            },
            /*省份改变(关联)*/
            provinceRelatedChange: function (code) {
                /*请求城市列表数据*/
                this.request({
                    url: '/crm/myCollection/loadInferior.do',
                    param: {
                        code: code
                    }
                }).then(data => {
                    this.cityRelatedList = data;
                });
            },
            /*城市改变(关联)*/
            cityRelatedChange: function (code) {
                /*请求地区列表数据*/
                this.request({
                    url: '/crm/myCollection/loadInferior.do',
                    param: {
                        code: code
                    }
                }).then(data => {
                    this.districtRelatedList = data;
                });
            },
            /*取消*/
            cancelModify: function () {
                this.callback();
            },
            /*保存*/
            saveEnterprise: function (name) {
                if(this.relatedHintsList && this.relatedHintsList.length > 0){
                    this.$refs["enterprise"].validate((valid) => {
                        if (valid && !this.invalidEnterpriseName) {
                            this.$refs["personal"].validate((valid) => {
                                if (valid && !this.invalidPersonalMobile) {
                                    this.request({
                                        url: '/crm/dataManage/savePersonal.do',
                                        data: {
                                            mainClue: this.mainClue,
                                            personal: this.personal,
                                            relatedHintsList: this.relatedHintsList
                                        }
                                    }).then(data => {
                                        this.$Message.success('保存成功!');
                                        this.callback();
                                    })
                                } else {
                                    this.$Message.error('表单验证失败!');
                                }
                            })
                        } else {
                            this.$Message.error('表单验证失败!');
                        }
                    })
                }else{
                    this.$refs["personal"].validate((valid) => {
                        if (valid && !this.invalidPersonalMobile) {
                            this.request({
                                url: '/crm/dataManage/savePersonal.do',
                                data: {
                                    mainClue: this.mainClue,
                                    personal: this.personal,
                                    relatedHintsList: this.relatedHintsList
                                }
                            }).then(data => {
                                this.$Message.success('保存成功!');
                                this.callback();
                            })
                        } else {
                            this.$Message.error('表单验证失败!');
                        }
                    })
                }

            },
            /*验证*/
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
            },
            validatorMobile (rule, value, callback){
//                if (!/^1(3|5|7|8|9)[0-9]{9}$/.test(Number(value))) {
                if (!/^1[2-9][0-9]{9}$/.test(Number(value))) {
                    callback(new Error('请输入正确的移动电话'));
                } else {
                    callback();
                }
            }
        },
        directives: {
            clickoutside
        },
        components: {
            errorList,
        }
    };
</script>

<style scoped>
    .header{
        height: 50px;
        line-height: 50px;
        font-weight: bold;
        font-size: 15px;
        background: #f6f8fa;
        border-bottom: 1px solid #efefef;
    }
    /*自定义下拉菜单*/
    .related-hints-menu {
        position: relative;
        font-size: 12px;
    }

    .related-hints-menu .related-hints-menu-list {
        width: 100%;
        position: absolute;
        left: 0;
        top: 45px;
        background: #fff;
        z-index: 10;
        border-radius: 6px;
        border: 1px solid #bbbbbb;
        max-height: 210px;
        overflow: auto
    }

    .related-hints-menu .item {
        margin: 0;
        line-height: normal;
        padding: 7px 16px;
        clear: both;
        color: #495060;
        white-space: nowrap;
        list-style: none;
        transition: background .2s ease-in-out;
        cursor: pointer;
    }

    .related-hints-menu .item:hover {
        background: #f3f3f3;
    }

    .related-hints-menu .item.active {
        color: #fff;
        background: #59b399;
    }
    .related-hints-menu-input-content {
        display: block;
        width: 154px;
        height: 30px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }



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
        padding: 10px 10px 0;
        position: relative;
    }
    .basic-info-wrap-line::after{
        content: '';
        display: inline-block;
        position: absolute;
        height: calc(100% - 24px);
        border-right:1px dotted #59b399;
        right: 0;
        top: 0;
    }
    .basic-info-box .ivu-form-item{
        padding-left: 20px;
    }
    .describe-wrap{
        padding: 20px 60px 0;
    }
    .in-the-query{
        margin: 4px 0 0 4px;
    }
    .ivu-btn2 {
        color: #59b399;
        background:#fff;
        border-color: #59b399;
        border-radius: 3px;
        font-size: 12px;
        font-weight: 700;
    }
    .none-data{
        padding-top: 120px;
        text-align: center;
    }
</style>