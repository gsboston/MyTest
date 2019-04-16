<template>
    <div class="cooper-wrap">
        <div  class="cooper">
            <div class="cooper-info" v-for="(person,index) in cooperationPerson" v-if="person" :key="index">
                <i-col span="14" > <div class="left">协作人所在机构 <span></span>：{{person.orgName}}</div></i-col>
                <i-col span="9" offset="2"> <span v-for="(per,index) in person.userList" class="right">{{per.userRealName}}</span></i-col>
            </div>
        </div>
        <div type="flex" class="cooper-content">
            <i-col span="12" >
                <auto-comp
                        ref="searchName"
                        v-model="searchName"
                        icon="ios-search"
                        placeholder="按组织名称查询"
                        @on-search="searchList"
                        @on-select="getOrg"
                        style="width:320px;">
                    <Option v-for="option in searchResult" :value="option.name" :key="option.id">
                        {{option.name}}
                    </Option>
                </auto-comp>
                <div class="tree-cont">
                    <Tree ref="tree" multiple :data="stores" :load-data="loadData" :render="renderContent" class="orgTree"></Tree>
                </div>

            </i-col>
            <i-col span="9" offset="2">
                <ul class="personsWrap">
                    <li :class="{active:personsIdList.indexOf(item.id)>-1}" v-for="(item, index) in persons" @click="personsItemHandle(item.id, item)">
                        <Row type="flex" justify="space-between">
                            <i-col>
                                <div class="personsName" :disabled="item.collectCount >= COLLECT_UPPER_LIMIT || item.id === $context.getCurrentUser().id">{{ item.realName }}（{{ item.userName }}）</div>
                            </i-col>
                        </Row>
                    </li>
                    <li v-if="orgIdActive && !persons.length" class="nodata">{{ nodataTips }}</li>
                </ul>
            </i-col>
        </div>

        <slot name="btn">
            <div class="btnWrap">
                <Button type="primary" @click="save" >保存</Button>
            </div>
        </slot>
    </div>
</template>

<script>
    export default {
        props: {
            clueId: null,
            oppoId: null,
            orgId: null,
            userId: null
        },
        data() {
            return {
                searchName: '',
                searchResult: [],
                stores: [],
                persons: [],
                orgActive: null,
                orgIdActive: null,
                selectOrgId:[],
                selectOrg:'',
                personsIdActive: null,
                personObj:{},
                personsIdList:[],
                personList:[],
                orgNames:'',
                currentOrgArr:[],
                currentOneOrgId:'',
                currentOneName:'',
                delOrgIdList:[],
                cooperOrgName:[],
                cooperOrgId:[],
                saveList:[],
                cooperationPerson:[],
                isHeight:false,
                isHeightList:[],
                currentOrgName:'',
                storeItem: null,
                nodataTips: '该组织暂无协作人员。',
             /*   isInsideDispatch: false, // 是否是内部派单*/
                COLLECT_UPPER_LIMIT: 300, // 收藏量上限
            };
        },
        created() {

            this.getCooperation();
        },
        methods: {
            getCooperation(){
                let url='';
                url = '/crm/clueManagement/cooperation/getCooperation.do';
                this.request({
                    url: url,
                    param: {
                        oppoId: this.oppoId,
                    }
                }).then(data => {
                    this.cooperationPerson = data;
                    this.search();
                });
            },
            search(orgId = 0, callback, item) {
                let url = '';
                url = '/crm/clueManagement/dispatch/orgsByArea.do';
                this.request({
                    url: url,
                    param: {
                        orgId: orgId,
                    }
                }).then(data => {
                    this.orgActive = null;
                    this.orgIdActive = null;
                    this.personsIdActive = null;
                  /*  this.personsIdList = [];*/

                    if (callback) {
                        callback(data);
                        if (data && !data.length) {
                            delete item.loading;
                        }
                        return;
                    } else {
                        this.stores = data;
                        let flag=false;
                        for(var i in this.stores[0].children){
                            for(var j in this.cooperationPerson){
                                if(this.stores[0].children[i].id==this.cooperationPerson[j].orgId){
                                    this.currentOneOrgId = this.cooperationPerson[j].orgId;
                                    this.currentOneOrgName = this.cooperationPerson[j].orgName;
                                    flag=true;
                                    break;
                                }
                            }
                            if(flag){
                                break;
                            }
                        }

                        for(var i in this.cooperationPerson){
                            if(this.cooperationPerson[i].orgId==this.currentOneOrgId){
                                for(var j in this.cooperationPerson[i].userList){
                                    this.personsIdList.push(this.cooperationPerson[i].userList[j].userId);
                                    console.log(this.personsIdList)
                                }
                              /*  for(this.cooperationPerson[i].)*/
                            }
                        }
                        this.persons = [];
                    }
                    this.getPersons(this.currentOneOrgId);
                   /* this.getPersons(this.orgId)*/
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
            getOrg(value) {
                this.searchResult.map(item => {
                    if (item.name == value) {
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
                    this.stores = data;
                    this.persons = [];
                    this.orgActive = item;
                    this.orgIdActive = item.id;
//                            this.orgIdActive = null;
                    this.personsIdActive = null;
                   /* this.personsIdList = [];*/
                    this.orgsItemHandle(item, callback);

//                    this.storeItem = null;
//                    this.$nextTick(function () {
//                        this.storeItem = item;
//                    });
                });
            },
            renderContent(h, {root, node, data}) {
                return h('div', {
                    style: {
                        display: 'inline-flex',
                        width: '100%',
                        position: 'relative'
                    },
                    on: {
                        click: () => {
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
//
                            h('span', {
                                style: {
                                    marginLeft: '5px',
                                    marginRight: '5px',
                                    overflow: 'hidden',
                                }
                            }, data.name),
                        ]),
                    ]),
                ]);
            },
            getPersons(orgId, callback) {
                if(!orgId){
                    return;
                }
                this.request({
                    url: "/crm/clueManagement/dispatch/personsByOrg.do",
                    param: {
                        orgId: orgId,
                    }
                }).then(data => {
                    this.persons = data || [];
                    for(var i in this.persons){
                        this.persons[i].orgId = orgId;
                    }
                    this.orgIdActive = orgId;
                    this.personsIdActive = null;
                    callback && callback(this.persons.length);
                });

            },
            orgsItemHandle(item, callback) {
                console.log(item);
                this.personsIdList = [];
                this.orgActive = item;
                for(var i in this.cooperationPerson){
                    if(this.cooperationPerson[i].orgId==item.id){
                        for(var j in this.cooperationPerson[i].userList){
                            this.personsIdList.push(this.cooperationPerson[i].userList[j].userId);
                            console.log( this.personsIdList)
                        }
                    }
                }
                this.getPersons(item.id, personsLength => {
                    if (callback) {
                        callback();
                        return;
                    }
                });
            },
            personsItemHandle(userId, item) {
                if (userId === this.$context.getCurrentUser().id) {
                    this.$Message.warning('暂不支持自己与自己协作');
                    return;
                }
                this.personsIdActive = userId;


                var ids=''
                if(this.orgActive){
                    ids = this.orgActive.id;
                    this.orgNames = this.orgActive.name;
                }else{
                     ids =  this.currentOneOrgId;
                     this.orgNames = ''
                }

                let userList = []
                for(var i in this.cooperationPerson){
                    if(this.cooperationPerson[i].orgId==ids){
                        this.orgNames = this.cooperationPerson[i].orgName
                        if(this.cooperationPerson[i].userList.length){
                            userList = this.cooperationPerson[i].userList
                        }else{
                            userList = []
                        }
                    }
                }
                let objs = {orgId:ids,orgName: this.orgNames,userList:userList}
                this.cooperationPerson[ids]=objs;


                let obj = {orgId:item.orgId,orgName:this.orgNames,userId:userId,userRealName:item.realName}
                if(this.personsIdList.indexOf(userId)>-1){
                    if(this.personsIdList.length>0){
                        for(var i in this.personsIdList){
                            if(this.personsIdList[i]==this.personsIdActive){
                                this.personsIdList.splice(i,1);
                            }
                         }
                    }

                    for(var k in this.cooperationPerson){
                        if(this.cooperationPerson[k].orgId==item.orgId){
                            for(var n in this.cooperationPerson[k].userList){
                                if(this.cooperationPerson[k].userList[n].userId==this.personsIdActive){
                                    this.cooperationPerson[k].userList.splice(n,1)
                                }
                            }

                        }
                        if(!this.cooperationPerson[k].userList.length){
                            this.delOrgIdList.push(this.cooperationPerson[k].orgId)
                            delete this.cooperationPerson[k]
                        }
                    }
                }else{
                    this.personsIdActive = userId;
                    this.personsIdList.push(userId);
                    for(var i in this.cooperationPerson){
                        if(this.cooperationPerson[i].orgId==item.orgId){
                             this.cooperationPerson[i].userList.push(obj);
                        }

                    }
                }

            },
            save() {
                let personUser = {};
                this.saveList = [];
                for(var i in this.cooperationPerson){
                    for(var j in this.cooperationPerson[i].userList){
                        this.saveList.push(this.cooperationPerson[i].userList[j])
                    }
                }

                this.request({
                    url: "/crm/clueManagement/cooperation/addcooperation.do",
                    data:{
                        saveList:this.saveList,
                        oppoId:this.oppoId,
                        delOrgIdList:this.delOrgIdList
                    }
                }).then(data => {
                    this.callback('success');
                    this.$Message.success('商机协作人添加成功！');
                });
            },
        },
        filters:{
            capitalize(val){
                return val + ','
            }
        }
    };
</script>

<style scoped>
    .orgTree {
        margin-top: 10px;
       /* height: 360px;
        overflow-y: scroll;*/
    }
    .cooper-content{
        margin:16px 0 0 0;
        overflow: hidden;
    }
    .personsWrap {
        margin-top: 32px;
        height:280px;
        overflow: auto;
    }
    .tree-cont{
        height:280px;
        overflow-y: auto;
        overflow-x:hidden;
    }
    .personsWrap > li {
        padding: 5px;
        cursor: pointer;
    }
    .orgTree >>> .ivu-badge-count,
    .personsNumberWrap >>> .ivu-badge-count{
        background-color: #ff8066;
    }
    .nodata {
        text-align: center;
    }
    .personsWrap li.active .ivu-row-flex {
        background: #d4e8fb;
    }
    .personsName[disabled] {
        color: #bbb;
    }
    .btnWrap {
        margin-top: 15px;
        text-align: center;
    }
    .cooperation-org-name{
        height:40px;
        line-height: 40px;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .cooperation-org-name span{
        margin:0 5px 0 0;
    }
    .cooper-wrap{
        padding: 5px 17px;
    }
    .cooper-wrap .cooper{
        height: 80px;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .cooper-info{
        display: flex;
        background: #f8f8f8;
        padding: 5px;
    }
    .cooper-info .left{

    }
    .cooper-info .right{
        margin: 0 10px 4px 0;
        padding: 2px 4px;
        display: inline-block;
    }
</style>