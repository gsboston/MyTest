<template>
  <div id="app">

    <!-- element 测试 -->
    <form-test :title="titleVar"></form-test>
    <k-button @lalala="handleClick"></k-button>

    <win>
      <template slot="head">
        <h3>window</h3>
      </template>
      content...
      <template slot="foot">
        <button>确定</button>
      </template>
    </win>

    <!-- 条件语句 -->
    <p id="myname" v-if="showName">{{name}}</p>
    <p>
      <input type="text" v-model="text">
      
    </p>
    <!-- 循环语句 -->
    <ul>
      <li v-for="good in goods" :key="good.id">
        <span>{{good.text}}</span>
        <span>￥{{good.price}}</span>
        <button @click="addCart(good)">加购物车</button>
      </li>
    </ul>
    <!-- 购物车 -->
    <my-cart :name="name"></my-cart>

    <p>{{foo}}</p>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import MyCart from "./components/Cart.vue";
import FormTest from './components/FormTest.vue';
import KButton from './components/Button.vue';
import Win from './components/Win.vue';
import axios from "axios";


export default {
  name: "app",
  provide(){
    return {
      someValue: '来自祖先的神秘遗产'
    }
  },
  components: {
    HelloWorld,
    MyCart,
    FormTest,
    KButton,
    Win
  },
  data() {
    return {
      titleVar:'element表单，rules校验规则',
      name: "开课吧购物车",
      showName: true,
      goods: [],
      text: "",
      foo: {bar:1}
    };
  },
  async created() {
    this.$set(this.foo, 'baz', 1);

    // this.foo = Object.assign({}, this.foo, {a:1,b:1})
    this.foo = {...this.foo, ...{a:1,b:1}}

    // 创建钩子，组件创建完成执行一次
    setInterval(() => {
      // this.showName = true;
      this.foo.baz += 1;   
      this.foo.a += 1;         
    }, 1000);

    // 查询产品列表
    try {
      const response = await axios.get("/api/goods");
      console.log(response);
      this.goods = response.data.list;
    } catch (error) {
      // 错误处理
    }

    // 不用await
    // axios.get("/api/goods").then(resp => {
    //   this.goods = response.data.list;
    // }).catch(err => {
    //   // 错误处理
    // })

    // 
    
    this.name = 'blabla'
    await this.$nextTick();
    console.log(this.$el.querySelector('#myname').textContent);
  },
  mounted(){
    
  },
  methods: {
    addGood(i) {
      // 获取goods中对应项
      const good = this.goods[i];
      this.$bus.$emit("addCart", good);
      console.log(this);
      
      // this.$root.$emit('addCart', good)
    },
    addCart(good){
      this.$bus.$emit('addCart', good)
    },
    handleClick(obj){
      console.log(obj);
      
    }
  }
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
