<style scoped>
    .container {
        padding: 15px;
    }
</style>

<template>
    <div class="container">
        <div>
            <ButtonGroup>
                <Button @click="add">新增</Button>
                <Button type="ghost" @click="remove" :disabled="selectedItem == null">删除</Button>
            </ButtonGroup>
        </div>
        <br/>
        <Table :columns="columns" :data="items" size="small" @on-current-change="selectionHandler" disabled-hover highlight-row></Table>
        <RightPrompt :open="cardMode">
            <AppCard ref="card" @callback="search"></AppCard>
        </RightPrompt>
    </div>
</template>

<script>
    import AppCard from "./appCard.vue";
    export default {
        components: {
            AppCard
        },
        data: function() {
            return {
                columns: [{
                    key: "sort",
                    title: "排序",
                    width: 100
                }, {
                    key: "code",
                    title: "编码",
                    width: 150
                }, {
                    key: "name",
                    title: "名称",
                    width: 250
                }, {
                    key: "describe",
                    title: "描述"
                }],
                items: [],
                selectedItem: null,
                cardMode: false
            };
        },
        created: function() {
            this.search();
        },
        methods: {
            search () {
                this.cardMode = false;
                this.request({
                    url: "/systemManage/app/search.do"
                }).then(items => {
                    this.items = items;
                });
            },
            selectionHandler (item) {
                this.selectedItem = item;
                this.cardMode = true;
                this.$refs.card.init(item.id);
            },
            add () {
                this.cardMode = true;
                this.$refs.card.init();
            },
            remove () {
                this.$Modal.confirm({
                    content: "请确认删除操作",
                    onOk: () => {
                        this.request({
                            url: "/systemManage/app/remove.do",
                            param: {
                                id: this.selectedItem.id
                            }
                        }).then(() => {
                            this.search();
                        });
                    }
                });
            }
        }
    };
</script>