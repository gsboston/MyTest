<style scoped>
    .content{
        padding: 20px 100px 20px 100px;
    }
    .baseInfo-title{
        font-size: 18px;
        font-weight: bold;
    }
    .baseInfo-form-input2{
        width: 340px;
    }
    .baseInfo-form-input{
        width: 700px;
    }
    .publicTips{
        -webkit-box-shadow: 0 0 9px #0095ff;
    }
</style>
<template>
    <div class="content">
        <Row>
            <i-col span="8">
                <div>
                    <ButtonGroup>
                        <Button v-if="currentTab=='service'" @click="addType">新增</Button>
                        <Button v-if="currentTab=='service'" @click="editType" :type="isEdit?null:'ghost'" :disabled="selectedBill.id==undefined">修改</Button>
                        <Button  @click="stopType" type="ghost" v-if="currentTab=='service'&&!selectedBill.disable" :disabled="selectedBill.id==undefined">停用</Button>
                        <Button @click="startType" type="ghost" v-if="currentTab=='service'&&selectedBill.disable" :disabled="selectedBill.id==undefined">启用</Button>
                        <Button type="ghost" v-if="currentTab=='service'" :disabled="selectedBill.id==undefined" @click="defProcess">流程定义</Button>
                        <Button type="ghost" v-if="currentTab=='process'" :disabled="selectedBill.id==undefined" @click="baseInfo">基本信息</Button>
                    </ButtonGroup>
                    <Checkbox style="float: right;padding-top: 5px;" v-model="isShowStop" @on-change="changeShow">是否显示停用</Checkbox>
                </div>
                <br>
                <div>
                    <Table ref="tbRef" height="600" highlight-row :columns="serviceBillTypeListColumns" :data="serviceBillTypeList" @on-current-change="selectTypeTable"></Table>
                </div>
            </i-col>
            <i-col span="15"  offset="1" v-if="currentTab=='service'">
                <div class="baseInfo-title">
                    服务单类型基本信息
                </div>
                <br>
                <div class="baseInfo-form">
                    <Form ref="serviceBillForm" :model="selectedBill" :rules="ruleForm" label-position="right"  inline :label-width="100">
                        <Row>
                            <FormItem label="类型编码" class="baseInfo-form-input2" prop="code">
                                <Input :maxlength="50" :readonly="!isEdit" type="text" v-model="selectedBill.code" placeholder="类型编码">
                                </Input>
                            </FormItem>
                            <FormItem label="类型名称" class="baseInfo-form-input2" prop="name">
                                <Input :maxlength="50" :readonly="!isEdit" type="text" v-model="selectedBill.name" placeholder="类型名称">
                                </Input>
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem label="服务频率" class="baseInfo-form-input2">
                                <RadioGroup v-model="selectedBill.frequency">
                                    <Radio :disabled="!isEdit" label="DISPOSABLE">一次性</Radio>
                                    <Radio :disabled="!isEdit" label="PERIODIC">周期性</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="单据类别" class="baseInfo-form-input2">
                                <RadioGroup v-model="selectedBill.type">
                                    <Radio :disabled="!isEdit" label="CONTRACT_SHEET">合约服务单</Radio>
                                    <Radio :disabled="!isEdit" label="DAILY_SHEET">日常服务单</Radio>
                                </RadioGroup>
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem label="录入模板" class="baseInfo-form-input" prop="inputTemplateName">

                                <Input readonly v-model="selectedBill.inputTemplateName">
                                    <BSUpload  slot="append" :type="['html']" :onSuccess="uploadInputFile"><Button style="margin: -5px -8px;" :disabled="!isEdit">上传模板</Button></BSUpload>
                                </Input>
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem label="打印模板" class="baseInfo-form-input" prop="printTemplateName">
                                <Input readonly v-model="selectedBill.printTemplateName">
                                    <BSUpload  slot="append" :type="['docx']" :onSuccess="uploadPrintFile"><Button style="margin: -5px -8px;" :disabled="!isEdit">上传模板</Button></BSUpload>
                                </Input>
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem label="备注" class="baseInfo-form-input" prop="remark">
                                <Input :maxlength="500" :readonly="!isEdit" type="textarea" v-model="selectedBill.remark" :rows="5">
                                </Input>
                            </FormItem>
                        </Row>
                        <br>
                        <Row style="padding-left: 560px">
                            <Button :disabled="!isEdit" type="ghost" @click="saveBill">保存</Button>
                            <Button :disabled="!isEdit" type="ghost" @click="cancelBill">取消</Button>
                        </Row>
                    </Form>
                </div>
            </i-col>
            <i-col span="15"  offset="1" v-if="currentTab=='process'">
                <div class="baseInfo-title">
                    服务单流程定义
                </div>
                <br>
                <div class="process-info">
                    <Steps size="small" :current="processList.length+2">
                        <Step icon="android-radio-button-on" title="开始" ></Step>
                        <Step icon="record" :title="processItem.name" v-for="processItem in processList" :key="processItem.id"></Step>
                        <Step icon="android-radio-button-off" title="结束"></Step>
                    </Steps>
                </div>
                <br>
                <div style="display: inline; margin-bottom: 15px;">
                    <Button type="ghost" @click="addProcess">新增</Button>
                    <Button type="ghost" @click="editProcess" :disabled="selectedProcess==''">修改</Button>
                    <Button type="ghost" @click="delProcess" :disabled="selectedProcess.number!=processList.length">删除</Button>
                    <div style="padding-left: 10px; display: inline;" >
                        <Button :class="hasChanged?'publicTips':''" type="ghost" @click="saveProcess" :disabled="processList.length==0">发布</Button>
                    </div>
                    <Alert v-if="hasChanged" type="warning" style="margin-left: 30px; display: inline;" show-icon>发布后修改生效</Alert>
                </div>
                <br><br>
                <div>
                    <Table height="480" highlight-row :columns="processColumns" @on-current-change="selectProcessNode" :data="processList"></Table>
                    <br>
                    <Row style="float: right">

                    </Row>
                </div>
            </i-col>
        </Row>
    </div>
</template>

<script type="text/babel">
    var keyBook = {
        cycleUnit:{
            'WORKING_DAY':'工作日',
            'NATURAL_DAY':'自然日',
            'WEEK':'周',
            'MONTH':'月'
        },
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
            var vm  = this;
            return {
                hasChanged:false,
                isShowStop:false,
                infoColumns:[
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center'
                    },
                    {title:'资料名称',key:'name'},
                    {
                        title:'资料类型',
                        key:'type',
                        render:(h, params) => {
                            return renderKeyBook(h,params,'infoType');
                        }
                    },
                    {
                        title:'资料准备方',
                        key:'from',
                        render:(h, params) => {
                            return renderKeyBook(h,params,'from');
                        }
                    },
                    {
                        title:'是否存档',
                        key:'isStored',
                        render:(h, params) => {
                            return renderKeyBook(h,params,'tf');
                        }
                    }
                ],
                produceColumns:[
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center'
                    },
                    {title:'资料名称',key:'name'},
                    {
                        title:'资料类型',
                        key:'type',
                        render:(h, params) => {
                            return renderKeyBook(h,params,'infoType');
                        }
                    },
                    {
                        title:'是否返还客户',
                        key:'isReverted',
                        render:(h, params) => {
                            return renderKeyBook(h,params,'tf');
                        }
                    },
                    {
                        title:'是否存档',
                        key:'isStored',
                        render:(h, params) => {
                            return renderKeyBook(h,params,'tf');
                        }
                    }
                ],
                selectedProcess:"",
                isEdit:false,
                currentTab:'service',
                selectedBill:{
                    frequency:'DISPOSABLE',
                    type:'CONTRACT_SHEET'
                },
                processList:[],
                infoAllList:[],
                produceAllList:[],
                processColumns:[
                    {
                        title: '环节序号',
                        key: 'number'
                    },{
                        title: '环节名称',
                        key: 'name'
                    },{
                        title: '办理周期',
                        key: 'cycle',
                        render:(h, params) => {
                            var result = params.row.cycle+''+keyBook.cycleUnit[params.row.cycleUnit];
                            return h('span',result);
                        }
                    },{
                        title: '前置环节',
                        key: 'prevNodeId',
                        render:(h, params) => {
                            var result="";
                            var v = params.row.prevNodeId;
                            if(v) {
                                var idList = v.split(',');
                                for(var i = 0;i<idList.length;i++){
                                    if(i>0)
                                        result+=",";
                                    result+=vm.processList[idList[i]-1].name;
                                }
                            }else{
                                result = '无';
                            }
                            return h('span',result);
                        }
                    },{
                        title: '准备资料',
                        width:100,
                        key: 'prepareMaterialVos',
                        render:(h, params) => {
                            if(params.row.prepareMaterialVos&&params.row.prepareMaterialVos.length>0){
                                return h('Poptip',{
                                            props:{
                                                title:'准备资料',
                                                placement:"bottom",
                                                width:500
                                            }
                                        },
                                        [
                                            h('a','有'),
                                            // <Table highlight-row :columns="processColumns" @on-current-change="selectProcessNode" :data="processList"></Table>
                                            h('Table',{
                                                props:{
                                                    columns:this.infoColumns,
                                                    data:params.row.prepareMaterialVos,
                                                    height:200
                                                },
                                                slot:'content'
                                            })
                                        ]
                                        );
                            }

                            else
                                return h('span','无')
                        }
                    },{
                        title: '产出资料',
                        key: 'outputMaterialVos',
                        width:100,
                        render:(h, params) => {
                            if(params.row.outputMaterialVos&&params.row.outputMaterialVos.length>0)
                                return h('Poptip',{
                                            props:{
                                                title:'产出资料',
                                                placement:"bottom-end",
                                                width:500
                                            }
                                        },
                                        [
                                            h('a','有'),
                                            h('Table',{
                                                props:{
                                                    columns:this.produceColumns,
                                                    data:params.row.outputMaterialVos,
                                                    height:200
                                                },
                                                slot:'content'
                                            })
                                            // <Table highlight-row :columns="processColumns" @on-current-change="selectProcessNode" :data="processList"></Table>

                                        ]
                                );
                            else
                                return h('span','无')
                        }
                    }
                ],
                serviceBillTypeList:[],
                serviceBillTypeListColumns:[
                    {
                        title: '编码',
                        key: 'code'
                    },
                    {
                        title: '服务单类型',
                        key: 'name',
                        width:'50%'
                    },
                    {
                        title: '是否启用',
                        key: 'disable',
                        width:'30%',
                        align:"center",
                        render:(h, params) => {
                            return h('Checkbox',{
                                props:{
                                    value:!params.row.disable,
                                    disabled:true
                                }
                            });
                        }
                    }
                ],
                ruleForm: {
                    code: [
                        { required: true, message: '该项不能为空',trigger: 'change' },
                        { pattern:  /^[A-Za-z0-9]+$/ ,message:'只能是英文或者数字',trigger: 'change' }
                    ],
                    name: [
                        {required: true, message: '该项不能为空',trigger: 'change' }
                    ],
                    inputTemplateName: [
                        {required: true, message: '该项不能为空',trigger: 'change' }
                    ],
                    printTemplateName: [
                        {required: true, message: '该项不能为空',trigger: 'change' }
                    ],
                }
            }
        },
        props: {
        },
        created: function () {
            this.loadDefList();
        },
        methods: {
            loadDefInfoList(){
                this.request({
                    url: "/systemManage/service/infoList.do",
                    param:{
                        id:this.selectedBill.id,
                        type:'PREPARE'
                    }
                }).then(data => {
                    this.infoAllList = data;
                });
                this.request({
                    url: "/systemManage/service/infoList.do",
                    param:{
                        id:this.selectedBill.id,
                        type:'OUTPUT'
                    }
                }).then(data => {
                    this.produceAllList = data;
                });
            },
            startType(){
                this.request({
                    url: "/systemManage/service/startType.do?id="+this.selectedBill.id
                }).then(data => {
                    this.$Message.info("已启用");
                    this.reloadBill();
                });
            },
            changeShow(){
                this.loadDefList();
            },
            baseInfo(){
                if(this.hasChanged){
                    this.$Modal.confirm({
                        content: '当前修改还未发布，确定跳转基本信息页面吗?',
                        onOk: () => {
                            this.currentTab = 'service';
                            this.hasChanged=false;
                        }
                    });
                }else{
                    this.currentTab = 'service';
                }


            },
            saveProcess(){
                this.request({
                    url: "/systemManage/service/saveProcess.do",
                    data:{
                        billDefId:this.selectedBill.id,
                        billProcessNodeDefVos:this.processList,
                        prepareMaterialVos:this.infoAllList,
                        outputMaterialVos:this.produceAllList
                    }
                }).then(data => {
                    this.$Message.info("发布成功");
                    this.hasChanged = false;
                });
            },
            selectProcessNode(row){
                this.selectedProcess = row;
                this.selectedProcess.isOutCustomer = !this.selectedProcess.isOutCustomer ? 'false' : 'true';
            },
            reloadBill(){
                this.isEdit = false;
                this.$nextTick(()=>{
                    this.selectedBill = {
                        frequency:'DISPOSABLE',
                        type:'CONTRACT_SHEET'
                    };
                    this.loadDefList();
                    this.$refs['serviceBillForm'].resetFields();
                });
            },
            cancelBill(){
               this.reloadBill();
            },
            saveBill(){
                this.$refs['serviceBillForm'].validate((valid)=>{
                    if (valid) {
                        this.request({
                            url: "/systemManage/service/saveDefBill.do",
                            data:this.selectedBill
                        }).then(data => {
                            this.$Message.info("保存成功");
                            this.reloadBill();
                        });
                    }else{
                        this.$Message.error({content:"信息项录入不完整，请完善后再提交！",duration:3});
                    }
                });

            },
            uploadInputFile(id,file){
                this.$set(this.selectedBill,'inputTemplateId',id);
                this.$set(this.selectedBill,'inputTemplateName',file.name);
            },
            uploadPrintFile(id,file){
                this.$set(this.selectedBill,'printTemplateId',id);
                this.$set(this.selectedBill,'printTemplateName',file.name);
            },
            addType(){
                this.isEdit=true;
                this.selectedBill = {
                    frequency:'DISPOSABLE',
                    type:'CONTRACT_SHEET'
                }
            },
            editType(){
                this.isEdit = true;
            },
            stopType(){
                this.$Modal.confirm({
                    content: '确定停用吗?',
                    onOk: () => {
                        this.request({
                            url: "/systemManage/service/stopType.do?id="+this.selectedBill.id
                        }).then(data => {
                            this.$Message.info("已停用");
//                    this.loadDefList();
                            this.reloadBill();
                        });
                    }
                });

            },
            selectTypeTable(row,old){
                if(this.hasChanged){
                    this.$Modal.confirm({
                        content: '当前修改还未发布，确定跳转吗?',
                        onOk: () => {
                            this.isEdit = false;
                            this.selectedProcess = '';
                            this.selectedBill = row;
                            if(this.currentTab =='process'){
                                this.loadProcessList();
                                this.loadDefInfoList();
                                this.hasChanged = false;
                            }
                        },onCancel:()=>{
                            var currentIndex = this.serviceBillTypeList.findIndex((m)=>{
                                return m.id == row.id
                            });
                            var oldIndex = this.serviceBillTypeList.findIndex((m)=>{
                                return m.id == old.id
                            });
                            this.$refs['tbRef'].handleCurrentRow('clear',currentIndex);
                            this.$refs['tbRef'].handleCurrentRow('highlight',oldIndex);
                        }
                    });
                }else{
                    this.isEdit = false;
                    this.selectedProcess = '';
                    this.selectedBill = row;
                    if(this.currentTab =='process'){
                        this.loadProcessList();
                        this.loadDefInfoList();
                    }
                }

//                this.currentTab='service';
            },
            loadDefList(){
                this.request({
                    url: "/systemManage/service/defList.do",
                    param:{
                        enable:!this.isShowStop
                    }
                }).then(data => {
                    this.serviceBillTypeList = data;
                });
            },
            defProcess(){
                this.currentTab = 'process';
                this.loadProcessList();
                this.loadDefInfoList()
            },
            loadProcessList(){

                this.request({
                    url: "/systemManage/service/processList.do?id="+this.selectedBill.id
                }).then(data => {
                    this.processList = data;
                });
            },
            delProcess(){
                this.$Modal.confirm({
                    content: '确定删除最后一个环节吗?',
                    onOk: () => {
                        this.processList.pop();
                        this.hasChanged = true;
                    }
                });
            },
            editProcess(){
                var vm = this;
                this.card({
                    code: "F052301",
                    title: "修改流程定义节点",
                    props:{
                        op:'edit',
                        process:this.selectedProcess,
                        processList:this.processList,
                        infoAllList:this.infoAllList,
                        produceAllList:this.produceAllList
                    },
                    callback: (type,data,close) => {
                        if(type=='cancel')
                            this.$Message.info("已取消");
                        else{
                            this.hasChanged = true;
                            //处理资料库
                            if(data.prepareMaterialVos){
                                data.prepareMaterialVos.map((m)=>{
                                    if(isNaN(m.number)){
                                        this.infoAllList.push(m);
                                        m.number = this.infoAllList.length-1;
                                    }else{
                                        this.infoAllList[m.number] = m;
                                    }
                                });
                            }
                            if(data.outputMaterialVos){
                                data.outputMaterialVos.map((m)=>{
                                    if(isNaN(m.number)){
                                        this.produceAllList.push(m);
                                        m.number = this.produceAllList.length-1;
                                    }else{
                                        this.produceAllList[m.number] = m;
                                    }
                                });
                            }
                            var index = this.processList.findIndex((i)=>{
                                return i.number==this.selectedProcess.number
                            });
                            this.processList.splice(index,1,data);
                        }
                        close();
                    }
                });
            },
            addProcess(){
                this.card({
                    code: "F052301",
                    title: "新增流程定义节点",
                    props:{
                        op:'add',
                        process:{
                            number:this.processList.length+1,
                            cycleUnit:'WORKING_DAY'
                        },
                        processList:this.processList,
                        infoAllList:this.infoAllList,
                        produceAllList:this.produceAllList
                    },
                    callback: (type,data,close) => {
                        if(type=='cancel')
                            this.$Message.info("已取消");
                        else{
                            this.hasChanged = true;
                            this.processList.push(data);
                            //处理资料库
                            if(data.prepareMaterialVos){
                                data.prepareMaterialVos.map((m)=>{
                                   if(isNaN(m.number)){
                                       this.infoAllList.push(m);
                                       m.number = this.infoAllList.length-1;
                                   }
                                });
                            }
                            if(data.outputMaterialVos){
                                data.outputMaterialVos.map((m)=>{
                                    if(isNaN(m.number)){
                                        this.produceAllList.push(m);
                                        m.number = this.produceAllList.length-1;
                                    }
                                });
                            }
                        }
                        close();
                    }
                });
            }
        }
    };
</script>

