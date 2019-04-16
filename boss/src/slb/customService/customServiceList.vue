<template>
    <div class="container">
        <div class="center">
            <Row>
                <i-col span="19">
                    <ButtonGroup>
                        <Button type="ghost" :disabled="!customServiceId" @click="editBtn">编辑小能ID</Button>
                    </ButtonGroup>
                </i-col>
            </Row>
            <br/>
            <Table size="small" :data="items" :columns="tableColumns" highlight-row @on-current-change="selectionHandler"></Table>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                curPage: 1,
                pageSize: 10,
                items: [],
                total: 0,
                current: 1,
                customServiceId: null,
                xnId: null,
                tableColumns: [{
                    title: '类别ID',
                    key: 'code'
                }, {
                    title: '类别名称',
                    key: 'label'
                }, {
                    title: '小能ID',
                    key: 'xnId'
                }]
            }
        },
        created: function () {
            this.getCustomServiceList();
        },
        methods: {
            getCustomServiceList() {
                this.request({
                    url: "/serviceIcon/getServiceIconList.do"
                }).then(demand => {
                    this.items = demand;
                });
            },
            selectionHandler(item) {
                this.customServiceId = item.value;
                this.xnId = item.xnId;
            },
            editBtn() {
                this.prompt({
                    title: '编辑小能ID',
                    code: "customServiceAdd",
                    width: 600,
                    height: 300,
                    props: {
                      customServiceId: this.customServiceId,
                      xnId: this.xnId
                    },
                    callback: (close) => {
                        close();
                        this.getCustomServiceList();
                    }
                });
            },
        }
    }
</script>

<style scoped>
    .center {
        position: relative;
        padding: 15px;
    }

    .infoDiv label {
        margin: 0 20px 0 12px;
    }
</style>