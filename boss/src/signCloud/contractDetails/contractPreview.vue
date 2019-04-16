<template>
    <div>
        <!--<iframe src="/static/1.pdf"></iframe>-->
        <!--<iframe :src="src"></iframe>-->

        <!--<object :data="src" type="application/pdf">-->
            <!--<embed :src="src" type="application/pdf" />-->
        <!--</object>-->

        <object :data="src" type="application/pdf">
            <iframe :src="src"></iframe>
        </object>
    </div>
</template>

<script>
    export default {
        props: {
            id: {
                type: String,
                default: function () {
                    return '1';
                }
            }
        },
        data: function () {
            return {
                src: ''
            }
        },
        created: function () {
            this.preview();
        },
        methods: {
            preview: function () {
                this.request({
                    url: '/signCloud/contractDetails/preview.do',
                    param: {
                        id: this.id
                    }
                }).then(data => {
                    this.src = data;
                })
            }
        }
    };
</script>

<style scoped>
    object,
    iframe {
        /*position: absolute;*/
        position: fixed;
        top: 49px;
        /*top: 0;*/
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        /*height: 550px;*/
        height: 90%;
        /*height: 100%;*/
        border: none;
        /*margin-top: 49px;*/
        /*padding-bottom: 49px;*/
    }
</style>