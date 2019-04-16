<template>
    <div>
        <div class="center">
            <Row>
                <i-col span="18">
                    <ButtonGroup>
                        <Button type="ghost" @click="addDuty">新增</Button>
                        <Button type="ghost" :disabled="!selectedDuty" @click="editDuty">修改</Button>
                        <Button type="ghost" :disabled="!selectedDuty" @click="removeDuty">删除</Button>
                    </ButtonGroup>
                </i-col>
                <i-col span="6">
                    <Input placeholder="名称" icon="search" @on-enter="search" @on-click="search" v-model="searchText"/>
                </i-col>
            </Row>
            <br/>
            <Table ref="table" :columns="dutyColumns" :data="dutyData.records" highlight-row @on-current-change="selectDuty"></Table>
            <br/>
            <Page size="small" :page-size="10" :total="dutyData.total" :current="dutyData.current"  @on-change="pageChange"></Page>
        </div>
        <div class="right">
            <div style="text-align: center;">
                <Button style="width: 160px;" v-if="!functionEditState"  :disabled="!selectedDuty" @click="editFunction">关联功能</Button>
                <Button style="width: 160px;" v-if="functionEditState" :disabled="!selectedDuty" @click="saveFunction">保存</Button>
            </div>
            <br>
            <div class="tree-box">
                <BSTree type="primary" v-show="functionEditState" class="tree-body" ref="tree" :data="functionTree" show-checkbox></BSTree>
                <Tree type="success" v-show="!functionEditState" class="tree-body" :data="selectedFunctionTree"></Tree>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data: function() {
            return {
                searchText:'',
                functionTree: [],
                selectedFunctionTree: [],
                dutyColumns: [{
                    key: "code",
                    title: "编码"
                }, {
                    key: "name",
                    title: "名称"
                }, {
                    key: "describe",
                    title: "职责描述"
                }],
                dutyData: {},
                selectedDuty:undefined,
                functionEditState:false
            };
        },
        created: function() {
            this.loadFuncTree();
            this.loadDutyData(1);
        },
        methods: {
            loadSelectedTree:function(){
                this.request({
                    url: "/systemManage/duty/findFunctionTreeByDutyId.do?id="+this.selectedDuty.id
                }).then(data => {
                    this.selectedFunctionTree = data;
                    this.functionEditState = false;
                });
            },
            loadFuncTree:function(){
                this.request({
                    url: "/systemManage/duty/getFuncTree.do"
                }).then(data => {
                    this.functionTree = data;
                });
            },
            loadDutyData:function(page, isSelected = false){
                this.request({
                    url: "/systemManage/duty/searchAll.do",
                    data:{page:page,name:this.searchText}
                }).then(data => {
                    this.dutyData = data;
                    if (isSelected && data.records) {
                        data.records.forEach((item, index) => {
                            if (item.name == this.searchText) {
                                this.$nextTick(() => {
                                    this.$refs['table'].objData[index]._isHighlight = true;
                                    this.selectDuty(item);
                                });
                            }
                        });
                    }
                });
            },
            selectDuty:function(row){
                this.selectedDuty=row;
                this.loadSelectedTree();
            },
            updateTreeNode:function(treeNode){
                var functionId = treeNode.id;
                if((!treeNode.children||treeNode.children.length==0)&&this.selectedDuty.functions.indexOf(functionId)>-1){
                    treeNode.checked=true;
                }
                else if(treeNode.children&&treeNode.children.length>0){
                    if(this.selectedDuty.functions.indexOf(functionId)>-1)
                            treeNode.checked = true;
                    else
                            treeNode.checked = false;
                    for(var i = 0;i<treeNode.children.length;i++){
                        this.updateTreeNode(treeNode.children[i]);
                    }
                }else{
                    treeNode.checked=false;
                }

            },
            loadFunctionTree:function(){
                for(var i = 0;i<this.functionTree.length;i++){
                    this.functionTree[i].checked=false;
                    this.updateTreeNode(this.functionTree[i]);
                }
//                this.$refs['tree'].updateData();
            },
            addDuty:function(){
                this.prompt({
                    code: "dutyCard",
                    title:"新增职责",
                    width:400,
                    callback: (name, close) => {
                        this.$Message.info("保存成功");
                        this.searchText = name;
                        this.loadDutyData(1, true);
                        close();
                    }
                });
            },
            editFunction:function(){
                this.functionEditState=true;
                this.request({
                    url: "/systemManage/duty/findFuncByDuty.do?id="+this.selectedDuty.id
                }).then(data => {
                    this.selectedDuty.functions= data;
                    this.loadFunctionTree();
                });
            },
            saveFunction:function(){
                var selectedNodes =this.$refs['tree'].getCheckedNodes();
                var result = selectedNodes.map(function(node){
                    return node.id;
                });
                this.request({
                    url: "/systemManage/duty/saveFunc.do",
                    data:{dutyId:this.selectedDuty.id,funcList:result}
                }).then(data => {
                    this.functionEditState=false;
                    this.$Message.info("操作成功");
                    this.loadSelectedTree();
                });

            },
            search:function(){
                /*this.loadDutyData(this.dutyData.current==undefined?1:this.dutyData.current);*/
                this.loadDutyData(1);
            },
            pageChange:function(page){
                this.selectedDuty = undefined;
                this.selectedFunctionTree=[];
                this.loadDutyData(page);
            },
            removeDuty:function(){
                this.$Modal.confirm({
                    title:'删除职责确认',
                    content:'是否删除【'+this.selectedDuty.name+'】职责',
                    onOk:() => {
                        this.request({
                            url: "/systemManage/duty/remove.do?id="+this.selectedDuty.id
                        }).then(data => {
                            this.$Message.info("删除成功");
                            this.selectedFunctionTree=[];
                            this.selectedDuty=undefined;
                            this.loadDutyData(this.dutyData.current);
                        });
                    }
                });
            },
            editDuty:function(){
                this.prompt({
                    code: "dutyCard",
                    title:"编辑职责",
                    width:400,
                    props:{dutyData:this.selectedDuty},
                    callback: (name, close) => {
                        this.$Message.info("保存成功");
                        this.loadDutyData(this.dutyData.current);
                        close();
                    }
                });
            }
        }
    };
</script>

<style scoped>
    .center {
        position: relative;
        margin-right: 250px;
        padding: 15px;
    }
    .right {
        position: absolute;
        top: 0;
        right: 0;
        width: 250px;
        height: 100%;
        padding: 15px;
        border-left: solid 1px #f5f5f5;
    }
    .tree-box{
        position: relative;
    }
    .tree-task{
        position: absolute;
        background: #EFEFEF;
        width: 100%;
        height: 100%;
        z-index: 6;
        filter: alpha(opacity=20);
        -moz-opacity:0.2;
        opacity:0.2;
    }
    .tree-task:hover{
        cursor: not-allowed;
    }
    .tree-body{
        padding:5px;
    }
</style>

