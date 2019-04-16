<template>
    <div class="container">
        <div class="center">
            <i-form :model="mainInfo" :label-width="120" :rules="ruleForm" ref="formRef" >
                <Row>
                    <i-col span="12">
                        <Form-item label="编码" prop="code">
                            <i-input class="form-input" v-model="mainInfo.code" placeholder="编码" :maxlength="10"></i-input>
                        </Form-item>
                        <Form-item label="合同标题" prop="title">
                            <i-input class="form-input" v-model="mainInfo.title" placeholder="合同标题" :maxlength="20"></i-input>
                        </Form-item>
                        <Form-item label="合同模板" class="contractFormWork" prop="contentTempName">
                            <i-col span="18">
                                <i-input class="form-input" v-model="mainInfo.contentTempName" placeholder="合同模板" readonly></i-input>
                            </i-col>
                            <i-col span="6">
                                <BSUpload :beforeUpload="beforeContractUpload" :onSuccess="onContractSuccess" :showProcess="false" :type="['html']">
                                    <Button type="ghost" icon="ios-cloud-upload-outline">上传</Button>
                                </BSUpload>
                            </i-col>
                        </Form-item>
                        <Form-item label="对应服务" prop="serviceItemId">
                            <i-select v-model="mainInfo.serviceItemId" placeholder="对应服务">
                                <i-option v-for="serverInfo in serverList" :value="serverInfo.id" :key="serverInfo.id">{{serverInfo.name}}</i-option>
                            </i-select>
                        </Form-item>
                        <Form-item label="签约主体">
                            <RadioGroup v-model="mainInfo.isFreeDist">
                                <Radio label="selfSubject">允许自签</Radio>
                                <Radio label="fixedSubject">固定主体</Radio>
                            </RadioGroup>
                        </Form-item>
                        <Form-item label="审核方">
                            <RadioGroup v-model="mainInfo.approvalType">
                                <Radio label="SALE">销售组织</Radio>
                                <Radio label="SUBJECT">签约主体</Radio>
                            </RadioGroup>
                        </Form-item>
                        <Form-item label="标准合同">
                            <Checkbox class="form-input" v-model="mainInfo.isCriterion" ></Checkbox>
                        </Form-item>
                    </i-col>
                    <i-col span="12">
                        <Form-item label="合同名称" prop="name">
                            <i-input class="form-input" v-model="mainInfo.name" placeholder="合同名称" :maxlength="20"></i-input>
                        </Form-item>
                        <Form-item  label="主体数量" prop="subjectCount">
                            <i-select v-model="mainInfo.subjectCount" placeholder="合同主体数量">
                                <i-option value="2">2</i-option>
                                <i-option value="3">3</i-option>
                            </i-select>
                        </Form-item>
                        <Form-item label="打印模板" class="printFormWork" prop="templateName">
                            <i-col span="18">
                                <i-input class="form-input" v-model="mainInfo.templateName" placeholder="打印模板" readonly></i-input>
                            </i-col>
                            <i-col span="6">
                                <BSUpload :beforeUpload="beforePrintUpload" :onSuccess="onPrintSuccess" :showProcess="false" :type="['docx']">
                                    <Button type="ghost" icon="ios-cloud-upload-outline">上传</Button>
                                </BSUpload>
                            </i-col>
                        </Form-item>
                        <Form-item label="是否启用">
                            <Checkbox class="form-input" v-model="mainInfo.isEnabled" ></Checkbox>
                        </Form-item>
                        <Form-item label="派单方">
                            <RadioGroup v-model="mainInfo.dispatcherType">
                                <Radio label="SALE">销售组织</Radio>
                                <Radio label="SIGNED">签约主体</Radio>
                            </RadioGroup>
                        </Form-item>
                        <Form-item label="收款方">
                            <RadioGroup v-model="mainInfo.receiptType">
                                <Radio label="SALE">销售组织</Radio>
                                <Radio label="SUBJECT">签约主体</Radio>
                            </RadioGroup>
                        </Form-item>
                    </i-col>
                </Row>
                <Row>
                    <i-col span="24">
                        <Form-item label="描述">
                            <i-input v-model="mainInfo.describe" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="描述" :maxlength="200"></i-input>
                        </Form-item>
                    </i-col>
                </Row>
                <div style="clear:both"></div>
            </i-form>
            <i-col style="text-align: center">
                <i-button size="large" @click="save">保存</i-button>
                <i-button size="large" @click="cancel">取消</i-button>
            </i-col>
        </div>
    </div>
</template>

<script>
    export default {
        props:{
            contractDefineId: null
        },
        data () {
            return {
                contractFormWork: {},
                printFormWork: {},
                serverList:[],
                mainInfo: {
                    code: '',
                    name: '',
                    title: '',
                    subjectCount: "2",
                    contentTempId:'',
                    templateId:'',
                    serviceItemId: "",
                    contentTempName: "",
                    templateName: "",
                    isEnabled: true,
                    dispatcherType: "SALE",
                    describe: '',
                    id: null,
                    isFreeDist: "fixedSubject",
                    isCriterion:true, //默认为标准合同
                    approvalType: "SALE",//审核方
                    receiptType: "SALE",//收款方
                },
                ruleForm:{
                    code: [
                        { required: true, message: '编码不能为空'}
                    ],
                    name: [
                        { required: true, message: '合同名称不能为空'}
                    ],
                    title: [
                        { required: true, message: '合同标题不能为空'}
                    ],
                    subjectCount: [
                        { required: true, message: '合同主体数量不能为空'}
                    ],
                    contentTempName: [
                        { required: true, message: '合同模板不能为空'}
                    ],
                    templateName: [
                        { required: true, message: '打印模板不能为空'}
                    ],
                    serviceItemId: [
                        { required: true, message: '对应服务不能为空', trigger: 'change' }
                    ]
                }
            }
        },
        created:function(){
            this.init();
        },
        methods:{
            init () {
                this.getServer();
                var vm = this;
                if(this.contractDefineId){
                    this.request({
                        url: "/systemManage/addContractDefine/getContractDefineInfoById.do",
                        data: {
                            id:this.contractDefineId
                        }
                    }).then(demand => {
                        demand.subjectCount = demand.subjectCount + "";
                        if(demand.isFreeDist==null){
                            demand.isFreeDist = "fixedSubject";
                        }else{
                            demand.isFreeDist = demand.isFreeDist == true?"selfSubject":"fixedSubject";
                        }
                        vm.mainInfo = demand;
                    });
                }
            },
            //获取对应服务列表
            getServer () {
                this.request({
                    url: "/systemManage/addContractDefine/getServer.do",
                }).then(demand => {
                    this.serverList = demand;
                    if(demand){
                        this.$set(this.mainInfo,"server",demand[0].id);
                    }
                });
            },
            beforeContractUpload (file){
            },
            onContractSuccess:function(id,file){
                this.mainInfo.contentTempId = id;
                this.contractFormWork = file;
                this.$set(this.mainInfo,"contentTempName",file.name);
                this.$Message.success("合约模板上传成功！");
            },
            beforePrintUpload (file){
            },
            onPrintSuccess:function(id,file){
                this.mainInfo.templateId = id;
                this.printFormWork = file;
                this.$set(this.mainInfo,"templateName",file.name);
                this.$Message.success("打印模板上传成功！");
            },
            save () {
                var vm = this;
                vm.$refs['formRef'].validate(function(valid){
                    if (valid) {
                        if(vm.mainInfo.contentTempId==null || vm.mainInfo.contentTempId==""){
                            vm.$Message.info("合同模板类型必须是 .html文件类型!");
                            return;
                        }
                        if(vm.mainInfo.templateId==null || vm.mainInfo.templateId==""){
                            vm.$Message.info("打印模板类型必须是 .docx文件类型!");
                            return;
                        }
                        if(vm.contractDefineId){
                            vm.mainInfo.id = vm.contractDefineId;
                        }else{
                            vm.mainInfo.dispatcherType = "SALE";
                        }
                        vm.mainInfo.pageContent = "";
                        vm.request({
                            url: "/systemManage/addContractDefine/saveContractDefine.do",
                            data:vm.mainInfo
                        }).then(data => {
                            vm.$Message.info("保存成功");
                            vm.callback();
                        }, error => {
                        });
                    }
                });
            },
            cancel () {
                this.close();
            },
        },
    }
</script>

<style scoped>
    .center {
        position: relative;
        padding: 0 15px 0 15px;
    }
    .contractFormWork >>> .ivu-form-item-error-tip{
        top: 30px;
    }
    .printFormWork >>> .ivu-form-item-error-tip{
        top: 30px;
    }
</style>