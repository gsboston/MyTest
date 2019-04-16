<template>
    <div class="main-info">
        <h1>服务商管理</h1>

        <h2>1、什么是服务商</h2>
        <div class="content">
            <p>       除本组织以外具有服务能力的组织均称为服务商，服务商可以为易桥体系内的其他组织，也可为体系外的服务机构；</p>
            <p>本组织对某类型服务单无服务能力时，可将服务单外包到“服务商”组织，需提前将服务单与“服务商”进行关联，关联后即可将该类型服务单指派给服务商服务。</p>
        </div>

        <h2>2、服务商管理</h2>
        <div class="content">
            <p>进入“菜单—&gt;服务商管理“。</p>
            <p>       选中左侧需要设置的服务单类型，点击右侧”新增“，弹出“新增服务商”界面：</p>
            <p>优先级：优先级可自行定义，例如”1“、“2”、“3”等，数字最小的服务商显示。</p>
            <p>服务商类型：可选择“内部组织”或“外部服务商”，内部组织即易桥组织体系内所有组织，外部服务商即与易桥合作的所有外部服务机构。</p>
            <p>服务商名称：根据选择的服务商类型选择具体的服务商。</p>
            <p>结算价：即该类型的服务单交由服务商进行服务时，需要支付给服务商的服务费用，费用可自行设置。</p>
            <p>是否允许查看客户信息：勾选后，服务商可查看到客户姓名以及联系方式。</p>
            <br>
            <p>点击“保存”，该服务单成功关联服务商；在分配此类型服务单时，可指派至已设置的外部服务商。</p>
            <Row class="img-div">
                <i-col span="24">
                    <img src="./image/ServiceProvider-1.png">
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