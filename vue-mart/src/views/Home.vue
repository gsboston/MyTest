<template>
  <div class="home">

    <k-header title="开课吧商城"></k-header>

    <cube-slide :data="slider" :interval="4000">
      <cube-slide-item v-for="item in slider" :key="item.id">
        <router-link :to="`/detail/${item.id}`">
          <img :src="item.img" class="slider_img">
        </router-link>
      </cube-slide-item>
    </cube-slide>

    <!-- 商品列表 -->
    <goods-list :goods="filterGoods" @addCart="onAddCart"></goods-list>

    <!-- 触发分类选择按钮 -->
    <cube-button @click="showCatg">选择分类</cube-button>
    <!-- 商品分类列表 -->
    <cube-drawer ref="drawer" title="请选择分类" 
      :data="[drawerList]" @select="selectHandler"></cube-drawer>

    <!-- 加购动画载体 -->
    <div class="ball-wrap">
      <transition @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter">
        <div class="ball" v-show="ball.show">球</div>
      </transition>
    </div>
  </div>
</template>

<script>
import GoodsList from "@/components/GoodsList.vue";

const labels = {
  fe: "前端",
  python: "Python",
  java: "Java",
  bigdata: "大数据",
  ai: "人工智能"
};

export default {
  name: "home",
  data() {
    return {
      slider: [],
      goods: [], // 所有商品列表
      selectedKeys: [], // 分类过滤使用
      keys: [], // 分类
      ball: {
        show: true,
        el: null // 目标dom的引用
      }
    };
  },
  components: {
    GoodsList
  },
  async created() {
    // 多层级解构
    const { data: { data: goods, slider, keys } } = await this.$http.get(
      "/api/goods"
    );
    console.log(slider);
    this.slider = slider;

    this.goods = goods;
    this.keys = keys;
    this.selectedKeys = [...this.keys]; // 默认选中全部分类
  },
  computed: {
    filterGoods() {
      let ret = [];
      this.selectedKeys.forEach(v => {
        ret = ret.concat(this.goods[v]);
      });
      return ret;
    },
    drawerList() {
      return this.keys.map(v => {
        return {
          text: labels[v], // 转换为中文
          value: v
        };
      });
    }
  },
  methods: {
    showCatg() {
      this.$refs.drawer.show();

      // 创建notice实例
      const notice = this.$createNotice();
      notice.add({content:'lllllaaaaa'})
    },
    selectHandler(val) {
      this.selectedKeys = [...val];
    },
    beforeEnter() {
      // 动画初始值
      // 获取点击的dom坐标
      const dom = this.ball.el;
      const rect = dom.getBoundingClientRect();
      console.log(rect.top, rect.left);
      const x = rect.left - window.innerWidth / 2;
      const y = -(window.innerHeight - rect.top - 30);
      el.style.display = "block";
      el.style.transform = `translate3d(${x}px,${y}px,0)`;
    },
    enter(el, done) {
      // 获取offsetHeight 触发重绘
      document.body.offsetHeight;
      // 设置动画结束点
      el.style.transform = "translate3d(0,0,0)";
      el.addEventListener("transitionend", done);
    },
    afterEnter(el) {
      this.ball.show = false;
      el.style.display = "none";
    },
    onAddCart(el) {
      this.ball.el = el;
      this.ball.show = true;
    }
  }
};
</script>

<style scoped lang="stylus">
.cube-slide {
  height: auto;
}

.slider_img {
  width: 100%;
  height: auto;
}

.ball-wrap {
  .ball {
    position: fixed;
    left: 50%;
    bottom: 10px;
    z-index: 200;
    color: red;
    width: 30px;
    height: 30px;
    transition: all 0.5s cubic-bezier(0.49, -0.29, 0.75, 0.41);
  }
}
</style>