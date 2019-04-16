<template>
    <div class="container">
        <div class="left">
            <Row>
                <i-col span="24">
                    <header class="org-header">
                        <span>服务单定义列表</span>
                    </header>
                </i-col>
            </Row>
            <br/>
            <Row>
                <i-col span="24">
                    <Table ref="serviceTable" size="small" :data="serviceData" :columns="serviceColumns" highlight-row @on-row-click="currentServiceChange"></Table>
                    <br/>
                    <!--<Page size="small" :total="serviceDataTotal" :current="serviceDataPage" @on-change="changeServicePage"></Page>-->
                </i-col>
            </Row>
        </div>
        <div class="center">
            <div>
                <Row>
                    <i-col span="24">
                        <header class="org-header">
                            <span>服务商列表</span>
                        </header>
                        <Button type="ghost" style="position: absolute;top: 0px;right: 0px;background: #FFF;z-index: 2;border: 0;" @click="isShowLeadPage = true">
                            操作指引
                            <Icon type="document-text"></Icon>
                        </Button>
                    </i-col>
                </Row>
                <br/>
                <Row>
                    <i-col span="24">
                        <ButtonGroup>
                            <Button :disabled="!this.selectedService" @click="editOrUpdate('add')">新增</Button>
                            <Button :disabled="!(this.selectedService && this.selectedServiceProvider)" @click="editOrUpdate('update')">修改</Button>
                            <Button :disabled="!(this.selectedService && this.selectedServiceProvider)" @click="removeServiceProvider">删除</Button>
                        </ButtonGroup>
                    </i-col>
                </Row>
                <br/>
                <Row>
                    <i-col span="24">
                        <Table ref="serviceProviderTable" size="small" :data="serviceProviderData" :columns="serviceProviderColumns" highlight-row @on-row-click="currentServiceProviderChange"></Table>
                        <br/>
                        <Page size="small" :total="serviceProviderDataTotal" :page-size="10" :current="serviceProviderDataPage" @on-change="changeServiceProviderPage"></Page>
                    </i-col>
                </Row>
            </div>
        </div>

        <!-- 引导页 -->
        <div v-show="isShowLeadPage" class="lead-page">
            <component is="LPServiceProvider" @on-hide-page="hideLeadPage"></component>
        </div>
    </div>
</template>

<script type="text/javascript">
    import LPServiceProvider from '../../leadPage/LPServiceProvider';

    export default {
        data () {
            return {
                serviceColumns: [
                    {title: '编码', align: 'center', key: 'code'},
                    {title: '服务单类型', align: 'center', key: 'name'}
                ],
                serviceData:[],
                selectedService: null,
                serviceDataTotal: 0,
                serviceDataPage: 1,
                serviceProviderData:[],
                selectedServiceProvider: null,
                serviceProviderDataTotal: 0,
                serviceProviderDataPage: 1,
                serviceProviderColumns: [
                    {title: '优先级', align: 'center', key: 'level'},
                    {title: '服务商', align: 'center', key: 'serviceNm'},
                    {title: '结算价', align: 'center', key: 'settlementPrice'},
                    {title: '是否允许查看客户信息', align: 'center', key: 'isViewFlag', render: (h, params) => {
                        return h('div', [
                            h('checkbox', {
                                props: {
                                    value: this.serviceProviderData[params.index].isViewFlag
                                },
                                on: {
                                    'on-change': (val) => {
                                        let updateItem = {
                                            id: this.serviceProviderData[params.index].id,
                                            isViewFlag: val
                                        };
                                        this.request({
                                            url: '/systemManage/serviceProvider/update.do',
                                            data: updateItem
                                        }).then(() => {
                                            if (val) {
                                                this.$Message.success('已修改为：允许查看用户信息');
                                            }else {
                                                this.$Message.success('已修改为：禁止查看用户信息');
                                            }
                                            this.getServiceProviderData();
                                        });
                                    }
                                }
                            })
                        ]);
                    }}
                ],

                isShowLeadPage: false,
                checkKey: 'SERVICE_PROVIDER_MANAGEMENT'
            }
        },
        watch: {
            selectedService (value) {
                this.selectedService = value;
                this.serviceProviderData = [];
                this.selectedServiceProvider = null;
                this.serviceProviderDataTotal = 0;
                this.serviceProviderDataPage = 1;
                if (value) {
                    this.getServiceProviderData();
                }
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
            this.getServiceData();
        },
        methods: {
            /** 数据获取函数 -- Data */
            getServiceData () {
                this.request({
                    url: `/systemManage/service/list.do`
                }).then(data => {
                    this.serviceData = data;
                    this.serviceDataTotal = data.length;
                });
            },
            getServiceProviderData () {
                if (this.selectedService){
                    this.request({
                        url: `/systemManage/serviceProvider/list.do`,
                        param: {
                            serviceId: this.selectedService.id,
                            page: this.serviceProviderDataPage
                        }
                    }).then(data => {
                        this.serviceProviderData = data.records;
                        this.serviceProviderDataTotal = data.total;
                    });
                }
            },
            /** 组件操作函数 -- Event */
            currentServiceChange(currentRow){
                if (this.selectedService) {
                    if (this.selectedService.id == currentRow.id) {
                        this.selectedService = null;
                        this.$refs['serviceTable'].clearCurrentRow();
                    }else {
                        this.selectedService = currentRow;
                    }
                }else {
                    this.selectedService = currentRow;
                }
            },
            changeServicePage (pageIndex) {
                this.serviceDataPage = pageIndex;
                this.getServiceData();
            },
            currentServiceProviderChange(currentRow){
                if (this.selectedServiceProvider) {
                    if (this.selectedServiceProvider.id == currentRow.id) {
                        this.selectedServiceProvider = null;
                        this.$refs['serviceProviderTable'].clearCurrentRow();
                    }else {
                        this.selectedServiceProvider = currentRow;
                    }
                }else {
                    this.selectedServiceProvider = currentRow;
                }
            },
            changeServiceProviderPage (pageIndex) {
                this.serviceProviderDataPage = pageIndex;
                this.getServiceProviderData();
            },
            editOrUpdate (operateType) {
                let _title = '', _props = {};
                if (operateType == 'add') {
                    _title = '新增服务商';
                    _props = {
                        serviceId: this.selectedService.id
                    };
                }else if (operateType == 'update') {
                    _title = '修改服务商';
                    _props = {
                        id: this.selectedServiceProvider.id
                    };
                }
                this.prompt({
                    code: 'serviceProviderCard',
                    title: _title,
                    width: 600,
                    height: 400,
                    props: _props,
                    callback: (status, close) => {
                        this.selectedServiceProvider = null;
                        this.getServiceProviderData();
                        close();
                    }
                })
            },
            removeServiceProvider () {
                //删除服务商
                this.$Modal.confirm({
                    content: '确定删除吗?',
                    onOk: () => {
                        this.request({
                            url: "/systemManage/serviceProvider/delete.do",
                            param: {
                                id: this.selectedServiceProvider.id
                            }
                        }).then(() => {
                            this.$Message.success('删除成功');
                            this.selectedServiceProvider = null;
                            this.getServiceProviderData();
                        });
                    }
                });
            },
            getLocalTime(nS) {
                return new Date(parseInt(nS)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
            },
            hideLeadPage() {
                this.isShowLeadPage = false;
            }
        },
        components: {
            LPServiceProvider
        }
    };
</script>

<style scoped>
    .left {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 350px;
        padding: 15px;
        border-right: solid 1px #dddee1;
        overflow: auto;
    }
    .center {
        position: relative;
        margin-left: 350px;
        padding: 15px;
    }
    #departmentList .ivu-menu li {
        width: 100%;
        margin: 0;
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
        font-size: 16px;
        font-weight: 600;
    }

    #departmentList > .ivu-tree > .ivu-tree-children > li > .ivu-tree-title {
        font-weight: 700;
    }

    .container >>> .ivu-table-body {
        overflow: hidden;
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