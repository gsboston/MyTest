<template>
    <div>
        <Form ref="searchEye" :model="searchEye" :rules="ruleValidate" :label-width="80" inline>
            <!--搜索条件-->
            <div class="eye-queryBar">
                <div class="condition">搜索条件</div>
                <Row>
                    <i-Col span="23">
                        <FormItem label="范围" prop="range" style="width: 96%;">
                            <Input placeholder="大于0且小于等于5的整数" v-model="searchEye.range" :maxlength="1"
                                   @on-change="conditionalChange(searchEye.range, '范围')"></Input>
                        </FormItem>
                    </i-Col>
                    <i-Col span="1">
                        <span style="line-height: 32px;">km</span>
                    </i-Col>
                </Row>
                <FormItem label="行业" prop="industry" style="width: 100%;">
                    <Select clearable v-model="searchEye.oneIndustry"
                            @on-change="conditionalChange(searchEye.oneIndustry, '行业', industryList)"
                            filterable>
                        <Option v-for="item in industryList" :value="item.code"
                                :key="item.code">{{ item.name }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="注册时间" prop="registerTime" style="width: 100%;">
                    <DatePicker type="daterange" :options="options2" placement="bottom-start" placeholder="选择日期"
                                style="width:100%" v-model="searchEye.registerTime"
                                @on-change="conditionalChangeS('searchEye.registerTime', '注册时间')"
                                :format="'yyyy-MM-dd'"></DatePicker>
                </FormItem>
                <FormItem label="注册资本" prop="registeredCapital" style="width: 100%;">
                    <Select clearable v-model="searchEye.registeredCapital"
                            @on-change="conditionalChange(searchEye.registeredCapital, '注册资本', registeredCapitalList)"
                            filterable>
                        <Option v-for="item in registeredCapitalList" :value="item.code"
                                :key="item.code">{{ item.name }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem style="width: 100%;">
                    <Button type="primary" @click="searchEyeMap('searchEye')" style="width: 200px; margin-left: -17px;">
                        查一下
                    </Button>
                </FormItem>
            </div>
            <div class="eye-main">
                <div class="eye-box">
                    <!--已选条件-->
                    <div class="eye-searchBar">
                        <Row style="line-height: 30px;">
                            <i-col span="3" style="color: #999; width: 70px;">
                                已选条件：
                            </i-col>
                            <i-col span="21">
                                <Tag :title="item.name + ':' + item.val" class="ivu-tag-new" type="border"
                                     closable color="blue"
                                     v-for="(item, index) in selectedConditionList" :key="index"
                                     @on-close="delSelectedCondition(item)" v-show="item.val">
                                    {{item.name + ':' + item.val}}
                                </Tag>
                                <div class="del-all" @click="delAllSelectedCondition(selectedConditionList)">重置条件</div>
                            </i-col>
                        </Row>
                    </div>
                    <div class="eye-container">
                        <div id="container"></div>
                        <div class="mapPosition" v-if="mapPositionVisible">
                            <i-input v-model.trim="mapSearchValue" placeholder="请输入地址..." @keyup.native.enter="mapSearch">
                                <Button slot="append" icon="ios-search" @click.native="mapSearch"></Button>
                            </i-input>
                        </div>
                    </div>
                </div>
            </div>
        </Form>
    </div>
</template>

<script>
    import Map from "../../core/component/map";
    export default {
        props: {
            searchObj: null
        },
        data: function () {
            return {
                searchEye: {
                    range: '3',
                    registeredCapital: '',
                    registerTime: ["", ""],
                    oneIndustry: ''
                },//查询时提交到node层的对象
                registeredCapitalList: [],//注册资本列表数据
                industryList: [
                    {
                        "code": "不限",
                        "secList": [],
                        "name": "不限"
                    },
                    {
                        "code": "D",
                        "name": "电力、热力、燃气及水生产和供应业",
                        "secList": [
                            {
                                "secnduName": "全部",
                                "secInduCode": "D"
                            },
                            {
                                "secnduName": "燃气生产和供应业",
                                "secInduCode": "45"
                            },
                            {
                                "secnduName": "电力、热力生产和供应业",
                                "secInduCode": "44"
                            },
                            {
                                "secnduName": "水的生产和供应业",
                                "secInduCode": "46"
                            }
                        ]
                    },
                    {
                        "code": "E",
                        "name": "建筑业",
                        "secList": [
                            {
                                "secnduName": "全部",
                                "secInduCode": "E"
                            },
                            {
                                "secnduName": "建筑安装业",
                                "secInduCode": "49"
                            },
                            {
                                "secnduName": "土木工程建筑业",
                                "secInduCode": "48"
                            },
                            {
                                "secnduName": "房屋建筑业",
                                "secInduCode": "47"
                            },
                            {
                                "secnduName": "建筑装饰和其他建筑业",
                                "secInduCode": "50"
                            }
                        ]
                    },
                    {
                        "code": "F",
                        "name": "批发和零售业",
                        "secList": [
                            {
                                "secnduName": "全部",
                                "secInduCode": "F"
                            },
                            {
                                "secnduName": "批发业",
                                "secInduCode": "51"
                            },
                            {
                                "secnduName": "零售业",
                                "secInduCode": "52"
                            }
                        ]
                    },
                    {
                        "code": "G",
                        "name": "交通运输、仓储和邮政业",
                        "secList": [
                            {
                                "secnduName": "全部",
                                "secInduCode": "G"
                            },
                            {
                                "secnduName": "仓储业",
                                "secInduCode": "59"
                            },
                            {
                                "secnduName": "装卸搬运和运输代理业",
                                "secInduCode": "58"
                            },
                            {
                                "secnduName": "管道运输业",
                                "secInduCode": "57"
                            },
                            {
                                "secnduName": "航空运输业",
                                "secInduCode": "56"
                            },
                            {
                                "secnduName": "水上运输业",
                                "secInduCode": "55"
                            },
                            {
                                "secnduName": "邮政业",
                                "secInduCode": "60"
                            },
                            {
                                "secnduName": "铁路运输业",
                                "secInduCode": "53"
                            },
                            {
                                "secnduName": "道路运输业",
                                "secInduCode": "54"
                            }
                        ]
                    },
                    {
                        "code": "A",
                        "name": "农、林、牧、渔业",
                        "secList": [
                            {
                                "secnduName": "全部",
                                "secInduCode": "A"
                            },
                            {
                                "secnduName": "渔业",
                                "secInduCode": "04"
                            },
                            {
                                "secnduName": "农、林、牧、渔服务业",
                                "secInduCode": "05"
                            },
                            {
                                "secnduName": "农业",
                                "secInduCode": "01"
                            },
                            {
                                "secnduName": "林业",
                                "secInduCode": "02"
                            },
                            {
                                "secnduName": "畜牧业",
                                "secInduCode": "03"
                            }
                        ]
                    },
                    {
                        "code": "B",
                        "name": "采矿业",
                        "secList": [
                            {
                                "secnduName": "全部",
                                "secInduCode": "B"
                            },
                            {
                                "secnduName": "开采辅助活动",
                                "secInduCode": "11"
                            },
                            {
                                "secnduName": "其他采矿业",
                                "secInduCode": "12"
                            },
                            {
                                "secnduName": "黑色金属矿采选业",
                                "secInduCode": "08"
                            },
                            {
                                "secnduName": "有色金属矿采选业",
                                "secInduCode": "09"
                            },
                            {
                                "secnduName": "煤炭开采和洗选业",
                                "secInduCode": "06"
                            },
                            {
                                "secnduName": "石油和天然气开采业",
                                "secInduCode": "07"
                            },
                            {
                                "secnduName": "非金属矿采选业",
                                "secInduCode": "10"
                            }
                        ]
                    },
                    {
                        "code": "C",
                        "name": "制造业",
                        "secList": [
                            {
                                "secnduName": "全部",
                                "secInduCode": "C"
                            },
                            {
                                "secnduName": "专用设备制造业",
                                "secInduCode": "35"
                            },
                            {
                                "secnduName": "汽车制造业",
                                "secInduCode": "36"
                            },
                            {
                                "secnduName": "金属制品业",
                                "secInduCode": "33"
                            },
                            {
                                "secnduName": "通用设备制造业",
                                "secInduCode": "34"
                            },
                            {
                                "secnduName": "计算机、通信和其他电子设备制造业",
                                "secInduCode": "39"
                            },
                            {
                                "secnduName": "铁路、船舶、航空航天和其他运输设备制造业",
                                "secInduCode": "37"
                            },
                            {
                                "secnduName": "电气机械和器材制造业",
                                "secInduCode": "38"
                            },
                            {
                                "secnduName": "金属制品、机械和设备修理业",
                                "secInduCode": "43"
                            },
                            {
                                "secnduName": "废弃资源综合利用业",
                                "secInduCode": "42"
                            },
                            {
                                "secnduName": "其他制造业",
                                "secInduCode": "41"
                            },
                            {
                                "secnduName": "仪器仪表制造业",
                                "secInduCode": "40"
                            },
                            {
                                "secnduName": "造纸和纸制品业",
                                "secInduCode": "22"
                            },
                            {
                                "secnduName": "印刷和记录媒介复制业",
                                "secInduCode": "23"
                            },
                            {
                                "secnduName": "文教、工美、体育和娱乐用品制造业",
                                "secInduCode": "24"
                            },
                            {
                                "secnduName": "石油加工、炼焦和核燃料加工业",
                                "secInduCode": "25"
                            },
                            {
                                "secnduName": "化学原料和化学制品制造业",
                                "secInduCode": "26"
                            },
                            {
                                "secnduName": "医药制造业",
                                "secInduCode": "27"
                            },
                            {
                                "secnduName": "化学纤维制造业",
                                "secInduCode": "28"
                            },
                            {
                                "secnduName": "橡胶和塑料制品业",
                                "secInduCode": "29"
                            },
                            {
                                "secnduName": "非金属矿物制品业",
                                "secInduCode": "30"
                            },
                            {
                                "secnduName": "有色金属冶炼和压延加工业",
                                "secInduCode": "32"
                            },
                            {
                                "secnduName": "黑色金属冶炼和压延加工业",
                                "secInduCode": "31"
                            },
                            {
                                "secnduName": "皮革、毛皮、羽毛及其制品和制鞋业",
                                "secInduCode": "19"
                            },
                            {
                                "secnduName": "纺织业",
                                "secInduCode": "17"
                            },
                            {
                                "secnduName": "纺织服装、服饰业",
                                "secInduCode": "18"
                            },
                            {
                                "secnduName": "酒、饮料和精制茶制造业",
                                "secInduCode": "15"
                            },
                            {
                                "secnduName": "烟草制品业",
                                "secInduCode": "16"
                            },
                            {
                                "secnduName": "农副食品加工业",
                                "secInduCode": "13"
                            },
                            {
                                "secnduName": "食品制造业",
                                "secInduCode": "14"
                            },
                            {
                                "secnduName": "家具制造业",
                                "secInduCode": "21"
                            },
                            {
                                "secnduName": "木材加工和木、竹、藤、棕、草制品业",
                                "secInduCode": "20"
                            }
                        ]
                    },
                    {
                        "code": "L",
                        "name": "租赁和商务服务业",
                        "secList": [
                            {
                                "secnduName": "全部",
                                "secInduCode": "L"
                            },
                            {
                                "secnduName": "租赁业",
                                "secInduCode": "71"
                            },
                            {
                                "secnduName": "商务服务业",
                                "secInduCode": "72"
                            }
                        ]
                    },
                    {
                        "code": "M",
                        "name": "科学研究和技术服务业",
                        "secList": [
                            {
                                "secnduName": "全部",
                                "secInduCode": "M"
                            },
                            {
                                "secnduName": "研究和试验发展",
                                "secInduCode": "73"
                            },
                            {
                                "secnduName": "专业技术服务业",
                                "secInduCode": "74"
                            },
                            {
                                "secnduName": "科技推广和应用服务业",
                                "secInduCode": "75"
                            }
                        ]
                    },
                    {
                        "code": "N",
                        "name": "水利、环境和公共设施管理业",
                        "secList": [
                            {
                                "secnduName": "全部",
                                "secInduCode": "N"
                            },
                            {
                                "secnduName": "公共设施管理业",
                                "secInduCode": "78"
                            },
                            {
                                "secnduName": "生态保护和环境治理业",
                                "secInduCode": "77"
                            },
                            {
                                "secnduName": "水利管理业",
                                "secInduCode": "76"
                            }
                        ]
                    },
                    {
                        "code": "O",
                        "name": "居民服务、修理和其他服务业",
                        "secList": [
                            {
                                "secnduName": "全部",
                                "secInduCode": "O"
                            },
                            {
                                "secnduName": "居民服务业",
                                "secInduCode": "79"
                            },
                            {
                                "secnduName": "机动车、电子产品和日用产品修理业",
                                "secInduCode": "80"
                            },
                            {
                                "secnduName": "其他服务业",
                                "secInduCode": "81"
                            }
                        ]
                    },
                    {
                        "code": "H",
                        "name": "住宿和餐饮业",
                        "secList": [
                            {
                                "secnduName": "全部",
                                "secInduCode": "H"
                            },
                            {
                                "secnduName": "餐饮业",
                                "secInduCode": "62"
                            },
                            {
                                "secnduName": "住宿业",
                                "secInduCode": "61"
                            }
                        ]
                    },
                    {
                        "code": "I",
                        "name": "信息传输、软件和信息技术服务业",
                        "secList": [
                            {
                                "secnduName": "全部",
                                "secInduCode": "I"
                            },
                            {
                                "secnduName": "互联网和相关服务",
                                "secInduCode": "64"
                            },
                            {
                                "secnduName": "软件和信息技术服务业",
                                "secInduCode": "65"
                            },
                            {
                                "secnduName": "电信、广播电视和卫星传输服务",
                                "secInduCode": "63"
                            }
                        ]
                    },
                    {
                        "code": "J",
                        "name": "金融业",
                        "secList": [
                            {
                                "secnduName": "全部",
                                "secInduCode": "J"
                            },
                            {
                                "secnduName": "资本市场服务",
                                "secInduCode": "67"
                            },
                            {
                                "secnduName": "货币金融服务",
                                "secInduCode": "66"
                            },
                            {
                                "secnduName": "其他金融业",
                                "secInduCode": "69"
                            },
                            {
                                "secnduName": "保险业",
                                "secInduCode": "68"
                            }
                        ]
                    },
                    {
                        "code": "K",
                        "name": "房地产业",
                        "secList": [
                            {
                                "secnduName": "房地产业",
                                "secInduCode": "70"
                            }
                        ]
                    },
                    {
                        "code": "T",
                        "name": "国际组织",
                        "secList": [
                            {
                                "secnduName": "国际组织",
                                "secInduCode": "96"
                            }
                        ]
                    },
                    {
                        "code": "Q",
                        "name": "卫生和社会工作",
                        "secList": [
                            {
                                "secnduName": "全部",
                                "secInduCode": "Q"
                            },
                            {
                                "secnduName": "卫生",
                                "secInduCode": "83"
                            },
                            {
                                "secnduName": "社会工作",
                                "secInduCode": "84"
                            }
                        ]
                    },
                    {
                        "code": "P",
                        "name": "教育",
                        "secList": [
                            {
                                "secnduName": "教育",
                                "secInduCode": "82"
                            }
                        ]
                    },
                    {
                        "code": "S",
                        "name": "公共管理、社会保障和社会组织",
                        "secList": [
                            {
                                "secnduName": "全部",
                                "secInduCode": "S"
                            },
                            {
                                "secnduName": "基层群众自治组织",
                                "secInduCode": "95"
                            },
                            {
                                "secnduName": "群众团体、社会团体和其他成员组织",
                                "secInduCode": "94"
                            },
                            {
                                "secnduName": "社会保障",
                                "secInduCode": "93"
                            },
                            {
                                "secnduName": "人民政协、民主党派",
                                "secInduCode": "92"
                            },
                            {
                                "secnduName": "国家机构",
                                "secInduCode": "91"
                            },
                            {
                                "secnduName": "中国共产党机关",
                                "secInduCode": "90"
                            }
                        ]
                    },
                    {
                        "code": "R",
                        "name": "文化、体育和娱乐业",
                        "secList": [
                            {
                                "secnduName": "全部",
                                "secInduCode": "R"
                            },
                            {
                                "secnduName": "体育",
                                "secInduCode": "88"
                            },
                            {
                                "secnduName": "娱乐业",
                                "secInduCode": "89"
                            },
                            {
                                "secnduName": "广播、电视、电影和影视录音制作业",
                                "secInduCode": "86"
                            },
                            {
                                "secnduName": "文化艺术业",
                                "secInduCode": "87"
                            },
                            {
                                "secnduName": "新闻和出版业",
                                "secInduCode": "85"
                            }
                        ]
                    }
                ],//行业列表数据
                options2: {
                    shortcuts: [
//                        {
//                            text: '最近一周',
//                            value () {
//                                const end = new Date();
//                                const start = new Date();
//                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
//                                return [start, end];
//                            }
//                        },
//                        {
//                            text: '最近一个月',
//                            value () {
//                                const end = new Date();
//                                const start = new Date();
//                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
//                                return [start, end];
//                            }
//                        },
                        {
                            text: '最近三个月',
                            value () {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                return [start, end];
                            }
                        },
                        {
                            text: '最近半年',
                            value() {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
                                return [start, end];
                            }
                        },
                        {
                            text: '最近一年',
                            value() {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
                                return [start, end];
                            }
                        }
                    ]
                },
                orgAddress: '',//组织联系地址
                ruleValidate: {
                    range: [
                        {validator: this.validatorRange, trigger: 'change'}
                    ]
                },
                selectedConditionList: [
                    {
                        name: "范围",
                        val: "3",
                        tag: "range"
                    },
                    {
                        name: "行业",
                        val: "",
                        tag: "oneIndustry"
                    },
                    {
                        name: "注册时间",
                        val: "",
                        tag: "registerTime"
                    },
                    {
                        name: "注册资本",
                        val: "",
                        tag: "registeredCapital"
                    }
                ],//已选择查询条件数据,
                BMap: null, // 地图对象
                map: null, // 当前页面 map 对象
                mapSearchValue: '',
                mapPositionVisible: false
            }
        },
        created: function () {
            this.init();
            this.getOrgAddress();//获取组织联系地址
        },
        methods: {
            /*删除选择已选条件*/
            delSelectedCondition: function (item) {
                item.val = '';
                this.searchEye[item.tag] = '';
            },
            /*组合已选条件*/
            conditionalChange: function (val, name, arr) {
                if (arr) {
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].code == val) val = arr[i].name;
                    }
                }
                for (let i = 0; i < this.selectedConditionList.length; i++) {
                    if (this.selectedConditionList[i].name == name) this.selectedConditionList[i].val = val;
                }
            },
            /*选择时间控件处理*/
            conditionalChangeS(a, b) {
                this.$nextTick(() => {
                    a = eval("this." + a);
                    let str = '';
                    for (let i = 0; i < a.length; i++) {
                        str += window.DateFormat.dateToString(a[i]);
                        if (i == 0) str += '至';
                    }
                    if (str == '至') return;
                    this.conditionalChange(str, b);
                });
            },
            /*删除所有已选条件*/
            delAllSelectedCondition: function (arr) {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].name != "范围") {
                        arr[i].val = '';
                    } else {
                        arr[i].val = '3';
                    }
                }
                this.searchEye.range = '3';
                this.searchEye.registeredCapital = '';
                this.searchEye.registerTime = ["", ""];
                this.searchEye.oneIndustry = '';
            },
            /*初始化*/
            init: function () {
                this.registeredCapitalList = this.searchObj.registeredCapitalList;//注册资本列表数据
                this.searchEye.registeredCapital = this.searchObj.eye.registeredCapital;//注册资本
                this.searchEye.registerTime = this.searchObj.eye.registerTime;//注册时间
                this.conditionalChange(this.searchEye.registeredCapital, '注册资本', this.registeredCapitalList)
                this.conditionalChangeS('searchEye.registerTime', '注册时间')
            },
            /*获取组织联系地址*/
            getOrgAddress: function () {
                this.request({
                    url: '/crm/myCollection/getOrgAddress.do',
                }).then(orgAddress => {
                    this.orgAddress = orgAddress;
                    Map().then(BMap => {
                        var map = new BMap.Map("container");
                        this.BMap = BMap;
                        this.map = map;
                        map.enableScrollWheelZoom(true);
                        /*开启缩放功能*/
                        //添加控件和比例尺
                        var top_left_control = new BMap.ScaleControl({anchor: window.BMAP_ANCHOR_TOP_LEFT});// 左上角，添加比例尺
                        var top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
//                        var top_right_navigation = new BMap.NavigationControl({anchor: window.BMAP_ANCHOR_TOP_RIGHT, type: window.BMAP_NAVIGATION_CONTROL_SMALL}); //右上角，仅包含平移和缩放按钮
                        /*缩放控件type有四种类型:
                         BMAP_NAVIGATION_CONTROL_SMALL：仅包含平移和缩放按钮；BMAP_NAVIGATION_CONTROL_PAN:仅包含平移按钮；BMAP_NAVIGATION_CONTROL_ZOOM：仅包含缩放按钮*/
                        map.addControl(top_left_control);
                        map.addControl(top_left_navigation);
//                        map.addControl(top_right_navigation);
                        var geoc = new BMap.Geocoder();//创建地址解析器实例
                        // 将地址解析结果显示在地图上,并调整地图视野
                        geoc.getPoint(this.orgAddress, function (point) {
                            var tempPoint = '';
                            if (point) {
                                tempPoint = point;
                            } else {
                                tempPoint = new BMap.Point(116.404, 39.915);
                            }
                            map.centerAndZoom(tempPoint, 15);
                            draw(tempPoint);
                        }, "北京市");
                        //单击获取点击的经纬度
                        map.addEventListener("click", (e) => {
                            draw(e.point);
                        });
                        var draw = (point) => {
                            map.clearOverlays();//清除覆盖物
                            this.searchEye.lng = point.lng;
                            this.searchEye.lat = point.lat;
                            var pt = point;
                            geoc.getLocation(pt, (rs) => {
                                var addComp = rs.addressComponents;
                                this.orgAddress = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                                var opts = {
                                    position: point,    // 指定文本标注所在的地理位置
                                    offset: new BMap.Size(0, -50)    //设置文本偏移量
                                }
                                var label = new BMap.Label(this.orgAddress, opts);  // 创建文本标注对象
                                label.setStyle({
                                    color: "red",
                                    borderRadius: "5px",
                                    padding: "0 3px",
                                    fontSize: "12px",
                                    height: "24px",
                                    lineHeight: "21px",
                                    fontFamily: "微软雅黑"
                                });
                                map.addOverlay(label);
                            });
                            var marker = new BMap.Marker(point);// 创建标注
                            map.addOverlay(marker);// 将标注添加到地图中

                            this.mapPositionVisible = true;
                        };
                    });
                });
            },
            /*查一下*/
            searchEyeMap: function (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
//                        console.log(this.searchEye);
                        this.$emit('condition', this.searchEye);
                    }
                })
            },
            /*验证范围*/
            validatorRange (rule, value, callback){
                if (!/^\+?[1-9][0-9]*$/.test(value) || Number(value) < 1 || Number(value) > 5) {
                    callback(new Error('大于0且小于等于5的整数'));
                } else {
                    callback();
                }
            },
            mapSearch() {
                if (!this.mapSearchValue) {
                    this.$Message.warning("请重新输入要查询的地址!");
                    return;
                }
                if (!this.BMap) {
                    return;
                }
                if (!this.map) {
                    return;
                }
                this.map.clearOverlays();
                let myGeo = new this.BMap.Geocoder();

                // 将地址解析结果显示在地图上,并调整地图视野
                myGeo.getPoint(this.mapSearchValue, (point) => {
                    if (point) {
                        this.searchEye.lng = point.lng;
                        this.searchEye.lat = point.lat;
                        this.map.centerAndZoom(point, 15);
                        this.map.addOverlay(new this.BMap.Marker(point));
                    } else {
                        this.$Message.warning("没有查询到您输入的地址，请重新输入!");
                    }
                });
            }
        }
    };
</script>

<style scoped>
    .eye-queryBar,
    .eye-main {
        position: absolute;
        top: 0;
        bottom: 0;
    }
    .eye-queryBar {
        left: 0;
        z-index: 1;
        width: 300px;
        background: #fff;
        padding: 10px 18px 0;
        border-right: 1px solid #e7e9ef;
    }

    .eye-queryBar .condition {
        margin-left: 10px;
        line-height: 28px;
        color: #999;
    }

    .eye-queryBar >>> .ivu-form-item-label {
        font-size: 14px;
        font-weight: 700;
    }

    .eye-main {
        right: 0;
        left: 300px;
        overflow: auto;
        background: rgb(246, 246, 246);
    }

    .eye-box {
        padding: 10px 25px;
    }

    .ivu-tag-new {
        color: #59b399 !important;
        border: 1px solid #59b399 !important;
    }

    .ivu-tag-new >>> .ivu-tag-text {
        max-width: 200px;
        overflow: hidden;
        max-height: 25px;
        display: inline-block;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .ivu-tag-new:after {
        background: #59b399 !important;
    }

    .ivu-tag-new >>> .ivu-icon-ios-close-empty {
        position: relative;
        top: -7px;
        color: #59b399 !important;
    }

    .eye-searchBar .del-all {
        width: 60px;
        display: inline-block;
        color: #666;
        cursor: pointer;
    }

    .eye-container {
        position: relative;
        margin-top: 15px;
        background: #fff;
        border: 1px solid #ddd;
    }

    #container {
        width: 100%;
        height: 480px;
    }

    .mapPosition {
        position: absolute;
        top: 0;
        right: 0;
    }
    .mapPosition >>> .ivu-btn {
        background: #59b399;
        color: #fff;
        opacity: .9;
    }
    .mapPosition >>> .ivu-btn:hover {
        opacity: 1;
    }
</style>
