<template>
    <div @click="clickDivWrap">
        <Form ref="personal" :model="personal" :rules="ruleValidate" :label-width="80">
            <Row>
                <i-Col span="24">
                    <Button type="primary" class="in-the-query" @click.stop="eyeSearch(personal.name)">天眼查询</Button>
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
                            <FormItem label="姓名" prop="name" :rules="{required: true, message: '姓名不能为空', trigger: 'blur'}">
                                <Input v-model="personal.name" :maxlength="30"></Input>
                            </FormItem>
                        </i-Col>
                        <i-Col span="12">
                            <FormItem label="移动电话" prop="mobile" class="enterprise-name-wrap">
                                <Input class="name" :maxlength="11" v-model="personal.mobile" :disabled="isDisable" @on-change="mobileChange(personal.mobile)"></Input>
                                <div class="enterprise-name-box" v-show="isShow">
                                    <a href="javascript:;" class="item" v-for="item in mobileList" @click="selectMobile(item)">{{ item.name + '    ' + item.mobile }}</a>
                                </div>
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
                            <FormItem label="城市" prop="cityCode" :rules="{required: true, message: '城市不能为空', trigger: 'change'}">
                                <Select v-model="personal.cityCode" filterable @on-change="cityChange">
                                    <Option v-for="item in cityList" :value="item.code" :key="item.code">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                        </i-Col>
                        <i-Col span="8">
                            <FormItem label="地区" prop="districtCode">
                                <Select v-model="personal.districtCode" filterable>
                                    <Option v-for="item in districtList" :value="item.code" :key="item.code">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                        </i-Col>
                    </Row>
                </i-Col>
            </Row>
            <Row class="basic-info-wrap">
                <i-Col span="24">
                    <FormItem label="地址" prop="address">
                        <Input v-model="personal.address" :maxlength="50"></Input>
                    </FormItem>
                </i-Col>
            </Row>
            <Row class="basic-info-wrap">
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
                <i-Col span="8">
                    <FormItem label="出生日期" prop="birthday">
                        <DatePicker type="date" :options="verifyBirthday" v-model="personal.birthday" placeholder="选择日期" style="width: 100%"></DatePicker>
                    </FormItem>
                </i-Col>
            </Row>
            <Row class="basic-info-wrap">
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
            <Row class="basic-info-wrap">
                <i-Col span="24">
                    <FormItem label="描述" prop="remark">
                        <Input v-model="personal.remark" type="textarea" :rows="3" placeholder="请输入描述信息" :maxlength="200"></Input>
                    </FormItem>
                </i-Col>
            </Row>
            <FormItem>
                <Row style="text-align: center; margin-top: -4px; padding-right: 80px;">
                    <i-Col span="24" v-if="!hxId">
                        <Button type="primary" @click="savePersonal('personal')">保存</Button>
                        <Button type="primary" @click="handleReset('personal')" >重置</Button>
                    </i-Col>
                    <i-Col span="24" v-else>
                        <Button type="primary" @click="confirm('personal')">修改</Button>
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
                verifyBirthday: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now() - 86400000;
                    }
                },
                logo: '',
                personal: {
                    logo: '',
                    name: '',
                    mobile: '',
                    wechat: '',
                    telephone: '',
                    email: '',
                    qq: '',
                    birthday: '',
                    address: '',
                    remark: '',
                    provinceCode: '',
                    cityCode: '',
                    districtCode: '',
                    sex: ''
                },
                mobileList: [],
                sexList: [],//性别列表数据,
                provinceList: [],//省份列表数据
                cityList: [],//城市列表数据
                districtList: [],//地区列表数据
                isShow: false,
                isDisable: false,//是否禁用
                clue: {},//线索
                hxId: '',//线索id
                interestList: [],//兴趣列表数据
                interestVal: '',
                isAddInterest: false,//兴趣列表数据
                ruleValidate: {
                    mobile: [
                        {required: true, message: '移动电话不能为空', trigger: 'blur'},
                        { validator: this.validatorMobile, trigger: 'blur' },
                    ],
                    email:[
//                        { type: 'email', message: '请输入正确邮箱格式', trigger: 'blur' }
                        { type: 'string', message: '请输入正确邮箱格式', pattern:/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/, trigger: 'blur' }
                    ],
                    qq: [
                        { type: 'string', message: '请输入正确 的qq格式',pattern:/^\d{5,15}$/, trigger: 'blur' }
                    ],
                    telephone: [
                        { type: 'string', message: '请输入正确的电话格式',pattern:/(\(\d{3,4}\)|\d{3,4}-|\d{3,4})?\d{7,8}$/, trigger: 'blur' }
                    ]
                },
                isAddTypeCollection: false, // 是否是从线索跳转而来，默认否
            }
        },
        created: function () {
            this.isAddTypeCollection = this.addType === 'collection';

            this.getRegionList();//请求省份列表数据
            this.getSexList();
            if(!this.addFlag){
                this.hxId = this.clueId
                this.hxIdGetClue(this.hxId);
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
                                this.modify('personal');
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
//                    debugger
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
            eyeSearch: function (key) {
                if(!key.trim()) return;
                key = key || '';
                window.open('https://www.tianyancha.com/humansearch/' + key + '?searchfrom=human');
            },
            /*上传*/
            beforeUpload:function(){
            },
            onSuccess:function(id){
                this.logo = this.$updateConfig.file+id;
                this.personal.logo = id;
            },
            /*处理保存成功后后台返回的数据*/
            handleDate (data) {
//                console.log(data);
                this.cityList = [];
                this.districtList = [];
                this.clue = data;
                this.personal = data.personal;
                this.hxId = this.personal.hxId;
                if(this.personal.logo)this.logo = this.$updateConfig.file+this.personal.logo;
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
                this.interestList = data.tags || [];
            },
            /*根据输入的手机号查找相关线索信息*/
            mobileChange: function (mobile) {
                if(!mobile || mobile.length != 11) {
                    this.mobileList = [];
                    this.isShow = false;
                    return;
                }

                this.request({
                    url: '/crm/myCollection/mobileList.do',
                    param: {
                        mobile: mobile
                    }
                }).then(mobileList => {
                    this.mobileList = mobileList;
                    if(this.mobileList.length > 0) this.isShow = true;
                });
            },
            selectMobile: function (item) {
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
                    this.handleReset('personal');
                    this.handleDate(data);
                });
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
            /*请求性别列表数据*/
            getSexList: function () {
                this.request({
                    url: '/crm/myCollection/getSexList.do'
                }).then(sexList => {
                    this.sexList = sexList;
                })
            },
            /*重置*/
            handleReset (name) {
                this.interestList = [];
                this.cancelInterest();
                this.logo = '';
                this.$refs[name].resetFields();
            },
            /*保存*/
            savePersonal: function (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.request({
                            url: '/crm/myCollection/savePersonal.do',
                            data: {
                                personal: this.personal,
                                interestList: this.interestList,
                                addType: this.addType || ''
                            }
                        }).then(data => {
                            this.isDisable = true;
                            this.handleReset('personal');
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
                });
            },
            /*修改*/
            modify: function (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.request({
                            url: '/crm/myCollection/modifyPersonal.do',
                            data: {
                                clue: this.clue,
                                personal: this.personal,
                                interestList: this.interestList
                            }
                        }).then(data => {
                            this.isDisable = true;
                            this.handleReset('personal');
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
                this.handleReset('personal');
                this.interestList = [];
                this.isDisable = false;
                this.hxId = '';
            },
            validatorMobile (rule, value, callback){
//                if (!/^1(3|5|7|8|9)[0-9]{9}$/.test(Number(value))) {
                if (!/^1[2-9][0-9]{9}$/.test(Number(value))) {
                    callback(new Error('请输入正确的移动电话'));
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
    }
    .enterprise-name-box .item{
        padding: 0 5px;
        width: 100%;
        display: block;
        color: #333;
    }
    .enterprise-name-box .item:hover{
        background: #bbb;
    }
    .ivu-btn2 {
        color: #59b399;
        background:#fff;
        border-color: #59b399;
        border-radius: 3px;
        font-size: 12px;
        font-weight: 700;
    }
</style>