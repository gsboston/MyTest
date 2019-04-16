<template>
    <div class="grounding-content" style="padding: 15px 30px 15px 30px;">
        <i-form ref="itemForm" :rules="ruleCustom" :model="item" :label-width="100">
            <Row>
                <i-col span="12">
                    <div class="box" style="width: 320px; height: 200px; margin-bottom: 20px; padding-left: 20px; cursor: pointer;">
                        <BSUpload :beforeUpload="beforeUpload" :onSuccess="onSuccess" :showProcess="true" :type="['png','jpeg','jpg']">
                            <div class="image-box" style="text-align: center; vertical-align: middle;">
                                <Icon style="font-size: 48px; padding-top: 80px; " type="upload"></Icon>
                                <span style="font-size: 48px; padding-top: 100px; ">上传图片</span>
                            </div>
                        </BSUpload>
                        <img v-if="item.logo" :src="$updateConfig.file+item.logo" style="width:320px; height:200px;"/>
                        <img v-else src="/static/noimg.png" style="width:320px; height:200px;"/>
                    </div>
                </i-col>
                <i-col span="12">
                    <FormItem label="商家" prop="orgName">
                        <Input v-model="item.orgName" placeholder="请输入商家名称"></Input>
                    </FormItem>
                    <FormItem label="等级" prop="level">
                        <Select v-model="item.storeBusinessExtensionVo.level">
                            <Option v-for="item in levelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="经度" prop="longitude">
                        <Input v-model="item.longitude" placeholder="请输入经度" :maxlength="10"></Input>
                    </FormItem>
                    <FormItem label="纬度" prop="latitude">
                        <Input v-model="item.latitude" placeholder="请输入纬度" :maxlength="10"></Input>
                    </FormItem>
                </i-col>
            </Row>
            <!--<div style="border-bottom: 1px solid #e9eaec;display: flex;">-->
                <!--<div style="width: 190px; height: 150px; margin-bottom: 10px;">-->
                    <!--<img v-if="item.logo" :src="$updateConfig.file+item.logo" style="width:190px; height:150px;"/>-->
                    <!--<img v-else src="/static/noimg.png" style="width:190px; height:150px;"/>-->
                <!--</div>-->
                <!--<div style="margin-left: 15px;">-->
                    <!--<div style="width: 100%; height:115px;text-align: left;font-size: 24px; font-weight: 800;">-->
                        <!--{{item.orgName}}-->
                    <!--</div>-->
                    <!--<BSUpload :beforeUpload="beforeUpload" :onSuccess="onSuccess" :showProcess="true"><Button>上传图片</Button></BSUpload>-->
                <!--</div>-->
            <!--</div>-->
            <!--<Row style="padding-top: 10px;">-->
                <!--<i-col span="12">-->
                    <!--<FormItem label="店名" prop="orgName">-->
                        <!--<Input v-model="item.orgName" placeholder="请输入店名"></Input>-->
                    <!--</FormItem>-->
                <!--</i-col>-->
                <!--<i-col span="12">-->
                    <!--<FormItem label="等级" prop="level" style="padding-left: 15px;">-->
                        <!--<Select v-model="item.storeBusinessExtensionVo.level">-->
                            <!--<Option v-for="item in levelList" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
                        <!--</Select>-->
                    <!--</FormItem>-->
                <!--</i-col>-->
            <!--</Row>-->
            <FormItem label="所在地" prop="selectArea">
                <Cascader :data="areaTree" :load-data="loadData" v-model="item.selectArea"></Cascader>
            </FormItem>
            <Row>
                <FormItem label="详细地址" prop="address">
                    <Input v-model="item.address" placeholder="请输入详细地址" :maxlength="50"></Input>
                </FormItem>
            </Row>
            <!--<Row>-->
                <!--<i-col span="12">-->
                    <!--<FormItem label="经度" prop="longitude">-->
                        <!--<Input v-model="item.longitude" placeholder="请输入经度" :maxlength="10"></Input>-->
                    <!--</FormItem>-->
                <!--</i-col>-->
                <!--<i-col span="12">-->
                    <!--<FormItem label="纬度" prop="latitude" style="padding-left: 15px;">-->
                        <!--<Input v-model="item.latitude" placeholder="请输入纬度" :maxlength="10"></Input>-->
                    <!--</FormItem>-->
                <!--</i-col>-->
            <!--</Row>-->
            <Row>
                <i-col span="12">
                    <FormItem label="联系人" prop="contactName">
                        <Input v-model="item.contactName" placeholder="请输入联系人" :maxlength="10"></Input>
                    </FormItem>
                </i-col>
                <i-col span="12">
                    <FormItem label="联系电话" prop="contactPhone" style="padding-left: 15px;">
                        <Input v-model="item.contactPhone" placeholder="请输入联系人电话" :maxlength="11"></Input>
                    </FormItem>
                </i-col>
            </Row>
            <Row>
                <i-col span="12">
                    <FormItem label="法人" prop="legalName">
                        <Input v-model="item.legalName" placeholder="请输入法人" :maxlength="10"></Input>
                    </FormItem>
                </i-col>
                <i-col span="12">
                    <FormItem label="法人电话" prop="legalPhone" style="padding-left: 15px;">
                        <Input v-model="item.legalPhone" placeholder="请输入法人电话" :maxlength="11"></Input>
                    </FormItem>
                </i-col>
            </Row>
            <FormItem label="备注" style="margin-bottom: 10px;">
                <Input v-model="item.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注" :maxlength="200"></Input>
            </FormItem>
            <FormItem label="服务类型" prop="storeTagVos" style="border-top: 1px solid #e9eaec; padding-top: 10px;margin-bottom: 10px;">
                <Button v-if="service.type==1" v-for="(service,index) in item.storeTagVos" :key="index" :class="service.checked ? 'check-button active' : 'check-button'" size="small" @click="chooseService(index)">{{service.name}}</Button>
            </FormItem>
            <FormItem label="擅长领域" style="border-top: 1px solid #e9eaec; padding-top: 10px;">
                <Tag v-if="tag.type==2" v-for="tag in item.storeTagVos" :key="tag.name" :name="tag.name" type="border" closable checkable color="green" @on-close="handleClose">{{tag.name}}</Tag>
                <Input v-if="getTagNum<5" v-model="tagContent" @on-enter="addTag" placeholder="新建标签...（按回车即可生成标签）" style="width: 200px;" :maxlength="10"></Input>
            </FormItem>
            <Row style="text-align: right;">
                <Button v-if="this.item.status == 0" @click="down">下架</Button>
                <Button @click="save">{{this.item.status == 0?'保存':'上架'}}</Button>
            </Row>
        </i-form>
    </div>
</template>

<script>
    export default {
        props: {
            editType: null,
            storeId: null,
            storeItem: null,
        },
        data () {
            const phoneEx = (rule, value, callback) => {
                if (!/^134[0-8]\d{7}$|^13[^4]\d{8}$|^14[5-9]\d{8}$|^15[^4]\d{8}$|^16[6]\d{8}$|^17[0-8]\d{8}$|^18[\d]{9}$|^19[8,9]\d{8}$/.test(value)) {
                    callback(new Error('请输入正确的手机号!'));
                } else {
                    callback();
                }
            };
            const addArea = (rule, value, callback) => {
                if (this.item.selectArea.length<3) {
                    callback(new Error('请选择门店所在地!'));
                } else {
                    callback();
                }
            };
            const longitudeAndLatitude = (rule, value, callback) => {
                if(Object.isNull(value) || String.isBlank(String(value))) {
                    callback(new Error("数值不能为空"));
                } else if (isNaN(value)) {
                    callback(new Error('请输入数字!'));
                } else if (value < 0) {
                    callback(new Error('请输入大于0的数值!'));
                } else if (!/^\d+(\.\d{1,6})?$/.test(value)) {
                    callback(new Error('请把小数点位数限制在6位以内!'));
                } else {
                    callback();
                }
            };
            const serviceValidate = (rule, value, callback) => {
                var num = 0;
                for(var index_i=0;index_i<this.item.storeTagVos.length;index_i++) {
                    if (this.item.storeTagVos[index_i].type == 1 && this.item.storeTagVos[index_i].checked) {
                        num++;
                    }
                }
                if(num == 0) {
                    callback(new Error("请至少选择一个服务类型！"));
                } else {
                    callback();
                }
            };
            return {
                item:{
                    storeBusinessExtensionVo: {
                        level: '1',
                    },
                    storeTagVos:[],
                    selectArea: [],
                },
                levelList: [
                    {
                        value: '1',
                        label: '银牌'
                    },
                    {
                        value: '2',
                        label: '金牌'
                    },
                    {
                        value: '3',
                        label: '铂金'
                    },
                    {
                        value: '4',
                        label: '钻石'
                    },
                ],
                areaTree: [],
                orgServiceArr: [],
                tagContent: '',
                ruleCustom: {
                    orgName: [
                        {required: true, message: '请输入门店名称'},
                    ],
                    selectArea: [
                        {required: true, message: '请选择所在地'},
                        {validator: addArea, trigger: "change"},
                    ],
                    address: [
                        {required: true, message: '请输入详细地址'},
                    ],
                    longitude: [
                        {required: true, message: '请输入经度'},
                        {validator: longitudeAndLatitude, trigger: "change"},
                    ],
                    latitude: [
                        {required: true, message: '请输入纬度'},
                        {validator: longitudeAndLatitude, trigger: "change"},
                    ],
                    contactName: [
                        {required: true, message: '请输入联系人'},
                    ],
                    contactPhone: [
                        {required: true, message: '请输入联系电话'},
                        {validator: phoneEx, trigger: "blur"},
                    ],
                    legalName: [
                        {required: true, message: '请输入法人'},
                    ],
                    legalPhone: [
                        {required: true, message: '请输入法人电话'},
                        {validator: phoneEx, trigger: "blur"},
                    ],
//                    storeTagVos: [
//                        {required: true, message: '请至少选择一个服务类型！'},
//                        {validator: serviceValidate, trigger: "change"},
//                    ],
                }
            }
        },
        computed: {
            getTagNum() {
                var num = 0;
                for(var index_i=0;index_i<this.item.storeTagVos.length;index_i++) {
                    if (this.item.storeTagVos[index_i].type == 2) {
                        num++;
                    }
                }
                return num;
            },
        },
        created: function () {
            this.loadPage();
            this.loadArea();
        },
        methods: {
            loadPage() {
                this.request({
                    url: "/systemManage/organization/storeGrounding/storeById.do",
                    param: {
                        id: this.storeItem.id,
                    }
                }).then(data => {
                    this.item = data;
                    this.$set(this.item, "selectArea", []);
                    this.item.selectArea.push(data.provinceCode);
                    this.item.selectArea.push(data.cityCode);
                    this.item.selectArea.push(data.districtCode);
                    if (!this.item.storeBusinessExtensionVo.level) {
                        this.item.storeBusinessExtensionVo.level = '1';
                    }
                })
            },
            loadArea() {
                this.request({
                    url: "/systemManage/administrativeMgr/getAreaChildrenList.do",
                    param: {
                        code: "100000"
                    }
                }).then(data => {
                    for (var index_i=0;index_i<data.length;index_i++) {
                        var areaObj = new Object();
                        areaObj.value = data[index_i].code;
                        areaObj.label = data[index_i].title.split(':')[0];
                        areaObj.children = data[index_i].children;
                        areaObj.loading = false;
                        this.areaTree.push(areaObj);
                    }
                })
            },
            /**
             * 获取当前区域节点子集
             */
            loadData(item, callback) {
                item.loading = true;
                this.request({
                    url: "/systemManage/administrativeMgr/getAreaChildrenList.do",
                    param: {
                        code: item.value
                    }
                }).then(data => {
                    var child = [];
                    for (var index_i=0;index_i<data.length;index_i++) {
                        var areaObj = new Object();
                        areaObj.value = data[index_i].code;
                        areaObj.label = data[index_i].title.split(':')[0];
                        if (data[index_i].code.substring(data[index_i].code.length-2,data[index_i].code.length)=='00') {
                            areaObj.children = data[index_i].children;
                            areaObj.loading = false;
                        }
                        child.push(areaObj);
                    }
                    item.loading = false;
                    item.children = child;
                    callback();
                })
            },
            beforeUpload:function(file){
            },
            onSuccess:function(id){
                this.$set(this.item, "logo", id);
            },
            //添加标签
            addTag() {
                var ind = -1;
                for(var index_i=0;index_i<this.item.storeTagVos.length;index_i++) {
                    if (this.item.storeTagVos[index_i].name == this.tagContent && this.item.storeTagVos[index_i].type == 2) {
                        ind = index_i;
                    }
                }
                if (ind == -1) {
                    this.item.storeTagVos.push({ name: this.tagContent ,type: 2});
                    this.$set(this, "tagContent", "");
                }
            },
            handleClose (event, name) {
                var ind = -1;
                for(var index_i=0;index_i<this.item.storeTagVos.length;index_i++) {
                    if (this.item.storeTagVos[index_i].name == name && this.item.storeTagVos[index_i].type == 2) {
                        ind = index_i;
                    }
                }
                if (ind > -1) {
                    this.item.storeTagVos.splice(ind, 1);
                }
            },
            chooseService(index) {
                var num = 0;
                for(var index_i=0;index_i<this.item.storeTagVos.length;index_i++) {
                    if (this.item.storeTagVos[index_i].type == 1 && this.item.storeTagVos[index_i].checked) {
                        num++;
                    }
                }
                if (num<5 || this.item.storeTagVos[index].checked) {
                    this.$set(this.item.storeTagVos[index], "checked", !this.item.storeTagVos[index].checked);
                } else {
                    this.$Message.info({
                        content: '最多只5个服务类型！'
                    });
                }
            },

            save() {
                this.$refs['itemForm'].validate(valid => {
                    if (valid) {
                        var num = 0;
                        for(var index_i=0;index_i<this.item.storeTagVos.length;index_i++) {
                            if (this.item.storeTagVos[index_i].type == 1 && this.item.storeTagVos[index_i].checked) {
                                num++;
                            }
                        }
                        if(num == 0) {
                            this.$Message.info({content: '请至少选择一个服务类型！'});
                        } else {
                            if (!this.item.logo) {
                                this.$Message.info({content: '请上传一张门店图片'});
                            } else {
                                this.$set(this.item, "provinceCode", this.item.selectArea[0]);
                                this.$set(this.item, "cityCode", this.item.selectArea[1]);
                                this.$set(this.item, "districtCode", this.item.selectArea[2]);
                                this.$set(this.item, "status", 0);
                                this.request({
                                    url: "/systemManage/organization/storeGrounding/saveStore.do",
                                    data: this.item
                                }).then(data => {
                                    this.item.id = data.id;
                                    this.$Message.success((this.editType == 'EDIT'?'保存':'上架')+'成功!');
                                    this.$api.updateStatus(this.item.orgId, 0);
                                }, error => {
                                    this.$Message.error(error.message);
                                });
                            }
                        }
                    }
                })
            },

            down() {
                this.$Modal.confirm({
                    title: '门店下架确认',
                    content: '<p>门店下架时也会把该门店的顾问全部下架，您确定要下架这个门店吗？</p>',
                    onOk: () => {
                        this.request({
                            url: "/systemManage/organization/storeGrounding/unGrounding.do",
                            param: {
                                id: this.item.id,
                            }
                        }).then(data => {
                            this.$Message.success('门店下架成功!');
                            this.item.status = 1;
                            this.$api.updateStatus(this.item.orgId, 1);
//                            this.search();
                        });
                    },
                });
            },
        }
    };
</script>

<style scoped>
    .grounding-content .ivu-form .ivu-form-item-label {
        text-align: justify;
        text-align-last: justify;
        vertical-align: middle;
        float: left;
        color: rgb(51,51,51);
        line-height: 1;
        padding: 10px 20px 10px 0;
        box-sizing: border-box;
    }

    .grounding-content .check-button {
        color: rgb(102,102,102);
        background: #eee;
        border: 2px solid #eee;
        padding: 3px 22px;
        margin: 0 10px 0 5px;
    }

    .grounding-content .check-button.active {
        color: rgb(89,179,153);
        background: #FFF;
        border: 2px solid rgb(89,179,153);
        background-color: rgb(255,255,255);
    }
    .image-box {
        position: relative;
        z-index: 1;
        background-color: #e4fff1;
        opacity:0;
        width: 320px;
        height: 200px;
    }

    .image-box:hover {
        margin-top: 0px;
        position: relative;
        z-index: 1;
        background-color: #e4fff1;
        opacity:0.3;
        width: 320px;
        height: 200px;
    }
    .box >>> .ivu-upload {
        height: 0px;
    }
</style>