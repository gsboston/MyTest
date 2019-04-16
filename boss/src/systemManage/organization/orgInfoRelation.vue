<style scoped>
    .container {
        height: 100%;
    }
    .left {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 350px;
        border-right: solid 1px #dddee1;
        padding: 100px 5px 15px 15px;
        overflow: hidden;
    }
    .center {
        position: relative;
        margin-left: 350px;
        padding: 15px;
        height: 100%;
        overflow: auto;
    }
    #departmentList .ivu-menu li {
        width: 100%;
        margin: 0;
    }

    .org-header:before {
        content: "";
        display: block;
        width: 100%;
        height: 1px;
        background: #eee;
        position: absolute;
        top: 10px;
        left: 0;
    }

    .org-header span {
        display: inline-block;
        background: #fff;
        padding: 0 5px 0 18px;
        position: relative;
        margin-left: 30px;
        font-size: 14px;
    }

    #departmentList > .ivu-tree > .ivu-tree-children > li > .ivu-tree-title {
        font-weight: 700;
    }

    .container >>> .ivu-table-body {
        overflow: visible;
    }

    .container >>> td:last-child .ivu-table-cell {
        overflow: visible;
    }

    .container >>> .ivu-table-small th {
        height: 40px;
    }

    .org-select-panel {
        position: relative;
    }

    .org-select-panel > .org-selected {
        cursor: default;
    }

    .org-select-panel > .org-selected >>> input {
        cursor: default;
    }

    .org-select-panel > .org-maintain {

    }

    .org-select-panel > .org-selection {
        position: absolute;
        top: 32px;
        left: 0;
        width: 319px;
        max-height: 500px;
        background: white;
        border: solid 1px #dddee1;
        border-radius: 5px;
        box-shadow: 5px 5px 2px #dddee1;
        z-index: 2;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .dept-list, .post-list {
        width: 100%!important;
    }

    .dept-list.ivu-menu-vertical.ivu-menu-light:after, .post-list.ivu-menu-vertical.ivu-menu-light:after{
        display: none;
    }

    .dept-list .dept-item, .post-list .post-item {
        position: relative;
        width: 100%;
        padding: 15px 8px!important;
        line-height: 24px;
        border: 0;
        border-bottom: 1px solid #eee!important;
        height: auto!important;
    }

    .dept-list .dept-item:hover, .post-list .post-item:hover {
        background: #f3f3f3;
    }

    .dept-list .dept-item.ivu-menu-item-selected, .post-list .post-item.ivu-menu-item-selected {
        background: #eee;
    }

    .btn-add {
        margin-bottom: 10px;
    }

    .ivu-menu {
        z-index: 0;
    }

    /*引导页*/
    .lead-page {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 10;
    }

    /** 机构管理修改 -- 2018-06-12 */
    .container >>> .ivu-tabs-ink-bar {
        background-color: #59b399;
    }
    .container >>> .ivu-tabs-nav .ivu-tabs-tab-active {
        color: #59b399;
    }
    .container >>> .ivu-tabs-nav .ivu-tabs-tab:hover {
        color: #59b399;
    }
    .post-list .post-item {
        text-align: left;
    }
    .post-list .post-item span {
        float: right;
        display: inline-block;
        text-align: center;
        width: 24px;
        color: #FFF;
        margin-left: 10px;
        background-color: #59b399;
        border-radius: 50%;
    }
    .post-user-list {
        height: 600px;
        border: 1px solid #DDDDDD;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .post-user-item {
        margin-bottom: 30px;
    }
    .post-user-item>p {
        font-size: 16px;
        font-weight: 600;
        background: #DDDDDD;
        padding: 0 15px;
        line-height: 32px;
    }
    .post-user-item>div {
        padding: 10px 20px;
    }
    .post-user-item >>> .ivu-tag {
        display: flex;
        width: 100%;
        height: 50px;
        line-height: 50px;
        font-size: 14px;
    }
    .post-user-item >>> .ivu-tag span {
        flex: 1;
    }
    .post-user-item >>> .ivu-tag i {
        display: inline-flex;
        align-items: center;
        margin: 15px 0;
        padding-left: 10px;
        transform: scale(1);
        font-size: 24px;
        border-left: 1px solid #DDDDDD;
    }
    .post-user-legend-list {
        height: 570px;
        overflow: auto;
        margin: 15px 0;
    }
    .post-user-legend-list li {
        text-align: center;
        padding: 5px 0;
    }

    .post-user-legend-list li a {
        font-size: 14px;
        color: #59b399;
        font-weight: 600;
    }
    .container >>> .post-name .ivu-tooltip, .container >>> .post-name .ivu-tooltip-rel {
        width: 100%;
    }
    .container >>> .post-name .ivu-tooltip-rel {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .container >>> .post-name .ivu-tooltip-inner {
        white-space: normal;
    }
    .no-change{
        position: relative;
        width: 100%;
        height: auto;
        padding-top: 253px;
        padding-bottom: 20px;
        background: #FFF url("../../signCloud/image/no-contract.png") center 100px no-repeat;
        text-align: center;
        font-size: 16px;
    }
    .custom-btn-group {
        position: absolute;
        top: 15px;
    }
    .ivu-tree {
        height: 100%;
        overflow: auto;
    }
    .container >>> .tree-search-result {
        color: blue;
    }
</style>

<template>
    <div class="container">
        <div class="left">
            <div v-if="selectedOrg" style="height: 100%;">
                <div class="custom-btn-group">
                    <ButtonGroup>
                        <Button :disabled="!selectedOrg" @click="editOrUpdate('org', 'add')">新增</Button>
                        <Button :disabled="(!(selectedOrg && (selectedOrg ? selectedOrg.children.length == 0 : true)))" @click="removeOrg">删除</Button>
                        <Button :disabled="!selectedOrg.disabled" @click="startOrStop(1)">启用</Button>
                        <Button :disabled="selectedOrg.disabled" @click="startOrStop(0)">停用</Button>
                    </ButtonGroup>
                    <Checkbox v-model="isShowStopOrg" true-value="0" false-value="1" style="margin-left: 5px;margin-right: 0;" @on-change="getOrgSystemData">显示停用组织</Checkbox>
                    <Input v-model="searchText" placeholder="输入组织名称或组织编码进行查询" class="search" icon="search" @on-enter="getOrgSystemData" @on-click="getOrgSystemData" style="margin-top: 10px;padding-right: 5px;"/>
                </div>
                <Tree :data="orgSystemData" ref="tree" :render="renderContent" @on-select-change="selectOrg"></Tree>
            </div>
        </div>
        <div class="center">
            <!-- 组织编辑功能 -->
            <Row v-if="selectedOrg">
                <i-col span="24">
                    <OrganizationCard :id="operateOrgType == 'add' ? null : selectedOrg.id" :orgSystemData="selectedOrg" :B050201="true" :isOrg="false" :isReadonly="true" :cancelBtn="true" :isComponent="true" :isSaveOrgSystem="true" @on-cancel="cancelShowCard"></OrganizationCard>
                </i-col>
            </Row>
        </div>
    </div>
</template>

<script type="text/javascript">
    import OrganizationCard from './organizationCard.vue';
    import LPOrgSetting from '../leadPage/LPOrgSetting';

    export default {
        watch: {
            selectedOrg(val) {
                this.selectedOrg = val;
            }
        },
        data () {
            return {
                orgId: null,
                orgSystemData: [],
                selectedOrg: null,

                operateOrgType: 'update',
                isStart:'启用',

                isShowStopOrg: 1,
                searchText: '',
            }
        },
        created: function () {
            this.getOrgSystemData();
        },
        methods: {
            /** 数据获取函数 -- Data */
            getOrgSystemData (defaultShowNode) {
                this.request({
                    url: `/systemManage/orgInfoManage/getCurOrgSysTree.do`,
                    param: {
                        defaultOrgId: defaultShowNode ? defaultShowNode.id : null,
                        startUp: this.isShowStopOrg,
                        searchText: this.searchText,
                    }
                }).then(data => {
                    if (data) {
                        if (!defaultShowNode && data.length > 0) {
                            data[0].selected = true;
                            this.selectedOrg = data[0];
                        }
                        this.orgSystemData = data;
                    }else {
                        this.orgSystemData = [];
                    }
                });
            },
            /** 组件操作函数 -- Event */
            selectOrg (selection) {
                if(selection.length > 0) {
                    let item = selection[0];
                    this.selectedOrg.selected = false;
                    item.selected = true;
                    this.selectedOrg = item;
                    this.operateOrgType = 'update';
                }else {
                    this.orgSystemData[0].selected = true;
                    this.selectedOrg = this.orgSystemData[0];
                }
            },
            editOrUpdate (cardType, operateType, item) {
                if (cardType == 'org') {
                    this.operateOrgType = operateType;
                }
            },
            cancelShowCard(type) {
                if (type == 'org') {
                    this.getOrgSystemData(this.selectedOrg);
                }
            },
            /** 删除方法 */
            removeOrg () {
                //删除组织
                this.$Modal.confirm({
                    content: '确定删除吗?',
                    onOk: () => {
                        this.request({
                            url: "/systemManage/orgRelation/delete.do",
                            param: {
                                id: this.selectedOrg.id,
                            }
                        }).then(() => {
                            this.$Message.success('删除成功');
                            this.getOrgSystemData();
                        });
                    }
                });
            },
            getLocalTime(nS) {
                return new Date(parseInt(nS)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
            },
            renderContent (h, { root, node, data }) {
                if (data.selected) {
                    this.selectedOrg = data;
                }
                let treeSearchResult = '';
                if (data.isSearchResult) {
                    treeSearchResult = ' tree-search-result';
                }
                return h('span', {
                    attrs: {
                        class: (data.selected ? 'ivu-tree-title ivu-tree-title-selected' : 'ivu-tree-title') + treeSearchResult
                    },
                    style: {
                        color: data.disabled ? '#939db3' : '',
                        cursor: 'pointer'
                    },
                    on: {
                        click: (event) =>{
                            this.selectOrg([data]);
                        }
                    }
                }, [
                    data.disabled ? (h('Icon', {
                        props: {
                            type: 'close-circled',
                            color: 'red'
                        }
                    })) : '',
                    data.title
                ]);
            },
            startOrStop(type) {
                if (this.selectedOrg) {
                    this.request({
                        url: "/systemManage/organization/startOrStop.do",
                        param: {
                            orgId: this.selectedOrg.id,
                            type: type
                        }
                    }).then(() => {
                        this.$Message.success('操作成功，该组织已' + (type ? '启用' : '停用'));
                        this.getOrgSystemData();
                    });
                }
            },
        },
        components: {
            OrganizationCard
        }
    };
</script>