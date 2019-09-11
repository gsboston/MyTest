<template>
    <form>
        <slot></slot>
    </form>
</template>

<script>
    export default {
        // 任意子集都可以访问from上的属性
        provide(){
            return {
                myForm: this
            }
        },
        props:{
            model:{
                type:Object,
                required:true
            },
            rules:{
                type:Object
            }
        }
    }
</script>

<style scoped>

</style>