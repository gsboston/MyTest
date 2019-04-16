<template>
    <div @click="clickDivWrap">
        <Form ref="enterprise" :model="enterprise" :label-width="80">
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
                    <FormItem label="公司名称" prop="name" :rules="{required: true, message: '公司名称不能为空', trigger: 'blur'}" class="enterprise-name-wrap">
                        <Input class="name" v-model="enterprise.name" :disabled="isDisable" @on-change="companyNameChange(enterprise.name)" :maxlength="200"></Input>
                        <div class="enterprise-name-box" v-show="isShow">
                            <a href="javascript:;" class="item" v-for="item in companyNameList" @click="selectCompanyName(item)">{{ item.name }}</a>
                        </div>
                    </FormItem>
                    <FormItem label="企业类型" prop="type">
                        <Select v-model="enterprise.type" filterable :disabled="isDisable">
                            <Option v-for="item in companyTypeList" :value="item.code" :key="item.code">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                    <Row>
                        <i-Col span="12">
                            <FormItem label="联系电话" prop="companyContactsMobile">
                                <Input v-model="enterprise.companyContactsMobile" :disabled="isDisable" :maxlength="11"></Input>
                            </FormItem>
                        </i-Col>
                        <i-Col span="12">
                            <FormItem label="企业邮箱" prop="companyEmail">
                                <Input v-model="enterprise.companyEmail" :disabled="isDisable" :maxlength="64" ></Input>
                            </FormItem>
                        </i-Col>
                    </Row>
                    <Row>
                        <i-Col span="12">
                            <FormItem label="网址" prop="companyWebSite">
                                <Input v-model="enterprise.companyWebSite" :disabled="isDisable" :maxlength="64"></Input>
                            </FormItem>
                        </i-Col>
                        <i-Col span="12">
                            <FormItem label="地址" prop="companyAddress">
                                <Input v-model="enterprise.companyAddress" :disabled="isDisable" :maxlength="200"></Input>
                            </FormItem>
                        </i-Col>
                    </Row>
                </i-Col>
            </Row>
            <!--描述-->
            <Row class="describe-wrap">
                <i-Col span="24">
                    <FormItem label="描述" prop="companyComments" :label-width="40">
                        <Input v-model="enterprise.companyComments" type="textarea" :rows="4" placeholder="请输入描述信息" :disabled="isDisable" :maxlength="200"></Input>
                    </FormItem>
                </i-Col>
            </Row>
            <FormItem v-if="!isDisable">
                <Row style="padding-right: 60px;">
                    <i-Col span="20">
                        &nbsp;
                    </i-Col>
                    <i-Col span="2">
                        <Button type="primary" @click="handleReset('enterprise')" >清除</Button>
                    </i-Col>
                    <i-Col span="2">
                        <Button type="primary" @click="saveEnterprise('enterprise')">保存</Button>
                    </i-Col>
                </Row>
            </FormItem>
        </Form>
        <!--保存之后-->
        <div class="tags" @click.stop v-if="isDisable">
            <Tag v-for="tag in clue.tags" :key="tag.tagId" :name="tag.tagId" type="border" :closable="tag.isCreateYouself"
                 :class="{tagGrey : !tag.isCreateYouself}" @on-close="tagClose(tag.tagId, clue.tags)">
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
                <Input v-model="tagAddValue" :autofocus="true" :maxlength="10" style="width: 200px;" ></Input>
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
                <span @click="selectedTab = 1">主要人员</span>
                <span @click="selectedTab = 2">
                                        <Badge class-name="extendTabsBadge" :count="clue.opportunity">
                                            商机
                                        </Badge>
                                    </span>
                <span @click="selectedTab = 3">业务往来</span>
                <span @click="selectedTab = 4">信息评价</span>
            </div>
            <div class="">
                <baseinfoCompanyForm v-if="selectedTab === 0" :id="clueId" :exist="isExist" :company="company"></baseinfoCompanyForm>
                <personnel v-else-if="selectedTab === 1" :id="clueId" :companyId="clue.company.id"></personnel>
                <opportunity v-else-if="selectedTab === 2" :id="clueId" @opportunityNumInit="opportunityNumInit"
                             :clue="clue" :prompadd="clue.prompadd" ref="opportunity"></opportunity>
                <dealings v-else-if="selectedTab === 3" :id="clueId" :dealings="clue.hintContracts"></dealings>
                <evaluation v-else-if="selectedTab === 4" :id="clueId" :evaluation="clue.hintEvaluates"></evaluation>
            </div>
        </div>
    </div>
</template>

<script>
    import baseinfoCompanyForm from '../clueManagement/baseinfoCompanyForm.vue'; // 基本信息表单-公司
    import personnel from '../clueManagement/personnel.vue'; // 主要人员
    import opportunity from '../clueManagement/opportunity.vue'; // 商机
    import dealings from '../clueManagement/dealings.vue'; // 业务往来
    import evaluation from '../clueManagement/evaluation.vue'; // 信息评价

    export default {
        data: function () {
            return {
                logo: '',
                enterprise: {
                    name: '',
                    type: 0,
                    companyContactsMobile: '',
                    companyEmail: '',
                    companyWebSite: '',
                    companyAddress: '',
                    companyComments: ''
                },
                companyNameList: [],
                companyTypeList: [],//公司类型列表数据
                isShow: false,
                isDisable: false,//是否禁用
                clue: {},
                company: {},
                tagAddValue: '',
                isAnonymous: false, // 贴标签匿名
                tagAddClue: null,
                tagAddModal: false,
                clueId: '',//线索id
                selectedTab: 100,
                isExist: false,//是否存在该公司
                ruleValidate: {
                    companyContactsMobile: [
                        { required: true, message: '联系电话不能为空', trigger: 'blur' },
                        //{ validator: this.validatorMobile, trigger: 'blur' },
                        { type: 'string', message: '请输入正确的联系电话',pattern:/(^([0-9]{3,4}-)?[0-9]{7,8}$)|(^((\(\d{3}\))|(\d{3}\-))?(1[2-9]\d{9})$)/, trigger: 'blur' }
                    ],
                    companyEmail:[
                        { type: 'email', message: '请输入正确邮箱格式', trigger: 'blur' }
                    ],
                    companyWebSite:[
                        { type: 'string', message: '请输入正确网址格式',pattern:/^((https|http):\/\/)?(([0-9a-z_!~*'().&=+$%-]+:)?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)$/, trigger: 'blur' }
                    ]
                }
            }
        },
        created: function () {
            this.getCompanyTypeList();//公司类型列表数据
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
            /*根据输入的公司名称向后台查找相关公司*/
            companyNameChange: function (name) {
                if(!name) {
                    this.companyNameList = [];
                    this.isShow = false;
                    return;
                }
                this.request({
                    url: '/crm/myCollection/companyNameList.do',
                    param: {
                        name: name
                    }
                }).then(companyNameList => {
                    this.companyNameList = companyNameList;
                    if(this.companyNameList.length > 0) this.isShow = true;
                });
            },
            /*根据线索id查找相关线索*/
            selectCompanyName: function (item) {
                this.request({
                    url: '/crm/myCollection/enterprise.do',
                    param: {
                        hxId: item.hxId
                    }
                }).then(data => {
                    this.isExist = true;
                    this.isDisable = true;
                    this.enterprise = data.company;
                    if(!this.company.type)this.company.type = -1;
                    this.company = data.company;
                    this.clueId = this.company.hxId;
                    this.selectedTab = 0;
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
            /*点击最外层关闭自定义下拉菜单*/
            clickDivWrap: function () {
                this.isShow = false;
            },
            /*清除*/
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            /*保存*/
            saveEnterprise: function (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.request({
                            url: '/crm/myCollection/saveEnterprise.do',
                            data: {
                                enterprise: this.enterprise
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
                                if(data)this.company = data.company;
                                this.selectedTab = 0;
                            });
                        })
//                        this.$Message.success('提交成功!');
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            tagAdd (clue) {
                this.tagAddModal = true;
                this.tagAddClue = clue;
            },
            tagAddCancel: function () {
                this.tagAddModal = false;
                this.tagAddValue = '';
                this.isAnonymous = false;
                this.tagAddClue = null;
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
                    this.tagAddClue.tags = data;

                    this.tagAddModal = false;
                    this.tagAddValue = '';
                    this.isAnonymous = false;
                    this.tagAddClue = null;
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
            baseinfoCompanyForm,
            personnel,
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
        /*margin-bottom: 10px;*/
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
    .tags{
        margin-top: 8px;
        display: inline-block;
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