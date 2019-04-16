<template>
    <div class="lead-page-content">
        <div v-if="showModal == 1">
            <div class="left">
                <div style="position: relative;display: flex;margin-top: 82px;">
                    <span class="btn-add show-item">新增</span>
                    <div class="tips-1">
                        <span>1、新增派单岗位</span>
                        <img src="./image/LPOrgInfo-1.png">
                    </div>
                    <div class="tips-2">
                        <img src="./image/LPServiceSendPermission-1.png">
                        <Button type="primary" class="orange" @click="nextStep">下一步</Button>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="showModal == 2">
            <div class="left">
                <Row>
                    <i-col span="16" offset="8">
                        <div style="position: relative;display: flex;padding-top: 38px;">
                            <div class="tips-3">
                                <span class="btn-add show-item">选择人员</span>
                                <img src="./image/LPOrgInfo-1.png" class="arrow-icon">
                            </div>
                            <div class="tips-4">
                                <div style="width: 520px;">
                                    <p>2、点击“选择人员”，勾选需要添加的人员至“已选列表”</p>
                                    <img src="./image/LPServiceSendPermission-2.png">
                                </div>
                            </div>
                            <div class="tips-7">
                                <Button type="primary" class="orange" @click="nextStep">下一步</Button>
                            </div>
                        </div>
                    </i-col>
                </Row>
            </div>
        </div>
        <div v-else>
            <div class="left">
                <Row>
                    <i-col span="15">
                        <div class="tips-6">
                            <div style="width: 451px;">
                                <img src="./image/LPServiceSendPermission-3.png">
                            </div>
                        </div>
                    </i-col>
                    <i-col span="9">
                        <div style="position: relative;display: flex;align-items: flex-end;padding-top: 60px;">
                            <div class="tips-5">
                                <div style="position: absolute;top: 22px;left: 1px;">
                                    <span class="btn-add show-item">选择合约</span>
                                </div>
                                <img src="./image/LPOrgInfo-1.png" class="arrow-icon">
                                <p>3、勾选该岗位中可接服务单至“已选列表”，保存，设置成功。</p>
                                <div>
                                    <Button type="ghost" class="help" @click="toHelp">详情介绍</Button>
                                    <Button type="primary" class="set" @click="toSet">立即设置</Button>
                                </div>
                            </div>
                        </div>
                    </i-col>
                </Row>
            </div>
        </div>
    </div>
</template>

<script>
    import OrgSubjectCard from '../organization/orgSubjectCard';

    export default {
        data () {
            return {
                showModal: 1
            }
        },
        created: function () {

        },
        methods: {
            nextStep() {
                this.showModal = this.showModal + 1;
            },
            toHelp() {
                window.open('#/FQ?pageCode=F0527');
            },
            toSet() {
                this.showModal = 1;
                this.$emit('on-hide-page');
            }
        },
        components: {
            OrgSubjectCard
        }
    };
</script>

<style scoped>
    .lead-page-content {
        height: 100%;
        padding: 20px 100px;
        background: rgba(51, 51, 53, 0.77);
    }

    .lead-page-content * {
        visibility: hidden;
    }

    .lead-page-content .show-item {
        visibility: visible;
        background: #FFF;
    }

    .lead-page-content .show-item * {
        visibility: visible;
    }

    .lead-page-content .left {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        padding: 20px 100px;
        border-right: solid 1px #dddee1;
        overflow: auto;
    }

    .lead-page-content .left.padding-left-365 {
        padding: 15px 15px 15px 365px;
    }

    .lead-page-content .left .btn-add {
        display: inline-block;
        height: 32px;
        max-width: 80px;
        padding: 7px 16px;
        color: #FFF;
        background: #59b399;
        border-color: #59b399;
        border-radius: 3px;
        font-size: 12px;
        font-weight: 700;
        white-space: nowrap;
    }

    .lead-page-content .tips-1 *, .lead-page-content .tips-2 *,
    .lead-page-content .tips-3 *, .lead-page-content .dept-list *,
    .lead-page-content .tips-4 *, .lead-page-content .tips-5 *,
    .lead-page-content .tips-6 *, .lead-page-content .tips-7 *{
        visibility: visible;
    }

    .lead-page-content .tips-1 {
        margin: -15px 100px 0;
    }

    .lead-page-content .tips-1 img {
        transform: rotate(288deg);
        width: 130px;
        height: 130px;
        display: block;
        margin: auto;
    }

    .lead-page-content .tips-1 img:first-child {
        transform: rotate(315deg);
        margin: 0;
    }

    .lead-page-content .tips-1 span {
        font-size: 19px;
        line-height: 28px;
        color: #FFF;
        visibility: visible;
        font-weight: 600;
        margin-top: 100px;
    }

    .lead-page-content .tips-2 {
        display: flex;
        align-items: flex-end;
    }

    .lead-page-content .tips-2 img {
        transform: rotate(0);
        width: 100%;
        max-width: 313px;
        height: auto;
        margin-right: 20px;
    }

    .lead-page-content .tips-2 button, .lead-page-content .tips-4 button, .lead-page-content .tips-7 button {
        width: 100px;
        height: 43px;
    }

    .lead-page-content .tips-3 {
        display: inline-flex;
        flex-direction: column;
        align-items: left;
        flex: 1;
        margin-top: 45px;
    }

    .lead-page-content .tips-3 p {
        color: #FFF;
        font-size: 22px;
        line-height: 32px;
        font-weight: 600;
        padding-left: 100px;
    }

    .lead-page-content .tips-3 img {
        align-self: center;
        transform: rotate(-35deg);
        margin-bottom: 0;
        margin-top: 80px;
    }

    .lead-page-content .arrow-icon {
        visibility: visible;
        width: 128px;
        height: 128px;
        transform: rotate(65deg);
        margin-bottom: 200px;
    }

    .lead-page-content .tips-4 {
        display: flex;
        align-items: flex-end;
        margin-top: 20px;
    }

    .lead-page-content .tips-4 img {
        transform: rotate(0);
        width: 100%;
        max-width: 414px;
        height: auto;
        margin-right: 20px;
    }

    .lead-page-content .tips-4 p {
        color: #FFF;
        font-size: 19px;
        line-height: 32px;
        font-weight: 600;
        white-space: nowrap;
        margin-bottom: 10px;
    }

    .lead-page-content .tips-5 {
        position: relative;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 40px;
        padding-top: 80px;
    }

    .lead-page-content .tips-5 p {
        padding: 0 30px 0 10px;
        color: #FFF;
        font-size: 19px;
        line-height: 32px;
        font-weight: 600;
        margin-bottom: 100px;
    }

    .lead-page-content .tips-5 img {
        transform: rotate(0deg);
        align-self: flex-start;
        width: 80px;
        height: 80px;
        margin-bottom: 60px;
    }

    .lead-page-content .tips-5 .set {
        width: 100px;
        height: 43px;
        font-size: 14px;
        background: #f7832f;
        border-color: #f7832f;
    }

    .lead-page-content .tips-5 .help {
        width: 100px;
        height: 43px;
        font-size: 14px;
        color: #FFF;
        border: 0;
        border-radius: 0;
        border-bottom: 2px solid #FFF;
    }

    .lead-page-content .tips-7 {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        flex: 1;
    }

    .lead-page-content .tips-6 {
        display: flex;
        justify-content: center;
        margin-top: 60px;
    }

    .lead-page-content .tips-6 img {
        transform: rotate(0);
        width: 100%;
        max-width: 431px;
        height: auto;
        margin-right: 20px;
    }

    .lead-page-content .tips-6 p {
        padding: 0 30px 0 10px;
        color: #FFF;
        font-size: 19px;
        line-height: 32px;
        font-weight: 600;
        white-space: nowrap;
        margin-bottom: 10px;
    }
    .orange {
        background: #f7832f;
        border-color: #f7832f;
    }
</style>