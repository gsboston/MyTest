<template>
    <div class="grounding-content" style="padding: 15px 30px 15px 30px;">
        <i-form ref="itemForm" :rules="ruleCustom" :model="item" :label-width="80">
            <div style="border-bottom: 1px solid #e9eaec;display: flex;">
                <div style="width: 190px; height: 150px; margin-bottom: 10px;">
                    <img v-if="item.pic" :src="$updateConfig.file+item.pic" style="width:190px; height:150px;"/>
                    <img v-else src="/static/noimg.png" style="width:190px; height:150px;"/>
                </div>
                <div style="margin-left: 15px;">
                    <div style="width: 100%; height:40px;text-align: left;font-size: 24px; font-weight: 800;">
                        {{item.name}}
                    </div>
                    <div style="width: 100%; height:75px;text-align: left;font-size: 20px; font-weight: 700; color: #80848f">
                        {{storeName}}
                    </div>
                    <BSUpload :beforeUpload="beforeUpload" :onSuccess="onSuccess" :showProcess="true" :type="['png','jpeg','jpg']"><Button>上传图片</Button></BSUpload>
                </div>
            </div>
            <FormItem v-if="editType=='NEW'" label="门店" prop="storeId" style="padding-top: 15px;">
                <Select v-model="item.storeId" @on-change="chooseStore">
                    <Option v-for="item in stores" :value="item.id" :key="item.id">{{ item.orgName + '（' + item.organizationName + '）' }}</Option>
                </Select>
            </FormItem>
            <Row v-if="editType=='NEW'">
                <i-col span="12">
                    <FormItem label="姓名" prop="name">
                        <Select v-model="item.userId" @on-change="chooseUser">
                            <Option v-for="item in users" :value="item.id" :key="item.id" :disabled="!item.activate">{{ item.activate?item.realName : item.realName+'（未激活）'}}</Option>
                        </Select>
                    </FormItem>
                </i-col>
                <i-col span="12">
                    <FormItem label="顾问等级" prop="level" style="padding-left: 15px;">
                        <Select v-model="item.level">
                            <Option v-for="item in levelList" :value="item.value" :key="item.value" :disabled="item.disabled">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                </i-col>
            </Row>
            <Row v-else style="padding-top: 15px;">
                <i-col span="12">
                    <FormItem label="姓名" prop="name">
                        <Input v-model="item.name" placeholder="请输入姓名" :maxlength="10"></Input>
                    </FormItem>
                </i-col>
                <i-col span="12">
                    <FormItem label="顾问等级" prop="level" style="padding-left: 15px;">
                        <Select v-model="item.level">
                            <Option v-for="item in levelList" :value="item.value" :key="item.value" :disabled="item.disabled">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                </i-col>
            </Row>
            <Row>
                <i-col span="12">
                    <FormItem label="手机" prop="phone">
                        <Input v-model="item.phone" placeholder="请输入手机" :maxlength="11"></Input>
                    </FormItem>
                </i-col>
                <i-col span="12">
                    <FormItem label="Email" prop="email" style="padding-left: 15px;">
                        <Input v-model="item.email" placeholder="请输入Email" :maxlength="30"></Input>
                    </FormItem>
                </i-col>
            </Row>
            <FormItem label="备注" style="margin-bottom: 10px;">
                <Input v-model="item.personalDescription" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注" :maxlength="200"></Input>
            </FormItem>
            <FormItem label="服务类型" prop="consultantTags" style="border-top: 1px solid #e9eaec; padding-top: 10px;margin-bottom: 10px;">
                <Button v-if="service.type==1" v-for="(service,index) in item.consultantTags" :key="index" :class="service.checked ? 'check-button active' : 'check-button'" size="small" @click="chooseService(index)">{{service.name}}</Button>
            </FormItem>
            <FormItem label="擅长领域" style="border-top: 1px solid #e9eaec; padding-top: 10px;">
                <Tag v-if="tag.type==2" v-for="tag in item.consultantTags" :key="tag.name" :name="tag.name" type="border" closable checkable color="green" @on-close="handleClose">{{tag.name}}</Tag>
                <Input v-if="getTagNum<5" v-model="tagContent" @on-enter="addTag" placeholder="新建标签...（按回车即可生成标签）" style="width: 200px;" :maxlength="10"></Input>
            </FormItem>
            <Row style="text-align: center;">
                <Button v-if="this.editType=='NEW'" @click="save">{{'上架'}}</Button>
                <Button v-if="this.editType!='NEW'" @click="edit">{{this.editType!='EDIT'?'上架':'保存'}}</Button>
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
            const emailEx = (rule, value, callback) => {
                if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
                    callback(new Error('请输入正确的email!'));
                } else {
                    callback();
                }
            };
            const serviceValidate = (rule, value, callback) => {
                var num = 0;
                for(var index_i=0;index_i<this.item.consultantTags.length;index_i++) {
                    if (this.item.consultantTags[index_i].type == 1 && this.item.consultantTags[index_i].checked) {
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
                    level: 0,
                    consultantTags:[],
                    selectArea: [],
                    status: 0,
                },
                storeName: "",
                stores: [],
                users: [],
                levelList: [
                    {
                        value: 0,
                        label: '普通',
                        disabled: false
                    },
                    {
                        value: 1,
                        label: '中级',
                        disabled: true,
                    },
                    {
                        value: 2,
                        label: '高级',
                        disabled: true,
                    },
                    {
                        value: 3,
                        label: '专家',
                        disabled: true,
                    },
                ],
                tagContent: '',
                ruleCustom: {
                    name: [
                        {required: true, message: '请输入姓名'},
                    ],
                    phone: [
                        {required: true, message: '请输入手机号'},
                        {validator: phoneEx, trigger: "change"},
                    ],
                    email: [
                        {required: true, message: '请输入Email'},
                        {validator: emailEx, trigger: "change"},
                    ],
//                    consultantTags: [
//                        {required: true, message: '请至少选择一个服务类型！'},
//                        {validator: serviceValidate, trigger: "change"},
//                    ],
                }
            }
        },
        computed: {
            getTagNum() {
                var num = 0;
                for(var index_i=0;index_i<this.item.consultantTags.length;index_i++) {
                    if (this.item.consultantTags[index_i].type == 2) {
                        num++;
                    }
                }
                return num;
            },
        },
        created: function () {
            this.loadPage();
        },
        methods: {
            loadPage() {
                if (this.editType == 'NEW') {
                    this.getStoreList();
                    this.getOrgServiceArr();
                } else {
                    this.getAdviserDetail();
                }
            },
            //获取顾问详情
            getAdviserDetail() {
                this.request({
                    url: "/systemManage/adviser/adviserGrounding/adviserDetail.do",
                    param: {
                        id: this.storeItem.id,
                    }
                }).then(data => {
                    this.item = data;
                    this.$set(this, "storeName", data.store.orgName);
                })
            },
            /**
             * 新增顾问时获取门店列表
             */
            getStoreList(){
                this.request({
                    url: "/systemManage/adviser/adviserGrounding/stores.do",
                }).then(data => {
                    this.stores = data;
                    if (data.length > 0) {
                        this.$set(this.item, "storeId", data[0].id);
                    }
                })
            },
            /**
             * 新增顾问选择门店时获取门店非顾问人员列表
             */
            getUserList(){
                this.request({
                    url: "/systemManage/adviser/adviserGrounding/isNotAdviser.do",
                    param: {
                        id: this.item.storeId
                    },
                }).then(data => {
                    this.users = data;
                    if (data[0]) {
                        this.$set(this.item, "userId", data[0].id);
                        this.$set(this.item, "name", data[0].realName);
                        this.$set(this.item, "phone", data[0].phone);
                    } else {
                        this.$set(this.item, "userId", null);
                        this.$set(this.item, "name", null);
                        this.$set(this.item, "phone", null);
                    }
                })
            },
            chooseStore(){
                for (var index_i=0;index_i<this.stores.length; index_i++) {
                    if (this.stores[index_i].id == this.item.storeId) {
                        this.$set(this, "storeName", this.stores[index_i].orgName);
                    }
                }
                this.getUserList();
            },
            chooseUser(){
                for (var index_i=0;index_i<this.users.length; index_i++) {
                    if (this.users[index_i].id == this.item.userId) {
                        this.$set(this.item, "name", this.users[index_i].realName);
                        this.$set(this.item, "phone", this.users[index_i].phone);
                    }
                }
            },
            beforeUpload:function(file){
            },
            onSuccess:function(id){
                this.$set(this.item, "pic", id);
            },
            //获取当前组织的服务类型列表
            getOrgServiceArr () {
                this.request({
                    url: "/systemManage/adviser/adviserGrounding/services.do",
                }).then(data => {
                    this.orgServiceArr = data;
                    for(var index_i=0;index_i<this.orgServiceArr.length;index_i++) {
                        var serviceObj = new Object();
                        serviceObj.name = this.orgServiceArr[index_i].name;
                        serviceObj.checked = false;
                        serviceObj.type = 1;
                        serviceObj.code = this.orgServiceArr[index_i].code;
                        this.item.consultantTags.push(serviceObj);
                    }
                });
            },
            addTag() {
                var ind = -1;
                for(var index_i=0;index_i<this.item.consultantTags.length;index_i++) {
                    if (this.item.consultantTags[index_i].name == this.tagContent && this.item.consultantTags[index_i].type == 2) {
                        ind = index_i;
                    }
                }
                if (ind == -1) {
                    this.item.consultantTags.push({ name: this.tagContent ,type: 2});
                    this.$set(this, "tagContent", "");
                }
            },
            handleClose (event, name) {
                var ind = -1;
                for(var index_i=0;index_i<this.item.consultantTags.length;index_i++) {
                    if (this.item.consultantTags[index_i].name == name && this.item.consultantTags[index_i].type == 2) {
                        ind = index_i;
                    }
                }
                if (ind > -1) {
                    this.item.consultantTags.splice(ind, 1);
                }
            },
            chooseService(index) {
                var num = 0;
                for(var index_i=0;index_i<this.item.consultantTags.length;index_i++) {
                    if (this.item.consultantTags[index_i].type == 1 && this.item.consultantTags[index_i].checked) {
                        num++;
                    }
                }
                if (num<5 || this.item.consultantTags[index].checked) {
                    this.$set(this.item.consultantTags[index], "checked", !this.item.consultantTags[index].checked);
                } else {
                    this.$Message.info({
                        content: '最多只能选择5个服务类型！'
                    });
                }
            },

            //创建顾问
            save() {
                this.$refs['itemForm'].validate(valid => {
                    if (valid) {
                        var num = 0;
                        for(var index_i=0;index_i<this.item.consultantTags.length;index_i++) {
                            if (this.item.consultantTags[index_i].type == 1 && this.item.consultantTags[index_i].checked) {
                                num++;
                            }
                        }
                        if(num == 0) {
                            this.$Message.info({content: '请至少选择一个服务类型！'});
                        } else {
                            if (!this.item.pic) {
                                this.$Message.info({content: '请上传一张顾问照片'});
                            } else {
                                this.$set(this.item, "status", 0);
                                this.request({
                                    url: "/systemManage/adviser/adviserGrounding/saveAdviser.do",
                                    data: this.item
                                }).then(() => {
                                    this.$Message.success('上架成功!');
                                    this.callback();
                                }, error => {
                                    this.$Message.error(error.message);
                                });
                            }
                        }
                    }
                })
            },

            //保存上架或编辑顾问
            edit() {
                this.$refs['itemForm'].validate(valid => {
                    if (valid) {
                        var num = 0;
                        for(var index_i=0;index_i<this.item.consultantTags.length;index_i++) {
                            if (this.item.consultantTags[index_i].type == 1 && this.item.consultantTags[index_i].checked) {
                                num++;
                            }
                        }
                        if(num == 0) {
                            this.$Message.info({content: '请至少选择一个服务类型！'});
                        } else {
                            if (!this.item.pic) {
                                this.$Message.info({content: '请上传一张顾问照片'});
                            } else {
                                this.$set(this.item, "status", 0);
                                this.request({
                                    url: "/systemManage/adviser/adviserGrounding/update.do",
                                    data: this.item
                                }).then(() => {
                                    this.$Message.success((this.editType=='EDIT'?'保存':'上架')+'成功!');
                                    this.callback();
                                }, error => {
                                    this.$Message.error(error.message);
                                });
                            }
                        }
                    }
                })
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
</style>