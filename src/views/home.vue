<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <h1>学生信息管理系统</h1>
      </el-header>
      <el-container>
        <el-aside width="200px">
         <el-col>
      <el-menu
      router
      :default-active="route.path"
        active-text-color="#ffd04b"
        background-color="#304156"
        class="el-menu-vertical-demo"
        text-color="#fff"
       @click="handleOpen"
        @close="handleClose"
      >
        <el-menu-item index="/home/index">
          <el-icon><icon-menu /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/home/classes" >
          <el-icon><document /></el-icon>
          <span>班级管理</span>
        </el-menu-item>
        <el-menu-item index="/home/student">
          <el-icon><setting /></el-icon>
          <span>学生管理</span>
        </el-menu-item>
      </el-menu>
    </el-col>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from "@element-plus/icons-vue";
import { useRoute } from "vue-router";

const route = useRoute();

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>

<style scoped>
.common-layout {
  width: 100vw;
  height: 100vh;
}
.el-header {
  height: 80px;
  background-color: #304156;
  color: white;
  text-align: center;
  line-height: 80px;
  /* font-size: 20px; */
}

.el-aside {
  background-color: #304156;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #ffffff;
  color: #333;
  /* text-align: center; */
  min-height: 400px;
}
.el-menu-vertical-demo{
    border: 0;
}
</style>
