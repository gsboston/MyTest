<template>
    <div class="lead-page-content">
        <div v-if="showModal == 1">
            <div class="left">
                <div class="org-select-panel">
                    <span class="input-org-name show-item">北京朝阳区门店灯塔（当前组织）</span>
                    <div class="tips-1">
                        <img src="./image/LPOrgInfo-1.png">
                        <span>1、点击可切换需要设置的组织</span>
                    </div>
                </div>
                <div style="position: relative;">
                    <span class="btn-add show-item">添加部门</span>
                    <div class="tips-2">
                        <img src="./image/LPOrgInfo-1.png">
                        <span>2、点击“新增”，可为本组织添加部门</span>
                        <img src="./image/LPOrgInfo-1.png">
                    </div>
                    <div class="tips-3">
                        <img src="./image/LPOrgSetting-1.png">
                        <Button type="primary" class="orange" @click="nextStep">下一步</Button>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="showModal == 2">
            <div class="left">
                <div class="tips-4">
                    <p>3、选中某部门</p>
                    <img src="./image/LPOrgInfo-1.png">
                    <span class="btn-add show-item">添加人员</span>
                </div>
                <Menu mode="vertical" class="dept-list" active-name="fwb">
                    <MenuItem class="dept-item" name="fwb">
                        服务部
                        <ButtonGroup style="float: right;">
                            <Button type="ghost" icon="ios-compose-outline" title="修改" size="small"></Button>
                            <Button type="ghost"  icon="ios-trash-outline" title="删除" size="small"></Button>
                        </ButtonGroup>
                    </MenuItem>
                </Menu>
                <div class="tips-5">
                    <div style="width: 520px;">
                        <img src="./image/LPOrgInfo-1.png">
                        <p>4、点击“添加人员”，可新增部门人员</p>
                        <img src="./image/LPOrgSetting-2.png">
                    </div>
                    <Button type="primary" class="orange" @click="nextStep">下一步</Button>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="left" style="display: flex;padding-top: 70px;">
                <div class="tips-6">
                    <div style="width: 520px;">
                        <p>5、点击人员账号后方“岗位信息”，可为该账号设置岗位信息权限</p>
                        <img src="./image/LPOrgSetting-3.png">
                    </div>
                </div>
                <div class="tips-7">
                    <div>
                        <img src="./image/LPOrgInfo-1.png">
                        <img src="./image/LPOrgSetting-4.png">
                    </div>
                    <div>
                        <Button type="primary" class="set" @click="toSet">立即设置</Button>
                        <Button type="ghost" class="help" @click="toHelp">详情介绍</Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
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
                window.open('#/FQ?pageCode=F0505');
            },
            toSet() {
                this.showModal = 1;
                this.$emit('on-hide-page');
            }
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

    .lead-page-content .left .btn-add {
        display: inline-block;
        padding: 8px 16px;
        color: #FFF;
        background: #59b399;
        border-color: #59b399;
        border-radius: 3px;
        font-size: 12px;
        font-weight: 700;
    }

    .lead-page-content .left .input-org-name {
        display: inline-block;
        width: 239px;
        margin-right: 80px;
        margin-bottom: 16px;
        height: 32px;
        line-height: 22px;
        padding: 4px 7px;
        font-size: 12px;
        border: 1px solid #dddee1;
        border-radius: 4px;
        color: #495060;
        background-color: #fff;
    }

    .lead-page-content .tips-1 {
        position: absolute;
        top: 8px;
        left: 280px;
        display: flex;
        align-items: center;
    }

    .lead-page-content .tips-1 *, .lead-page-content .tips-2 *,
    .lead-page-content .tips-3 *, .lead-page-content .dept-list *,
    .lead-page-content .tips-4 *, .lead-page-content .tips-5 *,
    .lead-page-content .tips-6 *, .lead-page-content .tips-7 * {
        visibility: visible;
    }

    .lead-page-content .tips-1 img {
        transform: rotate(90deg);
        width: 45px;
        height: 45px;
    }
    .lead-page-content .tips-1 span {
        font-size: 19px;
        line-height: 28px;
        color: #FFF;
        visibility: visible;
        font-weight: 600;
    }

    .lead-page-content .tips-2 {
        position: absolute;
        top: -15px;
        left: 100px;
        display: flex;
        align-items: center;
    }

    .lead-page-content .tips-2 img {
        transform: rotate(270deg);
        width: 45px;
        height: 45px;
        margin-top: 100px;
        margin-left: 20px;
    }

    .lead-page-content .tips-2 img:first-child {
        transform: rotate(315deg);
        margin: 0;
    }

    .lead-page-content .tips-2 span {
        font-size: 19px;
        line-height: 28px;
        color: #FFF;
        visibility: visible;
        font-weight: 600;
        margin-top: 100px;
    }

    .lead-page-content .tips-3 {
        position: absolute;
        top: 60px;
        left: 520px;
        display: flex;
        align-items: flex-end;
    }

    .lead-page-content .tips-3 img {
        transform: rotate(0);
        width: 100%;
        max-width: 500px;
        height: auto;
        margin-right: 20px;
    }

    .lead-page-content .tips-3 button, .lead-page-content .tips-5 button {
        width: 100px;
        height: 43px;
    }

    .lead-page-content .tips-4 {
        display: flex;
        align-items: flex-end;
        padding-bottom: 30px;
        width: 450px;
        height: 200px;
    }

    .lead-page-content .tips-4 p {
        color: #FFF;
        font-size: 22px;
        line-height: 32px;
        font-weight: 600;
        padding-left: 100px;
    }

    .lead-page-content .tips-4 img {
        width: 86px;
        margin-bottom: 40px;
        transform: rotate(210deg);
    }

    .lead-page-content .tips-4 span {
        margin-bottom: 138px;
        margin-left: 20px;
    }

    .lead-page-content .dept-list {
        width: 450px!important;
        padding-right: 130px;
    }

    .lead-page-content .dept-list .dept-item {
        position: relative;
        width: 100%;
        padding: 15px 8px!important;
        line-height: 24px;
        border: 0;
        border-bottom: 1px solid #eee!important;
        height: auto!important;
        background: #FFF;
    }

    .lead-page-content .tips-5 {
        position: absolute;
        top: 60px;
        left: 450px;
        display: flex;
        align-items: flex-end;
    }

    .lead-page-content .tips-5 img {
        transform: rotate(0);
        width: 100%;
        max-width: 500px;
        height: auto;
        margin-right: 20px;
    }

    .lead-page-content .tips-5 img:first-child {
        width: 76px;
        transform: rotate(-61deg);
        margin: 0;
    }

    .lead-page-content .tips-5 p {
        color: #FFF;
        font-size: 22px;
        line-height: 32px;
        font-weight: 600;
        padding-left: 80px;
        position: absolute;
        top: 38px;
    }

    .lead-page-content .tips-6 {
        display: flex;
        margin-left: 300px;
    }

    .lead-page-content .tips-6 img {
        transform: rotate(0);
        width: 100%;
        max-width: 500px;
        height: auto;
        margin-right: 20px;
    }

    .lead-page-content .tips-6 img:first-child {
        width: 76px;
        transform: rotate(-61deg);
        margin: 0;
    }

    .lead-page-content .tips-6 p {
        color: #FFF;
        font-size: 22px;
        line-height: 32px;
        font-weight: 600;
        white-space: nowrap;
        margin-bottom: 30px;
    }

    .lead-page-content .tips-7 {
        display: flex;
        flex: 1;
        flex-direction: column;
    }

    .lead-page-content .tips-7>div:first-child {
        text-align: right;
        height: 370px;
        padding-top: 40px;
        padding-right: 80px;
    }

    .lead-page-content .tips-7>div:first-child img:first-child {
        margin-right: 30%;
        transform: rotate(86deg);
    }

    .lead-page-content .tips-7>div:first-child img:nth-child(2) {
        width: 66px;
    }

    .lead-page-content .tips-7 .set {
        width: 100px;
        height: 43px;
        font-size: 14px;
        background: #f7832f;
        border-color: #f7832f;
    }

    .lead-page-content .tips-7 .help {
        width: 100px;
        height: 43px;
        font-size: 14px;
        color: #FFF;
        border: 0;
        border-radius: 0;
        border-bottom: 2px solid #FFF;
    }
    .orange {
        background: #f7832f;
        border-color: #f7832f;
    }
</style>