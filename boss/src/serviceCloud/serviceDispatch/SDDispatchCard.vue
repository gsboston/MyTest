<template>
    <div style="padding: 10px 15px;">
        <Row>
            <Form class="invoice-form" ref="form" :model="serviceForm" label-position="left" :label-width="120" :rules="ruleValidate">
                <i-col span="24">
                    <Collapse v-model="activeCollapse">
                        <Panel name="1">
                            <div>
                                <span>客户相关信息</span>
                                <Icon class="collapse-icon" :type="collapseStyle"></Icon>
                            </div>
                            <i-col span="23" slot="content">
                                <FormItem class="s-price" label="合约编号">
                                    <span class="org-name">{{ contractInfo.code }}</span>
                                    <Button class="check-button" size="small" style="margin-left: 50px;">{{ contractInfo.serviceType }}</Button>
                                </FormItem>
                                <FormItem class="s-price customer-name" label="客户名称">
                                    <Tooltip :content="contractInfo.subjectAName" class="tips" placement="bottom">
                                        {{ contractInfo.subjectAName }}
                                    </Tooltip>
                                    <Button class="check-button" size="small" style="margin-left: 20px;height: 24px;">{{ contractInfo.customerType == 'PERSON' ? '自然人' : '企业' }}</Button>
                                </FormItem>
                                <FormItem class="s-price" label="证件号码">
                                    <span class="org-name">{{ contractInfo.customerNumber }}</span>
                                </FormItem>
                                <i-col span="12">
                                    <FormItem class="s-price" label="联系人">
                                        <span class="org-name">{{ contractInfo.contactName }}</span>
                                    </FormItem>
                                </i-col>
                                <i-col span="12">
                                    <FormItem class="s-price" label="联系电话">
                                        <span class="org-name">{{ contractInfo.contactPhone }}</span>
                                    </FormItem>
                                </i-col>
                            </i-col>
                        </Panel>
                    </Collapse>
                </i-col>

                <FormItem label="服务单信息" class="title" style="margin-bottom: 10px;text-align: left;"></FormItem>
                <!-- 编辑信息 -->
                <i-col span="23">
                    <i-col span="17">
                        <FormItem ref="billDefId" class="s-price" label="服务单类型" prop="billDefId">
                            <Select v-if="!isOnlyDispatch" filterable @on-change="serveTypeChange">
                                <Option v-for="(item, index) in contractDefService" :key="index" :value="index">{{ item.serviceTicketTypeName }}</Option>
                            </Select>
                            <Button v-else class="check-button active" size="small">{{ serviceForm.billDefName }}</Button>
                        </FormItem>
                    </i-col>
                    <i-col span="17">
                        <FormItem ref="managerUserId" class="s-price" label="客户经理" prop="managerUserId">
                            <Select v-model="managerUserIndex" filterable @on-change="managerUserChange">
                                <Option v-for="(item, index) in managerUserList" :key="index" :value="index">{{ item.realName }}</Option>
                            </Select>
                        </FormItem>
                    </i-col>
                    <i-col span="24">
                        <FormItem class="s-price" label="派单方">
                            <span class="org-name">{{ contractInfo ? contractInfo.saleOrgName : '' }}</span>
                        </FormItem>
                    </i-col>
                    <i-col span="24" v-if="serviceType">
                        <Form-item label="服务频率">
                            <div>
                                <i-button v-if="serviceForm.serviceFrequency == 'DISPOSABLE'" class="check-button" size="small">一次性</i-button>
                                <i-button v-else class="check-button" size="small">周期性</i-button>
                            </div>
                        </Form-item>
                    </i-col>
                    <i-col span="24" v-if="isShow">
                        <component v-if="!isOnlyDispatch" is="ServiceBuilder" :serviceType="serviceType" :isEdit="true" :contractId="contractInfo.id" :signedDate="contractInfo.signedTime" @on-save-contract-data="refreshData"></component>
                        <component v-else is="ServiceBuilder" :serviceType="serviceType" :isEdit="true" :serviceInfo="serviceInfo" :contractId="contractInfo.id" :signedDate="contractInfo.signedTime" @on-save-contract-data="refreshData"></component>
                    </i-col>
                </i-col>

                <i-col span="24">
                    <Collapse v-model="activeFileCollapse">
                        <Panel name="1">
                            <div>
                                <span>资料清单</span>
                                <Icon class="collapse-icon" :type="fileCollapseStyle"></Icon>
                            </div>
                            <i-col span="24" slot="content">
                                <SDFileList :billId="serviceForm.id"></SDFileList>
                            </i-col>
                        </Panel>
                    </Collapse>
                </i-col>

                <FormItem label="派单信息" class="title" style="margin-bottom: 10px;text-align: left;"></FormItem>
                <i-col span="24">
                    <i-col style="margin-left: 15px;" v-if="serviceForm.statusRecordList && serviceForm.statusRecordList.length>0" span="24">
                        <div style="width: 100%;height: 60px;background-color: #f2f2f2">
                            <div class="service-state">
                                <span>退</span>
                            </div>
                            <div style="position: absolute;left: 60px;top: 10px;color: #999999">
                                <span>{{serviceForm.statusRecordList[0].operatorUserName}}</span>
                            </div>
                            <div style="position: absolute;left: 60px;top: 35px;color: #999999" :title="serviceForm.statusRecordList[0].remark">
                                <span>{{serviceForm.statusRecordList[0].remark | wordLengthLimit}}</span>
                            </div>
                        </div>
                    </i-col>
                    <i-col span="24">
                        <FormItem label="" class="service-type">
                            <RadioGroup v-model="serviceForm.dispatchType" @on-change="changeRadio">
                                <Radio label="OWN">自有服务</Radio>
                                <Radio label="EPIBOLY">外包服务</Radio>
                            </RadioGroup>
                        </FormItem>
                    </i-col>

                    <i-col span="24" v-if="serviceForm.dispatchType == 'OWN'" style="padding: 0 25px;">
                        <div>
                            <div class="tab-button-bar">
                                <div :class="serviceForm.receiveOperatorType == 'SERVER_RECEIVE_PRINCIPAL' ? 'tab-button active' : 'tab-button'" @click="checkTab('SERVER_RECEIVE_PRINCIPAL')">
                                    <span style="font-size: 12px">派单至服务负责人</span>
                                </div>
                                <div :class="serviceForm.receiveOperatorType == 'SERVER_RECEIVE_STAFF' ? 'tab-button active' : 'tab-button'" @click="checkTab('SERVER_RECEIVE_STAFF')">
                                    <span style="font-size: 12px">派单至服务人员</span>
                                </div>
                            </div>
                            <!-- 接单至服务负责人 -->
                            <div v-if="serviceForm.receiveOperatorType== 'SERVER_RECEIVE_PRINCIPAL'" style="margin-top: 10px">
                                <FormItem class="s-price ivu-form-item-required" label="服务负责人" prop="serveLeaderId">
                                    <Select filterable v-model="serveLeaderIndex" @on-change="serveLeaderChange" style="width: 200px" placeholder="服务负责人">
                                        <Option v-for="(item, index) in serveLeaderList" :value="index" :key="index">{{item.serveLeaderName}}</Option>
                                    </Select>
                                </FormItem>
                                <FormItem class="s-price ivu-form-item-required" label="联系电话" prop="serveLeaderPhone">
                                    <Input v-model="serviceForm.serveLeaderPhone" style="width: 200px;" placeholder="xxx-xxxxxxxx/xxxx-xxxxxxx/手机号" :maxlength="50"></Input>
                                </FormItem>
                                <FormItem class="s-price service-require" label="服务要求">
                                    <div class="service-or-other-content">
                                        <Input v-model="serviceForm.dispatchRemark" type="textarea" :rows="4" placeholder="请输入服务单的具体指派说明" :maxlength="500"></Input>
                                    </div>
                                </FormItem>
                            </div>
                            <!-- 接单至服务人员 -->
                            <div v-if="serviceForm.receiveOperatorType== 'SERVER_RECEIVE_STAFF'" style="margin-top: 10px">
                                <FormItem class="s-price ivu-form-item-required" label="服务负责人" prop="serveLeaderId">
                                    <Select filterable v-model="serveLeaderIndex" @on-change="serveLeaderChange" style="width: 200px" placeholder="服务负责人">
                                        <Option v-for="(item, index) in serveLeaderList" :value="index" :key="index">{{item.serveLeaderName}}</Option>
                                    </Select>
                                </FormItem>
                                <component ref="serviceUserForm" is="SendToServicePerson" :serviceUsers="serviceForm.serverList" :serviceTypeList="serviceTypeList"></component>
                            </div>
                        </div>
                    </i-col>

                    <div v-else>
                        <i-col span="17" style="padding: 0 25px;">
                            <FormItem class="s-price ivu-form-item-required" label="服务方" prop="serveOrgId">
                                <Select filterable @on-change="serveOrgChange" v-model="serveOrgIndex">
                                    <Option v-for="(item, index) in serveOrgList" :key="index" :value="index">{{ item.serviceNm }}</Option>
                                </Select>
                            </FormItem>
                        </i-col>
                        <i-col span="17" style="padding: 0 25px;">
                            <FormItem class="s-price ivu-form-item-required" label="服务结算价" prop="settlementPrice">
                                <Input v-model="serviceForm.settlementPrice" :placeholder="'￥' + serviceForm.settlementPrice" :maxlength="13"/>
                            </FormItem>
                        </i-col>
                    </div>

                    <i-col span="24" class="saveBtn">
                        <i-col span="6" offset="4">
                            <Button type="ghost" @click="cancel">取消</Button>
                        </i-col>
                        <i-col span="6" offset="4">
                            <Button type="primary" @click="openServiceTips('ALREADY_DISPATCH')">{{templeteData.isUnPack ? '拆分并派单' : '派单'}}</Button>
                        </i-col>
                    </i-col>
                </i-col>
            </Form>
        </Row>

        <Modal v-model="serviceTips" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>提示</span>
            </p>
            <div style="text-align:center;padding: 10px;">
                <p v-if="serviceForm.state == 'ALREADY_DISPATCH'">此类型服务单已存在，是否继续派单？</p>
                <p v-else>此类型服务单已存在，是否继续生成？</p>
            </div>
            <div slot="footer" style="text-align: center;">
                <Button type="ghost" size="large" @click="serviceTips=false">取消</Button>
                <Button type="primary" size="large" @click="save">{{ serviceForm.state == 'ALREADY_DISPATCH' ? '继续派单' : '继续生成' }}</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import ServiceBuilder from '../service/serviceBuilder';
    import SDFileList from './SDFileList';
    import SendToServicePerson from "../sendToServicePerson.vue";

    export default {
        data() {
            let $self = this;
            return {
                serviceForm: {
                    billDefId: null,
                    billDefName: '',
                    serviceFrequency: 'DISPOSABLE',
                    serviceDate: null,
                    serviceContent: '',
                    otherContent: '',
                    dispatchType: 'OWN',
                    settlementPrice: '0.00',
                    dispatchRemark: '',
                    templeteData: {},

                    receiveOperatorType: 'SERVER_RECEIVE_PRINCIPAL',
                    serverList: [
                        {
                            secBillId: null,
                            secPostId: null,
                            serveUserId: null,
                            remark: '',
                            servicePersonList: [],
                            lightBulb: false
                        }
                    ],

                    //客户经理
                    managerUserId: null,
                    managerUserName: ''
                },
                ruleValidate: {
                    billDefId: [
                        {required: true, message: '服务单类型不能为空', trigger: 'blur'}
                    ],
                    managerUserId: [
                        {required: true, message: '客户经理不能为空', trigger: 'blur'}
                    ],
                    serviceDate: [
                        {validator(rule, value, callback) {
                            if (value) {
                                if (!Array.isEmpty(value)) {
                                    if (!String.isNullOrBlank(value[0]) && !String.isNullOrBlank(value[0]))
                                    callback();
                                }
                            }
                            callback(new Error('服务结算价不允许为空'));
                        }}
                    ],
                    serviceContent: [
                        {required: true, message: '服务内容不能为空', trigger: 'blur'}
                    ],
                    serveLeaderId: [
                        {validator(rule, value, callback) {
                            if ($self.serviceForm.state == 'ALREADY_DISPATCH') {
                                if (String.isNullOrBlank(value)) {
                                    callback(new Error('服务负责人不能为空'));
                                }
                            }
                            callback();
                        }}
                    ],
                    serveOrgId: [
                        {validator(rule, value, callback) {
                            if ($self.serviceForm.state == 'ALREADY_DISPATCH') {
                                if (String.isNullOrBlank(value)) {
                                    callback(new Error('服务提供商不能为空'));
                                }
                            }
                            callback();
                        }}
                    ],
                    settlementPrice: [
                        {validator(rule, value, callback) {
                            if ($self.serviceForm.state == 'ALREADY_DISPATCH') {
                                if (value || value == 0) {
                                    if (value.toString().length <= 13) {
                                        if (/^0{1}([.]\d{1,2})?$|^[1-9]\d*([.]{1}[0-9]{1,2})?$/.test(value)) {
                                            let _value = parseFloat(value);
                                            if (!isNaN(_value)) {
                                                if (_value < 0) {
                                                    callback([new Error('服务结算价必须大于等于0元')]);
                                                } else {
                                                    callback();
                                                }
                                            } else {
                                                callback([new Error('服务结算价必须大于0元')]);
                                            }
                                        } else {
                                            callback(new Error('服务结算价最多允许输入两位小数'));
                                        }
                                    } else {
                                        callback(new Error('服务结算价不允许超过13位数字'));
                                    }
                                } else {
                                    callback(new Error('服务结算价不允许为空'));
                                }
                            }else {
                                callback();
                            }
                        }}
                    ],
                },
                contractDefService: [],
                serveLeaderList: [],
                serveOrgList: [],
                isOnlyDispatch: false,
                serveOrgIndex: null,
                serveLeaderIndex: null,
                serviceTips: false,
                activeCollapse: ['1'],
                activeFileCollapse: ['1'],
                isShow: false,
                serviceType: null,
                serviceInfo: null,
                templeteData: {},
                isDefault: true,

                serviceTypeList: [],
                tempServicePersonInfo: [],

                managerUserList: [],
                managerUserIndex: null,

                selectedUserList: []
            }
        },
        props: {
            contractInfo: null,
            serviceId: null
        },
        filters: {
            wordLengthLimit : function (value) {
                if(value && value.length > 35){
                    return value.substring(0,35) + "..." ;
                }
                return value;
            },
            postNameLimit : function (value) {
                if(value && value.length > 6){
                    return value.substring(0,6) + "..." ;
                }
                return value;
            },
        },
        watch: {
            'serviceForm.serviceDate'(val) {
                this.serviceForm.serviceDate = val;
                if (val) {
                    if (!Array.isEmpty(val)) {
                        this.serviceForm.serviceLifeStart = val[0];
                        this.serviceForm.serviceLifeEnd = val[1];
                    }
                }
            },
            'serviceForm.dispatchType'(val) {
                this.serviceForm.dispatchType = val;
                if (val == 'OWN') {
                    this.serveOrgIndex = null;
                    this.serviceForm.serveOrgId = null;
                    this.serviceForm.settlementPrice = '0.00';
                }else {
                    this.serveLeaderIndex = null;
                    this.serviceForm.serveLeaderId = null;
                }
            }
        },
        created() {
            this.isOnlyDispatch = true;
            this.initServiceInfo();
        },
        computed: {
            collapseStyle() {
                if (Array.isEmpty(this.activeCollapse)) {
                    return 'chevron-right';
                }else {
                    return 'chevron-down';
                }
            },
            fileCollapseStyle() {
                if (Array.isEmpty(this.activeFileCollapse)) {
                    return 'chevron-right';
                }else {
                    return 'chevron-down';
                }
            }
        },
        methods: {
            initServiceInfo() {
                this.request({
                    url: '/serviceCloud/serviceDispatch/SDInfo.do',
                    param: {
                        id: this.serviceId
                    }
                }).then(data => {
                    this.serviceForm = Object.assign(this.serviceForm, data);
                    this.serviceInfo = Object.assign({}, data);
                    this.serviceForm.serverList = Object.assign([], data.serveUserVoList);

                    if (this.serviceForm.serverList.length == 0) {
                        this.serviceForm.serverList.push({
                            secBillId: this.serviceId,
                            secPostId: null,
                            serveUserId: null,
                            remark: "",
                            lightBulb: false
                        });
                        this.serviceForm.receiveOperatorType = 'SERVER_RECEIVE_PRINCIPAL';
                    }else {
                        this.tempServicePersonInfo = Object.assign([], data.serveUserVoList);
                        this.serviceForm.receiveOperatorType = 'SERVER_RECEIVE_STAFF';
                        this.getOrgServePostList();
                    }

                    if (data.billDefId) {
                        this.getServeLeaderList();
                        this.getServeOrgList();
                    }
                    if (this.serviceForm.serviceLifeStart && this.serviceForm.serviceLifeEnd) {
                        this.serviceForm.serviceDate = [
                            new Date(this.serviceForm.serviceLifeStart),
                            new Date(this.serviceForm.serviceLifeEnd)
                        ];
                    }

                    if (String.isNullOrBlank(this.serviceForm.dispatchType)) {
                        this.serviceForm.dispatchType = 'OWN';
                        this.serviceForm.settlementPrice = '0.00';
                    }

                    if (String.isNullOrBlank(this.serviceForm.serviceFrequency)) {
                        this.serviceForm.serviceFrequency = 'DISPOSABLE';
                    }

                    //加载客户经理
                    this.getManagerUserList();

                    //加载服务单模版
                    if (data.inputTemplateId) {
                        this.isShow = true;
                        this.serviceType = data.inputTemplateId;
                        // this.serviceType = 'ZZQ';
                    }else {
                        this.isShow = false;
                    }
                });
            },
            getManagerUserList() {
                //查询客户经理
                this.request({
                    url: '/serviceCloud/serviceDispatch/managerUser/list.do',
                    param: {
                        orgId: this.$context.getCurrentOrganization().id
                    }
                }).then(data => {
                    this.managerUserList = data;
                    if (data) {
                        data.forEach((item, index) => {
                            if (item.id == this.serviceForm.managerUserId) {
                                this.managerUserIndex = index;
                            }
                        });
                    }
                });
            },
            serveTypeChange(index) {
                this.serviceForm.billDefId = this.contractDefService[index].serviceTicketType;
                this.serviceForm.billDefName = this.contractDefService[index].serviceTicketTypeName;
                this.serviceForm.serviceFrequency = this.contractDefService[index].frequency;
                if (this.serviceForm.billDefId && (this.$refs.billDefId.validateState == 'error')) {
                    this.$refs.billDefId.validateState = 'success'
                }
                if (this.contractDefService[index].inputTemplateId) {
                    this.isShow = true;
                    this.serviceType = this.contractDefService[index].inputTemplateId;
                    // this.serviceType = 'ZZQ';
                }else {
                    this.isShow = false;
                }
                this.getServeLeaderList();
                this.getServeOrgList();
            },
            managerUserChange(index) {
                this.serviceForm.managerUserId = this.managerUserList[index].id;
                this.serviceForm.managerUserName = this.managerUserList[index].realName;
                if (this.serviceForm.managerUserId && (this.$refs.managerUserId.validateState == 'error')) {
                    this.$refs.managerUserId.validateState = 'success'
                }
            },
            getServeLeaderList() {
                //查询服务单类型对应的服务负责人
                this.request({
                    url: '/serviceCloud/serviceDispatch/serveLeader.do',
                    param: {
                        serviceTypeIds: [
                            this.serviceForm.billDefId
                        ]
                    }
                }).then(data => {
                    this.serveLeaderList = data;
                    if (data && this.serviceForm.serveLeaderId) {
                        this.serveLeaderIndex = null;
                        data.forEach((item, index) => {
                            if (item.serveLeaderId == this.serviceForm.serveLeaderId) {
                                this.serveLeaderIndex = index;
                            }
                        });
                    }
                });
            },
            getServeOrgList() {
                //查询服务单类型对应的服务商
                this.request({
                    url: '/serviceCloud/serviceDispatch/serveOrg.do',
                    param: {
                        serviceTypeId: this.serviceForm.billDefId
                    }
                }).then(data => {
                    this.serveOrgList = data;
                    if (data && this.serviceForm.serveOrgId) {
                        data.forEach((item, index) => {
                            if (item.serviceOrgId == this.serviceForm.serveOrgId) {
                                this.serveOrgIndex = index;
                            }
                        });
                    }
                    if (this.serveOrgIndex == null) {
                        if (this.isDefault) {
                            this.isDefault = false;
                        }
                    }
                });
            },
            serviceFrequencyChange(val) {
                this.serviceForm.serviceFrequency = val;
            },
            serveLeaderChange(index) {
                this.serviceForm.serveLeaderId = this.serveLeaderList[index].serveLeaderId;
                this.serviceForm.serveLeaderName = this.serveLeaderList[index].serveLeaderName;
                this.serviceForm.serveLeaderPhone = this.serveLeaderList[index].serveLeaderPhone;
            },
            serveOrgChange(index) {
                this.serviceForm.serveOrgId = this.serveOrgList[index].serviceOrgId;
                this.serviceForm.serveOrgName = this.serveOrgList[index].serviceNm;
                if (!this.isDefault) {
                    this.serviceForm.settlementPrice = this.serveOrgList[index].settlementPrice;
                }else {
                    this.isDefault = false;
                }
            },
            save() {
                let status = this.serviceForm.state;
                this.serviceTips = false;
                delete this.serviceForm.inputTemplateId;
                if ( this.templeteData.isUnPack ) {
                    let oneForm, twoForm;
                    //对当前已生成服务单进行拆分
                    this.serviceForm.templeteData = JSON.stringify(this.templeteData.serviceInfoOne);
                    oneForm = Object.assign({}, this.serviceForm);

                    this.serviceForm.templeteData = JSON.stringify(this.templeteData.serviceInfoTwo);
                    delete this.serviceForm.id;
                    twoForm = Object.assign({}, this.serviceForm);
                    if (status == 'ALREADY_DISPATCH') {
                        twoForm.state = 'NONE_DISPATCH';
                    }

                    if (this.templeteData.serviceInfoOne.copyrightContent.length == 0) {
                        oneForm = null;
                    }

                    if (this.templeteData.serviceInfoTwo.copyrightContent.length == 0) {
                        twoForm = null;
                    }

                    if (oneForm && twoForm) {
                        this.request({
                            url: "/serviceCloud/serviceDispatch/save.do",
                            data: oneForm
                        },{
                            url: "/serviceCloud/serviceDispatch/save.do",
                            data: twoForm
                        }).then(() => {
                            this.$Notice.success({
                                title: '拆单并派单成功'
                            });
                            this.callback(true, 'dispatch');
                        });
                    } else if (oneForm) {
                        this.request({
                            url: "/serviceCloud/serviceDispatch/save.do",
                            data: oneForm
                        }).then(() => {
                            this.$Notice.success({
                                title: '拆单并派单成功'
                            });
                            this.callback(true, 'dispatch');
                        });
                    } else if (twoForm) {
                        this.request({
                            url: "/serviceCloud/serviceDispatch/save.do",
                            data: twoForm
                        }).then(() => {
                            this.$Notice.success({
                                title: '拆单并派单成功'
                            });
                            this.callback(true, 'dispatch');
                        });
                    }
                }else {
                    this.serviceForm.templeteData = JSON.stringify(this.templeteData);
                    this.request({
                        url: "/serviceCloud/serviceDispatch/save.do",
                        data: this.serviceForm
                    }).then(() => {
                        this.$Notice.success({
                            title: '派单成功'
                        });
                        this.callback(true, 'dispatch');
                    });
                }
            },
            openServiceTips(status) {
                this.serviceForm.state = status;
                let allowSave = true;
                this.serviceForm.contractId = this.contractInfo.id;
                this.serviceForm.contractCode = this.contractInfo.code;
                if (this.templeteData.copyrightContent) {
                    this.templeteData.copyrightContent.forEach(item => {
                        if (item.otherContentNew.length == 0) {
                            allowSave = false;
                        }
                    });
                }
                if (!allowSave) {
                    this.$Message.error('请将委托事项与软件/作品名称对应。');
                }

                if (allowSave && this.templeteData.validState) {
                    for (var key in this.templeteData.validState) {
                        let item = this.templeteData.validState[key];
                        if (item.isNull) {
                            this.$Message.error(item.content);
                            allowSave = false;
                            break;
                        }
                    }
                }

                if (!allowSave) {
                    return false;
                }
                this.$refs['form'].validate(valid => {
                    if (this.serviceForm.dispatchType == 'OWN') {
                        if(this.serviceForm.receiveOperatorType == "SERVER_RECEIVE_STAFF"){
                            if (this.$refs['serviceUserForm'].childComponentCheck()) {
                                this.serviceForm.serverList = this.$refs['serviceUserForm'].serviceForm.serverList;
                            }else {
                                return false;
                            }
                        }
                    }
                    if (valid) {
                        this.save();
                    }
                });
            },
            cancel() {
                this.callback(false, null);
            },
            refreshData(data) {
                this.templeteData = Object.assign({}, data);
                if (this.templeteData) {
                    this.serviceForm.serviceLifeStart = this.templeteData.serviceLifeStart;
                    this.serviceForm.serviceLifeEnd = this.templeteData.serviceLifeEnd;
                    this.serviceForm.serviceLifeNum = this.templeteData.serviceLifeNum ? this.templeteData.serviceLifeNum : 1;
                    this.serviceForm.units = this.templeteData.units ? this.templeteData.units : 'MONTH';
                }
            },
            changeRadio () {
                this.serviceForm.dispatchRemark = "";
            },

            checkTab (receiveOperatorType) {
                this.serviceForm.receiveOperatorType = receiveOperatorType;
                if(receiveOperatorType == "SERVER_RECEIVE_STAFF"){
                    this.getOrgServePostList();
                }
            },
            //获取服务岗位列表
            getOrgServePostList () {
                this.request({
                    url: "/serviceCloud/orderOrRefuse/getOrgServePostList.do",
                    param: {
                        billDefId: this.serviceInfo.billDefId
                    }
                }).then((data)=>{
                    this.serviceTypeList = data;
                })
            }
        },
        components: {
            ServiceBuilder,
            SDFileList,
            SendToServicePerson
        }
    }
</script>

<style scoped>
    .invoice-form .ivu-col-span-23 {
        padding: 0 25px;
    }

    .invoice-form .ivu-form-item.title {
        padding-left: 0;
    }

    .invoice-form >>> .ivu-form-item-label {
        color: #5D5D5D;
        /*color: #aaa;*/
        font-weight: 600;
        line-height: 16px;
        font-size: 14px;
        /*padding-left: 17px;*/
    }

    .invoice-form .title >>> .ivu-form-item-label {
        text-align: left;
        font-size: 16px;
        color: #000;
        font-weight: 700;
        padding-left: 5px;
    }

    .invoice-form .normal >>> .ivu-form-item-label {
        text-align: right;
    }

    .invoice-form >>> .ivu-input-group-append, .invoice-form >>> .ivu-input-group-prepend {
        background-color: transparent;
        border: 0;
        border-bottom: 1px solid #eee;
        border-radius: 0;
    }

    .invoice-form .invoice-info span:first-child {
        margin-right: 20px;
    }

    .invoice-form .invoiced-price span {
        font-size: 12px;
    }

    .invoice-form .check-button {
        background-color: #FFF;
        border: 1px solid #54B499;
        border-radius: 4px;
        color: #54B499;
        font-size: 12px;
        /*padding: 6px 23px;*/
        line-height: initial;
        vertical-align: initial;
    }

    .invoice-form .check-button.active {
        background-color: #54B499;
        color: #FFF;
    }

    .invoice-info .invoice-empty-list {
        height: 84px;
        text-align: center;
        color: #333;
        font-size: 16px;
        line-height: 84px;
    }

    .invoice-form >>> input {
        border-radius: 0;
        height: 36px;
    }

    .invoice-form .price >>> input,  .invoice-form >>> input[readonly]{
        border: 1px solid transparent;
        border-bottom: 1px solid #eee;
        border-radius: 0;
    }

    .invoice-form .date >>> input {
        border: 1px solid #eee;
        cursor: initial!important;
    }

    .invoice-form .saveBtn {
        text-align: center;
        margin: 10px 0;
    }

    .invoice-form .saveBtn button {
        padding: 6px 45px;
    }

    .invoice-form .ivu-select-single >>> .ivu-select-selection {
        height: 36px;
        border-radius: 0;
    }

    .invoice-form .ivu-select-single >>> .ivu-select-selection span {
        height: 34px;
        line-height: 34px;
    }

    .invoice-form >>> .ivu-poptip-body {
        padding: 0;
    }

    .invoice-form .ivu-select {
        position: relative;
    }

    .invoice-form .ivu-collapse >>> .ivu-select-dropdown {
        position: absolute!important;
        top: 36px!important;
        /*bottom: initial!important;*/
        left: 8px!important;
        /*right: initial!important;*/
    }

    .invoice-form .org-name {
        /*display: inline-block;*/
        line-height: 36px;
        font-size: 14px;
        color: #8c8c8c;
        /*color: #333;*/
        /*font-weight: 700;*/
    }

    .invoice-form .service-type >>> .ivu-form-item-content{
        margin-left: 17px!important;
    }

    .invoice-form .service-type >>> .ivu-radio-wrapper {
        font-size: 14px;
        min-width: 103px;
        margin: 0;
    }

    .ivu-collapse {
        border: 0;
    }

    .ivu-collapse >>> .ivu-collapse-header {
        padding-left: 5px;
    }

    .ivu-collapse >>> .ivu-collapse-header .ivu-icon.ivu-icon-arrow-right-b {
        display: none!important;
    }

    .ivu-collapse >>> .ivu-collapse-header span {
        font-size: 16px;
        color: #000;
        font-weight: 700;
    }

    .ivu-collapse >>> .ivu-collapse-header .collapse-icon {
        float: right;
        line-height: 38px;
        margin-right: 20px;
    }

    .ivu-collapse >>> .ivu-collapse-content {
        padding: 0;
    }

    .ivu-collapse >>> .ivu-collapse-content .ivu-form-item{
        margin-bottom: 0;
    }

    .invoice-form >>> textarea.ivu-input {
        font-size: 12px;
    }

    .invoice-form .ivu-form-item {
        margin-bottom: 15px;
    }
    .service-state {
        width: 0;
        height: 0;
        border-top: 40px solid #FFCC33;
        border-right: 40px solid transparent;
    }
    .service-state > span{
        position: relative;
        left: 5px;
        top: -38px;
        font-size: 14px;
        color: white;
    }
    .ivu-form-item-required >>> .ivu-form-item-error-tip {
        position: absolute;
        top: 100%;
        left: 0;
        line-height: 1;
        padding-top: 2px;
        color: #ed3f14;
    }
    .ivu-form-item-required >>> .ivu-select-dropdown{
        max-height: 130px;
    }
    .ivu-collapse >>> .ivu-collapse-content > .ivu-collapse-content-box {
        padding-top: 13px;
        padding-bottom: 13px;
    }

    .ivu-collapse >>> .ivu-collapse-content {
        overflow: visible!important;
        padding: 0;
    }

    /*派单方式样式*/
    .tab-button {
        padding-top:5px;
        display: inline-block;
        width: 120px;
        height: 30px;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        text-align: center;
        background-color: #eee;
        cursor: pointer;
    }
    .tab-button > span {
        font-size: 14px;
        color: rgb(153,153,153);
    }
    .tab-button.active {
        padding-top:5px;
        display: inline-block;
        width: 120px;
        height: 30px;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        text-align: center;
        background-color: #59b399;
    }
    .tab-button.active > span {
        font-size: 14px;
        color: rgb(255,255,255);
    }
    .no-label{
        display: inline-block;
    }
    .no-label >>> .ivu-form-item-content{
        margin-left: 0px !important;
    }
    .service-icon{
        display: inline-block;
        font-size: 22px;
        position: relative;
        top: 5px;
    }
    .plus-icon{
        width: 33px;
        height: 33px;
        border: 1px solid #dddeee;
        position: relative;
        top: -3px;
        margin-left: 10px;
        display: inline-block;
        text-align: center;
        border-radius: 3px;
    }
    .plus-icon > i{
        font-size: 12px;
        font-weight: bold;
        position: relative;
        top: 5px;
    }
    .light-bulb >>> .ivu-select-selection{
        border-color: #59b399;
        box-shadow: 0 0 0 2px rgba(89, 179, 153, .2);
    }
    .no-label >>> .ivu-select-dropdown{
        max-height: 80px;
    }
    .no-label >>> .ivu-tooltip{
        width: 118px;
    }

    .customer-name >>> .ivu-form-item-content {
        display: flex;
        align-items: center;
    }

    .customer-name >>> .ivu-tooltip {
        height: 36px;
    }
    .customer-name >>> .ivu-tooltip-inner {
        white-space: normal;
        word-break: break-all;
    }

    .customer-name >>> .ivu-tooltip-rel {
        height: 36px;
        line-height: 36px;
        font-size: 14px;
        color: #8c8c8c;
        max-width: 400px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>