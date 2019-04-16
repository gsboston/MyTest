<template>
    <div class="container">
        <div ref="content"></div>
    </div>
</template>

<script type="text/babel">
    export default {
        props:{
            serviceType: null,
            contractId: null,
            signedDate: null,
            serviceInfo: null,
            isEdit: null
        },
        data: function() {
            return {
                tpl: ""
            }
        },
        watch: {
            serviceInfo: function(val) {
                this.serviceInfo = val;
                this.jumpTarget();
            },
            serviceType: function(val) {
                this.serviceType = val;
                this.jumpTarget();
            }
        },
        created:function(){
            this.jumpTarget();
        },
        mounted: function() {
            this.$api.saveServiceData = this.saveData;
        },
        methods: {
            jumpTarget:function(){
                this.renderTemplate(this.serviceType,this.contractId, this.serviceInfo, this.signedDate, this.isEdit);
            },
            renderTemplate: function(serviceType,contractId, serviceInfo, signedDate, isEdit){
                var vm = this;
                // vm.request({
                //     url:'/serviceCloud/getServiceTemplate.do?typeId='+serviceType,
                //     responseType:'text',
                //     timeout: 30000
                // }).then(function(tpl) {
                if (!String.isNullOrBlank(serviceType)) {
                    var contractContent = document.createElement('div');
                    contractContent.innerHTML = serviceType;

                    vm.$nextTick(() => {
                        if(vm.$refs.content){
                            vm.$refs.content.innerHTML = '';
                            vm.$refs.content.appendChild(contractContent);
                        }
                        var scriptEl = contractContent.getElementsByTagName('script')[0];
                        contractContent.removeChild(scriptEl);
                        var instance = eval(scriptEl.innerHTML);
                        instance.$api = vm.$api;
                        instance.init({
                            contractId: contractId,
                            contractType: serviceType,
                            serviceInfo: serviceInfo,
                            signedDate: signedDate,
                            isEdit: isEdit
                        });
                    });
                }
                // });
            },
            saveData: function(data) {
                this.$emit('on-save-contract-data', data);
            }
        }
    }
</script>

<style scoped>

</style>
