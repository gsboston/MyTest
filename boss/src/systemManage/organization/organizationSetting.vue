<template>
    <div class="container">
        <Row>
            <Form ref="form" :label-width="100" label-position="left">
                <i-col span="22" offset="1" style="margin-top: 15px;">
                    <header class="org-header">
                        <span>组织设置中心</span>
                    </header>
                    <br/>
                    <i-col span="20" offset="2">
                        <!-- 组织名称 -->
                        <Form-item prop="name">
                            <div slot="label" style="display: flex;">
                                <span class="title-name">组织名称</span>
                                <Tooltip placement="right" style="margin: auto;">
                                    <Icon type="ios-help-outline"></Icon>
                                    <div slot="content">
                                        签约主体即与客户签订合同时的合同乙方，如需添加本组织为签约主体，请点击“详情”操作。
                                        <span class="operate-help-btn" @click="linkHelp('F0504')">操作指引</span>
                                    </div>
                                </Tooltip>
                            </div>
                            <div class="content">
                                <p class="none-setting">
                                    {{ orgInfo.name }}
                                    （是否签约主体：
                                    <span style="color: #59b399;font-weight: 600;">{{ orgInfo.signSubject ? '是' : '否' }}</span>
                                    ）
                                </p>
                                <Button type="primary" class="custom-btn" @click="openPage('F0504')">详情</Button>
                            </div>
                        </Form-item>

                        <!-- 合约自动审核 -->
                        <Form-item prop="name" class="muilti-label">
                            <div slot="label" style="display: flex;">
                                <span class="title-name">合约自动审核</span>
                            </div>
                            <div class="content">
                                <p v-if="!openRulesInfo || openRulesInfo.length == 0" class="none-setting">未开启</p>
                                <div v-else class="content-desc">
                                    <Tag v-for="(openRules, index) in openRulesInfo" :key="index" v-if="index < 5">{{ openRules }}</Tag>
                                    <!--<Tag class="user-num">共 {{ openRulesInfo.length }}位成员</Tag>-->
                                </div>
                                <Button type="primary" class="custom-btn" @click="openPage('F0530')">修改</Button>
                            </div>
                        </Form-item>

                        <!-- 下级组织签约主体 -->
                        <Form-item prop="name" class="muilti-label">
                            <div slot="label" style="display: flex;">
                                <span class="title-name">下级组织签约主体</span>
                                <Tooltip placement="right" style="margin: auto;height: 100%;">
                                    <Icon type="ios-help-outline"></Icon>
                                    <div slot="content">
                                        即本组织下所有下级组织中设置为签约主体的公司名称，与客户签订合同时的合同乙方，如果调整签约主体请点击“修改”操作。
                                        <span class="operate-help-btn" @click="linkHelp('F0505')">操作指引</span>
                                    </div>
                                </Tooltip>
                            </div>
                            <div class="content">
                                <p v-if="!orgSubjectInfo || orgSubjectInfo.length == 0" class="none-setting">未设置</p>
                                <div v-else class="content-desc">
                                    <Tag v-for="(subject, index) in orgSubjectInfo" :key="index" v-if="index < 2">{{ subject.name }}</Tag>
                                    <Tag class="user-num">共 {{ orgSubjectInfo.length }}位成员</Tag>
                                </div>
                                <Button type="primary" class="custom-btn" @click="openPage('F0505')">{{ (!orgSubjectInfo || orgSubjectInfo.length == 0) ? '去设置' : '修改' }}</Button>
                            </div>
                        </Form-item>

                        <!-- 组织成员 -->
                        <Form-item prop="name">
                            <div slot="label">
                                <span class="title-name">组织成员</span>
                                <Tooltip placement="right">
                                    <Icon type="ios-help-outline"></Icon>
                                    <div slot="content">
                                        即本组织的所有部门成员， 在设置所有接单、派单、服务等岗位人员之前，需要将本组织成员添加至“组织成员”中。
                                        <span class="operate-help-btn" @click="linkHelp('F0505')">操作指引</span>
                                    </div>
                                </Tooltip>
                            </div>
                            <div class="content">
                                <p v-if="userInfoTotal == 0" class="none-setting">未设置</p>
                                <div v-else class="content-desc">
                                    <span v-for="(user, index) in userInfo" :key="index" v-if="index < 6" class="base-item">{{ user.realName }}</span>
                                    <Tag class="user-num">共 {{ userInfoTotal }}位成员</Tag>
                                </div>
                                <Button type="primary" class="custom-btn" @click="openPage('F0505')">{{ userInfoTotal == 0 ? '去设置' : '修改' }}</Button>
                            </div>
                        </Form-item>

                        <!-- 服务岗位 -->
                        <Form-item prop="name">
                            <div slot="label">
                                <span class="title-name">服务岗位</span>
                                <Tooltip placement="right">
                                    <Icon type="ios-help-outline"></Icon>
                                    <div slot="content">
                                        服务岗位人员主要对服务单进行服务，可将服务单关联至组织具有服务能力的人员，对服务单进行分配时，可选择服务人员进行服务。
                                        <span class="operate-help-btn" @click="linkHelp('F0526')">操作指引</span>
                                    </div>
                                </Tooltip>
                            </div>
                            <div class="content">
                                <p v-if="servePostTotal == 0" class="none-setting">未设置</p>
                                <div v-else class="content-desc">
                                    <span v-for="(post, index) in servePost" :key="index" v-if="index < 6" class="base-item">{{ post.realName }}</span>
                                    <Tag class="user-num">共 {{ servePostTotal }}位成员</Tag>
                                </div>
                                <Button type="primary" class="custom-btn" @click="openPage('F0526', true)">{{ servePostTotal == 0 ? '去设置' : '修改' }}</Button>
                            </div>
                        </Form-item>

                        <!-- 服务商 -->
                        <Form-item prop="name">
                            <div slot="label">
                                <span class="title-name">服务商</span>
                                <Tooltip placement="right">
                                    <Icon type="ios-help-outline"></Icon>
                                    <div slot="content">
                                        本组织对某类型服务单无服务能力时，可将服务单外包到“服务商”组织，需提前将服务单与“服务商”进行关联，关联后即可将该类型服务单指派给服务商服务。
                                        <span class="operate-help-btn" @click="linkHelp('F0524')">操作指引</span>
                                    </div>
                                </Tooltip>
                            </div>
                            <div class="content">
                                <p v-if="billBusinessTotal == 0" class="none-setting">未设置</p>
                                <div v-else class="content-desc">
                                    <Tag v-for="(business, index) in billBusiness" :key="index" v-if="index < 2" class="base-item">{{ business.serviceNm }}</Tag>
                                    <Tag class="user-num">共 {{ billBusinessTotal }}位成员</Tag>
                                </div>
                                <Button type="primary" class="custom-btn" @click="openPage('F0524', true)">{{ billBusinessTotal == 0 ? '去设置' : '修改' }}</Button>
                            </div>
                        </Form-item>

                        <!-- 顾问上架 -->
                        <Form-item prop="name">
                            <div slot="label">
                                <span class="title-name">顾问上架</span>
                                <Tooltip placement="right">
                                    <Icon type="ios-help-outline"></Icon>
                                    <div slot="content">
                                        设置组织成员上架后，用户可在“顺利办客户端“搜索到该顾问，并对顾问发起咨询。
                                        <span class="operate-help-btn" @click="linkHelp('F0552')">操作指引</span>
                                    </div>
                                </Tooltip>
                            </div>
                            <div class="content">
                                <p v-if="consultantTotal == 0" class="none-setting">未设置</p>
                                <div v-else class="content-desc">
                                    <span v-for="(consultant, index) in consultantInfo" :key="index" v-if="index < 6" class="base-item">{{ consultant.name }}</span>
                                    <Tag class="user-num">共 {{ consultantTotal }}位成员</Tag>
                                </div>
                                <Button type="primary" class="custom-btn" @click="openPage('F0552', true)">{{ (!orgSubjectInfo || orgSubjectInfo.length == 0) ? '去设置' : '修改' }}</Button>
                            </div>
                        </Form-item>

                        <!-- 派单权限 -->
                        <Form-item prop="name">
                            <div slot="label">
                                <span class="title-name">派单权限</span>
                                <Tooltip placement="right">
                                    <Icon type="ios-help-outline"></Icon>
                                    <div slot="content">
                                        派单岗位主要对本组织签订的合同生成的服务单进行指派，组织有服务能力时可将服务单自留，分配给本组织服务负责人；组织无服务能力时可将服务单外包到“服务商”，“服务商”需提前关联服务单。派单权限可选择“开启”或“关闭”，开启时，仅派单权限列表中人员可进行派单，关闭时，所有组织成员类型为“派单人员”的均可派单。
                                        <span class="operate-help-btn" @click="linkHelp('F0527')">操作指引</span>
                                    </div>
                                </Tooltip>
                            </div>
                            <div class="content">
                                <p v-if="sendPostTotal == 0" class="none-setting">未设置</p>
                                <div v-else class="content-desc">
                                    <span v-for="(post, index) in sendPost" :key="index" v-if="index < 6" class="base-item">{{ post.realName }}</span>
                                    <Tag class="user-num">共 {{ sendPostTotal }}位成员</Tag>
                                </div>
                                <i-switch v-model="sendPermission" @on-change="switchSendPermission">
                                    <span slot="open">开</span>
                                    <span slot="close">关</span>
                                </i-switch>
                                <Button type="primary" class="custom-btn" @click="openPage('F0527', true)">{{ sendPostTotal == 0 ? '去设置' : '修改' }}</Button>
                            </div>
                        </Form-item>

                        <!-- 接单权限 -->
                        <Form-item prop="name">
                            <div slot="label">
                                <span class="title-name">接单权限</span>
                                <Tooltip placement="right">
                                    <Icon type="ios-help-outline"></Icon>
                                    <div slot="content">
                                        接单岗位主要对本组织所有接收到的服务单进行指派，组织可选择“接单”并分配给服务负责人，也可选择“拒单”。接单权限可选择“开启”或“关闭”，开启时，仅接单权限列表中人员可进行接单，关闭时，所有组织成员类型为“接单人员”的均可接单。
                                        <span class="operate-help-btn" @click="linkHelp('F0525')">操作指引</span>
                                    </div>
                                </Tooltip>
                            </div>
                            <div class="content">
                                <p v-if="recevPostTotal == 0" class="none-setting">未设置</p>
                                <div v-else class="content-desc">
                                    <span v-for="(post, index) in recevPost" :key="index" v-if="index < 6" class="base-item">{{ post.realName }}</span>
                                    <Tag class="user-num">共 {{ recevPostTotal }}位成员</Tag>
                                </div>
                                <i-switch v-model="receivePermission" @on-change="switchReceivePermission">
                                    <span slot="open">开</span>
                                    <span slot="close">关</span>
                                </i-switch>
                                <Button type="primary" class="custom-btn" @click="openPage('F0525', true)">{{ recevPostTotal == 0 ? '去设置' : '修改' }}</Button>
                            </div>
                        </Form-item>
                    </i-col>
                </i-col>
            </Form>
        </Row>
    </div>
</template>

<script>
    export default {
        props: {

        },
        data () {
            return {
                orgInfo: {},
                userInfo: [],
                userInfoTotal: 0,
                openRulesInfo: [],
                orgSubjectInfo: [],
                consultantInfo: [],
                consultantTotal: 0,
                sendPost: [],
                sendPostTotal: 0,
                recevPost: [],
                recevPostTotal: 0,
                servePost: [],
                servePostTotal: 0,
                billBusiness: [],
                billBusinessTotal: 0,

                sendPermission: false,
                receivePermission: false,
            }
        },
        created: function () {
            this.getOrgInfo();
        },
        methods: {
            getOrgInfo() {
                this.request({
                    url: `/systemManage/organization/currentOrgInfo.do`
                }).then(data => {
                    if (undefined !== data && null !== data){
                        this.orgInfo = data;
                        this.getPermission('DISPATCH');
                        this.getPermission('RECEIVE');
                        this.getOrgUsers();
                        this.getOpenRulesList();
                        this.getOrgSubject();
                        this.getSendPost();
                        this.getRecevPost();
                        this.getServePost();
                        this.getBillBusiness();
                        this.getConsultantList();
                    }
                });
            },
            getPermission(type) {
                this.request({
                    url: `/systemManage/organization/getPermissionState.do`,
                    param: {
                        orgId: this.orgInfo.id,
                        type: type
                    }
                }).then(data => {
                    if (type == 'DISPATCH'){
                        this.sendPermission = data;
                    }else {
                        this.receivePermission = data;
                    }
                });
            },
            getOpenRulesList () {
                this.request({
                    url: `/systemManage/auditConfigurationPage/getOpenRulesList.do`
                }).then(data => {
                    if (undefined !== data && null !== data){
                        this.openRulesInfo = data;
                    }
                });
            },
            getOrgSubject() {
                this.request({
                    url: `/systemManage/orgSystems/getCurOrgSys.do`
                }).then(data => {
                    if (undefined !== data && null !== data){
                        this.orgSubjectInfo = data.subjectChild;
                    }
                });
            },
            getOrgUsers() {
                this.request({
                    url: '/systemManage/user/userlistInfo.do',
                    param: {
                        orgId: this.orgInfo.id,
                    }
                }).then(data => {
                    this.userInfo = data.records;
                    this.userInfoTotal = data.total;
                });
            },
            getSendPost() {
                this.request({
                    url: '/systemManage/post/getSendPostList.do',
                    param: {
                        size: 6
                    }
                }).then(data => {
                    this.sendPost = data.records;
                    this.sendPostTotal = data.total;
                });
            },
            getRecevPost() {
                this.request({
                    url: '/systemManage/post/getRecevPostList.do',
                    param: {
                        size: 6
                    }
                }).then(data => {
                    this.recevPost = data.records;
                    this.recevPostTotal = data.total;
                });
            },
            getServePost() {
                this.request({
                    url: '/systemManage/post/getServePostList.do',
                    param: {
                        size: 6
                    }
                }).then(data => {
                    this.servePost = data.records;
                    this.servePostTotal = data.total;
                });
            },
            getBillBusiness() {
                this.request({
                    url: '/systemManage/business/getBillBusinessList.do',
                    param: {
                        size: 6
                    }
                }).then(data => {
                    this.billBusiness = data.records;
                    this.billBusinessTotal = data.total;
                });
            },
            getConsultantList() {
                this.request({
                    url: '/systemManage/consultant/getConsulatanList.do',
                }).then(data => {
                    this.consultantInfo = data.consultantVos;
                    this.consultantsTotal = data.memberNum;
                });
            },
            openPage(funcCode, isAuth) {
                if (isAuth) {
                    if (this.userInfoTotal == 0) {
                        this.$Message.info('您还未创建机构成员，请先创建机构成员，再设置岗位！');
                        return false;
                    }
                }
                this.$router.push({
                    path: '/M05',
                    query: {
                        funcCode: funcCode
                    }
                });
            },
            linkHelp(pageCode) {
                window.open('#/FQ?pageCode=' + pageCode);
            },
            switchSendPermission(val) {
                if (val && this.sendPostTotal == 0) {
                    this.$Message.warning("设置好派单人员后方可开启");
                    this.$nextTick(() => {
                        this.sendPermission = false;
                    });
                }else {
                    let saveData = {
                        orgId: this.orgInfo.id,
                        type: 'DISPATCH',
                        value: val ? 'ENABLE' :'DISABLE'
                    }
                    this.$Modal.confirm({
                        title: '提示',
                        content: val ? '<p>开启派单权限后，仅“派单权限”列表中账号可派单，确定开启吗？</p>' : '<p>关闭派单权限后，组织成员中派单岗位的人员均可派单，确定关闭吗？</p>',
                        onOk: () => {
                            this.request({
                                url: '/systemManage/organization/updatePermission.do',
                                data: saveData
                            }).then(() => {
                                if (val) {
                                    this.$Message.success("派单权限已开启");
                                }else {
                                    this.$Message.success("派单权限已关闭");
                                }
                                this.getPermission('DISPATCH');
                            });
                        },
                        onCancel: () => {
                            if (val) {
                                this.sendPermission = false;
                            }else {
                                this.sendPermission = true;
                            }
                        }
                    });
                }
            },
            switchReceivePermission(val) {
                if (val && this.recevPostTotal == 0) {
                    this.$Message.warning("设置好接单人员后方可开启");
                    this.$nextTick(() => {
                        this.receivePermission = false;
                    });
                }else {
                    let saveData = {
                        orgId: this.orgInfo.id,
                        type: 'RECEIVE',
                        value: val ? 'ENABLE' :'DISABLE'
                    }
                    this.$Modal.confirm({
                        title: '提示',
                        content: val ? '<p>开启接单权限后，仅“接单权限”列表中账号可接单，确定开启吗？</p>' : '<p>关闭接单权限后，组织成员中接单岗位的人员均可接单，确定关闭吗？</p>',
                        onOk: () => {
                            this.request({
                                url: '/systemManage/organization/updatePermission.do',
                                data: saveData
                            }).then(() => {
                                if (val) {
                                    this.$Message.success("接单权限已开启");
                                } else {
                                    this.$Message.success("接单权限已关闭");
                                }
                                this.getPermission('RECEIVE');
                            });
                        },
                        onCancel: () => {
                            if (val) {
                                this.receivePermission = false;
                            } else {
                                this.receivePermission = true;
                            }
                        }
                    });
                }
            }
        }
    };
</script>

<style scoped>
    .container {
        padding: 15px;
        font-size: 14px;
    }
    .org-header span {
        display: inline-block;
        background: #fff;
        position: relative;
        padding: 0 5px;
        margin-left: 30px;
        font-size: 18px;
        border-bottom: 3px solid #59b399;
    }

    .container .ivu-form >>> .ivu-form-item {
        margin-bottom: 5px;
    }

    .container .ivu-form >>> .ivu-form-item-label {
        font-size: 14px;
        padding: 22px 12px 22px 0;
    }

    .container .title-name {
        display: inline-block;
        width: 56px;
        margin-right: 5px;
        line-height: 20px;
        vertical-align: text-bottom;
    }

    .container .ivu-icon {
        font-size: 20px;
    }

    .container .ivu-form >>> .ivu-form-item-content {
        min-height: 65px;
        line-height: 65px;
    }

    .container .content {
        display: flex;
        height: 100%;
        border-bottom: 1px solid #E0E0E0;
        font-size: 14px;
    }

    .container .none-setting {
        width: 100%;
        color: #828282;
    }

    .container >>> .ivu-tooltip-inner {
        white-space: normal;
        max-width: 500px;
    }

    .container .content .base-item {
        color: #828282;
        margin-right: 27px;
    }

    .container .content .base-item:nth-child(6) {
        margin-right: 5px;
    }

    .container .content .ivu-tag {
        font-size: 14px;
        padding: 5px 8px;
        height: 32px;
        margin: auto 27px auto 0;
    }

    .container .content .custom-btn {
        min-width: 74px;
        font-size: 14px;
        color: #59b399;
        background: transparent;
        border-color: transparent;
    }

    .container .content .content-desc {
        width: 100%;
    }

    .container .content .user-num {
        background: #e5e5e5;
        color: #4c4c4d;
        font-size: 14px;
        font-style: italic;
        border-radius: 4px;
        padding: 3px 8px;
        height: 28px;
    }

    .container .muilti-label >>> .ivu-form-item-label{
        padding: 10px 12px 10px 0;
    }

    .container .operate-help-btn {
        display: inline-block;
        color: #3ccfa3;
        border-bottom: 1px solid #3ccfa3;
        padding: 2px;
    }

    .container .ivu-switch {
        margin: auto;
        width: auto;
        min-width: 48px;
    }

    .container .ivu-switch-checked {
        border-color: #59b399;
        background-color: #59b399;
    }
</style>