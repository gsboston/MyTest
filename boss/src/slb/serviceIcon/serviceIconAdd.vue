<template>
    <div id="userAddId" class="userAddWrap">
        <Form :model="formItem" :label-width="80" inline :rules="ruleInline" ref="formItem">
            <Row type="flex" justify="center" align="middle">
                <i-Col span="11">
                    <Form-item label="类别图标" prop="imgUrl">
                        <BSUpload :onSuccess="onSuccessEnterprise" :type="['png','jpeg','jpg']">
                            <div class="upload">
                                <div v-if="!formItem.imgUrl">
                                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                    <p style="line-height: 20px;">45px*45px</p>
                                    <p style="line-height: 20px;">支持上传png,jpeg,jpg</p>
                                </div>
                                <img :src="$updateConfig.file+formItem.imgUrl+'&x-oss-process=image/resize,w_100,h_100/quality,Q_80'" v-else>
                            </div>
                        </BSUpload>
                    </Form-item>
                </i-Col>
                <i-col span="2" offset="18">
                    <Button type="primary" @click="addSubmit('formItem')">保存</Button>
                </i-col>
            </Row>
        </Form>
    </div>
</template>

<script>
  export default {
    data() {
      let $self = this;
      return {
        formItem: {
          itemId: 0,
          imgUrl: ''
        },
        ruleInline: {
          imgUrl: [
            {required: true, message: '请上传图标', trigger: 'blur'}
          ],
        }
      }
    },
    props: {
      id: null
    },
    methods: {
      addSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.request({
              url: "/serviceIcon/updateInfo.do",
              data: {
                itemId: this.id,
                imgUrl: this.formItem.imgUrl
              }
            }).then(() => {
              this.$Message.success('提交成功!');
              this.callback();
            });
          } else {
//                        this.$Message.error('表单验证失败!');
          }
        })
      },
      /*上传图标*/
      onSuccessEnterprise: function (id) {
        this.formItem.imgUrl = id;
      },
      cancel() {
        this.close();
      }
    }
  }
</script>

<style scoped>
    .userAddWrap {
        width: 600px;
        margin: 25px auto;
    }

    /*上传*/
    .upload {
        width: 130px;
        height: 130px;
        border: 1px dotted #ccc;
        text-align: center;
        cursor: pointer;
    }

    .upload div {
        padding-top: 15px;
    }

    .upload img {
        width: 100%;
        height: 100%;
    }

    .basic-info-wrap {
        padding: 10px 10px 0;
        position: relative;
    }

    .basic-info-wrap-line::after {
        content: '';
        display: inline-block;
        position: absolute;
        height: calc(100% - 24px);
        border-right: 1px dotted #59b399;
        right: 0;
        top: 0;
    }

    .basic-info-box .ivu-form-item {
        padding-left: 20px;
    }

    .describe-wrap {
        padding: 20px 60px 0;
    }

    .in-the-query {
        margin: 4px 0 0 4px;
    }

    .ivu-btn2 {
        color: #59b399;
        background: #fff;
        border-color: #59b399;
        border-radius: 3px;
        font-size: 12px;
        font-weight: 700;
    }

    .none-data {
        padding-top: 120px;
        text-align: center;
    }
</style>