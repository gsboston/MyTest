<template>
    <div class="mainSearcher">
        <Row :gutter="16">
            <i-col span="8">
                <Select v-model="oneModel" placeholder="请选择" @on-change="changeValue('2', $event)" >
                    <Option v-for="item in oneLevel" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </i-col>
            <i-col span="8">
                <Select v-model="twoModel" placeholder="请选择" @on-change="changeValue('3', $event)">
                    <Option v-for="item in twoLevel" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </i-col>
            <i-col span="8">
                <Select v-model="threeModel" placeholder="请选择" @on-change="changeAreaId">
                    <Option v-for="item in threeLevel" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </i-col>
        </Row>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                callBackAreaId: 0,
                oneLevel: [],
                oneModel: '',
                twoLevel: [],
                twoModel: '',
                threeLevel: [],
                threeModel: ''
            }
        },
        props: {
            areaId: null,
            orgId: null
        },
        watch: {
            areaId(value) {
                this.areaId = value;
                if (!value) {
                    this.oneModel = '';
                    this.twoModel = '';
                    this.threeModel = '';
                }
                this.callBackAreaId = value;
                this.checkAreaLevel();
            }
        },
        methods: {
            getAreaDataByCode (level, code) {
                this.request({
                    url: "/systemManage/bd/getAreaDataByCode.do",
                    param: {
                        code: code
                    }
                }).then(items => {
                    if (level == '1') {
                        this.twoLevel = [];
                        this.threeLevel = [];
                        this.oneLevel = items;
                    }else if (level == '2') {
                        this.threeLevel = [];
                        this.twoLevel = items;
                    }else {
                        this.threeLevel = items;
                    }
                });
            },
            changeValue (level, event) {
                if (!event.constructor){
                    return;
                }
                this.$emit('change', level);
                if (level != '1' && arguments[1] == ''){
                    return;
                }else {
                    this.callBackAreaId = arguments[1];
                    this.getAreaDataByCode(level, arguments[1]);
                    this.$emit('on-select', { areaId: this.callBackAreaId, oneModel:this.oneModel,twoModel:this.twoModel,threeModel:this.threeModel});
                }
            },
            changeAreaId (value) {
                this.callBackAreaId = value;
                this.$emit('on-select', { areaId: this.callBackAreaId , oneModel:this.oneModel,twoModel:this.twoModel,threeModel:this.threeModel});
            },
            checkAreaLevel() {
                if (this.areaId && this.orgId) {
                    this.request({
                        url: "/systemManage/bd/getOrgArea.do",
                        param: {
                            areaId: this.areaId,
                            orgId: this.orgId
                        }
                    }).then(items => {
                        if(null!==items){
                            if (items.level >= 1){
                                this.oneModel = items.code[1];
                            }
                            if (items.level >= 2){
                                this.twoModel = items.code[2];
                            }
                            if (items.level >= 3){
                                this.threeModel = items.code[3];
                            }
                        }

                    });
                }
            }
        },
        created: function(){
            this.getAreaDataByCode('1', '');
        }
    }
</script>

<style scoped>
    .mainSearcher {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        width: 100%;
    }

    .mainSearcher .ivu-select >>> .ivu-select-dropdown {
        top: initial!important;
        bottom: initial!important;
        left: initial!important;
        right: initial!important;
    }
</style>