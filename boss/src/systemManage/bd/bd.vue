<style scoped>
    .bd{
        padding: 30px;
    }
    .bd-tabs{
        border-bottom: 1px solid #dddee1;
        padding-bottom: 10px;
    }
    .bd-content{
        padding: 10px 0px 10px 0px;
    }
    .bd-right{
        border-left: 1px solid #dddee1;
        height: 540px;
    }
</style>
<template>
    <div class="bd">
        <div class="bd-tabs">
            <ButtonGroup>
                <Button :type="selectedTab==1?'default':'ghost'" @click="selectTab(1)">档案分类</Button>
                <Button :type="selectedTab==2?'default':'ghost'" @click="selectTab(2)">档案项</Button>
            </ButtonGroup>
        </div>
        <div class="bd-content" v-if="selectedTab==1">
            <Row>
                <i-col span="12">
                <ButtonGroup>
                    <Button @click="addCategory">新增档案分类</Button>
                    <Button type="ghost" @click="editCategory" :disabled="!selectedCategory||selectedCategory.ifPreset">修改</Button>
                </ButtonGroup>
                <Button  type="ghost" :disabled="!selectedCategory||selectedCategory.ifPreset" @click="removeCategory">删除</Button>
                </i-col>
                <i-col span="6" offset="6">
                <Input placeholder="请输入查询条件" icon="search" @on-enter="searchCategory" @on-click="searchCategory" v-model="categorySearchText"/>
                </i-col>
            </Row>
            <br/>
            <Table :columns="categoryColumns" :data="categoryData.records" highlight-row @on-current-change="selectCategory" @on-row-dblclick="dbCategory"></Table>
            <br/>
            <Page size="small" :total="categoryData.total" :page-size="8" show-total :current="categoryData.current" @on-change="categoryPageChange"></Page>
        </div>
        <div class="bd-content" v-if="selectedTab==2">
            <Row>
                <Col span="18" v-if="selectedCategory&&!selectedCategory.ifTree">
                <Row v-if="!selectedCategory||!selectedCategory.ifPreset">
                    <i-col span="12">
                        <ButtonGroup>
                            <Button @click="addItem" :disabled="!selectedCategory">新增</Button>
                        </ButtonGroup>
                        <Button :disabled="!selectedItem" @click="removeItem">删除</Button>
                    </i-col>
                </Row>
                <br/>
                <Table :columns="itemColumns" :data="itemData.records" highlight-row @on-current-change="selectItem"></Table>
                <br/>
                <Page size="small" :total="itemData.total" :page-size="8" show-total :current="itemData.current" @on-change="itemPageChange"></Page>
                </Col>
                <Col span="18" v-if="selectedCategory&&selectedCategory.ifTree">
                <ButtonGroup>
                    <Button @click="addItem" :disabled="!selectedCategory">新增{{selectedItem?'下级':'根节点'}}</Button>
                </ButtonGroup>
                <Button :disabled="!selectedItem" @click="removeItem">删除</Button>
                <br>
                <Tree style="padding-top: 10px" @on-select-change="selectTreeNode" :data="treeData" :load-data="loadTreeNode" :render="renderTree"></Tree>
                </Col>
                <Col class="bd-right" span="5" offset="1"  v-if="selectedCategory">
                <bdItemCard :view="true" @callback="addCallback" :itemData="selectedItem" :categoryId="selectedCategory.id" :categoryName="selectedCategory.name" :ifPreset="selectedCategory.ifPreset" :ifTree="selectedCategory.ifTree"></bdItemCard>
                </Col>
            </Row>


        </div>
    </div>

</template>

<script type="text/babel">
    import bdTreeNode from './bdTreeNode.vue';
    import bdItemCard from './bdItemCard.vue';
    export default {
        components: { bdTreeNode,bdItemCard },
        data: function() {
            return {
                selectedTab:1,
                categorySearchText:"",
                categoryColumns:[{
                    key: "code",
                    title: "编码"
                },{
                    key: "name",
                    title: "名称"
                },{
                    key: "describe",
                    title: "描述"
                },{
                    key: "ifPreset",
                    title: "是否系统预置",
                    render: function(h, params){
                        return h('div', [
                            h('Icon', {
                                props: {
                                    type: params.row.ifPreset?'android-checkbox-outline':'android-checkbox-outline-blank'
                                },
                                style:{
                                    fontSize:'18px',
                                    color: params.row.ifPreset?'':'#cccccc'
                                }
                            })
                        ]);
                    }
                },{
                    key: "ifTree",
                    title: "是否树形结构",
                    render: function(h, params){
                        return h('div', [
                            h('Icon', {
                                props: {
                                    type: params.row.ifTree?'android-checkbox-outline':'android-checkbox-outline-blank'
                                },
                                style:{
                                    fontSize:'18px',
                                    color: params.row.ifTree?'':'#cccccc'
                                }
                            })
                        ]);
                    }
                }],
                itemColumns:[{
                    key: "code",
                    title: "编码"
                },{
                    key: "name",
                    title: "名称"
                }, {
                    key: "describe",
                    title: "描述"
                }],
                categoryData:{
                    records:[],
                    total:0,
                    current:1
                },
                itemData:{
                    records:[],
                    total:0,
                    current:1
                },
                selectedCategory:undefined,
                selectedItem:undefined,
                treeData:[]
            };
        },
        created: function() {
            this.loadCategoryData(1);
        },
        methods: {
            selectTreeNode(nodes){
                if(nodes&&nodes.length>0){
                    var node = nodes[0];
                    node.name=node.title;
                    this.selectedItem = node;

                } else
                    this.selectedItem = undefined;
            },
            loadTreeNode(item, callback){
                this.request({
                    url: "/systemManage/bd/getItemTreeNode.do?id="+item.id+'&categoryCode='+this.selectedCategory.code,
                }).then(data => {
                    if(data) {
                       callback(data);
                    }
                });
            },
            selectTab(index){
                this.selectedTab=index;
                if(this.selectedCategory&&index==2){
                    this.loadItemData(1,this.selectedCategory.id);
                    this.loadItemTree();
                }
            },
            addItem:function(){
                this.prompt({
                    code: "bdItemCard",
                    title:"新增档案",
                    width:400,
                    props:{
                        parentId:this.selectedItem?this.selectedItem.id:'',
                        parentName:this.selectedItem?this.selectedItem.name:'',
                        categoryId:this.selectedCategory.id,
                        categoryName:this.selectedCategory.name,
                        ifTree:this.selectedCategory.ifTree
                    },
                    callback: (close) => {
                        this.$Message.info("保存成功");
                        this.loadItemData(this.itemData.current,this.selectedCategory.id);
                        this.loadItemTree();
                        close();
                    }
                });
            },
            addCallback:function(){
                this.$Message.info("保存成功");
                this.loadItemData(this.itemData.current,this.selectedCategory.id);
                this.loadItemTree();
            },
            editItem:function(){
                this.prompt({
                    code: "bdItemCard",
                    title:"修改档案",
                    width:400,
                    props:{
                        itemData:this.selectedItem,
                        categoryName:this.selectedCategory.name,
                        ifTree:this.selectedCategory.ifTree
                    },
                    callback: (close) => {
                    this.$Message.info("保存成功");
                    this.loadItemData(this.itemData.current,this.selectedCategory.id);
                    this.loadItemTree();
                    close();
                }
            });
            },
            removeItem:function(){
                this.$Modal.confirm({
                    content: '确定删除此档案吗?',
                    onOk: () => {
                        this.request({
                            url: '/systemManage/bd/removeItem.do',
                            param: {
                                id: this.selectedItem.id
                            }
                        }).then(data => {
                            this.$Message.success('删除成功');
                            this.loadItemData(this.itemData.current,this.selectedCategory.id);
                            this.loadItemTree();
                        }, error => {
                                this.$Message.error('删除失败');
                        })
                    }
                });
            },
            itemPageChange:function(page){
                this.loadItemData(page,this.selectedCategory.id);
            },
            selectItem:function(row){
                this.selectedItem = row;
            },
            loadItemTree:function () {
                this.selectedItem = undefined;
                this.request({
                    url: "/systemManage/bd/getItemTree.do",
                    data: {categoryCode: this.selectedCategory.code}
                }).then(data => {
                    if(data){
                        this.treeData = data;
                    }else{
                        this.treeData = [];
                    }
                });
            },
            loadItemData:function(page,categoryId){
                if (categoryId) {
                    this.selectedItem = undefined;
                    this.request({
                        url: "/systemManage/bd/searchItems.do",
                        data: {page: page, categoryId: categoryId}
                    }).then(data => {
                        this.itemData = data;
                    });
                }
            },
            loadCategoryData:function(page){
                this.selectedCategory = undefined;
                this.selectedItem = undefined;
                this.request({
                    url: "/systemManage/bd/searchCategory.do",
                    data:{page:page,name:this.categorySearchText}
                }).then(data => {
                    this.categoryData = data;
                });
            },
            categoryPageChange:function(page){
                this.loadCategoryData(page);
                this.itemData = {};
            },
            addCategory:function(){
                this.prompt({
                    code: "bdCard",
                    title:"新增分类",
                    width:400,
                    callback: (close) => {
                        this.$Message.info("保存成功");
                        this.loadCategoryData(this.categoryData.current);
                        close();
                    }
                });
            },
            editCategory:function(){
                this.prompt({
                    code: "bdCard",
                    title:"修改分类",
                    width:400,
                    props:{categoryData:this.selectedCategory},
                    callback: (close) => {
                        this.$Message.info("保存成功");
                        this.loadCategoryData(this.categoryData.current);
                        close();
                    }
                });
            },
            removeCategory:function(){
                this.$Modal.confirm({
                    content: '确定删除此分类吗?',
                    onOk: () => {
                        this.request({
                            url: '/systemManage/bd/removeCategory.do',
                            param: {
                                id: this.selectedCategory.id
                            }
                        }).then(data => {
                            this.$Message.success('删除成功');
                            this.loadCategoryData(this.categoryData.current);
                        }, error => {
                            this.$Message.error('删除失败');
                        })
                    }
                });
            },
            selectCategory:function(row){
                this.selectedCategory = row;
            },
            searchCategory:function(){
                this.loadCategoryData(1);
            },
            dbCategory(){
                this.selectedTab = 2;
                this.loadItemData(1,this.selectedCategory.id);
                this.loadItemTree();
            },
            renderTree:function(h, { root, node, data }){
                return h(bdTreeNode, {
                    props:{
                        node:data
                    }
                })
            }

        }
    };
</script>

