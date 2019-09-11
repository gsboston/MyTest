<template>
    <div>
        <label>{{label}}</label>
        <div>
            <slot></slot>
            <p v-if="errStatus">{{errMessage}}</p>
        </div>
    </div>
</template>

<script>
import Schema from "async-validator";
export default {
  inject: ["myForm"],
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
    // 校验方法
    validator() {
      const rules = this.myForm.rules[this.prop];
      const value = this.myForm.model[this.prop];

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