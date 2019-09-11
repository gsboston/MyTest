<template>
    <div>
        this is page A
    </div>
</template>

<script>
    export default {
        beforeRouteEnter (to, from, next) {
            // 在渲染该组件路由被confirm前调用
            // 无法获取组件实例this
            // 守卫调用时，组件未被创建
            // ...
            // console.log('before router enter')
            console.log(this,'enter');
            next()
        },
        beforeRouteUpdate(to, from, next){
            // 在当前路由改变，但是该组件被复用时调用
            // 如/foo/:id  /foo/1 => /foo/2 之间跳转时
            // 由于会渲染相同的组件，组件实例会被复用，这个钩子就会被调用
            // 可以访问组件实例this
            // console.log('before router update')
            console.log(this,'update');
            next()
        },
        beforeRouteLeave (to, from, next) {
            // 导航离开该组件的对应路由时调用，可以访问组件实例
            // 通常用来禁止用户还未保存修改就突然离开，可以通过next(false)阻止
            // ...
            // console.log('before router leave')
            console.log(this,'leave');
            next()
        }
    }
</script>

<style scoped>

</style>