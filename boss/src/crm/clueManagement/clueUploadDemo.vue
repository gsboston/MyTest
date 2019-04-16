<template>
    <div>
        <div>clueUploadDemo</div>
        <!--<form enctype="multipart/form-data" id="form">-->
            <input type="file" name="uploadFile" id="uploadFile" />
        <!--</form>-->
        <Button @click="upload">上传</Button>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        data() {
            return {
                gatewayHost: null
            }
        },
        created() {
            this.getGatewayHost();
        },
        methods: {
            async upload() {
                if (!this.gatewayHost) {
                    await this.getGatewayHost();
                }
                let formData = new FormData();

                formData.append('uploadFile', document.querySelector('#uploadFile').files[0]);

                axios({
                    method: 'post',
                    url: `http://${this.gatewayHost}/crm-api/excel/importCompanyOpportunityOssByParam`,
                    headers: {
                        token: this.$context.getToken()
                    },
                    data: formData,
                    params: {
                        userId: '930690320951750657',
                        realName: '王小兰4',
                        orgId: '918012303725584385',
                        orgName: '宝盛广场店',
                        phone: '18792145066',
                    }
                }).then(data => {
                    console.log(data);
                });
            },
            getGatewayHost() {
                this.request({
                    url: '/crm/clueManagement/gatewayHost.do'
                }).then(gatewayHost => {
                    this.gatewayHost = gatewayHost;
                })
            }
        }
    }
</script>

<style scoped>

</style>