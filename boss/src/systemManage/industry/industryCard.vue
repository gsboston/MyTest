<template>
    <div style="padding: 15px 20px;">
        <Row>
            <Form ref="form" :model="item" :label-width="80" :rules="ruleValidate">
                <Form-item label="所属类别">
                    <Breadcrumb separator=">">
                        <BreadcrumbItem v-for="(item, index) in parentItemList" :key="index">{{ parentItemList[parentItemList.length - index - 1] }}</BreadcrumbItem>
                    </Breadcrumb>
                </Form-item>
                <Form-item label="类别名称" prop="name">
                    <Input v-model="item.name" placeholder="请输入类别名称" :maxlength="50"/>
                </Form-item>
                <Form-item label="类别代码" prop="code">
                    <Input v-model="item.code" placeholder="请输入类别代码" :maxlength="5"/>
                </Form-item>
                <Form-item label="说明" prop="describe">
                    <Input v-model="item.describe" type="textarea" :rows="5" :autosize="false" placeholder="请输入..." :maxlength="150"/>
                </Form-item>
                <i-col span="24" style="text-align: right;">
                    <Button type="ghost" @click="cancel">取消</Button>
                    <Button :disabled="!isAllowSubmit" @click="save">保存</Button>
                </i-col>
            </Form>
        </Row>
    </div>
</template>

<script>
    export default {
        data () {
            let $self = this;
            return {
                item: {},
                ruleValidate: {
                    name: [
                        {required: true, message: '类别名称不能为空', trigger: 'blur'},
                        {max: 50, message: '类别名称不允许超过50字符'},
                    ],
                    code: [
                        {required: true, message: '类别代码不能为空', trigger: 'blur'},
                        {max: 5, message: '类别代码不允许超过5字符'},
                        { validator(rule, value, callback) {
                            if (value){
                                if (value != $self.oldCode) {
                                    $self.request({
                                        url: '/systemManage/industry/checkCode.do',
                                        param: {
                                            code: value
                                        }
                                    }).then((data) => {
                                        if (data) {
                                            callback(new Error('类别代码已存在'));
                                        }else {
                                            callback();
                                        }
                                    });
                                }else {
                                    callback();
                                }
                            }else {
                                callback();
                            }
                        }}

                    ],
                    describe: [
                        {max: 150, message: '类别说明不允许超过150字符'},
                    ]
                },
                oldCode: '',
                isAllowSubmit: true,
                parentItemList: []
            }
        },
        props: {
            id: null,
            parentId: null
        },
        created: function () {
            this.initIndustryCard();
        },
        methods: {
            initIndustryCard () {
                if (this.id){
                    this.request({
                        url: `/systemManage/industry/info.do`,
                        param: {
                            id: this.id
                        }
                    }).then(data => {
                        if (undefined !== data && null !== data){
                            this.item = data;
                            this.oldCode = data.code;
                            this.getIndustryParent(data.parentId);
                        }
                    });
                }else {
                    this.getIndustryParent(this.parentId);
                }
            },
            getIndustryParent (parentId) {
                if (parentId) {
                    this.request({
                        url: `/systemManage/industry/info.do`,
                        param: {
                            id: parentId
                        }
                    }).then(data => {
                        if (data) {
                            this.parentItemList.push(data.name);
                        }
                        if (data.parentId) {
                            this.getIndustryParent(data.parentId);
                        }
                    });
                }
            },
            save: function () {
                this.isAllowSubmit = false;
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        if (this.id) {
                            if (this.item.code == this.oldCode){
                                delete this.item.code;
                            }
                        }else {
                            this.item.parentId = this.parentId;
                        }
                        this.request({
                            url: '/systemManage/industry/save.do',
                            data: this.item
                        }).then(() => {
                            this.$Message.success('提交成功!');
                            this.isAllowSubmit = true;
                            this.callback(true);
                        }, error => {
                            this.isAllowSubmit = true;
                            this.$Message.error(error.message);
                        });
                    }else {
                        this.isAllowSubmit = true;
                    }
                })
            },
            cancel() {
                this.callback(false);
            }
        }
    };
</script>

<style scoped>

</style>