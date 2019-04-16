<template>
    <div class="lead-page-content">
        <div v-if="showModal == 1">
            <div class="left">
                <div style="position: relative;display: flex;margin-top: 42px;">
                    <div class="tips-1">
                        <div class="tips-title">
                            <span>1、选中某服务单</span>
                            <img src="./image/LPOrgInfo-1.png">
                        </div>
                        <img src="./image/LPServicePost-1.png">
                    </div>
                    <div class="tips-2" style="align-items: flex-start;width: auto;">
                        <span class="btn-add show-item">新增</span>
                    </div>
                    <div class="tips-2" style="margin-left: 0;">
                        <div style="margin: 0 80px;">
                            <p>2、点击“新增”，增加服务岗位</p>
                            <img src="./image/LPServicePost-2.png" style="transform: rotate(0deg);width: 537px;">
                        </div>
                        <Button type="primary" class="orange" @click="nextStep">下一步</Button>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="left padding-left-365">
                <div class="tips-5">
                    <p>3、选中某服务岗位</p>
                    <img src="./image/LPServicePost-3.png">
                </div>
                <div style="position: relative;display: flex;">
                    <div class="tips-3" style="padding-top: 42px;">
                        <span class="btn-add show-item">选择人员</span>
                    </div>
                    <img src="./image/LPOrgInfo-1.png" class="arrow-icon">
                    <div class="tips-4">
                        <div>
                            <p>4、点击“选择人员”，选择该岗位的服务人员</p>
                            <img src="./image/LPServicePost-4.png">
                        </div>
                        <Button type="ghost" class="help" @click="toHelp">详情介绍</Button>
                        <Button type="primary" class="set" @click="toSet">立即设置</Button>
                    </div>
                </div>
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
                this.showModal = 2;
            },
            toHelp() {
                window.open('#/FQ?pageCode=F0526');
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
        padding: 15px;
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
        padding: 15px;
        border-right: solid 1px #dddee1;
        overflow: auto;
    }

    .lead-page-content .left.padding-left-365 {
        padding: 15px 15px 15px 365px;
    }

    .lead-page-content .left .btn-add {
        display: inline-block;
        height: 32px;
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
    .lead-page-content .tips-6 *{
        visibility: visible;
    }

    .lead-page-content .tips-1 {
        display: inline-flex;
        flex-direction: column;
        margin: 40px 0 0;
        align-items: center;
        justify-content: center;
    }

    .lead-page-content .tips-1 img {
        display: block;
        margin: auto;
    }

    .lead-page-content .tips-1 img {
        transform: rotate(0deg);
        width: 319px;
        height: 39px;
        margin-top: 69px;
    }

    .lead-page-content .tips-1 .tips-title {
        display: inline-flex;
        align-items: flex-end;
        margin-bottom: 30px;
    }

    .lead-page-content .tips-1 .tips-title img {
        transform: rotate(243deg);
        width: 64px;
        height: 64px;
    }

    .lead-page-content .tips-1 span {
        font-size: 19px;
        line-height: 28px;
        color: #FFF;
        visibility: visible;
        font-weight: 600;
        margin-top: 60px;
    }

    .lead-page-content .tips-2 {
        display: flex;
        align-items: flex-end;
        margin-left: 31px;
        width: 100%;
    }

    .lead-page-content .tips-2 img {
        transform: rotate(-43deg);
        width: 64px;
        height: auto;
        margin-right: 20px;
        margin-top: 30px;
    }

    .lead-page-content .tips-2 button, .lead-page-content .tips-4 button {
        width: 100px;
        height: 43px;
    }

    .lead-page-content .tips-2 p {
        margin: 0 80px;
        color: #FFF;
        font-size: 22px;
        line-height: 32px;
        font-weight: 600;
        white-space: nowrap;
    }

    .lead-page-content .tips-4 {
        display: inline-flex;
        align-items: flex-end;
    }

    .lead-page-content .tips-4 img {
        width: 491px;
        margin-right: 30px;
    }

    .lead-page-content .tips-4 p {
        color: #FFF;
        font-size: 22px;
        line-height: 32px;
        font-weight: 600;
        white-space: nowrap;
        margin-bottom: 10px;
    }

    .lead-page-content .tips-4 .set {
        width: 100px;
        height: 43px;
        font-size: 14px;
        background: #f7832f;
        border-color: #f7832f;
    }

    .lead-page-content .tips-4 .help {
        width: 100px;
        height: 43px;
        font-size: 14px;
        color: #FFF;
        border: 0;
        border-radius: 0;
        border-bottom: 2px solid #FFF;
    }

    .lead-page-content .tips-5 {
        margin: 57px 0 43px;
    }

    .lead-page-content .tips-5 img {
        width: 100%;
        max-height: 60px;
    }

    .lead-page-content .tips-5 p {
        color: #FFF;
        font-size: 22px;
        line-height: 32px;
        font-weight: 600;
        white-space: nowrap;
        margin-bottom: 10px;
        padding-left: 200px;
    }
    .orange {
        background: #f7832f;
        border-color: #f7832f;
    }
</style>