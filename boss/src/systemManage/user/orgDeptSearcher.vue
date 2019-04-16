<template>
    <div class="container" @mouseenter="treeShow" @mouseleave="treeHide">
        <div @click="treeShow" class="treeBtnstyle">{{selectedOrg}} - {{selectedDept}}</div>
        <div class="treeShowstyle" :class="{isShow: isShow}">
            <Row style="margin:10px 0 0 0">
                <span @click="allClick" class="orgnormal" :class="{ orgactive: isActive }">全部组织</span>
            </Row>
            <Tree :data="baseData" ref="tree" @on-select-change="selectionUser"></Tree>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                selectedOrg: '组织名称',
                selectedDept: '部门名称',
                baseData: [],
                treeVal: null,
                isActive: true,
                isShow: false,
                orgId: 0,
                deptId: 0,
            }
        },
        methods: {
            selectionUser (selection) {
                this.isActive = false;
                this.isShow = false;
                if (selection.length > 0) {
                    if (selection[0].children) {
                        this.orgId = selection[0].id;  //组织id
                        this.deptId = 0;
                        this.selectedOrg = selection[0].title;
                        this.selectedDept = '部门名称';
                    } else {
                        this.deptId = selection[0].id;  //部门id
                        this.orgId = selection[0].orgId;
                        this.selectedDept = selection[0].title;
                        this.selectedOrg = selection[0].parent_name;
                    }

                    this.selecteditems = selection[0];
                    this.$emit("on-select", {orgId: this.orgId, deptId: this.deptId});
                } else {
                    this.selecteditems = null;
                }

            },
            allClick(){
                this.isActive = true;
                this.isShow = false;
                this.selectedOrg = '组织名称';
                this.selectedDept = '部门名称';
                if (this.selecteditems) {
                    this.selecteditems.selected = false;
                    this.selecteditems = null;
                }
                this.$emit("on-select", {orgId: 0, deptId: 0});

            },
            treeShow(){
                this.isShow = true;
            },
            treeHide(){
                this.isShow = false;
            }
//             treeShow(){
//                 this.isShow = !this.isShow;
//             }
        },
        created: function () {
            this.request({
                url: "/systemManage/user/searchTreeUser.do"
            }).then(items => {
                this.baseData = items;

            })
        }

    }
</script>
<style scoped>
    .container {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        width: auto;
        float: left;
    }

    .treeBtnstyle {
        width: 285px;
        height: 32px;
        line-height: 32px;
        border: solid 1px #ccc;
        border-radius: 4px;
        margin-right: 11px;
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
        width: 285px;
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