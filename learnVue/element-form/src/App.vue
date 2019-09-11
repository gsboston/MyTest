<template>
  <div id="app">
    <template>

      <!-- <my-input :value="value" @input="value=arguments[0]"></my-input> -->

      <!-- {{value}} -->
      <my-form :model="model" :rules="rules" >
        <my-form-item label="用户名" prop="username">
          <my-input v-model="model.username"></my-input>
        </my-form-item>
        <my-form-item label="密码" prop="password">
          <my-input v-model="model.password" type="password"></my-input>
        </my-form-item>
      </my-form>

      <!-- <div>
        <h3>Element表单</h3>
        <el-form :model="model" :rules="rules" ref="loginForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="model.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="model.password" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </div> -->
    </template>
  </div>
</template>

<script>
import MyInput from './components/Input.vue';
import MyFormItem from './components/FormItem.vue';
import MyForm from './components/Form.vue';
export default {
  name: "app",
  provide(){
    return {
      someval:'来自app.vue'
    }
  },
  components: {
    MyInput,
    MyFormItem,
    MyForm
  },
  data() {
    return {
      value:'',
      model: { username: "", password: "" },
      rules: {
        username: [
          { required: true, message: "请输入用户名" }
        ],
        password: [
          { required: true, message: "请输入密码" },
           {min: 6,max:12,message:'请输入6~12的密码'}
        ],
      }
    };
  },
  methods: {
      submitForm(form) {
          this.$refs[form].validate(valid=>{
              if (valid) {
                  alert('请求登录!')
              } else {
                  alert('校验失败！')
              }
          })
      }
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
