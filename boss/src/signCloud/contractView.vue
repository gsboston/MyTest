<template>
    <div id="ContractView">
        <div class="tab-head">
            <div class="tab-panel clearFix">
                <div class="tab-item" v-if="this.myContractResource" :class="{active:isMyContract}" @click="contractListType(true)">我的</div>
                <div class="tab-item" v-if="this.toDoContractResource" :class="{active:!isMyContract}" @click="contractListType(false)">待办</div>
                <Input style="width: 180px; height: 28px;" icon="ios-search" :maxlength="20" @on-enter="search" @on-click="search" v-model="inputVal" placeholder="甲方/合约编号/创建人" />
            </div>
        </div>
        <div class="agreement-state-collapse" :class="{expand: isShowStateList}" @mouseenter="isShowStateList = true" @mouseleave="isShowStateList = false">
            <div class="agreement-state-item clearFix">
                <span>合约状态</span>
                <Tag class="state-tag" v-for="(stateTag,index) in stateTags" @on-close="closeTag(stateTag)" closable :key="index">{{stateTag.name}}</Tag>
                <Icon class="collapse-icon" :class="{expand: isShowStateList}" type="arrow-left-b"></Icon>
            </div>
            <div class="agreement-state-list" :class="{isShow: isShowStateList}">
                <div class="agreement-state-item">
                    <span v-if="this.viewContractResource || this.contractInfoResource">签约</span>
                    <span v-if="(contractType.key == 'contract-NONE' && viewContractResource && isMyContract && myContractResource) || (contractType.key == 'contract-COMMITTED' && viewContractResource) || (contractType.key == 'contract-APPROVED' && contractInfoResource) || (contractType.key == 'contract-SIGNING' && contractInfoResource) || (contractType.key == 'contract-SIGNED' && contractInfoResource) || (contractType.key == 'contract-TERMINATION' && contractInfoResource)" class="state-item" v-for="(contractType,index) in contractTypes" :class="{selected:stateTags.indexOf(contractType) > -1}" @click="addAgreementState([contractType])" :key="index">{{contractType.name}}</span>
                </div>
                <div v-if="this.collectionResource" class="agreement-state-item">
                    <span>收款</span>
                    <span class="state-item" v-for="(collectionType,index) in collectionTypes" :class="{selected:stateTags.indexOf(collectionType) > -1}" @click="addAgreementState([collectionType])">{{collectionType.name}}</span>
                </div>
                <div v-if="this.invoiceResource" class="agreement-state-item">
                    <span>开票</span>
                    <span class="state-item" v-for="(invoiceType,index) in invoiceTypes" :class="{selected:stateTags.indexOf(invoiceType) > -1}" @click="addAgreementState([invoiceType])">{{invoiceType.name}}</span>
                </div>
                <div v-if="this.changeResource" class="agreement-state-item">
                    <span>变更</span>
                    <span class="state-item" v-for="(changeType,index) in changeTypes" :class="{selected:stateTags.indexOf(changeType) > -1}" @click="addAgreementState([changeType])">{{changeType.name}}</span>
                </div>
            </div>
        </div>
        <div ref="contractList" class="contract-list" :style="{top:this.contractListTop}">
            <div class="contract-item" :class="{selected: item == selectedItem}"  @click="selectItem(item)" v-for="(item, index) in items" :key="index">
                <div v-if="item.status === 'NONE' && item.approvalComment && item.approvalType == 'REJECTED'" class="contract-rejected">
                    <span>驳</span>
                </div>
                <div v-if="item.status === 'NONE' && item.approvalComment && item.approvalType == 'CANCEL_APPROVED'" class="contract-rejected">
                    <span>取</span>
                </div>
                <div class="contract-item-name">
                    <p>{{item.subjectName}}</p>
                </div>
                <div style="margin-top: 7px">
                    <div class="contract-item-price">
                        <p>¥ {{item.price}}</p>
                    </div>
                    <div v-if="item.status=='NONE'" class="contract-item-status">
                        <p>{{item.tsInsert}}</p>
                    </div>
                    <div v-if="item.status!='NONE'" class="contract-item-status">
                        <p>{{item.statusReceiptName}}</p>
                    </div>
                    <div v-if="item.status!='NONE'" class="contract-item-status">
                        <p>{{item.paymentName}}</p>
                    </div>
                    <div class="contract-item-service-type" :value="item.defCode">
                        <span>{{item.serviceName}}</span>
                    </div>
                </div>
            </div>
        </div>
        <Page class="contract-page" size="small" :total="total" :current="current" @on-change="changePage"></Page>
    </div>
</template>

<script>
    import Context from "../core/base/Context";

    export default {
        data () {
            return {
                items: [],
                total: 0,
                current: 1,
                inputVal: null,
                isMyContract: true,
                selectedItem: null,
                contractState: null,
                collectionState: null,
                invoiceState: null,
                isShowStateList : false,
                stateTags: [],
                contractTypes:[
                    {key:"contract-NONE",name:"待提交"},
                    {key:"contract-COMMITTED",name:"待审核"},
                    {key:"contract-APPROVED",name:"已核准"},
                    {key:"contract-SIGNING",name:"签约中"},
                    {key:"contract-SIGNED",name:"已签署"},
                    {key:"contract-TERMINATION",name:"已解约"},
                ],
                collectionTypes:[
                    {key:"collection-NONE",name:"待收款"},
                    {key:"collection-RECEIPTING",name:"部分收款"},
                    {key:"collection-FINISH",name:"已收全款"},
                ],
                invoiceTypes:[
                    {key:"invoice-NONE",name:"待开票"},
                    {key:"invoice-INVOICED",name:"部分开票"},
                    {key:"invoice-FINISH",name:"全部开票"},
                ],
                changeTypes:[
                    {key:"change-NONE",name:"待提交"},
                    {key:"change-REJECTING",name:"变更审核中"},
                    {key:"change-APPROVED",name:"已审核"},
                    {key:"change-EXECUTED",name:"已生效"},
                ],
                signStatus: null,
                tempSignStatus: null,
                receiptStatus: null,
                invoiceStatus: null,
                agrementStatus: null,
                tempContractId: null
            }
        },
        created () {
            this.$api.agreementEdit = this.agreementEdit;
            this.$api.apiCollection = this.apiCollection;
            this.$api.apiSureContract = this.apiSureContract;
            this.$api.apiSureReject = this.apiSureReject;
            this.$api.apiCommitAudit = this.apiCommitAudit;
            this.$api.apiAgreementEdit = this.apiAgreementEdit;
            this.$api.apiApplyInvoice = this.apiApplyInvoice;
            this.$api.apiTermination = this.apiTermination;
            this.$api.apiChangeAudit = this.apiChangeAudit;
            this.$api.apiChangeSubmit = this.apiChangeSubmit;
            this.$api.apiAuditSuccess = this.apiAuditSuccess;
            this.$api.selectedStateByHead = this.selectedStateByHead;
            this.$api.cancelSelectItem = this.cancelSelectItem;
            this.$api.contractSaveCallBack = this.contractSaveCallBack;
            this.$api.search = this.search;
            //获取左侧列表栏权限
            let leftMenuResource = Context._getAuthResources("F0301");
            this.myContractResource = leftMenuResource.B030101;//我的合约
            this.toDoContractResource = leftMenuResource.B030102;//待办合约
            this.viewContractResource = leftMenuResource.B030103;//查看合约（审核中）
            this.contractInfoResource = leftMenuResource.B030105;//合约详情（已审核）
            this.collectionResource = leftMenuResource.B030106;//收款
            this.invoiceResource = leftMenuResource.B030107 ;//开票
            this.changeResource = leftMenuResource.B030108 ;//变更
            //获取上测菜单栏权限
            let authRes = window.Context._getAuthResources("F0302");
            this.addNewContract = authRes.B030201;
            this.auditContract = authRes.B030202;
            this.sealContract = authRes.B030203;
            this.collectionContract = authRes.B030204;
            this.drawBillContract = authRes.B030205;
            this.terminationContract = authRes.B030206;
            this.changeContract = authRes.B030207;
            //我的和待办的选中状态
            if((this.myContractResource == undefined || this.myContractResource == false) && this.toDoContractResource == true){
                this.isMyContract = false;
            }
            if(this.toDoContractResource && this.isMyContract == false){//待办
                if(this.viewContractResource){//有查看合约权限
                    this.stateTags.push(this.contractTypes[1]);
                }
                if(this.contractInfoResource){//有合约详情权限
                    this.stateTags.push(this.contractTypes[2]);
                    this.stateTags.push(this.contractTypes[3]);
                    this.stateTags.push(this.contractTypes[4]);
                }
                if(this.collectionResource || this.invoiceResource){//有收款或开票权限
                    this.stateTags.splice(0,this.stateTags.length);
                    this.stateTags.push(this.contractTypes[2]);
                    this.stateTags.push(this.contractTypes[3]);
                    this.stateTags.push(this.contractTypes[4]);
                    if(this.collectionResource && this.invoiceResource){
                        this.stateTags.push(this.collectionTypes[0]);
                        this.stateTags.push(this.collectionTypes[1]);
                        this.stateTags.push(this.invoiceTypes[0]);
                        this.stateTags.push(this.invoiceTypes[1]);
                    }else if(this.collectionResource){
                        this.stateTags.push(this.collectionTypes[0]);
                        this.stateTags.push(this.collectionTypes[1]);
                    }else if(this.invoiceResource){
                        this.stateTags.push(this.invoiceTypes[0]);
                        this.stateTags.push(this.invoiceTypes[1]);
                    }
                 }
                 if(this.changeResource){//有变更权限
                     if(this.stateTags.indexOf(this.contractTypes[4]) <= -1){
                         this.stateTags.push(this.contractTypes[4]);
                     }
                 }
                this.$set(this,"stateTags",this.stateTags);
//                this.$set(this,"tempSignStatus",this.stateTags);
            }
        },
        mounted () {
            this.search(null);
        },
        computed:{
            contractListTop: {
                get: function() {
                    if(this.stateTags.length <=2){
                        return "90px";
                    }else if(this.stateTags.length<=5){
                        return "110px";
                    }else if(this.stateTags.length<=8){
                        return "130px";
                    }else if(this.stateTags.length<=11){
                        return "150px";
                    }else if(this.stateTags.length<=14){
                        return "170px";
                    }else if(this.stateTags.length<=17){
                        return "190px";
                    }
                },
            }
        },
        methods: {
            //切换我的合约和待办合约页签
            contractListType (isMyContract) {
                this.isMyContract = isMyContract;
                this.$set(this,"current",1);
                this.$set(this,"inputVal",null);
                //待办页签情况下，人为选中上测菜单栏第一项
                if(this.toDoContractResource && this.isMyContract == false){
                    if(this.auditContract){
                        this.$api.audit();
                    }else if(this.sealContract){
                        this.$api.contract();
                    }else if(this.collectionContract){
                        this.$api.collection();
                    }else if(this.drawBillContract){
                        this.$api.invoice();
                    }else if(this.terminationContract){
                        this.$api.termination();
                    }else if(this.changeContract){
                        this.$api.update();
                    }
                }else{
                    this.stateTags.splice(0,this.stateTags.length);
                    this.search(null);
                }
            },
            changePage (current) {
                this.current = current;
                this.search(null);
                this.$refs.contractList.scrollTop = 0;
            },
            search (contractId) {
                this.tempContractId = contractId;
                this.signStatus = null;
                this.receiptStatus = null;
                this.invoiceStatus = null;
                this.agrementStatus = null;
                for(var i=0;i<this.stateTags.length;i++){
                    var stateTag = this.stateTags[i];
                    if(stateTag.key.indexOf("contract") > -1){
                        if(this.signStatus == null){
                            this.signStatus = stateTag.key.split("-")[1] + ",";
                        }else{
                            this.signStatus = this.signStatus + stateTag.key.split("-")[1] + ",";
                        }
                    }
                    if(stateTag.key.indexOf("collection") > -1){
                        if(this.receiptStatus == null){
                            this.receiptStatus = stateTag.key.split("-")[1] + ",";
                        }else{
                            this.receiptStatus= this.receiptStatus + stateTag.key.split("-")[1] + ",";
                        }
                    }
                    if(stateTag.key.indexOf("invoice") > -1){
                        if(this.invoiceStatus == null){
                            this.invoiceStatus = stateTag.key.split("-")[1] + ",";
                        }else{
                            this.invoiceStatus = this.invoiceStatus + stateTag.key.split("-")[1] + ",";
                        }
                    }
                    if(stateTag.key.indexOf("change") > -1){
                        if(this.agrementStatus == null){
                            this.agrementStatus = stateTag.key.split("-")[1] + ",";
                        }else{
                            this.agrementStatus = this.agrementStatus + stateTag.key.split("-")[1] + ",";
                        }
                    }
                }
                if(this.signStatus && this.signStatus.length>0){
                    this.signStatus = this.signStatus.substring(0,this.signStatus.length-1);
                }
                if(this.receiptStatus && this.receiptStatus.length>0){
                    this.receiptStatus = this.receiptStatus.substring(0,this.receiptStatus.length-1);
                }
                if(this.invoiceStatus && this.invoiceStatus.length>0){
                    this.invoiceStatus = this.invoiceStatus.substring(0,this.invoiceStatus.length-1);
                }
                if(this.agrementStatus && this.agrementStatus.length>0){
                    this.agrementStatus = this.agrementStatus.substring(0,this.agrementStatus.length-1);
                }
                this.request({
                    url: "/signCloud/contractView/search.do",
                    data:{page:this.current,signStatus:this.signStatus,receiptStatus:this.receiptStatus,invoiceStatus:this.invoiceStatus,agrementStatus:this.agrementStatus,nameOrCode:this.inputVal,isTodo:this.isMyContract}
                }).then(items => {
                    this.items = items.records;
                    this.current = items.current;
                    this.total = items.total;
                    if(window._jumpSignCloudMode) {
                        delete window._jumpSignCloudMode;
                        return;
                    }
                    if(Array.notEmpty(this.items)){
                        //跳转到新增的合约查看页
                        if(this.tempContractId == null){
                            this.selectItem(items.records[0]);
                        }else{
                            for(var contractItem of this.items){
                                if(contractItem.id == contractId){
                                    this.selectItem(contractItem);
                                }
                            }
                        }
                    }else {
                        this.$api.openRight("noContract");
                    }
                });
            },
            assemblyStateArray(selectStateArray){
                if(selectStateArray && selectStateArray.length >=1){
                    for(var i=0;i<selectStateArray.length;i++){
                        if(this.stateTags.indexOf(selectStateArray[i]) <= -1){
                            this.stateTags.push(selectStateArray[i]);
                        }else{
                            this.stateTags.splice(this.stateTags.indexOf(selectStateArray[i]),1);
                        }
                    }
                }
            },
            //如果当前登录用户只有收款或开票权限，且签约状态一条都未选择的情况下，做特殊处理,将重新将初始化的状态传到后台，但是前台不会将状态展现出来
            specialHandling(){
                if(this.toDoContractResource && this.isMyContract == false){//待办
                    if(this.viewContractResource){//有查看合约权限
                        //选中的签约状态为空时
                        if(this.stateTags.indexOf(this.contractTypes[1]) <= -1 && this.stateTags.indexOf(this.contractTypes[2]) <= -1 && this.stateTags.indexOf(this.contractTypes[3]) <= -1 && this.stateTags.indexOf(this.contractTypes[4]) <= -1){
                            this.stateTags.push(this.contractTypes[1]);
                        }
                    }
                    //有合约详情权限  包含合约主题信息，及开票和收款权限
                    if(this.contractInfoResource){
                        //选中的签约状态为空时 或者 选中的签约状态不为空但是选中的状态中不包含  已审核，签约中，已签约时，将这三者加入查询的签约状态
                        if(this.stateTags.indexOf(this.contractTypes[2]) <= -1 && this.stateTags.indexOf(this.contractTypes[3]) <= -1 && this.stateTags.indexOf(this.contractTypes[4]) <= -1){
                            this.stateTags.push(this.contractTypes[2]);
                            this.stateTags.push(this.contractTypes[3]);
                            this.stateTags.push(this.contractTypes[4]);
                            if(this.collectionResource && this.invoiceResource){
                                if(this.stateTags.indexOf(this.collectionTypes[0]) <= -1 && this.stateTags.indexOf(this.collectionTypes[1]) <= -1 && this.stateTags.indexOf(this.collectionTypes[2]) <= -1){
                                    this.stateTags.push(this.collectionTypes[0]);
                                    this.stateTags.push(this.collectionTypes[1]);
                                }
                                if(this.stateTags.indexOf(this.invoiceTypes[0]) <= -1 && this.stateTags.indexOf(this.invoiceTypes[1]) <= -1 && this.stateTags.indexOf(this.invoiceTypes[2]) <= -1){
                                    this.stateTags.push(this.invoiceTypes[0]);
                                    this.stateTags.push(this.invoiceTypes[1]);
                                }
                            }else if(this.collectionResource){
                                if(this.stateTags.indexOf(this.collectionTypes[0]) <= -1 && this.stateTags.indexOf(this.collectionTypes[1]) <= -1 && this.stateTags.indexOf(this.collectionTypes[2]) <= -1){
                                    this.stateTags.push(this.collectionTypes[0]);
                                    this.stateTags.push(this.collectionTypes[1]);
                                }
                            }else if(this.invoiceResource){
                                if(this.stateTags.indexOf(this.invoiceTypes[0]) <= -1 && this.stateTags.indexOf(this.invoiceTypes[1]) <= -1 && this.stateTags.indexOf(this.invoiceTypes[2]) <= -1){
                                    this.stateTags.push(this.invoiceTypes[0]);
                                    this.stateTags.push(this.invoiceTypes[1]);
                                }
                            }
                        }
                    }
                    //只有收款或者开票权限
                    if(this.collectionResource || this.invoiceResource){//有收款或开票权限
                        if(this.stateTags.indexOf(this.contractTypes[2]) <= -1 && this.stateTags.indexOf(this.contractTypes[3]) <= -1 && this.stateTags.indexOf(this.contractTypes[4]) <= -1){
                            this.stateTags.push(this.contractTypes[2]);
                            this.stateTags.push(this.contractTypes[3]);
                            this.stateTags.push(this.contractTypes[4]);
                            if(this.collectionResource && this.invoiceResource){
                                if(this.stateTags.indexOf(this.collectionTypes[0]) <= -1 && this.stateTags.indexOf(this.collectionTypes[1]) <= -1 && this.stateTags.indexOf(this.collectionTypes[2]) <= -1){
                                    this.stateTags.push(this.collectionTypes[0]);
                                    this.stateTags.push(this.collectionTypes[1]);
                                }
                                if(this.stateTags.indexOf(this.invoiceTypes[0]) <= -1 && this.stateTags.indexOf(this.invoiceTypes[1]) <= -1 && this.stateTags.indexOf(this.invoiceTypes[2]) <= -1){
                                    this.stateTags.push(this.invoiceTypes[0]);
                                    this.stateTags.push(this.invoiceTypes[1]);
                                }
                            }else if(this.collectionResource){
                                if(this.stateTags.indexOf(this.collectionTypes[0]) <= -1 && this.stateTags.indexOf(this.collectionTypes[1]) <= -1 && this.stateTags.indexOf(this.collectionTypes[2]) <= -1){
                                    this.stateTags.push(this.collectionTypes[0]);
                                    this.stateTags.push(this.collectionTypes[1]);
                                }
                            }else if(this.invoiceResource){
                                if(this.stateTags.indexOf(this.invoiceTypes[0]) <= -1 && this.stateTags.indexOf(this.invoiceTypes[1]) <= -1 && this.stateTags.indexOf(this.invoiceTypes[2]) <= -1){
                                    this.stateTags.push(this.invoiceTypes[0]);
                                    this.stateTags.push(this.invoiceTypes[1]);
                                }
                            }
                        }
                    }
                }
            },
            //增加左侧筛选条件
            addAgreementState(selectStateArray){
                this.assemblyStateArray(selectStateArray);
                //如果当前登录用户只有收款或开票权限，且签约状态一条都未选择的情况下，做特殊处理,将重新将初始化的状态传到后台，但是前台不会将状态展现出来
                this.specialHandling();
                this.$set(this,"current",1);
                this.search(null);
            },
            //为父组件提供接口，根据顶部菜单跳转到相应筛选条件的列表
            selectedStateByHead (state) {
                this.$set(this,"current",1);
                this.$set(this,"inputVal",null);
                //清空选中组
                this.stateTags.splice(0,this.stateTags.length);
                var selectStateArray = [];
                var statusArray = state.split(",");
                //如果当前是待办合约 点击顶部审核按钮  则筛选条件没有待提交，只有审核中
                if(this.isMyContract == false && state.indexOf("contract-NONE,contract-COMMITTED")>-1){
                    statusArray.splice(0,1);
                }
                //暂定这样
                for(var status of statusArray){
                    for(var contractType of this.contractTypes){
                        if(contractType.key==status){
                            selectStateArray.push(contractType);
                        }
                    }
                    for(var collectionType of this.collectionTypes){
                        if(collectionType.key==status){
                            selectStateArray.push(collectionType);
                        }
                    }
                    for(var invoiceType of this.invoiceTypes){
                        if(invoiceType.key==status){
                            selectStateArray.push(invoiceType);
                        }
                    }
                    for(var changeType of this.changeTypes){
                        if(changeType.key==status){
                            selectStateArray.push(changeType);
                        }
                    }
                }
                this.assemblyStateArray(selectStateArray);
                this.search(null);
            },
            //删除选中筛选条件
            closeTag (closeItem){
                this.stateTags.splice(this.stateTags.indexOf(closeItem),1);
                this.$set(this,"current",1);
                this.specialHandling();
                this.search(null);
            },
            //跳转到合约编辑页
            agreementEdit (code){
                this.$api.openFull(code);
            },
            //取消选中
            cancelSelectItem(){
                this.selectedItem = null;
            },
            //根据选中合约，跳转到对应的合约详情页
            selectItem (item) {
                this.selectedItem = item;
                var contractId = item.id;
                //我的合约
                if(this.myContractResource && this.isMyContract){
                    if((item.status=="NONE" || item.status=="COMMITTED") && this.viewContractResource){//跳转到查看合约页面
                        this.$api.openRight("F0303",{
                            props: {
                                contractInfo: item
                            }
                        })
                    }else if((item.status=="APPROVED" || item.status=="SIGNING" || item.status=="SIGNED" || item.status=="TERMINATION") && this.contractInfoResource){//跳转到合约详情，收款，开票综合页
                        this.$api.openRight("F0304",{
                            props: {
                                contractId: contractId
                            }
                        })
                    }else if((item.status=="APPROVED" || item.status=="SIGNING" || item.status=="SIGNED") && !this.contractInfoResource && this.collectionResource && this.invoiceResource){//跳转收款，开票综合页
                        this.$api.openRight("contractDetailsLess",{
                            props: {
                                contractId: contractId
                            }
                        })
                    }else if((item.status=="APPROVED" || item.status=="SIGNING" || item.status=="SIGNED") && !this.contractInfoResource && this.collectionResource && !this.invoiceResource){//跳转收款页
                        this.$api.openRight("F0305",{
                            props: {
                                contractId: contractId
                            }
                        })
                    }else if((item.status=="APPROVED" || item.status=="SIGNING" || item.status=="SIGNED") && !this.contractInfoResource && !this.collectionResource && this.invoiceResource){//跳转开票页
                        this.$api.openRight("F0306",{
                            props: {
                                contractId: contractId
                            }
                        })
                    }
                    //待办合约
                }else if(this.toDoContractResource && !this.isMyContract){
                    if(item.status=="COMMITTED" && this.viewContractResource){//跳转到合约查看页面
                        this.$api.openRight("F0303",{
                            props: {
                                contractInfo: item
                            }
                        })
                    }else if((item.status=="APPROVED" || item.status=="SIGNING" || item.status=="SIGNED" || item.status=="TERMINATION") && this.contractInfoResource){//跳转到合约详情，收款，开票综合页
                        this.$api.openRight("F0304",{
                            props: {
                                contractId: contractId
                            }
                        })
                    }else if((item.status=="APPROVED" || item.status=="SIGNING" || item.status=="SIGNED") && !this.contractInfoResource && this.collectionResource && this.invoiceResource){//跳转收款，开票综合页
                        this.$api.openRight("contractDetailsLess",{
                            props: {
                                contractId: contractId
                            }
                        })
                    }else if((item.status=="APPROVED" || item.status=="SIGNING" || item.status=="SIGNED") && !this.contractInfoResource && this.collectionResource && !this.invoiceResource){//跳转收款页
                        this.$api.openRight("F0305",{
                            props: {
                                contractId: contractId
                            }
                        })
                    }else if((item.status=="APPROVED" || item.status=="SIGNING" || item.status=="SIGNED") && !this.contractInfoResource && !this.collectionResource && this.invoiceResource){//跳转开票页
                        this.$api.openRight("F0306",{
                            props: {
                                contractId: contractId
                            }
                        })
                    }
                }
            },
            //根据各子模块回调的合约ID，修改左侧列表中对应的合约信息
            refresh (contractId) {
                //根据id获取合同详情,找到列表中对应的值，进行修改
                for(var contractItem of this.items){
                    if(contractItem.id == contractId){
                        this.request({
                            url: "/signCloud/contractView/getContractById.do",
                            data:{id:contractId}
                        }).then(item => {
                            for(var i=0;i<this.items.length;i++){
                                if(this.items[i].id == item.id){
                                    this.items[i].status = item.status;
                                    this.items[i].subjectName = item.subjectName;
                                    this.items[i].price = item.price;
                                    this.items[i].approvalType = item.approvalType;
                                    this.items[i].paymentName = item.paymentName;
                                    this.items[i].statusReceiptName = item.statusReceiptName;
                                    this.items[i].approvalComment = item.approvalComment;
                                    this.$set(this.items, i, Object.assign(this.selectedItem, this.items[i]));
                                    this.selectItem(this.items[i]);
                                }
                            }
                        });
                    }
                }
            },
            //对外提供接口-编辑合约界面-保存、提交审核按钮
            //编辑回调，打开合同编辑界面
            contractSaveCallBack(contractId,flag){
                if(flag == "edit"){//修改合同局部刷新左侧菜单，
                    this.refresh(contractId);
                }else if(flag == "new"){//新增合同刷新左侧菜单，筛选条件置为未提交，审核中
                    this.stateTags.splice(0,this.stateTags.length);
                    if(this.viewContractResource){//筛选条件为未提交，审核中
                        this.stateTags.push({key:"contract-NONE",name:"待提交"});
                        this.stateTags.push({key:"contract-COMMITTED",name:"待审核"});
                    }else if(this.viewContractResource == false){//筛选条件为未提交
                        this.stateTags.push({key:"contract-NONE",name:"待提交"});
                    }
                    this.search(contractId);
                }
            },
            //对外提供接口-审核页面-编辑按钮
            //编辑回调，打开合同编辑界面
            apiAgreementEdit(contractId,contractType,flag){
                this.$api.openRight("contractBuilder",{
                    props:{
                        contractId: contractId,
                        contractType: contractType,
                        isEditable:flag
                    }
                });
            },
            //对外提供接口-审核页面-提交审核按钮
            //提交审核回调，刷新左侧列表数据
            apiCommitAudit(contractId){
                this.refresh(contractId);
            },
            //对外提供接口-审核页面-通过按钮
            //通过回调，刷新左侧列表数据
            apiAuditSuccess(contractId){
                this.refresh(contractId);
            },
            //对外提供接口-审核驳回页面-确认驳回按钮
            //确认驳回回调，刷新左侧列表数据
            apiSureReject(contractId){
                //如果是我的合约，则刷新列表中单个记录
                if(this.myContractResource && this.isMyContract && this.viewContractResource){
                    this.refresh(contractId);
                }else{  //如果是待办则刷新合约列表
                    this.search(null);
                }
            },
            //对外提供接口-签约页面-确认签约按钮
            //确认签约回调，刷新左侧列表数据
            apiSureContract(contractId){
                this.refresh(contractId);
            },
            //对外提供接口-收款页面-确认收款按钮（部分收款、已收全款）
            //确认收款回调，刷新左侧列表数据
            apiCollection(contractId){
                this.refresh(contractId);
            },
            //对外提供接口-开票页面-提交申请按钮
            //提交申请回调，刷新左侧列表数据
            apiApplyInvoice(contractId){
                this.refresh(contractId);
            },
            //对外提供接口-解约页面-确认解除当前合约按钮
            //确认解除当前合约回调，刷新左侧列表数据
            apiTermination(contractId){
                this.refresh(contractId);
            },
            //对外提供接口-变更协议通过页面-通过按钮
            //变更协议通过回调，刷新左侧列表数据
            apiChangeAudit(contractId){
                this.refresh(contractId);
            },
            //对外提供接口-变更协议编辑页面-提交审核按钮
            //提交审核回调，刷新左侧列表数据
            apiChangeSubmit(contractId){
                this.refresh(contractId);
            },
        }
    };
</script>

<style scoped>
    .tab-head{
        position: relative;
        height:50px;
        border-bottom: solid 1px #f6f6f6;
        padding: 8px 15px;
    }
    .tab-panel > .tab-item {
        position: relative;
        float: left;
        line-height: 32px;
        font-size: 14px;
        color: #333;
        cursor: pointer;
    }
    .tab-panel > .tab-item:nth-child(2) {
        margin-left: 10px;
        padding-left: 10px;
    }
    .tab-panel > .tab-item.active {
        color: #59b399;
        font-weight: 700;
    }
    .tab-panel > .tab-item:nth-child(2):before {
        content: "";
        position: absolute;
        top: 7px;
        left: 0;
        bottom: 7px;
        width: 1px;
        background: #e5e5e5;
    }
    .tab-panel > .ivu-input-wrapper {
        float: right;
    }
    .agreement-state-collapse {
        position: relative;
        padding: 0 15px;
        border-bottom: solid 1px #F1F1F1;
        background: white;
        z-index: 10;
        outline: none;
    }
    .agreement-state-collapse.expand {
        box-shadow: 1px 1px 10px rgba(150, 150, 150, 0.2);
    }
    .agreement-state-item {
        padding: 5px 0;
        font-size: 12px;
        line-height: 20px;
    }
    .agreement-state-item > span:first-child {
        color: #2b2b2b;
        font-weight: 700;
        margin-right: 15px;
    }
    .agreement-state-item > .ivu-icon {
        float: right;
        font-size: 14px;
        line-height: 20px;
        color: #aaa;
        transition: transform .2s ease;
    }
    .agreement-state-item > .ivu-icon.expand {
        transform: rotate(-90deg);
    }
    .agreement-state-item > .ivu-tag {
        height: 18px;
        margin: 0 7px 0 0;
        line-height: 16px;
        color: #999;
        border: none;
    }
    .agreement-state-item > .state-item {
        color: #999;
        margin-right: 10px;
        cursor: pointer;
    }
    .agreement-state-item > .state-item.selected {
        color: #59b399;
    }
    .agreement-state-list {
        height: 0;
        transition: height .2s ease;
        overflow: hidden;
    }
    .agreement-state-list.isShow {
        height: 135px;
    }
    .contract-list {
        position: absolute;
        top: 10px;
        left: 0px;
        right: 0;
        bottom: 35px;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .contract-item {
        position: relative;
        padding: 12px 20px;
        color: black;
        font-weight: 700;
        border-bottom: 1px solid #f6f6f6;
    }
    .contract-item.selected {
        color: #59b399 !important;
        background-color: #f6faf9 !important;
    }
    .contract-item:hover {
        background: #f2f6f9;
    }
    .contract-item.selected:before {
        content:"";
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 4px;
        background: #59b399;
    }
    .contract-item-name{
        font-size: 14px;
        color: #333;
        font-weight: 700;
        line-height: 24px;
    }
    .contract-item.selected .contract-item-name{
        color: #59b399;
    }
    .contract-item-price{
        display: inline-block;
        font-size: 14px;
        color: #999;
        line-height: 18px;
        font-weight: normal;
    }
    .contract-item.selected .contract-item-price{
        color: #59b399;
    }
    .contract-item-service-type{
        display: inline-block;
        float: right;
        background-color: #ffc172;
        border-radius: 4px;
        padding: 1px 5px 0px 5px;
        font-size: 12px;
        color: white;
        line-height: 18px;
    }
    .contract-item.selected .contract-item-service-type{
        background-color: #59b399;
    }
    .contract-item-status{
        display: inline-block;
        border: 1px solid #f1f2f7;
        background-color: #fff;
        border-radius: 4px;
        padding: 1px 5px 0px 5px;
        margin-left: 4px;
        float: right;
        font-size: 12px;
        line-height: 16px;
        font-weight: lighter;
        color: #999;
    }
    .contract-item.selected .contract-item-status{
        border: 1px solid #59b399;
        background-color: white;
        color: #59b399;
    }
    .contract-page {
        position: absolute;
        right: 15px;
        bottom: 5px;
        text-align: right;
    }
    .ivu-page.mini >>> .ivu-page-next, .ivu-page.mini >>> .ivu-page-prev {
        margin: 0;
        min-width: 12px;
        height: 24px;
        line-height: 24px;
        border: 0;
    }
    .ivu-page.mini >>> .ivu-page-item-jump-next, .ivu-page.mini >>> .ivu-page-item-jump-prev, .ivu-page-next, .ivu-page-prev {
        display: inline-block;
        vertical-align: middle;
        min-width: 22px;
        height: 32px;
        line-height: 30px;
        list-style: none;
        text-align: center;
        cursor: pointer;
        color: #666;
        font-family: Arial;
        border-radius: 4px;
        transition: all .2s ease-in-out;
    }
    .contract-rejected {
        width: 0;
        height: 0;
        border-top: 40px solid #FF6464;
        border-left: 40px solid transparent;
        float: right;
        margin-top: -13px;
        margin-right: -20px;
        opacity: 0.5;
    }
    .contract-rejected > span{
        position: absolute;
        right: 5px;
        top: 2px;
        font-size: 14px;
        color: white;
    }

</style>

<style>
    #ContractView .search-input input {
        border: transparent;
    }
</style>