<template>
    <div>
        <!--搜索条件-->
        <div class="queryBar" :class="{'collapse': isCollapse}">
            <div class="condition">搜索条件</div>
            <Form ref="searchCriteria" :model="searchCriteria" :label-width="80" inline>
                <FormItem class="clue-name" label="线索名称" prop="name" style="width: 100%;">
                    <Input v-model="searchCriteria.name" @on-blur="conditionalChange(searchCriteria.name, '线索名称')" :maxlength="200"></Input>
                    <Button class="ivu-btn1" v-show="searchCriteria.isAccurate != '1'" @click.stop="searchCriteria.isAccurate = '1'">精</Button>
                    <Button class="ivu-btn-red" v-show="searchCriteria.isAccurate == '1'" @click.stop="searchCriteria.isAccurate = ''">精</Button>
                </FormItem>
                <FormItem label="联系电话" prop="mobile" style="width: 100%;">
                    <Input v-model="searchCriteria.mobile" @on-keyup="mobileVerify($event)" @on-blur="conditionalChange(searchCriteria.mobile, '联系电话')" :maxlength="13"></Input>
                </FormItem>
                <FormItem label="报错日期" prop="errorTime" style="width: 100%;">
                    <DatePicker type="daterange" :options="options2" placement="bottom-start" placeholder="选择日期" style="width:100%"
                                v-model="searchCriteria.errorTime" @on-change="conditionalChangeS('searchCriteria.errorTime', '报错日期')"
                                @on-clear="conditionalChange('', '报错日期')" :format="'yyyy-MM-dd'"></DatePicker>
                </FormItem>
                <FormItem label="报错人" prop="person" style="width: 100%;">
                    <Input v-model="searchCriteria.person" @on-blur="conditionalChange(searchCriteria.person, '报错人')" :maxlength="200"></Input>
                </FormItem>
                <FormItem label="报错原因" prop="errorReasonType" style="width: 100%;">
                    <Select class="industry-type-select" v-model="searchCriteria.errorReasonType" multiple filterable @on-change="errorReasonTypeChange">
                        <Option v-for="item in errorReasonList" :value="item.code" :key="item.code">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem style="width: 100%;">
                    <Button type="primary" @click="searchPageFirst" style="width: 200px; margin-left: -17px;">查一下</Button>
                </FormItem>
            </Form>
            <Button type="ghost" icon="chevron-left" size="small" @click="collapse" class="collapseBtn"></Button>
        </div>
        <div class="main">
            <div class="clues">
                <!--已选条件-->
                <div class="searchBar">
                    <Row style="line-height: 30px;">
                        <i-col span="3" style="color: #999; width: 70px;">
                            已选条件：
                        </i-col>
                        <i-col span="21">
                            <Tag :title="item.name + ':' + item.val" class="ivu-tag-new" type="border" closable color="green"
                                 v-for="(item, index) in selectedConditionList" :key="index" @on-close="delSelectedCondition(item)" v-show="item.val">
                                {{item.name + ':' + item.val}}
                            </Tag>
                            <div class="del-all" @click="delAllSelectedCondition(selectedConditionList)">重置条件</div>
                        </i-col>
                    </Row>
                </div>

                <div class="clueList">
                    <div class="clueHeader">
                        <Row type="flex" align="middle">
                            <i-col span="9" offset="1">
                                找到 {{this.total}} 个相关结果
                                <template v-if="searchTime < 3">，用时 {{this.searchTime}} 秒</template>
                            </i-col>
                            <i-col span="10" offset="4" class="clueHeaderAction" v-if="clues.length">
                                <Select v-model="sortModel" class="sort" placeholder="默认排序" @on-change="sortChange">
                                    <Option v-for="item in sortList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </i-col>
                        </Row>
                    </div>
                    <div class="nodata" v-if="!clues.length">
                        <img src="./images/nodata.png" alt="">
                        <div class="nodataText">你搜的关键字，找不到啊！</div>
                    </div>
                    <div class="clueItem" v-for="(clue, index) in clues" :key="index">
                        <Row class="itemPanel" :class="{'active': clue.isExtend}" @click.native="extend(clue)">
                            <i-col span="1" class="checkbox">
                            </i-col>
                            <i-col span="2">
                                <Badge class-name="badge-new">
                                    <template v-if="clue.isEnterprise">
                                        <img class="avatar" :src="clue.company.logo" v-if="clue.company.logo"/>
                                        <img class="avatar" src="./images/company.png" v-else/>
                                    </template>
                                    <template v-else>
                                        <img class="avatar" :src="clue.personal.logo" v-if="clue.personal.logo"/>
                                        <img class="avatar" src="./images/person.png" v-else/>
                                    </template>
                                </Badge>
                            </i-col>
                            <i-col span="17" offset="1">
                                <Row class="header">
                                    <i-col class="name">
                                        <template v-if="clue.isEnterprise">
                                            <Tooltip placement="bottom" v-if="clue.company.name && clue.company.name.length > 20">
                                                <span>{{clue.company.name}}</span>
                                                <div slot="content">
                                                    <div>{{clue.company.name}}</div>
                                                </div>
                                            </Tooltip>
                                            <span v-else>{{clue.company.name}}</span>
                                        </template>
                                        <template v-else>
                                            <Tooltip placement="bottom" v-if="clue.personal.name.length > 20">
                                                <span>{{clue.personal.name}}</span>
                                                <div slot="content">
                                                    <div>{{clue.personal.name}}</div>
                                                </div>
                                            </Tooltip>
                                            <span v-else>{{clue.personal.name}}</span>
                                        </template>
                                    </i-col>
                                    <!--<i-col class="source">-->
                                        <!--<span>来源:</span>-->
                                        <!--<span>{{clue.basic.channelName || '-'}}</span>-->
                                    <!--</i-col>-->
                                    <template v-if="clue.hintErrorLabelList && clue.hintErrorLabelList !== 0">
                                        <i-col class="contract" v-for="(errorLabel, index) in clue.hintErrorLabelList" :key="index">
                                            <span>{{errorLabel.label}}</span>
                                            <span>{{errorLabel.num}}</span>
                                        </i-col>
                                    </template>
                                </Row>
                                <div class="info">
                                    <Row type="flex" justify="start" v-if="clue.isEnterprise">
                                        <i-col>
                                            <span>法人：{{clue.company.legalRepresentative || '-'}}</span>
                                        </i-col>
                                        <i-col offset="1">
                                            <span>联系电话：
                                                <template v-if="clue.company.companyContactsMobile">
                                                <Tooltip :content="clue.company.companyContactsMobile" @click.native.stop>
                                                {{clue.company.companyContactsMobile.substr(0, 3) + '****' + clue.company.companyContactsMobile.substr(7)}}
                                                </Tooltip>
                                                </template>
                                                <template v-else>-</template>
                                            </span>
                                        </i-col>
                                    </Row>
                                    <Row type="flex" justify="start" v-else>
                                        <i-col>
                                            <span v-if="clue.personal.mobile">
                                                联系电话：
                                                <Tooltip :content="clue.personal.mobile" @click.native.stop>
                                                    {{clue.personal.mobile.substr(0, 3) + '****' + clue.personal.mobile.substr(7)}}
                                                </Tooltip>
                                            </span>
                                            <span v-else>联系电话：-</span>
                                        </i-col>
                                        <i-col offset="1">
                                            <span>报错时间：{{clue.errorTime || '-'}}</span>
                                        </i-col>
                                    </Row>
                                    <Row type="flex" justify="start" v-if="clue.isEnterprise">
                                        <i-col>
                                            <span>邮箱：{{clue.company.companyEmail || '-'}}</span>
                                        </i-col>
                                        <i-col offset="1">
                                            <span>报错时间：{{clue.errorTime || '-'}}</span>
                                        </i-col>
                                    </Row>
                                    <Row type="flex" justify="start" v-else>
                                        <i-col>
                                            <span>邮箱：{{clue.personal.email || '-'}}</span>
                                        </i-col>
                                        <i-col span="1"></i-col>
                                        <i-col>
                                            <span>微信：{{clue.personal.wechat || '-'}}</span>
                                        </i-col>
                                    </Row>
                                    <Row type="flex" justify="start" v-if="clue.isEnterprise">
                                        <i-col>
                                            <span>地址：{{clue.company.companyAddress || '-'}}</span>
                                        </i-col>
                                    </Row>
                                    <Row type="flex" justify="start" v-else>
                                        <i-col>
                                            <span>地址：{{clue.personal.address || '-'}}</span>
                                        </i-col>
                                    </Row>
                                </div>
                                <div class="extendArrow" :class="{extendArrowReverse: clue.isExtend}">
                                    <Icon type="chevron-down"></Icon>
                                </div>
                            </i-col>
                            <i-col span="2" offset="1" class="buttonPanel">
                                <Button class="ivu-btn-red" @click.stop="editEnterprise(clue.company)" v-if="clue.isEnterprise">修改</Button>
                                <Button class="ivu-btn-red" @click.stop="editPersonal(clue.personal)" v-else>修改</Button>
                            </i-col>
                        </Row>
                        <div class="extendPanel" v-if="clue.isExtend">
                            <!--<span @click="closeExtend(clue)" class="closeExtend"><Icon type="close"></Icon></span>-->
                            <div class="" v-if="clue.isEnterprise">
                                <errorList v-if="clue.selectedTab === 0" :clueId="clue.basic.hxId"></errorList>
                            </div>
                            <div v-else>
                                <errorList v-if="clue.selectedTab === 0" :clueId="clue.basic.hxId"></errorList>
                            </div>
                        </div>
                    </div>
                    <Page class="cluePage" size="small" :total="total <= totalMax ? total : totalMax" :current="page" :page-size="pageSize"
                          :page-size-opts="pageSizeOpts" placement="bottom" v-if="clues.length" @on-change="cluePageChange"
                          @on-page-size-change="pageSizeChange" show-total show-elevator show-sizer></Page>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import errorList from './errorList.vue'; // 错误列表

    export default {
        data: function () {
            return {
                isCollapse: false, // queryBar 默认展开
                searchCriteria: {
                    name: '',//线索名称
                    mobile: '',//联系电话
                    errorTime: [],//报错日期
                    person: '',//报错人
                    errorReasonType: [],//报错原因
                    isAccurate: ''//是否精确查找，默认否。'1'为精确查找
                },//查询时提交到node层的对象
                errorReasonList: [],//报错原因列表数据
                options2: {
                    shortcuts: [
                        {
                            text: '最近一周',
                            value() {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                return [start, end];
                            }
                        },
                        {
                            text: '最近一个月',
                            value() {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                return [start, end];
                            }
                        },
                        {
                            text: '最近三个月',
                            value() {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                return [start, end];
                            }
                        }
                    ]
                },
                selectedConditionList: [
                    {
                        name: "线索名称",
                        val: "",
                        tag: "name"
                    },
                    {
                        name: "联系电话",
                        val: "",
                        tag: "mobile"
                    },
                    {
                        name: "报错日期",
                        val: "",
                        tag: "errorTime"
                    },
                    {
                        name: "报错人",
                        val: "",
                        tag: "person"
                    },
                    {
                        name: "报错原因",
                        val: "",
                        tag: "errorReasonType"
                    },
                ],//已选择查询条件数据

                clues: [],
                page: 1,
                total: 0,
                totalMax: 3000, // 线索数量限制最大条数
                pageSize: 10,
                pageSizeOpts: [10, 50, 100],
                searchTime: 0, // 查询线索花费时间
                sortList: [
                    {
                        value: 'errorTime_desc',
                        label: '报错时间降序'
                    }, {
                        value: 'errorTime',
                        label: '报错时间升序'
                    }
                ],
                sortModel: '',
                imageService: '?x-oss-process=image/resize,w_100,h_100/quality,Q_80', // 图片处理
            }
        },
        created: function () {
            this.getErrorReasonList();//请求报错原因列表数据
            this.searchPageFirst();
        },
        methods: {
            /*联系电话验证*/
            mobileVerify(e) {
                let regval = /^[0-9-]{1}$/;
                let tempStr = '';
                let tempArr = this.searchCriteria.mobile;
                for(let i=0; i<tempArr.length; i++){
                    if(regval.test(tempArr[i])){
                        tempStr += tempArr[i];
                    }
                }
                this.searchCriteria.mobile = tempStr;
            },
            /*queryBar 收缩展开*/
            collapse() {
                this.isCollapse = !this.isCollapse;
            },
            /*请求报错原因列表数据*/
            getErrorReasonList: function () {
                this.request({
                    url: '/crm/clueManagement/clueErrorReason.do'
                }).then(errorReasonList => {
                    this.errorReasonList = errorReasonList;
                })
            },
            /*组合已选条件*/
            conditionalChange: function (val, name, arr) {
                if (arr) {
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].code == val) val = arr[i].name;
                    }
                }
                for (let i = 0; i < this.selectedConditionList.length; i++) {
                    if (this.selectedConditionList[i].name == name) this.selectedConditionList[i].val = val;
                }
            },
            /*选择时间控件处理*/
            conditionalChangeS(a, b) {
                this.$nextTick(() => {
                    a = eval("this." + a);
                    let str = '';
                    for (let i = 0; i < a.length; i++) {
                        str += window.DateFormat.dateToString(a[i]);
                        if (i == 0) str += '至';
                    }
                    if (str == '至') return;
                    this.conditionalChange(str, b);
                });
            },
            /*报错原因条件改变*/
            errorReasonTypeChange(arr) {
                let errorReasonList = this.errorReasonList;
                let tempArr = [];
                for (let i = 0; i < arr.length; i++) {
                    for (let j = 0; j < errorReasonList.length; j++) {
                        if (errorReasonList[j].code == arr[i]) tempArr.push(errorReasonList[j].name);
                    }
                }
                this.conditionalChange(tempArr.join(","), '报错原因')
            },
            /*删除选择已选条件*/
            delSelectedCondition: function (item) {
                item.val = '';
                if (item.name === '报错日期' || item.name === '报错原因') {
                    this.searchCriteria[item.tag] = [];
                } else {
                    this.searchCriteria[item.tag] = '';
                }
            },
            /*删除所有已选条件*/
            delAllSelectedCondition: function (arr) {
                for (let i = 0; i < arr.length; i++) {
                    arr[i].val = '';
                }
                this.searchCriteria.name = '';
                this.searchCriteria.mobile = '';
                this.searchCriteria.errorTime = [];
                this.searchCriteria.person = '';
                this.searchCriteria.errorReasonType = [];
                this.searchCriteria.isAccurate = '';
            },
            search: function () {
                let searchStart = Date.now(),
                    searchEnd = 0;

                this.request({
                    url: '/crm/dataManage/list.do',
                    data: {
                        searchCriteria: this.searchCriteria,
                        page: this.page - 1,
                        pageSize: this.pageSize
                    }
                }).then(data => {
                    this.clues = data.hints || [];
                    this.page = data.page + 1;
                    this.total = parseInt(data.total) || 0;
                    this.pageSize = parseInt(data.size) || 10;

                    searchEnd = Date.now();
                    this.searchSpendTime(searchStart, searchEnd);
                    this.clues.forEach((item) => {
                        if (item.isEnterprise) {
                            item.company.logo = item.company.logo ? this.$updateConfig.file + item.company.logo + this.imageService : item.company.logo;
                        } else {
                            item.personal.logo = item.personal.logo ? this.$updateConfig.file + item.personal.logo + this.imageService : item.personal.logo;
                        }
                    })
                });
            },
            searchPageFirst() {
                this.page = 1;
                this.search();
            },
            /*修改企业*/
            editEnterprise: function (item) {
                this.prompt({
                    code: 'editEnterprise',
                    title: '修改线索',
                    width: '100%',
                    height: '100%',
                    top: 50,
                    bottom: 150,
                    props: {
                        clueId: item.hxId
                    },
                    callback: (close) => {
                        close();
                    }
                })
            },
            /*修改个人*/
            editPersonal: function (item) {
                this.prompt({
                    code: 'editPersonal',
                    title: '修改线索',
                    width: '100%',
                    height: '100%',
                    top: 50,
                    bottom: 150,
                    props: {
                        clueId: item.hxId
                    },
                    callback: (close) => {
                        close();
                    }
                })
            },

            searchSpendTime: function (searchStart, searchEnd) {
                this.searchTime = (searchEnd - searchStart) / 1000;
            },
            extend: function (clue) {
                clue.isExtend = !clue.isExtend;
                clue.selectedTab = 0;
            },
            closeExtend: function (clue) {
                clue.isExtend = false;
                clue.selectedTab = 0;
            },
            cluePageChange: function (page) {
                this.page = page;
                this.search();
            },
            pageSizeChange: function (pageSize) {
                this.pageSize = pageSize;
                this.search();
            },
            sortChange: function (selected) {
                let isDesc = false;
                if (selected.indexOf('desc') > -1) {
                    isDesc = true;
                }

                this.clues.sort(function (a, b) {
                    if (isDesc) {
                        let index = selected.split('_desc')[0];
                        if (index === 'errorTime') {
                            return a[index] < b[index];
                        } else {
                            return a.company[index] < b.company[index];
                        }
                    } else {
                        if (selected === 'errorTime') {
                            return a[selected] > b[selected];
                        } else {
                            return a.company[selected] > b.company[selected];
                        }
                    }
                })
            },
        },
        components: {
            errorList,
        }
    };
</script>

<style scoped>
    .queryBar {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        z-index: 1;
        width: 300px;
        background: #fff;
        padding: 10px 18px 0;
        border-right: 1px solid #e7e9ef;
    }

    .queryBar .condition {
        margin-left: 10px;
        line-height: 28px;
        color: #999;
    }

    .queryBar .ivu-form-item {
        margin-bottom: 8px;
    }

    .queryBar.collapse {
        /*left: -300px;*/
        transform: translate3d(-300px, 0, 0);
    }

    .queryBar.collapse + .main {
        left: 0px;
    }

    .collapseBtn {
        /*position: fixed;*/
        position: absolute;
        /*top: 0;*/
        top: 50%;
        left: 0;
        z-index: 1;
        padding: 10px 7px;
        opacity: .7;
        margin-top: -22px;
        background: #fff;
    }

    .collapseBtn:hover {
        opacity: 1;
    }

    .collapse .collapseBtn {
        transform: translate3d(300px, 0, 0);
    }

    .collapse .collapseBtn >>> .ivu-icon {
        transform: rotate(180deg);
    }

    .queryBar,
    .main,
    .collapseBtn,
    .collapseBtn >>> .ivu-icon {
        transition: all .3s;
        transform: translateZ(0);
        /*backface-visibility: hidden;*/
        /*perspective: 1000;*/
    }

    .searchBar {
        position: relative;
    }

    .searchBar > .ivu-row {
        margin-right: 180px;
    }

    .eyePromptLink {
        position: absolute;
        top: 0;
        right: 20px;
        line-height: 30px;
        color: #666;
    }

    .eyePromptLink:hover {
        text-decoration: underline;
    }

    .eyePromptLink > .ivu-icon {
        color: #F0917E;
        vertical-align: middle;
        font-size: 20px;
        margin-right: 10px;
    }

    .main {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 300px;
        overflow: auto;
    }

    .clues {
        padding: 10px 25px;
    }

    .clueList {
        margin-top: 15px;
        background: #fff;
        box-shadow: 1px 1px 10px rgba(150, 150, 150, .2);
    }

    .clueItem {
        border-top: 1px solid #F5F5F5;
    }

    .clueItem:first-child {
        border-top: none;
    }

    .itemPanel {
        padding: 20px;
    }

    .itemPanel:hover {
        background-color: #fff;
        box-shadow: 1px 1px 20px rgba(150, 150, 150, .2);
        cursor: pointer;
    }

    .itemPanel.active {
        background-color: #fff;
    }

    .avatar {
        width: 75px;
        height: 75px;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
    }

    .header {
        font-size: 0;
    }

    .header > div {
        display: inline-block;
        vertical-align: middle;
    }

    .name {
        font-size: 22px;
        font-weight: bold;
    }

    .name >>> .ivu-tooltip-rel {
        max-width: 20em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
    }

    .name >>> .ivu-tooltip-inner {
        white-space: normal;
        word-break: break-all;
    }

    .source,
    .opportunity,
    .contract {
        margin-left: 10px;
        color: #fff;
        /*line-height: 18px;*/
    }

    .opportunity,
    .contract {
        font-size: 0;
    }

    .source {
        background: #f4f7f9;
        color: #99acbd;
        padding: 0 6px;
    }

    .opportunity {
        background: #FF8D76;
    }

    .contract {
        background: #ff7070;
        /*color: #FBA897;*/
    }

    .opportunity > span:first-child {
        background: #FFECE8;
        color: #FF8D76;
    }

    .contract > span:first-child {
        background: #FFE1ED;
        color: red;
    }

    .source > span,
    .opportunity > span,
    .contract > span {
        font-size: 13px;
        /*font-weight: 700;*/
    }

    .opportunity > span,
    .contract > span {
        padding: 0 6px;
        display: inline-block;
        vertical-align: middle;
    }

    .info > div {
        margin-top: 6px;
    }

    .tags {
        margin-top: 8px;
        display: inline-block;
    }

    .buttonPanel > button {
        margin-top: 8px;
        min-width: 76px;
        padding: 4px 8px;
    }

    .buttonPanel > button:first-child {
        margin-top: 0;
    }

    .extendPanel {
        position: relative;
        width: 95%;
        margin: 0px auto;
        border-top: 1px solid #e7e9ef;
        border-bottom: 1px solid #e7e9ef;
        margin-bottom: 15px;
    }

    .extendTabs {
        background: #F6F8FA;
        font-size: 14px;
    }

    .extendTabs > span {
        display: inline-block;
        vertical-align: middle;
        margin: 0px 30px;
        line-height: 40px;
        font-weight: bold;
        font-size: 16px;
        text-align: center;
        cursor: pointer;
    }

    .clueItem .ivu-col .name > span {
        line-height: 40px;
        font-weight: bold;
        font-size: 22px;
        text-align: center;
        cursor: pointer;
    }

    .clueItem .info .ivu-col > span {
        line-height: 26px;
        font-size: 14px;
        text-align: center;
    }

    .extendTabs > span.active {
        color: #59b399;
        border-bottom: 1px solid #59b399;
    }

    .closeExtend {
        position: absolute;
        top: 8px;
        right: 15px;
        font-size: 16px;
        cursor: pointer;
        color: #666;
    }

    .closeExtend:hover {
        color: #FF9379;
    }

    .cluePage {
        text-align: left;
        padding: 15px 30px;
        position: relative;
    }

    .clueHeader {
        background: #FFF;
        padding: 6px 20px;
        line-height: 30px;
    }

    .checkbox {
        margin-top: 25px;
    }

    .clueHeaderAction {
        text-align: right;
    }

    .sort {
        text-align: left;
        width: 140px;
    }

    .checkAll {
        color: #2A2A2A;
        text-decoration: underline;
    }

    .checkAll[disabled] {
        text-decoration: none;
    }

    .tagGrey {
        background-color: #f1f1f1 !important;
    }

    .nodata {
        padding: 45px 0 65px;
        text-align: center;
    }

    .nodataText {
        margin: 30px auto;
        font-size: 16px;
        color: #727375;
    }

    .clueAdd {
        padding: 8px 20px;
        font-size: 14px;
    }

    .clueAdd:hover {
        opacity: .9;
    }

    .ivu-badge >>> .badge-new {
        font-size: 12px;
        background: #FF6464;
        line-height: 1;
        padding: 1px;
        border: none;
        /*width: 32px;*/
        height: auto;
        border: none;
        -webkit-border-radius: 0;
        -moz-border-radius: 0;
        border-radius: 0;
    }

    .ivu-badge >>> .extendTabsBadge {
        background-color: #FF6464;
        border: none;
        -webkit-box-shadow: 0 0px 5px #e8b5b5;
        -moz-box-shadow: 0 0px 5px #e8b5b5;
        box-shadow: 0 0px 5px #e8b5b5;
        -webkit-transform: translateX(100%);
        -moz-transform: translateX(100%);
        -ms-transform: translateX(100%);
        -o-transform: translateX(100%);
        transform: translateX(100%);
    }

    .extendArrow {
        position: absolute;
        bottom: -2px;
        bottom: -18px;
        width: 100%;
        text-align: center;
        color: #B6B2B1;
        transition: all .3s;
    }

    .extendArrow.extendArrowReverse {
        transform: rotate(180deg);
    }

    .extendArrow:hover {
        color: #59b399;
    }
</style>

<style scoped>
    /*重置条件*/
    .searchBar .del-all {
        width: 80px;
        display: inline-block;
        color: #666;
        cursor: pointer;
    }
    /*线索名称-精btn*/
    .ivu-btn1 {
        color: #666;
        background: #fff;
        border-color: #ddd;
        border-radius: 3px;
        font-size: 12px;
        font-weight: 700;
    }

    .ivu-btn-red {
        color: #fff;
        background: #ff8066;
        border-color: #ff8066;
        border-radius: 3px;
        font-size: 12px;
        font-weight: 700;
    }

    .queryBar >>> .ivu-form-item-label {
        font-size: 14px;
        font-weight: 700;
    }

    .queryBar >>> .ivu-icon-arrow-down-b {
        position: absolute;
        top: 50%;
        right: 1px;
        line-height: 1;
        margin-top: 6px;
        font-size: 10px;
        color: #aaa;
        transition: all .5s ease-in-out;
    }

    .queryBar >>> .ivu-icon-arrow-up-b {
        position: absolute;
        top: 50%;
        right: 1px;
        line-height: 1;
        margin-top: 6px;
        font-size: 10px;
        color: #aaa;
        transition: all .5s ease-in-out;
    }

    .queryBar >>> .ivu-select-arrow {
        position: absolute;
        top: 50%;
        right: 10px;
        line-height: 1;
        margin-top: -5px;
        font-size: 10px;
        color: #aaa;
        transition: all .2s ease-in-out;
    }

    .queryBar >>> .ivu-cascader-arrow {
        position: absolute;
        top: 50%;
        right: 10px;
        line-height: 1;
        margin-top: -5px;
        font-size: 10px;
        color: #aaa;
        transition: all .2s ease-in-out;
    }

    .queryBar >>> .ivu-btn {
        font-size: 14px;
        line-height: 1.5;
    }

    .queryBar >>> .info > span {
        font-size: 14px;
        line-height: 1.5;
    }

    .ivu-tag-new {
        color: #59b399 !important;
        border: 1px solid #59b399 !important;
    }

    .industry-type-select >>> .ivu-select-selection {
        max-height: 68px;
        overflow: auto;
    }

    .industry-type-select >>> .ivu-tag-text {
        max-width: 100px;
        overflow: hidden;
        max-height: 25px;
        display: inline-block;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .industry-type-select >>> .ivu-icon-ios-close-empty {
        position: relative;
        top: -7px;
    }

    .ivu-tag-new >>> .ivu-tag-text {
        max-width: 200px;
        overflow: hidden;
        max-height: 25px;
        display: inline-block;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .ivu-tag-new:after {
        background: #59b399 !important;
    }

    .ivu-tag-new >>> .ivu-icon-ios-close-empty {
        position: relative;
        top: -7px;
        color: #59b399 !important;
    }

    .clue-name{
        position: relative;
    }

    .clue-name >>> .ivu-btn{
        position: absolute;
        right: 2px;
        top: 6px;
        padding: 3px 4px;
        font-size: 10px;
        font-weight: 100;
        line-height: 1.1;
    }

    .clue-name .ivu-btn1{
        color: #ff8066;
        border-color: #ff8066;
    }

    .clue-name >>> .ivu-input{
        padding: 4px 32px 4px 7px;
    }
</style>