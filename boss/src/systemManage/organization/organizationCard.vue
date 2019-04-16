<template>
    <div style="padding: 15px 20px;">
        <Form ref="form" :model="item" :label-width="120" :rules="ruleInline">
            <Row>
                <i-col span="24">
                    <Form-item label="所属区域" prop="areaId" >
                        <Cascader :data="areaTree" :load-data="loadData" :value="item.selectArea" @on-change="changeAreaData"></Cascader>
                    </Form-item>
                </i-col>
            </Row>
            <Row>
                <i-col span="11">
                    <Form-item label="组织编码" prop="code">
                        <Input v-model="item.code" placeholder="请输入组织编码"/>
                    </Form-item>
                </i-col>
                <i-col span="11" offset="2">
                    <Form-item label="组织名称" prop="name">
                        <Input v-model="item.name" placeholder="请输入组织名称"/>
                    </Form-item>
                </i-col>
            </Row>
            <Row>
                <i-col span="11">
                    <Form-item label="组织类型" prop="orgtype_id">
                        <Tag v-if="!isAllowEdit && this.id != null" type="border" color="#59b399">{{ item.orgtype_name }}</Tag>
                        <Select v-else v-model="item.orgtype_id" filterable :disabled="!isAllowEdit && this.id != null" :label-in-value="true" @on-change="changeOrgType">
                            <Option v-for="item in orgTypeList" :value="item.id" :label="item.name" :key="item.code">{{ item.name }}</Option>
                        </Select>
                    </form-item>
                </i-col>
                <i-col span="11" offset="2">
                    <Form-item label="组织简称" prop="abbreviation">
                        <Input v-model="item.abbreviation" placeholder="请输入组织简称" :maxlength="50"/>
                    </Form-item>
                </i-col>
            </Row>

            <!-- 分公司、子公司所需维护信息 -->
            <Row v-if="isChildCompany">
                <i-col span="11">
                    <Form-item label="公司负责人" prop="companyPrincipal">
                        <Input v-model="item.companyPrincipal" placeholder="请输入公司负责人" :maxlength="20"/>
                    </Form-item>
                    <Form-item label="公司联系人" prop="companyContacts">
                        <Input v-model="item.companyContacts" placeholder="请输入公司联系人" :maxlength="20"/>
                    </Form-item>
                    <Form-item label="联系人电话" prop="contactsPhone">
                        <Input v-model="item.contactsPhone" placeholder="请输入联系人电话" :maxlength="11"/>
                    </Form-item>
                </i-col>
                <i-col span="11" offset="2">
                    <Form-item label="负责人电话" prop="principalPhone">
                        <Input v-model="item.principalPhone" placeholder="请输入负责人电话" :maxlength="11"/>
                    </Form-item>
                    <Form-item label="联系人邮箱" prop="contactsEmail">
                        <Input v-model="item.contactsEmail" placeholder="请输入联系人邮箱" :maxlength="20"/>
                    </Form-item>
                    <Form-item label="加盟性质" prop="affiliation">
                        <Select v-model="item.affiliation" filterable>
                            <Option v-for="obj in affiliationList" :value="obj.value" :key="obj.value">{{obj.name}}</Option>
                        </Select>
                    </form-item>
                </i-col>
            </Row>
            <Row v-if="isChildCompany && isShowOriginalName">
                <i-col span="11">
                    <Form-item label="原公司名称" prop="originalOrgName">
                        <Input v-model="item.originalOrgName" placeholder="请输入原公司名称" :maxlength="50"/>
                    </Form-item>
                </i-col>
                <i-col span="11" offset="2">
                    <Form-item label="原公司名称2" prop="originalOrgName2">
                        <Input v-model="item.originalOrgName2" placeholder="请输入原公司名称2" :maxlength="50"/>
                    </Form-item>
                </i-col>
            </Row>

            <!-- 门店所需维护信息 -->
            <Row v-if="isStore">
                <i-col span="11">
                    <Form-item label="授权牌编码" prop="authorizeBrandCode">
                        <Input v-model="item.authorizeBrandCode" placeholder="请输入授权牌编码" :maxlength="50"/>
                    </Form-item>
                </i-col>
                <i-col span="11" offset="2">
                    <Form-item label="授权日期" prop="authorizeDate">
                        <DatePicker type="date" v-model="item.authorizeDate" :editable="false" placeholder="选择授权日期" style="width: 100%"></DatePicker>
                    </Form-item>
                </i-col>
            </Row>

            <Row>
                <i-col span="11">
                    <Form-item v-if="B050201&&isOrg" label="签约主体" prop="signSubject">
                        <i-switch v-model="item.signSubject">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                    </form-item>
                    <Form-item v-if="!isOrg || isReadonly" label="签约主体" prop="signSubject">
                        <i-switch  v-model="item.signSubject" :disabled="disabled">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                    </form-item>
                </i-col>
                <i-col span="11" offset="2">
                    <Form-item label="组织介绍" prop="describe">
                        <Input v-model="item.describe" type="textarea" :rows="3" :autosize="false" placeholder="请输入..."/>
                    </Form-item>
                </i-col>
            </Row>
            <Row>
                <i-col span="24" v-if="(B050201 && item.signSubject && isOrg) || (item.signSubject && isReadonly)">
                    <OrgSubjectCard ref="orgSubjectCard" :isReadonly="isReadonly" :orgId="item.id" @callback-valid="orgSubjectValid"></OrgSubjectCard>
                </i-col>
            </Row>
            <Row>
                <i-col span="23" style="text-align: right;">
                    <Button v-if="cancelBtn" type="ghost" @click="cancel">取消</Button>
                    <Button :disabled="!isAllowSubmit" @click="save">保存</Button>
                </i-col>
            </Row>
        </Form>
    </div>
</template>

<script>
    import OrgAreaSearcher from './orgAreaSearcher.vue';
    import OrgSubjectCard from './orgSubjectCard.vue';

    export default {
        data () {
            let $self= this;
            const addArea = (rule, value, callback) => {
                if ($self.item.selectArea.length < 3) {
                    callback(new Error('请选择完整所属区域!'));
                } else {
                    callback();
                }
            };
            return {
                orgTypeList: [],
                item: {
                    signSubject: false,
                    selectArea: [],
                    affiliation: 'NONE'
                },
                oldCode: null,
                isValid: false,
                isAllowSubmit: true,
                disabled: true,
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
                    orgtype_id: [
                        {required: true, message: '组织类型不能为空'}
                    ],
                    areaId: [
                        {required: true, message: '所属区域不能为空', trigger: 'change'},
                        {validator: addArea, trigger: "change"},
                    ],
                    affiliation: [
                        {required: true, message: '加盟性质不能为空', trigger: 'change'}
                    ],
                    describe: [
                        {max:500, message: '组织介绍不能多于500个字符'}
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
                },
                areaTree: [],
                affiliationList: [
                    {value: 'NONE', name: '无'},
                    {value: 'A', name: 'A轮'},
                    {value: 'B', name: 'B轮'},
                    {value: 'C', name: 'C轮'},
                    {value: 'CITY_LIGHT_HOUSE', name: '城市灯塔'},
                ],
            }
        },
        props: {
            id: null,
            B050201: false,
            isOrg:null,
            cancelBtn: false,
            isComponent: false,
            isSaveOrgSystem: false,
            orgSystemData: {},
            isFilterOrgType: {
                type: Boolean,
                default: true
            },
            isAllowEdit: {
                type: Boolean,
                default: false
            },
            isReadonly: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            id(value) {
                this.id = value;
                this.item = {
                    signSubject: false
                };
                this.$refs['form'].resetFields();
                this.isAllowSubmit = true;
                this.initOrgCard();

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
            this.initOrgCard();
            this.loadArea();
        },
        methods: {
            initOrgCard () {
                if (this.id){
                    this.request({
                        url: `/systemManage/organization/info.do`,
                        param: {
                            id: this.id
                        }
                    }).then(data => {
                        if (undefined !== data && null !== data){
                            this.item = Object.assign(this.item, data);
                            this.oldCode = data.code;
                            this.item.oldCode = data.code;
                            if (data.signSubject) {
                                this.item.subjectInfo = data.orgSubjectVo;
                            }
                            this.checkAreaLevel(data);
                        }
                        this.initOrgTypeData(true);
                    });
                }else {
                    this.initOrgTypeData(true);
                }
            },
            initOrgTypeData(type = false) {
                let vm = this;
                this.request({
                    url: `/systemManage/organizationType/getAll.do`
                }).then(data => {
                    if (undefined !== data && null !== data){
                        if (type) {
                            data.forEach(item1 => {
                                if (item1.id == vm.item.orgtype_id) {
                                    vm.$set(vm.item, 'orgtype_name', item1.name);
                                }
                            });
                        }
                        if (this.isFilterOrgType) {
                            this.orgTypeList = data.filter((item) => {
                                if (item.name != '集团' && item.name != '外部服务商') {
                                    return true;
                                }
                                return false;
                            });
                        }else {
                            this.orgTypeList = data;
                        }
                    }
                });
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
            save: function () {
                this.$refs['form'].validate(valid => {
                    this.isAllowSubmit = false;
                    if (this.B050201 && this.item.signSubject) {
                        if (this.isOrg) {
                            this.$refs['orgSubjectCard'].save();
                            if (!this.isValid) {
                                this.isAllowSubmit = true;
                                return;
                            }
                        }
                    } else {
                        delete this.item.subjectInfo;
                    }
                    if (this.item.selectArea) {
                        this.$set(this.item, "areaId", this.item.selectArea[2]);
                    }
                    if (valid) {

                        let _url = '';
                        if (this.id) {
                            _url = '/systemManage/organization/update.do';
                        }else {
                            if (this.isSaveOrgSystem) { //新增组织体系成员
                                _url = '/systemManage/orgRelation/save.do';
                                this.item.orgSystemOrgVo = {
                                    orgsystem_id: this.orgSystemData.orgSystemId,
                                    parent_id: this.orgSystemData.orgSystemOrgId
                                };
                            }else {
                                _url = '/systemManage/organization/save.do';
                            }
                        }
                        this.request({
                            url: _url,
                            data: this.item
                        }).then(() => {
                            this.$Message.success('提交成功!');
                            this.initOrgCard();
                            if (this.isComponent) {
                                this.cancel();
                            }else {
                                this.callback(true, this.item.name);
                            }
                            this.isAllowSubmit = true;
                        }, error => {
                            this.isAllowSubmit = true;
                        });
                    } else {
                        this.isAllowSubmit = true;
                    }
                })
            },
            orgSubjectValid(isValid, subjectInfo) {
                if (isValid) {
                    this.item.subjectInfo = subjectInfo;
                }
                this.isValid = isValid;
            },
            cancel() {
                this.$emit('on-cancel', 'org');
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
                if (this.item.selectArea) {
                    this.$set(this.item, "areaId", this.item.selectArea[2]);
                }
            },
            changeOrgType(item) {
                if (!String.isNullOrBlank(item.label)) {
                    this.$set(this.item, 'orgtype_name', item.label);
                }
            }
        },
        components: {
            OrgAreaSearcher,
            OrgSubjectCard
        }
    };
</script>

<style scoped>
    .ivu-switch-checked {
        border-color: #59b399;
        background-color: #59b399;
    }
</style>