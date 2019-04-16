<template>
    <div class="opportunity-wrap">
        <div v-show="!showDocumentary">
            <Table stripe :columns="columns1" :data="list" class="table"></Table>
            <br/>
            <Page size="small" :total="total" :current="page" :page-size="size" v-if="list.length" @on-change="pageChange" show-total></Page>
            <Button icon="plus" type="primary" shape="circle" class="add" @click="add">新增商机</Button>
        </div>


        <div v-show="showDocumentary" class="documentary">
            <div class="documentaryHeader">
                <strong>历史跟进：</strong>
                <span>记录数{{documentaryBaseCurrent.recordNum}}条</span>
                <span>总出访完成{{documentaryBaseCurrent.visit}}次</span>
                <!--<span>历史跟进人{{documentaryBaseCurrent.humanNum}}位<template v-if="documentaryBaseCurrent.humanNum">({{documentaryBaseCurrent.human}})</template></span>-->
                <strong>当前跟进：</strong>
                <span>累计天数{{documentaryBaseCurrent.days}}天</span>
                <span>已转化商机累计天数{{documentaryBaseCurrent.daysTransformed}}天</span>
                <strong>跟进状态：{{documentaryBaseCurrent.level || '- '}}级</strong>
                <span @click="closeDocumentary" class="closeDocumentary"><Icon type="close"></Icon></span>
            </div>
            <Row class="documentaryInfo" type="flex" justify="space-between">
                <i-col style="width: calc(100% - 60px)">
                    <strong>跟进信息</strong>
                    <Tooltip placement="bottom" v-if="documentary.clueName && documentary.clueName.length > 20" class="name">
                        <strong>[ </strong><strong class="">{{documentary.clueName}}</strong><strong> ]</strong>
                        <div slot="content">
                            <div>{{documentary.clueName}}</div>
                        </div>
                    </Tooltip>
                    <strong v-else>[ {{documentary.clueName}} ]</strong>
                    <span class="documentaryTab">
                        <template v-if="documentary.documentaryList && documentary.documentaryList.length > 1">
                            <a href="javascript: void(0);" :class="{'active': item.boid === documentaryTabId}" @click="documentaryTab(item.boid)" v-for="item in documentary.documentaryList" :key="item.boid">{{item.businessName}}</a>
                        </template>
                        <template v-else>
                            <a href="javascript: void(0);" :class="{'active': item.boid === documentaryTabId}" v-for="item in documentary.documentaryList" :key="item.boid">{{item.businessName}}</a>
                        </template>
                    </span>
                </i-col>
                <i-col>
                    <a href="javascript: void(0);" @click="documentaryHistory(1)" v-if="followType === 0">历史跟进</a>
                    <a href="javascript: void(0);" @click="documentaryHistory(0)" v-else>当前跟进</a>
                </i-col>
            </Row>
            <Table stripe :columns="documentaryColumns" :data="documentaryDetailCurrent" v-if="followType === 0" class="table"></Table>
            <Table stripe :columns="documentaryColumns" :data="documentaryDetailCurrent" v-else class="table"></Table>
            <br/>
            <Page size="small" :total="documentaryTotal" :current="documentaryPage" :page-size="documentarySize" v-if="documentaryDetailCurrent.length" @on-change="documentaryPageChange" show-total></Page>
            <Button icon="plus" type="primary" shape="circle" class="addDocumentary" @click="addDocumentary" v-show="followType === 0 && !currentOppoIsComplete">新增跟单记录</Button>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            id: null,
            clue: null,
            prompadd: null, // 新增弹框是否弹出，父组件传值过来
            fromCollection: false, // 是否从我的收藏访问
        },
        data: function () {
            return {
                columns1: [
                    {
                        title: '提供人所在机构',
                        align: 'center',
                        key: 'orginalOrganizationName',
                        className: 'sourceOrg',
                        width: 120,
                        render: (h, params) => {
                            if (params.row.isDocumentary || params.row.status === this.signComplete) {
                                return h('div', [
                                    h('Icon', {
                                        props: {
                                            type: 'android-bookmark'
                                        },
                                        class: {
                                            'documentaryMarkIcon': true,
                                            'signMarkIcon': params.row.status === this.signComplete
                                        },
                                    }),
                                    h('span', {
                                        class: {
                                            'documentaryIcon': true,
                                            'android-bookmark': true
                                        },
                                        style: {
                                            'display': 'none'
                                        }
//                                    }),
//                                    }, '已跟单'),
                                    }),
                                    h('span', params.row.orginalOrganizationName)
                                ]);
                            } else {
                                return h('div', [
                                    h('span', params.row.orginalOrganizationName)
                                ]);
                            }
                        }
                    },
                    {
                        title: '商机提供人',
                        align: 'center',
                        key: 'orginalCreatorRealName',
                        width: 90
                    },
                    {
                        title: '当前所属人',
                        align: 'center',
                        key: 'creatorRealName',
                        width: 90
                    },
                    {
                        title: '业务需求',
                        align: 'center',
                        key: 'businessName',
                        width: 80
                    },
                    {
                        title: '创建时间',
                        align: 'center',
                        key: 'tsInsert',
                        sortable: true,
                        width: 100
                    },
                    {
                        title: '商机来源',
                        align: 'center',
                        key: 'fromFlagStr',
                        width: 80
                    },
                    {
                        title: '商机类型',
                        align: 'center',
                        key: 'type',
                        width: 80,
                        render: (h, params) => {
                            return h('div', [
                                h('span', {
                                    style: {
                                        'vertical-align': 'middle'
                                    }
                                }, params.row.type === 1 ? '私有' : '协作'),
//                                h('span', {
//                                    attrs: {
//                                        title: '私有转公共',
//                                        disabled: !params.row.isCreateYouself || params.row.type !== 1
//                                    },
//                                    class: {
//                                        'btn': true,
//                                        'btnConvert': true
//                                    },
//                                    style: {
//                                        display: !params.row.isCreateYouself || params.row.type !== 1 ? 'none' : 'inline-block'
//                                    },
//                                    on: {
//                                        click: () => {
//                                            this.$Modal.confirm({
//                                                title: '确认对话框',
//                                                content: '<p>私有转公共之后将无法逆转，请确认真的要转？</p>',
//                                                onOk: () => {
//                                                    this.request({
//                                                        url: '/crm/clueManagement/opportunityConvert.do',
//                                                        param: {
//                                                            oppoId: params.row.id
//                                                        }
//                                                    }).then(data => {
//                                                        params.row.type = 2;
//                                                    });
//                                                }
//                                            })
//                                        }
//                                    }
//                                })
                            ])
                        }
                    },
                    {
                        title: '备注',
                        align: 'center',
                        key: 'comments',
//                        width: 100,
//                        ellipsis: true,
                        render: (h, params) => {
                            if(params.row.comments){
                                if(params.row.comments.length > 6){
                                    return h('Tooltip', {
                                        props: {
                                            content: params.row.comments,
                                            placement: 'bottom'
                                        },
                                    }, [
                                        h('span', params.row.comments)
                                    ])
                                } else {
                                    return params.row.comments;
                                }
                            } else {
                                return '-';
                            }
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'action',
                        width: 200,
                        render: (h, params) => {
                            return h('div', {
                                class: {
                                    'actionWrap': true
                                },
                                style: {
                                    'text-align': 'center'
                                }
                            }, [
                                h('span', {
                                    attrs: {
                                        title: '我要跟单',
                                        disabled: params.row.isDocumentary && !this.fromCollection
                                    },
                                    class: {
                                        'btn': true,
                                        'btnDocumentary': !params.row.isDocumentary || this.fromCollection,
                                        'btnDocumentaryDisable': params.row.isDocumentary && !this.fromCollection
                                    },
                                    on: {
                                        click: () => {
                                            if(!params.row.isDocumentary || this.fromCollection){
                                                this.currentOppoIsComplete = params.row.status === this.signComplete;
                                                if(!params.row.isDocumentary){
                                                    this.request({
                                                        url: '/crm/clueManagement/documentary.do',
                                                        param: {
                                                            clueId: this.id,
                                                            oppoId: params.row.id
                                                        }
                                                    }).then(() => {
                                                        params.row.isDocumentary = true;
                                                        params.row.collection = true;
                                                        if(this.fromCollection){
                                                            this.toDocumentary(params.row.id);
                                                        }
                                                    });
                                                } else {
                                                    this.toDocumentary(params.row.id);
                                                }
                                            }
                                        }
                                    }
                                }),
                                h('span', {
                                    attrs: {
                                        title: '签约',
                                    },
                                    class: {
                                        'btn': true,
                                        'btnSign': true,
                                        'btnSignDisable': false
                                    },
                                    style: {
//                                        display: 'none'
                                        display: params.row.status === this.signComplete || !params.row.isDocumentary || this.currentUserId!= params.row.creator ? 'none' : 'inline-block'
                                    },
                                    on: {
                                        click: async () => {
                                            let _this = this;

                                            function oppoSignCheck() {
                                                return _this.request({
                                                    url: '/crm/clueManagement/oppoSignCheck.do',
                                                    param: {
                                                        oppoId: params.row.id
                                                    }
                                                });
                                            }

                                            let checkData = await oppoSignCheck();

                                            if (typeof checkData !== 'boolean' || checkData) {
                                                this.$Message.warning({
                                                    content: '该商机已有有效合约，请勿重复提交！',
                                                    duration: 2
                                                });
                                                return;
                                            }

                                            let data = {};

                                            if(this.clue.basic.typeId === 1){
                                                data.type = 'PERSON';
                                                data.name = this.clue.personal.name;
                                                data.idno = this.clue.personal.idCard;
                                                data.contactName = this.clue.personal.name;
                                                data.contactPhone = this.clue.personal.mobile;
                                                data.email = this.clue.personal.email;
                                                data.address = this.clue.personal.address;
                                            } else {
                                                data.type = 'COMPANY';
                                                data.name = this.clue.company.name;
                                                data.idno = this.clue.company.socialCreditCode;
//                                                data.contactName = this.clue.company.companyContacts;
                                                data.contactName = this.clue.company.legalRepresentative;
                                                data.contactPhone = this.clue.company.companyContactsMobile;
                                                data.email = this.clue.company.companyEmail;
                                                data.address = this.clue.company.companyAddress;
                                            }

//                                            this.$api.openContractBuilder(params.row.businessCode, {
//                                                "defaultInfo": {
//                                                    "type": data.type, // 线索类型：自然人 PERSON, 公司 COMPANY
//                                                    "name": data.name, // 自然人名称或公司名称
//                                                    "idno": data.idno, // 企业识别码或个人身份证号
//                                                    "contactName": data.contactName, // 公司联系人或自然人名称
//                                                    "contactPhone": data.contactPhone, // 公司联系人手机或自然人手机
//                                                    "email": data.email, // 邮箱
//                                                    "address": data.address, // 地址
//                                                },
////                                                "businessCode": params.row.businessCode, // 服务类型 id
//                                                "businessName": params.row.businessName, // 服务类型名称
//                                                "hxId": params.row.hxId, // 线索 id
//                                                "boId": params.row.id // 商机 id
//                                            });

                                            let oppoData = {
                                                "defaultInfo": {
                                                    "type": data.type, // 线索类型：自然人 PERSON, 公司 COMPANY
                                                    "name": data.name, // 自然人名称或公司名称
                                                    "idno": data.idno, // 企业识别码或个人身份证号
                                                    "contactName": data.contactName, // 公司联系人或自然人名称
                                                    "contactPhone": data.contactPhone, // 公司联系人手机或自然人手机
                                                    "email": data.email, // 邮箱
                                                    "address": data.address, // 地址
                                                },
//                                                "businessCode": params.row.businessCode, // 服务类型 id
                                                "businessName": params.row.businessName, // 服务类型名称
                                                "hxId": params.row.hxId, // 线索 id
                                                "boId": params.row.id // 商机 id
                                            };

                                            this.$emit('toSignContract', params.row.businessCode, oppoData);
                                        }
                                    }
                                }),
                                h('span', {
                                    attrs: {
                                        title: '我要派单',
                                        disabled: params.row.status === this.signComplete
                                    },
                                    class: {
                                        'btn': true,
                                        'btnDispatch': true,
                                    },
                                    style: {
                                        display: params.row.status === this.signComplete || this.currentUserId!= params.row.creator ? 'none' : 'inline-block'
                                    },
                                    on: {
                                        click: () => {
//                                            console.log('我要派单-click');
//                                            console.log(params.row);
//                                            return;
                                            this.prompt({
                                                code: 'dispath',
                                                title: '派单',
                                                width: 640,
                                                height: 500,
                                                props: {
                                                    clueId: this.id,
                                                    oppoId: params.row.id,
                                                    orgId: this.$context.getCurrentOrganization().id
                                                },
                                                callback: (statusStr, close) => {
                                                    if (statusStr === 'success') {
                                                        this.init();
                                                    }
                                                    close();
                                                }
                                            })
                                        }
                                    }
                                }),
//                                h('span', {
//                                    attrs: {
//                                        title: '收藏',
//                                    },
//                                    class: {
//                                        'btn': true,
//                                        'btnCollection': true,
//                                    },
//                                    style: {
//                                        display: params.row.collection ? 'none' : 'inline-block'
//                                    },
//                                    on: {
//                                        click: () => {
//                                            this.request({
//                                                url: '/crm/clueManagement/opportunityCollection.do',
//                                                param: {
//                                                    clueId: this.id,
//                                                    oppoId: params.row.id
//                                                }
//                                            }).then(() => {
//                                                this.$Message.success('收藏成功');
//                                                params.row.collection = true;
//                                            });
//                                        }
//                                    }
//                                }),
//                                h('span', {
//                                    attrs: {
//                                        title: '取消收藏',
//                                    },
//                                    class: {
//                                        'btn': true,
//                                        'btnCollectionCancel': true
//                                    },
//                                    style: {
//                                        display: params.row.collection ? 'inline-block' : 'none'
//                                    },
//                                    on: {
//                                        click: () => {
//                                            this.request({
//                                                url: '/crm/clueManagement/opportunityCollection.do',
//                                                param: {
//                                                    clueId: this.id,
//                                                    oppoId: params.row.id
//                                                }
//                                            }).then(() => {
//                                                this.$Message.success('取消收藏成功');
//                                                params.row.collection = false;
//                                            });
//                                        }
//                                    }
//                                }),
                                h('span', {
                                    attrs: {
                                        title: '取消跟单',
                                        disabled: !params.row.isDocumentary || params.row.status === this.signComplete
                                    },
                                    class: {
                                        'btn': true,
                                        'btnDocumentaryCancel': true
                                    },
                                    style: {
                                        display: !params.row.isDocumentary || params.row.status === this.signComplete || this.currentUserId!= params.row.creator ? 'none' : 'inline-block'
                                    },
                                    on: {
                                        click: () => {
                                            if(params.row.isDocumentary){
                                                this.request({
                                                    url: '/crm/clueManagement/documentaryCancel.do',
                                                    param: {
                                                        oppoId: params.row.id
                                                    }
                                                }).then(() => {
                                                    params.row.isDocumentary = false;
                                                });
                                            }
                                        }
                                    }
                                }),
//                                h('span', {
//                                    attrs: {
//                                        title: '签约完成',
//                                        disabled: params.row.status === this.signComplete
//                                    },
//                                    class: {
//                                        'btn': true,
//                                        'btnSignComplete': true,
//                                    },
//                                    style: {
//                                        display: params.row.status === this.signComplete || !params.row.isDocumentary ? 'none' : 'inline-block'
//                                    },
//                                    on: {
//                                        click: () => {
//                                            this.$Modal.confirm({
//                                                title: '确认对话框',
//                                                content: '<p>确认签约完成后签约按钮、取消跟单按钮、签约完成按钮、删除按钮将消失。您是否真的确认签约完成吗？</p>',
//                                                onOk: () => {
//                                                    this.request({
//                                                        url: '/crm/clueManagement/oppoSignComplete.do',
//                                                        param: {
//                                                            clueId: this.id,
//                                                            oppoId: params.row.id
//                                                        }
//                                                    }).then(() => {
////                                                            this.list.splice(params.index, 1);
//                                                        params.row.status = this.signComplete;
//                                                    });
//                                                }
//                                            });
//                                        }
//                                    }
//                                }),
                                h('span', {
                                    attrs: {
                                        title: '删除',
                                        disabled: !params.row.isCreateYouself || params.row.status === this.signComplete
                                    },
                                    class: {
                                        'btn': true,
//                                        'btnDel': params.row.isCreateYouself,
//                                        'btnDelDisable': !params.row.isCreateYouself
                                        'btnDelDisable': true
                                    },
                                    style: {
                                        display: !params.row.isCreateYouself || params.row.status === this.signComplete || this.currentUserId!= params.row.creator ? 'none' : 'inline-block'
                                    },
                                    on: {
                                        click: () => {
                                            if(params.row.isCreateYouself){
                                                this.$Modal.confirm({
                                                    title: '确认对话框',
                                                    content: '<p>确认要删除吗？</p>',
                                                    onOk: () => {
                                                        this.request({
                                                            url: '/crm/clueManagement/opportunityDel.do',
                                                            param: {
                                                                clueId: this.id,
                                                                oppoId: params.row.id
                                                            }
                                                        }).then(() => {
                                                            this.page = 1;
                                                            this.init();
//                                                            this.list.splice(params.index, 1);
                                                            if(params.row.type === 2){
                                                                this.$emit('opportunityNumInit', this.clue, 1, 'minus');
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }),
                                h('span', {
                                    attrs: {
                                        title: '协作',
                                        disabled: params.row.status === this.signComplete
                                    },
                                    class: {
                                        'btn': true,
                                        'btnCooperation': true,
                                    },
                                    style: {
                                        display: params.row.status === this.signComplete || this.currentUserId!= params.row.creator ? 'none' : 'inline-block'
                                    },
                                    on: {
                                        click: () => {
//                                            console.log('我要派单-click');
//                                            console.log(params.row);
//                                            return;
                                            this.prompt({
                                                code: 'cooperation',
                                                title: '协作',
                                                width: 640,
                                                height: 500,
                                                props: {
                                                    clueId: this.id,
                                                    oppoId: params.row.id,
                                                    orgId: this.$context.getCurrentOrganization().id
                                                },
                                                callback: (statusStr, close) => {
                                                    if (statusStr === 'success') {
                                                        this.init();
                                                    }
                                                    close();
                                                }
                                            })
                                        }
                                    }
                                }),
                            ])
                        }
                    },
//                    {
//                        title: '操作',
//                        align: 'center',
//                        key: 'action',
////                        width: 350,
//                        render: (h, params) => {
//                            return h('div', [
//                                h('Button', {
//                                    props: {
//                                        type: 'primary',
//                                        size: 'small',
//                                        disabled: params.row.isDocumentary && !this.fromCollection
//                                    },
//                                    style: {},
//                                    on: {
//                                        click: () => {
//                                            if(!params.row.isDocumentary){
//                                                this.request({
//                                                    url: '/crm/clueManagement/documentary.do',
//                                                    param: {
//                                                        clueId: this.id,
//                                                        oppoId: params.row.id
//                                                    }
//                                                }).then(data => {
//                                                    params.row.isDocumentary = true;
//                                                    params.row.collection = true;
//                                                    if(this.fromCollection){
//                                                        this.toDocumentary(params.row.id);
//                                                    }
//                                                });
//                                            } else {
//                                                this.toDocumentary(params.row.id);
//                                            }
//                                        }
//                                    }
//                                }, '我要跟单'),
//                                h('Button', {
//                                    props: {
//                                        type: 'primary',
//                                        size: 'small'
//                                    },
//                                    style: {
//                                        display: 'none'
//                                    },
//                                    on: {
//                                        click: () => {
////                                            console.log('签约');
////                                            console.log(params);
//                                        }
//                                    }
//                                }, '签约'),
//                                h('Button', {
//                                    props: {
//                                        type: 'primary',
//                                        size: 'small'
//                                    },
//                                    style: {
//                                        display: params.row.collection ? 'none' : 'inline-block'
//                                    },
//                                    on: {
//                                        click: () => {
//                                            this.request({
//                                                url: '/crm/clueManagement/opportunityCollection.do',
//                                                param: {
//                                                    clueId: this.id,
//                                                    oppoId: params.row.id
//                                                }
//                                            }).then(data => {
//                                                this.$Message.success('收藏成功');
//                                                params.row.collection = true;
//                                            });
//                                        }
//                                    }
//                                }, '收藏'),
//                                h('Button', {
//                                    props: {
//                                        type: 'primary',
//                                        size: 'small'
//                                    },
//                                    style: {
//                                        display: params.row.collection ? 'inline-block' : 'none'
//                                    },
//                                    on: {
//                                        click: () => {
//                                            this.request({
//                                                url: '/crm/clueManagement/opportunityCollection.do',
//                                                param: {
//                                                    clueId: this.id,
//                                                    oppoId: params.row.id
//                                                }
//                                            }).then(data => {
//                                                this.$Message.success('取消收藏成功');
//                                                params.row.collection = false;
//                                            });
//                                        }
//                                    }
//                                }, '已收藏'),
//                                h('Button', {
//                                    props: {
//                                        type: 'primary',
//                                        size: 'small',
//                                        disabled: !params.row.isDocumentary
//                                    },
//                                    style: {},
//                                    on: {
//                                        click: () => {
//                                            this.request({
//                                                url: '/crm/clueManagement/documentaryCancel.do',
//                                                param: {
//                                                    oppoId: params.row.id
//                                                }
//                                            }).then(data => {
//                                                params.row.isDocumentary = false;
//                                            });
//                                        }
//                                    }
//                                }, '取消跟单'),
//                                h('Button', {
//                                    props: {
//                                        type: 'primary',
//                                        size: 'small',
//                                        disabled: !params.row.isCreateYouself || params.row.type !== 1
//                                    },
//                                    style: {},
//                                    on: {
//                                        click: () => {
//                                            this.request({
//                                                url: '/crm/clueManagement/opportunityConvert.do',
//                                                param: {
//                                                    oppoId: params.row.id
//                                                }
//                                            }).then(data => {
//                                                params.row.type = 2;
//                                            });
//                                        }
//                                    }
//                                }, '私有转公共'),
//                                h('Button', {
//                                    props: {
//                                        type: 'primary',
//                                        size: 'small',
//                                        disabled: !params.row.isCreateYouself
//                                    },
//                                    style: {},
//                                    on: {
//                                        click: () => {
//                                            this.request({
//                                                url: '/crm/clueManagement/opportunityDel.do',
//                                                param: {
//                                                    clueId: this.id,
//                                                    oppoId: params.row.id
//                                                }
//                                            }).then(data => {
//                                                this.list.splice(params.index, 1);
//                                            });
//                                        }
//                                    }
//                                }, '删除')
//                            ])
//                        }
//                    }
                ],
                list: [],
                page: 1,
                total: 0,
                size: 5,
                signComplete: '1', // 商机签约完成标识
                currentOppoIsComplete: false, // 当前点击跟单商机签约完成标状态


                showDocumentary: false,
//                showDocumentary: this.fromCollection,
                documentaryColumns: [
                    {
                        title: '序号',
                        align: 'center',
                        type: 'index',
                        width: 60
                    },
                    {
                        title: '沟通目的',
                        align: 'center',
                        key: 'targetName',
                        width: 130
                    },
                    {
                        title: '意向度',
                        align: 'center',
                        key: 'intentionalityName'
                    },
                    {
                        title: '沟通结果',
                        align: 'center',
                        key: 'result',
                        render: (h, params) => {
                            if (params.row.result) {
                                if (params.row.result.length > 8) {
                                    return h('Tooltip', {
                                        props: {
                                            content: params.row.result,
                                            placement: 'bottom'
                                        }
                                    }, [
                                        h('span', {
                                            attrs: {
//                                        title: params.row.company_address
                                            }
                                        }, params.row.result)
                                    ])
                                } else {
                                    return params.row.result;
                                }
                            } else {
                                return '-';
                            }

                        }
                    },
                    {
                        title: '执行时间',
                        align: 'center',
                        key: 'visitTime',
                        sortable: true,
                        render: (h, params) => {
                            return params.row.visitTime || '-';
                        }
                    },
                    {
                        title: '下次跟进时间',
                        align: 'center',
                        key: 'nextVisitTime',
                        sortable: true,
                        render: (h, params) => {
                            return params.row.nextVisitTime || '-';
                        }
                    },
                    {
                        title: '附件',
                        align: 'center',
                        render: (h, params) => {
                            if (params.row.storeKey) {
                                let logoIds = params.row.storeKey.split(',');

                                if (logoIds.length > 1) {
                                    return h('a', {
                                        attrs: {
                                            href: 'javascript:void(0);'
                                        },
                                        on: {
                                            click: () => {
                                                logoIds.forEach(item => {
                                                    this.downloadFile(this.$updateConfig.file + item);
                                                })
                                            }
                                        }
                                    }, '下载')
                                } else {
                                    return h('a', {
                                        attrs: {
                                            href: this.$updateConfig.file + params.row.storeKey,
//                                        target: '_blank',
                                            download: 'download'
                                        },
                                    }, '下载')
                                }
                            } else {
                                return '-';
                            }
                        }
                    }],
                documentary: [],
                documentaryBase: [], // 跟单记录报表容器数组
                documentaryDetail: [], // 跟单记录列表容器数组
                documentaryBaseCurrent: {}, // 当前选中 tab 跟单记录报表数据
                documentaryDetailCurrent: [], // 当前选中 tab 跟单记录列表数据
                documentaryTabIndex: 0, // 跟单记录当前选中 tab 索引
                documentaryTabId: null, // 跟单记录当前选中 tab id
                followType: 0, // 0 指的是当前数据为当前跟进，1 指的是当前数据为历史跟进
                isPrompadd: null, // 新增弹框是否弹出，当前子组件接收父组件传过来的值，方便 watch 监听
//                addDocumentaryId: '', // 新增商机跟单记录的商机 id
                url: '',
                urlId: '',
                documentaryPage: 1,
                documentaryTotal: 0,
                documentarySize: 5,
                currentUserId:'',
            }
        },
        created: function () {
//            console.log('商机列表');
//            console.log(this.id);
//            console.log(this.clue);
//            console.log(this.fromCollection);
            this.init();
            this.isPrompadd = this.prompadd;
            this.currentUserId = this.$context.getCurrentUser().id;

        },
        methods: {
            init: function () {
                this.request({
                    url: '/crm/clueManagement/opportunityList.do',
                    param: {
                        id: this.id,
//                        from: this.fromCollection ? 'collection' : 'hx',
                        from: 'hx',
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
                this.prompt({
                    code: 'opportunityAdd',
                    title: '新增商机',
                    width: 640,
//                    height: 410,
                    height: '80%',
                    props: {
                        id: this.id,
                        from: this.fromCollection ? 'collection' : 'hx'
                    },
                    callback: (initList, opportunityNum, close) => {
                        close();
                        if (initList === 'initList') {
                            this.init();
                            this.$emit('opportunityNumInit', this.clue, opportunityNum, 'plus');
                        }
                    }
                })
            },
            pageChange: function (page) {
                this.page = page;
                this.init();
            },


            documentaryPageChange: function (page) {
                this.documentaryPage = page;
                this.documentaryTab(this.documentaryTabId, 'pageChange');
            },
            addDocumentary: function () {
                this.prompt({
                    code: 'documentaryAdd',
                    title: '新增跟单记录',
                    width: 500,
                    height: 500,
                    props: {
                        id: this.id,
                        oppoId: this.documentaryTabId
                    },
                    callback: (documentaryData, close) => {
                        close();
                        if(documentaryData){
                            this.documentaryDetailCurrent.push(documentaryData);
                        }
                    }
                })
            },
            closeDocumentary: function () {
                this.showDocumentary = false;
                this.followType = 0;
            },
            documentaryHistory: function (num) {
                this.followType = num;
                this.documentaryPage = 1;

                this.documentaryTab(this.documentaryTabId);
            },
            documentaryTab: function (oppoId, str) {
//                console.log('documentaryTab');

//                let baseFlag = false,
//                    detailFlag = false;
//
//                this.documentaryBase.forEach((item, index) => {
//                    console.log('documentaryBase-forEach');
//                    console.log(item);
//                    if (item.oppoId === oppoId) {
//                        baseFlag = true;
//                        this.documentaryBaseCurrent = item;
//                        this.documentaryTabId = oppoId;
//                    }
//                })
//                this.documentaryDetail.forEach((item, index) => {
//                    console.log('documentaryDetail-forEach');
//                    console.log(item);
//                    if (item.oppoId === oppoId) {
//                        detailFlag = true;
//                        this.documentaryDetailCurrent = item;
//                    }
//                })

                this.documentaryTabId = oppoId;
                if(str !== 'pageChange') {
                    this.documentaryPage = 1;
                }

                if(this.followType){
                    // 历史跟进
                    this.request({
                        url: '/crm/clueManagement/documentaryHistory.do',
                        data: {
                            clueId: this.id,
                            oppoId: oppoId,
                            clue: this.clue,
                            page: this.documentaryPage,
                            size: this.documentarySize
                        }
                    }).then(data => {
                        this.documentaryBaseCurrent = data.base;
                        this.documentaryDetailCurrent = data.detail[0].data.records || [];
                        this.documentaryPage = data.detail[0].data.current;
                        this.documentaryTotal = data.detail[0].data.total;
                    })
                } else {
                    // 当前跟进
                    this.request({
                        url: '/crm/clueManagement/documentaryList.do',
                        data: {
                            clueId: this.id,
                            oppoId: oppoId,
                            clue: this.clue,
                            page: this.documentaryPage,
                            size: this.documentarySize
                        }
                    }).then(data => {
                        this.documentaryBaseCurrent = data.base;
                        this.documentaryDetailCurrent = data.detail[0].data.records || [];
                        this.documentaryPage = data.detail[0].data.current;
                        this.documentaryTotal = data.detail[0].data.total;
                    })
                }
            },
            toDocumentary: function (id) {
                this.request({
                    url: '/crm/clueManagement/documentaryList.do',
                    data: {
                        clueId: this.id,
                        oppoId: id,
                        clue: this.clue,
                        page: this.documentaryPage,
                        size: this.documentarySize
                    }
                }).then(data => {
                    this.documentary = data;
//                    this.documentaryTabId = this.documentary.documentaryList[0].boid;
                    this.documentaryTabId = id;
                    this.showDocumentary = true;
//                    this.addDocumentaryId = id;

                    this.documentaryBaseCurrent = this.documentary.base;
                    this.documentaryDetailCurrent = this.documentary.detail[0].data.records || [];
                    this.documentaryPage = data.detail[0].data.current;
                    this.documentaryTotal = data.detail[0].data.total;
                });
            },
            downloadFile(url, filename) {
                let aLink = document.createElement('a'),
                    evt = document.createEvent('HTMLEvents');

                evt.initEvent('click', false, false);
                aLink.download = filename;
                aLink.href = url;

                aLink.dispatchEvent(evt);
                aLink.click();
            }
        },
        watch: {
            isPrompadd: function (val) {
                if (val) {
                    this.$emit('resetPrompadd', this.clue);
                    this.add();
                }
            }
        }
    };
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

    .documentaryHeader {
        position: relative;
        padding: 10px 0;
        background: #FEFCE3;
        color: #9D6F2A;
        border: 1px solid #F9CD89;
        border-left: none;
        border-right: none;
    }

    .documentaryHeader strong {
        margin-left: 30px;
    }

    .documentaryHeader span {
        margin-right: 20px;
    }

    .documentaryInfo {
        padding: 10px 50px 10px 30px;
        background: #FCFCFD;
    }

    .documentaryTab a {
        margin-left: 20px;
        color: #6B6B6B;
    }
    .documentaryTab a.active {
        text-decoration: underline;
        color: #2C74E7;
    }

    .addDocumentary {
        display: block;
        margin: 20px 0;
    }

    .closeDocumentary {
        position: absolute;
        right: 0;
        cursor: pointer;
    }

    .closeDocumentary:hover {
        color: #999;
    }
    .table >>> table{
        width: 100% !important;
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
        white-space: pre-wrap;
        word-break: break-all;
    }
    .table >>> .ivu-tooltip-rel{
        width: 100%;
    }
    .name{
        vertical-align: middle;
    }
    .name strong {
        display: inline-block;
        max-width: 20em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .name >>> .ivu-tooltip-inner {
        white-space: normal;
        word-break: break-all;
    }
    .table >>> .btn {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 16px;
        cursor: pointer;
        margin-left: 8px;
    }
    .table >>> .btn:hover {
        background-size: 18px;
    }
    .table >>> .btn:first-child {
        margin-left: 0;
    }
    .table >>> .btnDocumentary {
        background-image: url(./images/icon/2.png);
    }
    .table >>> .btnDocumentaryDisable {
        background-image: url(./images/icon/1.png);
    }
    .table >>> .btnDocumentaryCancel {
        background-image: url(./images/icon/3.png);
    }
    .table >>> .btnCooperation {
        background-image: url(./images/icon/16.png);
    }
    .table >>> .btnCooperation:hover {
        background-image: url(./images/icon/17.png);
    }
    .table >>> .btnSign {
        background-image: url(./images/icon/7.png);
    }
    .table >>> .btnSignDisable {
        background-image: url(./images/icon/6.png);
    }
    .table >>> .btnSignComplete {
        background-image: url(./images/icon/13.png);
    }
    .table >>> .btnCollection {
        background-image: url(./images/icon/12.png);
    }
    .table >>> .btnCollectionCancel {
        background-image: url(./images/icon/4.png);
    }
    .table >>> .btnConvert {
        background-image: url(./images/icon/11.png);
    }
    .table >>> .btnDel {
        background-image: url(./images/icon/9.png);
    }
    .table >>> .btnDelDisable {
        background-image: url(./images/icon/8.png);
    }
    .table >>> .btnDelDisable:hover {
        background-image: url(./images/icon/9.png);
    }
    .table >>> .btnDispatch {
        background-image: url(./images/icon/14.png);
    }
    .table >>> .btnDispatch:hover {
        background-image: url(./images/icon/15.png);
    }
    .table >>> .sourceOrg {
        position: relative;
    }
    .table >>> .documentaryIcon {
        position: absolute;
        top: 15px;
        /*top: 0;*/
        left: 0;
        padding:1px 3px;
        font-size: 12px;
        background: #FF8D76;
        color: #fff;

        /*width: 20px;*/
        /*height: 20px;*/
        /*background: url("./images/icon/13.png") no-repeat top left;*/
        /*background-size: 16px;*/

        opacity: .8;
        /*transform: rotate(-45deg);*/
    }
    .table >>> .documentaryMarkIcon {
        position: absolute;
        top: -2px;
        left: 0;
        color: #FFA202;
        font-size: 20px;
        opacity: .8;
    }
    .table >>> .signMarkIcon {
        color: #F00;
    }
    .opportunity-wrap >>> .prompt-dialog > .body{
        overflow: hidden;
    }
</style>