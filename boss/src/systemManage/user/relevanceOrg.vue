<template>
    <div class="container">
        <div class="clearFix">
            <Input size="small" style="width: 200px; margin-bottom: 10px;" icon="search" v-model="searchText" @on-enter="getOrgList(1)" @on-click="getOrgList(1)" placeholder="组织名称" />
        </div>
        <div class="center">
            <div class="org-list">
                <div class="org-item empty" v-if="items.length == 0">暂无可关联的组织</div>
                <div class="org-item" :class="{selected: item === selectedItem}" v-for="item in items" @click="selectionHandler(item)">{{item.name}}</div>
            </div>
            <div class="dept-list" :class="{selected: selectedItem}">
                <h4 v-if="!selectedItem">请先选择组织</h4>
                <h4 v-if="selectedItem">请选择要关联的部门</h4>
                <div class="empty" v-if="!deptItems || deptItems.length == 0">暂无数据</div>
                <div class="dept-item" v-for="(item, index) in deptItems" @click="bindOrgDept(item)">{{item.name}}</div>
            </div>
        </div>
        <Page size="small" :current="current" :total="total" @on-change="getOrgList"></Page>
    </div>
</template>

<script>
    export default {
        props: {
            userId: null
        },
        data(){
            return {
                items: [],
                selectedItem: null,
                searchText: null,
                current: 0,
                total: 0,
                deptItems: []
            }
        },
        created:function(){
            this.getOrgList();
        },
        methods: {
            getOrgList (current = 1) {
                this.request({
                    url: "/systemManage/user/userNoAccessToOrg.do",
                    param: {
                        userId: this.userId,
                        current: current,
                        name: this.searchText
                    }
                }).then(demand => {
                    this.items = demand.records;
                    this.current = demand.current;
                    this.total = demand.total;
                    if(Array.notEmpty(this.items)) {
                        this.selectionHandler(this.items[0]);
                    }
                });
            },
            selectionHandler (item) {
                this.selectedItem = item;
                this.getDeptList();
            },
            getDeptList () {
                this.request({
                    url: "/systemManage/user/userAccessToDep.do",
                    param: {
                        orgId: this.selectedItem.id
                    }
                }).then(items => {
                    this.deptItems = items;
                });
            },
            bindOrgDept (item) {
                this.request({
                    url: "/systemManage/user/saveUserOrgAndDep.do",
                    data: {
                        userId: this.userId,
                        orgId: this.selectedItem.id,
                        deptId: item.id
                    }
                }).then(items => {
                    this.callback();
                })
            },
        }
    };
</script>

<style scoped>
    .container {
        padding: 7px;
    }
    .container > .center {
        position: relative;
        margin-bottom: 10px;
    }
    .org-list {
        position: relative;
        height: 311px;
        margin-right: 200px;
        border-top: solid 1px #dddee1;
        border-left: solid 1px #dddee1;
        border-right: solid 1px #dddee1;
        border-bottom: solid 1px #dddee1;
    }
    .org-item {
        margin-right: -1px;
        padding: 0 15px;
        line-height: 30px;
        font-size: 13px;
        border-right: solid 1px #dddee1;
    }
    .org-item {
        border-bottom: solid 1px #dddee1;
    }
    .org-item.empty {
        height: 100%;
        line-height: 90px;
    }
    .org-item.selected {
        color: #3a76df;
        background: #fcfcfc;
        font-weight: 700;
        border-right: transparent;
    }
    .org-item:hover {
        color: #3a76df;
        background: #fcfcfc;
    }
    .dept-list {
        position: absolute;
        top: 0;
        right: 0;
        width: 200px;
        height: 100%;
        padding: 7px;
        border: solid 1px #dddee1;
        border-left: none;
    }
    .dept-list.selected {
        background: #fcfcfc;
    }
    .dept-list > h4 {
        margin-bottom: 10px;
    }
    .empty {
        color: gray;
        text-align: center;
    }
    .dept-item {
        font-size: 13px;
        padding-left: 7px;
        line-height: 30px;
        cursor: pointer;
    }
    .dept-item:hover {
        /*color: #3a76df;*/
        font-weight: 700;
        color: white;
        background: #999;
        border-radius: 5px;
    }
</style>