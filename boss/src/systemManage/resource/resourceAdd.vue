<template>
    <Row style="padding: 15px 30px;">
        <Form ref="form" :model="item" :label-width="60">
            <Row>
                <i-col span="6">
                    <FormItem label="排序" prop="sort">
                        <Input v-model="item.sort"/>
                    </FormItem>
                </i-col>
                <i-col span="9">
                    <FormItem label="编码" prop="code" :rules="[{required: true, message: '功能编码不能为空'},{max:20,message:'功能编码不能多于20个字符'}]">
                        <Input v-model="item.code"/>
                    </FormItem>
                </i-col>
                <i-col span="9">
                    <FormItem label="名称" prop="name" :rules="[{required: true, message: '功能名称不能为空'},{max:20,message:'功能名称不能多于20个字符'}]">
                        <Input v-model="item.name"/>
                    </FormItem>
                </i-col>
            </Row>
            <Row style="padding-left: 60px; padding-bottom: 15px;">
                <Collapse value="1">
                    <Panel name="1">
                        功能按钮列表
                        <div slot="content">
                            <Row v-for="(child, index) in item.children" :key="index">
                                <i-col span="10">
                                    <FormItem label="编码" :prop="'children.' + index + '.code'" :rules="[{required: true, message: '按钮编码不能为空'},{max:20,message:'按钮编码不能多于20个字符'}]">
                                        <Input v-model="child.code"/>
                                    </FormItem>
                                </i-col>
                                <i-col span="10">
                                    <FormItem label="名称" :label-width="60" :prop="'children.' + index + '.name'" :rules="[{required: true, message: '按钮名称不能为空'},{max:20,message:'按钮名称不能多于20个字符'}]">
                                        <Input v-model="child.name" />
                                    </FormItem>
                                </i-col>
                                <i-col span="2" offset="1">
                                    <Col span="3" offset="1"><Button type="ghost" icon="close-round" @click="remove(index)"></Button></Col>
                                </i-col>
                            </Row>
                            <Row>
                                <i-col span="20" style="padding-left: 60px;">
                                    <Button type="dashed" icon="plus" long @click="add">新增按钮</Button>
                                </i-col>
                            </Row>
                        </div>
                    </Panel>
                </Collapse>
            </Row>
            <FormItem>
                <Button type="primary" @click="save">保存</Button>
            </FormItem>
        </Form>
    </Row>
</template>

<script>
    export default {
        props: {
            moduleId: null
        },
        data: function() {
            return {
                item: {
                    code: null,
                    name: null,
                    children: []
                }
            }
        },
        created () {
            this.item.moduleId = this.moduleId;
        },
        methods: {
            add: function() {
                this.item.children.push({});
            },
            remove: function(index) {
                this.item.children.splice(index, 1);
            },
            save: function() {
                this.$refs.form.validate(valid => {
                    if(valid) {
                        this.request({
                            url: "/systemManage/resource/save.do",
                            data: this.item
                        }).then(() => {
                            this.callback();
                        });
                    }
                });
            }
        }
    };
</script>