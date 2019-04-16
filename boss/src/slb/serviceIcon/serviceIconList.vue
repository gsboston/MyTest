<template>
    <div class="container">
        <div class="center">
            <Row>
                <i-col span="19">
                    <ButtonGroup>
                        <Button type="ghost" :disabled="!serviceIconId" @click="uploadIconBtn">上传图标</Button>
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
                items: [],
                serviceIconId: null,
                tableColumns: [{
                    title: '类别ID',
                    key: 'code'
                }, {
                    title: '类别名称',
                    key: 'label'
                }, {
                    title: '类别图标',
                    key: 'imgUrl',
                    render: (h, params) => {
                        return h('div', [
                            h('img', {
                                attrs: {
                                    src: this.$updateConfig.file + params.row.imgUrl + '&x-oss-process=image/resize,w_100,h_100/quality,Q_80'
                                }
                            })
                        ]);
                    }
                }]
            }
        },
        created: function () {
            this.getServiceIconList();
        },
        methods: {
            getServiceIconList() {
                this.request({
                    url: "/serviceIcon/getServiceIconList.do"
                }).then(demand => {
                    this.items = demand;
                });
            },
            selectionHandler(item) {
                this.serviceIconId = item.value;
            },
            uploadIconBtn() {
                this.prompt({
                    title: '上传图标',
                    code: "serviceIconAdd",
                    width: 600,
                    height: 300,
                    props: {
                        id: this.serviceIconId
                    },
                    callback: (close) => {
                        close();
                        this.getServiceIconList();
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