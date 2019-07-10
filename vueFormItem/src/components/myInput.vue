<template>
  <div class="completion-input-box">
    <span class="input-box-name">{{text}}</span>
    <input 
    type="text" 
    ref="input"
    :value="value"
    @input="fn"
    >
  </div>
</template>
<script>
export default {
  name: "myinput",
  props: ["text", "value"],
  mounted () {
      console.log(this.text,this.value);
  },
  methods: {
      fn(e) {
          console.log(11);
          // 触发父组件中的input事件，也就相当于触发一个自定义事件，然后在事件中赋值
          this.$emit('input', e.target.value)
      }
  },
};
</script>