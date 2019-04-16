<template>
    <div class="ivu-hidden-box">
        <Row>
            <i-col span="4"><b>姓名</b></i-col>
            <i-col span="8"><b>{{base.name || '-' }}</b></i-col>
            <i-col span="4"><b>性别</b></i-col>
            <i-col span="8"><b>{{base.sex || '-' }}</b></i-col>
        </Row>
        <Row>
            <i-col span="4"><b>出生日期</b></i-col>
            <i-col span="8"><b>{{base.birthday || '-' }}</b></i-col>
            <i-col span="4"><b>电话</b></i-col>
            <i-col span="8"><b>{{base.telephone || '-' }}</b></i-col>
        </Row>
        <Row>
            <i-col span="4"><b>移动电话</b></i-col>
            <i-col span="8"><b>{{base.mobile || '-' }}</b></i-col>
            <i-col span="4"><b>微信</b></i-col>
            <i-col span="8"><b>{{base.wechat || '-' }}</b></i-col>
        </Row>
        <Row>
            <i-col span="4"><b>电子邮箱</b></i-col>
            <i-col span="8"><b>{{base.email || '-' }}</b></i-col>
            <i-col span="4"><b>兴趣</b></i-col>
            <i-col span="8"><b>{{base.interest || '-' }}</b></i-col>
        </Row>
        <Row>
            <i-col span="4"><b>备注描述</b></i-col>
            <i-col span="20" class-name="bizScope"><b>{{base.remark || '-' }}</b></i-col>
        </Row>
    </div>
</template>

<script>
    export default {
        props: {
            id: null,
            personal: null,
            tags: null
        },
        data: function () {
            return {
                base: {
//                    name: '喜羊羊',
//                    sex: '男',
//                    birthday: '2011年1月1日',
//                    telephone: '010-8812366',
//                    mobile: 15688812366,
//                    wechat: 'grrrgr',
//                    email: 'xxx@12366.com',
////                    interest: '吃饭睡觉打豆豆', // 兴趣
//                    remark: '上海市工商管理局上海市工商管理局上海市工商管理局上海市工商管理局上海市工商管理局上海市工商管理局上海市工商管理局上海市工商管理局上海市工商管理局上海市工商管理局', // 备注
                }
            }
        },
        created: function () {
            this.base = this.personal;
            this.initInterest();
            this.initSex();
        },
        methods: {
            init: function () {
                this.request({
                    url: '/crm/clueManagement/baseinfoPersonal.do',
                    param: {
                        id: this.id
                    }
                }).then(data => {
                    this.base = data;
                });
            },
            initInterest: function () {
                let arr = [];

                this.tags.forEach((tag) => {
                    if (tag.type === 5) {
                        arr.push(tag.name);
                    }
                })

                this.base.interest = arr.join(', ');
            },
            initSex: function () {
                this.request({
                    url: '/crm/clueManagement/sex.do'
                }).then(data => {
                    data.forEach(item => {
                        if(item.code === this.base.sex){
                            this.base.sex = item.name;
                        }
                    });
                });
            }
        }
    }
</script>

<style scoped>
	.ivu-hidden-box {
		overflow: hidden;
	}
    .ivu-row{
        border-top: 1px solid #e7e9ef;
        background: #FCFCFC;
        display: flex;
    }
    .ivu-row>.ivu-col {
        padding: 0 5px;
        min-height: 35px;
        line-height: 40px;
        font-size: 14px;
        overflow: hidden;
	    margin-bottom: -10000px;
	    padding-bottom: 10000px;
	    display: flex;
    }
    .ivu-col.ivu-col:nth-child(even) b {
	    font-weight: 700;
	    padding: 10px 0;
	    word-wrap: break-word;
	    float: left;
	    margin: auto;
	    width: 100%;
	}
	.ivu-col.ivu-col:nth-child(odd) b {
	    margin: auto;
	    font-weight: 700;
	}
    .ivu-row>.ivu-col:nth-child(odd){
        text-align: center;
    }
    .ivu-row>.ivu-col:nth-child(even){
        border-left: 1px solid #e7e9ef;
        border-right: 1px solid #e7e9ef;
        background: #fff;
        line-height: 20px;
    }
    .ivu-row>.ivu-col:last-child{
        border-right: none;
    }
    .ivu-col.bizScope{
        /*padding-top: 5px;
        padding-bottom: 5px;
        padding-right: 100px;
        line-height: 1.6;*/
    }
</style>