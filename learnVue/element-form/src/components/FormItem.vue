<template>
    <div>
        <label for="">{{label}}</label>
        <div>
            <slot></slot>
            <p class="err_p" v-if="errStatus">{{errMessage}}</p>
        </div>
    </div>
</template>

<script>
import Schema from "async-validator";
export default {
  inject: ["kForm"],
  props: ["label", "prop"],
  data() {
    return {
      errMessage: "",
      errStatus: false
    };
  },
  mounted() {
    // 监听子组件触发的事件
    this.$on("validate", this.validator);
  },
  methods: {
    // 校验逻辑
    validator() {
      //有两个input!  一个用户名 一个密码
      const rules = this.kForm.rules[this.prop];
      const value = this.kForm.model[this.prop];

      // 描述对象
      const descriptor = { [this.prop]: rules };
      const schema = new Schema(descriptor);
      schema.validate({ [this.prop]: value }, errors => {
        if (errors) {
          this.errMessage = errors[0].message;
          this.errStatus = true;
        } else {
          this.errMessage = "";
          this.errStatus = "";
        }
      });
    }
  }
};
</script>

<style scoped>
.err_p {
  color: red;
  font-size: 10px;
}
</style>