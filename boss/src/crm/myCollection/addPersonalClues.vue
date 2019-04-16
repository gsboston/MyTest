<template>
    <div @click="clickDivWrap">
        <Form ref="personal" :model="personal" :label-width="80">
            <Row>
                <i-Col span="24">
                    <Button type="primary" class="in-the-query">天眼查询</Button>
                </i-Col>
            </Row>
            <!--基本信息-->
            <Row class="basic-info-wrap">
                <i-Col span="4">
                    <BSUpload :beforeUpload="beforeUpload" :onSuccess="onSuccess">
                        <div class="upload">
                            <div v-if="!logo">
                                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                <p style="line-height: 20px;">80px*80px</p>
                                <p style="line-height: 20px;">上传照片</p>
                            </div>
                            <img :src="logo" v-else>
                        </div>
                    </BSUpload>
                </i-Col>
                <i-Col span="20" class="basic-info-box">
                    <FormItem label="姓名" prop="name">
                        <Input v-model="personal.name" :disabled="isDisable" :maxlength="30"></Input>
                    </FormItem>
                    <FormItem label="移动电话" prop="mobile" class="enterprise-name-wrap">
                        <Input class="name" v-model="personal.mobile" :disabled="isDisable" @on-change="mobileChange(personal.mobile)" :maxlength="11"></Input>
                        <div class="enterprise-name-box" v-show="isShow">
                            <a href="javascript:;" class="item" v-for="item in mobileList" @click="selectMobile(item)">{{ item.name + '    ' + item.mobile }}</a>
                        </div>
                    </FormItem>
                    <Row>
                        <i-Col span="12">
                            <FormItem label="QQ" prop="qq">
                                <Input v-model="personal.qq" :disabled="isDisable" :maxlength="15"></Input>
                            </FormItem>
                        </i-Col>
                        <i-Col span="12">
                            <FormItem label="邮箱" prop="email">
                                <Input v-model="personal.email" :disabled="isDisable" :maxlength="64"></Input>
                            </FormItem>
                        </i-Col>
                    </Row>
                    <Row>
                        <i-Col span="12">
                            <FormItem label="微信" prop="wechat">
                                <Input v-model="personal.wechat" :disabled="isDisable" :maxlength="64"></Input>
                            </FormItem>
                        </i-Col>
                        <i-Col span="12">
                            <FormItem label="地址" prop="address">
                                <Input v-model="personal.address" :disabled="isDisable" :maxlength="200"></Input>
                            </FormItem>
                        </i-Col>
                    </Row>
                </i-Col>
            </Row>
            <!--描述-->
            <Row class="describe-wrap">
                <i-Col span="24">
                    <FormItem label="描述" prop="remark" :label-width="40">
                        <Input :disabled="isDisable" v-model="personal.remark" type="textarea" :rows="4" placeholder="请输入描述信息" :maxlength="200"></Input>
                    </FormItem>
                </i-Col>
            </Row>
            <FormItem v-if="!isDisable">
                <Row style="padding-right: 60px;">
                    <i-Col span="20">
                        &nbsp;
                    </i-Col>
                    <i-Col span="2">
                        <Button type="primary" @click="handleReset('personal')">清除</Button>
                    </i-Col>
                    <i-Col span="2">
                        <Button type="primary" @click="savePersonal('personal')">保存</Button>
                    </i-Col>
                </Row>
            </FormItem>
        </Form>
        <!--保存之后-->
        <div class="tags" @click.stop v-if="isDisable">
            <Tag v-for="tag in tagsList" :key="tag.tagId" :name="tag.tagId" type="border" :closable="tag.isCreateYouself"
                 :class="{tagGrey : !tag.isCreateYouself}" @on-close="tagClose(tag.tagId, tagsList)">
                {{tag.name}}
            </Tag>
            <Button icon="ios-plus-empty" type="dashed" size="small" @click.stop="tagAdd(clue)">给他贴标签</Button>
        </div>
        <Modal
                title="我要贴标签"
                v-model="tagAddModal"
                :closable="false"
                :mask-closable="false"
                :styles="{top: '20px'}">
            <!--<div slot="header"></div>-->

            <div style="text-align: center;">
                <span>我要贴标签：</span>
                <Input v-model="tagAddValue" :autofocus="true" :maxlength="10" style="width: 200px;"></Input>
                <Checkbox v-model="isAnonymous">匿名</Checkbox>
            </div>

            <div slot="footer">
                <Button type="primary" @click="tagAddOk">确定</Button>
                <Button type="ghost" @click="tagAddCancel">取消</Button>
            </div>
        </Modal>
        <br>
        <div class="extendPanel" v-if="isDisable">
            <div class="extendTabs">
                <span @click="selectedTab = 0">基本信息</span>
                <span @click="selectedTab = 1">他的企业</span>
                <span @click="selectedTab = 2">
                                        <Badge class-name="extendTabsBadge" :count="clue.opportunity">
                                            商机
                                        </Badge>
                                    </span>
                <span @click="selectedTab = 3">业务往来</span>
                <span @click="selectedTab = 4">信息评价</span>
            </div>
            <div>
                <baseinfoPersonalForm v-if="selectedTab === 0" :id="clueId" :interestTagsList="interestTagsList" :exist="isExist" :personalInfo="personalInfo"></baseinfoPersonalForm>
                <companies v-else-if="selectedTab === 1" :clue="clue" :personalId="personalInfo.id"></companies>
                <opportunity v-else-if="selectedTab === 2" @opportunityNumInit="opportunityNumInit"
                             :id="clueId" :clue="clue" ref="opportunity"></opportunity>
                <dealings v-else-if="selectedTab === 3" :id="clueId"></dealings>
                <evaluation v-else-if="selectedTab === 4" :id="clueId"></evaluation>
            </div>
        </div>
    </div>
</template>

<script>
    import baseinfoPersonalForm from '../clueManagement/baseinfoPersonalForm.vue'; // 基本信息表单-个人
    import companies from '../clueManagement/companies.vue'; // 他的企业
    import opportunity from '../clueManagement/opportunity.vue'; // 商机
    import dealings from '../clueManagement/dealings.vue'; // 业务往来
    import evaluation from '../clueManagement/evaluation.vue'; // 信息评价

    export default {
        data: function () {
            return {
                logo: '',
                personal: {
                    name: '',
                    mobile: '',
                    qq: '',
                    email: '',
                    address: '',
                    wechat: '',
                    remark: ''
                },
                isShow: false,
                mobileList: [],
                isDisable: false,//是否禁用
                tagAddValue: '',
                isAnonymous: false, // 贴标签匿名
                tagAddModal: false,
                clue: {},
                clueId: '',//线索id
                selectedTab: 100,
                isExist: false,//是否存在该线索,
                personalInfo: {},
                tagsList: [],//兴趣标签
                interestTagsList: [],//兴趣标签
                ruleValidate: {
                    mobile: [
                        {required: true, message: '移动电话不能为空', trigger: 'blur'},
                        { validator: this.validatorMobile, trigger: 'blur' },
                    ],
                    email:[
                        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
                    ],
                    qq: [
                        { type: 'string', message: '请输入正确的qq格式',pattern:/^\d{5,15}$/, trigger: 'blur' }
                    ],
                    telephone: [
                        { type: 'string', message: '请输入正确的电话格式',pattern:/^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/, trigger: 'blur' }
                    ]
                }
            }
        },
        created: function () {

        },
        methods: {
            /*上传*/
            beforeUpload:function(){
//                alert("我要上传了");
            },
            onSuccess:function(id){
                alert("我上传的文件是"+id);
                this.logo = 'http://pic.58pic.com/58pic/13/76/85/69x58PICm2u_1024.jpg';
                this.personal.id = id;
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
            /*根据线索id查找相关线索*/
            selectMobile: function (item) {
                this.request({
                    url: '/crm/myCollection/enterprise.do',
                    param: {
                        hxId: item.hxId
                    }
                }).then(data => {
                    this.isExist = true;
                    this.isDisable = true;
                    this.personal = data.personal;
//                    if(!this.company.type)this.company.type = -1;
                    this.personalInfo = data.personal;
                    this.interestTagsList = data.tags;
                    this.tagsList = [];
                    for(let i=1; i<data.tags.length; i++){
                        if(data.tags[i].type == 1 || data.tags[i].type == 4) this.tagsList.push(data.tags[i]);
                    }

                    this.clueId = this.personal.hxId;
                    this.selectedTab = 0;
                });
            },
            /*点击最外层关闭自定义下拉菜单*/
            clickDivWrap: function () {
                this.isShow = false;
            },
            /*清除*/
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            /*保存*/
            savePersonal: function (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.request({
                            url: '/crm/myCollection/savePersonal.do',
                            data: {
                                personal: this.personal
                            }
                        }).then(data => {
                            this.isDisable = true;
                            this.clueId = data;
                            this.request({
                                url: '/crm/myCollection/enterpriseClueDetails.do',
                                param: {
                                    id: this.clueId
                                }
                            }).then(data => {
                                this.clue = data || {tags: []};
                                if(data)this.personalInfo = data.personal;
                                this.selectedTab = 0;
                            });
                        })
//                        this.$Message.success('提交成功!');
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            tagAdd () {
                this.tagAddModal = true;
            },
            tagAddCancel: function () {
                this.tagAddModal = false;
                this.tagAddValue = '';
                this.isAnonymous = false;
            },
            tagAddOk: function () {
                if(!this.tagAddValue.trim()){
                    this.$Message.warning('请填写标签名称');
                    return;
                }

                this.request({
                    url: '/crm/clueManagement/tagsAdd.do',
                    data: {
                        id: this.clueId,
                        tagAddValue: this.tagAddValue,
                        isAnonymous: this.isAnonymous
                    }
                }).then(data => {
                    let tempArr = data;
                    this.tagsList = [];
                    for(let i=1; i<tempArr.length; i++){
                        if(tempArr[i].type == 1 || tempArr[i].type == 4) this.tagsList.push(tempArr[i]);
                    }

                    this.tagAddModal = false;
                    this.tagAddValue = '';
                    this.isAnonymous = false;
                });
            },
            tagClose (tagId, tags) {
                this.request({
                    url: '/crm/clueManagement/tagsDel.do',
                    param: {
                        clueId: this.clue.id,
                        tagId
                    }
                }).then(() => {
                    tags.forEach(function (item, index) {
                        if(item.tagId === tagId){
                            tags.splice(index, 1);
                        }
                    });
                });
            },
            opportunityNumInit: function (num, clue) {
                clue.opportunity = num;
            }
        },
        components: {
            baseinfoPersonalForm,
            companies,
            opportunity,
            dealings,
            evaluation
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
        padding: 0 60px 20px;
        border-bottom: 1px solid #eee;
    }
    .basic-info-box .ivu-form-item{
        padding-left: 20px;
    }
    .describe-wrap{
        padding: 20px 60px;
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
    .extendPanel{
        position: relative;
        width: 95%;
        margin: 0px auto;
        box-shadow: 0 0px 5px #e8e8e8;
        border: 1px solid #f3f3f3;
    }
    .extendTabs{
        background: #F6F8FA;
        font-size: 0;
    }
    .extendTabs>span{
        display: inline-block;
        vertical-align: middle;
        width: 125px;
        line-height: 40px;
        font-weight: bold;
        font-size: 15px;
        text-align: center;
        cursor: pointer;
    }
    .extendTabs>span.active{
        color: #2C74E7;
    }
</style>