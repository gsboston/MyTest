<template>
    <div class="lead-page-content">
        <div>
            <div class="left">
                <div style="position: relative;display: flex;align-items: flex-start;margin-top: 42px;">
                    <div class="tips-1">
                        <span>1、选中左侧顾问</span>
                        <img src="./image/LPOrgInfo-1.png">
                        <img src="./image/LPAdviserGrounding-1.png">
                    </div>
                    <div class="tips-2">
                        <div style="width: 100%;flex: 1;text-align: right;">
                            <Button type="ghost" class="help" @click="toHelp">详情介绍</Button>
                            <Button type="primary" class="set" @click="toSet">立即设置</Button>
                        </div>
                        <p>2、设置上架信息，并点击“上架”，即可在“天天顺利办商家端“搜索到该顾问。</p>
                        <div style="width: 100%;flex: 1;text-align: right;">
                            <img src="./image/LPOrgInfo-1.png">
                            <span class="btn-add show-item">上架</span>
                        </div>
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

            }
        },
        created: function () {

        },
        methods: {
            toHelp() {
                window.open('#/FQ?pageCode=F0552');
            },
            toSet() {
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
    .lead-page-content .tips-3 * {
        visibility: visible;
    }

    .lead-page-content .tips-1 {
        display: inline-flex;
        flex-direction: column;
        margin: 0;
        align-items: center;
        justify-content: center;
    }

    .lead-page-content .tips-1 img {
        width: 64px;
        height: 64px;
        display: block;
        margin: auto;
    }

    .lead-page-content .tips-1 img:first-child {
        transform: rotate(0deg);
    }

    .lead-page-content .tips-1 img:last-child {
        transform: rotate(0deg);
        width: 342px;
        height: auto;
    }

    .lead-page-content .tips-1 span {
        font-size: 19px;
        line-height: 28px;
        color: #FFF;
        visibility: visible;
        font-weight: 600;
        margin-top: 123px;
    }

    .lead-page-content .tips-2 {
        display: inline-flex;
        flex: 1;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        margin: 111px 85px 0;
    }

    .lead-page-content .tips-2 img {
        transform: rotate(-43deg);
        width: 170px;
        height: auto;
        margin: 30px 20px 55px 0;
    }

    .lead-page-content .tips-2 button {
        width: 100px;
        height: 43px;
    }

    .lead-page-content .tips-2 p {
        padding: 0 30% 0 15%;
        margin: 50px 0;
        color: #FFF;
        font-size: 22px;
        line-height: 32px;
        font-weight: 600;
    }

    .lead-page-content .tips-2 .set {
        width: 100px;
        height: 43px;
        font-size: 14px;
        background: #f7832f;
        border-color: #f7832f;
    }

    .lead-page-content .tips-2 .help {
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