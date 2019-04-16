<template>
    <Form :model="form" ref="form" :label-width="80" class="form" style="margin-right: 10px;">
        <FormItem label="错误原因" prop="reason" :rules="{type: 'array', required: true, message: '错误原因不能为空', trigger: 'change'}">
            <Select v-model="form.reason" placeholder="错误原因" multiple>
                <!--<Option value="0">电话号码错误</Option>-->
                <!--<Option value="1">联系人错误</Option>-->
                <!--<Option value="2">地址错误</Option>-->
                <Option v-for="(item, index) in reason" :key="index" :value="item.code">{{item.name}}</Option>
            </Select>
        </FormItem>
        <FormItem label="错误描述" prop="description" :rules="{required: true, message: '错误描述不能为空', trigger: 'blur'}">
            <Input v-model="form.description" type="textarea" :rows="4" :maxlength="100"></Input>
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
            id: null
        },
        data: function () {
            return {
                form: {
                    reason: []
                },
                reason: []
            }
        },
        created: function() {
            this.request({
                url: '/crm/clueManagement/clueErrorReason.do'
            }).then(data => {
                this.reason = data;
            });
        },
        methods: {
            save: function () {
                this.$refs.form.validate(valid => {
                    if(valid){
                        this.request({
                            url: '/crm/clueManagement/clueError.do',
                            data: {
                                id: this.id,
                                reason: this.form.reason,
                                description: this.form.description
                            }
                        }).then(() => {
                            this.$Message.success('纠错成功');
                            this.callback('success');
                        });
                    }
                })

            },
            cancel: function () {
                this.callback('');
            }
        }
    }
</script>

<style scoped>
    .form{
        margin: 5px 10px 0 0;
    }
    .buttonPanel{
        margin-bottom: 0;
    }
</style>