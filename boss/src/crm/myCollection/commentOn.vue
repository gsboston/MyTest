<template>
    <div style="margin: 10px 20px;">
        <Form ref="commentOn" :model="commentOn" :label-width="80">
            <Row class="describe-wrap">
                <i-Col span="24">
                    <FormItem label="评分" prop="weight">
                        <Rate allow-half v-model="valueCustomText" @on-change="weightChange" style="margin-top: -4px;">
                            <span style="color: #f5a623">{{ valueCustomText }}</span>
                        </Rate>
                        <span v-text="commentOn.weight + '分'" style="color: #f5a623;">11</span>
                    </FormItem>
                </i-Col>
            </Row>
            <Row class="describe-wrap">
                <i-Col span="24">
                    <FormItem label="评价标签" prop="content">
                        <span v-for="(item, index) in tagList" :key="index" @click="choiceTag(item)">
                            <Tag type="border" :closable="!item.id" @on-close="delTag(tagList,item)" v-if="!item.isChoice">{{item.name}}</Tag>
                            <Tag type="border" color="red" :closable="!item.id" @on-close="delTag(tagList,item)" v-else>{{item.name}}</Tag>
                        </span>
                        <Button class="ivu-btn2" icon="ios-plus-empty" type="dashed" size="small" @click="handleAdd()">添加标签</Button>
                    </FormItem>
                </i-Col>
            </Row>
            <Row class="describe-wrap">
                <i-Col span="24">
                    <FormItem label="我要评价" prop="content" :rules="{required: true, message: '评价内容不能为空', trigger: 'blur'}">
                        <Input v-model.trim="commentOn.content" type="textarea" :rows="4" :maxlength="200"></Input>
                    </FormItem>
                </i-Col>
            </Row>
            <FormItem>
                <Row style="padding-right: 60px;">
                    <i-Col span="24">
                        <Button type="primary" @click="handleSubmit('commentOn')">发表</Button>
                    </i-Col>
                </Row>
            </FormItem>
        </Form>
        <Modal
                title="添加评价标签"
                v-model="tagAddModal"
                :closable="false"
                :mask-closable="false"
                :styles="{top: '150px',width: '300px'}">
            <div style="text-align: center;">
                <Input v-model="tagAddValue" :autofocus="true" :maxlength="10" style="width: 200px;"></Input>
            </div>

            <div slot="footer">
                <Button type="primary" @click="tagAddOk">确定</Button>
                <Button type="ghost" @click="tagAddCancel">取消</Button>
            </div>
        </Modal>
    </div>
</template>
发表评论
<script>
    export default {
        props: {
            id: null
        },
        data: function () {
            return {
                valueCustomText: 0,
                commentOn: {
                    weight: 0,
                    content: '',
                    hxId: this.id
                },
                tagList: [],
                tagAddValue: '',
                tagAddModal: false
            }
        },
        created: function () {
            this.valueCustomText = this.commentOn.weight / 20;
        },
        methods: {
            /*计分计算*/
            weightChange: function (weight) {
                this.commentOn.weight = weight *20;
            },
            /*选择标签*/
            choiceTag: function (item) {
                item.isChoice = !item.isChoice;
            },
            /*添加标签*/
            handleAdd () {
                this.tagAddModal = true;
            },
            tagAddCancel: function () {
                this.tagAddModal = false;
                this.tagAddValue = '';
            },
            tagAddOk: function () {
                var value = this.tagAddValue;

                if (!value || !value.trim()) {
                    this.$Message.warning('请填写标签名称');
                    return;
                }else if(!/^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(value)){
                    this.$Message.warning('请填写字母数字汉字');
                    return;
                }
                let tempSign = true;
                for(let i=0; i<this.tagList.length; i++){
                    if(this.tagList[i].name == this.tagAddValue.trim()) tempSign = false;
                }
                if(tempSign){
                    let tempObj = {
                        name: this.tagAddValue.trim(),
                        isChoice: true,
                        type: 4
                    };
                    this.tagList.push(tempObj);
                    this.tagAddModal = false;
                    this.tagAddValue = '';
                }else{
                    this.$Message.warning('不能重复!');
                }
            },
            /*删除标签*/
            delTag(tagList,item) {
                tagList.forEach(function (obj, index) {
                    if(!obj.id && obj.name === item.name){
                        tagList.splice(index, 1);
                    }
                });
            },
            /*发表*/
            handleSubmit: function (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let tempTagList = [];
                        this.tagList.forEach(function (obj) {
                            if(obj.isChoice){
                                tempTagList.push(obj);
                            }
                        });
                        this.request({
                            url: '/crm/myCollection/commentOn.do',
                            data: {
                                commentOn: this.commentOn,
                                choiceTagList: tempTagList,
                            }
                        }).then(() => {
                            this.callback();
                            this.$Message.success('提交成功!');
                        })
                    } else {
//                        this.$Message.error('表单验证失败!');
                    }
                })
            }
        }
    };
</script>

<style scoped>
    .ivu-btn2 {
        color: #59b399;
        background:#fff;
        border-color: #59b399;
        border-radius: 3px;
        font-size: 12px;
        font-weight: 700;
    }
</style>