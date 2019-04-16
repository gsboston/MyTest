<template>
    <Form :model="form" ref="form" :label-width="110" class="form" style="margin-right: 10px;">
        <!--<FormItem label="商机类型">-->
            <!--<RadioGroup v-model.number="form.type">-->
                <!--<Radio label="1">私有商机</Radio>-->
                <!--<Radio label="2">公共商机</Radio>-->
            <!--</RadioGroup>-->
        <!--</FormItem>-->
       <!-- <FormItem label="选择提供人">
            <Checkbox v-model="orgTreeCheck" class="checkbox">选择提供人</Checkbox>
        </FormItem>-->
        <FormItem label="商机来源">
            <RadioGroup v-model="form.fromFlag" @on-change="changeRadio">
                <Radio :label="item.code" v-for="(item,index) in opportunityList" :key="index">{{item.name}}</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="提供人所在机构">
            <div class="orgField" v-show="!isInputorg" :class="{orgFieldDisabled: !orgTreeCheck, extended: orgExtend}" @click="orgFieldHandle">{{ orgActive && orgActive.name || '未选择' }}</div>

            <Row type="flex" v-show="orgExtend" class="orgPanel">
                <i-col span="20">
                    <auto-comp
                            :disabled="!orgTreeCheck"
                            ref="searchName"
                            v-model="searchName"
                            icon="ios-search"
                            placeholder="按组织名称查询"
                            @on-search="searchList"
                            @on-select="getOrg"
                            style="width:335px;">
                        <Option v-for="option in searchResult" :value="option.name" :key="option.id">
                            {{option.name}}
                        </Option>
                    </auto-comp>

                    <Tree ref="tree" :data="stores" :load-data="loadData" :render="renderContent" class="orgTree" :disabled="!orgTreeCheck"></Tree>
                </i-col>
            </Row>
            <Row  v-show="isInputorg">
                <Input v-model="form.orginalProviderOrgName" placeholder="请输入" ></Input>
            </Row>
        </FormItem>
        <FormItem label="商机提供人">
            <div v-show="!isInputorg" class="orgField" :class="{orgFieldDisabled: !orgTreeCheck, extended: personExtend}" @click="personFieldHandle">{{ personsNameActive || '未选择' }}</div>

            <Row type="flex" v-show="personExtend" class="orgPanel">
                <i-col span="24">
                    <ul class="personsWrap">
                        <li :class="{active: personsIdActive === item.id}" v-for="(item, index) in persons" @click="orgTreeCheck && personsItemHandle(item.id, item)">
                            <Row type="flex" justify="space-between">
                                <i-col>
                                    <div class="personsName">{{ item.realName }}（{{ item.userName }}）</div>
                                </i-col>
                            </Row>
                        </li>
                        <li v-if="orgIdActive && !persons.length" class="nodata">{{ nodataTips }}</li>
                    </ul>
                </i-col>
            </Row>
            <Row  v-show="isInputorg">
                <Input v-model="form.orginalProviderName" placeholder="请输入" ></Input>
            </Row>
        </FormItem>
        <FormItem label="商机类型">
            <RadioGroup v-model="form.type" @on-change="changeTypeRadio">
                <Radio label="1">私有</Radio>
                <Radio label="2">协作</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="协作人所在机构" v-show="isCoopInput">
            <div class="orgField"  :class="{orgFieldDisabled: !coopOrgTreeCheck, extended: coopOrgExtend}" @click="cooperOrgFieldHandle">{{ orgCoopActive && orgCoopActive.name || '未选择' }}</div>
            <Row type="flex" v-show="coopOrgExtend" class="orgPanel">
                <i-col span="20">
                    <auto-comp
                            :disabled="!coopOrgTreeCheck"
                            ref="searchCoopName"
                            v-model="searchCoopName"
                            icon="ios-search"
                            placeholder="按组织名称查询"
                            @on-search="searchCoopList"
                            @on-select="getCoopOrg"
                            style="width:335px;">
                        <Option v-for="option in searchCoopResult" :value="option.name" :key="option.id">
                            {{option.name}}
                        </Option>
                    </auto-comp>

                    <Tree ref="tree" :data="coopStores" :load-data="loadData" :render="renderContentCoop" class="orgTree" :disabled="!coopOrgTreeCheck"></Tree>
                </i-col>
            </Row>
        </FormItem>
        <FormItem label="协作人" v-show="isCoopInput">
            <div class="orgField" :class="{orgFieldDisabled: !coopOrgTreeCheck, extended: coopPersonExtend}" @click="personFieldCoopHandle"><span v-if="personsCoopNameActive.length>0" ><font class="cooperation-label" v-for="(person,index) in personsCoopNameActive" :key="index">{{person}}</font></span><span v-else>未选择</span></div>

            <Row type="flex" v-show="coopPersonExtend" class="orgPanel">
                <i-col span="24">
                    <ul class="personsWrap">
                        <li :class="{active: personsCoopNameId.indexOf(item.id)>-1}" v-for="(item, index) in coopPersons" @click="coopOrgTreeCheck && personsCoopItemHandle(item.id, item)">
                            <Row type="flex" justify="space-between">
                                <i-col>
                                    <div class="personsName">{{ item.realName }}（{{ item.userName }}）</div>
                                </i-col>
                            </Row>
                        </li>
                        <li v-if="orgIdActive && !coopPersons.length" class="nodata">{{ nodataTips }}</li>
                    </ul>
                </i-col>
            </Row>
        </FormItem>
        <FormItem label="添加服务" v-show="isCoopInput" >
            <Select v-model="form.businessSigleCode" placeholder="添加服务"  @click.native="nodataTip">
                <Option v-for="service in serviceList" :key="service.code" :value="service.code">{{service.name}}</Option>
            </Select>
        </FormItem>
        <FormItem label="添加服务" v-show="!isCoopInput" >
            <Select v-model="form.businessCode" placeholder="添加服务" multiple @click.native="nodataTip">
                <Option v-for="service in serviceList" :key="service.code" :value="service.code">{{service.name}}</Option>
            </Select>
        </FormItem>
        <FormItem label="备注说明">
            <Input v-model="form.comments" type="textarea" :rows="4" :maxlength="200"></Input>
        </FormItem>
        <FormItem class="buttonPanel">
            <Button type="primary" @click="save" :loading="loading">提交</Button>
            <!--<Button type="primary" @click="save">提交</Button>-->
            <Button type="ghost" style="margin-left: 8px" @click="cancel">取消</Button>
        </FormItem>
    </Form>
</template>

<script>
    export default {
        props: {
            id: null,
            from: null
        },
        data() {
            return {
                form: {
                    type: 1,
                    businessCode: [],//多选
                    businessSigleCode:[],//单选
                    service: [],
                    fromFlag:'',
                    orginalProviderOrgName:'',//提供人组织（输入）
                    orginalProviderName:'',//提供人名称（输入）
                },
                type: '私有商机',
                serviceList: [],
                loading: false,

                searchName: '',
                searchCoopName:'',

                searchResult:[],
                searchCoopResult:[],

                stores:[],  //
                coopStores:[],

                persons: [],
                coopPersons:[],
                orgActive: null,
                orgCoopActive:null,
                orgIdActive: null,
                orgInput:null,
                personsIdActive: null,
                personsNameActive: '',
                personsCoopNameActive: [],
                personsCoopNameId:[],
                coopOrgId:'',
                provideOrgId:'',
                nodataTips: '该组织暂无员工，请先添加人员。',
                orgTreeCheck: false, // 组织树是否可修改编辑
                orgExtend: false, // 提供人所在机构是否展开
                personExtend: false, // 商机提供人是否展开

                coopOrgTreeCheck: false, // 协作人组织树是否可修改编辑
                coopOrgExtend: false, // 提供人所在机构是否展开
              /*  personExtend: false, // 商机提供人是否展开*/
                coopPersonExtend:false,//商机协作人是否展开
                isCoopInput:false,
                currentOrgId: null,
                currentUserId: null,
                opportunityList:[],
                isInputorg:false,
                orgName:'',
                orgCoopIdActive:'',

            }
        },
        created: function () {
            this.getServiceList();
            this.getOpportuityFrom();
            let org = this.$context.getCurrentOrganization(),
                orgId = org.id,
                orgName = org.name,
                user = this.$context.getCurrentUser(),
                userId = user.userId || user.id;
            this.currentOrgId = orgId;
            this.currentUserId = userId;
            this.orgName = orgName;

            if (orgId && userId) {
                this.toOrgTree({
                    orgId: orgId,
                    org: {
                        name: orgName
                    },
                    userId: userId,
                    operationNote: 0
                });
            } else {
                this.search();
            }

        },
        methods: {
            save: function () {
                    this.loading = true;
                    let cooperationUserList = [];
                    // 选中“选择提供人”状态
                    if (this.form.fromFlag=='100') {
                        this.form.orginalOrganizationId = this.currentOrgId;
                        this.form.orginalCreator = this.currentUserId;
                    } else if(this.form.fromFlag=='200'){
                        if (!this.orgActive) {
                            this.$Message.warning('请选择提供人所在机构');
                            this.loading = false;
                            return;
                        }
                        if (!this.personsIdActive) {
                            this.$Message.warning('请选择商机提供人');
                            this.loading = false;
                            return;
                        }
                        this.form.orginalOrganizationId = this.orgIdActive;
                        this.form.orginalCreator = this.personsIdActive;
                    }else{
                        this.form.orginalOrganizationId = '';
                        this.form.orginalCreator = '';
                    }

                    if(this.form.type=='1'){
                        this.coopOrgId = '';
                        this.personsCoopNameActive=[];
                        this.personsCoopNameId=[];
                        if(this.form.businessCode.length<=0){
                            this.$Message.warning('添加服务');
                            this.loading = false;
                            return;
                        }

                        this.form.businessSigleCode = [];
                    }else{
                        if(!this.orgCoopActive){
                            this.$Message.warning('请选择协作人所在机构');
                            this.loading = false;
                            return;
                        }
                        if (!this.personsCoopNameId.length) {
                            this.$Message.warning('请选择协作人');
                            this.loading = false;
                            return;
                        }

                        for(var i in this.personsCoopNameId){
                            let personObjs = {};
                            personObjs = Object.assign({},{userId:this.personsCoopNameId[i],orgId:this.coopOrgId})
                            cooperationUserList.push(personObjs)
                        }
                        this.form.cooperationUserList = cooperationUserList;
                        if(this.form.businessSigleCode.length<=0){
                            this.$Message.warning('添加服务');
                            this.loading = false;
                            return;
                        }
                        this.form.businessCode = [];
                    }

                    this.request({
                        url: '/crm/clueManagement/opportunityAdd.do',
                        data: {
                            id: this.id,
                            item: this.form,
                            from: this.from
                        }
                    }).then(data => {
                        this.$Message.success('新增商机成功');
                        this.callback('initList', data.number);
                        this.loading = false;
                    }, () => {
                        this.loading = false;
                    });

            },
            changeRadio(){
                switch(this.form.fromFlag){
                    case '100':
                        this.isInputorg = false;
                        this.orgTreeCheck=false;
                        this.personExtend = false;

                        if (this.currentOrgId && this.currentUserId) {
                            this.toOrgTree({
                                orgId: this.currentOrgId,
                                userId: this.currentUserId,
                                org: {
                                    name:  this.orgName
                                },
                                operationNote: 0
                            });
                        }
                        break;
                    case '200':
                        this.isInputorg = false;
                        this.orgTreeCheck=true;
                        this.personExtend = false;
                        break;
                    case '300':
                        this.isInputorg = true;
                        this.orgTreeCheck=true;
                        this.orgExtend = false;
                        this.personExtend = false;
                        break;
                    case '500':
                        this.isInputorg = true;
                        this.orgTreeCheck=true;
                        this.personExtend = false;
                        break;
                    default:
                        this.isInputorg = false;
                        this.orgTreeCheck=false;
                        this.personExtend = false;
                        break;
                }
            },
            changeTypeRadio(){
              if(this.form.type =='1'){
                  this.coopOrgTreeCheck = false;
                  this.coopOrgExtend = false;
                  this.isCoopInput = false;
                  this.form.businessSigleCode = [];

              }else{
                  this.coopOrgTreeCheck = true;
                  this.coopPersonExtend = false;
                  this.isCoopInput = true;
                  this.form.businessCode = [];
              }
            },
            cancel: function () {
                this.callback('', '');
            },
            /*请求服务类型列表数据*/
            getServiceList: function () {
                this.request({
                    url: '/crm/clueManagement/serviceList.do',
                    param: {
                        clueId: this.id
                    }
                }).then(data => {
                    this.serviceList = data;
                })
            },
            getOpportuityFrom(){
                this.request({
                    url: '/crm/clueManagement/getOpportuityFrom.do',
                }).then(data => {
                    this.opportunityList = data || [];
                    if(this.opportunityList.length){
                        this.form.fromFlag  =data[0].code;
                    }
                })
            },
            nodataTip() {
                if(!this.serviceList.length){
                    this.$Message.warning({
                        content: '现有服务你已都添加过，请使用已创建商机！',
                        duration: 2.5
                    });
                }
            },
            search(orgId = 0, callback, item) {
                let url = '/crm/clueManagement/dispatch/orgsByArea.do';

                this.request({
                    url: url,
                    param: {
                        orgId: orgId,
                    }
                }).then(data => {
                    this.orgActive = null;
                    this.orgCoopActive = null
                    this.orgIdActive = null;
                    this.personsIdActive = null;
                    this.personsNameActive = null;
                    this.personsCoopNameActive = [];
                    this.personsCoopNameId = [];

                    if (callback) {
                        callback(data);
                        if(data && !data.length) {
                            delete item.loading;
                        }
                        return;
                    } else {
                        this.stores = data;
                        this.coopStores = data;
                        this.persons = [];
                        this.coopPersons = [];
                    }
                });
            },
            loadData(item, callback) {
                this.search(item.id, callback, item);
            },
            searchList() {
                this.request({
                    url: "/crm/clueManagement/dispatch/orgsByName.do",
                    param: {
                        orgName: this.searchName,
                    }
                }).then(data => {
                    this.searchResult = data || [];
                    this.$refs.searchName.toggleMenu(this.searchResult && this.searchResult.length > 0);
                });
            },
            searchCoopList(){
                this.request({
                    url: "/crm/clueManagement/dispatch/orgsByName.do",
                    param: {
                        orgName: this.searchCoopName,
                    }
                }).then(data => {
                    this.searchCoopResult = data || [];
                    this.$refs.searchCoopName.toggleMenu(this.searchCoopResult && this.searchCoopResult.length > 0);
                });
            },
            getOrg(value) {
                this.searchResult.map(item => {
                    if (item.name == value) {
                        item.extra = 'provider'
                        this.getOrgsByOrgId(item);
                    }
                });
            },
            getCoopOrg(value) {
                this.searchCoopResult.map(item => {
                    if (item.name == value) {
                        item.extra = 'cooperation'
                        this.getOrgsByOrgId(item);
                    }
                });
            },
            getOrgsByOrgId(item, callback) {
                this.request({
                    url: "/crm/clueManagement/dispatch/orgsByOrgId.do",
                    param: {
                        orgId: item.id,
                    }
                }).then(data => {
                    if(item.extra=='provider'){
                        this.stores = data;
                        this.persons = [];
                        this.orgActive = item;
                        this.orgIdActive = item.id;
                        this.personsIdActive = null;
                        this.personsNameActive = null;
                        this.orgsItemHandle(item, callback);
                    }else if(item.extra=='cooperation'){
                        this.coopStores = data;
                        this.coopPersons = [];
                        this.orgCoopActive = item;
                        this.orgCoopIdActive = item.id;
                        this.personsCoopNameActive = [];
                        this.personsCoopNameId = [];
                        this.orgsItemCoopHandle(item, callback);
                    }else{
                        this.stores = data;
                        this.persons = [];
                        this.orgActive = item;
                        this.orgIdActive = item.id;
                        this.personsIdActive = null;
                        this.personsNameActive = null;
                        this.coopStores = data;
                        this.coopPersons = [];
                        this.orgCoopActive = item;
                        this.orgCoopIdActive = item.id;
                        this.personsCoopNameActive = [];
                        this.personsCoopNameId = [];
                        this.orgsItemHandle(item, callback);
                        this.orgsItemCoopHandle(item, callback);
                    }
                });
            },
            renderContent (h, { root, node, data }) {
                return h('div', {
                    style: {
                        display: 'inline-flex',
                        width: '100%',
                        position: 'relative'
                    },
                    on: {
                        click: () => {
                            if (!this.orgTreeCheck) {
                                return;
                            }
                            this.orgsItemHandle(data);

                        }
                    }
                }, [
                    h('div', {
                        style: {
                            width: '100%',
                        }
                    }, [
                        h('div', {
                            style: {
                                display: 'flex',
                                'justify-content': 'space-between',
                                backgroundColor: this.orgIdActive === data.id ? '#d4e8fb' : '#ffffff',
                                borderRadius: '3px',
                                height: '18px',
                                cursor: 'pointer',
                            },
                            attrs: {
                                class: 'dispatchNumberWrap'
                            }
                        }, [
//                            h('Icon', {
//                                style: {
//                                    marginLeft: '5px',
//                                },
//                                props: {
//                                    type: data.status == 0 ? 'checkmark-round' : 'close-round',
//                                    color: data.status == 0 ? '#59b399':(this.storeItem!=null && data.id==this.storeItem.id ? '#d4e8fb' : '#ffffff'),
//                                    size: '16',
//                                },
//                            }),
                            h('span', {
                                style: {
                                    marginLeft: '5px',
                                    marginRight: '5px',
                                }
                            }, data.name),
                        ]),
                    ]),
                ]);
            },
            renderContentCoop (h, { root, node, data }) {
                return h('div', {
                    style: {
                        display: 'inline-flex',
                        width: '100%',
                        position: 'relative'
                    },
                    on: {
                        click: () => {
                            if (!this.coopOrgTreeCheck) {
                                return;
                            }
                           this.orgsItemCoopHandle(data);
                        }
                    }
                }, [
                    h('div', {
                        style: {
                            width: '100%',
                        }
                    }, [
                        h('div', {
                            style: {
                                display: 'flex',
                                'justify-content': 'space-between',
                                backgroundColor: this.orgIdActive === data.id ? '#d4e8fb' : '#ffffff',
                                borderRadius: '3px',
                                height: '18px',
                                cursor: 'pointer',
                            },
                            attrs: {
                                class: 'dispatchNumberWrap'
                            }
                        }, [
//                            h('Icon', {
//                                style: {
//                                    marginLeft: '5px',
//                                },
//                                props: {
//                                    type: data.status == 0 ? 'checkmark-round' : 'close-round',
//                                    color: data.status == 0 ? '#59b399':(this.storeItem!=null && data.id==this.storeItem.id ? '#d4e8fb' : '#ffffff'),
//                                    size: '16',
//                                },
//                            }),
                            h('span', {
                                style: {
                                    marginLeft: '5px',
                                    marginRight: '5px',
                                }
                            }, data.name),
                        ]),
                    ]),
                ]);
            },
            getPersons(orgId, callback) {
                this.request({
                    url: "/crm/clueManagement/dispatch/personsByOrg.do",
                    param: {
                        orgId: orgId,
                    }
                }).then(data => {
                    this.persons = data || [];
                    this.orgIdActive = orgId;
                    this.personsIdActive = null;
                    callback && callback(this.persons.length);
                });
            },
            getCoopPersons(orgId, callback) {
                this.request({
                    url: "/crm/clueManagement/dispatch/personsByOrg.do",
                    param: {
                        orgId: orgId,
                    }
                }).then(data => {
                    this.coopPersons = data || [];
                    this.orgIdActive = orgId;
                    this.personsCoopNameActive = [];
                    callback && callback(this.coopPersons.length);
                });
            },

            orgsItemHandle(item, callback) {
                this.provideOrgId = item.id; //提供人当前组织id
                this.orgActive = item;
                this.orgExtend = false;
                this.getPersons(item.id, personsLength => {
                    if (callback) {
                        callback();
                        return;
                    }

                    this.personsIdActive = null;
                    this.personsNameActive = null;
                    this.personsCoopNameActive = [];
                    this.personsCoopNameId = [];
                    this.personExtend = true;

                    this.$emit('orgSelected', {
                        orgId: item.id,
                        orgName: item.name,
                        haveUsers: personsLength ? true : false,
                        noUsersTips: this.nodataTips
                    });
                });
            },
            orgsItemCoopHandle(item, callback) {
                this.coopOrgId = item.id;  //协作人当前组织id
                this.orgCoopActive = item;
                this.coopOrgExtend = false;
                this.getCoopPersons(item.id, personsLength => {
                    if (callback) {
                        callback();
                        return;
                    }
                    this.personsCoopNameActive = [];
                    this.personsCoopNameId = [];
                    this.coopPersonExtend = false;
                    /*
                    this.$emit('orgSelected', {
                        orgId: item.id,
                        orgName: item.name,
                        haveUsers: personsLength ? true : false,
                        noUsersTips: this.nodataTips
                    });*/
                });

            },
            personsItemHandle(userId, item) {
                this.personsIdActive = userId;
                this.personsNameActive = item.realName;
                this.personExtend = false;

                this.$emit('orgSelected', {
                    orgId: this.orgIdActive,
                    userId,
                    realName: item.realName,
                    orgName: this.orgActive.name,
                    phone: item.phone,
                });
            },

            personsCoopItemHandle(userId, item){
                if(userId==this.currentUserId){
                    this.$Message.warning('暂不支持自己与自己协作！');
                    return;
                }
                if(this.personsCoopNameId.indexOf(userId)>-1){
                    if( this.personsCoopNameId.length>0){
                        for(let i in this.personsCoopNameId){
                            if(this.personsCoopNameId[i]==userId){
                                this.personsCoopNameId.splice(i,1);
                                this.personsCoopNameActive.splice(i,1)
                            }
                        }
                    }
                }else{
                    this.personsCoopNameId.push(userId);
                    this.personsCoopNameActive.push(item.realName)
                }
            },

            /**
             * 定位到组织树相应的组织和人
             * @param item
             */
            toOrgTree(item) {
                this.getOrgsByOrgId({
                    id: item.orgId,
                    name: item.org && item.org.name
                }, () => {
                    if (!item.operationNote) {
                        for (let person of this.persons) {
                            if (person.id === item.userId) {
                                this.personsItemHandle(person.id, person);
                                break;
                            }
                        }

                        if(item.userId==this.currentUserId){
                            return;
                        }
                        for (let person of this.coopPersons) {
                            if (person.id === item.userId) {
                                this.personsCoopItemHandle(person.id, person);
                                break;
                            }
                        }
                    }
                });
            },
            orgFieldHandle() {
                if (!this.orgTreeCheck) {
                    return;
                }
                this.orgExtend = !this.orgExtend;
            },

            cooperOrgFieldHandle(){
                if (!this.coopOrgTreeCheck) {
                    return;
                }
                this.coopOrgExtend = !this.coopOrgExtend;
            },
            personFieldHandle() {
                if (!this.orgTreeCheck) {
                    return;
                }
                this.personExtend = !this.personExtend;
            },
            personFieldCoopHandle(){
                if (!this.coopOrgTreeCheck) {
                    return;
                }
                this.coopPersonExtend = !this.coopPersonExtend;
            },
        }
    }
</script>

<style scoped>
    .form {
        margin: 5px 10px 0 0;
    }

    .buttonPanel {
        margin-bottom: 0;
    }

    .orgTree,
    .personsWrap {
        line-height: 1.5;
    }
    .orgInput:not(.orgInputDisabled) >>> input[disabled] {
        background-color: #fff;
        cursor: pointer;
    }
    .orgField {
        position: relative;
        padding: 0 7px;
        line-height: 32px;
        font-size: 12px;
        border: 1px solid #dddee1;
        border-radius: 4px;
        color: #495060;
        background-color: #fff;
        background-image: none;
        cursor: pointer;
        transition: border .2s ease-in-out,background .2s ease-in-out,box-shadow .2s ease-in-out;
    }
    .orgField:after {
        content: "";
        position: absolute;
        top: 50%;
        right: 8px;
        margin-top: -2.5px;
        border-width: 5px;
        border-color: #80848f transparent transparent transparent;
        border-style: solid;
        transition: all .3s ease-in-out;
    }
    .extended:after {
        transform-origin: center 2.5px;
        transform: rotate(180deg);
    }
    .orgFieldDisabled {
        background: #f7f7f7;
        color: #ccc;
        cursor: not-allowed;
    }
    .personsWrap > li {
        padding: 5px;
        cursor: pointer;
    }
    .nodata {
        text-align: center;
    }
    .personsWrap li.active .ivu-row-flex {
        background: #d4e8fb;
    }
    .personsWrap li .ivu-row-flex:hover,
    .orgTree >>> .dispatchNumberWrap:hover {
        background-color: #f3f3f3 !important;
    }
    .orgPanel {
        padding: 10px;
        border: 1px solid #dddee1;
        border-top: none;
    }
    .cooperation-label{
        display: inline-block;
        height: 22px;
        line-height: 22px;
        margin: -2px 4px 2px 0;
        padding: 0 8px;
        border: 1px solid #e9eaec;
        border-radius: 3px;
        background: #f7f7f7;
        font-size: 12px;
        vertical-align: middle;
        opacity: 1;
        overflow: hidden;
        cursor: pointer;
    }
</style>