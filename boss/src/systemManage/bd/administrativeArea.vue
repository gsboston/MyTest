<style scoped>
    .areaMgr {
        padding-top: 10px;
        padding-left: 10px;
    }
</style>
<template>
    <div class="areaMgr">
        <Row>
            <ButtonGroup>
                <Button @click="newArea" :disabled="!selectItem.code || selectItem.code.substr(4,2)!='00'">新增</Button>
                <Button @click="editArea" :disabled="!selectItem.code || selectItem.code=='100000'">修改</Button>
            </ButtonGroup>
            <Button @click="deleteArea" :disabled="!selectItem.code || selectItem.code=='100000'">删除</Button>
        </Row>
        <Row style="padding-top: 10px;">
            <i-col span="6">
                <div style="width: 100%; height: 570px; overflow-y: auto;">
                    <Tree ref="areaTree" :data="areaTree" :load-data="loadData" @on-select-change="selectNode"></Tree>
                </div>
            </i-col>
            <i-col span="18">
                <Form :model="formItem" :label-width="150" ref="form" :rules="ruleCustom" v-if="formType!='OFF'">
                    <FormItem label="行政区划名称" prop="name" :rules="{required: true, message: '请输入行政区划名称'}">
                        <Input v-model="formItem.name" placeholder="请输入行政区划名称" style="width: 200px;"></Input>
                    </FormItem>
                    <FormItem label="行政区划编码" prop="code">
                        <Input v-model="formItem.code" placeholder="请输入行政区划编码" style="width: 200px;" :maxlength="6"></Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="save" v-if="formType=='NEW'">新增</Button>
                        <Button type="primary" @click="save" v-if="formType=='EDIT'">修改</Button>
                    </FormItem>
                </Form>
            </i-col>
        </Row>
    </div>
</template>

<script type="text/babel">
    export default {
        data: function() {
            const codeValidation = (rule, value, callback) => {
                if(value=="" || value.length!=6) {
                    callback(new Error("请输入6位行政区划编码"));
                } if(this.formType=='EDIT' && this.selectItem.code.substr(2,2)!='00' && this.selectItem.code.substr(4,2)!='00' && value.substr(4,2)=='00') {
                    callback(new Error("地县级别末尾两位不能为'00'"));
                } if(this.formType=='EDIT' && ((this.selectItem.code.substr(2,2)!='00' && value.substr(2,2)=='00') || (this.selectItem.code.substr(4,2)=='00' && value.substr(4,2)!='00'))) {
                    callback(new Error("地市级别中间两位不能为'00'，且末尾两位必须为'00'"));
                } if(this.formType=='EDIT' && this.selectItem.code.substr(2,4)=='0000' && value.substr(2,4)!='0000') {
                    callback(new Error("省级或直辖市级别末尾四位必须为'0000'"));
                } if(this.formType=='NEW' && this.selectItem.code=='100000' && value.substr(2,4)!='0000') {
                    callback(new Error("省级或直辖市级别末尾四位必须为'0000'"));
                } if(this.formType=='NEW' && this.selectItem.code!='100000' && this.selectItem.code.substr(0,2)!=value.substr(0,2)) {
                    callback(new Error("地市级别前两位必须与当前省级前两位一致"));
                } if(this.formType=='NEW' && this.selectItem.code!='100000' && this.selectItem.code.substr(2,4)=='0000' && (value.substr(2,2)=='00' || value.substr(4,2)!='00')) {
                    callback(new Error("地市级别中间两位不能为'00'，且末尾两位必须为'00'"));
                } if(this.formType=='NEW' && this.selectItem.code!='100000' && this.selectItem.code.substr(2,4)!='0000' && this.selectItem.code.substr(0,4)!=value.substr(0,4)) {
                    callback(new Error("地县级别前四位必须与当前地市级前四位一致"));
                }  if(this.formType=='NEW' && this.selectItem.code!='100000' && this.selectItem.code.substr(2,4)!='0000' && (value.substr(2,2)=='00' || value.substr(4,2)=='00')) {
                    callback(new Error("地县级别中间两位不能为'00'，且末尾两位不能为'00'"));
                } else {
                    callback();
                }
            };
            return {
                areaTree: [],
                formItem: {},
                formType: "OFF",
                selectItem: {
                    code: "100000",
                },
                ruleCustom: {
                    code:[
                        {required: true, message: '请输入行政区划编码'},
                        { validator: codeValidation, trigger: "change"}
                    ],
                },
            }
        },
        created: function() {
            this.getAreaTree();
        },
        methods: {
            /**
             * 获取行政区划省级列表
             */
            getAreaTree() {
                this.request({
                    url: "/systemManage/administrativeMgr/getAreaList.do",
                }).then(data => {
                    this.areaTree = data;
                })
            },

            /**
             * 获取当前节点子集
             */
            loadData(item, callback) {
                this.request({
                    url: "/systemManage/administrativeMgr/getAreaChildrenList.do",
                    param: {
                        code: item.code
                    }
                }).then(data => {
                    callback(data);
                })
            },

            /**
             * 选择节点
             */
            selectNode(item) {
                this.formType = "OFF";
                this.formItem = {};
                if (item.length>0) {
                    this.selectItem = item[0];
                } else {
                    this.selectItem = {};
                }

            },

            /**
             * 新增行政区划
             */
            newArea() {
                this.formType = "NEW";
                this.formItem.name = "";
                this.formItem.code = "";
                delete this.formItem.id;
            },

            /**
             * 修改行政区划
             */
            editArea() {
                this.formType = "EDIT";
                this.formItem.name = this.selectItem.name;
                this.formItem.code = this.selectItem.code;
                this.formItem.id = this.selectItem.id;
            },

            /**
             * 保存或更新当前行政区划
             */
            save() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        this.request({
                            url: "/systemManage/administrativeMgr/saveArea.do",
                            data: this.formItem
                        }).then(data => {
                            if (this.formType == "NEW") {
                                var item = new Object();
                                item.id = data.id;
                                item.title = this.formItem.name + ":" + this.formItem.code;
                                item.code = this.formItem.code;
                                item.name = this.formItem.name;
                                item.children = [];
                                item.loading = false;
                                this.$refs['areaTree'].getSelectedNodes()[0].children.splice(0,0, item);
                            } else {
                                this.$refs['areaTree'].getSelectedNodes()[0].title = this.formItem.name + ":" + this.formItem.code;
                                this.$refs['areaTree'].getSelectedNodes()[0].code = this.formItem.code;
                                this.$refs['areaTree'].getSelectedNodes()[0].name = this.formItem.name;
                            }
                            this.formItem = {};
                            this.formType = "OFF";
                        }, error => {
                            this.$Message.info(error.message);
                        })
                    }
                })
            },

            /**
             * 删除当前行政区划行政
             */
            deleteArea() {
                if (this.$refs['areaTree'].getSelectedNodes()[0].children == null || this.$refs['areaTree'].getSelectedNodes()[0].children.length == 0) {
                    this.request({
                        url: "/systemManage/administrativeMgr/deleteArea.do",
                        param: {
                            id : this.$refs['areaTree'].getSelectedNodes()[0].id,
                        }
                    }).then(() => {
                        for (var i=0; i<this.areaTree[0].children.length; i++) {
                            if (this.areaTree[0].children[i].id == this.$refs['areaTree'].getSelectedNodes()[0].id) {
                                this.areaTree[0].children.splice(i, 1);
                                break;
                            } else {
                               for (var j=0; j<this.areaTree[0].children[i].children.length; j++) {
                                   if (this.areaTree[0].children[i].children[j].id == this.$refs['areaTree'].getSelectedNodes()[0].id) {
                                       this.areaTree[0].children[i].children.splice(j, 1);
                                       break;
                                   } else {
                                       for (var k=0; k<this.areaTree[0].children[i].children[j].children.length; k++) {
                                           if (this.areaTree[0].children[i].children[j].children[k].id == this.$refs['areaTree'].getSelectedNodes()[0].id) {
                                               this.areaTree[0].children[i].children[j].children.splice(k, 1);
                                               break;
                                           }
                                       }
                                   }
                               }
                            }
                        }
                    }, error => {
                        this.$Message.info(error.message);
                    })
                } else {
                    this.$Message.info("当前行政区划存在子集，不能删除");
                }
            },

        }
    };
</script>

