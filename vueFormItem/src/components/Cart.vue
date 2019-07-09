<template>
  <div>
    <p>{{name}}</p>
    <!-- 购物车列表 -->
    <table border="1">
      <tr>
        <th>#</th>
        <th>课程名</th>
        <th>单价</th>
        <th>数量</th>
        <th>价格</th>
      </tr>
      <tr v-for="(c,i) in cart" :key="c.id" :class="{active:c.active}">
        <td>
          <input type="checkbox" v-model="c.active">
        </td>
        <td>{{c.text}}</td>
        <td>￥{{c.price}}</td>
        <td>
          <button @click="minus(i)">-</button>
          {{c.count}}
          <button @click="add(i)">+</button>
        </td>
        <td>￥{{c.price*c.count}}</td>
      </tr>
      <tr>
        <td></td>
        <td colspan="2">{{activeCount}}/{{count}}</td>
        <td colspan="2">￥{{total}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    name: { type: String, required: true }
  },
  data() {
    return {
      cart: JSON.parse(localStorage.getItem("cart")) || []
    };
  },
  watch: {
    cart: {
      handler(n, o) {
        localStorage.setItem("cart", JSON.stringify(n));
      },
      deep: true
    }
  },
  created() {
    // 监听一下父组件添加商品事件
    this.$bus.$on("addCart", good => {
      const ret = this.cart.find(v => v.id === good.id);
      if (ret) {
        // 购物车里已有该商品
        ret.count += 1;
      } else {
        this.cart.push({
          ...good, // 属性展开
          count: 1,
          active: true
        });
      }
    });
  },
  methods: {
    minus(i) {
      const count = this.cart[i].count;
      if (count > 1) {
        this.cart[i].count -= 1;
      } else {
        this.remove(i);
      }
    },
    add(i) {
      this.cart[i].count += 1;
    },
    remove(i) {
      if (window.confirm("确定删除？")) {
        this.cart.splice(i, 1);
      }
    }
  },
  computed: {
    activeCount() {
      // 过滤出激活项的数量
      return this.cart.filter(v => v.active).length;
    },
    count() {
      // 购物车项总数
      return this.cart.length;
    },
    total() {
      //计算激活项总价
      // let num = 0;
      // this.cart.forEach(c => {
      //   if (c.active) {
      //     num += c.price * c.count;
      //   }
      // });
      return this.cart.reduce((sum, c) => {
        if (c.active) {
          sum += c.price * c.count;
        }
        return sum;
      }, 0);
      // return num;
    }
  }
};
</script>

<style scoped>
.active {
  color: green;
}
table{
  margin: 0 auto;
}
</style>