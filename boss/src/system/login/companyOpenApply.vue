<style scoped xmlns="http://www.w3.org/1999/html">
    .container {
        width: 1000px;
        margin: 0 auto;
        padding: 15px 15px 30px 15px;
        background: white;
        border-radius: 5px;
        box-shadow: 1px 2px 2px 3px rgba(175, 175, 175, 0.5);
    }
    .logo {
        position: relative;
        left: -210px;
        margin: 0 auto;
        width: 570px;
        padding: 0 0 10px 0;
        line-height: 50px;
        color: white;
    }
    .logo > img {
        height: 52px;
        vertical-align: middle;
    }
    .logo > span {
        font-size: 14px;
        line-height: 50px;
        vertical-align: middle;
    }
    .title {
        display: inline-block;
        color: #666666;
        font-size: 30px;
        position: relative;
        margin-left: 20px;
        top: 7px;
    }
    .location{
        display: inline-block;
        width: 200px;
    }
    .location >>> .ivu-form-item-content{
        margin-left: 1px !important;
    }
    .cityInfo >>> .ivu-form-item-error-tip{
        margin-left: 10px;
    }
    .areaInfo >>> .ivu-form-item-error-tip{
        margin-left: 20px;
    }
    #crumbs {
        text-align: center;
        margin-top: 10px;
        margin-bottom: 40px;
    }
    #crumbs ul {
        list-style: none;
        display: inline-table;
    }
    #crumbs ul li{
        display: inline;
    }
    #crumbs ul li{
        display: block;
        float: left;
        height: 50px;
        line-height: 50px;
        background: #f1f2f7;
        text-align: center;
        padding: 0 20px 0 50px;
        position: relative;
        margin: 0 10px 0 0;
        font-size: 18px;
        color: black;
    }
    #crumbs ul li.current{
        display: block;
        float: left;
        height: 50px;
        line-height: 50px;
        background: #59b399;
        text-align: center;
        padding: 0 20px 0 50px;
        position: relative;
        margin: 0 10px 0 0;
        font-size: 18px;
        color: white;
    }
    #crumbs ul li:after {
        content: "";
        border-top: 25px solid transparent;
        border-bottom: 25px solid transparent;
        border-left: 30px solid #f1f2f7;
        position: absolute;
        right: -30px;
        top: 0;
        z-index: 1;
    }
    #crumbs ul li.current:after {
        content: "";
        border-top: 25px solid transparent;
        border-bottom: 25px solid transparent;
        border-left: 30px solid #59b399;
        position: absolute;
        right: -30px;
        top: 0;
        z-index: 1;
    }
    #crumbs ul li:before {
        content: "";
        border-top: 25px solid transparent;
        border-bottom: 25px solid transparent;
        border-left: 30px solid white;
        position: absolute;
        left: 0;
        top: 0;
    }
    #crumbs ul li:first-child:before {
        display: none;
    }
    #crumbs ul li:last-child:after {
        display: none;
    }
    .check-num{
        height: 33px
    }
    .check-num >>> .ivu-form-item-error-tip{
        top: 32px;
    }
    .applySex >>>.ivu-form-item-label:before {
        content: '*';
        display: inline-block;
        margin-right: 4px;
        line-height: 1;
        font-family: SimSun;
        font-size: 12px;
        color: #ed3f14;
    }
</style>

<template>
    <div style="height: 100%;background: #e0e0e0;overflow: auto">
        <div class="logo">
            <img src="./img/boss_logo.png"/>
            <div class="title">
                <span>企业开通申请</span>
            </div>
        </div>

        <div class="container">
            <div id="crumbs">
                <ul>
                    <li v-for="(stepInfo,index) in step" :class="{current:stepNum==index}">{{stepInfo.name}}</li>
                </ul>
            </div>
            <!-- 1.填写手机号-->
            <Form ref="phoneForm" :model="phoneItem" :label-width="100" :rules="phoneRules" v-if="stepNum==0" style="margin-top: 10px">
                <FormItem label="申请人姓名" prop="applyName">
                    <Input :maxlength="50" style="width: 200px" v-model="phoneItem.applyName" placeholder="请输入申请人姓名" />
                </FormItem>
                <FormItem label="申请人性别" class="applySex">
                    <RadioGroup v-model="phoneItem.applySex">
                        <Radio label="1">男</Radio>
                        <Radio label="0">女</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="手机号码" prop="phoneNum">
                    <Input :maxlength="50" style="width: 200px" v-model="phoneItem.phoneNum" placeholder="请输入申请人手机号码" />
                </FormItem>
                <FormItem v-if="imageCodeIsShow" label="验证码" prop="verificationCode" class="check-num">
                    <Input :maxlength="50" style="width: 200px" v-model="phoneItem.verificationCode" placeholder="请输入验证码" />
                    <div style="position: relative;top: -44px;left: 224px">
                        <img v-if="num != 1" style="border: 1px solid black;cursor: pointer;height: 30px;position: relative;top: 13px;" :src="this.imageVerificationCode" @click="getCode"/>
                        <Button v-if="num == 1" style="position: relative;top: 10px;" @click="getCode">获取验证码</Button>
                    </div>
                </FormItem>
                <FormItem label="短信验证码" prop="phoneVerificationCode">
                    <Input :disabled="phoneItem.verificationCode == ''" :maxlength="50" style="width: 200px" v-model="phoneItem.phoneVerificationCode" placeholder="请输入短信验证码" />
                    <Button :disabled="!show" @click="sendVerificationCode" style="margin-left: 20px">
                        <span v-if="show">{{title}}</span>
                        <span v-else>重新发送({{count}})</span>
                    </Button>
                    <span v-if="!show">已发送短信至：{{ this.phoneItem.phoneNum | changeMobile }}</span>
                </FormItem>
                <div style="text-align: center">
                    <Button @click="nextStep(1)">下一步</Button>
                </div>
            </Form>
            <!-- 2.完善信息 -->
            <Form v-if="stepNum==1" ref="form" :model="item" :label-width="100" :rules="itemRules" style="margin-top: 10px">
                <FormItem label="公司名称" prop="name">
                    <div style="display: inline-block">
                        <Input :maxlength="50" style="display: inline-block;width: 414px" v-model="item.name" @on-blur="auditCompanyName" placeholder="请输入公司名称" />
                    </div>
                    <span v-if="nameRepeat==null" style="display: inline-block;margin-left: 20px;color: #999999;">请填写营业执照上公司全称。</span>
                    <div v-if="nameRepeat==false" style="display: inline-block;margin-left: 20px">
                        <Icon style="font-size: 14px;color: #59b399" type="checkmark-circled"></Icon>
                        <span style="color: #999999">该企业名称可以使用</span>
                    </div>
                    <div v-if="nameRepeat==true" style="display: inline-block;margin-left: 20px">
                        <Icon style="font-size: 14px;color: red" type="close-circled"></Icon>
                        <span style="color: #999999">该企业已经被开通，请更换企业名称</span>
                    </div>
                </FormItem>
                <FormItem label="所在地" prop="provinceCode" style="display: inline-block">
                    <Select v-model="item.provinceCode" style="width: 200px" placeholder="请选择省份" @on-change="changeValue('2', $event)">
                        <Option v-for="provinceInfo in provinceList" :key="provinceInfo.code" :value="provinceInfo.code">{{provinceInfo.label}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="" prop="cityCode" class="location cityInfo">
                    <Select v-model="item.cityCode" style="width: 200px;margin-left: 10px" placeholder="请选择城市" @on-change="changeValue('3', $event)">
                        <Option v-for="cityInfo in cityList" :key="cityInfo.code" :value="cityInfo.code">{{cityInfo.label}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="" prop="areaId" class="location areaInfo">
                    <Select v-model="item.areaId" style="width: 200px;margin-left: 20px" placeholder="请选择区县">
                        <Option v-for="areaInfo in areaList" :key="areaInfo.code" :value="areaInfo.value">{{areaInfo.label}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="详细地址" prop="address">
                    <Input :maxlength="50" v-model="item.address" />
                </FormItem>
                <Row>
                    <FormItem label="联系方式" prop="phone" style="display: inline-block">
                        <Input :maxlength="11" style="width: 200px" v-model="item.phone" />
                    </FormItem>
                    <FormItem label="微信公众号" style="display: inline-block;margin-left: 20px">
                        <Input :maxlength="50" style="width: 200px" v-model="item.wechatPublicNum" />
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="公司负责人" style="display: inline-block">
                        <Input :maxlength="250" style="width: 200px" v-model="item.leader" />
                    </FormItem>
                    <FormItem label="负责人电话" prop="leaderPhone" style="display: inline-block;margin-left: 20px">
                        <Input :maxlength="11" style="width: 200px" v-model="item.leaderPhone" />
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="公司联系人" style="display: inline-block">
                        <Input :maxlength="250" style="width: 200px" v-model="item.linkman" />
                    </FormItem>
                    <FormItem label="联系人电话" prop="linkmanPhone" style="display: inline-block;margin-left: 20px">
                        <Input :maxlength="11" style="width: 200px" v-model="item.linkmanPhone" />
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="联系人邮箱" style="display: inline-block">
                        <Input :maxlength="250" style="width: 200px" v-model="item.linkmanEmail" />
                    </FormItem>
                    <FormItem label="加盟性质" style="display: inline-block;margin-left: 20px" prop="partnerType">
                        <Select v-model="item.partnerType" style="width: 200px" placeholder="请选择合伙人类型" @on-change="changePartnerType">
                            <Option value="NONE">无</Option>
                            <Option value="A">A轮</Option>
                            <Option value="B">B轮</Option>
                            <Option value="C">C轮</Option>
                            <Option value="CITY_LIGHT_HOUSE">城市灯塔</Option>
                        </Select>
                    </FormItem>
                </Row>
                <Row v-if="item.partnerType == 'A' || item.partnerType == 'B' ||item.partnerType == 'C'">
                    <FormItem label="原公司名称" style="display: inline-block">
                        <Input :maxlength="250" style="width: 200px" v-model="item.oldNameA" />
                    </FormItem>
                    <FormItem label="原公司名称2" style="display: inline-block;margin-left: 20px">
                        <Input :maxlength="250" style="width: 200px" v-model="item.oldNameB" />
                    </FormItem>
                </Row>
                <FormItem label="电子邮箱" prop="email">
                    <div style="display: inline-block">
                        <Input :maxlength="50" style="width: 200px" v-model="item.email" />
                    </div>
                    <span style="display: inline-block;margin-left: 20px;color: #999999;">请确保邮箱可以正常接收邮件，申请成功后的账号、密码将发到该邮箱中。</span>
                </FormItem>
                <FormItem label="公司简介">
                    <Input type="textarea" :rows="4" v-model="item.synopsis" :maxlength="500"/>
                </FormItem>
                <div style="text-align: center">
                    <Button @click="submit">申请开通</Button>
                    <Button type="ghost" @click="cancel">取消</Button>
                </div>
            </Form>
            <!-- 3.注册成功 -->
            <div v-if="stepNum==2">
                <div style="text-align: center;margin-top: 10px;">
                    <Icon style="font-size: 64px;color: #59b399" type="checkmark-circled"></Icon>
                    <h1 style="margin-top: 20px">恭喜您，已成功进行开通申请！</h1>
                    <h2 style="margin-top: 30px;font-weight: normal">申请审核后，会短信和邮件通知您，请注意查收。</h2>
                    <Button  style="margin-top: 40px" @click="finishOpenApply">完成</Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
    import ICol from "../../../node_modules/iview/src/components/grid/col.vue";

    export default {
        components: {ICol},
        data () {
            return {
                stepNum: 0,
                num: 1,
                imageCodeIsShow: true,
                imageVerificationCode: null,
                step: [
                    {name:"1.填写手机号"},
                    {name:"2.完善信息"},
                    {name:"3.申请开通"}
                ],
                provinceList: [],
                cityList: [],
                areaList: [],
                title: "发送短信验证码",
                show: true,
                item: {
                    partnerType: "NONE",
                },
                count: '',
                timer: null,
                phoneItem: {
                    applySex: "1",
                    verificationCode: ""
                },
                itemRules: {
                    name: [
                        {required: true, message: "请输入公司名称"}
                    ],
                    provinceCode: [
                        {required: true, message: "请选择公司所在省",trigger: 'change' }
                    ],
                    cityCode: [
                        {required: true, message: "请选择公司所在市",trigger: 'change' }
                    ],
                    areaId: [
                        {required: true, message: "请选择公司所在区",trigger: 'change' }
                    ],
                    address: [
                        {required: true, message: "请输入公司详细地址",trigger: 'blur' }
                    ],
                    phone: [
                        {required: true, message: "请输入联系电话"},
                        { pattern: /^[0-9]*$/ ,message:'请输入有效的联系电话'}
                    ],
                    email: [
                        { required: true, message: '邮箱不能为空'},
                        { pattern:  /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/ ,message:'请输入正确的邮箱格式'}
                    ],
                    partnerType: [
                        { required: true, message: '加盟性质不能为空'},
                    ],
                    leaderPhone: [
                        {validator: (rule, value, callback) => {
                            if(value) {
                                if (!String.isNullOrBlank(value)) {
                                    if (/^[0-9]*$/.test(value)) {
                                        callback();
                                    } else {
                                        callback([new Error('请输入正确的联系方式')]);
                                    }
                                } else {
                                    callback();
                                }
                            }else {
                                callback();
                            }
                        }}
                    ],
                    linkmanPhone: [
                        {validator: (rule, value, callback) => {
                            if(value) {
                                if (!String.isNullOrBlank(value)) {
                                    if (/^[0-9]*$/.test(value)) {
                                        callback();
                                    } else {
                                        callback([new Error('请输入正确的联系方式')]);
                                    }
                                } else {
                                    callback();
                                }
                            }else {
                                callback();
                            }
                        }}
                    ],
                },
                phoneRules: {
                    applyName: [
                        {required: true, message: "请输入申请人姓名"}
                    ],
                    verificationCode: [
                        {required: true, message: "请输入图中验证码"},
                        { pattern: /^\d{4}$/ ,message:'请输入图中验证码'}
                    ],
                    phoneNum: [
                        {required: true, message: "请输入申请人手机号码"},
                        { pattern: /^1[2-9]\d{9}$/ ,message:'请输入有效的手机号码'}
                    ],
                    phoneVerificationCode: [
                        {required: true, message: "请输入短信验证码"}
                    ],
                },
                nameRepeat: null,
                errorMsg: null
            }
        },
        created: function() {
//            this.getProvinceList('1', '');
        },
        mounted () {
        },
        filters: {
            changeMobile : function (value) {
                return value.substring(0,3) + "****" + value.substring(value.length-4,value.length);
            },
        },
        methods: {
            nextStep (stepNum) {
                this.$refs.phoneForm.validate(valid => {
                    if (valid) {
                        if(stepNum == 1){
                            this.verificationCodeAudit();
                        }
                    }
                });
            },
            //获取文字验证码
            getCode () {
                this.request({
                    url: "/systemManage/getCode.do"
                }).then(data => {
                    this.imageVerificationCode = data;
                    this.num++;
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
                    }else if (level == '2') {
                        this.cityList = items;
                        this.areaList = [];
                    }else {
                        this.areaList = items;
                    }
                });
            },
            changeValue (level, event) {
                if (!event.constructor){
                    return;
                }
                if (level != '1' && arguments[1] == ''){
                    return;
                }else {
                    this.getProvinceList(level, arguments[1]);
                }
            },
            sendVerificationCode () {
                if(this.phoneItem.verificationCode){
                    this.request({
                        url: "/system/companyOpenApply/sendVerificationCode.do",
                        param: {
                            verificationCode: this.phoneItem.verificationCode,
                        }
                    }).then(data => {
                        if(data){
                            this.sendPhoneVerificationCode();
                        }else{
                            this.$Message.info("验证码输入错误!");
                            this.getCode();
                        }
                    });
                }else{

                }
            },
            sendPhoneVerificationCode () {
                var vm = this;
                if (this.phoneItem.phoneNum) {
                    const TIME_COUNT = 60;
                    this.count = TIME_COUNT;
                    this.show = false;
                    this.request({
                        url: "/system/companyOpenApply/sendPhoneVerificationCode.do",
                        param: {
                            phoneNum: this.phoneItem.phoneNum,
                        }
                    }).then(data => {
                        if (data && data[0].result && data[0].result== "发送成功") {
                            if (!vm.timer) {
                                vm.timer = setInterval(() => {
                                    if (vm.count > 0 && vm.count <= TIME_COUNT) {
                                        vm.count--;
                                    } else {
                                        vm.show = true;
                                        clearInterval(vm.timer);
                                        vm.timer = null;
                                        vm.title = "重新发送";
                                    }
                                }, 1000);
                            }
                        } else {
                            vm.show = true;
                            vm.timer = null;
                            vm.title = "发送验证码";
                            vm.$Message.info("手机号验证次数超出，请明日再试！");
                        }
                    }, error => {
                        vm.show = true;
                        vm.timer = null;
                        vm.title = "发送验证码";
                    });
                } else {
                    this.$Message.info("请输入手机号码");
                }
            },
            verificationCodeAudit () {
                this.request({
                    url: "/system/companyOpenApply/verificationCodeAudit.do",
                    data: {
                        phoneNumber : this.phoneItem.phoneNum,
                        validateCode : this.phoneItem.phoneVerificationCode
                    },
                }).then((data) => {
                    if(data){
                        if(data == "验证成功"){
                            this.stepNum = 1;
                            this.getProvinceList('1', '');
                        }
                        return data;
                    }
                }, error => {
                    this.errorMsg = error.message;
                });
            },
            auditCompanyName () {
                if(this.item.name){
                    this.request({
                        url: "/system/companyOpenApply/auditCompanyName.do",
                        data: {
                            name: this.item.name
                        }
                    }).then((data)=>{
                        if(data !=undefined || data != null){
                            this.nameRepeat = data;
                        }
                    })
                }
            },
            changePartnerType (partnerType) {
                if(partnerType == "NONE" || partnerType == "CITY_LIGHT_HOUSE"){
                    this.item.oldNameA = null;
                    this.item.oldNameB = null;
                }
            },
            submit () {
                this.$refs.form.validate(valid => {
                    if(valid) {
                        this.item.applyerName = this.phoneItem.applyName;
                        this.item.applyerSex = this.phoneItem.applySex;
                        this.item.testPhone = this.phoneItem.phoneNum;
                        this.request({
                            url: "/system/companyOpenApply/openApply.do",
                            data: this.item
                        }).then((data) => {
                            if(data == null){//成功
                                this.stepNum = 2;
                            }
                        }, error => {
                            this.errorMsg = error.message;
                        });
                    }
                });
            },
            finishOpenApply () {
                window._frameRouter.push("login");
                this.cancel();
            },
            cancel () {
                window._frameRouter.push("login");
            }
        }
    };
</script>