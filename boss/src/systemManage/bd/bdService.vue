<style scoped>
    .bd{
        padding: 30px;
    }
    .center {
        position: relative;
        margin-left: 300px;
    }
    .left {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 300px;
        padding: 10px;
        border-right: solid 1px #dddee1;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .left-title{
        font-size: 20px;
        padding: 20px;
    }
    .left-group{

    }
    .left-item{
        padding: 14px 24px;
        position: relative;
        cursor: pointer;
        z-index: 1;
        transition: all .2s ease-in-out;
    }
    .left-item:hover{
        border-left: 4px solid #59b399;
        background: #f4f4f4;
    }
    .active{
        border-left: 4px solid #59b399;
        background: #f4f4f4;
    }
</style>
<template>
    <div class="bd">
        <div class="left">
            <div class="left-title">服务群组</div>
            <ul class="left-group">
                <li :class="selectedGroup == group?'left-item active':'left-item'" class="" v-for="group in groupList" @click="selectGroup(group)">{{group.name}}</li>
            </ul>
        </div>
        <div class="center">
            <Row>
                <Col span="6">
                    <ButtonGroup>
                        <Button type="default" @click="add">新增</Button>
                        <Button type="ghost" :disabled="!selectedItem" @click="edit">修改</Button>
                    </ButtonGroup>
                    <Button type="ghost" :disabled="!selectedItem" @click="remove">删除</Button>
                </Col>
                <Col span="6" offset="12">
                    <Input placeholder="请输入查询条件" icon="search" @on-enter="search" @on-click="search" v-model="searchText"/>
                </Col>
            </Row>
            <br/>
            <Table :columns="serviceColumns" :data="serviceData.records" highlight-row @on-current-change="selectService"></Table>
            <br/>
            <Page size="small" :total="serviceData.total" :page-size="10" show-total :current="serviceData.current" @on-change="pageChange"></Page>
        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        data: function() {
            return {
                selectedGroup:{},
                searchText:"",
                serviceData:{
                    records:[],
                    total:0,
                    current:1
                },
                serviceColumns:[{
                    key: "code",
                    title: "编码"
                },{
                    key: "name",
                    title: "名称"
                },{
                    key: "describe",
                    title: "描述"
                }],

                selectedItem:undefined,
                groupList:[]
            };
        },
        created: function() {
            this.loadGroupData();
        },
        methods: {
            selectGroup(group){
                this.selectedGroup = group;
                this.loadData();
            },
            loadGroupData(){
                this.request({
                    url: "/systemManage/bd/getAllGroupList.do"
                }).then(data => {
                    this.groupList = data;
                    if(this.groupList.length&&this.groupList.length>0)
                        this.selectedGroup = this.groupList[0];
                    this.loadData();
                });
            },
            loadData:function () {
                this.selectedItem = undefined;
                this.request({
                    url: "/systemManage/bd/searchServiceItems.do",
                    data:{page:this.serviceData.current,name:this.searchText,groupId:this.selectedGroup.id}
                }).then(data => {
                    this.serviceData = data;
                });
            },
            add(){
                this.prompt({
                    code: "bdServiceCard",
                    title:"新增服务档案",
                    width:400,
                    props:{
                        groupId:this.selectedGroup.id,
                        groupName:this.selectedGroup.name
                    },
                    callback: (close) => {
                        this.$Message.info("保存成功");
                        this.loadData();
                        close();
                    }
                });
            },
            remove(){
                this.request({
                    url: "/systemManage/bd/removeServiceItem.do?id="+this.selectedItem.id
                }).then(data => {
                    this.$Message.info("删除成功");
                    this.loadData();
                    this.selectedItem = undefined;
                });
            },
            edit:function(){
                this.prompt({
                    code: "bdServiceCard",
                    title:"修改服务档案",
                    width:400,
                    props:{
                        groupId:this.selectedGroup.id,
                        groupName:this.selectedGroup.name,
                        itemData:this.selectedItem
                    },
                    callback: (close) => {
                        this.$Message.info("保存成功");
                        this.loadData();
                        close();
                    }
                });
            },

            pageChange:function(page){
                this.loadData(page);
            },
            search:function(){
                this.loadData();
            },
            selectService:function(row){
                this.selectedItem = row;
            }

        }
    };
</script>

