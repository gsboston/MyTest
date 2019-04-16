<template>
    <div>
        <Row>
            <i-col span="2">
                <div class="score-wrap">
                    <div class="text">评分</div>
                    <div class="score">{{score}}<span>分</span></div>
                </div>
            </i-col>
            <i-col span="22">
                <Tag type="border" v-for="(item, index) in tagList" :key="index">{{item.name}}</Tag>
            </i-col>
        </Row>
        <!--评价列表-->
        <Row class="evaluation-list" v-for="(item, index) in evaluationList" :key="index">
            <i-col span="4" v-text="item.dateTime" style="text-align: center;"></i-col>
            <i-col span="7">
                <Tooltip placement="bottom" v-if="item.content && item.content.length > 18">
                    <div class="tool-tip-content">{{item.content}}</div>
                    <div slot="content">
                        <p>{{item.content}}</p>
                    </div>
                </Tooltip>
                <span v-else>{{item.content}}</span>
            </i-col>
            <i-col span="6">
                <Tooltip placement="bottom" v-if="item.orgName && item.orgName.length > 16">
                    <div class="tool-tip-orgname">{{item.orgName}}</div>
                    <div slot="content">
                        <p>{{item.orgName}}</p>
                    </div>
                </Tooltip>
                <span v-else>{{item.orgName}}</span>
            </i-col>
            <i-col span="3">
                <Tooltip placement="bottom" v-if="item.userName && item.userName.length > 6">
                    <div class="tool-tip-username">{{item.userName}}</div>
                    <div slot="content">
                        <p>{{item.userName}}</p>
                    </div>
                </Tooltip>
                <span v-else>{{item.userName}}</span>
            </i-col>
            <i-col span="2" class="praise" @click.native="badPraiseEvaluate(item,1)">
                <Icon type="thumbsup"></Icon>
                <span v-text="item.praiseEvaluate"></span>
            </i-col>
            <i-col span="2" class="step" @click.native="badPraiseEvaluate(item,0)">

                <Icon type="thumbsdown"></Icon>
                <span v-text="item.badEvaluate"></span>
            </i-col>
        </Row>
        <Row class="cluePage">
            <i-col span="6">
                <div class="comment-wrap" @click="add">
                    <Icon type="chatbubble-working" style="font-size: 18px; position: relative; left: 0; top: 2px;"></Icon>
                    我要评论
                </div>
            </i-col>
            <i-col span="18">
                <Page size="small" :page-size="pageSize" :total="total" :current="page" @on-change="cluePageChange" show-total></Page>
            </i-col>
        </Row>
    </div>
</template>

<script>
    export default {
        props: {
            id: null
        },
        data: function () {
            return {
                score: '0',
                tagList: [],
                page: 1,
                total: 0,
                pageSize: 5,
                evaluationList: [],
                isEvaluation: false
            }
        },
        created: function () {
            this.init();
            this.getList();
        },
        methods: {
            init: function () {
                /*信息评价分数*/
                this.request({
                    url: '/crm/myCollection/evaluationScore.do',
                    param: {
                        id: this.id
                    }
                }).then(data => {
                    this.score = data;
                });
                /*评价标签列表*/
                this.request({
                    url: '/crm/myCollection/tagList.do',
                    param: {
                        hxId: this.id
                    }
                }).then(tagList => {
                    this.tagList = tagList;
                });
                /*是否已评价*/
                this.request({
                    url: '/crm/myCollection/isEvaluation.do',
                    param: {
                        hxId: this.id
                    }
                }).then(data => {
                    this.isEvaluation = data;
                });

            },
            getList: function () {
                /*评价列表数据*/
                this.request({
                    url: '/crm/myCollection/evaluationList.do',
                    param: {
                        hxId: this.id,
                        page: this.page,
                        size: this.pageSize
                    }
                }).then(data => {
                    this.evaluationList = data.records;
//                    console.log(this.evaluationList);
                    this.page = data.current;
                    this.total = data.total;
                });
            },
            /*点赞与点踩接口*/
            badPraiseEvaluate: function (item, type) {
                this.request({
                    url: '/crm/myCollection/badPraiseEvaluate.do',
                    param: {
                        evaluateId: item.id,
                        type: type
                    }
                }).then(data => {
                    if(!data){
                        type == 0 ? item.badEvaluate++ : item.praiseEvaluate++;
                    }else{
                        this.$Message.warning({
                            content: '该条评价点过赞或踩哦！',
                            duration: 2.5
                        });
                    }
                });
            },
            cluePageChange: function (page) {
                this.page = page;
                this.getList();
            },
            add: function () {
                if(this.isEvaluation){
                    this.$Message.warning({
                        content: '你已评价过哦！',
                        duration: 2.5
                    });
                    return;
                }
                this.prompt({
                    code: 'commentOn',
                    title: '发表评论',
                    width: 950,
                    height: 400,
                    props: {
                        id: this.id
                    },
                    callback: (close) => {
                        close();
                        this.page = 1;
                        this.init();
                        this.getList();
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .ivu-row:nth-child(1){
        padding: 10px 20px;
    }
    .ivu-row:nth-child(even){
        border-top: 1px solid #e7e9ef;
        background: #FCFCFC;
    }
    .ivu-row>.ivu-col {
        padding: 0 5px;
        min-height: 35px;
        line-height: 40px;
        font-size: 14px;
    }
    .praise{
        cursor: pointer;
        color: #ff6464;
    }
    .step{
        cursor: pointer;
        color: #999;
    }
    .cluePage{
        padding: 10px 30px;
    }
    .score-wrap{
        padding: 14px 0 10px;
    }
    .score-wrap .text{
        line-height: 18px;
    }
    .score-wrap .score{
        color: #d33b3b;
        font-size: 24px;
        font-weight: bold;
        line-height: 30px;
    }
    .score-wrap .score span{
        color: #d33b3b;
        font-size: 12px;
    }
    .comment-wrap{
        display: inline-block;
        cursor: pointer;
        color: #999;
    }
    .tool-tip-content{
        width: 240px;
    }
    .tool-tip-orgname{
        width: 200px;
    }
    .tool-tip-username{
        width: 100px;
    }
    .tool-tip-content, .tool-tip-orgname, .tool-tip-username{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .ivu-tooltip >>> .ivu-tooltip-inner{
        width: 200px;
        word-break: break-all;
        word-wrap: break-word;
        white-space: pre-wrap;
        text-align: left;
    }
    .evaluation-list:nth-child(2n) {
        background: #F8F8F9!important;
        border-bottom: 1px solid #e7e9ef
    }
    .evaluation-list:nth-child(2n+1):hover {
        background: #EBF7FF!important;
    }
</style>