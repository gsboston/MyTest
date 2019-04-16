<template>
    <div class="sign-cloud-container">
        <!--<div class="sign-cloud-navigation">-->
            <!--<NavigationView ref="navigation" @on-add="selectContract" @on-audit="auditState" @on-contract="contractState" @on-collection="collectionState" @on-invoice="invoiceState" @on-termination="terminationState" @on-update="updateState"></NavigationView>-->
        <!--</div>-->
        <!--<div class="sign-cloud-left">-->
            <!--<ContractView ref="contract"></ContractView>-->
        <!--</div>-->
        <div class="sign-cloud-center">
            <div class="sign-cloud-content" ref="content"></div>
        </div>
    </div>
</template>

<script>
    import Vue from "vue";
    import "./router";
    import NavigationView from "./navigationView.vue";
    import ContractView from "./contractView.vue";
    const ROUTER_STATUS = "sign_cloud_router_status";

    export default {
        components: {
            NavigationView,
            ContractView
        },
        created () {
            window._signCloud = this;
            this.$api.init();
        },
        mounted () {
            this.$api.saveContract = this.onSaveContract;
            this._open();
        },
        methods: {
            selectContract () {
                this.$api.cancelSelectItem();
                this.renderPage("contractSelector");
            },
            onSaveContract (contractId,flag) {
                this.$api.contractSaveCallBack(contractId,flag);
            },
            registerApi (context, apiName, impl) {
                this.api[apiName] = impl.bind(context);
            },
            _open () {
                let param = this.$route.query;
                let funcCode = param.funcCode;
                let props = param.props;
                if(funcCode) {
                    let config = (props == null ? null : {
                            props: JSON.parse(props)
                        });
                    this.renderPage(param.funcCode, config);
                }
            },
            renderPage (code, config) {
                this.$refs.content.innerHTML = "";
                if(Context.hasResource(code)) {
                    let comp = this.getPage(code, config);
                    if(comp) {
                        this.$refs.content.appendChild(comp.$el);
                    }
                }
            },
            openContractBuilder (defCode, props) {
                this.$refs.content.innerHTML = "";
                this.request({
                    url: "/signCloud/contractBuilder/getTypeByDefCode.do",
                    param: {
                        code: defCode
                    }
                }).then(items => {
                    if(items.length == 1) {
                        let item = items[0];
                        this.openRight("contractBuilder", {
                            props: {
                                contractType: item.code,
                                defId: item.id,
                                isEditable: true,
                                defaultInfo: props.defaultInfo
                            }
                        });
                    }else {
                        this.openRight("contractSelector", {
                            props: {
                                defaultItems: items,
                                defaultInfo:props.defaultInfo
                            }
                        });
                    }
                });
//                let comp = this.getPage(code, config);
//                if(comp) {
//                    this.$refs.content.appendChild(comp.$el);
//                    comp.jumpTarget && comp.jumpTarget();
//                }
            },
            auditState (){
                this.$api.selectedStateByHead("contract-NONE,contract-COMMITTED");
            },
            contractState () {
                this.$api.selectedStateByHead("contract-APPROVED,contract-SIGNING");
            },
            collectionState () {
                this.$api.selectedStateByHead("contract-APPROVED,contract-SIGNING,contract-SIGNED,collection-NONE,collection-RECEIPTING");
            },
            invoiceState () {
                this.$api.selectedStateByHead("contract-APPROVED,contract-SIGNING,contract-SIGNED,invoice-NONE,invoice-INVOICED");
            },
            terminationState () {
                this.$api.selectedStateByHead("contract-SIGNED");
            },
            updateState () {
                this.$api.selectedStateByHead("contract-SIGNED");
            },
            closeRight () {
                this.$refs.content.innerHTML = "";
            },
            setRouterStatus (code, config) {
                let routerStatus = {
                    code: code,
                    config: config
                };
                sessionStorage.setItem(ROUTER_STATUS, JSON.stringify(routerStatus));
            },
            getRouterStatus () {
                let routerStatus = sessionStorage.getItem(ROUTER_STATUS);
                if(routerStatus) {
                    routerStatus = JSON.parse(routerStatus);
                    if(routerStatus.code) {
                        this.openRight(routerStatus.code, routerStatus.config);
                    }
                }
            }
        },
        watch: {
            "$route" (to, from) {
                this._open();
            }
        }
    };
</script>

<style scoped>
    .sign-cloud-container {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background:#f6f6f6;
    }
    .sign-cloud-navigation {
        position: absolute;
        top: 0;
        left: 300px;
        right: 0;
        height: 50px;
        background:#f6f6f6;
        z-index: 12;
    }
    .sign-cloud-left {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 300px;
        border-right: 1px solid #e7e9ef;
        background: white;
    }
    .sign-cloud-center {
        position: relative;
        height: 100%;
        /*margin-left: 300px;*/
        /*padding: 60px 25px 20px 30px;*/
        /*padding: 10px 20px 20px 20px;*/
        overflow-x: hidden;
        overflow-y: auto;
    }
    .sign-cloud-content {
        position: relative;
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        background: white;
    }
</style>