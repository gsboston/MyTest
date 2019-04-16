<template>
    <div id="contracTable" class="contrac-table">
        <div class="header">
            <div class="head-left">业务线走势报表</div>
            <div class="head-right"><div>报表日期：（{{serTime}}）当前层级：{{curLive}}</div><img src="static/report/save.png" @click="downloadExl(dataList)"><img src="static/report/jump.png" @click="reback"></div><!--  当前层级：{{curLive}}-->
        </div>
        <table class="gridtable" v-show="isok">
            <tbody>
            <tr class="firstRow">
                <td valign="top" colspan="1" rowspan="2" >
                    年份<br/>
                </td>
                <td valign="top" colspan="1" rowspan="2" >
                    门店
                </td>
                <td valign="top" colspan="5" rowspan="1" v-for="item in headData">
                    {{item}}
                </td>
            </tr>
            <tr class="firstRow">
                <template v-for="item in headData">
                    <td width="72" valign="top" >
                        签单数
                    </td>
                    <td width="72" valign="top" >
                        应收款
                    </td>
                    <td width="72" valign="top" >
                        实际收款
                    </td>
                    <td width="72" valign="top" >
                        待收款
                    </td>
                    <td width="72" valign="top" >
                        排名
                    </td>
                </template>

            </tr>
            <tr v-for="(item, index) in dataList">

                <td width="72" valign="top" :rowspan="dataList.length" v-if="index == 0">
                    {{serTime}}<br/>
                </td>
                <td width="72" valign="top" v-for="sub in item">
                    {{sub}}
                </td>
            </tr>

            </tbody>
        </table>
        <div v-show="!isok" class="backImg"><img src="./image/no.png"> </div>
    </div>
</template>

<script type="es6">

    import XLSX from 'xlsx'

    export default {
        props: {
            params:null
        },
        data: function () {
            return {
                isok: false,
                headData:[],
                dataList:[],
                serTime: '',
                httpParams: {},
                n_to_c: ['B1', 'G1', 'L1', 'Q1', 'V1', 'AA1', 'AF1'],
                wopts: { bookType: 'xlsx', bookSST: true, type: 'binary' },
                curLive: '集团'

            }
        },

        created: function () {
            //获取数据
            this.isok = false;

        },
        methods: {
            reback() {
                this.isok = false;
                this.$emit('changeContractsFlag', '')
            },
            getTableData() {
                this.request({
                    url: '/report/bossReport/serviceForReport.do',
                    param: {
                        year:this.httpParams.year,
                        timeType:this.httpParams.timeType,
                        level:this.httpParams.levelName,
                        query:this.httpParams.levelValue
                    }
                }).then((data) => {
                    if(data.list.length>0) {
                        this.isok = true;
                    }
                    this.dataList = data.list;
                    this.headData = data.xlist;
                    this.serTime = data.start + ' 到 ' + data.end
                })
            },
            //导出相关 xlsx
            saveAs(obj, fileName) {//当然可以自定义简单的下载文件实现方式
                var tmpa = document.createElement("a");
                tmpa.download = fileName || "下载";
                tmpa.href = URL.createObjectURL(obj); //绑定a标签
                tmpa.click(); //模拟点击实现下载
                setTimeout(function () { //延时释放
                    URL.revokeObjectURL(obj); //用URL.revokeObjectURL()来释放这个object URL
                }, 100);
            },
            downloadExl(data, type) {
                //console.log(this.headData);
                //console.log(this.dataList);
                let sub = [];
                sub.push('');
                this.headData.forEach((item, index, arr)=>{
                    //data[this.n_to_c[index]] = { t: "s", v: item };
                    sub.push('签单数');
                    sub.push('应收款');
                    sub.push('实收款');
                    sub.push('待收款');
                    sub.push('排名');
                })
                //this.dataList.push(sub)

                data = this.dataList;
                data.splice(0, 0, sub);   //添加第二行数据
                var wb = { SheetNames: ['Sheet1'], Sheets: {}, Props: {} };
                //wb.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(data);//通过json_to_sheet转成单页(Sheet)数据
                data = XLSX.utils.json_to_sheet(data);

                let merSet = [{s:{c:0, r:1}, e:{c:0, r:0}}];
                let s_sol = 1;
                let e_sol = 5;
                data['A1'] = { t: "s", v: '门店('+ this.serTime +')'};
                this.headData.forEach((item, index, arr)=>{
                    data[this.n_to_c[index]] = { t: "s", v: item };
                    if(index == 0) {
                        merSet.push({s:{c:s_sol, r:0}, e:{c:e_sol, r:0}});
                    } else {
                        s_sol += 5
                        e_sol += 5
                        merSet.push({s:{c:s_sol, r:0}, e:{c:e_sol, r:0}});
                    }

                })
                //data["C1"] = { t: "s", v: "知识产权" };
                //data["H1"] = { t: "s", v: "税收筹划" };

                data["!merges"] = merSet;

                wb.Sheets['Sheet1'] = data;
                this.saveAs(new Blob([this.s2ab(XLSX.write(wb, this.wopts))], { type: "application/octet-stream"}), "报表" + '.' + (this.wopts.bookType == "biff2" ? "xls" : this.wopts.bookType));
            },
            s2ab(s) {
                if (typeof ArrayBuffer !== 'undefined') {
                    var buf = new ArrayBuffer(s.length);
                    var view = new Uint8Array(buf);
                    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                    return buf;
                } else {
                    var buf = new Array(s.length);
                    for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
                    return buf;
                }
            }
        },
        mounted(){
            this.$nextTick(function() {
                //this.getTableData()
            })
        },
        watch: {
            params: {
                handler(val, oldVal) {
                    console.log(123123)
                    this.httpParams = val;

                    if(this.httpParams.levelName == 'EQ_GROUP') {
                        this.curLive = '集团'
                    }
                    if(this.httpParams.levelName == 'WAR_ZONE') {
                        this.curLive = '战区'
                    }
                    if(this.httpParams.levelName == 'PROVINCE') {
                        this.curLive = '省份'
                    }
                    if(this.httpParams.levelName == 'STORE') {
                        this.curLive = '门店'
                    }

                    this.getTableData()
                },
                deep: true
            }
        },
        components: {

        }
    };
</script>

<style scoped>

    .contrac-table{
        padding: 10px 0;
        background-color: #fff;
        height: 430px;
        /*overflow:auto;*/
    }
    .header{
        width:100%;
        height:50px;
        display: inline-block;
        /*background-color: #f8f8f9;*/
        margin-bottom: -5px;
        /*border:1px solid #dddee1;*/
        /*border-bottom:none;*/
    }
    .header .head-left{
        float: left;
        padding-left:20px;
        height:30px;
        line-height:30px;
        text-align: left;
        font-size:16px;
        font-weight: bold;
        margin-top:10px;
        color: #666;
        font-weight: normal;
    }
    .header .head-right{
        float: right;
        padding-right:20px;
        height:30px;
        line-height:30px;

    }
    .header .head-right div{
        width: 330px;
        float: left;
        margin: 12px;
    }
    .header .head-right img{
        padding-left:15px;

        margin-top:11px;
    }
    table.gridtable {
        font-family: verdana,arial,sans-serif;
        font-size:11px;
        color:#333333;
        border-width: 1px;
        border-color: #dddee1;
        border-collapse: collapse;
        overflow:auto;
        height: 370px;
        width: 100%;
        display: block;
    }
    table.gridtable th {
        border-width: 1px;
        padding: 8px;
        border-style: solid;
        border-color: #dddee1;
        background-color: #dedede;
    }
    table.gridtable td {
        border-width: 1px;
        padding: 8px;
        border-style: solid;
        border-color: #dddee1;
        background-color: #ffffff;
        text-align: center;
        vertical-align: middle;

    }
    .firstRow td{
        background-color: #ebf1de !important;
        color:#495060;
        font-weight: bold;
    }

    .backImg{
        text-align: center;
        margin-top: 50px;
    }

    .backImg img{
        width:150px;
        height:150px;
    }

</style>