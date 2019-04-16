<style scoped>
    .container {
        width: 800px;
        /*min-height: 500px;*/
        margin: 15px auto;
        padding: 15px 15px 30px 15px;
        background: white;
        border-radius: 5px;
        box-shadow: 0 2px 3px 0 rgba(175, 175, 175, 0.5);
    }
    .title {
        padding: 0 15px;
        line-height: 34px;
        color: #666;
        font-size: 16px;
        font-weight: bold;
        border-bottom: solid 1px #dddee1;
    }

    .ivu-form {
        width: 400px;
    }

    .user-item-label {
        line-height: 33px;
        font-size: 15px;
        vertical-align: middle;
        box-sizing: border-box;
    }
    .user-item-btn {
        margin-left: 15px;
    }

    .org-item {
        margin-top: 10px;
        padding: 7px 15px;
        line-height: 30px;
        border: solid 1px #dddee1;
        border-radius: 5px;
        color: #666;
    }
    .org-item:hover {
        /*color: #59b399;*/
        border-color: #59b399;
    }
    .org-item-name {
        font-size: 16px;
        font-weight: bold;
    }
    .org-item-name > .ivu-btn {
        float: right;
        padding: 5px 15px;
        display: none;
    }
    .org-item-post {
        font-size: 13px;
    }
    .org-item:hover > .org-item-name > .ivu-btn {
        display: inline-block;
    }
    .image-box {
        position: relative;
        z-index: 1;
        background-color: #e4fff1;
        opacity:0;
        width: 90px;
        height: 76px;
    }

    .image-box:hover {
        margin-top: 0px;
        position: relative;
        /*z-index: 1;*/
        background-color: #e4fff1;
        opacity:0.3;
        width: 90px;
        height: 76px;
    }
    .box >>> .ivu-upload {
        height: 0px;
    }
    .save-pic-btn{
        position: absolute;
        left: 35%;
        top: 32%;
    }
</style>

<template>
    <div class="container">
        <div class="title">个人信息</div>

        <Form ref="form" :model="item" :label-width="80" :rules="itemRules" style="margin-top: 30px;" v-show="editMode">
            <FormItem label="姓名" prop="realName">
                <Input v-model="item.realName" style="width: 200px;" />
                <ButtonGroup style="float: right;">
                    <Button class="user-item-btn" @click="save">保存</Button>
                    <Button type="ghost" class="user-item-btn" @click="cancel">取消</Button>
                </ButtonGroup>
            </FormItem>
            <FormItem label="用户名" prop="userName">
                <Input v-model="item.userName" />
            </FormItem>
        </Form>

        <Form :label-width="80" style="margin-top: 30px;" v-if="!editMode">
            <FormItem label="姓名">
                <label class="user-item-label">{{item.realName}}</label>
                <Button type="ghost" class="user-item-btn" @click.native="editMode = true">修改基本信息</Button>
            </FormItem>
            <FormItem label="用户名">
                <label class="user-item-label" >{{item.userName}}</label>
                <Button type="ghost" class="user-item-btn" @click.native="jumpSystemPage('changePassword')">修改密码</Button>
            </FormItem>
        </Form>

        <Form :label-width="80">
            <FormItem label="手机号">
                <label class="user-item-label" v-if="item.phone">{{item.phone}}</label>
                <Button type="ghost" class="user-item-btn" @click.native="jumpSystemPage('changePhone')" v-if="item.phone">修改手机号</Button>
                <label class="user-item-label" v-if="!item.phone">无</label>
                <Button type="ghost" class="user-item-btn" @click.native="jumpSystemPage('changePhone')" v-if="!item.phone">绑定手机号</Button>
            </FormItem>
        </Form>

        <Form :label-width="80">
            <FormItem label="上传图片">
                <div class="box" style="width: 90px; height: 76px; margin-bottom: 20px;margin-top:8px;  cursor: pointer;">
                    <BSUpload :beforeUpload="beforeUpload" :onSuccess="onSuccess" :showProcess="true" :type="['png','jpeg','jpg']">
                        <div class="image-box" style="text-align: center; vertical-align: middle;">
                            <Icon style="font-size: 48px; padding-top: 16px; " type="upload"></Icon>
                        </div>
                    </BSUpload>
                    <img v-if="item.headPortrait" :src="$updateConfig.file+item.headPortrait" style="width:90px; height:76px;"/>
                    <img v-else src="/static/noimg.png" style="width:90px; height:76px;"/>
                </div>
                <Button type="ghost" class="save-pic-btn" @click.native="savePicUpdate()" >保存图片</Button>
            </FormItem>
        </Form>

        <div class="title" style="margin-top: 50px;">我的机构</div>
        <div class="org-item" v-for="(orgItem, index) in orgItems" :key="index">
            <div class="org-item-name">
                {{orgItem.orgName}} - {{orgItem.deptName}}
                <Button @click="switchOrg(orgItem)" v-if="orgItem.orgId != currentOrgId">切换</Button>
                <span v-else style="float: right; font-size: 14px; color: #59b399;">当前登录机构</span>
            </div>
            <div class="org-item-post">
                <b>我的岗位：</b>
                <span v-for="(postItem, index) in orgItem.postVos" :key="index" style="margin-right:7px;">{{postItem.postName}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                item: {},
                itemRules: {
                    realName: [{required: true, message: "姓名不能为空"}],
                    userName: [{required: true, message: "用户名不能为空"}]
                },
                orgItems: [],
                editMode: false,
                currentOrgId: null
            }
        },
        created () {
            this.currentOrgId = Context.getCurrentOrganization().id;
            this.getUserInfo();
            this.getUserPost();
        },
        methods: {
            getUserInfo () {
                debugger
                this.request({
                    url: "/system/user/getCurrentUserInfo.do"
                }).then(item => {
                    this.item = item;
                });
            },
            getUserPost () {
                this.request({
                    url: "/system/user/getCurrentUserPost.do"
                }).then(items => {
                    this.orgItems = items;
                });
            },
            jumpSystemPage (code) {
                window._frameRouter.push(code);
            },
            save () {
                this.$refs.form.validate(valid => {
                    if(valid) {
                        this.request({
                            url: "/system/user/updateUserInfo.do",
                            data: {
                                userName: this.item.userName,
                                realName: this.item.realName
                            }
                        }).then(() => {
                            this.editMode = false;
                            this.getUserInfo();
                            this.$Message.info("保存成功");
                        });
                    }
                });
            },
            switchOrg (item) {
                this.request({
                    url: "/system/switchOrg.do",
                    param: {
                        id: item.orgId,
                        name: item.orgName
                    }
                }).then(() => {
                    location.href = location.origin;
                });
            },
            beforeUpload:function(file){
            },
            onSuccess:function(id){
                this.$set(this.item, "headPortrait", id);
            },
            savePicUpdate(){
                if (!this.item.headPortrait) {
                    this.$Message.info({content: '请上传一张用户照片'});
                    return;
                }

                this.request({
                    url: "/systemManage/update/updateImg.do",
                    data: {
                        id: this.item.id,
                        headPortrait: this.item.headPortrait
                    }
                }).then(() => {
                    this.$Message.success('保存成功');
                })
            },
            cancel () {
                this.editMode = false;
                this.getUserInfo();
            }
        }
    };
</script>