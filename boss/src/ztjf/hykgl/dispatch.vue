<template>
    <div>
        <Row>
            <label>请选择派卡对象</label>
        </Row>
        <Row type="flex">
            <i-col span="12">
                <auto-comp
                        v-if="!this.isInsideDispatch"
                        ref="searchName"
                        v-model="searchName"
                        icon="ios-search"
                        placeholder="请输入机构名称进行查询"
                        @on-search="searchList"
                        @on-select="getOrg"
                        style="width:335px;">
                    <Option v-for="option in searchResult" :value="option.name" :key="option.id">
                        {{option.name}}
                    </Option>
                </auto-comp>

                <Tree ref="tree" :data="stores" :load-data="loadData" :render="renderContent" class="orgTree"></Tree>
            </i-col>
        </Row>
    </div>
</template>

<script>
    export default {
        props: {
            clueId: null,
            oppoId: null,
            orgId: null
        },
        data() {
            return {
                searchName: '',
                searchResult: [],
                stores: [],
                orgIdActive: null,
                storeItem: null,
                isInsideDispatch: false, // 是否是内部商机派单
            };
        },
        created() {
            if (this.orgId) {
                this.isInsideDispatch = true;
                this.search(this.orgId);
            } else {
                this.search();
            }
        },
        methods: {
            search(orgId = 0, callback, item) {
                let url = '';
                if (this.isInsideDispatch) {
                    url = '/crm/clueManagement/dispatch/currentOrgsByOrgId.do';
                } else {
                    url = '/crm/clueManagement/dispatch/orgsByArea.do';
                }
                this.request({
                    url: url,
                    param: {
                        orgId: orgId,
                    }
                }).then(data => {
                    this.orgIdActive = null;

                    if (callback) {
                        callback(data);
                        if (data && !data.length) {
                            delete item.loading;
                        }
                        return;
                    } else {
                        this.stores = data;
                    }
                });
            },
            loadData(item, callback) {
                this.search(item.id, callback, item);
            },
            searchList() {
                this.request({
//                    url: "/systemManage/organization/storeGrounding/searchStores.do",
                    url: "/crm/clueManagement/dispatch/orgsByName.do",
                    param: {
                        orgName: this.searchName,
                    }
                }).then(data => {
                    this.searchResult = data || [];
                    this.$refs.searchName.toggleMenu(this.searchResult && this.searchResult.length > 0);
                });
            },
            getOrg(value) {
                this.searchResult.map(item => {
                    if (item.name == value) {
                        this.request({
//                            url: "/systemManage/organization/storeGrounding/getOrgTree.do",
                            url: "/crm/clueManagement/dispatch/orgsByOrgId.do",
                            param: {
                                orgId: item.id,
                            }
                        }).then(data => {
                            this.stores = data;
                            this.orgIdActive = item.id;
                            this.orgsItemHandle(item.id, item.name);

                            this.storeItem = null;
                            this.$nextTick(function () {
                                this.storeItem = item;
                            });
                        });
                    }
                });
            },
            renderContent(h, {root, node, data}) {
                return h('div', {
                    style: {
                        display: 'inline-flex',
                        width: '100%',
                        position: 'relative'
                    },
                    on: {
                        click: () => {
                            this.orgsItemHandle(data.id, data.name);
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
                                display: 'flex',
                                'justify-content': 'space-between',
                                backgroundColor: this.orgIdActive === data.id ? '#d4e8fb' : '#ffffff',
                                borderRadius: '3px',
                                height: '18px',
                                cursor: 'pointer',
                            },
                            attrs: {
                                class: 'dispatchNumberWrap'
                            }
                        }, [
                            h('span', {
                                style: {
                                    marginLeft: '5px',
                                    marginRight: '5px',
                                }
                            }, data.name),
                        ]),
                    ]),
                ]);
            },
            orgsItemHandle(orgId, orgName) {
                this.orgIdActive = orgId;
                this.$emit('orgSelected', {
                    orgId: orgId,
                    orgName: orgName
                });
            },
        }
    }
</script>

<style scoped>
    .orgTree {
        margin-top: 10px;
    }

    .personsWrap > li {
        padding: 5px;
        cursor: pointer;
    }

    .orgTree >>> .ivu-badge-count,
    .personsNumberWrap >>> .ivu-badge-count {
        background-color: #ff8066;
    }

    .personsWrap li.active .ivu-row-flex {
        background: #d4e8fb;
    }
</style>