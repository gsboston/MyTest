<style scoped>
    .container {
        position: relative;
        width: 100%;
        height: 100%;
    }
    .left {
        position: fixed;
        top: 65px;
        left: 15px;
        width: 150px;
        padding: 15px 7px 7px 7px;
        box-shadow: 0 0 5px rgba(100, 100, 100, .5);
    }
    .left > h2 {
        margin-bottom: 15px;
    }
    .left > a {
        display: block;
        margin-top: 3px;
        padding: 3px 7px;
        font-size: 16px;
        font-weight: bold;
        border-radius: 3px;
    }
    .left > a:hover {
        background: rgba(0, 0, 0, .1);
    }
    .left > a.active {
        background: rgba(0, 0, 0, .3);
        color: white;

    }
    .frame {
        width: 100%;
        height: 100%;
    }
</style>

<template>
    <div class="container">
        <div class="left">
            <h2>模块列表</h2>
            <a href="javascript:void(0)" v-for="(item, index) in items" :class="{active: selectedItem == item}" @click="jump(item)">{{itemNames[index]}}</a>
        </div>
        <iframe class="frame" ref="frame" frameborder="0"></iframe>
    </div>
</template>

<script type="text/javascript">
    export default {
        data () {
            return {
                items: ["crm-api", "sign-api", "portal-api", "serve-api", "oss-api"],
                itemNames: ["营销管理模块", "签约管理模块", "系统配置模块", "服务管理模块", "附件管理模块"],
                selectedItem: null
            }
        },
        mounted () {
            this.jump("portal-api");
        },
        methods: {
            jump (item) {
                this.selectedItem = item;
                this.$refs.frame.src = location.origin + "/" + item + "/swagger-ui.html";
                // this.request({
                //     url: "/system/swagger/getApiUrl.do",
                //     param: {
                //         code: item
                //     }
                // }).then(url => {
                //     this.$refs.frame.src = url;
                // });
            }
        }
    };
</script>