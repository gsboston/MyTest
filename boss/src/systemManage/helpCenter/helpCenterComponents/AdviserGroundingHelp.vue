<template>
    <div class="main-info">
        <h1>顾问上架管理</h1>

        <h2>1、什么是顾问上架</h2>
        <div class="content">
            <p>顾问上架即将本组织成员上架后，顾问可展示在“顺利办客户端”前台，用户可搜索并且查看到该顾问，可对顾问发起在线咨询。</p>
        </div>

        <h2>2、顾问上架管理</h2>
        <div class="content">
            <p>使用此功能前，确保本组织已由系统管理员设置为“上架”状态，否则无法上架顾问，有疑问可联系平台运营人员。</p>
            <br>
            <p>进入“菜单—&gt;顾问上架管理”，选中左侧需要操作的顾问名称，并完善右侧顾问信息，点击“上架”，顾问上架成功。</p>
            <p>服务类型：必填，服务类型即顾问可解答的问题类型。</p>
            <p>擅长领域：选填，可描述该顾问的擅长领域，给用户提供发起咨询前的参考。</p>
            <Row class="img-div">
                <i-col span="24">
                    <img src="./image/AdviserGrounding-1.png">
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