<template>
    <iframe :src="urlPath" frameborder="0" scrolling="auto" width="100%" height="100%"></iframe>
</template>

<script>
    export default {
        data() {
            return {
                urlPath: ''
            }
        },
        created: function () {
            this.request({
                url: "/cms/getCmsUrl.do",
                param: {
                    type: 'wz'
                }
            }).then(item => {
                this.urlPath = item;
            });

        }
    }
</script>