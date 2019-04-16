<template>
    <div style="padding: 15px 20px;">
        <Transfer
                :data="servicePersonalList"
                :target-keys="targetKeys"
                :render-format="render4"
                :titles = "titles"
                :list-style="listStyle"
                @on-change="handleChange4"></Transfer>
        <br/>
        <div style="float: right;">
            <Button v-if="choiceType === 'personnel'" @click="addPersonnel">保存</Button>
            <Button v-if="choiceType === 'service'" @click="addServicd">保存</Button>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            let $self = this;
            return {
                servicePersonalList: [],
                targetKeys: [],
                titles:['待选列表', '已选列表'],
                listStyle: {
                    width: '236px',
                    height: '220px'
                }
            }
        },
        props: {
            choiceType: null,
            selectedOrders: null,
        },
        created: function () {
            if(this.choiceType === 'personnel'){
                this.selectionStaff();
            }else if(this.choiceType === 'service'){
                this.selectionServices();
            }
        },
        methods: {
            /*添加人员*/
            addPersonnel () {
                this.request({
                    url: `/systemManage/service/userPost.do`,
                    data: {
                        id:this.selectedOrders.id,
                        userIds:this.targetKeys
                    }
                }).then(() => {
                    this.$Message.success('添加成功!');
                    this.callback(true);
                });
            },
            /*添加服务单*/
            addServicd () {
                this.request({
                    url: `/systemManage/service/postBillDef.do`,
                    data: {
                        id:this.selectedOrders.id,
                        billDefIds:this.targetKeys
                    }
                }).then(() => {
                    this.$Message.success('添加成功!');
                    this.callback(true);
                });
            },
            selectionStaff () {
                this.servicePersonalList = [];
                this.targetKeys = [];
                /*待选列表*/
                this.request({
                    url: `/systemManage/service/orgUserList.do`,
                }).then(data => {
                    if(data){
                        for (let i = 0; i < data.length; i++) {
                            this.servicePersonalList.push({
                                key: data[i].id,
                                label: data[i].realName,
                                disabled: false
                            });
                        }
                    }
                    /*已选列表*/
                    if( this.selectedOrders){
                        this.request({
                            url: `/systemManage/service/postUserList.do`,
                            param: {
                                id:this.selectedOrders.id,
                            }
                        }).then(data => {
                            if(data){
                                for (let i = 0; i < data.length; i++) {
                                    this.targetKeys.push(data[i].id);
                                }
                            }

                        });
                    }
                });

            },
            selectionServices () {
                this.servicePersonalList = [];
                this.targetKeys = [];
                /*待选列表*/
                this.request({
                    url: `/systemManage/service/orgBillDefList.do`,
                }).then(data => {
                    if(data){
                        for (let i = 0; i < data.length; i++) {
                            this.servicePersonalList.push({
                                key: data[i].id,
                                label: data[i].name,
                                disabled: false
                            });
                        }
                    }
                    /*已选列表*/
                    if( this.selectedOrders){
                        this.request({
                            url: `/systemManage/service/postBillDefList.do`,
                            param: {
                                id:this.selectedOrders.id,
                            }
                        }).then(data => {
                            if(data){
                                for (let i = 0; i < data.length; i++) {
                                    this.targetKeys.push(data[i].id);
                                }
                            }

                        });
                    }
                });

            },
            handleChange4 (newTargetKeys) {
                this.targetKeys = newTargetKeys;
            },
            render4 (item) {
                return item.label;
            }
        }
    };
</script>