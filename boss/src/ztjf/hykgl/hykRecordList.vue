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
                    title: '卡名称',
                    key: 'cardName',
                    width: '200'
                }, {
                    title: '卡类型', align: 'center', key: 'cardType', render: (h, params) => {
                        return params.row.cardTypeDict.name;
                    }
                }, {
                    title: '操作项', align: 'center', key: 'optType', render: (h, params) => {
                        return params.row.optTypeDict.name;
                    }
                }, {
                    title: '操作人',
                    key: 'operator'
                }, {
                    title: '操作时间', align: 'center', width: 200, key: 'tsInsert', render: (h, params) => {
                        return this.getLocalTime(this.items[params.index].tsInsert);
                    }
                }, {
                    title: '操作',
                    key: 'action',
                    align: 'left',
                    render: (h, params) => {
                        if (params.row.serialNo) {
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
                                            this.downloadCard(params.row.cardName, params.row.serialNo);
                                        }
                                    }
                                }, '下载'),
                            ]);
                        }
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
                    url: "/hykgl/getHykglRecordList.do",
                    param: {
                        cardId: this.id,
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
            },
            downloadCard(cardName, serialNo) {
                this.request({
                    url: "/hykgl/getHost.do"
                }).then(res => {
                    const a = document.createElement('a');
                    const objectUrl = '/ztjf-api/ztjf/free/vipcard/ztjfVipCardRecord/printExport?serialNo=' + serialNo;
                    document.body.appendChild(a);
                    a.setAttribute('style', 'display:none');
                    a.setAttribute('href', objectUrl);
                    a.setAttribute('download', cardName + ".xls");
                    a.click();
                    URL.revokeObjectURL(objectUrl);
                });
            }
        }
    };
</script>