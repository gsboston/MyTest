<template>
    <div class="container">
        <div class="center">
            <br/>
            <Table size="small" :data="items" :columns="tableColumns" highlight-row></Table>
            <br/>
            <Page size="small" :total="total" :current="current" :page-size="pageSize" @on-change="changePage"></Page>
        </div>
    </div>
</template>

<script>
    export default {
        props: {id: null},
        data: function () {
            return {
                curPage: 1,
                pageSize: 10,
                items: [],
                total: 0,
                current: 1,
                tableColumns: [{
                    title: '用户名',
                    key: 'operUserName'
                }, {
                    title: '操作项', align: 'center', key: 'operType', render: (h, params) => {
                        return params.row.operTypeDict.name;
                    }
                }, {
                    title: '组织名称',
                    key: 'orgName'
                }, {
                    title: '变更数据', align: 'center', width: 200, key: 'operType', render: (h, params) => {
                        if (params.row.operType == 1) {
                            return '账套总量：' + params.row.totalNum;
                        } else {
                            return '账套总量：' + params.row.totalNum + '    使用时长：' + params.row.packageTypeDict.name;
                        }
                    }
                }, {
                    title: '操作时间', align: 'center', key: 'tsInsert', render: (h, params) => {
                        return this.getLocalTime(this.items[params.index].tsInsert);
                    }
                }]
            }
        },
        created: function () {
            this.search();
        },
        methods: {
            search() {
                this.request({
                    url: "/zhzt/orgOperPage.do",
                    param: {
                        orgId: this.id,
                        curPage: this.curPage,
                        pageSize: this.pageSize
                    }
                }).then(demand => {
                    this.items = demand.records;
                    this.current = demand.current;
                    this.total = demand.total;
                });
            },
            changePage(pageIndex) {
                this.curPage = pageIndex;
                this.search();
            },
            getLocalTime(nS) {
                let fmt = "yyyy-MM-dd hh:mm:ss";
                let dates = new Date(nS);
                if (/(y+)/.test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (dates.getFullYear() + '').substr(4 - RegExp.$1.length));
                }
                let o = {
                    'M+': dates.getMonth() + 1,
                    'd+': dates.getDate(),
                    'h+': dates.getHours(),
                    'm+': dates.getMinutes(),
                    's+': dates.getSeconds()
                };
                // 遍历这个对象
                for (let k in o) {
                    if (new RegExp(`(${k})`).test(fmt)) {
                        let str = o[k] + '';
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : this.padLeftZero(str));
                    }
                }
                return fmt;
            },
            padLeftZero(str) {
                return ('00' + str).substr(str.length);
            }
        }
    };
</script>