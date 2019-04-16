<template>
    <div>
        <Table stripe :columns="columns1" :data="list" class="table"></Table>

        <Form :model="form" ref="form" class="form" :label-width="2" :rules="ruleValidate" v-show="addFlag">
            <div class="addPanel">
                <div class="addPanelNumber" style="width: 50px;">
                    <FormItem>{{list.length + 1}}</FormItem>
                </div>
                <div style="width: 75px">
                    <FormItem prop="name">
                        <Input v-model="form.name" placeholder="姓名" :maxlength="30" :disabled="isDisable"></Input>
                    </FormItem>
                </div>
                <div style="width: 50px;">
                    <FormItem prop="sex">
                        <Select v-model="form.sex" placeholder="性别" :disabled="isDisable">
                            <Option v-for="type in sexList" :key="type.code" :value="type.code">{{type.name}}</Option>
                        </Select>
                    </FormItem>
                </div>
                <div style="width: 100px;">
                    <FormItem prop="mobile" class="enterprise-name-wrap" v-clickoutside="handleClose">
                        <Input v-model="form.mobile" placeholder="手机" :maxlength="11" :disabled="isDisable"
                               @on-change="mobileChange(form.mobile)"></Input>
                        <div class="enterprise-name-box" v-show="isShow">
                            <a href="javascript:;" class="item" v-for="item in mobileList" @click="selectMobile(item)">{{ item.mobile
                                }}</a>
                        </div>
                    </FormItem>
                </div>
                <div style="  width: 125px">
                    <FormItem prop="wechat">
                        <Input v-model="form.wechat" placeholder="微信" :maxlength="20" :disabled="isDisable"></Input>
                    </FormItem>
                </div>
                <div style="width: 125px;">
                    <FormItem prop="telephone">
                        <Input v-model="form.telephone" placeholder="座机电话" :maxlength="12"
                               :disabled="isDisable"></Input>
                    </FormItem>
                </div>
                <div style="width: 100px;">
                    <FormItem prop="relationship">
                        <Input v-model="form.relationship" placeholder="职务" :maxlength="15"></Input>
                    </FormItem>
                </div>
                <div style="width: 140px;">
                    <FormItem prop="email">
                        <Input v-model="form.email" placeholder="电子邮箱" :maxlength="64" :disabled="isDisable"></Input>
                    </FormItem>
                </div>
                <div style=" width: 90px;">
                    <!--头像-->
                    <FormItem class="uploadWrap">
                        <BSUpload :onSuccess="onSuccess" :type="['png','jpeg','jpg']" v-if="!isDisable">
                            <Button size="small" v-if="!url">上传</Button>
                            <img :src="url" class="urls" v-else/>
                        </BSUpload>
                        <a :href="$updateConfig.file + logoId" target="_blank" style="display: block; text-align: center;" v-if="isDisable && logoId">下载</a>
                    </FormItem>
                    <!--<img v-if="url" :src="url" class="urls"/>-->
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
        <Page size="small" :total="total" :current="page" :page-size="size" v-if="list.length" @on-change="pageChange"
              show-total></Page>
        <Button icon="plus" type="primary" shape="circle" class="add" @click="add" :disabled="addFlag">新增人员</Button>
    </div>
</template>

<script>
    import clickoutside from '@/core/component/directives/clickoutside';

    export default {
        props: {
            clue: null,
            companyId: null
        },
        data: function () {
            return {
                columns1: [
                    {
                        title: '序号',
                        align: 'center',
                        type: 'index',
                        width: 50


                    },
                    {
                        title: '姓名',
                        align: 'center',
                        key: 'name',
                        width: 75,
                        render: (h, params) => {
                            if(params.row.name && params.row.name.length > 4) {
                                return h('Tooltip', {
                                    props: {
                                        content: params.row.name,
                                        placement: 'bottom'
                                    }
                                }, [
                                    h('span', {
                                        attrs: {
//                                        title: params.row.mobile
                                        }
                                    }, params.row.name)
                                ])
                            } else {
                                return params.row.name;
                            }

                        }
                    },
                    {
                        title: '性别',
                        align: 'center',
                        key: 'sex',
                        width: 50,
                        render: (h, params) => {
                            if (params.row.sex) {
                                return params.row.sex;
                            } else {
                                return '-';
                            }
                        }
                    },
                    {
                        title: '手机',
                        align: 'center',
                        key: 'mobile',
                        width: 100,
                        render: (h, params) => {
                            return h('Tooltip', {
                                props: {
                                    content: params.row.mobile,
                                    placement: 'bottom'
                                }
                            }, [
                                h('span', {
                                    attrs: {
//                                        title: params.row.mobile
                                    }
                                }, params.row.mobile.substr(0, 3) + '****' + params.row.mobile.substr(7))
                            ])
                        }
                    },
                    {
                        title: '微信',
                        align: 'center',
                        key: 'wechat',
                        width: 125,
                        render: (h, params) => {
                            if (params.row.wechat) {
                                if (params.row.wechat.length > 8) {
                                    return h('Tooltip', {
                                        props: {
                                            content: params.row.wechat,
                                            placement: 'bottom'
                                        }
                                    }, [
                                        h('span', {
                                            attrs: {
                                                // title: params.row.mobile
                                            }
                                        }, params.row.wechat)
                                    ])
                                } else {
                                    return params.row.wechat;
                                }
                            } else {
                                return '-';
                            }
                        }
                    },
                    {
                        title: '座机电话',
                        align: 'center',
                        key: 'telephone',
                        width: 125,
                        render: (h, params) => {
                            if (params.row.telephone) {
                                return h('Tooltip', {
                                    props: {
                                        content: params.row.telephone,
                                        placement: 'bottom'
                                    }
                                }, [
                                    h('span', {
                                        attrs: {
//                                            title: params.row.telephone
                                        }
                                    }, params.row.telephone.substr(0, 3) + '****' + params.row.telephone.substr(7))
                                ])
                            } else {
                                return '-';
                            }
                        }
                    },
                    {
                        title: '职务',
                        align: 'center',
                        key: 'relationship',
                        width: 100,
                        render: (h, params) => {
                            if (params.row.relationship && params.row.relationship.length > 6) {
                                return h('Tooltip', {
                                    props: {
                                        content: params.row.relationship == undefined ? '-' : params.row.relationship,
                                        placement: 'bottom'
                                    }
                                }, [
                                    h('span', {
                                        attrs: {
                                            // title: params.row.company_address
                                        }
                                    }, params.row.relationship == undefined ? '-' : params.row.relationship)
                                ])
                            } else {
                                return params.row.relationship;
                            }
                        }
                    },
                    {
                        title: '电子邮箱',
                        align: 'center',
                        key: 'email',
                        width: 140,
                        render: (h, params) => {
                            if (params.row.email) {
                                return h('Tooltip', {
                                    props: {
                                        content: params.row.email,
                                        placement: 'bottom'
                                    }
                                }, [
                                    h('span', {
                                        attrs: {
                                            // title: params.row.company_address
                                        }
                                    }, params.row.email)
                                ])
                            } else {
                                return '-';
                            }
                        }
                    },
                    {
                        title: '头像',
                        align: 'center',
                        key: 'logo',
                        width: 90,
                        render: (h, params) => {
                            if (params.row.logo) {
                                return h('a', {
                                    attrs: {
                                        href: this.$updateConfig.file + params.row.logo,
                                        target: '_blank'
                                    },
                                }, '下载')
                            } else {
                                return '-';
                            }
//                            else {
//                                return h('BSUpload', {
//                                    props: {
//                                        maxSize: 50,
//                                        type: ['png','jpeg'],
//                                        beforeUpload: function(file){
//                                            console.log('beforeUpload');
//                                            console.log(file);
//                                        },
//                                        onSuccess: function(id){
//                                            console.log('onSuccess');
//                                            console.log(id);
//                                            params.row.logo = this.$updateConfig.file + id;
//                                        },
//                                    },
//                                }, [
//                                    h('a', {
//                                        on: {
//                                            click: () => {
//                                                console.log('上传');
//                                                console.log(params);
//                                            }
//                                        },
//                                    }, '上传'),
//                                    h('img', {
//
//                                    })
//                                ])
//                            }
                        }
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
                    sex: '',
                    mobile: '',
                    wechat: '',
                    telephone: '',
                    relationship: '',
                    email: '',
                },
                sexList: null,
                addFlag: false,
                ruleValidate: {
                    name: [
                        {required: true, message: '姓名不能为空', trigger: 'change'},
                    ],
                    mobile: [
                        {required: true, message: '手机不能为空', trigger: 'change'},
                        {validator: this.validatorMobile, trigger: 'change'},
//                        { min: 11, max: 11, message: '手机号码为11位', trigger: 'blur' },
//                        { pattern: /^1(3|5|7|8|9)[0-9]{9}$/, message: '请输入正确的手机格式', trigger: 'blur' }
                    ],
                    relationship: [
                        {required: true, message: '职务不能为空', trigger: 'change'},
                    ],
                    email: [
                        {type: 'email', message: '请输入正确邮箱格式', trigger: 'change'}
                    ],
                    telephone: [
                        {
                            type: 'string',
                            message: '请输入正确电话格式',
                            pattern: /^(\(\d{3,4}\)|\d{3,4}-|\d{3,4})?\d{7,8}$/,
                            trigger: 'change'
                        },
                    ]
                },
                url: '',
                urlId: '',
                imageService: '?x-oss-process=image/resize,w_100,h_100/quality,Q_80', // 图片处理
                mobileList: [],
                isShow: false,
                isDisable: false,
                personalId: '',
                logoId: ''
            }
        },
        created: function () {
            this.init();
        },
        methods: {
            init: function () {
                this.request({
                    url: '/crm/clueManagement/personnelList.do',
                    param: {
                        id: this.companyId,
                        page: this.page,
                        size: this.size
                    }
                }).then(data => {
//                    console.log('personnelList');
//                    console.log(data);
                    this.list = data.records;
                    this.page = data.current;
                    this.total = data.total;
                });
            },
            add: function () {
                this.addFlag = true;
                this.initSex();
            },
            save: function (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.request({
                            url: '/crm/clueManagement/personnelAdd.do',
                            data: {
                                companyId: this.companyId,
                                form: this.form,
                                url: this.urlId,
                                provinceCode: this.clue.basic.provinceCode,
                                cityCode: this.clue.basic.cityCode,
                                districtCode: this.clue.basic.districtCode
                            }
                        }).then(() => {
                            this.$Message.success('新增人员成功!');
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
            initSex: function () {
                this.request({
                    url: '/crm/clueManagement/sex.do'
                }).then(data => {
                    this.sexList = data;
                });
            },
            validatorMobile(rule, value, callback) {
//                if (!/^1(3|5|7|8|9)[0-9]{9}$/.test(Number(value))) {
                if (!/^1[2-9][0-9]{9}$/.test(Number(value))) {
                    callback(new Error('请输入正确的手机格式'));
                } else {
                    callback();
                }
            },
            resetFields() {
                this.$refs['form'].resetFields();
                this.url = '';
                this.urlId = '';
            },
            onSuccess: function (id) {
                this.urlId = id;
                this.url = this.$updateConfig.file + id + this.imageService;
            },
            pageChange: function (page) {
                this.page = page;
                this.init();
            },
            eyeSearch: function (key) {
                key = key || '';
                window.open('https://www.tianyancha.com/humansearch/' + key + '?searchfrom=human');
            },
            /*根据输入的手机号查找相关线索信息*/
            mobileChange: function (mobile) {
                if (!mobile || mobile.length != 11) {
                    this.mobileList = [];
                    this.isShow = false;
                    return;
                }

                this.request({
                    url: '/crm/myCollection/mobilePersonnelList.do',
                    param: {
                        mobile: mobile,
                        companyId: this.companyId
                    }
                }).then(mobileList => {
                    this.mobileList = mobileList;
                    if (this.mobileList.length > 0) this.isShow = true;
                });
            },
            /*点击最外层关闭自定义下拉菜单*/
            handleClose: function () {
                this.isShow = false;
            },
            selectMobile(item) {
                this.isShow = false;
                this.isDisable = true;
                this.form.name = item.name || '';
                this.form.sex = item.sex || '';
                this.form.mobile = item.mobile || '';
                this.form.wechat = item.wechat || '';
                this.form.telephone = item.telephone || '';
                this.form.email = item.email || '';
                this.logoId = item.logo || '';
                this.personalId = item.id;
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
    .table {
        border-right: none;
        border-bottom: none;
        border-left: none;
    }

    .add {
        margin: 20px 0 20px 20px;
    }

    .addPanel {
        display: table;
        padding-top: 5px;
        width: 100%;
    }

    .addPanel > * {
        display: table-cell;
    }

    .addPanelNumber {
        line-height: 32px;
        text-align: center;
        /*vertical-align: top;*/
    }
    .addPanelNumber + div >>> .ivu-form-item-error-tip {
        white-space: nowrap;
    }

    .ivu-form-item >>> .ivu-form-item-label {
        padding-right: 0;
        text-align: left;
    }

    .ivu-form-item >>> .ivu-form-item-label:before {
        margin-right: 0;
    }

    .urls {
        width: 32px;
        height: 32px;
        cursor: pointer;
    }

    .table >>> table {
        width: 100% !important;
    }

    .table >>> .eyeSearch {
        color: #666;
        background: #fff;
        border-color: #ddd;
        border-radius: 3px;
        font-size: 12px;
        font-weight: 700;
    }

    .table >>> .eyeSearch:hover {
        opacity: .7;
    }

    .table >>> .ivu-table-cell {
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

    .uploadWrap >>> .ivu-upload {
        text-align: center;
    }

    .enterprise-name-wrap {
        position: relative;
    }

    .enterprise-name-box {
        width: 100%;
        position: absolute;
        left: 0;
        top: 34px;
        background: #fff;
        border-radius: 5px;
        z-index: 1;
        border: 1px solid #ccc;
    }

    .enterprise-name-box .item {
        padding: 0 5px;
        width: 100%;
        display: block;
        color: #333;
    }

    .enterprise-name-box .item:hover {
        background: #bbb;
    }
    .spaceBbreak{
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>