<style scoped>
</style>
<template>
    <div style="padding: 15px">
        <Table :columns="type=='info'?infoColumnsList:produceColumnsList" :data="materialList" highlight-row @on-current-change="selectOne"></Table>
    </div>
</template>

<script type="text/babel">
    var keyBook = {
        tf:{
            '1':'是',
            '0':'否'
        },
        infoType:{
            'ORIGINAL':'原件',
            'ELECTRONIC':'电子版',
            'COPY':'复印件',
            'PAPER':'纸质'
        },
        from:{
            'CUSTOMER':'客户',
            'COMPANY':'服务公司',
            'OTHER':'其他'
        }
    };

    var renderKeyBook = function(h,params,type){
        var key = params.column.key;
        return h('span',keyBook[type][params.row[key]]);
    };

    export default {
        data () {
            return {
                infoColumnsList:[
                    {
                        title: '资料名称',
                        key: 'name'
                    },
                    {
                        title: '资料类型',
                        key: 'type',
                        render:(h, params) => {
                            return renderKeyBook(h,params,'infoType');
                        }
                    },
                    {
                        title: '资料准备方',
                        key: 'from',
                        render:(h, params) => {
                            return renderKeyBook(h,params,'from');
                        }
                    },
                    {
                        title: '是否存档',
                        key: 'isStored',
                        render:(h, params) => {
                            return renderKeyBook(h,params,'tf');
                        }
                    }
                ],
                produceColumnsList:[
                    {
                        title: '资料名称',
                        key: 'name'
                    },
                    {
                        title: '资料类型',
                        key: 'type',
                        render:(h, params) => {
                            return renderKeyBook(h,params,'infoType');
                        }
                    },
                    {
                        title: '是否返还客户',
                        key: 'isReverted',
                        render:(h, params) => {
                            return renderKeyBook(h,params,'tf');
                        }
                    },
                    {
                        title: '是否存档',
                        key: 'isStored',
                        render:(h, params) => {
                            return renderKeyBook(h,params,'tf');
                        }
                    }
                ]
            }
        },
        props: {
            type:{
                type:String,
                default:''
            },
            materialList:{
                type:Array,
                default:[]
            }
        },
        created: function () {
        },
        methods: {
            selectOne(currentRow){
                this.callback(currentRow);
            }
        }
    };
</script>

