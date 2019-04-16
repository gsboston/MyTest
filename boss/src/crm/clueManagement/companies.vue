<template>
    <div>
        <Table stripe :columns="columns1" :data="list" class="table"></Table>

        <Form :model="form" ref="form" class="form" :label-width="2" :rules="ruleValidate" v-if="addFlag">
            <div class="addPanel">
                <div class="addPanelNumber" style="width: 60px;">{{list.length + 1}}</div>
                <div style="">
                    <FormItem prop="name" class="enterprise-name-wrap" v-clickoutside="handleClose">
                        <Input v-model="form.name" placeholder="企业" @on-change="companyNameChange(form.name)" :maxlength="200" :disabled="isDisable"></Input>
                        <div class="enterprise-name-box" v-show="isShow">
                            <a href="javascript:;" class="item" v-for="item in companyNameList" @click="selectCompanyName(item)">{{ item.name }}</a>
                        </div>
                    </FormItem>
                </div>
                <div style="">
                    <FormItem prop="company_address">
                        <Input v-model="form.company_address" placeholder="地址" :maxlength="50" :disabled="isDisable"></Input>
                    </FormItem>
                </div>
                <div style="width: 150px;">
                    <FormItem prop="founding_time">
                        <DatePicker v-model="form.founding_time" type="date" placeholder="成立日期" format="yyyy-MM-dd" :disabled="isDisable"></DatePicker>
                    </FormItem>
                </div>
                <div style="">
                    <FormItem prop="registered_capital">
                        <Input v-model="form.registered_capital" placeholder="注册资本(万元)" :maxlength="7" :disabled="isDisable"></Input>
                    </FormItem>
                </div>
                <div style="width: 120px;">
                    <FormItem prop="state">
                        <Select v-model="form.state" placeholder="企业状态" :disabled="isDisable">
                            <Option v-for="type in stateList" :key="type.code" :value="type.code">{{type.name}}</Option>
                        </Select>
                    </FormItem>
                </div>
                <div style="">
                    <FormItem prop="relationship">
                        <Input v-model="form.relationship" placeholder="角色" :maxlength="15"></Input>
                    </FormItem>
                </div>
                <div style="width: 100px;">
                    <FormItem>
                        <Button type="primary" size="small" @click="relationClue('form')" v-if="isDisable">关联</Button>
                        <Button type="primary" size="small" @click="save('form')" v-else>保存</Button>
                        <Button type="ghost" size="small" @click="cancel">取消</Button>
                    </FormItem>
                </div>
            </div>
        </Form>

        <br/>
        <Page size="small" :total="total" :current="page" :page-size="size" v-if="list.length" @on-change="pageChange" show-total></Page>
        <Button icon="plus" type="primary" shape="circle" class="add" @click="add" :disabled="addFlag">新增企业</Button>
    </div>
</template>

<script>
    import clickoutside from '@/core/component/directives/clickoutside';

    export default {
        props: {
            clue: null,
            personalId: null
        },
        data: function () {
            return {
                columns1: [
                    {
                        title: '序号',
                        align: 'center',
                        type: 'index',
                        width: 60
                    },
                    {
                        title: '企业',
                        align: 'center',
                        key: 'name',
                        render: (h, params) => {
                            if (params.row.name) {
                                if (params.row.name.length > 5) {
                                    return h('Tooltip', {
                                        props: {
                                            content: params.row.name,
                                            placement: 'bottom'
                                        }
                                    }, [
                                        h('span', {
                                            attrs: {
//                                        title: params.row.name
                                            }
                                        }, params.row.name)
                                    ])
                                } else {
                                    return params.row.name;
                                }
                            } else {
                                return '-';
                            }
                        }
                    },
                    {
                        title: '地址',
                        align: 'center',
                        key: 'company_address',
                        render: (h, params) => {
                            if (params.row.company_address) {
                                if (params.row.company_address.length > 6) {
                                    return h('Tooltip', {
                                        props: {
                                            content: params.row.company_address,
                                            placement: 'bottom'
                                        }
                                    }, [
                                        h('span', {
                                            attrs: {
        //                                        title: params.row.company_address
                                            }
                                        }, params.row.company_address)
                                    ])
                                } else {
                                    return params.row.company_address;
                                }
                            } else {
                                return '-';
                            }
                        }
                    },
                    {
                        title: '成立日期',
                        align: 'center',
                        key: 'founding_time',
                        width: 150,
                        render: (h, params) => {
                            return params.row.founding_time || '-';
                        }
                    },
                    {
                        title: '注册资本(万元)',
                        align: 'center',
                        key: 'registered_capital',
                        render: (h, params) => {
                            return params.row.registered_capital || '-';
                        }
                    },
                    {
                        title: '企业状态',
                        align: 'center',
                        key: 'state',
                        width: 120,
                        render: (h, params) => {
                            return params.row.state || '-';
                        }
                    },
                    {
                        title: '角色',
                        align: 'center',
                        key: 'relationship'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'action',
                        width: 100,
                        render: (h, params) => {
                            return h('Button', {
                                props: {
                                    type: 'ghost',
                                    size: 'small'
                                },
                                class: {
                                    'eyeSearch': true
                                },
                                on: {
                                    click: () => {
                                        this.eyeSearch(params.row.name);
                                    }
                                }
                            }, '天眼查询')
                        }
                    }
                ],
                list: [],
                page: 1,
                total: 0,
                size: 5,
                form: {
                    name: '',
                    company_address: '',
                    founding_time: '',
                    registered_capital: '',
                    state: '',
                    relationship: '',
                },
                stateList: null,
                addFlag: false,
                ruleValidate: {
                    name: [
                        { required: true, message: '企业名称不能为空', trigger: 'change' }
                    ],
                    relationship: [
                        { required: true, message: '角色不能为空', trigger: 'change' },
                    ],
                    registered_capital: [
                        {validator: this.validatorRegisteredCapital, trigger: 'change' }
                    ]
                },
                companyNameList: [],
                isShow: false,
                isDisable: false,
                companyId: ''
            }
        },
        created: function () {
//            console.log('他的企业')
//            console.log(this.clue)
//            console.log(this.personalId)
            this.init();
        },
        methods: {
            init: function () {
                this.request({
                    url: '/crm/clueManagement/companyList.do',
                    param: {
                        id: this.personalId,
                        page: this.page,
                        size: this.size
                    }
                }).then(data => {
                    this.list = data.records;
                    this.page = data.current;
                    this.total = data.total;
                });
            },
            add: function () {
                this.addFlag = true;
                this.initState();
            },
            save: function (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.request({
                            url: '/crm/clueManagement/companyAdd.do',
                            data: {
                                personalId: this.personalId,
                                form: this.form,
                                provinceCode: this.clue.basic.provinceCode,
                                cityCode: this.clue.basic.cityCode,
                                districtCode: this.clue.basic.districtCode,
                                personalName: this.clue.personal.name,
                                personalMobile: this.clue.personal.mobile
                            }
                        }).then(() => {
//                            console.log('save');
//                            console.log(data);
                            this.$Message.success('新增企业成功!');
                            this.init();

                            this.addFlag = false;
                            this.resetFields();
                        });
                    }
                })
            },
            cancel: function () {
                this.addFlag = false;
                this.isDisable = false;
                this.resetFields();
            },
            initState: function () {
                this.request({
                    url: '/crm/myCollection/enterpriseStatusList.do'
                }).then(data => {
//                    console.log('initState');
//                    console.log(data);
                    this.stateList = data;
                });
            },
            resetFields () {
                this.$refs['form'].resetFields();
            },
            pageChange: function (page) {
                this.page = page;
                this.init();
            },
            eyeSearch: function (key) {
                key = key || '';
                window.open('https://www.tianyancha.com/search?key=' + key);
            },
            validatorRegisteredCapital (rule, value, callback){
                if(value == null)value='';
                if (value != '' && (!/^\d+(\.\d+)?$/.test(value) || Number(value) == 0)) {
                    callback(new Error('请输入正确的注册资本'));
                } else {
                    callback();
                }
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
                    url: '/crm/myCollection/nameAndPersonalId.do',
                    param: {
                        name: name,
                        personalId: this.personalId
                    }
                }).then(companyNameList => {
                    if(this.companyNameTimer === current){
                        this.companyNameList = companyNameList;
                        if(this.companyNameList.length > 0) this.isShow = true;
                    }
                });
            },
            /*点击最外层关闭自定义下拉菜单*/
            handleClose: function () {
                this.isShow = false;
            },
            selectCompanyName: function (item) {
                this.isShow = false;
                this.isDisable = true;
                this.form.name = item.name || '';
                this.form.company_address = item.companyAddress || '';
                this.form.founding_time = item.foundingTime || '';
                this.form.registered_capital = item.registeredCapital || '';
                this.form.state = item.state || '';
                this.companyId = item.id || '';
            },
            /*关联*/
            relationClue: function (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.request({
                            url: '/crm/myCollection/relationClue.do',
                            data: {
                                companyId: this.companyId,
                                personalId : this.personalId,
                                relationship : this.form.relationship,
                            }
                        }).then(() => {
                            this.$Message.success('保存成功!');
                            this.init();
                            this.addFlag = false;
                            this.isDisable = false;
                            this.resetFields();
                        });
                    }
                })
            },
        },
        directives: {
            clickoutside
        }
    }
</script>

<style scoped>
    .table{
        border-right: none;
        border-bottom: none;
        border-left: none;
    }
    .add {
         margin: 20px 0 20px 20px;
    }
    .addPanel{
        display: table;
        padding-top: 5px;
        width: 100%;
    }
    .addPanel>*{
        display: table-cell;
    }
    .addPanelNumber{
        line-height: 32px;
        text-align: center;
    }
    .table >>> table{
        width: 100% !important;
    }
    .table >>> .eyeSearch{
        color: #666;
        background:#fff;
        border-color: #ddd;
        border-radius: 3px;
        font-size: 12px;
        font-weight: 700;
    }
    .table >>> .eyeSearch:hover{
        opacity: .7;
    }
    .table >>> .ivu-table-cell{
        padding: 0 10px;
    }
    .table >>> .ivu-tooltip,
    .table >>> .ivu-tooltip-rel {
        width: 100%;
    }
    .table >>> .ivu-tooltip-rel span {
        display: block;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .table >>> .ivu-tooltip-inner{
        white-space: normal;
        word-break: break-all;
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