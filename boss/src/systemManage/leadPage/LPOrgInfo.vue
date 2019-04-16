<template>
    <div class="lead-page-content">
        <Row>
            <Form ref="form" :label-width="80">
                <i-col span="8" style="margin-top: 15px;">
                    <header class="org-header">
                        <span>组织信息</span>
                    </header>
                    <br/>
                    <Form-item label="" prop="name">
                        <Input placeholder=""/>
                    </Form-item>
                    <Form-item label="" prop="code">
                        <Input placeholder="" />
                    </Form-item>
                    <Form-item label="" prop="orgtype_id">
                        <Select></Select>
                    </form-item>
                    <Form-item label="" prop="areaId">
                        <Select></Select>
                    </Form-item>
                    <Form-item label="联系电话" prop="phone" class="show-item">
                        <Input placeholder="请输入联系方式" :maxlength="11" :readonly="true"/>
                    </Form-item>
                    <Form-item label="" prop="weiXinNo">
                        <Input placeholder="" :maxlength="50"></Input>
                    </Form-item>
                    <Form-item label="签约主体" prop="signSubject" class="show-item" style="width: 160px;">
                        <i-switch :value="true" :disabled="true">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                    </form-item>
                    <Form-item label="" prop="describe">
                        <Input type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="请输入..."/>
                    </Form-item>

                    <div class="tips-1">
                        <p>1、填写联系方式，让客户更快的找到您！</p>
                        <Row class="operate-div">
                            <i-col span="24">
                                <i-col span="6" offset="11">
                                    <Button type="ghost" class="help" @click="toHelp">详情介绍</Button>
                                </i-col>
                                <i-col span="6" offset="1">
                                    <Button type="primary" class="set" @click="toSet">立即设置</Button>
                                </i-col>
                            </i-col>
                            <i-col span="18">
                                <img src="./image/LPOrgInfo-1.png">
                            </i-col>
                        </Row>
                    </div>

                    <div class="tips-2">
                        <img src="./image/LPOrgInfo-1.png" style="position: absolute;top: -80px;transform: rotate(255deg);">
                        <p style="font-family: 'Microsoft YaHei';">2、需要设置本机构为“签约主体”时，请点击“签约主体—>是”，并设置开户行名称等</p>
                    </div>
                </i-col>
                <i-col span="15" offset="1" class="show-item">
                    <OrgSubjectCard ref="orgSubjectCard" :orgId="null" :orgInfo="{supportMobileSign: true}"></OrgSubjectCard>
                    <div style="position: absolute;top: 0;bottom: 0;left: 0;right: 0;"></div>
                </i-col>
                <i-col span="24">
                    <FormItem>
                        <Button type="primary">保存</Button>
                    </FormItem>
                </i-col>
            </Form>
        </Row>
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
                window.open('#/FQ?pageCode=F0504');
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

    .lead-page-content >>> .ivu-input:hover, .lead-page-content >>> .ivu-input:focus {
        border-color: #dddee1;
        cursor: initial!important;
    }

    .lead-page-content >>> .ivu-switch {
        cursor: initial!important;
    }

    .lead-page-content >>> .ivu-form-item {
        padding: 12px 0;
        margin: -2.5px 0 0;
    }

    .lead-page-content .show-item {
        visibility: visible;
        background: #FFF;
    }

    .lead-page-content .show-item * {
        visibility: visible;
    }

    .org-header:before {
        content: "";
        display: block;
        width: 100%;
        height: 1px;
        background: #eee;
        position: absolute;
        top: 10px;
        left: 0;
    }

    .org-header span {
        display: inline-block;
        background: #fff;
        padding: 0 5px 0 18px;
        position: relative;
        margin-left: 30px;
        font-size: 14px;
    }

    .ivu-switch-checked {
        border-color: #59b399;
        background-color: #59b399;
    }

    .lead-page-content .tips-1 {
        position: absolute;
        width: 423px;
        height: 99px;
        border-radius: 100%;
        display: block;
        visibility: visible;
        left: 50%;
        top: 30px;
        margin-left: -212.5px;
        text-align: center;
        padding: 23px 0;
    }

    .lead-page-content .tips-1 p {
        visibility: visible;
        font-size: 18px;
        color: #ffffff;
        line-height: 26px;
    }

    .lead-page-content .operate-div {
        visibility: visible;
        margin-top: 50px;
    }

    .lead-page-content .operate-div *, .lead-page-content .tips-2 * {
        visibility: visible;
    }

    .lead-page-content .operate-div >>> .ivu-col-span-24:first-child {
        position: absolute;
        margin-left: 45px;
        z-index: 2;
    }

    .lead-page-content .operate-div img {
        display: block;
        margin: auto;
    }

    .lead-page-content .operate-div .set {
        width: 100px;
        height: 43px;
        font-size: 14px;
        background: #f7832f;
        border-color: #f7832f;
    }

    .lead-page-content .operate-div .help {
        width: 100px;
        height: 43px;
        font-size: 14px;
        color: #FFF;
        border: 0;
        border-radius: 0;
        border-bottom: 2px solid #FFF;
    }

    .lead-page-content .tips-2 {
        position: absolute;
        width: 450px;
        height: 120px;
        border-radius: 100%;
        display: block;
        visibility: visible;
        left: 50%;
        bottom: 0;
        margin-left: -173px;
        text-align: center;
        padding: 10px 40px;
        z-index: 2;
    }

    .lead-page-content .tips-2 p {
        font-size: 18px;
        color: #ffffff;
        line-height: 26px;
    }

    .lead-page-content .tips-2 .arrow-span {
        position: absolute;
        display: flex;
        align-items: center;
        left: 130px;
        transform: rotate(-13deg);
        top: -60px;
    }

    .lead-page-content .tips-2 .arrow-span p {
        display: inline-block;
        width: 300px;
        border-top: 3px solid;
    }

    .lead-page-content .tips-2 .arrow-span span {
        font-family: "Microsoft YaHei";
        font-size: 36px;
        color: #FFF;
        font-weight: 600;
        height: 24px;
        line-height: 24px;
        margin-left: -17px;
        margin-bottom: 6px;
        display: inline-block;
    }
    .orange {
        background: #f7832f;
        border-color: #f7832f;
    }
</style>