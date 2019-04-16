<template>
    <div style="padding: 15px;">
        <h1>系统管理-首页</h1>
        <Button @click="openCard">弹出卡片</Button>
        <Button @click="openPrompt">弹出弹框</Button>
    </div>
</template>

<script>
    export default {
        props: {},
        data () {
            return {
            }
        },
        created () {
//            this.openCard();
        },
        methods: {
            openCard () {
                this.card({
                    code: "F0501",
                    title: "卡片页"
                });
            },
            openPrompt () {
                this.prompt({
                    code: "F0501",
                    title: "卡片页",
                    height: '100%',
                    bottom: 150,
                });
            }
        }
    };
</script>

<style scoped>
    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>