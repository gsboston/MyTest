<template>
    <div style="padding: 15px 20px;">
        <Form ref="form" :model="item" :label-width="100" :rules="ruleValidate">
            <Form-item label="优先级" prop="level">
                <Input v-model="item.level" placeholder="请输入优先级" :maxlength="6"/>
            </Form-item>
            <Form-item label="服务商类型" prop="level">
                <RadioGroup v-model="item.orgType" style="padding-left:10px;width: 350px" @on-change="changeOrgType">
                    <Radio label="内部">内部组织</Radio>
                    <Radio label="外部">外部服务商</Radio>
                </RadioGroup>
            </Form-item>
            <Form-item ref="serviceNm" label="服务商名称" prop="serviceOrgId">
                <Select v-if="item.orgType=='外部'" ref="test" v-model="selectedOrgIndex" filterable :label="item.serviceNm" @on-change="selectOutOrg">
                    <Option v-for="(option, index) in serviceOrgList" :value="index" :key="option.id" :disabled="curOrgId == option.orgId">{{option.name}}</Option>
                </Select>
                <Select v-else ref="test" v-model="selectedInOrgIndex" filterable :label="item.serviceNm" @on-change="selectInOrg">
                    <Option v-for="(option, index) in serviceInOrgList" :value="index" :key="option.orgId" :disabled="curOrgId == option.orgId">{{option.name}}</Option>
                </Select>
                <!--<OrgSearcher v-else :orgId="item.serviceOrgId" :orgName="item.serviceNm" @on-select="selectInOrg"></OrgSearcher>-->
            </Form-item>
            <Form-item label="结算价" prop="settlementPrice" class="ivu-form-item-required">
                <Input v-model="item.settlementPrice" placeholder="请输入结算价" :maxlength="10"/>
            </Form-item>
            <Form-item label="" prop="isViewFlag">
                <Checkbox v-model="item.isViewFlag">是否允许查看客户信息</Checkbox>
            </Form-item>
            <FormItem style="float: right;">
                <Button @click="save">保存</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    import OrgSearcher from "./orgSearcher";

    export default {
        data () {
            return {
                item: {
                    level: '1',
                    orgType: '内部',
                    settlementPrice: '',
                    serviceNm: ''
                },
                ruleValidate: {
                    level: [
                        {required: true, type: 'string', message: '优先级不能为空', trigger: 'blur'},
                        {pattern: /^\d+$/, message: '优先级必须为整数', trigger: 'blur'},
                    ],
                    serviceOrgId: [
                        {required: true, type: 'string', message: '请选择有效服务商', trigger: 'blur'},
                        {max: 50, message: '服务商名称不能多于50个字符'}
                    ],
                    settlementPrice: [
                        {validator(rule, value, callback) {
                            if (value) {
                                if (value.toString().length <= 20) {
                                    if (/^0{1}([.]\d{1,2})?$|^[1-9]\d*([.]{1}[0-9]{1,2})?$/.test(value)) {
                                        let _value = parseFloat(value);
                                        if (!isNaN(_value)) {
                                            if (_value < 0) {
                                                callback([new Error('结算价必须大于等于0元')]);
                                            }else {
                                                callback();
                                            }
                                        }else {
                                            callback([new Error('结算价必须大于0元')]);
                                        }
                                    }else {
                                        callback(new Error('结算价最多允许输入两位小数'));
                                    }
                                }else {
                                    callback(new Error('结算价不允许超过20位数字'));
                                }
                            }else {
                                callback([new Error('结算价不能为空')]);
                            }
                        }}
                    ],
                },
                serviceOrgList: [],
                selectedOrgIndex: null,
                loading: false,

                serviceInOrgList: [],
                selectedInOrgIndex: null,

                curOrgId: this.$context.getCurrentOrganization().id,
            }
        },
        props: {
            serviceId: null,
            id: null
        },
        created: function () {
            if (this.serviceId) {
                this.item['biiDefId'] = this.serviceId;
                this.request({
                    url: "/systemManage/serviceProvider/levelHighest.do",
                    param: {
                        serviceId: this.serviceId
                    }
                }).then(data => {
                    if (data) {
                        this.item.level = parseInt(data) + 1 + '';
                    }else {
                        this.item.level = '1';
                    }
                    this.searchOrgByName();
                    this.searchInOrgByName();
                });
            }else {
                this.request({
                    url: "/systemManage/serviceProvider/info.do",
                    param: {
                        id: this.id
                    }
                }).then((data) => {
                    this.item = data;
                    this.item.level = this.item.level + '';
                    this.searchOrgByName();
                    this.searchInOrgByName();
                });
            }
        },
        methods: {
            searchOrgByName() {
                this.request({
                    url: "/systemManage/serviceProvider/searchOrgTree.do",
                }).then(data => {
                    this.serviceOrgList = data;
                    if (this.item.orgType=='外部') {
                        this.serviceOrgList.forEach((item, index) => {
                            if (this.item.serviceOrgId == item.id) {
                                this.selectedOrgIndex = index;
                            }
                        });
                    }
                });
            },
            searchInOrgByName() {
                this.request({
                    url: "/systemManage/allotmentPage/getAllOrgs.do",
                }).then(data => {
                    this.serviceInOrgList = data;
                    if (this.item.orgType=='内部') {
                        this.serviceInOrgList.forEach((item, index) => {
                            if (this.item.serviceOrgId == item.orgId) {
                                this.selectedInOrgIndex = index;
                            }
                        });
                    }
                });
            },
            selectOutOrg(index) {
                if (this.serviceOrgList[index]) {
                    this.selectedOrgIndex = index;
                    this.item.serviceOrgId = this.serviceOrgList[index].id;
                    this.item.serviceNm = this.serviceOrgList[index].name;
                }
            },
            selectInOrg(index) {
                if (this.serviceInOrgList[index]) {
                    this.selectedInOrgIndex = index;
                    this.item.serviceOrgId = this.serviceInOrgList[index].orgId;
                    this.item.serviceNm = this.serviceInOrgList[index].name;
                }
            },
            // selectInOrg(orgItem) {
            //     this.item.serviceNm = orgItem.title;
            //     this.item.serviceOrgId = orgItem.id;
            //     this.$refs['form'].validateField('serviceOrgId');
            // },
            save: function () {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        let _url = '';
                        if (this.serviceId) {
                            _url = '/systemManage/serviceProvider/save.do';
                        }else {
                            _url = '/systemManage/serviceProvider/update.do';
                        }
                        this.request({
                            url: _url,
                            data: this.item
                        }).then(() => {
                            this.$Message.success('提交成功!');
                            this.callback(true);
                        });
                    }
                });
            },
            changeOrgType(val) {
                if (val == '内部') {
                    this.item.serviceNm = this.selectedInOrgIndex != null ? this.serviceInOrgList[this.selectedInOrgIndex].name : '';
                    this.item.serviceOrgId = this.selectedInOrgIndex != null ? this.serviceInOrgList[this.selectedInOrgIndex].orgId : null;
                }else {
                    this.item.serviceNm = this.selectedOrgIndex != null ? this.serviceOrgList[this.selectedOrgIndex].name : '';
                    this.item.serviceOrgId = this.selectedOrgIndex != null ? this.serviceOrgList[this.selectedOrgIndex].id : null;
                }
                this.$refs['test'].setQuery(this.item.serviceNm);
            }
        },
        components: {
            OrgSearcher,
        }
    };
</script>