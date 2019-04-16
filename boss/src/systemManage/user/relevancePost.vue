<template>
    <div class="container">
        <div class="center">
            <div class="org-list">
               <div class="org-item" :class="{selected: item === selectedItem}" v-for="item in items" @click="currentOrgChange(item)">{{item.name}}</div>
            </div>
            <div class="dept-list" :class="{selected: selectedItem}">
                <h4 v-if="selectedItem">请选择要关联的岗位</h4>
                <div class="empty" v-if="!unPostItem || unPostItem.length == 0">暂无数据</div>
                <div class="dept-item" v-for="(item, index) in unPostItem" @click="currentDeptChange(item)">{{item.name}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            userId: null,
            deptId:null,
            getObjDeptList: {
                type: Function,
                default: function () {
                    return {};
                }
            }
        },
        data(){
            return {
                selectedItem: null,
                userData: {},
                unPostItem:[],
                items:[

                ],
                popModel:false,
                orgId:0
            }
        },
        methods:{
            getUserData() {
                this.request({
                    url: "/systemManage/user/userEdit.do",
                    param: {
                        id: this.userId
                    }
                }).then(data => {
                    if (data) {
                        this.userData = data.userVo;
                    }
                    this.getOrgList();
                });
            },
            getOrgList () {
                this.request({
                    url: "/systemManage/user/userAccessToOrg.do",
                    data: {
                        id: this.userId
                    }
                }).then(demand => {
                    this.items = demand;
                    if(Array.notEmpty(this.items)) {
                        this.currentOrgChange(this.items[0]);
                    }
                });
            },
            currentOrgChange(item){
                this.orgId = item.id
                this.selectedItem = item;
                this.getPostList(item.id);
            },
            getPostList (orgId) {
                this.request({
                    url: ' /systemManage/user/userAccessPost.do',
                    data: {
                        orgId: orgId ,
                        userId: this.userId,
                        level: this.userData.permissionLevel,
                        key: 'no'
                    }
                }).then(data => {
                    this.unPostItem = data;
                });
            },
            currentDeptChange(item){
                this.request({
                    url: "/systemManage/user/saveUserOrgAndPost.do",
                    data: {
                        userId: this.userId,
                        orgId:this.orgId,
                        postId:item.id
                    }
                }).then(() => {
                    this.$Message.success('保存成功');
                    this.callback();
                    this.getObjDeptList();
                });
            }

        },
        created:function(){
            this.getUserData();
        }

    }
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
        overflow-y: auto;
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