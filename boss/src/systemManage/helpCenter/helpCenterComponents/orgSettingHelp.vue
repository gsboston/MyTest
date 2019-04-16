<template>
    <div class="main-info">
        <h1>组织管理</h1>

        <h2>1、什么是组织管理</h2>
        <div class="content">
            <p>组织管理即组织成员管理，包括两部分：</p>
            <p>1、可新增/删除组织下的部门以及部门成员， 在设置该组织所有接单、派单、服务等岗位人员之前，需要将本组织成员添加至“组织管理”中。</p>
            <p>2、可在本组织下新增/删除子组织</p>
        </div>

        <h2>2、管理组织</h2>
        <div class="content">
            <p>当本组织下存在子公司、分公司、灯塔或门店，需要加入本系统时，可新增组织；</p>
            <p>操作步骤：</p>
            <p>点击上方“维护机构”按钮，进入机构维护界面，选中当前组织，即可给本组织新增、修改、删除子组织。</p>
            <Row class="img-div">
                <i-col span="10">
                    <img src="./image/orgSetting-1.png">
                </i-col>
                <i-col span="2" offset="1" style="padding-top: 80px;">
                    <img src="./image/orgSetting-2.png">
                </i-col>
                <i-col span="10" offset="1">
                    <img src="./image/orgSetting-3.png">
                </i-col>
            </Row>
            <p>选择所属区域，输入“组织名称”，例如分公司名称、</p>
            <p>组织类型：按照组织实际类型选择即可。</p>
            <p>组织介绍：选填，主要介绍本组织情况。</p>
            <p>签约主体：即与客户签订合同时的合同乙方，如果需添加此组织为签约主体，选择”是“。</p>
            <Row class="img-div">
                <i-col span="24">
                    <img src="./image/orgSetting-4.png">
                </i-col>
            </Row>
            <p>设置签约主体：</p>
            <p>设本组织为签约主体时，需完善银行收款信息，完善后系统直接将该组织收款信息同步至合同模板中，其中标”*“号为必填项。</p>
            <p>另外系统同时提供线上收款功能，只需将”微信支付配置“及”支付宝支付配置“内容完善，系统会根据配置好的信息生成收款码，组织在与客户签订合同并收款时，可在收款界面选择”微信收款“或”支付宝收款“。</p>
            <Row class="img-div">
                <i-col span="24">
                    <img src="./image/orgSetting-5.png">
                </i-col>
                <i-col span="24">
                    <img src="./image/orgSetting-6.png">
                </i-col>
            </Row>
            <p>微信支付配置：</p>
            <p>AppID：进入微信公众平台服务号后台，点击左侧菜单“开发者中心”，即可看到AppID的值。</p>
            <p>AppSecret：选填，进入微信公众平台服务号后台，点击左侧菜单“开发者中心”，即可看到AppSecret的值。</p>
            <p>mchid：进入微信公众平台服务号后台，点击左侧菜单“微信支付---&gt;商户信息”，就可以看到微信支付商户号mchid的值。</p>
            <p>key：进入微信公众平台服务号后台，点击左侧菜单“账户设置--&gt;API安全”，点击“设置密钥”，可以看到密钥内容，该密钥即“支付Key”。</p>
            <br>
            <p>支付宝支付配置：</p>
            <p>AppID：进入支付宝商户后台，点击导航栏中“商家服务”，点击“查询PID、key”，即可查看支付宝商户ID。</p>
            <p>mchid：即收款方的支付宝账号。</p>
            <p>key：进入支付宝商户后台，点击导航栏中“商家服务”，点击“查询PID、key”，即可看到安全校验码key。</p>
            <p>以上信息设置好后，点击“保存”保存成功。</p>
        </div>

        <h2>3、管理部门</h2>
        <div class="content">
            <p>“管理部门”即对某组织下的部门进行“新增、修改、删除”操作。</p>
            <p>点击左侧“添加部门”按钮，弹出部门新增界面，输入“部门名称”及“部门描述”，部门名称可自行定义，点击“保存”，部门新增成功。</p>
            <Row class="img-div">
                <i-col span="24">
                    <img src="./image/orgSetting-7.png">
                </i-col>
                <i-col span="24">
                    <img src="./image/orgSetting-8.png">
                </i-col>
            </Row>
        </div>

        <h2>4、管理部门成员</h2>
        <div class="content">
            <p>“管理部门成员”即可对组织下的部门成员进行“新增、修改、删除”操作，并设置成员账号权限。</p>
            <br>
            <p>新增成员账号操作步骤：</p>
            <p>选中部门，点击左侧下方“新增”按钮，显示成员新增界面：</p>
            <p>账号：即部门成员用来登录系统的账号，可输入字母、数字。</p>
            <p>姓名：部门成员的真实姓名。</p>
            <p>手机号：部门成员手机号。</p>
            <p>点击“保存”，账号创建成功。</p>
            <Row class="img-div">
                <i-col span="24">
                    <img src="./image/orgSetting-13.png">
                </i-col>
                <i-col span="12" offset="6">
                    <img src="./image/orgSetting-14.png">
                </i-col>
            </Row>
            <p>点击账号后方“岗位信息”按钮，编辑岗位权限；</p>
            <p>权限级别：分为机构管理员、普通用户。若设置账号为机构管理员，则账号拥有机构管理员权限；若设置账号为普通用户，则权具有岗位信息中所勾选的权限。</p>
            <p>姓别：设置成员姓别。</p>
            <p>岗位信息：</p>
            <p>1、机构管理岗：具有该组织管理员权限，可管理本组织人员账号及账号权限；</p>
            <p>2、销售顾问岗：销售顾问主要解答客户线上咨询的问题，可查看到该岗位下所有客户跟进情况，促进客户下单。</p>
            <p>3、签约办理岗：主要进行合约信息录入及对审核通过的合同进行发票申请。</p>
            <p>4、合约审核岗：主要对录入至系统中的”待审核“合约进行审核。</p>
            <p>5、财务收款岗：主要对”已签约“状态的合同进行收款。</p>
            <p>6、解约登记岗：根据业务需要，对已签约的合同进行”合约解约“操作。</p>
            <p>7、合约变更岗：根据业务需要，对已签约的合同进行“合约变更”操作。</p>
            <p>8、销售管理岗：除具有销售顾问岗位功能，还可查看对本组织下所有销售数据。</p>
            <p>9、服务派单岗：派单岗位主要对本组织签订的合同生成的服务单进行指派，组织有服务能力时可将服务单自留，分配给本组织服务负责人；组织无服务能力时可将服务单外包到“服务商”，“服务商”需提前关联服务单。</p>
            <p>10、服务接单岗：接单岗位主要对本组织所有接收到的服务单进行指派，该岗位可选择“接单”并分配给服务负责人，也可选择“拒单”。 </p>
            <p>11、服务管理岗：将本组织所有接收到的服务单进行指派，指派至相关服务人员，也对服务单进行“拒单”，并可实时查看各服务单服务进度。</p>
            <p>岗位信息可多选。</p>
            <p>12、服务人员岗：服务岗位人员主要对服务单进行服务，可将服务单关联至组织具有服务能力的人员，对服务单进行分配时，可选择该服务人员进行服务。</p>
            <br>
            <p>设置完后，点击“保存”，账号创建成功，账号初始密码均为”123456“，为保证账户安全，建议用户登录后立即修改密码。</p>
            <Row class="img-div">
                <i-col span="12" offset="6">
                    <img src="./image/orgSetting-12.png">
                </i-col>
            </Row>
            <p>修改、删除及停用：</p>
            <p>管理员需要修改、删除或停用账号时，需选中需要操作的账号，点击上方相应操作按钮即可。</p>
            <p>账号停用后，可再次启用，停用期间不可登录使用。</p>
            <Row class="img-div">
                <i-col span="24">
                    <img src="./image/orgSetting-11.png">
                </i-col>
            </Row>
            <p>重置密码：</p>
            <p>账号使用人密码忘记需要重置密码时，可选中需要操作的账号，并点击”重置密码“按钮，密码统一重置为”123456“。</p>
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