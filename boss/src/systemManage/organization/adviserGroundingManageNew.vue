<template>
    <div class="container">
        <div class="panel">
            <Row>
                <Select v-model="storeId" @on-change="chooseStore" style="width:335px;">
                    <Option v-for="item in stores" :value="item.id" :key="item.id">{{ item.orgName }}</Option>
                </Select>
                <Button type="ghost" style="position: absolute;top: 0px;right: 0px;background: #FFF;z-index: 2;border: 0;" @click="isShowLeadPage = true">
                    操作指引
                    <Icon type="document-text"></Icon>
                </Button>
            </Row>
        </div>
        <div class="left">
            <div v-for="list in users">
                <div class="title" :id="list.key"><span style="margin: 5px;">{{list.key}}</span></div>
                <div :class="u.activate ? 'userList' : 'userListDisable'" v-for="u in list.list" @click="getAdviser(u)">
                    <span v-if="u==selectUser" style="display:inline-flex; margin: 15px 0 5px 15px; color: #2d8cf0;">{{u.activate?u.realName:u.realName+'（未激活）'}}</span>
                    <span v-else style="display:inline-flex; margin: 15px 0 5px 15px;">{{u.activate?u.realName:u.realName+'（未激活）'}}</span>
                    <Icon v-if="u.status==0" type="checkmark-round" style="font-size: 16px; color: #59b399; margin: 15px 15px 5px 15px; float: right;"></Icon>
                </div>
            </div>
        </div>
        <div class="left_a">
            <ul v-for="list in users">
                <li style="background-color: #f7f7f7; text-align: center;">
                    <a :href="'#'+list.key">{{list.key}}</a>
                </li>
            </ul>
        </div>
        <div class="center" v-if="selectUser != null" style="padding-left: 25px; padding-right: 25px; background-color: white; box-shadow: 0 2px 3px 0 rgba(175, 175, 175, 0.55);">
            <func-node style="margin-top:0px;" v-if="selectUser != null" code="adviserGroundingManageCardNew" :selectUser="selectUser" :storeId="storeId" :isShowSaveBtn="!isShowLeadPage"></func-node>
        </div>
        <div class="center" v-else style="text-align: center;">
            <div style="padding-top: 260px">
                <img src="/static/noMessage.png"/>
            </div>
            <div>
                <span style="font-size: 16px !important;">请选择要维护顾问信息的人员~</span>
            </div>
        </div>

        <!-- 引导页 -->
        <div v-show="isShowLeadPage" class="lead-page">
            <component is="LPAdviserGrounding" @on-hide-page="hideLeadPage"></component>
        </div>
    </div>
</template>

<script>
    import LPAdviserGrounding from "../leadPage/LPAdviserGrounding";

    export default {
        props: {

        },
        data () {
            return {
                stores: [],
                storeId: null,
                users: [],
                selectUser: null,
                consultants:[],

                isShowLeadPage: false,
                checkKey: 'CONSULTATION_MANAGEMENT'
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
            this.$api.updateStatus = this.updateStatus;
            this.getStoreList();
        },
        methods: {
            updateStatus(id, status) {
                for(var i=0;i<this.users.length;i++){
                    for(var j=0;j<this.users[i].list.length;j++){
                        if (this.users[i].list[j].id == id) {
                            this.users[i].list[j].status = status;
                        }
                    }
                }
            },
            /**
             * 新增顾问时获取门店列表
             */
            getStoreList(){
                this.request({
                    url: "/systemManage/adviser/adviserGrounding/stores.do",
                }).then(data => {
                    this.stores = data;
                    if (data.length > 0) {
                        this.$set(this, "storeId", data[0].id);
                    }
                })
            },
            chooseStore(){
                this.selectUser = null;
                this.getUserList();
            },
            /**
             * 新增顾问选择门店时获取门店非顾问人员列表
             */
            getUserList(){
                this.request({
                    url: "/systemManage/adviser/adviserGrounding/getUser.do",
                    param: {
                        id: this.storeId,
                    },
                }).then(data => {
                    this.users = data;
                    //引导页面显示默认数据，关闭引导页面后清空当前选中
                    if (this.isShowLeadPage) {
                        if (data) {
                            if (data.length > 0 && data[0].list.length > 0) {
                                this.selectUser = data[0].list[0];
                            }
                        }
                    }
                })
            },
            getAdviser(item) {
                if(item.activate){
                    this.selectUser = null;
                    this.$nextTick(function () {
                        this.selectUser = item;
                        this.storeId = this.storeId;
                    });
                }
            },
            newConsultant() {
                this.prompt({
                    title: "新增顾问信息",
                    code: 'adviserGroundingManageCard',
                    props: {
                        editType: 'NEW',
                    },
                    width: 900,
                    height: 500,
                    callback: (close) => {
                        this.search();
                        close();
                    }
                });
            },
            edit(index) {
                this.prompt({
                    title: "顾问信息维护",
                    code: 'adviserGroundingManageCard',
                    props: {
                        editType: 'EDIT',
                        storeItem: this.consultants[index]
                    },
                    width: 900,
                    height: 500,
                    callback: (close) => {
                        this.search();
                        close();
                    }
                });
            },
            unGrounding (index) {
                this.$Modal.confirm({
                    title: '顾问下架确认',
                    content: '<p>您确定要下架这名顾问吗？</p>',
                    onOk: () => {
                        this.request({
                            url: "/systemManage/adviser/adviserGrounding/unGrounding.do",
                            param: {
                                id: this.consultants[index].id,
                            }
                        }).then(data => {
                            this.$Message.success('顾问下架成功!');
                            this.search();
                        });
                    },
                });

            },
            grounding(index) {
                this.prompt({
                    title: "顾问上架",
                    code: 'adviserGroundingManageCard',
                    props: {
                        editType: 'GROUNDING',
                        storeItem: this.consultants[index]
                    },
                    width: 900,
                    height: 500,
                    callback: (close) => {
                        this.search();
                        close();
                    }
                });
            },
            hideLeadPage() {
                this.selectUser = null;
                this.isShowLeadPage = false;
            }
        },
        components: {
            LPAdviserGrounding
        }
    };
</script>

<style scoped>
    .container {
        background: #f6f6f6;
    }
    .panel {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 48px;
        padding: 7px;
        background: white;
        border-bottom: solid 1px #dddee1;
    }
    .left {
        position: absolute;
        top: 48px;
        left: 0;
        bottom: 0;
        width: 350px;
        padding-bottom: 10px;
        border-right: solid 1px #dddee1;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: white;
    }
    .left_a {
        position: absolute;
        top: 48px;
        left: 350px;
        bottom: 0;
        width: 15px;
        padding-bottom: 10px;
        border-right: solid 1px #f7f7f7;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: #f7f7f7;
    }
    .center {
        position: absolute;
        top: 48px;
        left: 380px;
        right:30px;
        bottom: 0;
        background: #f7f7f7;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .userList {
        background-color: white;
        height: 50px;
        font-size: 14px;
    }
    .userListDisable {
        background-color: white;
        height: 50px;
        font-size: 14px;
        color: #bbbec4;
    }
    .userList:hover {
        background-color: #f3f3f3;
        height: 50px;
        font-size: 14px;
        color: #2d8cf0;
        cursor: pointer;
    }
    .title {
        background-color: #e5e5e5;
        font-size: 18px;
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