<template>
    <div style="padding: 15px 20px;">
        <Form ref="form" :model="item" :label-width="80">
            <Form-item label="部门名称" prop="name" :rules="[{required: true, message: '部门名称不能为空'},{max:20,message:'部门名称不能多于20个字符'}]" >
                <Input v-if="!isAllowEdit" v-model="item.name" placeholder="请输入部门名称" icon="close-circled" @on-click="clear('name')"/>
                <span v-else>{{ item.name }}</span>
            </Form-item>
            <Form-item label="部门描述" prop="describe" :rules="{max:500,message:'部门描述不能多于500个字符'}" >
                <Input v-if="!isAllowEdit" v-model="item.describe" type="textarea" :autosize="false" placeholder="请输入..."/>
                <span v-else>{{ item.describe }}</span>
            </Form-item>
            <input hidden v-model="item.dr" value="0">
            <FormItem v-if="!isAllowEdit">
                <Button v-if="cancelBtn" type="ghost" @click="cancel">取消</Button>
                <Button @click="save('add')">保存</Button>
                <Button v-if="isSaveMoreTimes" @click="save('addMore')">保存并添加</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                item: {
                    name: '',
                    describe: ''
                },
            }
        },
        props: {
            param: {},
            isAllowEdit: {
                type: Boolean,
                default: false
            },
            cancelBtn: {
                type: Boolean,
                default: true
            },
            isComponent: {
                type: Boolean,
                default: false
            },
            isSaveMoreTimes: {
                type: Boolean,
                default: false
            },
            handleSavedFunc: {
                type: Function,
                default: function () {
                    return {};
                }
            },
        },
        watch: {
            param(value) {
                this.param = value;
                this.$refs['form'].resetFields();
                this.getDept();
            }
        },
        created: function () {
            this.getDept();
        },
        methods: {
            getDept: function () {
                if (this.param.id) {
                    this.request({
                        url: "/systemManage/dept/info.do",
                        param: {
                            deptId: this.param.id
                        }
                    }).then((data) => {
                        this.item = data;
                    });
                }else {
                    this.item = {
                        parentId: this.param.parentId,
                        orgId: this.param.orgId,
                        name: '',
                        describe: ''
                    };
                }
            },
            save: function (type) {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        let _url = '';
                        if (this.param.id) {
                            _url = '/systemManage/dept/update.do';
                        }else {
                            _url = '/systemManage/dept/save.do';
                        }
                        this.request({
                            url: _url,
                            data: this.item
                        }).then(() => {
                            this.$Message.success('提交成功!');
                            if (!this.isComponent){
                                if (this.isSaveMoreTimes && type == 'addMore') {
                                    //保存并添加
                                    this.$refs['form'].resetFields();
                                    this.handleSavedFunc();
                                }else {
                                    this.callback(true);
                                }
                            }else {
                                this.cancel();
                            }
                        });
                    } else {
                        this.$Message.error("表单验证失败！");
                    }
                })
            },
            cancel() {
                if (this.isComponent) {
                    this.$emit('on-cancel', 'dept');
                }else {
                    this.callback(true);
                }
            },
            clear(name) {
                this.item[name] = '';
            }
        }
    };
</script>