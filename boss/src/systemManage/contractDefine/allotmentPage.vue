<template>
    <Tabs type="card" value="useRange" :animated="false" >
        <TabPane label="使用范围" name="useRange">
            <i-col span="8"class="use-range">
                <Tree :data="allAreas" show-checkbox ref="allAreasTree" @on-check-change="selectArea"></Tree>
            </i-col>
            <i-col span="15" offset="1" class="use-range">
                <div style="text-align: center">
                    <radio-group v-model="selectedOrgType" v-if="selectedAreas.length>0" @on-change="changeOrg">
                        <Radio label="allOrg">所选区域全部组织</Radio>
                        <Radio label="handworkOrg">手工选择区域下组织</Radio>
                    </radio-group>
                </div>
                <div v-if="selectedOrgType && selectedOrgType =='handworkOrg' && selectedAreas.length>0" style="margin-top: 20px">
                    <Table  size="small" :data="allOrgs" :columns="allOrgColumns" @on-selection-change="getSelectedOrgList"></Table>
                </div>
            </i-col>
            <i-col span="24" class="button-save">
                <Button type="ghost" @click="areaAndOrgSave">保存</Button>
            </i-col>
        </TabPane>
        <TabPane label="签约主体" name="contractSubject">
            <i-col span="24" class="all-contract-subject">
                <Transfer filterable :list-style="listStyle" :data="this.allContractSubject" :titles="['待选组织','已选组织']" :target-keys="this.checkedContractSubject" @on-change="changeContractSubject"></Transfer>
            </i-col>
        </TabPane>
        <TabPane label="服务单" name="server">
            <i-col span="8">
                <div class="transfer-title">
                    <span>待选列表</span>
                </div>
                <div class="transfer-table">
                    <Table size="small" :data="toSelectedList" :columns="toSelectedColumns" @on-select-all="selectOfNoAll" @on-selection-change="selectOfNoSelect" @on-row-click="selectNoCurrentRow"></Table>
                </div>
            </i-col>
            <i-col span="2">
                <div class="transfer-table-right" :class="{'transfer-table-right-select':isRightLight}" @click="selectService">
                    <Icon type="ios-arrow-right"></Icon>
                </div>
                <div class="transfer-table-left" :class="{'transfer-table-right-select':isLeftLight}" @click="noSelectService">
                    <Icon type="ios-arrow-left"></Icon>
                </div>
            </i-col>
            <i-col span="12">
                <div class="transfer-title">
                    <span>选中列表</span>
                </div>
                <div class="transfer-table">
                    <Table size="small" :data="selectedList" :columns="selectedColumns" @on-select-all="selectOfAll" @on-selection-change="selectOfSelect" @on-row-click="selectCurrentRow"></Table>
                </div>
            </i-col>
            <i-col span="24" class="button-save">
                <Button type="ghost" @click="serviceSave">保存</Button>
            </i-col>
        </TabPane>
    </Tabs>
</template>
<script>
    import ICol from "../../../node_modules/iview/src/components/grid/col.vue";

    export default {
        components: {ICol},
        props: {
            contractDefId: null
        },
        data () {
            return {
                areaAndOrgMainInfo:{
                    areaList:[],
                    isAllOrg:true,
                    orgList:[]
                },
                isRightLight: false,
                isLeftLight: false,
                allAreas: [],//所有区域列表
                selectedAreas: [],//选择的区域列表
                selectedAreaArray:[],//选中的区域数组
                selectedOrgType: "allOrg",
                allOrgs: [],//所有的组织列表
                selectedOrgs: [],//选择的组织列表
                allContractSubject: [],//所有的签约主体列表
                listStyle: {
                    height: '350px',
                    width: '350px',
                },
                checkedContractSubject: [],//已选择的签约主体列表
                toSelectedList: [],//待选列表
                selectedList: [],//选中列表
                selectOfNoSelectList: [],//待选列表中选择服务单
                selectOfSelectList: [],//选中列表中选择的服务单
                allOrgColumns: [
                    {title: '区域编码',type: 'selection',align: 'center',key: 'areaCode',width: 60},
                    {title: '组织名称',key: 'name'}
                ],
                toSelectedColumns: [
                    {title: '选择',key:'id',width: 70,type: 'selection'},
                    {title: '服务单类型',key: 'name',align: 'center'}
                ],
                selectedColumns: [
                    {title: '选择',key: 'id',width: 70,type: 'selection'},
                    {title: '服务单类型',width: 200,key: 'name',align: 'center'},
                    {title: '是否默认',
                        render: (h, params) => {
                            return h('div', [
                                    h('Select', {
                                        props: {
                                            value: this.selectedList[params.index].isDefault
                                        },
                                        on: {
                                            'on-change': (isDefault) => {
                                                this.updateSelectedState(params.index,isDefault)
                                            },

                                        },
                                        nativeOn: {
                                            click: (event) =>{
                                                event.stopPropagation();
                                            }
                                        }
                                    },[
                                        h("Option",{
                                            props: {
                                                value: 1
                                            },
                                        },"是"),
                                        h("Option",{
                                            props: {
                                                value: 0
                                            }
                                        },"否"),
                                    ]),
                                ]
                            );
                        }
                    }
                ],
            }
        },
        created:function(){
            this.loadAllServer();
            this.getAllAreas();
            this.getAllContractSubject();
        },
        methods:{
            //获取全部区域及区域选中状态
            getAllAreas () {
                this.request({
                    url: "/systemManage/allotmentPage/getAllAreas.do",
                    data:{
                        contractDefId: this.contractDefId
                    }
                }).then(demand => {
                    if(demand){
                        this.allAreas = demand;
                        this.$nextTick(()=>{
                            //判断是否有选中区域
                            this.selectArea();
                            if(this.selectedAreas.length>0){
                                var flag = false;
                                //根据区域列表中每个区域的disableCheckbox字段  判断组织选择类型
                                for(var i=0;i<this.allAreas[0].children.length;i++){
                                    if(this.allAreas[0].children[i].checked == true && this.allAreas[0].children[i].creator == null){
                                        flag = true;
                                        break;
                                    }
                                }
                                if(flag){
                                    this.$set(this,"selectedOrgType","handworkOrg");
                                    this.getAllOrgs();
                                }else{
                                    this.$set(this,"selectedOrgType","allOrg");
                                }
                            }
                        });
                    }
                });
            },
            //点击区域树 复选框
            selectArea () {
                this.selectedAreas =this.$refs['allAreasTree'].getCheckedNodes();
                this.selectedAreaArray.splice(0,this.selectedAreaArray.length);
                for(var i= 0;i<this.selectedAreas.length;i++){
                    if(this.selectedAreas[i].id != "100000"){
                        this.selectedAreaArray.push(this.selectedAreas[i].id)
                    }
                }
                if(this.selectedOrgType && this.selectedOrgType=="handworkOrg"){
                    this.getAllOrgs();
                }
            },
            //选择组织类型
            changeOrg () {
                if(this.selectedOrgType=="allOrg"){//当选择组织类型是  所选区域全部组织  时  清除所有已选择的组织

                }else if(this.selectedOrgType=="handworkOrg"){
                    this.getAllOrgs();
                }
            },
            //获取全部组织
            getAllOrgs () {
                this.request({
                    url: "/systemManage/allotmentPage/getAllOrgs.do",
                    data: {
                        areaArray:this.selectedAreaArray
                    }
                }).then(demand => {
                    if(demand){
                        this.allOrgs = demand;
                        for(var i = 0;i<this.allOrgs.length;i++){
                            this.$set(this.allOrgs[i],"_checked",false);
                        }
                        this.getSelectedOrgs();
                    }
                });
            },
            //获取选中组织
            getSelectedOrgs () {
                var vm = this;
                this.request({
                    url: "/systemManage/allotmentPage/getSelectedOrgs.do",
                    data: {
                        contractDefId:this.contractDefId,
                        areaArray:this.selectedAreaArray
                    }
                }).then(demand => {
                    if(demand){
                        for(var i =0;i<demand.length;i++){
                            for(var j=0;j<vm.allOrgs.length;j++){
                                if(demand[i]==vm.allOrgs[j].orgId){
                                    vm.$set(vm.allOrgs[j],"_checked",true);
                                }
                            }
                        }
                    }
                });
            },
            getSelectedOrgList (selection) {
                this.areaAndOrgMainInfo.orgList.splice(0,this.areaAndOrgMainInfo.orgList.length);
                for(var i=0;i<selection.length;i++){
                    this.areaAndOrgMainInfo.orgList.push({"orgId":selection[i].orgId,"parentAreaId":selection[i].parentAreaId});
                }
            },
            areaAndOrgSave () {
                var vm = this;
                if(vm.selectedOrgType == "handworkOrg"){
                    vm.areaAndOrgMainInfo.isAllOrg = false;
                }
                vm.areaAndOrgMainInfo.contractDefId = vm.contractDefId;
                vm.areaAndOrgMainInfo.areaList = vm.selectedAreaArray;
                this.request({
                    url: "/systemManage/allotmentPage/saveAreaAndOrg.do",
                    data: vm.areaAndOrgMainInfo
                }).then(demand => {
                    vm.$Message.info("保存成功");
                    vm.$api.refreshList(vm.contractDefId);
                });
            },
            //获取所有签约主体
            getAllContractSubject () {
                this.request({
                    url: "/systemManage/allotmentPage/getAllContractSubject.do",
                    param:{
                        contractDefId: this.contractDefId,
                    }
                }).then(demand => {
                    if(demand && demand.subjectIds){
                        this.allContractSubject = demand.subjectIds.map((m)=>{
                            m.key = m.orgId;
                            m.label = m.orgName;
                            return m;
                        });
                        this.checkedContractSubject = demand.subjectIds.map((m)=>{
                            if(m.isCheck){
                                return m.orgId;
                            }
                        });
                    }else{
                        this.allContractSubject = [];
                    }
                });
            },
            //选择签约主体
            changeContractSubject (targetKeys){
                this.checkedContractSubject = targetKeys;
                this.saveContractSubject();
            },
            //保存签约主体
            saveContractSubject () {
                var temArray = [];
                for(var i = 0;i<this.checkedContractSubject.length;i++){
                    if(this.checkedContractSubject[i]){
                        temArray.push(this.checkedContractSubject[i]);
                    }
                }
                this.request({
                    url: "/systemManage/allotmentPage/saveContractSubject.do",
                    data:{
                        contractDefId: this.contractDefId,
                        subjectIds: temArray
                    }
                }).then(demand => {
                });
            },


            //获取全部服务列表数组
            loadAllServer () {
                var vm = this;
                this.request({
                    url:"/systemManage/allotmentPage/loadAllServer.do",
                    data: {contractDefId:this.contractDefId}
                }).then((data)=>{
                    if(data && data.billDefList && data.billDefList.length>0){
                        for(var i=0;i<data.billDefList.length;i++){
                            data.billDefList[i]._checked = false;
                        }
                        vm.toSelectedList = data.billDefList;
                    }else{
                        vm.toSelectedList = [];
                    }
                    if(data && data.contractDefServiceList && data.contractDefServiceList.length>0){
                        for(var i=0;i<data.contractDefServiceList.length;i++){
                            data.contractDefServiceList[i]._checked = false;
                            if(data.contractDefServiceList[i].isDefault){
                                data.contractDefServiceList[i].isDefault = 1;
                            }else{
                                data.contractDefServiceList[i].isDefault = 0;
                            }
                        }
                        vm.selectedList = data.contractDefServiceList;
                    }else{
                        vm.selectedList = [];
                    }
                });
            },
            //待选列表全选
            selectOfNoAll () {
                for(var i=0;i<this.toSelectedList.length;i++){
                    this.toSelectedList[i]._checked = true;
                }
            },
            //待选列表中选择服务单
            selectOfNoSelect (selection) {
                if(selection && selection.length>0){
                    this.selectOfNoSelectList = selection;
                    this.isRightLight = true;
                }else{
                    this.selectOfNoSelectList = [];
                    for(var i=0;i<this.toSelectedList.length;i++){
                        this.toSelectedList[i]._checked = false;
                    }
                    this.isRightLight = false;
                }
            },
            //选中列表全选
            selectOfAll () {
                for(var i=0;i<this.selectedList.length;i++){
                    this.selectedList[i]._checked = true;
                }
            },
            //选中列表中选择的服务单
            selectOfSelect (selection) {
                if(selection && selection.length>0){
                    this.selectOfSelectList = selection;
                    this.isLeftLight = true;
                }else{
                    this.selectOfSelectList = [];
                    for(var i=0;i<this.selectedList.length;i++){
                        this.selectedList[i]._checked = false;
                    }
                    this.isLeftLight = false;
                }
            },
            //选中服务
            selectService () {
                if(this.selectOfNoSelectList && this.selectOfNoSelectList.length>0){
                    for(var i=0;i<this.selectOfNoSelectList.length;i++){
                        this.selectOfNoSelectList[i].isDefault = 0;
                        this.selectOfNoSelectList[i]._checked = false;
                        if(!this.selectOfNoSelectList[i].serviceTicketType){
                            this.selectOfNoSelectList[i].serviceTicketType = this.selectOfNoSelectList[i].id;
                        }
                        this.selectedList.push(this.selectOfNoSelectList[i]);
                    }
                    for(var i=0;i<this.selectOfNoSelectList.length;i++){
                        for(var j=this.toSelectedList.length-1;j>=0;j--){
                            if(this.selectOfNoSelectList[i].id == this.toSelectedList[j].id){
                                this.toSelectedList.splice(j,1);
                            }
                        }
                    }
                    this.$nextTick(()=>{
                        this.$set(this,"selectedList",this.selectedList);
                        this.selectOfNoSelectList = [];
                        this.isRightLight = false;
                    });
                }else{
                    this.$Message.info("请从待选列表中选择服务单!");
                }
            },
            selectNoCurrentRow (item,index) {
                if(item._checked == undefined){
                    this.toSelectedList[index]._checked = true;
                    this.selectOfNoSelectList.push(item);
                }else{
                    if(item._checked){
                        this.selectOfNoSelectList.splice(this.selectOfNoSelectList.indexOf(item));
                    }else{
                        this.selectOfNoSelectList.push(item);
                    }
                    this.toSelectedList[index]._checked = !item._checked;
                }
                if(this.selectOfNoSelectList && this.selectOfNoSelectList.length>0){
                    this.isRightLight = true;
                }else{
                    this.isRightLight = false;
                }
            },
            selectCurrentRow (item,index) {
                if(item._checked == undefined){
                    this.selectedList[index]._checked = true;
                    this.selectOfSelectList.push(item);
                }else{
                    if(item._checked){
                        this.selectOfSelectList.splice(this.selectOfSelectList.indexOf(item));
                    }else{
                        this.selectOfSelectList.push(item);
                    }
                    this.selectedList[index]._checked = !item._checked;
                }
                if(this.selectOfSelectList && this.selectOfSelectList.length>0){
                    this.isLeftLight = true;
                }else{
                    this.isLeftLight = false;
                }
            },
            //取消选中服务
            noSelectService () {
                if(this.selectOfSelectList && this.selectOfSelectList.length>0){
                    for(var i=0;i<this.selectOfSelectList.length;i++){
                        this.selectOfSelectList[i]._checked = false;
                        this.toSelectedList.push(this.selectOfSelectList[i]);
                    }
                    for(var i=0;i<this.selectOfSelectList.length;i++){
                        for(var j=this.selectedList.length-1;j>=0;j--){
                            if(this.selectOfSelectList[i].id == this.selectedList[j].id){
                                this.selectedList.splice(j,1);
                            }
                        }
                    }
                    this.$nextTick(()=>{
                        this.$set(this,"toSelectedList",this.toSelectedList);
                        this.selectOfSelectList = [];
                        this.isLeftLight = false;
                    });
                }else{
                    this.$Message.info("请从选中列表中选择服务单!");
                }
            },
            //修改选中列表默认值
            updateSelectedState (index,isDefault){
                this.selectedList[index].isDefault = isDefault;
            },
            serviceSave () {
                var list = [];
                for(var i=0;i<this.selectedList.length;i++){
                    list.push({serviceTicketType:this.selectedList[i].serviceTicketType,isDefault:this.selectedList[i].isDefault});
                }
                this.request({
                    url:"/systemManage/allotmentPage/serviceSave.do",
                    data:{
                        contractDefId:this.contractDefId,
                        list:list
                    }
                }).then(()=>{
                    this.$Message.info("服务单保存成功！");
                    this.$api.refreshList(this.contractDefId);
                });
            },
        }
    }
</script>
<style scoped>
    .use-range{
        height: 380px;
        overflow-y: auto;
    }
    .transfer-title{
        text-align: center;
        font-size: 18px;
    }
    .transfer-table{
        height: 350px;overflow-y: auto
    }
    .transfer-table-left{
        width: 30px;
        height: 30px;
        border: 2px solid #999999;
        border-radius: 4px;
        text-align: center;
        margin-top: 20px;
        margin-left: 17px;
        cursor: pointer;
        color: #999999;
        font-size: 30px;
    }
    .transfer-table-left-select{
        border: 2px solid #59b399;
        color: #59b399;
    }
    .transfer-table-right{
        margin-top: 130px;
        width: 30px;
        height: 30px;
        border: 2px solid #999999;
        border-radius: 4px;
        text-align: center;
        margin-left: 17px;
        cursor: pointer;
        color: #999999;
        font-size: 30px;
    }
    .transfer-table-right-select{
        border: 2px solid #59b399;
        color: #59b399;
    }
    .transfer-table-left > i, .transfer-table-right > i{
        position: relative;
        top: -8px;
    }
    .button-save{
        text-align: center;
        margin-top: 20px;
    }
    .all-contract-subject >>> .ivu-btn + .ivu-btn {
        margin-left: 0;
    }
</style>