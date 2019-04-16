<template>
    <div>
        <eyeSearchMap v-show="isShowMap" :searchObj="searchObj" @condition="condition"></eyeSearchMap>
        <eyeSearchResult v-if="!isShowMap" :searchCondition="searchCondition" @toMap="toMap"></eyeSearchResult>
    </div>
</template>

<script>
    import eyeSearchMap from './eyeSearchMap.vue';
    import eyeSearchResult from './eyeSearchResult.vue';

    export default {
        props: {
            searchObj: null
        },
        data () {
            return {
                isShowMap: true,
                searchCondition: null
            }
        },
        methods: {
            condition (condition) {
                this.searchCondition = condition;
                this.isShowMap = false;
            },
            toMap () {
                this.isShowMap = true;
            }
        },
        components: {
            eyeSearchMap,
            eyeSearchResult
        }
    };
</script>

<style scoped>

</style>