<template>
    <div class="addClues">
        <div class="tabs-wrap" v-if="addFlag">
            <a href="javascript:;" class="item" :class="{'active': tabNameNew === 'enterpriseName'}" @click="switchTabs('enterpriseName')">
                添加企业
            </a>
            <a href="javascript:;" class="item" :class="{'active': tabNameNew === 'personalName'}" @click="switchTabs('personalName')">
                添加个人
            </a>
            <a href="javascript:;" class="item" :class="{'active': tabNameNew === 'batchAddition'}" @click="switchTabs('batchAddition')">
                批量添加
            </a>
        </div>
        <addEnterpriseClues class="addMain" v-if="tabNameNew === 'enterpriseName'" :addFlagOld="addFlag" :addFlag="addFlagNew" :clueId="clueIdNew"
                            :addType="addType" @closeClues="closeClues" @searchByName="searchByName" @refreshData="refreshData"></addEnterpriseClues>
        <addPersonalClues class="addMain" v-if="tabNameNew === 'personalName'" :addFlagOld="addFlag" :addFlag="addFlagNew" :clueId="clueIdNew"
                          :addType="addType" @closeClues="closeClues" @searchByName="searchByName" @refreshData="refreshData"></addPersonalClues>
        <batchAddition class="addMain" v-if="tabNameNew === 'batchAddition'" :addFlagOld="addFlag" :addFlag="addFlagNew" :clueId="clueIdNew" :addType="addType"
                       @closeClues="closeClues" @searchByName="searchByName" @refreshData="refreshData"></batchAddition>
    </div>
</template>

<script>
    import addEnterpriseClues from './addEnterpriseCluesNew.vue'; // 添加企业
    import addPersonalClues from './addPersonalCluesNew.vue'; // 添加个人
    import batchAddition from './batchAddition.vue'; // 批量添加
    export default {
        props: {
            addFlag: null,
            clueId: null,
            tabName: null,
            addType: null
        },
        data: function () {
            return {
                addFlagNew: '',
                clueIdNew: '',
                tabNameNew: '',
            }
        },
        created: function () {
            this.addFlagNew = this.addFlag;
            this.clueIdNew = this.clueId;
            this.tabNameNew = this.tabName;
//            this.switchTabs(name);
        },
        methods: {
            /*关闭弹窗*/
            closeClues: function () {
                this.callback('', '');
            },
            /*关闭弹窗并查找线索*/
            searchByName: function (obj) {
                this.callback(obj, '');
            },
            /*刷新线索*/
            refreshData: function () {
                this.callback('', 'refresh');
            },
            switchTabs: function (str) {
                this.addFlagNew = true;
                this.clueIdNew = null;
                this.tabNameNew = str;
            }
        },
        components: {
            addEnterpriseClues,
            addPersonalClues,
            batchAddition
        }
    };
</script>

<style scoped>
    .addClues {
        display: flex;
        flex-direction: column;
        /*margin: 0 6px 8px;*/
        height: 100%;
    }

    .tabs-wrap {
        text-align: center;
        /*box-shadow: 0 1px 3px #eee;*/
    }

    .tabs-wrap .item {
        display: inline-block;
        padding: 0 16px;
        height: 38px;
        line-height: 38px;
        font-size: 14px;
        color: #333;
    }

    .tabs-wrap .item.active {
        color: #59b399;
        border-bottom: 2px solid #59b399;
    }

    .tabs-wrap .item:hover {
        color: #47a087;
    }

    .addMain {
        flex: 1;
        overflow: auto;
    }
</style>