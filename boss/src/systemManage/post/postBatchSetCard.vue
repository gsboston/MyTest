<template>
    <Row v-if="type == 'post'">
        <i-form :label-width="80" ref="form" style="padding: 0 20px;">
            <Form-item label="已选用户" style="border-bottom: 1px solid #DDD;padding: 20px 0;">
                <Tag v-for="(item, index) in userData" :key="index">{{ item.realName }}</Tag>
            </Form-item>
            <Form-item :label-width="20">
                <CheckboxGroup v-model="selectedPostIds">
                    <Checkbox v-for="item in postValues" :label="item.id" :key="item.id">{{item.name}}</Checkbox>
                </CheckboxGroup>
            </Form-item>
            <div class="ivu-form-item-required">
                <p class="ivu-form-item-label" style="padding-left: 20px;margin-bottom: 20px;">
                    说明：批量设置岗位信息后，已设置过的账号岗位信息作废，按最新设置生效
                </p>
            </div>
            <i-col span="24" style="text-align: center;">
                <Button @click="save">保存</Button>
            </i-col>
        </i-form>
    </Row>
    <Row v-else class="choose-user">
        <Transfer :data="leftData" :targetKeys="rightDataKeys" :titles="['待选列表', '已选列表']" :operations="['移除', '添加']" filterable @on-change="changeTransferData"></Transfer>
    </Row>
</template>

<script>
    export default {
        props: {
            orgId: null,  //组织id
            deptId: null,  //部门id
            userData: {
                type: Array,
                default: []
            },
            authLevel: null,
            type: {
                type: String,
                default: 'post'
            },
            postId: null,
            callbackFunc: {
                type: Function,
                default: null
            }
        },
        data: function() {
            return {
                postValues: [],
                selectedPostIds: [],
                userIds: [],

                leftData: [],
                rightDataKeys: [],
            }
        },
        created: function() {
            let vm = this;
            if (vm.type == 'post') {
                vm.userData.forEach(item => {
                    vm.userIds.push(item.id);
                });
                vm.getPostsData();
            }else {
                vm.initUserData();
            }
        },
        methods: {
            getPostsData(key = 'no') {
                this.request({
                    url: "/systemManage/posts/getPosts.do",
                    param: {
                        orgId: this.orgId,
                        userId: null,
                        authLevel: this.authLevel,
                        key: key
                    }
                }).then(data => {
                    this.postValues = data;
                });
            },
            save() {
                if (this.selectedPostIds.length == 0) {
                    this.$Message.info("请选择至少一个岗位");
                    return;
                }
                this.request({
                    url: "/systemManage/posts/batch/setPost.do",
                    data: {
                        orgId: this.orgId,
                        deptId: this.deptId,
                        postIds: this.selectedPostIds,
                        userIds: this.userIds
                    }
                }).then(() => {
                    this.$Message.success("岗位批量设置成功");
                    this.callback(true);
                });
            },
            initUserData() {
                this.request({
                    url: "/systemManage/userOrgManage/getUsersByFlag.do",
                    data: {
                        orgId: this.orgId,
                        postId: this.postId,
                        permissionLevel: this.authLevel
                    }
                }).then(data => {
                    this.leftData = data.allData;
                    this.rightDataKeys = data.chosenUserDataKeys;
                });
            },
            changeTransferData(targetKeys, direction, moveKeys) {
                let flag = 1;
                if (direction == 'left') {
                    //移除
                    flag = 2;
                }
                this.request({
                    url: "/systemManage/posts/batch/setUser.do",
                    data: {
                        orgId: this.orgId,
                        postId: this.postId,
                        userIds: moveKeys,
                        flag: flag
                    }
                }).then(() => {
                    this.initUserData();
                    this.callbackFunc && this.callbackFunc();
                });
            }
        }
    };
</script>

<style scoped>
    .choose-user >>> .ivu-transfer-list {
        width: 240px;
        height: 350px;
    }
</style>