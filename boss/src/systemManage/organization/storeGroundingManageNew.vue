<template>
    <div class="container">
        <div class="panel">
            <Row>
                <auto-comp
                        ref="searchName"
                        v-model="searchName"
                        icon="ios-search"
                        placeholder="按组织名称查询"
                        @on-search="searchList"
                        @on-select="getOrg"
                        style="width:335px;">
                        <Option v-for="option in searchResult" :value="option.name" :key="option.id">
                            {{option.name}}
                        </Option>
                </auto-comp>
                <!--<Input icon="search" @on-enter="search" @on-click="search" v-model="searchName" style="width:400px; float: right;" placeholder="按组织名称查询">-->
                <!--<Select v-model="searchType" slot="prepend" style="width:80px;">-->
                    <!--<Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
                <!--</Select>-->
                <!--</Input>-->
            </Row>
        </div>
        <div class="left">
            <Tree ref="tree" :data="stores" :load-data="loadData" :render="renderContent"></Tree>
        </div>
        <div class="center" v-if="storeItem != null" style="padding-left: 25px; padding-right: 25px; background-color: white">
            <func-node style="margin-top:0px;" v-if="storeItem != ''" code="storeGroundingManageCardNew" :storeItem="storeItem" :editType="editType"></func-node>
        </div>
        <div class="center" v-else style="text-align: center;">
            <div style="padding-top: 260px">
                <img src="/static/noMessage.png"/>
            </div>
            <div>
                <span style="font-size: 16px !important;">请选择要维护商家信息的组织节点~</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {

        },
        data () {
            return {

                buttonProps: {
                    type: 'ghost',
                    size: 'small',
                },
                cityList: [
                    {
                        value: 1,
                        label: '门店名称'
                    },
                    {
                        value: 2,
                        label: '组织名称'
                    },
                    {
                        value: 3,
                        label: '所属公司'
                    },

                ],
                searchType: 1,
                searchName: "",
                storeItem: null,
                editType: '',
                stores:[],
                searchResult:[],
                storesColumns:[
                    {
                        title: '所属公司',
                        key: 'companyName',
                        align: 'left'
                    },
                    {
                        title: '组织名称',
                        key: 'name',
                        align: 'left'
                    },
                    {
                        title: '门店名称',
                        key: 'deptName',
                        align: 'left'
                    },
                    {
                        title: '上架状态',
                        key: 'status',
                        align: 'center',
                        render: (h, params) => {
                            if (this.stores[params.index].status==0) {
                                return h('Icon', {
                                    props:{
                                        type: 'checkmark',
                                    },
                                    style: {
                                        fontSize: '16px'
                                    },
                                });
                            }
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'left',
                        render: (h, params) => {
                            if (this.stores[params.index].status!=0) {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.grounding(params.index);
                                            }
                                        }
                                    }, '上架'),
                                ]);
                            } else {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                this.unGrounding(params.index);
                                            }
                                        }
                                    }, '下架'),
                                    h('Button', {
                                        props: {
                                            type: 'text',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.edit(params.index);
                                            }
                                        }
                                    }, '维护'),
                                ]);
                            }

                        }
                    }
                ],
                storesTotal: 0,
                current: 1,
                pageSize: 10,
            }
        },
        created: function () {
            this.$api.updateStatus = this.updateStatus;
            this.search();
        },
        methods: {
            updateStatus (id, status) {
                this.findStore(id, status, this.stores);
            },
            findStore (id, status, list) {
                for (var i=0;i<list.length;i++) {
                    if(list[i].id == id) {
                        list[i].status = status;
                        return;
                    } else {
                        if (list[i].children && list[i].children.length>0) {
                            this.findStore(id, status, list[i].children);
                        }
                    }
                }
            },
            topRender(h, { root, node, data }) {
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    }
                }, [
                    h('span', [
                        h('span', data.name)
                    ]),
                ]);
            },
            renderContent (h, { root, node, data }) {
                return h('div', {
                    style: {
                        display: 'inline-flex',

                        width: '100%',
                    },
                    on: {
                        click: () => {
                            this.show(data);
                        }
                    }
                }, [
                    h('div', {
                        style: {
                            width: '100%',
                        }
                    }, [
                        h('div', {
                            style: {
                                display: 'inline-block',
                                backgroundColor: this.storeItem!=null && data.id==this.storeItem.id ? '#d4e8fb' : '#ffffff',
                                borderRadius: '3px',
                                height: '18px',

                            }
                        }, [
                            h('Icon', {
                                style: {
                                    marginLeft: '5px',
                                },
                                props: {
                                    type: data.status == 0 ? 'checkmark-round' : 'close-round',
                                    color: data.status == 0 ? '#59b399':(this.storeItem!=null && data.id==this.storeItem.id ? '#d4e8fb' : '#ffffff'),
                                    size: '16',
                                },
                            }),
                            h('span', {
                                style: {
                                    marginLeft: '5px',
                                    marginRight: '5px',
                                    cursor: 'pointer',
                                }
                            }, data.name),
                        ]),

                    ]),
                ]);
            },
            search(orgId = 0) {
                this.request({
                    url: "/systemManage/organization/storeGrounding/storesNew.do",
                    param: {
                        orgId: orgId,
                    }
                }).then(data => {
                    this.stores = data;
                    this.stores[0].render = this.topRender;
                });
            },
            searchList() {
                this.request({
                    url: "/systemManage/organization/storeGrounding/searchStores.do",
                    param: {
                        orgName: this.searchName,
                    }
                }).then(data => {
                    this.searchResult = data;
                    this.$refs.searchName.toggleMenu(this.searchResult && this.searchResult.length>0);
                });
            },
            loadData(item, callback) {
                this.request({
                    url: "/systemManage/organization/storeGrounding/storesNew.do",
                    param: {
                        orgId: item.id,
                    }
                }).then(data => {
                    callback(data);
                });

            },
            getOrg(value) {
                this.searchResult.map(item=>{
                    if(item.name == value){
                        this.request({
                            url: "/systemManage/organization/storeGrounding/getOrgTree.do",
                            param: {
                                orgId: item.id,
                            }
                        }).then(data => {
                            this.stores = data;
                            this.storeItem = null;
                            this.$nextTick(function () {
                                this.storeItem = item;
                                this.editType = item.status==0?'EDIT':'GROUNDING'
                            });
//                            console.log(JSON.stringify(this.stores));
//                            console.log(JSON.stringify(data));
//                            this.updateTree(this.stores, data);
                        });
                    }
                });
            },
            updateTree(tree1, tree2) {
                for(var i=0;i<tree1.length;i++) {
//                    if (tree2.length>0) {
                        for(var j=0;j<tree2.length;j++) {
                            if (tree1[i].id==tree2[j].id && tree2[j].children.length>0) {
                                tree1[i].expand = true;
                                if (tree1.length < tree2.length) {
                                    tree1 = tree2;
                                    console.log("haha:"+JSON.stringify(this.stores));
                                    return;
                                } else {
                                    this.updateTree(tree1[i].children, tree2[j].children);
                                }
                            }
                        }
//                    }
                }
//                this.$refs['tree'].updateData();
//
//                if (tree2[i].children.length > tree1[i].children.length) {
//                    tree1[i].children = tree2[i].children;
//                    tree1[i].expand = true;

//                    return;
//                } else {
//                    this.updateTree(tree1[i].children, tree2[i].children);
//                }
            },
            changePage (pageIndex) {
                this.current = pageIndex;
                this.search();
            },
            show(item) {
                this.storeItem = null;
                this.$nextTick(function () {
                    this.storeItem = item;
                    this.editType = item.status==0?'EDIT':'GROUNDING'
                });
            },
            edit(index) {
                this.prompt({
                    title: "门店信息维护",
                    code: 'storeGroundingManageCard',
                    props: {
                        editType: 'EDIT',
                        storeItem: this.stores[index]
                    },
                    width: 900,
                    height: 500,
                    callback: (close) => {
                        this.search();
                        close();
                    }
                });
            },
            unGrounding (index) {
                this.$Modal.confirm({
                    title: '门店下架确认',
                    content: '<p>门店下架时也会把该门店的顾问全部下架，您确定要下架这个门店吗？</p>',
                    onOk: () => {
                        this.request({
                            url: "/systemManage/organization/storeGrounding/unGrounding.do",
                            param: {
                                id: this.stores[index].deptId,
                            }
                        }).then(data => {
                            this.$Message.success('门店下架成功!');
                            this.search();
                        });
                    },
                });
            },
            grounding(index) {
                this.prompt({
                    title: "门店信息上架",
                    code: 'storeGroundingManageCard',
                    props: {
                        editType: 'GROUNDING',
                        storeItem: this.stores[index]
                    },
                    width: 900,
                    height: 500,
                    callback: (close) => {
                        this.search();
                        close();
                    }
                });
            }
        }
    };
</script>

<style scoped>
    .container {
        background: #f6f6f6;
    }
    .panel {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 48px;
        padding: 7px;
        background: white;
        border-bottom: solid 1px #dddee1;
    }
    .left {
        position: absolute;
        top: 48px;
        left: 0;
        bottom: 0;
        width: 350px;
        padding-bottom: 10px;
        border-right: solid 1px #dddee1;
        overflow-x: hidden;
        overflow-y: auto;
        background-color: white;
    }
    .center {
        position: absolute;
        top: 48px;
        left: 350px;
        right: 0px;
        bottom: 0;
        background: #f7f7f7;
        overflow-x: hidden;
        overflow-y: auto;
    }
</style>