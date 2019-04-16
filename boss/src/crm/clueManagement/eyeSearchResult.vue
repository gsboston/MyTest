<template>
    <div class="clueList">
        <div class="clueHeader">
            <Row type="flex" align="middle">
                <template v-if="clues.length">
                    <i-col span="1">
                        <Checkbox
                                :indeterminate="indeterminate"
                                :value="checkAll"
                                @click.prevent.native="handleCheckAll"></Checkbox>
                    </i-col>
                    <i-col span="2">
                        <a href="javascript:void(0);" class="checkAll" :disabled="!checkAllGroup.length" @click="collectionAll">全部收藏</a>
                    </i-col>
                </template>
                <i-col span="9" offset="1">
                    找到 {{this.total}} 个相关结果<template v-if="searchTime < 3">，用时 {{this.searchTime}} 秒</template>
                </i-col>
                <i-col span="9" offset="1" class="clueHeaderAction">
                    <a href="javascript:void(0);" @click="showEyePrompt" class="eyePromptLink">
                        <Icon type="ios-location"></Icon>使用地图查询附近的公司
                    </a>
                </i-col>
            </Row>
        </div>
        <div class="nodata" v-if="!clues.length">
            <img src="./images/nodata.png" alt="">
            <div class="nodataText">你搜的关键字，找不到啊！</div>
        </div>
        <div class="clueItem" v-for="(clue, index) in clues" :key="index">
            <Row class="itemPanel">
                <i-col span="1" class="checkbox">
                    <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
                        <Checkbox :label="clue.basic.hxId" @click.stop.native><span></span></Checkbox>
                    </CheckboxGroup>
                </i-col>
                <i-col span="2">
                    <Badge class-name="badge-new" :count="!clue.track ? 'NEW' : ''">
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
                        <i-col class="source">
                            <span>来源:</span>
                            <span>渠道</span>
                            <!--<span>{{clue.basic.channelName || '-'}}</span>-->
                        </i-col>
                    </Row>
                    <div class="info">
                        <Row type="flex" justify="start" v-if="clue.isEnterprise">
                            <i-col>
                                <span>行业：{{clue.company.industryName || '-'}}</span>
                            </i-col>
                            <i-col offset="1">
                                <span>注册资本：{{clue.company.registeredCapital || '-'}}万元</span>
                            </i-col>
                            <i-col offset="1">
                                <span>注册时间：{{clue.company.foundingTime || '-'}}</span>
                            </i-col>
                            <i-col offset="1">
                                <span>数据更新时间：{{clue.basic.tsUpdate || '-'}}</span>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="start" v-else>
                            <i-col>
                                <!--<span>电话：{{clue.personal.mobile}}</span>-->
                                <span v-if="clue.personal.mobile">
                                    电话：
                                    <Tooltip :content="clue.personal.mobile" @click.native.stop>
                                        {{clue.personal.mobile.substr(0, 3) + '****' + clue.personal.mobile.substr(7)}}
                                    </Tooltip>
                                </span>
                                <span v-else>电话：-</span>
                            </i-col>
                            <i-col offset="1">
                                <span>数据更新时间：{{clue.basic.tsUpdate || '-'}}</span>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="start" v-if="clue.isEnterprise">
                            <i-col>
                                <span>
                                    联系人：{{clue.company.legalRepresentative || '-'}}
                                    <template v-if="clue.company.companyContactsMobile">
                                        <Tooltip :content="clue.company.companyContactsMobile" @click.native.stop>
                                            {{clue.company.companyContactsMobile.substr(0, 3) + '****' + clue.company.companyContactsMobile.substr(7)}}
                                        </Tooltip>
                                    </template>
                                    <template v-else>-</template>
                                    <!--{{clue.company.companyContactsMobile || '-'}}-->
                                </span>
                            </i-col>
                            <i-col offset="1">
                                <span>地址：{{clue.company.companyAddress || '-'}}</span>
                            </i-col>
                        </Row>
                        <Row type="flex" justify="start" v-else>
                            <i-col>
                                <span>邮箱：{{clue.personal.email || '-'}}</span>
                            </i-col>
                            <i-col offset="1">
                                <span>微信：{{clue.personal.wechat || '-'}}</span>
                            </i-col>
                        </Row>
                        <!--<Row type="flex" justify="start">-->
                            <!--<i-col offset="1">-->
                                <!--<span v-if="clue.isEnterprise">地址：{{clue.company.companyAddress || '-'}}</span>-->
                                <!--<span v-else>地址：{{clue.personal.address || '-'}}</span>-->
                            <!--</i-col>-->
                        <!--</Row>-->
                    </div>
                </i-col>
                <i-col span="2" offset="1" class="buttonPanel">
                    <Button class="ivu-btn-red" @click.stop="collection(clue)" v-if="!clue.isCollected">收藏</Button>
                    <Button class="ivu-btn-red" @click.stop="collection(clue)" v-else>已收藏</Button>
                    <br/>
                    <Button class="ivu-btn1"  @click.stop="eyeSearch(clue.company.name, clue.isEnterprise)" v-if="clue.isEnterprise">天眼查询</Button>
                    <Button class="ivu-btn1"  @click.stop="eyeSearch(clue.personal.name, clue.isEnterprise)" v-else>天眼查询</Button>
                </i-col>
            </Row>
        </div>
        <Page class="cluePage" size="small" :total="total" :current="page" :page-size="pageSize" placement="bottom" v-if="clues.length" @on-change="cluePageChange" show-total show-elevator></Page>
    </div>
</template>

<script>
    export default {
        props: {
            searchCondition: null
        },
        data () {
            return {
                clues: [],
                page: 1,
                total: 0,
                pageSize: 10,
                searchTime: 0, // 查询线索花费时间
                checkAll: false, // 是否全选
                checkAllGroup: [], // 已选的线索 id 集合
                IdAllGroup: [], // 所有能选择的线索 id 集合
                indeterminate: false, // 部分选择
                imageService: '?x-oss-process=image/resize,w_100,h_100/quality,Q_80', // 图片处理
            }
        },
        created () {
            this.searchPageFirst();
        },
        methods: {
            search: function () {
                let searchStart = Date.now(),
                    searchEnd = 0;

                this.request({
                    url: '/crm/clueManagement/lbs.do',
                    data: {
                        searchCriteria: this.searchCondition,
                        page: this.page - 1,
                        pageSize: this.pageSize
                    }
                }).then(data => {
                    this.clues = data.records || [];
                    this.page = data.page;
                    this.total = parseInt(data.total) || 0;
                    this.pageSize = parseInt(data.size) || 10;

                    searchEnd = Date.now();
                    this.searchSpendTime(searchStart, searchEnd);

                    this.resetCheck();

                    this.clues.forEach((item) => {
                        if(item.isEnterprise){
                            item.company.logo = item.company.logo ? this.$updateConfig.file + item.company.logo + this.imageService : item.company.logo;
                        } else {
                            item.personal.logo = item.personal.logo ? this.$updateConfig.file + item.personal.logo + this.imageService : item.personal.logo;
                        }
                        this.IdAllGroup.push(item.basic.hxId);
                    })
                });
            },
            collection: function (clue) {
//                console.log('collection');
//                console.log(clue);
                this.request({
                    url: '/crm/clueManagement/clueCollect.do',
                    param: {
                        id: clue.basic.hxId
                    }
                }).then(() => {
                    clue.isCollected = !clue.isCollected;

                    if(clue.isCollected){
                        this.$Message.success('收藏成功');
                    } else {
                        this.$Message.success('取消收藏成功');
                    }
                });
            },
            collectionAll: function () {
//                console.log('collectionAll');
                this.request({
                    url: '/crm/clueManagement/clueCollectAll.do',
                    param: {
                        ids: this.checkAllGroup
                    }
                }).then(() => {
                    this.clues.forEach((clue) => {
                        this.checkAllGroup.forEach((item) => {
                            if(clue.basic.hxId === item){
                                clue.isCollected = true;
                            }
                        })
                    })
                    this.$Message.success('收藏成功');
                });
            },
            eyeSearch: function (key, isEnterprise) {
                key = key || '';
                if(isEnterprise){
                    window.open('https://www.tianyancha.com/search?key=' + key);
                } else {
                    window.open('https://www.tianyancha.com/humansearch/' + key + '?searchfrom=human');
                }
            },
            cluePageChange: function (page) {
                this.page = page;
                this.search();
            },
            searchSpendTime: function (searchStart, searchEnd) {
                this.searchTime = (searchEnd - searchStart)/1000;
            },
            checkAllGroupChange: function (arr) {
                if (arr.length === this.clues.length) {
                    this.indeterminate = false;
                    this.checkAll = true;
                } else if (arr.length > 0) {
                    this.indeterminate = true;
                    this.checkAll = false;
                } else {
                    this.indeterminate = false;
                    this.checkAll = false;
                }
//                console.log(this.checkAllGroup)
            },
            handleCheckAll: function () {
                if (this.indeterminate) {
                    this.checkAll = false;
                } else {
                    this.checkAll = !this.checkAll;
                }
                this.indeterminate = false;

                if (this.checkAll) {
                    this.checkAllGroup = [...this.IdAllGroup];
                } else {
                    this.checkAllGroup = [];
                }
//                console.log(this.checkAllGroup)
            },
            /* 重置所有 checkbox 框 */
            resetCheck: function () {
                this.checkAllGroup.splice(0);
                this.IdAllGroup.splice(0);
                this.checkAll = false;
                this.indeterminate = false;
            },
            searchPageFirst () {
                this.page = 1;
                this.search();
            },
            showEyePrompt () {
                this.$emit('toMap');
            }
        }
    };
</script>

<style scoped>
    .eyePromptLink{
        line-height: 30px;
        color: #666;
    }
    .eyePromptLink:hover{
        text-decoration: underline;
    }
    .eyePromptLink > .ivu-icon{
        color: #53B89E;
        vertical-align: middle;
        font-size: 20px;
        margin-right: 10px;
    }
    .clueList{
        margin-top: 15px;
        background: #fff;
        box-shadow: 1px 1px 10px rgba(150, 150, 150, .2);
    }
    .clueItem{
        border-top: 1px solid #F5F5F5;
    }
    .clueItem:first-child{
        border-top: none;
    }
    .itemPanel{
        padding: 20px;
    }
    .itemPanel:hover{
        background-color: #fff;
        box-shadow: 1px 1px 20px rgba(150, 150, 150, .2);
    }
    .avatar{
        width: 75px;
        height: 75px;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
    }
    .header{
        font-size: 0;
    }
    .header>div{
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
    .source{
        background: #f4f7f9;
        color: #99acbd;
        padding: 0 6px;
        margin-left: 10px;
    }
    .source>span{
        font-size: 13px;
        font-weight: 700;
    }
    .info>div{
        margin-top: 6px;
    }
    .buttonPanel>button{
        margin-top: 8px;
        min-width: 76px;
        padding: 4px 8px;
    }
    .buttonPanel>button:first-child{
        margin-top: 0;
    }
    .clueItem .ivu-col .name>span{
        line-height: 40px;
        font-weight: bold;
        font-size: 22px;
        text-align: center;
        cursor: pointer;
    }
    .clueItem .info .ivu-col>span{
        line-height: 26px;
        font-size: 14px;
        text-align: center;
    }
    .cluePage{
        text-align: left;
        padding: 15px 30px;
        position: relative;
    }
    .clueHeader {
        background: #FFF;
        padding: 6px 20px;
        line-height: 30px;
    }
    .checkbox{
        margin-top: 25px;
    }
    .clueHeaderAction{
        text-align: right;
    }
    .checkAll{
        color: #2A2A2A;
        text-decoration: underline;
    }
    .checkAll[disabled]{
        text-decoration: none;
    }
    .nodata{
        padding: 45px 0 65px;
        text-align: center;
    }
    .nodataText{
        margin: 30px auto;
        font-size: 16px;
        color: #727375;
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

    .demo-spin-icon-load {
        animation: ani-demo-spin 1s linear infinite;
    }

    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }

    .ivu-spin-fix {
        /*display: block;*/
        /*!*background-color: rgba(55, 55, 55, 0.1);*!*/
        /*width: auto;*/
        height: auto;
        top: 50px;
        bottom: 0;
    }
    .ivu-spin-fix:after {
        content: "";
        display: inline-block;
        vertical-align: middle;
        width: 0;
        height: 100%;
    }
    .ivu-spin-fix >>> .ivu-spin-main{
        display: inline-block;
        vertical-align: middle;
    }
    .ivu-spin-fix >>> .ivu-spin-text{
        color: #fff;
        width: 200px;
        height: 60px;
        line-height: 60px;
        background: rgba(100, 100, 100, .5);
        border-radius: 7px;
        font-size: 16px;
        font-weight: bold;
    }

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
</style>