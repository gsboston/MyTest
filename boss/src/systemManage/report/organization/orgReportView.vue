<template>
    <div class="main-content">
        <link href="//netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
        <div class="org-info">
            <h1>
                <i class="fa fa-hand-o-right"></i>
                {{ activeOrg.name | defaultStr }}
            </h1>
            <Button v-if="currentOrg.id != activeOrg.id" type="ghost" style="position: absolute;right: 30px;top: 45px;" @click="switchCurrentOrg">返回我的组织</Button>
            <Row style="margin-bottom: 36px;">
                <i-col span="12">
                    <div class="current-org-info">
                        <div class="logo">
                            LOGO
                        </div>
                        <Row style="flex: 1;">
                            <i-col span="24">
                                <div class="title">
                                    <span class="title-header">公司简称：</span>
                                    <span>{{ activeOrg.abbreviation | defaultStr }}</span>
                                    <span class="type">{{ activeOrg.affiliation | affiliationStr }}</span>
                                </div>
                            </i-col>
                            <i-col span="12">
                                <div class="title">
                                    <span class="title-header">公司负责人：</span>
                                    <span>{{ activeOrg.companyPrincipal | defaultStr }}</span>
                                </div>
                            </i-col>
                            <i-col span="12">
                                <div class="title">
                                    <span class="title-header">联系电话：</span>
                                    <span>{{ activeOrg.principalPhone | defaultStr }}</span>
                                </div>
                            </i-col>
                            <i-col span="12">
                                <div class="title">
                                    <span class="title-header">公司联系人：</span>
                                    <span>{{ activeOrg.companyContacts | defaultStr }}</span>
                                </div>
                            </i-col>
                            <i-col span="12">
                                <div class="title">
                                    <span class="title-header">联系电话：</span>
                                    <span>{{ activeOrg.contactsPhone | defaultStr }}</span>
                                </div>
                            </i-col>
                            <!--<i-col span="24">-->
                                <!--<div class="title">-->
                                    <!--<span class="title-header">公司地址：</span>-->
                                    <!--<span>{{ activeOrg.childOrg | defaultStr }}</span>-->
                                <!--</div>-->
                            <!--</i-col>-->
                        </Row>
                    </div>
                </i-col>
                <i-col span="12" class="count-all-div">
                    <i-col span="8">
                        <div>
                            <span class="title-header">下属公司/家：</span>
                            <span>{{ activeOrgSubData.childOrg.companyCount }}</span>
                        </div>
                    </i-col>
                    <i-col span="8">
                        <div>
                            <span class="title-header">下属门店/家：</span>
                            <span>{{ activeOrgSubData.childOrg.storeCount }}</span>
                        </div>
                    </i-col>
                </i-col>
            </Row>
            <Row>
                <i-col span="10">
                    <div class="title">
                        <span class="title-header">上级组织：</span>
                        <span>{{ activeOrgSubData.superiorOrgName | defaultStr('暂无') }}</span>
                    </div>
                </i-col>
            </Row>
            <Row>
                <i-col span="12">
                    <div class="title" style="align-items: normal;">
                        <span class="title-header">下级组织：</span>
                        <Row class="card-div">
                            <i-col span="8" :class="['count-div', {'active': (currentOrgLevel == 'SUBORDINATE' && currentOrgType == '04')}]">
                                <div class="count-content" @click="switchOrg('SUBORDINATE', '04')">
                                    <span>子公司/家</span>
                                    <span>{{ activeOrgSubData.subordinateOrg.subsidiaryCount }}</span>
                                </div>
                            </i-col>
                            <i-col span="8" :class="['count-div', {'active': (currentOrgLevel == 'SUBORDINATE' && currentOrgType == '03')}]">
                                <div class="count-content" @click="switchOrg('SUBORDINATE', '03')">
                                    <span>分公司/家</span>
                                    <span>{{ activeOrgSubData.subordinateOrg.filialeCount }}</span>
                                </div>
                            </i-col>
                            <i-col span="8" :class="['count-div', {'active': (currentOrgLevel == 'SUBORDINATE' && currentOrgType == '07')}]">
                                <div class="count-content" @click="switchOrg('SUBORDINATE', '07')">
                                    <span>门店</span>
                                    <span>{{ activeOrgSubData.subordinateOrg.storeCount }}</span>
                                </div>
                            </i-col>
                        </Row>
                    </div>
                </i-col>
                <i-col span="12">
                    <div class="title" style="align-items: normal;">
                        <span class="title-header">三级组织：</span>
                        <Row class="card-div">
                            <i-col span="8" :class="['count-div', {'active': (currentOrgLevel == 'THREELEVEL' && currentOrgType == '04')}]">
                                <div class="count-content" @click="switchOrg('THREELEVEL', '04')">
                                    <span>子公司/家</span>
                                    <span>{{ activeOrgSubData.threeLevelOrg.subsidiaryCount }}</span>
                                </div>
                            </i-col>
                            <i-col span="8" :class="['count-div', {'active': (currentOrgLevel == 'THREELEVEL' && currentOrgType == '03')}]">
                                <div class="count-content" @click="switchOrg('THREELEVEL', '03')">
                                    <span>分公司/家</span>
                                    <span>{{ activeOrgSubData.threeLevelOrg.filialeCount }}</span>
                                </div>
                            </i-col>
                            <i-col span="8" :class="['count-div', {'active': (currentOrgLevel == 'THREELEVEL' && currentOrgType == '07')}]">
                                <div class="count-content" @click="switchOrg('THREELEVEL', '07')">
                                    <span>门店</span>
                                    <span>{{ activeOrgSubData.threeLevelOrg.storeCount }}</span>
                                </div>
                            </i-col>
                        </Row>
                    </div>
                </i-col>
            </Row>
        </div>

        <div class="table-view">
            <Row>
                <i-col span="8">
                    <Input placeholder="公司名称/公司简称/合作类型/公司负责人" icon="search" @on-enter="searchOrgData" @on-click="searchOrgData" v-model="searchKey"/>
                </i-col>
            </Row>
            <br/>
            <Table :data="orgData" :columns="currentOrgType == '07' ? storeColumns : orgColumns" highlight-row @on-current-change="changeShowOrg"></Table>
            <br/>
            <Row>
                <i-col span="12" offset="12">
                    <Page size="small" :page-size="pageSize" :total="orgTotal" :current="orgPage" @on-change="changeOrgPage"></Page>
                </i-col>
            </Row>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                currentOrg: {},
                activeOrg: {},
                activeOrgSubData: {
                    childOrg: {
                        companyCount: 0,
                        storeCount: 0,
                    },
                    subordinateOrg: {
                        filialeCount: 0,
                        storeCount: 0,
                        subsidiaryCount: 0,
                    },
                    superiorOrgName: '',
                    threeLevelOrg: {
                        filialeCount: 0,
                        storeCount: 0,
                        subsidiaryCount: 0,
                    },
                },
                currentOrgLevel: null,
                currentOrgType: null,
                orgColumns: [
                    {title: '公司名称', key: 'name', align: 'left', width: 280, ellipsis: true, render: (h, params) => {
                        return h('Tooltip', {
                            props: {
                                placement: 'top-start',
                            },
                            attrs: {
                                class: 'post-name'
                            },
                            style: {
                                'margin-right': '2px'
                            }
                        }, [
                            h('span', params.row.name),
                            h('pre', {
                                slot: 'content',
                                style: {
                                    'margin': '0px',
                                    'white-space': 'pre-wrap'
                                }
                            }, '公司所在地：' + (params.row.province || '-') + '/' + (params.row.city || '-') + '/' + (params.row.area || '-') + '\n'
                                + '公司名称：' + (params.row.name || '-') + '\n'
                                + '原公司名称：' + (params.row.originalOrgName || '-') + '\n'
                                + '原公司名称2：' + (params.row.originalOrgName2 || '-') + '\n')
                        ]);
                    }},
                    {title: '公司简称', align: 'center', key: 'abbreviation', render: (h, params) => {
                        return params.row.abbreviation ? params.row.abbreviation : '-';
                    }},
                    {title: '加盟性质', align: 'center', key: 'affiliation', render: (h, params) => {
                        switch (params.row.affiliation) {
                            case 'A':
                                return 'A轮';
                            case 'B':
                                return 'B轮';
                            case 'C':
                                return 'C轮';
                            case 'NONE':
                                return '无';
                            case 'CITY_LIGHT_HOUSE':
                                return '城市灯塔';
                            default:
                                return '无';
                        }
                    }},
                    {title: '下属子/分公司', align: 'right', key: 'subsidiaryBranchCount'},
                    {title: '下属门店', align: 'right', key: 'subsidiaryStoreCount'},
                    {title: '公司负责人', align: 'center', key: 'companyPrincipal', render: (h, params) => {
                        return h('Tooltip', {
                            props: {
                                placement: 'top-start',
                            },
                            attrs: {
                                class: 'post-name'
                            },
                            style: {
                                'margin-right': '2px'
                            }
                        }, [
                            h('span', (params.row.companyPrincipal || '-')),
                            h('span', {
                                slot: 'content'
                            }, '联系电话：' + (params.row.principalPhone || '-'))
                        ]);
                    }},
                    {title: '公司联系人', align: 'center', key: 'companyContacts', render: (h, params) => {
                        return params.row.companyContacts || '-';
                    }},
                    {title: '联系电话', align: 'center', key: 'contactsPhone', render: (h, params) => {
                        return params.row.contactsPhone || '-';
                    }}
                ],
                storeColumns: [
                    {title: '门店名称', key: 'name', align: 'left', width: 280, ellipsis: true, render: (h, params) => {
                        return h('Tooltip', {
                            props: {
                                content: params.row.name,
                                placement: 'top-start',
                            },
                            attrs: {
                                class: 'post-name'
                            },
                            style: {
                                'margin-right': '2px'
                            }
                        }, params.row.name);
                    }},
                    {title: '门店简称', align: 'center', key: 'abbreviation', render: (h, params) => {
                        return params.row.abbreviation || '-';
                    }},
                    {title: '授权牌编码', align: 'center', key: 'authorizeBrandCode', render: (h, params) => {
                        return params.row.authorizeBrandCode || '-';
                    }},
                    {title: '授权日期', align: 'center', key: 'authorizeDate', render: (h, params) => {
                        if (String.isNullOrBlank(params.row.authorizeDate)) {
                            return '-';
                        }
                        return window.DateFormat.dateToString(new Date(params.row.authorizeDate), 'yyyy/MM/dd');
                    }},
                    {title: '门店所在地', align: 'center', key: 'companyContacts', render: (h, params) => {
                        return (params.row.province || '-') + '/' + (params.row.city || '-') + '/' + (params.row.area || '-');
                    }}
                ],
                orgData:[],
                orgTotal: 0,
                orgPage: 1,
                pageSize: 10,
                searchKey: null,
            }
        },
        filters: {
            defaultStr(str, defaultVal) {
                return str || (defaultVal || '-');
            },
            affiliationStr(str) {
                switch (str) {
                    case 'A':
                        return 'A轮';
                    case 'B':
                        return 'B轮';
                    case 'C':
                        return 'C轮';
                    case 'NONE':
                        return '无';
                    case 'CITY_LIGHT_HOUSE':
                        return '城市灯塔';
                    default:
                        return '无';
                }
            }
        },
        created: function(){
            this.currentOrg = this.$context.getCurrentOrganization()
            this.init();
        },
        methods: {
            init() {
                this.request({
                    url: '/systemManage/organization/info.do',
                    param: {
                        id: this.currentOrg.id
                    }
                }).then(data => {
                    this.activeOrg = data;
                    this.loadOrgTreeData();
                });
            },
            loadOrgTreeData() {
                this.request({
                    url: '/systemManage/report/orgTreeCount/info.do',
                    param: {
                        orgId: this.activeOrg.id
                    }
                }).then(data => {
                    this.activeOrgSubData = Object.assign(this.activeOrgSubData, data);
                    this.currentOrgLevel = null;
                    this.currentOrgType = null;
                    this.loadSubOrgData(true);
                });
            },
            switchOrg(orgLevel, orgType) {
                this.currentOrgLevel = orgLevel;
                this.currentOrgType = orgType;
                this.changeOrgPage(1);
            },
            searchOrgData() {
                this.changeOrgPage(1);
            },
            changeOrgPage(page) {
                this.orgPage = page;
                this.loadSubOrgData();
            },
            loadSubOrgData(type = false) {
                if (type) {
                    this.orgTotal = 1;
                    this.activeOrg.subsidiaryBranchCount = this.activeOrgSubData.childOrg.companyCount;
                    this.activeOrg.subsidiaryStoreCount = this.activeOrgSubData.childOrg.storeCount;
                    this.orgData = [
                        this.activeOrg
                    ];
                }else {
                    this.request({
                        url: '/systemManage/report/orgTreeCount/list.do',
                        param: {
                            orgId: this.activeOrg.id,
                            page: this.orgPage,
                            size: this.pageSize,
                            orgLevel: this.currentOrgLevel,
                            orgType: this.currentOrgType,
                            searchKey: this.searchKey,
                        }
                    }).then(data => {
                        if (data) {
                            this.orgTotal = data.total;
                            this.orgData = Object.assign([], data.records);
                        }else {
                            this.orgTotal = 0;
                            this.orgData = [];
                        }
                    });
                }
            },
            changeShowOrg(current, oldCurrent) {
                if (this.currentOrgType == '07') {
                    return;
                }
                this.activeOrg = current;
                this.loadOrgTreeData();
            },
            switchCurrentOrg() {
                this.init();
            }
        }
    }
</script>

<style scoped>
    .main-content {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 28px 15px;
        font-size: 14px;
        background-color: #F6F6F6;
    }
    .main-content .org-info {
        padding: 0 30px;
        background-color: #FFF;
    }
    .main-content .org-info h1 {
        margin: 10px 0 15px;
        font-size: 28px;
        color: #59b399;
        padding-right: 105px;
    }
    .main-content .org-info h1 i {
        position: relative;
        font-size: 25px;
        margin-right: 12px;
        top: -3px;
    }
    .main-content .org-info .current-org-info {
        display: flex;
    }
    .main-content .org-info .current-org-info .logo {
        display: inline-flex;
        width: 105px;
        height: 120px;
        background-color: #F6FAF9;
        font-size: 28px;
        font-weight: 600;
        color: #D9D9D9;
        align-items: center;
        justify-content: center;
    }
    .main-content .type {
        display: inline-block;
        min-width: 70px;
        height: 25px;
        line-height: 25px;
        margin-left: 25px;
        text-align: center;
        border: 1px solid #54B499;
        border-radius: 4px;
        color: #54B499;
        font-weight: 600;
    }
    .main-content .title {
        display: flex;
        align-items: center;
        padding: 0 15px;
        margin-bottom: 15px;
    }
    .main-content .org-info .current-org-info .title {
        margin-bottom: 9px;
    }
    .main-content .title-header {
        min-width: 84px;
        color: #A1A1A1;
        margin-right: 20px;
        font-weight: 600;
    }
    .main-content .title span + div {
        flex: 1;
        border: 1px solid #F2F2F2;
    }
    .main-content .title span + button {
        flex: 1;
        max-width: 390px;
        height: 40px;
        background: #FFF;
        text-align: left;
    }
    .main-content .title .sup-org {
        max-width: 390px;
        height: 40px;
        flex: 1 1 0%;
        background-color: #FFF;
        color: #666;
        border: 1px solid #dddee1;
        line-height: 40px;
        padding: 0 15px;
        font-size: 12px;
        font-weight: 600;
    }
    .main-content .count-div {
        background-color: #FFF;
        cursor: pointer;
    }
    .main-content  .count-div:hover {
        background-color: #F6FAF9;
    }
    .main-content .count-all-div {
        margin-top: 20px;
        padding: 19px 0 19px 20px;
        background-color: #FFF;
        border-left: 1px solid #DDD;
    }
    .main-content .count-div .count-content {
        display: flex;
        display: -ms-flexbox;
        flex-direction: column;
        -ms-flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 62px;
    }
    .main-content .count-div:not(:last-child) .count-content {
        border-right: 1px solid #F6F6F6;
    }
    .main-content .count-content span:first-child {
        display: block;
        font-weight: 600;
        font-size: 12px;
        color: #A1A1A1;
    }
    .main-content .count-content span:nth-child(2) {
        display: block;
        font-weight: 600;
        font-size: 18px;
        color: #5D5D5D;
    }
    .main-content .count-all-div .count-content span:nth-child(2) {
        font-size: 36px;
        color: #5D5D5D;
    }

    .main-content .table-view {
        flex: 1;
        background-color: #FFF;
        padding: 18px 22px 0;
        margin-top: 5px;
        margin-bottom: 10px;
    }
    .main-content .table-view .table-title {
        line-height: 32px;
    }
    .main-content .table-view .table-title span {
        font-size: 16px;
        color: #5D5D5D;
        font-weight: 600;
    }
    .main-content .table-view .table-title span:nth-child(2) {
        color: #54B499;
    }

    .main-content .active {
        color: #FFF!important;
        background-color: #59b399!important;
    }
    .main-content .active.count-div .count-content {
        border-color: #59b399!important;
    }
    .main-content .active span {
        color: #FFF!important;
    }
    .main-content >>> .post-name {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .main-content >>> .ivu-tooltip-rel span:hover {
        color: #59b399;
    }
    .main-content >>> .ivu-tooltip-inner {
        max-width: 300px;
        white-space: normal;
        word-break: break-all;
    }
</style>
