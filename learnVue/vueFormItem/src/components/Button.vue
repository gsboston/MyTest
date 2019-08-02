<template>
    <button @click="handleClick">开课吧button</button>
</template>

<script>
    export default {
        methods: {
            handleClick() {
                this.$emit('lalala', {msg:'hello'})
            }
        },
    }
</script>

<style scoped>

</style>