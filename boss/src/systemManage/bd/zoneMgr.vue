<style scoped>
    .zoneMgr{
        padding:30px;
    }
    .zoneMgr-tool{
        margin-left: 365px;
    }
    .zoneMgr-transferBox{

    }
    .zoneBtn{
        float: left;
        position: relative;
    }
    .zoneBtn button{
        border-radius: 0;
    }
    .zoneClose{
        position: absolute;
        top: -1px;
        right: 2px;
        cursor: pointer;
    }
    .zoneClose:hover{
        color: #FFFFFF;
    }
    .zoneClose:hover{
        color: #FFFFFF;
    }
    .unactive:hover{
        color: #59b399;
    }
</style>
<template>
    <div class="zoneMgr">
        <Alert v-if="!zoneList||zoneList.length==0" type="warning" show-icon>当前没有战区信息，请先添加战区</Alert>
        <div class="zoneMgr-tool">
            <ButtonGroup>
                <div class="zoneBtn" v-for="zone in zoneList" @mouseover="showClose(zone)" @mouseleave="hideClose()">
                    <Button  :type="selectedZone==zone?'default':'ghost'"  @click="selectZone(zone)">
                        <span>{{zone.name}}</span>
                    </Button>
                    <div v-if="hoverZone == zone" :class="selectedZone==zone?'zoneClose':'zoneClose unactive'" @click="removeZone(zone)"><Icon type="close-circled"></Icon></div>
                </div>
                <Button type="ghost" @click="addZone()"><Icon type="plus"></Icon></Button>
            </ButtonGroup>

        </div>
        <br>
        <div class="zoneMgr-transferBox">
            <Transfer
                    :data="areaList"
                    :target-keys="targetKeys"
                    :list-style="listStyle"
                    :render-format="renderFmt"
                    :titles="['所有区域',selectedZone.name?selectedZone.name:'']"
                    @on-change="changeHandle"></Transfer>
        </div>
    </div>
</template>

<script type="text/babel">
    export default {
        data: function() {
            return {
                hoverZone:{},
                zoneType:'1',
                areaList:[],
                zoneAreaList:[],
                zoneList:[],
                selectedZone:{},
                targetKeys:[],
                listStyle:{
                    width:'300px',
                    'min-height':'500px'
                }
            }
        },
        created: function() {
            this.loadAreaList();
            this.loadZoneList();
        },
        methods: {
            loadAreaList:function () {
                this.request({
                    url: "/systemManage/zoneMgr/getAreaList.do"
                }).then(data => {
                    this.areaList = data.map((m)=>{
                        m.key = m.id;
                        return m;
                    });
                });
            },
            loadZoneAreaList () {
                if(this.selectedZone&&this.selectedZone.id)
                this.request({
                    url: "/systemManage/zoneMgr/getZoneAreaList.do?id="+this.selectedZone.id
                }).then(data => {
                    this.zoneAreaList = data;
                    this.targetKeys = this.zoneAreaList.map((m)=>{
                        return m.id;
                    });
                });
            },
            loadZoneList () {
                this.request({
                    url: "/systemManage/zoneMgr/getZoneList.do"
                }).then(data => {
                    this.zoneList = data;
                    if(data&&data.length>0){
                        this.selectedZone = data[0];
                        this.loadZoneAreaList();
                    }
                });
            },
            changeHandle (newTargetKeys) {
                if(this.selectedZone&&this.selectedZone.id){
                    this.request({
                        url: "/systemManage/zoneMgr/changeZoneAreaList.do",
                        data:{
                            zoneId:this.selectedZone.id,
                            areaList:newTargetKeys
                        }
                    }).then(data => {
                        this.$Message.info("操作成功");
                        this.loadAreaList();
                        this.loadZoneAreaList();
                    });
                }else{
                    this.$Message.info('当前未选择战区，请选择战区或者新增战区');
                }

            },
            renderFmt (item) {
                return item.name +(item.warZoneName?' - '+item.warZoneName:"");
            },
            selectZone(item){
                this.selectedZone = item;
                this.loadZoneAreaList();
            },
            addZone(){
                this.prompt({
                    code: "zoneCard",
                    title:"新增战区档案",
                    width:400,
                    callback: (close) => {
                        this.loadZoneList();
                        close();
                    }
                });
            },
            showClose(item){
              this.hoverZone =  item;
            },
            removeZone(item){
                this.$Modal.confirm({
                    content: '确定删除此战区吗?',
                    onOk: () => {
                        this.request({
                            url: "/systemManage/zoneMgr/removeZone.do?id="+item.id,
                        }).then(data => {
                            this.$Message.info("删除成功");
                            this.loadZoneList();
                        });
                    }
                });

            },
            hideClose(){
                this.hoverZone = {};
            }
        }
    };
</script>

