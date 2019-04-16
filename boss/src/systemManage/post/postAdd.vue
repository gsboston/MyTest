<template>
    <Row style="padding: 15px 30px;">
        <Form ref="item" :model="item" :rules="itemValidate" :label-width="80">
            <FormItem label="岗位编码" prop="code">
                <Input v-model="item.code" placeholder="请输入岗位编码"></Input>
            </FormItem>
            <FormItem label="岗位名称" prop="name">
                <Input v-model="item.name" placeholder="请输入岗位名称"></Input>
            </FormItem>
            <FormItem label="岗位级别" prop="name">
                <Select v-model="item.permissionLevel" placeholder="请选择岗位级别">
                    <Option v-for="level in levelList" :value="level.value" :key="level.value">{{ level.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="岗位描述" prop="describe">
                <Input v-model="item.describe" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入岗位描述"></Input>
            </FormItem>
            <FormItem style="float: right;">
                <Button type="primary" @click="save('item')">保存</Button>
            </FormItem>
        </Form>
    </Row>
</template>

<script>
    export default {
        props: {
            id: null,
            orgTypeId: null,
        },
        data: function() {
            return {
                levelList: [],
                item: {
                    code: null,
                    name: null,
                    describe: null,
                    orgtypeId: null,
                    roleIds: []
                },
                postRoleColumns: [{
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },{
                    key: "name",
                    title: "名称"
                }, {
                    key: "describe",
                    title: "描述"
                }],
                postRoleItems: [],
                postRoleSelectedItem: null,
                postRoleSearchValue: "",
                roleColumns: [{
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },{
                    key: "name",
                    title: "名称",
                },{
                    key: "describe",
                    title: "描述",
                }],
                roleItems: [],
                roleSelectItem: null,
                roleSearchValue: "",
                roleCurrent: 1,
                roleTotal: 0,
                itemValidate: {
                    code: [
                        { required: true, message: '请输入岗位编码', trigger: 'blur' },
                        { type: 'string', max: 20, message: '岗位编码不能多于20个字符', trigger: 'blur' },
                    ],
                    name: [
                        { required: true, message: '请输入岗位名称', trigger: 'blur' },
                        { type: 'string', max: 20, message: '岗位名称不能多于20个字符', trigger: 'blur' },
                    ],
                    describe: [
                        { type: 'string', max: 500, message: '岗位描述不能多于500个字符', trigger: 'blur' }
                    ]
                },
                unbindChecked:[],
                bindChecked:[],
            }
        },
        created: function() {
            if(this.id) {
                this.request({
                    url: "/systemManage/post/info.do",
                    param: {
                        postId: this.id
                    }
                }).then(item => {
                    this.item = item;
                });
            } else {
                this.getUnbindRoleList();
            }
            this.getlevel();
        },
        methods: {
            getUnbindRoleList () {
                this.request({
                    url: "/systemManage/post/roleList.do",
                    param: {
                        postId: 0,
                    }
                }).then(demand => {
                    this.roleItems = demand.data;
                    this.roleCurrent = demand.current;
                    this.roleTotal = demand.total;
                });
            },
            getlevel () {
                this.request({
                    url: "/systemManage/post/level.do",
                }).then(data => {
                    this.levelList = data;
                });
            },
            search: function() {

            },
            add: function() {
                this.item.roleIds.push({});
            },
            remove: function(index) {
                this.item.roleIds.splice(index, 1);
            },
            save: function(name) {
                if (!this.id) {
                    for(var i=0;i<this.postRoleItems.length;i++){
                        this.item.roleIds.push(this.postRoleItems[i].id);
                    }
                }
                this.$refs[name].validate((valid) => {
                    if(valid) {
                        if(!this.id){
                            this.item.orgtypeId = this.orgTypeId;
                            this.request({
                                url: "/systemManage/post/save.do",
                                data: this.item,
                            }).then(data => {
                                this.$Message.success('保存成功!');
                                this.callback(this.item.name);
                            }, error => {
                                this.$Message.error(error.stack[0].message);
                            });
                        } else {
                            this.request({
                                url: "/systemManage/post/update.do",
                                data: this.item,
                            }).then(data => {
                                this.$Message.success('更新成功!');
                                this.callback();
                            }, error => {
                                this.$Message.error(error.stack[0].message);
                            });
                        }
                    }else {
                        this.$Message.error("表单验证失败！");
                    }
                });
            },
            bindSelect (selection) {
                this.bindChecked = selection;
            },
            unbindSelect (selection) {
                this.unbindChecked = selection;
            },
            moveToBind () {
                this.postRoleItems = this.postRoleItems.concat(this.unbindChecked);
                for(var i=0;i<this.roleItems.length;i++){
                    for(var j=0;j<this.unbindChecked.length;j++){
                        if(this.roleItems[i].id == this.unbindChecked[j].id){
                            this.roleItems.splice(i,1);
                        }
                    }
                }
                this.unbindChecked = [];
            },
            moveToUnbind () {
                this.roleItems = this.roleItems.concat(this.bindChecked);
                for(var i=0;i<this.postRoleItems.length;i++){
                    for(var j=0;j<this.bindChecked.length;j++){
                        if(this.postRoleItems[i].id == this.bindChecked[j].id){
                            this.postRoleItems.splice(i,1);
                        }
                    }
                }
                this.bindChecked = [];
            },
        }
    };
</script>