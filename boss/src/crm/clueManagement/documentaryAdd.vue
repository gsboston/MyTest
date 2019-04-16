<template>
    <Form :model="form" ref="form" :label-width="110" class="form">
        <FormItem label="沟通目的" prop="purpose" :rules="{required: true, message: '沟通目的不能为空', trigger: 'change'}">
            <Select v-model="form.purpose" placeholder="沟通目的">
                <Option v-for="type in purposeList" :key="type.code" :value="type.code">{{type.name}}</Option>
                <!--<Option value="0">开公司</Option>-->
                <!--<Option value="1">代记账</Option>-->
            </Select>
        </FormItem>
        <FormItem label="意向度" prop="intent" :rules="{required: true, message: '意向度不能为空', trigger: 'change'}">
            <Select v-model="form.intent" placeholder="意向度">
                <Option v-for="type in intentList" :key="type.code" :value="type.code">{{type.name}}</Option>
                <!--<Option value="5">找律师</Option>-->
                <!--<Option value="6">企服务</Option>-->
            </Select>
        </FormItem>
        <FormItem label="执行时间">
            <DatePicker v-model="form.executeDate" type="date" :options="executeDateOptions" placeholder="选择日期" style="width: 220px"></DatePicker>
        </FormItem>
        <FormItem label="下次跟进时间">
            <DatePicker v-model="form.nextDate" type="date" :options="nextDateOptions" placeholder="选择日期" style="width: 220px"></DatePicker>
        </FormItem>
        <FormItem label="上传附件">
            <div class="uploadWrap">
                <!--<BSUpload :beforeUpload="beforeUpload" :onSuccess="onSuccess" :type="['png','jpeg','jpg','pdf','doc','docx','xls','xlsx']">-->
                <Row class="demo-upload-list" v-for="(img,index) in item.uploadIdImgList" :key="index">
                    <i-col class="spUpdate"  v-if="img.fileId">
                        <img :src="$updateConfig.file+img.fileId+imageService">
                        <i style="cursor:pointer;" class="ivu-badge-count" @click="handleImgRemove(img)">x</i>
                    </i-col>
                    <i-col  class="spUpdate"   v-else>
                        <span  class="urlsName">{{img.name}}文件</span>
                        <i style="cursor:pointer;" class="ivu-badge-count" @click="handleImgRemove(img)">x</i>
                    </i-col>
                </Row>
                <BSUpload  v-if="item.uploadIdImgList.length<=2" :beforeUpload="beforeUpload" :onSuccess="onSuccess" multiple  :type="['png','jpeg','jpg','pdf','doc','docx','xls','xlsx']">
                    <Button size="small">上传</Button>
                </BSUpload>


            </div>
        </FormItem>
        <FormItem label="沟通结果">
            <Input v-model="form.result" type="textarea" :rows="4" :maxlength="100"></Input>
        </FormItem>
        <FormItem class="buttonPanel">
            <Button type="primary" @click="save">提交</Button>
            <Button type="ghost" style="margin-left: 8px" @click="cancel">取消</Button>
        </FormItem>
    </Form>
</template>

<script>
    export default {
        props: {
            id: null,
            oppoId: null
        },
        data: function () {
            return {
                form: {
                    executeDate: new Date(new Date().toLocaleDateString()),
                },
                arrList:[],
                type: '私有商机',
                purposeList: [],
                intentList: [],
                flag:false,
                typeName:'',
                item: {
                    uploadIdImgList:[],//上传文件列表
                },
                url: '',
                urlId: '',
                imageService: '?x-oss-process=image/resize,w_100,h_100/quality,Q_80', // 图片处理
                executeDateOptions: {
                    disabledDate (date) {
//                        console.log('executeDateOptions');
                        return date && date.valueOf() > Date.now();
                    }
                },
                nextDateOptions: {
                    disabledDate (date) {
//                        console.log('nextDateOptions');
                        return date && date.valueOf() < Date.now() - 86400000;
                    }
                },
                file: {
                    isImage: false
                }
            }
        },
        created: function () {
//            console.log('跟单记录添加弹框');
//            console.log(this.id);
//            console.log(this.oppoId);
            this.initPurpose();
            this.initIntent();
        },
        methods: {
            save: function () {
                console.log( this.item.uploadIdImgList)
                let arrListFiled = [];
                let arrListName = [];
                let arrMesh = []
                for(var i in this.item.uploadIdImgList){
                    arrListFiled.push(this.item.uploadIdImgList[i].fileId+'.'+this.item.uploadIdImgList[i].fileName);
                    for(var i in arrListFiled){
                        if(arrListFiled[i]===undefined){
                            delete arrListFiled[i]
                        }
                    }
                    arrListName.push(this.item.uploadIdImgList[i].nameId + '.'+this.item.uploadIdImgList[i].name)
                    for(var i in arrListName){
                        if(arrListName[i]===undefined){
                            delete arrListName[i]
                        }
                    }
                }
                arrMesh = arrListFiled.concat(arrListName);
                for(var i = 0 ;i<arrMesh.length;i++)
                {
                    if(arrMesh[i] == "" ||arrMesh[i] == "undefined.undefined")
                    {
                        arrMesh.splice(i,1);
                        i= i-1;
                    }
                }
                console.log(arrMesh)
               if(arrMesh.length==3) {
                   this.urlId = arrMesh[0].split('.')[0] + ',' +arrMesh[1].split('.')[0] + ','+arrMesh[2].split('.')[0];
                   this.typeName = arrMesh[0].split('.')[1] + ',' +arrMesh[1].split('.')[1] + ','+arrMesh[2].split('.')[1];
               }
               if(arrMesh.length==2){
                   this.urlId = arrMesh[0].split('.')[0] + ',' +arrMesh[1].split('.')[0];
                   this.typeName = arrMesh[0].split('.')[1] + ',' +arrMesh[1].split('.')[1];
               }
                if(arrMesh.length==1){
                    this.urlId = arrMesh[0].split('.')[0];
                    this.typeName = arrMesh[0].split('.')[1];
                }
console.log(this.urlId);
                console.log(this.typeName)
                this.$refs.form.validate(valid => {
                    if(valid){
                        this.request({
                            url: '/crm/clueManagement/documentaryAdd.do',
                            data: {
                                clueId: this.id,
                                oppoId: this.oppoId,
                                item: this.form,
                                url: this.urlId,
                                type:this.typeName
                            }
                        }).then(data => {
                            this.$Message.success('新增跟单记录成功');
                            this.callback(data);
                        });
                    }
                })

            },
            handleImgRemove(fileImg){
                const file = this.item.uploadIdImgList;
                this.item.uploadIdImgList.splice(file.indexOf(fileImg), 1);
            },
            cancel: function () {
                this.callback('');
            },
            /* 沟通目的 */
            initPurpose: function () {
                this.request({
                    url: '/crm/clueManagement/purpose.do'
                }).then(data => {
                    this.purposeList = data;
                });
            },
            /* 意向度 */
            initIntent: function () {
                this.request({
                    url: '/crm/clueManagement/intent.do'
                }).then(data => {
                    this.intentList = data;
                });
            },
            beforeUpload:function(file){
                this.arrList.push(file);
                if(this.arrList.length + this.item.uploadIdImgList.length>3){
                    if(!this.flag)
                        this.$Message.info('上传文件不能大于三个');
                    this.flag=true;
                    setTimeout(()=>{
                        this.flag=false;
                    },1500);
                    this.arrList.pop();
                    return false;
                }
                this.urlId = '';
                this.url = '';
                this.file = file;
                this.file.isImage = this.file.type.indexOf('image') > -1;
            },
            onSuccess:function(id,file){
                this.arrList = [];
                /*   if(this.item.uploadIdImgList.length>=3){
                       this.$Message.error("上传文件不能大于三个");
                       return;
                   }*/
                var fileObj = {},
                    temp = file.name.split('.'),
                    fileSuffix = temp[temp.length - 1],
                    fileSuffixArray = ['png', 'jpeg', 'jpg'];

                if (fileSuffixArray.indexOf(fileSuffix) > -1) {
                    fileObj.fileId = id;
                    fileObj.fileName = fileSuffix;
                    this.item.uploadIdImgList.push(fileObj);
                } else {
                    fileObj.name = fileSuffix;
                    fileObj.nameId = id;
                    this.item.uploadIdImgList.push(fileObj);
                }
            }
        }
    }
</script>

<style scoped>
    .form{
        margin: 5px 15px 0 0;
    }
    .buttonPanel{
        margin-bottom: 0;
    }
    .urls{
        margin-top: 6px;
        width: 60px;
        height: 60px;
    }
    .urlsName{
        max-width: 100%;
        line-height: 3.3rem;
        word-break: break-all;
        overflow: hidden;
        margin: 0 .3rem 0 0;
        border: solid 1px #ccc;
        width: 100%;
        height: 100%;
        display: inline-block;
        text-align: center;
    }
    .uploadWrap > div{
        display: inline-block;
        vertical-align: top;
        margin: 0 10px 10px 0;
    }
    .demo-upload-list{
        display: inline-block;
        margin:0 .4rem 0 0;
    }
    .spUpdate{
        display: inline-block;
        position:relative;
        width:3.5rem;
        height:3.5rem;
    }
    .spUpdate img{
        height:100%;
        width:100%;
    }
</style>