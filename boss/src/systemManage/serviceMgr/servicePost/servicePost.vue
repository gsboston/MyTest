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
                    <Table ref="serviceTable" size="small" :data="serviceListData"  :columns="serviceListTitle" highlight-row @on-row-click="currentServiceChange"></Table>
                    <br/>
                    <Page size="small" :total="serviceListTotal" :current="serviceListPage" @on-change="changeServicePage"></Page>
                </i-col>
            </Row>
        </div>
        <div class="center">
            <div>
                <Row>
                    <i-col span="24">
                        <header class="org-header">
                            <span>服务岗位设置</span>
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
                            <Button :disabled="!(this.selectedService && this.selectedServicePostSetting)" @click="editOrUpdate('update')">修改</Button>
                            <Button :disabled="!(this.selectedService && this.selectedServicePostSetting)" @click="removeServiceProvider">删除</Button>
                        </ButtonGroup>
                    </i-col>
                </Row>
                <br/>
                <Row>
                    <i-col span="24">
                        <Table ref="servicePostSettingTable" size="small" :data="servicePostSettingData" :columns="servicePostSettingTitle" highlight-row @on-row-click="currentServicePostSettingChange"></Table>
                        <br/>
                        <Page size="small" :total="servicePostSettingDataTotal" :current="servicePostSettingDataPage" @on-change="changeServiceProviderPage"></Page>
                    </i-col>
                </Row>
            </div>
            <div>
                <Row>
                    <i-col span="24">
                        <header class="org-header">
                            <span>岗位人员列表</span>
                        </header>
                    </i-col>
                </Row>
                <br/>
                <Row>
                    <i-col span="24">
                        <ButtonGroup>
                            <Button @click="transferModal('personnel')" :disabled="!(this.selectedService && this.selectedServicePostSetting)" >选择人员</Button>
                        </ButtonGroup>
                    </i-col>
                </Row>
                <br/>
                <Row>
                    <i-col span="24">
                        <div class="staff-box">
                            <Tag class="staffTag" v-for="(item, index) in staffListData" :key="item.id">{{item.realName}}</Tag>

                        </div>
                        <br/>
                        <Page size="small" :total="staffListDataTotal" :current="staffListDataPage" @on-change="changeStaffListPage"></Page>
                    </i-col>
                </Row>
            </div>
        </div>

        <!-- 引导页 -->
        <div v-show="isShowLeadPage" class="lead-page">
            <component is="LPServicePost" @on-hide-page="hideLeadPage"></component>
        </div>
    </div>
</template>

<script type="text/javascript">
    import LPServicePost from '../../leadPage/LPServicePost';

    export default {
        data () {
            return {
                serviceListTitle: [
                    {title: '编码', align: 'center', key: 'code'},
                    {title: '服务单类型', align: 'center', key: 'name'}
                ],
                serviceListData:[],
                selectedService: null,
                serviceListTotal: 0,
                serviceListPage: 1,
                servicePostSettingData:[],
                selectedServicePostSetting: null,
                servicePostSettingDataTotal: 0,
                servicePostSettingDataPage: 1,
                servicePostSettingTitle: [
                    {title: '序号', align: 'center', key: 'code'},
                    {title: '服务岗位名称', align: 'center', key: 'name'},
                    {title: '能否派工', align: 'center', key: 'disabled', render: (h, params) => {
                            return h('div', [
                                h('checkbox', {
                                    props: {
                                        value: this.servicePostSettingData[params.index].disabled
                                    },
                                    on: {
                                        'on-change': (val) => {
                                            if(val == true){
                                                this.servicePostSettingData[params.index].state = "CHARGE";
                                                this.servicePostSettingData[params.index].disabled = true;
                                            }else{
                                                this.servicePostSettingData[params.index].state = "NORMAL";
                                                this.servicePostSettingData[params.index].disabled = false;
                                            }
                                            this.request({
                                                url: '/systemManage/service/serviceSave.do',
                                                data: this.servicePostSettingData[params.index],
                                                param:{
                                                    id:this.selectedService.id
                                                }
                                            }).then(() => {
                                                if (val) {
                                                    this.$Message.success('已修改为：能派工');
                                                }else {
                                                    this.$Message.success('已修改为：不能派工');
                                                }
                                                this.getServicePostSettingData();
                                            });
                                        }
                                    }
                                })
                            ]);
                        }},
                    {title: '服务说明', align: 'left', key: 'remark'}
                ],

                staffList: [
                    {title: '编码', align: 'center', key: 'code'},
                    {title: '接单岗位名称', align: 'center', key: 'name'}
                ],
                staffListData:[],
                staffListDataTotal: 0,
                staffListDataPage: 1,

                isShowLeadPage: false,
                checkKey: 'SERVICE_SETTING'
            }
        },
        watch: {
            selectedService (value) {
                this.selectedService = value;
                this.servicePostSettingData = [];
                this.selectedServicePostSetting = null;
                this.servicePostSettingDataTotal = 0;
                this.servicePostSettingDataPage = 1;
                if (value) {
                    this.getServicePostSettingData();
                }
            },
            selectedServicePostSetting (value) {
                this.selectedServicePostSetting = value;
                this.staffListData = [];
                this.staffListDataTotal = 0;
                this.staffListDataPage = 1;
                if (value) {
                    this.getStaffListData();
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
                    url: `/systemManage/service/orgBillDefPage.do`,
                    param:{
                        page:this.serviceListPage,
                        size:10
                    }
                }).then(data => {
                    if(data){
                        this.serviceListData = data.records;
                        this.serviceListTotal = data.total;
                        // this.selectedService = data.records[0];
                    }

                });
            },
            getServicePostSettingData () {
                if( this.selectedService){
                    this.request({
                        url: `/systemManage/service/orgServePostPage.do`,
                        param: {
                            id: this.selectedService.id,
                            page:this.servicePostSettingDataPage,
                            size:10
                        }
                    }).then(data => {
                        if(data){
                            this.servicePostSettingData = data.records;
                            this.servicePostSettingDataTotal = data.total;
                            for(let i = 0; i<this.servicePostSettingData.length; i++){
                                if(this.servicePostSettingData[i].state === 'CHARGE'){
                                    this.servicePostSettingData[i].disabled = true;
                                }else{
                                    this.servicePostSettingData[i].disabled = false;
                                }
                            }
                        }else{
                            this.servicePostSettingData = [];
                            this.servicePostSettingDataTotal = 0;
                            this.selectedServicePostSetting = null;
                        }

                    });
                }
            },
            getStaffListData () {
                if( this.selectedServicePostSetting){
                    this.request({
                        url: `/systemManage/service/personnelList.do`,
                        param: {
                            id:this.selectedServicePostSetting.id,
                            page:this.staffListDataPage,
                            size:12
                        }
                    }).then(data => {
                        if(data){
                            this.staffListData = data.records;
                            this.staffListDataTotal = data.total;
                        }else{
                            this.staffListData = [];
                            this.staffListDataTotal = 0;
                        }
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
                this.serviceListPage = pageIndex;
                this.getServiceData();
            },
            currentServicePostSettingChange(currentRow){
                if (this.selectedServicePostSetting) {
                    if (this.selectedServicePostSetting.id == currentRow.id) {
                        this.selectedServicePostSetting = null;
                        this.$refs['servicePostSettingTable'].clearCurrentRow();
                    }else {
                        this.selectedServicePostSetting = currentRow;
                    }
                }else {
                    this.selectedServicePostSetting = currentRow;
                }
            },
            changeServiceProviderPage (pageIndex) {
                this.servicePostSettingDataPage = pageIndex;
                this.getServicePostSettingData();
            },
            changeStaffListPage (pageIndex) {
                this.staffListDataPage = pageIndex;
                this.getStaffListData();
            },
            editOrUpdate (operateType) {
                let _title = '', _props = {};
                if (operateType == 'add') {
                    _title = '新增服务岗位';
                    _props = {
                        id: this.selectedService.id
                    };
                }else if (operateType == 'update') {
                    _title = '修改服务岗位';
                    _props = {
                        id: this.selectedService.id,
                        data: this.selectedServicePostSetting
                    };
                }
                this.prompt({
                    code: 'servicePostCard',
                    title: _title,
                    width: 600,
                    height: 400,
                    props: _props,
                    callback: (status, close) => {
                        this.getServicePostSettingData();
                        close();
                    }
                })
            },
            /*选择人员列表*/
            transferModal (type) {
                let _title = '', _props = {};
                if (type === 'personnel') {
                    _title = '选择人员';
                    _props = {
                        selectedOrders: this.selectedServicePostSetting
                    };
                }
                this.prompt({
                    code: 'servicePostStaffl',
                    title: _title,
                    width: 600,
                    height: 300,
                    props: _props,
                    callback: (status, close) => {
                        close();
                        this.getStaffListData();
                    }
                })
            },
            removeServiceProvider () {
                //删除服务岗位
                this.$Modal.confirm({
                    content: '确定删除吗?',
                    onOk: () => {
                        this.request({
                            url: "/systemManage/service/serviceDelete.do",
                            param: {
                                id: this.selectedServicePostSetting.id
                            }
                        }).then(() => {
                            this.$Message.success('删除成功');
                            this.getServicePostSettingData();
                            this.staffListData = [];
                            this.staffListDataTotal = 0;
                            this.staffListDataPage = 1;
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
            LPServicePost
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
        padding: 0 10px 0 10px;
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

    .staff-box{
        padding: 20px;
        width: 100%;
        min-height: 200px;
        border: 1px #dddee1 solid;
    }
    .staff-box div{
        margin-left: 10px;
        margin-right: 10px;
    }
    .staffTag{
        font-size: 14px;
        height: 40px;
        line-height: 40px;
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