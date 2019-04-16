<template>
    <div class="container">
        <div style="text-align: center">
            <ButtonGroup>
                <Button type="primary" style="width: 100px;" @click="bindOrg" :disabled="!userId">关联组织</Button>
                <Button type="primary" style="width: 100px;" @click="bindPost" :disabled="!userId || items.length == 0">关联岗位</Button>
            </ButtonGroup>
        </div>

        <br/>

        <div class="org-item" v-for="(item, index) in items" :key="index">
            <div class="org-item-title" :class="{selected: item === selectedItem}" @click="selectionHandler(item)">
                {{item.orgName}} - {{item.deptName}}
                <Icon type="android-close" @click.native="unbindOrg(item)"></Icon>
            </div>
            <div class="post-list" v-if="item.postVos != null && item.postVos.length > 0">
                <Tag type="border" class="post-item" v-for="(postItem, index) in item.postVos" :key="index" @on-close="unbindPost(item, postItem)" closable>{{postItem.postName}}</Tag>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            userId: null
        },
        data () {
            return {
                items: [],
                selectedItem: null,
                selecteditems:null,
                orgId:0,
                deptId:0,
                userName:null,
                count: [0, 1, 2],
                tagPost:[],
                baseData:[],
                isShow:false,
                itemData:[],
                delModel:false,
                itemTag:[]

             }
         },
         methods: {
             getOrgPostList(){
                 this.request({
                     url: '/systemManage/user/getUserPost.do',
                     param: {
                         userId: this.userId
                     }
                 }).then(items => {
                     this.items = items;
                 });
             },
             bindOrg(){
                  this.prompt({
                      code: "RelevanceOrg",
                      width: 600,
                      height: 410,
                      title: "关联组织-部门",
                      props: {
                          userId: this.userId
                      },
                      callback: (close) => {
                          close();
                          this.getOrgPostList();
                          this.$Modal.confirm({
                              content: "请问您要继续关联岗位么？",
                              onOk: () => {
                                this.bindPost();
                              }
                          });
                      }
                  });
             },
             bindPost(){
                 this.prompt({
                     code: "RelevancePost",
                     width:500,
                     height:400,
                     title: "关联岗位",
                     props: {
                         userId:this.userId,
                         getObjDeptList:this.getOrgPostList

                     },
                     callback: (close) => {
                         close();

                     }
                 });
             },
             selectionHandler (item) {
                 this.selectedItem = item;
             },
             unbindOrg (item) {
                 this.$Modal.confirm({
                         content: "请确认取消关联操作",
                         onOk: () => {
                             this.request({
                                 url: "/systemManage/user/unbindOrg.do",
                                 param: {
                                     userId: this.userId,
                                     orgId: item.orgId,
                                     deptId: item.deptId
                                 }
                             }).then(() => {
                                 this.getOrgPostList();
                             });
                         }
                 });
             },
             unbindPost (item, postItem) {
                 this.$Modal.confirm({
                     content: "请确认取消关联操作",
                     onOk: () => {
                         this.request({
                             url: "/systemManage/user/unbindPost.do",
                             param: {
                                 userId: this.userId,
                                 orgId: item.orgId,
                                 postId: postItem.postId
                             }
                         }).then(() => {
                             this.getOrgPostList();
                         });
                     }
                 });
             },
        },
        watch:{
            userId (curVal, oldVal) {
                this.getOrgPostList();
            }
        }
    }
</script>

<style scoped>
    .org-item {
        padding: 0 0 10px 0;
    }
    .org-item-title {
        line-height: 24px;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
    }
    .org-item-title.select {
        background: #dddee1;
    }
    .org-item-title > .ivu-icon {
        margin-left: 15px;
        font-size: 16px;
        vertical-align: middle;
        color: #999;
        cursor: pointer;
        display: none;
    }
    .org-item-title > .ivu-icon:hover {
        font-size: 20px;
        color: black;
    }
    .org-item-title:hover > .ivu-icon {
        display: inline;
    }

    .post-list {
        padding: 0 0 10px 10px;
    }
    .post-item {
        margin-top: 3px;
    }
</style>