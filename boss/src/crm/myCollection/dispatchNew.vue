<template>
    <Row class="batchTreeWrap" type="flex">
        <i-col span="12">
            <auto-comp
                    :disabled="!orgTreeEditAble"
                    v-if="!this.isInsideDispatch"
                    ref="searchName"
                    v-model="searchName"
                    icon="ios-search"
                    placeholder="按组织名称查询"
                    @on-search="searchList"
                    @on-select="getOrg"
                    style="width:300px;">
                <Option v-for="option in searchResult" :value="option.name" :key="option.id">
                    {{option.name}}
                </Option>
            </auto-comp>

            <Tree ref="tree" :data="stores" :load-data="loadData" :render="renderContent" class="orgTree" :disabled="!orgTreeEditAble"></Tree>
        </i-col>
        <i-col span="9" offset="2">
            <ul class="personsWrap">
                <li :class="{active: personsIdActive === item.id}" v-for="(item, index) in persons" @click="orgTreeEditAble && personsItemHandle(item.id, item)">
                    <Row type="flex" justify="space-between" align="middle">
                        <i-col>
                            <!--<div class="personsName" :disabled="item.collectCount >= COLLECT_UPPER_LIMIT || item.id === $context.getCurrentUser().id">{{ item.realName }}（{{ item.userName }}）</div>-->
                            <div class="personsName" >{{ item.realName }}（{{ item.userName }}）</div>
                        </i-col>
                        <i-col offset="1">
                            <Row type="flex" class="personsNumberWrap">
                                <i-col>
                                    <Badge :title="'派单量' + (item.innerDispatchCount || 0) + ' / ' + '收藏量' + (item.collectCount || 0)" v-if="isInsideDispatch">
                                        <sup class="ivu-badge-count">{{ (item.innerDispatchCount || '0') + ' / ' + (item.collectCount || '0') }}</sup>
                                    </Badge>
                                    <Badge :title="'派单量' + (item.dispatchCount || 0) + ' / ' + '收藏量' + (item.collectCount || 0)" v-else>
                                        <sup class="ivu-badge-count">{{ (item.dispatchCount || '0') + ' / ' + (item.collectCount || '0') }}</sup>
                                    </Badge>
                                </i-col>
                            </Row>
                        </i-col>
                    </Row>
                </li>
                <li v-if="orgIdActive && !persons.length" class="nodata">{{ nodataTips }}</li>
            </ul>
        </i-col>
    </Row>
</template>

<script>
    export default {
        props: {
            clueId: null,
            oppoId: null,
            orgId: null,
            orgName: null,
            userId: null,
            disabled: null
        },
        data() {
            return {
                searchName: '',
                searchResult: [],
                stores: [],
                persons: [],
                orgActive: null,
                orgIdActive: null,
                personsIdActive: null,
                storeItem: null,
                nodataTips: '该组织暂无销售人员，暂无法派单。',
                isInsideDispatch: false, // 是否是内部派单
                COLLECT_UPPER_LIMIT: 300, // 收藏量上限
                orgTreeEditAble: false, // 组织树是否可编辑，默认不可编辑
            };
        },
        created() {
            if (this.orgId && this.userId) {
                // 通过组织 id 和用户 id 定位当前组织和人
                this.toOrgTree({
                    orgId: this.orgId,
                    org: {'name': this.orgName},
                    userId: this.userId,
                    operationNote: 0
                })
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
                    this.orgActive = null;
                    this.orgIdActive = null;
                    this.personsIdActive = null;

                    if (callback) {
                        callback(data);
                        if (data && !data.length) {
                            delete item.loading;
                        }
                        return;
                    } else {
                        this.stores = data;
                        this.persons = [];
                    }

                    if (this.isInsideDispatch) {
                        this.getPersons(orgId);
                    }
                });
            },
            loadData(item, callback) {
                this.search(item.id, callback, item);
            },
            searchList() {
                this.request({
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
                        this.getOrgsByOrgId(item);
                    }
                });
            },
            getOrgsByOrgId(item, callback) {
                this.request({
                    url: "/crm/clueManagement/dispatch/orgsByOrgId.do",
                    param: {
                        orgId: item.id,
                    }
                }).then(data => {
                    this.stores = data;
                    this.persons = [];
                    this.orgActive = item;
                    this.orgIdActive = item.id;
//                            this.orgIdActive = null;
                    this.personsIdActive = null;
                    this.orgsItemHandle(item, callback);

//                    this.storeItem = null;
//                    this.$nextTick(function () {
//                        this.storeItem = item;
//                    });
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
                            if (!this.orgTreeEditAble) {
                                return;
                            }
                            this.orgsItemHandle(data);
//                            this.getPersons(data.id, personsLength => {
//                                this.$emit('orgSelected', {
//                                    orgId: data.id,
//                                    haveUsers: personsLength ? true : false,
//                                    noUsersTips: this.nodataTips
//                                });
//                            });
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
//                            h('Icon', {
//                                style: {
//                                    marginLeft: '5px',
//                                },
//                                props: {
//                                    type: data.status == 0 ? 'checkmark-round' : 'close-round',
//                                    color: data.status == 0 ? '#59b399':(this.storeItem!=null && data.id==this.storeItem.id ? '#d4e8fb' : '#ffffff'),
//                                    size: '16',
//                                },
//                            }),
                            h('span', {
                                style: {
                                    marginLeft: '5px',
                                    marginRight: '5px',
                                    overflow: 'hidden',
                                }
                            }, data.name),
                            h('Badge', {
                                props: {
                                    count: this.isInsideDispatch ? data.innerDispatchCount : data.dispatchCount
                                },
                                attrs: {
                                    title: '派单量' + (this.isInsideDispatch ? data.innerDispatchCount : data.dispatchCount)
                                },
                                style: {
                                    display: (this.isInsideDispatch ? data.innerDispatchCount : data.dispatchCount) ? 'inline-block' : 'none',
                                    cursor: 'pointer'
                                }
                            }),
//                            h('span', {
//                                class: {
//                                    dispathCount: true
//                                },
//                                style: {
//                                    display: data.dispatchCount ? 'block' : 'none'
//                                }
//                            }, data.dispatchCount),
                        ]),
                    ]),
                ]);
            },
            getPersons(orgId, callback) {
                this.request({
                    url: "/crm/clueManagement/dispatch/personsByOrg.do",
                    param: {
                        orgId: orgId,
                    }
                }).then(data => {
                    this.persons = data || [];
                    this.orgIdActive = orgId;
                    this.personsIdActive = null;
                    callback && callback(this.persons.length);
                });
            },
            orgsItemHandle(item, callback) {
                this.orgActive = item;
                this.getPersons(item.id, personsLength => {
                    if (callback) {
                        callback();
                        return;
                    }

                    this.$emit('orgSelected', {
                        orgId: item.id,
                        orgName: item.name,
                        haveUsers: personsLength ? true : false,
                        noUsersTips: this.nodataTips
                    });
                });
            },
            personsItemHandle(userId, item) {
//                if (item.collectCount >= this.COLLECT_UPPER_LIMIT) {
//                    this.$Message.warning('收藏数量已经到达最大限制：300');
//                    return;
//                }
//                if (userId === this.$context.getCurrentUser().id) {
//                    this.$Message.warning('暂不支持给自己派单');
//                    return;
//                }
                this.personsIdActive = userId;

                this.$emit('orgSelected', {
                    orgId: this.orgIdActive,
                    userId,
                    realName: item.realName,
                    orgName: this.orgActive.name,
                    phone: item.phone,
                });
            },
            save() {
                this.request({
                    url: "/crm/clueManagement/dispatch/dispatchOppo.do",
                    data: {
                        clueId: this.clueId,
                        oppoId: this.oppoId,
                        orgId: this.orgIdActive,
                        userId: this.personsIdActive
                    }
                }).then(data => {
                    this.callback('success');
                    this.$Message.success('派单成功');
                });
            },
            /**
             * 定位到组织树相应的组织和人
             * @param item
             */
            toOrgTree(item) {
                this.getOrgsByOrgId({
                    id: item.orgId,
                    name: item.org && item.org.name
                }, () => {
                    if (!item.operationNote) {
                        for (let person of this.persons) {
                            if (person.id === item.userId) {
                                this.personsItemHandle(person.id, person);
                                break;
                            }
                        }
                    }
                });
            }
        },
        watch: {
            'disabled'(newValue) {
                this.orgTreeEditAble = !newValue;
            }
        }
    };
</script>

<style scoped>
    .batchTreeWrap {
        position: relative;
        height: 100%;
    }
    .batchTreeWrap > .ivu-col {
        max-height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .orgTree {
        margin-top: 10px;
    }
    /*.orgTree >>> .dispathCount {*/
    /*position: absolute;*/
    /*right: 0;*/
    /*top: 0;*/
    /*}*/
    /*.orgTree >>> .dispathCount,*/
    /*.personsNumber {*/
    /*min-width: 20px;*/
    /*height: 20px;*/
    /*line-height: 20px;*/
    /*-webkit-border-radius: 10px;*/
    /*-moz-border-radius: 10px;*/
    /*border-radius: 10px;*/
    /*background: #f00;*/
    /*color: #fff;*/
    /*text-align: center;*/
    /*}*/
    .personsWrap {
        margin-top: 32px;
    }
    .personsWrap > li {
        padding: 5px;
        cursor: pointer;
    }
    .orgTree >>> .ivu-badge-count,
    .personsNumberWrap >>> .ivu-badge-count {
        position: relative;
        top: 0;
        right: 0;
        background-color: #ff8066;
    }
    .nodata {
        text-align: center;
    }
    .personsWrap li.active .ivu-row-flex {
        background: #d4e8fb;
    }
    .personsName[disabled] {
        color: #bbb;
    }
    .personsWrap .ivu-col:first-child {
        flex: 1;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
    }
</style>