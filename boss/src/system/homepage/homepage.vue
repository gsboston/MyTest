<template>
    <div class="container">
        <div class="title-head">
            <span>WELCOME</span>
        </div>
        <div class="title-head-secondary">
            <span>欢迎使用顺利办云管家系统</span>
        </div>
        <div class="white-background">
        </div>
        <div class="home-page-picture">
            <img src="./image/homepage.png">
        </div>

        <!--<h1>Portal首页</h1>-->
        <!--<img src="./image/homepage.jpeg" />-->
    </div>
</template>

<script>
    export default {
        created () {
        }
    };
</script>

<style scoped>
    @media screen and (max-height: 1440px){
        .white-background{height: 500px;}
        .home-page-picture{bottom: 370px;}
    }
    @media screen and (max-height: 1000px){
        .white-background{height: 400px;}
        .home-page-picture{bottom: 270px;}
    }
    @media screen and (max-height: 900px){
        .white-background{height: 300px;}
        .home-page-picture{bottom: 170px;}
    }
    @media screen and (max-height: 800px){
        .white-background{height: 250px;}
        .home-page-picture{bottom: 120px;}
    }
    @media screen and (max-height: 700px){
        .white-background{height: 150px;}
        .home-page-picture{bottom: 20px;}
    }
    @media screen and (max-height: 600px){
        .white-background{height: 150px;}
        .home-page-picture{bottom: 20px;}
    }
    .container {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 15px 0;
        overflow-x: hidden;
        background-color: #f5f4f9;
    }
    .title-head{
        text-align: center;
        color: #024c77;
        font-size: 80px;
        font-weight: bold;
    }
    .white-background{
        position: absolute;
        width: 100%;
        bottom: 0px;
        background-color: white;
    }
    .home-page-picture{
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
    .title-head-secondary{
        text-align: center;
        color: #024c79;
        font-size: 32px;
        font-family: "Helvetica Neue", Helvetica, Arial, "Microsoft Yahei", "Hiragino Sans GB", "Heiti SC", "WenQuanYi Micro Hei", sans-serif;
    }
</style>