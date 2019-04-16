<style scoped>
    .bd{
        padding: 30px;
    }
    .bd-right{
        margin-top: 20px;
        border-left: 1px solid #dddee1;
        height: 540px;
    }
</style>
<template>
    <div class="bd">
        <Row>
            <i-col span="12">
                <ButtonGroup>
                    <Button @click="addItem">新增</Button>
                </ButtonGroup>
                <Button :disabled="!selectedItem" @click="removeItem">删除</Button>
            </i-col>
        </Row>
        <Row>
            <Col span="18">
            <br/>
            <Table :columns="itemColumns" :data="itemData.records" highlight-row @on-current-change="selectItem"></Table>
            <br/>
            <Page size="small" :total="itemData.total" :page-size="8" show-total :current="itemData.current" @on-change="itemPageChange"></Page>
            </Col>
            <Col class="bd-right" span="5" offset="1">
            <bdGroupCard  @callback="addCallback" :itemData="selectedItem"></bdGroupCard>
            </Col>
        </Row>
    </div>
</template>

<script type="text/babel">
    import bdGroupCard from './bdGroupCard.vue';
    export default {
        components: {bdGroupCard},
        data: function() {
            return {
                itemColumns:[{
                    key: "code",
                    title: "编码"
                },{
                    key: "name",
                    title: "服务群组名称"
                }, {
                    key: "describe",
                    title: "描述"
                }],
                itemData:{
                    records:[],
                    total:0,
                    current:1
                },
                selectedItem:undefined
            };
        },
        created: function() {
            this.loadData();
        },
        methods: {
            loadData(){
                this.request({
                    url: '/systemManage/bd/getGroupList.do',
                    param:{page:this.itemData.current}
                }).then(data => {
                    this.itemData = data;
                })
            },
            addItem:function(){
                this.prompt({
                    code: "bdGroupCard",
                    title:"新增服务群组",
                    width:400,
                    props:{
                        add:true
                    },
                    callback: (close) => {
                        this.$Message.info("保存成功");
                        this.loadData();
                        close();
                    }
                });
            },
            addCallback:function(){
                this.$Message.info("保存成功");
                this.loadData();
            },
            removeItem:function(){
                this.$Modal.confirm({
                    content: '确定删除此群组吗?',
                    onOk: () => {
                        this.request({
                            url: '/systemManage/bd/removeItem.do',
                            param: {
                                id: this.selectedItem.id
                            }
                        }).then(data => {
                            this.$Message.success('删除成功');
                            this.selectedItem = undefined;
                            this.loadData();
                        });
                    }
                });
            },
            itemPageChange:function(page){
                this.itemData.current = page;
                this.loadData();
            },
            selectItem:function(row){
                this.selectedItem = row;
            }
        }
    };
</script>

