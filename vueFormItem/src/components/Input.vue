<template>
<div>
    <input :type="type" :value="inputValue" @input="inputHandler">
</div>
</template>

<script>
    export default {
        props: {
            value:{
                type:String,
                default:''
            },
            type:{
                type:String,
                default:'text'
            }
        },
        data() {
            return {// 单向数据流原则：组件内不能修改props属性
                inputValue: this.value
            }
        },
        methods: {
            inputHandler(e) {
                this.inputValue = e.target.value;
                // 通知父组件值更新
                this.$emit('input', this.inputValue)

                // 通知FormItem做校验
                this.$parent.$emit('validate', this.inputValue)
            }
        },
    }
</script>

<style scoped>

</style>