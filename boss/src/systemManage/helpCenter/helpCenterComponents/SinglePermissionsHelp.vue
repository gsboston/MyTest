<template>
    <div class="main-info">
        <h1>接单权限管理</h1>

        <h2>1、什么是接单权限</h2>
        <div class="content">
            <p>接单岗位主要对本组织所有接收到的服务单进行指派，组织可选择“接单”并分配给服务负责人，也可选择“拒单”。 </p>
            <p>接单权限主要由组织管理员对账号进行分配，具有接单权限的账号才可对组织收到的服务单进行“接单”、“拒单”。</p>
            <p>接单权限可选择“开启”或“关闭”，开启时，仅接单权限列表中人员可进行接单，关闭时，所有岗位人员类型为“服务接单岗”的均可接单。</p>
        </div>

        <h2>2、派单权限管理</h2>
        <div class="content">
            <p>进入“菜单—&gt;接单权限管理“。接单权限管理分为三部分：</p>
            <p>1、接单岗位设置：点击“左侧”新增按钮，弹出新增界面，输入“编码”及“接单岗位名称”，“编码”可自行设置，例如“001”、“002”等；“接单岗位名称”主要描述该岗位用于何种类型服务单接单，例如“工商注册”、“代理记账”等。点击“保存”，接单岗位新增成功。</p>
            <Row class="img-div">
                <i-col span="24">
                    <img src="./image/SinglePermissions-1.png">
                </i-col>
            </Row>
            <p>2、岗位人员设置：选中已设置好的某岗位名称，点击“选择人员”，弹出操作界面，待选列表会列出该组织所有可选择的组织成员，选中需要选择的人员，点击“&gt;"添加</p>
            <p>箭头，待选人员进入已选列表，点击”保存“，设置成功。</p>
            <Row class="img-div">
                <i-col span="24">
                    <img src="./image/SinglePermissions-2.png">
                </i-col>
                <i-col span="24">
                    <img src="./image/SinglePermissions-3.png">
                </i-col>
            </Row>
            <p>3、可接服务单设置：</p>
            <p>点击“选择服务单”，弹出选择可派合约界面，列表会列出所有可选择的服务单，选中需要添加的服务单类型，点击“&gt;"添加</p>
            <p>箭头，所选服务单进入已选列表，点击”保存“，设置成功。</p>
            <Row class="img-div">
                <i-col span="24">
                    <img src="./image/SinglePermissions-4.png">
                </i-col>
                <i-col span="24">
                    <img src="./image/SinglePermissions-5.png">
                </i-col>
            </Row>

            <p>4、接单权限开关开启：</p>
            <p>        以上步骤设置完毕后，进入“菜单—&gt;组织信息设置”，“接单权限”开关默认为关闭，此时所有岗位人员类型为“服务接单岗”的均可接单；点击为”开启“后，接单权限功能生效，即仅接单权限列表中人员可进行接单。</p>
            <Row class="img-div">
                <i-col span="24">
                    <img src="./image/SinglePermissions-6.png">
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