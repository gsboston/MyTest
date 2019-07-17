<template>
  <div class="home">
    <cube-slide :data="slider" :interval="4000">
      <cube-slide-item v-for="item in slider" :key="item.id">
        <router-link :to="`/detail/${item.id}`">
          <img :src="item.img" class="slider_img">
        </router-link>
      </cube-slide-item>
    </cube-slide>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      slider: []
    };
  },
  components: {},
  async created() {
    // 多层级解构
    const { data: { data: goods, slider } } = await this.$http.get(
      "/api/goods"
    );
    console.log(slider);
    this.slider = slider;
  }
};
</script>

<style scoped>
.cube-slide {
  height: auto;
}

.slider_img {
  width: 100%;
  height: auto;
}
</style>