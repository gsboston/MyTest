<template>
    <div class="main-info">
        <h1>服务岗位设置</h1>

        <h2>1、什么是服务岗位</h2>
        <div class="content">
            <p>服务岗位即主要对服务单进行服务的人员，在”组织管理设置“中可添加”服务人员岗“，并且在”服务岗位设置“中可将具体类型的服务单关联至相关具有服务能力的人员，在对不同类型服务单进行分配时，可直接选择该类型服务人员进行服务。</p>
        </div>

        <h2>2、服务岗位设置</h2>
        <div class="content">
            <p>进入“菜单—&gt;服务岗位设置“。服务岗位设置分为两部分：</p>
            <p>1、服务岗位设置：</p>
            <p>       选中左侧需要设置的服务单类型，点击服务岗位设置下方”新增“，弹出“新增服务岗位”界面，输入“服务岗位名称”，名称可自行定义，输入“服务说明”，服务说明可简单对服务岗位进行描述，勾选“能否派工”，该岗位即具有该类型服务单的派工权限，如果派单人员将服务单派给服务负责人时，则该服务单需要由具有派工权限的人员分配至具体服务人员 。</p>
            <p>点击“保存”，服务岗位新增成功。</p>
            <Row class="img-div">
                <i-col span="24">
                    <img src="./image/ServicePost-1.png">
                </i-col>
            </Row>
            <p>2、设置岗位人员：</p>
            <p>       选中已设置好的某服务岗位，点击“选择人员”，弹出操作界面，待选列表列出该组织所有可选择的组织成员，选中需要选择的人员，点击“&gt;"添加</p>
            <p>箭头，待选人员进入已选列表，点击”保存“，设置成功。</p>
            <Row class="img-div">
                <i-col span="24">
                    <img src="./image/ServicePost-2.png">
                </i-col>
                <i-col span="24">
                    <img src="./image/ServicePost-3.png">
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