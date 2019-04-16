<style scoped>
.root{
    padding: 20px;
}
.title{

}
.title-text{
    font-size: 18px;
    font-weight: bold;
}
.title-btns{
    float: right;
}
</style>
<style>
    #serviceProcess .pre-process .ivu-select-selection{
        max-height: 60px;
        overflow: auto;
    }

    #serviceProcess .ivu-select-dropdown{
        position: absolute!important;
        top: auto!important;
        left: auto!important;
    }
    /*#serviceProcess .ivu-select{*/
        /*position: relative!important;*/
    /*}*/
</style>
<template>
    <div id="serviceProcess" class="root">
        <div class="title"><span class="title-text">服务环节基本信息</span></div>
        <br>
        <Form ref="serviceProcessForm" :rules="ruleForm" label-position="right" :model="process" :label-width="100">
            <Row>
                <i-col span="12">
                    <FormItem label="环节序号" class="baseInfo-form-input2">
                        <Input disabled type="text" v-model="process.number" placeholder="环节序号">
                        </Input>
                    </FormItem>
                </i-col>
                <i-col span="12">
                    <FormItem label="环节名称" class="baseInfo-form-input2"  prop="name">
                        <Input type="text" v-model="process.name" placeholder="环节名称">
                        </Input>
                    </FormItem>
                </i-col>
            </Row>
            <Row>
                <i-col span="12">
                    <FormItem label="前置环节" class="baseInfo-form-input2" >
                        <Select multiple class="pre-process"  style="position: absolute" v-model="selectedNodeList">
                            <Option v-for="node in nodeList" :value="node.number" :key="node.id" >{{node.name}}</Option>
                        </Select>
                    </FormItem>
                </i-col>
                <i-col span="12">
                        <i-col span="12">
                            <FormItem label="办理周期" class="baseInfo-form-input2" prop="cycle">
                                <Input type="text" v-model="process.cycle" :maxlength="4" placeholder="办理周期">
                                </Input>
                            </FormItem>
                        </i-col>
                        <i-col span="11" offset="1">
                            <FormItem label=""  :label-width="1">
                                <Select style="position: absolute" v-model="process.cycleUnit">
                                    <Option value="WORKING_DAY" >工作日</Option>
                                    <Option value="NATURAL_DAY" >自然日</Option>
                                    <Option value="WEEK" >周</Option>
                                    <Option value="MONTH" >月</Option>
                                </Select>
                            </FormItem>
                        </i-col>
                </i-col>
            </Row>
            <Row>
                <i-col span="12">
                    <FormItem label="特殊功能" class="baseInfo-form-input2" >
                        <Select class="pre-process" style="position: absolute" v-model="process.isOutCustomer">
                            <Option value="false">请选择</Option>
                            <Option value="true">注册信息登记</Option>
                        </Select>
                    </FormItem>
                </i-col>
            </Row>
            <br>
            <Row>
                <FormItem label="环节描述" class="baseInfo-form-input">
                    <Input type="textarea" v-model="process.remark" :rows="5">
                    </Input>
                </FormItem>
            </Row>
            <br>
        </Form>
        <br>
        <div class="title">
            <span class="title-text">环节准备资料清单</span>
            <div class="title-btns">
                <Button type="ghost" icon="plus" @click="addInfo">新增</Button>
                <Button type="ghost" icon="search" @click="chooseInfo">选择已有</Button>
            </div>
        </div>
        <br>
        <div>
            <EditTable height="200" ref="infoRef" v-model="infoList" :columns-list="infoColumns"></EditTable>
        </div>
        <br>
        <div class="title">
            <span class="title-text">环节产出资料清单</span>
            <div class="title-btns">
                <Button type="ghost" icon="plus" @click="addProduce">新增</Button>
                <Button type="ghost" icon="search" @click="chooseProduce">选择已有</Button>
            </div>
        </div>
        <br>
        <div>
            <EditTable height="200" ref="produceRef" v-model="produceList" :columns-list="produceColumns"></EditTable>
        </div>
        <br>
        <div style="float: right">
            <Button @click="save">保存</Button>
            <Button @click="cancel">取消</Button>
        </div>

    </div>
</template>

<script type="text/babel">
    export default {
        props:{
            process:{},
            op:'',
            processList:{
                type:Array,
                default:function () {
                    return []
                }
            },
            infoAllList:{
                type:Array,
                default:function () {
                    return []
                }
            },
            produceAllList:{
                type:Array,
                default:function () {
                    return []
                }
            }
        },
        data () {
            return {
                selectedNodeList:[],
                nodeList:[],
                selectedInfo:null,
                selectedProduce:null,
                infoColumns:[
                    {title: '序号',type: 'index',align: 'center'},
                    {title:'资料名称',key:'name',editable: true,require:true},
                    {
                        title:'资料类型',
                        key:'type',
                        editable: true,
                        type:'select',
                        default:'ORIGINAL',
                        selectOptions:[
                            {value:'ORIGINAL',text:'原件'},
                            {value:'ELECTRONIC',text:'电子版'},
                            {value:'COPY',text:'复印件'},
                            {value:'PAPER',text:'纸质'}
                        ],
                        width:120
                    },
                    {
                        title:'资料准备方',
                        key:'from',
                        editable: true,
                        type:'select',
                        default:'CUSTOMER',
                        selectOptions:[
                            {value:'CUSTOMER',text:'客户'},
                            {value:'COMPANY',text:'服务公司'},
                            {value:'OTHER',text:'其他'}
                        ],
                        width:120
                    },
                    {
                        title:'是否存档',
                        key:'isStored',
                        editable: true,
                        type:'select',
                        default:1,
                        selectOptions:[
                            {value:1,text:'是'},
                            {value:0,text:'否'}
                        ]
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'handle',
                        width:190,
                        handle: ['edit','delete']
                    }
                ],
                infoList:[],
                produceColumns:[
                    {title:'序号',type: 'index',align: 'center'},
                    {title:'资料名称',key:'name',editable: true,require:true},
                    {
                        title:'资料类型',
                        key:'type',
                        editable: true,
                        type:'select',
                        default:"ORIGINAL",
                        selectOptions:[
                            {value:'ORIGINAL',text:'原件'},
                            {value:'ELECTRONIC',text:'电子版'},
                            {value:'COPY',text:'复印件'},
                            {value:'PAPER',text:'纸质'}
                        ],
                        width:120
                    },
                    {
                        title:'是否返还客户',
                        key:'isReverted',
                        editable: true,
                        width:120,
                        type:'select',
                        default:1,
                        selectOptions:[
                            {value:1,text:'是'},
                            {value:0,text:'否'}
                        ]
                    },
                    {
                        title:'是否存档',
                        key:'isStored',
                        editable: true,
                        type:'select',
                        default:1,
                        selectOptions:[
                            {value:1,text:'是'},
                            {value:0,text:'否'}
                        ]
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'handle',
                        width:190,
                        handle: ['edit','delete']
                    }
                ],
                produceList:[],
                ruleForm: {
                    name: [
                        {required: true, message: '该项不能为空',trigger: 'change' }
                    ],
                    cycle: [
                        {required: true, message: '该项不能为空' },
                        { pattern: /^[1-9]\d*$/,message:'请输入正整数'}
                    ]
                }
            }
        },
        created: function () {
            this.nodeList = this.processList.filter((item)=>{
                if(item.number<this.process.number)
                        return item;
            });
            if(this.op =='edit'){
                this.infoList = this.process.prepareMaterialVos;
                this.produceList = this.process.outputMaterialVos;
                //处理前置环节初始数据
                if(this.process.prevNodeId){
                    this.selectedNodeList = this.process.prevNodeId.split(',').map(m=>{return Number(m)});
                }
            }
        },
        methods: {
            chooseInfo(){
                this.prompt({
                    code: "chooseList",
                    title:"选择准备资料",
                    width:500,
                    height:350,
                    props:{
                        type:'info',
                        materialList:this.infoAllList
                    },
                    callback: (row,close) => {
                        if(this.infoList&&this.infoList.findIndex((m)=>{
                                    return m.number==row.number;
                                })>-1){
                            this.$Message.error("该资料已存在请勿重复添加");
                        }else{
                            row.non_editable = true;
                            this.infoList.push(row);
                        }
                        close();
                    }
                });
            },
            chooseProduce(){
                this.prompt({
                    code: "chooseList",
                    title:"选择产出资料",
                    width:500,
                    height:350,
                    props:{
                        type:'produce',
                        materialList:this.produceAllList
                    },
                    callback: (row,close) => {
                        if(this.produceList&&this.produceList.findIndex((m)=>{
                                    return m.number==row.number;
                                })>-1){
                            this.$Message.error("该资料已存在请勿重复添加");
                        }else{
                            row.non_editable = true;
                            this.produceList.push(row);
                        }
                        close();
                    }
                });
            },
            addInfo(){
                //判断是否有数据正在编辑
                if(this.$refs['infoRef'].isEditing()){
                    this.$Message.error("有正在编辑的数据，请保存后新增");
                }else{
                    this.infoList.push({
                        name:'',
                        type:'',
                        from:'',
                        isStored:''
                    });
                    this.$nextTick(()=>{
                        var index = this.infoList.length-1;
                        this.$refs['infoRef'].editData(index);
                    });
                }
            },
            addProduce(){
                //判断是否有数据正在编辑
                if(this.$refs['produceRef'].isEditing()){
                    this.$Message.error("有正在编辑的数据，请保存后新增");
                }else {
                    this.produceList.push({
                        name: '',
                        type: '',
                        isReverted: '',
                        isStored: ''
                    });
                    this.$nextTick(()=> {
                        var index = this.produceList.length - 1;
                        this.$refs['produceRef'].editData(index);
                    });
                }
            },
            save(){
                var vm = this;
                vm.$refs['serviceProcessForm'].validate(function(valid){
                    if (valid) {
                        if(vm.$refs.infoRef.isEditing()||vm.$refs.produceRef.isEditing())
                            vm.$Message.error('有未保存的数据，请保存之后做提交处理');
                        else{
                            vm.process.prevNodeId = vm.selectedNodeList.join();
                            vm.process.prepareMaterialVos = vm.infoList;
                            vm.process.outputMaterialVos = vm.produceList;
                            vm.callback('save',vm.process);
                        }
                    }else{
                        vm.$Message.error({content:"信息项录入不完整，请完善后再提交！",duration:3});
                    }
                });

            },
            cancel(){
//                this.close();
                this.callback('cancel',{});
            }
        }
    };
</script>

