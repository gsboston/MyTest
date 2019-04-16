<template>
    <div class="main-info">
        <h1>派单权限管理</h1>

        <h2>1、什么是派单权限</h2>
        <div class="content">
            <p>派单岗位主要对本组织签订的合同生成的服务单进行指派，组织有服务能力时可将服务单自留，分配给本组织服务负责人；</p>
            <p>组织无服务能力时可将服务单外包到“服务商”，“服务商”需提前关联服务单</p>
            <p>派单权限可选择“开启”或“关闭”，开启时，仅派单权限列表中人员可进行派单，关闭时，所有岗位人员类型为“派单人员”的均可派单。</p>
        </div>

        <h2>2、派单权限管理</h2>
        <div class="content">
            <p>进入“菜单—&gt;派单权限管理“。接单权限管理分为四部分：</p>
            <p>1、派单岗位设置：点击“左侧”新增按钮，弹出新增界面，输入“编码”及“派单岗位名称”，“编码”可自行设置，例如“001”、“002”等；“派单岗位名称”主要描述该岗位用于何种类型服务单派单，例如“工商注册”、“代理记账”等。点击“保存”，派单岗位新增成功。</p>
            <Row class="img-div">
                <i-col span="24">
                    <img src="./image/ServiceSendPermission-1.png">
                </i-col>
            </Row>
            <p>2、岗位人员设置：选中已设置好的某岗位名称，点击“选择人员”，弹出操作界面，待选列表会列出该组织所有可选择的组织成员，选中需要选择的人员，点击“&gt;"添加</p>
            <p>箭头，待选人员进入已选列表，点击”保存“，设置成功。</p>
            <Row class="img-div">
                <i-col span="24">
                    <img src="./image/ServiceSendPermission-2.png">
                </i-col>
                <i-col span="24">
                    <img src="./image/ServiceSendPermission-3.png">
                </i-col>
            </Row>
            <p>3、可派合约设置：</p>
            <p>点击“选择合约”，弹出选择可派合约界面，列表会列出所有可选择的合约类型，选中需要添加的合约类型，点击“&gt;"添加</p>
            <p>箭头，所选合约类型进入已选列表，点击”保存“，设置成功。</p>
            <Row class="img-div">
                <i-col span="24">
                    <img src="./image/ServiceSendPermission-4.png">
                </i-col>
                <i-col span="24">
                    <img src="./image/ServiceSendPermission-5.png">
                </i-col>
            </Row>
            <p>4、派单权限开关开启：</p>
            <p>以上步骤设置完毕后，进入“菜单—&gt;组织信息设置”，“派单权限”开关默认为关闭，此时所有岗位人员类型为“服务派单岗”的均可派单；点击为”开启“后，派单权限功能生效，即仅派单权限列表中人员可进行派单。</p>
            <Row class="img-div">
                <i-col span="24">
                    <img src="./image/ServiceSendPermission-6.png">
                </i-col>
            </Row>
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