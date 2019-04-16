<template>
    <div class="container">
        <Row>
            <Form ref="form" :model="item" :label-width="90" :rules="ruleInline">
                <i-col span="8" style="margin-top: 15px;">
                    <header class="org-header">
                        <span>组织信息</span>
                    </header>
                    <br/>
                    <Form-item label="组织名称" prop="name">
                        <Input v-model="item.name" placeholder="请输入组织名称"  :readonly="!B050401"/>
                    </Form-item>
                    <Form-item label="组织简称" prop="abbreviation">
                        <Input v-model="item.abbreviation" placeholder="请输入组织简称" :maxlength="50"/>
                    </Form-item>
                    <Form-item label="组织编码" prop="code">
                        <Input v-model="item.code" placeholder="请输入组织类型" />
                    </Form-item>
                    <Form-item label="组织类型" prop="orgtype_id">
                        <!--{required: true, message: '组织类型不能为空'}-->
                        <Tag type="border" color="#59b399">{{ item.orgtype_name }}</Tag>
                        <!--<Select v-model="item.orgtype_id" filterable :disabled="true">-->
                            <!--&lt;!&ndash;!B050401&ndash;&gt;-->
                            <!--<Option v-for="item in orgTypeList" :value="item.id" :key="item.code">{{ item.name }}</Option>-->
                        <!--</Select>-->
                    </form-item>
                    <Form-item label="所在地" prop="areaId">
                        <Cascader :data="areaTree" :load-data="loadData" :value="item.selectArea" @on-change="changeAreaData"></Cascader>
                    </Form-item>
                    <Form-item label="联系电话" prop="phone">
                        <Input v-model="item.phone" placeholder="请输入联系方式" :readonly="!B050401" :maxlength="11"/>
                    </Form-item>
                    <Form-item label="微信公众号" prop="weiXinNo">
                        <Input v-model="item.weiXinNo" placeholder="请输入微信号" :readonly="!B050401" :maxlength="50">
                            <Poptip slot="append" trigger="click" placement="right" ref="imgContent" @on-popper-show="showQRImg">
                                <Icon type="ios-information-outline"></Icon>
                                <div slot="content">
                                    <img style="width: 150px;height: 150px;" :src="qrImg">
                                </div>
                            </Poptip>
                        </Input>
                    </Form-item>
                    <Form-item label="签约主体" prop="signSubject">
                        <i-switch v-model="item.signSubject">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                    </form-item>

                    <!-- 分公司、子公司所需维护信息s -->
                    <template v-if="isChildCompany">
                        <Form-item label="公司负责人" prop="companyPrincipal">
                            <Input v-model="item.companyPrincipal" placeholder="请输入公司负责人" :maxlength="20"/>
                        </Form-item>
                        <Form-item label="负责人电话" prop="principalPhone">
                            <Input v-model="item.principalPhone" placeholder="请输入负责人电话" :maxlength="11"/>
                        </Form-item>
                        <Form-item label="公司联系人" prop="companyContacts">
                            <Input v-model="item.companyContacts" placeholder="请输入公司联系人" :maxlength="20"/>
                        </Form-item>
                        <Form-item label="联系人电话" prop="contactsPhone">
                            <Input v-model="item.contactsPhone" placeholder="请输入联系人电话" :maxlength="11"/>
                        </Form-item>
                        <Form-item label="联系人邮箱" prop="contactsEmail">
                            <Input v-model="item.contactsEmail" placeholder="请输入联系人邮箱" :maxlength="20"/>
                        </Form-item>
                        <Form-item label="加盟性质" prop="affiliation">
                            <Select v-model="item.affiliation" filterable>
                                <Option v-for="obj in affiliationList" :value="obj.value" :key="obj.value">{{obj.name}}</Option>
                            </Select>
                        </form-item>
                    </template>
                    <template v-if="isChildCompany && isShowOriginalName">
                        <Form-item label="原公司名称" prop="originalOrgName">
                            <Input v-model="item.originalOrgName" placeholder="请输入原公司名称" :maxlength="50"/>
                        </Form-item>
                        <Form-item label="原公司名称2" prop="originalOrgName2">
                            <Input v-model="item.originalOrgName2" placeholder="请输入原公司名称2" :maxlength="50"/>
                        </Form-item>
                    </template>

                    <!-- 门店所需维护信息 -->
                    <template v-if="isStore">
                        <Form-item label="授权牌编码" prop="authorizeBrandCode">
                            <Input v-model="item.authorizeBrandCode" placeholder="请输入授权牌编码" :maxlength="50"/>
                        </Form-item>
                        <Form-item label="授权日期" prop="authorizeDate">
                            <DatePicker type="date" v-model="item.authorizeDate" :editable="false" placeholder="选择授权日期" style="width: 100%"></DatePicker>
                        </Form-item>
                    </template>

                    <Form-item label="组织介绍" prop="describe">
                        <Input v-model="item.describe" type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="请输入..."  :readonly="!B050401"/>
                    </Form-item>
                </i-col>
                <i-col span="15" offset="1" v-if="item.signSubject">
                    <Button type="ghost" style="position: absolute;top: 5px;right: 20px;background: #FFF;z-index: 2;border: 0;" @click="isShowLeadPage = true">
                        操作指引
                        <Icon type="document-text"></Icon>
                    </Button>
                    <OrgSubjectCard ref="orgSubjectCard" :orgId="item.id" :orgInfo="item" @callback-valid="orgSubjectValid" @on-save-org-info="save"></OrgSubjectCard>
                </i-col>
                <i-col span="24">
                    <FormItem v-if="B050401">
                        <Button type="primary" @click="save">保存</Button>
                    </FormItem>
                </i-col>
            </Form>
        </Row>

        <!-- 引导页 -->
        <div v-show="isShowLeadPage" class="lead-page">
            <component is="LPOrgInfo" @on-hide-page="hideLeadPage"></component>
        </div>
    </div>
</template>

<script>
    import OrgAreaSearcher from './orgAreaSearcher.vue';
    import OrgSubjectCard from './orgSubjectCard.vue';
    import LPOrgInfo from '../leadPage/LPOrgInfo';

    export default {
        props: {
            B050401: false
        },
        data () {
            let $self = this;
            const addArea = (rule, value, callback) => {
                if (this.item.selectArea.length<3) {
                    callback(new Error('所属区域不能为空!'));
                } else {
                    callback();
                }
            };
            return {
                orgTypeList: [],
                item: {
                    name: '',
                    signSubject: false,
                    selectArea: [],
                    affiliation: 'NONE'
                },
                oldCode: null,
                oldData: null,
                isValid: false,
                oneModel:'',
                twoModel:'',
                threeModel:'',
                ruleInline: {
                    name: [
                        {required: true, message: '组织名称不能为空'},
                        {max:200, message:'组织名称不能多于200个字符'}
                    ],
                    code: [
                        {required: true, message: '组织编码不能为空'},
                        {max:200, message:'组织编码不能多于200个字符'},
                        {validator: (rule, value, callback) => {
                            if(value) {
                                if (!String.isNullOrBlank(value)) {
                                    if (/^[a-zA-Z0-9]*$/.test(value)) {
                                        callback();
                                    } else {
                                        callback([new Error('只允许输入数字和英文字母')]);
                                    }
                                } else {
                                    callback();
                                }
                            }else {
                                callback();
                            }
                        }}
                    ],
                    selectArea: [
                        {required: true, message: '所属区域不能为空', trigger: 'change'},
                        {validator: addArea, trigger: "change"},
                    ],
                    phone: [
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
                    principalPhone: [
                        {validator: (rule, value, callback) => {
                            if(value) {
                                if (!String.isNullOrBlank(value)) {
                                    if (/^[0-9]*$/.test(value)) {
                                        callback();
                                    } else {
                                        callback([new Error('请输入正确的负责人电话')]);
                                    }
                                } else {
                                    callback();
                                }
                            }else {
                                callback();
                            }
                        }}
                    ],
                    contactsPhone: [
                        {validator: (rule, value, callback) => {
                            if(value) {
                                if (!String.isNullOrBlank(value)) {
                                    if (/^[0-9]*$/.test(value)) {
                                        callback();
                                    } else {
                                        callback([new Error('请输入正确的联系人电话')]);
                                    }
                                } else {
                                    callback();
                                }
                            }else {
                                callback();
                            }
                        }}
                    ],
                    weiXinNo: [
                        {validator: (rule, value, callback) => {
                            if(value) {
                                if (!String.isNullOrBlank(value)) {
                                    if (/^[a-zA-Z0-9_-]*$/.test(value)) {
                                        callback();
                                    } else {
                                        callback([new Error('请输入正确的微信号')]);
                                    }
                                } else {
                                    callback();
                                }
                            }else {
                                callback();
                            }
                        }},
                    ],
                    authorizeBrandCode: [
                        {validator: (rule, value, callback) => {
                            if(value) {
                                if (!String.isNullOrBlank(value)) {
                                    if (/^[a-zA-Z0-9]*$/.test(value)) {
                                        callback();
                                    } else {
                                        callback([new Error('只允许输入数字和英文字母')]);
                                    }
                                } else {
                                    callback();
                                }
                            }else {
                                callback();
                            }
                        }}
                    ],
                    affiliation: [
                        {required: true, message: '加盟性质不能为空', trigger: 'change'}
                    ],
                    describe: [
                        {max: 500, message: '组织介绍不能多于500个字符'}
                    ]
                },
                qrImg: null,
                areaTree: [],

                isShowLeadPage: false,
                checkKey: 'IMPROVE_ORGANIZATIONAL_INFORMATION',
                isChangeOrgName: false,

                affiliationList: [
                    {value: 'NONE', name: '无'},
                    {value: 'A', name: 'A轮'},
                    {value: 'B', name: 'B轮'},
                    {value: 'C', name: 'C轮'},
                    {value: 'CITY_LIGHT_HOUSE', name: '城市灯塔'},
                ],
            }
        },
        watch: {
            'item.name'(val) {
                this.item.name = val;
                if (val != this.oldData.name) {
                    this.isChangeOrgName = true;
                }else {
                    this.isChangeOrgName = false;
                }
                this.$nextTick(() => {
                    if (this.item.signSubject) {
                        this.$refs['orgSubjectCard'].switchOrgNameChangeState(this.isChangeOrgName);
                    }
                });
            },
            'item.weiXinNo'(val) {
                this.item.weiXinNo = val;
                this.qrImg = 'http://open.weixin.qq.com/qr/code?username=' + val;
            }
        },
        computed: {
            isChildCompany() {
                return (this.item.orgtype_name == '分公司' || this.item.orgtype_name == '子公司');
            },
            isStore() {
                return this.item.orgtype_name == '门店';
            },
            isShowOriginalName() {
                return (this.item.affiliation == 'A' || this.item.affiliation == 'B' || this.item.affiliation == 'C');
            }
        },
        created: function () {
            //判断是否显示引导页
            this.request({
                url: '/systemManage/organization/checkUserVisitInfo.do',
                param: {
                    key: this.checkKey
                }
            }).then(data => {
                if (data) {
                    this.isShowLeadPage = false;
                }else {
                    this.isShowLeadPage = true;
                    this.request({
                        url: '/systemManage/organization/saveUserVisitInfo.do',
                        param: {
                            key: this.checkKey
                        }
                    }).then(() => {});
                }
            });

            this.initOrgInfo();
            this.loadArea();
        },
        methods: {
            initOrgInfo() {
                var vm = this;
                this.request({
                    url: `/systemManage/organization/currentOrgInfo.do`
                }).then(data => {
                    if (undefined !== data && null !== data){
                        vm.item = data;
                        vm.oldData = Object.assign({}, data);
                        vm.oldCode = data.code;
                        vm.item.oldCode = data.code;
                        this.checkAreaLevel(data);
                    }

                    this.request({
                        url: `/systemManage/organizationType/getAll.do`
                    }).then(data => {
                        if (undefined !== data && null !== data){
                            data.forEach(item1 => {
                                if (item1.id == vm.item.orgtype_id) {
                                    vm.$set(vm.item, 'orgtype_name', item1.name);
                                }
                            });
                        }
                    });
                });
            },
            save: function () {
                var vm = this;
                this.$refs.form.validate(valid => {
                    if (vm.item.signSubject) {
                        vm.$refs['orgSubjectCard'].save();
                        if (!vm.isValid) {
                            return;
                        }
                    }else {
                        delete vm.item.subjectInfo;
                    }
                    if (valid) {
                        vm.request({
                            url: '/systemManage/organization/update.do',
                            data: this.item
                        }).then(() => {
                            vm.$Message.success('提交成功!');
                            this.isChangeOrgName = false;
                            if (this.item.signSubject) {
                                this.$refs['orgSubjectCard'].switchOrgNameChangeState(false);
                            }
                            vm.initOrgInfo();
                        }, error => {
//                            vm.$Message.error(error.message);
                        });
                    }
                })
            },
            checkAreaLevel(data) {
                if (data.id && data.areaId) {
                    this.request({
                        url: "/systemManage/bd/getOrgArea.do",
                        param: {
                            areaId: data.areaId,
                            orgId: data.id
                        }
                    }).then(items => {
                        if (items && items.code) {
                            this.$set(this.item, "selectArea", []);
                            this.item.selectArea.push(items.code[1]);
                            this.item.selectArea.push(items.code[2]);
                            this.item.selectArea.push(items.code[3]);
                        }
                    });
                }
            },
            orgSubjectValid(isValid, subjectInfo) {
                if (isValid) {
                    this.item.subjectInfo = subjectInfo;
                }
                this.isValid = isValid;
            },
            showQRImg() {
                if (this.qrImg) {
                    var ImgObj=new Image();
                    ImgObj.src= this.qrImg;
                    if(ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {

                    } else {
                        this.$refs['imgContent'].handleClose();
                        this.$Message.info('当前微信号二维码获取失败');
                    }
                }else {
                    this.$refs['imgContent'].handleClose();
                    this.$Message.info('当前微信号二维码获取失败');
                }
            },
            loadArea() {
                this.request({
                    url: "/systemManage/administrativeMgr/getAreaChildrenList.do",
                    param: {
                        code: "100000"
                    }
                }).then(data => {
                    for (var index_i=0;index_i<data.length;index_i++) {
                        var areaObj = new Object();
                        areaObj.value = data[index_i].code;
                        areaObj.label = data[index_i].title.split(':')[0];
                        areaObj.children = data[index_i].children;
                        areaObj.loading = false;
                        this.areaTree.push(areaObj);
                    }
                })
            },
            /**
             * 获取当前区域节点子集
             */
            loadData(item, callback) {
                item.loading = true;
                this.request({
                    url: "/systemManage/administrativeMgr/getAreaChildrenList.do",
                    param: {
                        code: item.value
                    }
                }).then(data => {
                    var child = [];
                    for (var index_i=0;index_i<data.length;index_i++) {
                        var areaObj = new Object();
                        areaObj.value = data[index_i].code;
                        areaObj.label = data[index_i].title.split(':')[0];
                        if (data[index_i].code.substring(data[index_i].code.length-2,data[index_i].code.length)=='00') {
                            areaObj.children = data[index_i].children;
                            areaObj.loading = false;
                        }
                        child.push(areaObj);
                    }
                    item.loading = false;
                    item.children = child;
                    callback();
                })
            },
            changeAreaData(value, selectedData) {
                this.item.selectArea = value;
            },
            hideLeadPage() {
                this.isShowLeadPage = false;
            }
        },
        components: {
            OrgAreaSearcher,
            OrgSubjectCard,
            LPOrgInfo
        }
    };
</script>

<style scoped>
    .container {
        /*width: 500px;*/
        padding: 15px;
    }

    .org-header:before {
        content: "";
        display: block;
        width: 100%;
        height: 1px;
        background: #eee;
        position: absolute;
        top: 10px;
        left: 0;
    }

    .org-header span {
        display: inline-block;
        background: #fff;
        padding: 0 5px 0 18px;
        position: relative;
        margin-left: 30px;
        font-size: 14px;
    }

    .ivu-switch-checked {
        border-color: #59b399;
        background-color: #59b399;
    }

    /*引导页*/
    .lead-page {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 10;
    }
</style>