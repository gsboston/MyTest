<template>

    <div class="bd">
        <div class="left">
            <div class="left-tab">
                <div class="left-tab-item" :class="{sel: status == 3}" @click="selFlag(3)">全部</div>
                <div class="left-tab-item" :class="{sel: status == 0}" @click="selFlag(0)">待解决</div>
                <div class="left-tab-item" :class="{sel: status == 1}" @click="selFlag(1)">已解决</div>
            </div>
            <div class="search"><Input placeholder="请输入查询条件" icon="search" @on-enter="search" @on-click="search" v-model="keyword"/></div>
            <ul class="left-group">
                <li class="left-item" :class="{active: selItem==index}" v-for="(item, index) in dataList" @click="getDetail(item, index)">
                    <div class="left-item-line">
                        <div class="title">{{item.memberName?item.memberName:item.memberPhone}}</div>
                        <div class="date">{{item.tsInsert|time}}</div>
                    </div>
                    <div class="left-item-line">
                        <div class="cont-left">{{item.content}}</div>
                        <div class="cont-tag">{{item.title}}</div>
                    </div>
                    <div class="left-item-line" v-if="item.replyTime">
                        <div class="cont-left">回复时间：{{item.replyTime | time(1)}}</div>
                    </div>
                    <div class="flag-sj" v-show="item.new && item.status==0"></div>
                    <div class="flag-new" v-show="item.new && item.status==0">新</div>
                </li>
                <!--<li class="left-item active">
                    <div class="left-item-line">
                        <div class="title">张三</div>
                        <div class="date">2017-12-23</div>
                    </div>
                    <div class="left-item-line">
                        <div class="cont-left">服务延迟一直没有吃店运营服务延迟一直没有吃店运营服务延迟一直没有吃店运营</div>
                        <div class="cont-tag">服务质量</div>
                    </div>
                    <div class="flag-sj"></div>
                    <div class="flag-new">新</div>
                </li>-->
                <Page size="small" :total="rsData.total" :page-size="pageSize" show-total simple :current="rsData.current" @on-change="pageChange"></Page>
            </ul>
        </div>
        <div class="main">
            <div class="center" v-if="detailInfo">
                <div style="display: inline-table;width: 90%;">
                    <Row class="row-item">
                        <Col span="5"><div class="align-right">用户名：</div></Col>
                        <Col span="19">{{detailInfo.memberName}}</Col>
                    </Row>
                    <Row class="row-item">
                        <Col span="5"><div class="align-right">手机号：</div></Col>
                        <Col span="19">{{detailInfo.memberPhone}}</Col>
                    </Row>
                    <Row class="row-item">
                        <Col span="5"><div class="align-right">问题类型：</div></Col>
                        <Col span="19">{{detailInfo.title}}</Col>
                    </Row>
                    <Row class="row-item">
                        <Col span="5"><div class="align-right">问题描述：</div></Col>
                        <Col span="19">{{detailInfo.content}}</Col>
                    </Row>

                    <Row class="row-item">
                        <Col span="5"><div class="align-right">图片展示：</div></Col>
                        <Col span="19">
                            <div class="img-item" v-show="detailInfo.srcimg1">
                                <img :src="detailInfo.srcimg1" width="100px" height="100px">
                                <a :href="detailInfo.srcimgBig1" target="_blank"><span >查看大图</span></a><!--@click="openBigImg(detailInfo.srcimg1)"-->
                            </div>
                            <div class="img-item" v-show="detailInfo.srcimg2">
                                <img :src="detailInfo.srcimg2" width="100px" height="100px">
                                <a :href="detailInfo.srcimgBig2" target="_blank"><span>查看大图</span></a>
                            </div>
                            <div class="img-item" v-show="detailInfo.srcimg3">
                                <img :src="detailInfo.srcimg3" width="100px" height="100px">
                                <a :href="detailInfo.srcimgBig3" target="_blank"><span>查看大图</span></a>
                            </div>
                        </Col>
                    </Row>
                    <Row class="row-item">
                        <Col span="5"><div class="align-right">提交时间：</div></Col>
                        <Col span="19">{{detailInfo.tsInsert | time(1)}}</Col>
                    </Row>

                </div>
                <Modal :title="'大图'"
                    v-model="bigTab" width="70%">
                    <div style="overflow: auto;;height: 400px;">
                        <img :src="bigimg" style="display: block;margin: 0 auto;max-width: 100%;">
                    </div>
                    <div slot="footer">
                        <Button size="small" @click="bigTab = false">确认</Button>
                    </div>
                </Modal>
                <div class="line"></div>
                <div class="replay">
                    <Form :model="formItem" :label-width="80" v-if="!detailInfo.replyTime">
                        <FormItem label="回复：">
                            <Uediter :value="ueditor.value" :submitBtn="submitBtn" :config="ueditor.config" ref="ue"></Uediter>
                        </FormItem>
                        <FormItem>
                            <Button type="primary"  @click="tijiao">提交</Button><!--v-show="submitBtn"-->
                        </FormItem>
                    </Form>
                </div>
                <div style="display: inline-table;width: 90%;" v-if="detailInfo.replyTime">
                    <Row class="row-item">
                        <Col span="5"><div class="align-right">回复时间：</div></Col>
                        <Col span="19">{{detailInfo.replyTime | time(1)}}</Col>
                    </Row>
                    <Row class="row-item">
                        <Col span="5"><div class="align-right">回复内容：</div></Col>
                        <Col span="19" class-name="replay_content" v-html="detailInfo.replyContent"></Col>
                    </Row>
                </div>
            </div>
            <div class="nodata" v-else>
                <img src="../../image/empty.png" alt="">
                <div class="nodataText">请选择对应的投诉建议！</div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">

    import Uediter from '../../core/component/ueditor/ueditor.vue';

    export default {
        data: function() {
            return {
                bigTab: false,
                keyword: '',
                formItem: {
                    textarea: ''
                },
                status: 0,
                ueditor: {
                    value: '',
                    config: {
                        BaseUrl: '',
                        //UEDITOR_HOME_URL: '/static/ueditor/', //这个是静态资源的路径
                        emotionLocalization: false,
                        toolbars:[['emotion', 'insertimage']],  //编辑器里需要用的功能
                        elementPathEnabled: false,
                        initialFrameWidth: 500,
                        initialFrameHeight: 150,
                        imagePathFormat: '/',
                        catchRemoteImageEnable: false,  //设置不抓取远程图片
                        autoFloatEnabled: false,
                    }
                },
                submitBtn: false,
                dataList: [],
                rsData: {},
                pageSize: 5,
                curPage: 1,
                selItem: -1,
                detailInfo: '',
                imageService: '?x-oss-process=image/resize,w_100,h_100/quality,Q_80', // 图片处理
                bigimg:'',
            };
        },
        created: function() {
            //this.getProposalList(1)

        },
        mounted(){
            this.$nextTick(function () {
                this.getProposalList(1)
            })
        },
        methods: {
            pageChange(val){
                this.curPage = val;
                this.getProposalList();
            },
            getDetail(item, index){
                this.submitBtn = false;
                this.selItem = index;
                this.request({
                    url: '/operate/proposalController/detail.do',
                    data: {
                        id: item.id
                    }
                }).then(data => {
                    data.title = this.formatTime(data.type);
                    data.srcimg1 = data.img1 ? this.$updateConfig.file + data.img1 + this.imageService : data.img1;
                    data.srcimgBig1 = data.img1 ? this.$updateConfig.file + data.img1 : data.img1;
                    data.srcimg2 = data.img2 ? this.$updateConfig.file + data.img2 + this.imageService : data.img2;
                    data.srcimgBig2 = data.img2 ? this.$updateConfig.file + data.img2 : data.img2;
                    data.srcimg3 = data.img3 ? this.$updateConfig.file + data.img3 + this.imageService : data.img3;
                    data.srcimgBig3 = data.img3 ? this.$updateConfig.file + data.img3 : data.img3;
                    /*if(data.replyContent == ""){
                        this.$refs.ue.setUEContent('<p></p>');
                        this.submitBtn = true;
                        if( this.submitBtn == true){
                            let Ids = document.getElementsByClassName('edui-editor-toolbarbox');
                            Ids[0].style.display = 'block';
                        }
                    }else {
                        this.submitBtn = false;
                        if( this.submitBtn == false){
                            let Ids = document.getElementsByClassName('edui-editor-toolbarbox');
                            Ids[0].style.display = 'none';
                        }
                        //this.ueditor.value = data.replyContent;
                        this.$refs.ue.setUEContent(data.replyContent)
                    }*/
                    this.detailInfo = data;
                })
            },
            //选择分类
            selFlag(val) {
                this.curPage = 1;
                this.status = val;
                this.getProposalList(1);
            },
            //查询
            search() {
                this.curPage = 1;
                this.getProposalList();
            },
            getProposalList(start) {
                this.selItem = -1;
                let params = {}
                params.content = this.keyword;
                if(this.status != 3) {
                    params.status = this.status;
                }

                this.request({
                    url: '/operate/proposalController/search.do',
                    data: {
                        params,
                        page: this.curPage,
                        size: this.pageSize
                    }
                }).then(data => {
                    this.rsData = data;
                    this.dataList = [];
                    let timestamp=Date.parse(new Date());
                    for (let item of data.records) {

                        item.title = this.formatTime(item.type);
                        item.open = false;
                        item.new = false;
                        let hmtime = timestamp - item.tsInsert;
                        if(hmtime<86400000) {
                            item.new = true;
                        }
                        this.dataList.push(item)
                    }
                    //this.dataList.push(...data.records)
                    //初始化的时候获取第一条数据详情
                    if(start == 1 && this.dataList.length>0) {
                        this.detailInfo = true;
                        this.getDetail(this.dataList[0], 0);
                    }

                })
            },
            openBigImg(img) {
                this.bigimg = img.replace(this.imageService, '');
                this.bigTab = true;
            },
            selectGroup(group){
                this.selectedGroup = group;
                this.loadData();
            },
            formatTime(type) {
                let title = '';
                switch (type){
                    case 'fwyc':
                        title = '服务延迟';
                        break;
                    case 'fwzl':
                        title = '服务质量';
                        break;
                    case 'other':
                        title = '其他';
                        break;
                    default:
                        title = '没有服务类型';
                        break;
                }
                return title;
            },
            tijiao(){

                let params = {}
                params.id = this.detailInfo.id;
                params.replyContent = this.$refs.ue.getUEContent();
                if(params.replyContent == '') {
                    this.$Message.error('请输入回复的内容!');
                    return ;
                }

                this.request({
                    url: '/operate/proposalController/reply.do',
                    data: {
                        params
                    }
                }).then(data => {
                    this.submitBtn = false;
                    this.detailInfo.replyContent = data.replyContent;
                    this.detailInfo.replyTime = data.replyTime;
                })

            }

        },
        components: {Uediter},
        filters: {
            //时间戳格式转换
            time (value, type) {
                if(value == undefined) {
                    return '';
                }
                var timestamp =(value+'').substr(0,10);
                var d = new Date(timestamp * 1000);
                var curMon = d.getMonth()+1;
                if(curMon<10) {
                    curMon = '0'+curMon;
                }
                var curDay = d.getDate();
                if(curDay<10) {
                    curDay = '0'+curDay;
                }
                var curHours = d.getHours();
                if(curHours<10) {
                    curHours = '0' + curHours;
                }
                var curMin= d.getMinutes();
                if(curMin<10) {
                    curMin = '0' + curMin;
                }
                var curSec= d.getSeconds();
                if(curSec<10) {
                    curSec = '0' + curSec;
                }
                var datetime = d.getFullYear()+"-" +curMon+"-" + curDay+"";
                if(type == 1) {
                    datetime = d.getFullYear()+"-" +curMon+"-" + curDay+" " + curHours + ':' + curMin + ':' + curSec;
                }
                return datetime;
            }
        }
    };
</script>
<style scoped>
    .bd{
        padding: 30px;
    }
    .main{
        position: relative;
        margin-left: 300px;
        background-color: #fff;
        padding-top:20px;
        padding-bottom: 20px;
    }
    .center {
        /*position: relative;
        margin-left: 300px;*/
        background-color: #fff;
        padding-top:20px;
        padding-bottom: 110px;
    }
    .nodata{
        padding-top:20px;
        padding-bottom: 20px;
        text-align: center;
        height: 350px;
    }
    .left {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 300px;
        padding: 10px;
        border-right: solid 1px #dddee1;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: #fff;
    }
    .left .search{
        width: 85%;
        margin: 0 auto;
        padding-bottom: 10px;
    }
    .left-tab{
        font-size: 14px;
        padding: 20px;
        font-weight:bold;
    }
    .left-tab-item{
        float: left;
        width: 33.3%;
    }
    .left-tab-item:hover{
        cursor: pointer;
    }
    .left-tab .sel{
        color: #59b399;
    }
    .left-group{

    }
    .left-item{
        padding: 14px 24px;
        position: relative;
        cursor: pointer;
        z-index: 1;
        transition: all .2s ease-in-out;
    }
    .left-item .flag-sj{
        position: absolute;
        right: 0px;
        top: 0px;
        width: 0;
        height: 0;
        border-top: 25px solid #FFC5CB;
        border-left: 25px solid transparent;
    }
    .left-item .flag-new{
        position: absolute;
        top:0;
        right:0;
        color: #fff;
    }
    .left-item:hover{
        border-left: 1px solid #59b399;
        background: #F6FAF9;
    }
    .active{
        border-left: 1px solid #59b399;
        background: #F6FAF9;
    }
    .left-item-line{
        display: flex;
        justify-content: space-between;
        padding:5px 0 5px 0;
    }
    .left-item-line .title{
        font-weight:bold;
    }
    .left-item-line .cont-left{
        width:180px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #a1a1a1;
    }
    .left-item-line .cont-tag{
        width:60px;
        border-radius: 4px;
        text-align: center;
    }
    .active .cont-tag{
        background-color: #59B399;
        color: #fff;
    }
    .active .title,.active .cont-left,.active .date{
        color: #59b399;
    }
    .cont-tag{
        background-color: #FFC172;
        color: #fff;
    }

    .row-item{
        height: 30px;
        /*display: table-row;*/
        margin-bottom:20px;
    }
    .align-right{
        text-align: right;
        margin-right: 20px;
    }
    .align-left{
        text-align: left;
        margin-left: 20px;
    }
    .row-item .img-item{
        width:150px;
        height: 150px;
        float: left;
        text-align: center;
    }
    .row-item .img-item span{
        display: block;
        text-align: center;
    }
    .line{
        height: 1px;
        background-color: #cccccc;
        width:90%;
        margin: 0 auto;
    }
    .replay{
        padding-top: 30px;
        width:84%;
        margin: 0 auto;
    }
    .replay_content >>> img{
        max-width:100%;
    }
  /*  .replay >>> .edui-editor-toolbarbox{
        display: none;
    }*/

    .row-item >>> .ivu-col{
        -ms-word-break: break-all;
        word-break: break-all;
    }
</style>
