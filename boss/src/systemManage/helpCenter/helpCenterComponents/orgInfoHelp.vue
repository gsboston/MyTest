<template>
    <div class="main-info">
        <h1>组织信息</h1>

        <h2>1、什么是组织信息</h2>
        <div class="content">
            <p>组织信息即该组织的基本信息，组织管理员首次登录“神州顺利办云管家”系统时，可在“组织信息”中查看到该组织的基本信息，并可设置本组织是否为签约主体。</p>
        </div>

        <h2>2、修改组织信息</h2>
        <div class="content">
            <p>可进入“全部菜单-&gt;组织信息设置-”中设置组织相关信息。</p>
            <p>什么是签约主体？签约主体即与客户签订合同时的合同乙方。如需将本组织设置为签约主体，可在“组织信息页”将“签约主体”设置为“是”，并完善右侧“签约主体信息”。</p>

            <Row class="img-div">
                <i-col span="24">
                    <img src="./image/orgInfo-1.png">
                </i-col>
                <i-col span="24">
                    <img src="./image/orgInfo-2.png">
                </i-col>
            </Row>

            <p>签约主体信息：</p>
            <p>开户行名称：必填，本组织的对公开户银行名称。</p>
            <p>银行账号：必填，本组织的对公银行账号。</p>
            <p>电子邮箱：必填，本组织的公司联系邮箱。</p>
            <p>联系地址：必填，本组织的联系地址。</p>
            <p>负责人姓名：选填，本组织的负责人姓名。</p>
            <p>负责人电话：选填，本组织的负责人电话。</p>
            <p>纳税人识别号：必填，本组织的纳税人识别号。</p>
            <br>
            <p>另外系统同时提供线上收款功能，只需将”微信支付配置“及”支付宝支付配置“内容完善，系统会根据配置好的信息生成收款码，组织在与客户签订合同并收款时，可在收款界面选择”微信收款“或”支付宝收款“。</p>
            <br>
            <p>微信支付配置：</p>
            <p>AppID：进入微信公众平台服务号后台，点击左侧菜单“开发者中心”，即可看到AppID的值。</p>
            <p>AppSecret：进入微信公众平台服务号后台，点击左侧菜单“开发者中心”，即可看到AppSecret的值。</p>
            <p>mchid：进入微信公众平台服务号后台，点击左侧菜单“微信支付---&gt;商户信息”，就可以看到微信支付商户号mchid的值。</p>
            <p>key：进入微信公众平台服务号后台，点击左侧菜单“账户设置--&gt;API安全”，点击“设置密钥”，可以看到密钥内容，该密钥即“支付Key”。</p>
            <br>
            <p>支付宝支付配置：</p>
            <p>AppID：进入支付宝商户后台，点击导航栏中“商家服务”，点击“查询PID、key”，即可查看支付宝商户ID。</p>
            <p>mchid：即收款方的支付宝账号。</p>
            <p>key：进入支付宝商户后台，点击导航栏中“商家服务”，点击“查询PID、key”，即可看到安全校验码key。</p>
            <p>以上信息设置好后，点击“保存”保存成功。</p>
        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        data () {
            return {

            }
        },
        created: function () {

        },
        methods: {
            changeView() {

            }
        }
    };
</script>

<style scoped>
    .main-info {
        color: #101010;
        font-size: 14px;
        line-height: 20px;
        padding: 56px 20px 20px;
    }

    .main-info h1 {
        line-height: 26px;
        font-size: 18px;
        margin-bottom: 30px;
    }

    .main-info h2 {
        font-size: 18px;
        font-weight: normal;
        margin-bottom: 10px;
    }

    .main-info .content {
        margin-bottom: 30px;
        padding-left: 10px;
    }

    .main-info .content p {
        margin-bottom: 5px;
    }

    .main-info .img-div {
        margin: 20px 0;
    }

    .main-info .img-div img {
        margin: auto;
        display: block;
        max-width: 100%;
    }
</style>