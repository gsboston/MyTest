<template>
    <div class="container" @mouseenter="treeShow" @mouseleave="treeHide">
        <div @click="treeShow" class="treeBtnstyle">{{selectedOrg}}</div>
        <div class="treeShowstyle" :class="{isShow: isShow}">
            <Tree :data="baseData" ref="tree" @on-select-change="selectionUser"></Tree>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                selectedOrg: '请选择服务商',
                baseData: [],
                isShow: false,
                orgItem: null,
            }
        },
        props: {
            orgId: null,
            orgName: null
        },
        watch: {
            orgId(val) {
                this.orgId = val;
                this.initTree();
            },
            orgName(val) {
                this.orgName = val;
                this.selectedOrg = val;
            }
        },
        methods: {
            initTree() {
                this.request({
                    url: "/systemManage/serviceProvider/searchInOrgTree.do",
                    param: {
                        orgId: this.orgId
                    }
                }).then(items => {
                    this.baseData = items;
                })
            },
            selectionUser (selection) {
                this.isShow = false;
                if (selection.length > 0) {
                    this.orgItem = selection[0];
                    this.selectedOrg = selection[0].title;
                    this.$emit("on-select", this.orgItem);
                } else {
                    this.orgItem = null;
                }

            },
            treeShow(){
                this.isShow = true;
            },
            treeHide(){
                this.isShow = false;
            }
        },
        created: function () {
            this.initTree();
        }

    }
</script>
<style scoped>
    .container {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        width: 100%;
    }

    .treeBtnstyle {
        height: 32px;
        line-height: 32px;
        border: solid 1px #ccc;
        border-radius: 4px;
        padding: 0 10px;
        cursor: pointer;
        overflow: hidden;
    }

    .orgnormal {
        cursor: pointer;
        padding: 0 4px;
        font-size: 14px;
    }

    .orgactive {
        background-color: #d5e8fc;
        display: inline-block;
        margin: 0;
        padding: 0 4px;
        border-radius: 3px;
        cursor: pointer;
        vertical-align: top;
        color: #495060;
        transition: all .2s ease-in-out;
    }

    .treeShowstyle {
        position: absolute;
        top: 31px;
        width: 100%;
        height: 0;
        background: #ffffff;
        padding: 0 0 0 13px;
        border-radius: 4px;
        overflow: hidden;
        z-index: 9999;
        transition: height .1s ease;
    }

    .treeShowstyle.isShow {
        height: 200px;
        border: solid 1px #ccc;
        overflow: auto;
    }

</style>