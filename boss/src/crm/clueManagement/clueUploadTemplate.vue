<template>
    <a :href="href" class="add-template-btn" :title="text">
        <img src="../../image/Excel.png" :alt="text">
        {{ text }}
    </a>
</template>

<script>
    export default {
        data() {
            return {
                href: '/static/clueUpload/upload.xlsx',
                text: '批量添加模板'
            }
        },
        created() {
            this.getLink();
        },
        methods: {
            getEnv() {
                return this.request({
                    url: "/portal/getEnv.do"
                });
            },
            async getLink() {
                let envObj = await this.getEnv();

                if (envObj.env === 'DEVELOPMENT') {
                    this.href = '/clueUpload/upload.xlsx';
                }
            }
        }
    }
</script>

<style scoped>
    .add-template-btn {
        display: inline-block;
        position: relative;
        margin-right: 10px;
        color: #333;
    }

    .add-template-btn:hover {
        text-decoration: underline;
    }

    .add-template-btn img {
        width: 30px;
        vertical-align: middle;
    }
</style>