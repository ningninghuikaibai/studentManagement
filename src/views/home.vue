<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <span></span>
        <div class="title">
          <h1>学生信息管理系统</h1>
        </div>
        <div class="upload-content" ref="avatarWrapper">
          <el-avatar :src="AvatarImg" @click.stop="togglePopover" />
          <transition name="fade">
            <div
              v-if="showPopover"
              class="user-popover"
              ref="popoverRef"
              @click.stop
            >
              <div class="popover-arrow"></div>
              <div class="user-name">{{userName }}</div>
              <div class="divider"></div>
              <div class="menu-items">
                <div class="menu-item" @click="handleProfile">个人信息</div>
                <div class="menu-item" @click="handleLogout">退出登录</div>
              </div>
            </div>
          </transition>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-col>
            <el-menu
              router
              :default-active="$route.path"
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
              <el-menu-item index="/home/classes">
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
        <el-main style="height: calc(100vh - 80px); overflow: auto">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import AvatarImg from "@/assets/images/avatarImg.png";
import { ElMessage } from "element-plus";
import { getUserInfo } from "@/api/user";
import type { ApiResponse, UserInfo } from "@/api/user";
const router = useRouter();

// 控制悬浮卡片的显示/隐藏
const showPopover = ref(false);

// DOM 引用
const avatarWrapper = ref<HTMLElement | null>(null);
const popoverRef = ref<HTMLElement | null>(null);

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};

// 点击头像进行切换
const togglePopover = () => {
  showPopover.value = !showPopover.value;
};

// 点击外部区域关闭个人信息弹窗
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as Node;

  if (
    avatarWrapper.value?.contains(target) ||
    popoverRef.value?.contains(target)
  ) {
    return;
  }

  showPopover.value = false;
};

// 跳转个人信息
const handleProfile = () => {
  showPopover.value = false;
  setTimeout(() => {
    router.push("/home/mine");
  }, 500);
};

// 退出登录
const handleLogout = () => {
  ElMessage.success("已退出登录");
  showPopover.value = false;
  // 延迟0.5秒进入首页
  setTimeout(() => {
    router.push("/login");
  }, 500);
};

// 用户名（用于动态渲染）
const userName = ref<string>("");

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const res = await getUserInfo();
    console.log("用户信息接口返回：", res);

    if (res && res.code === 200 && res.success) {
      userName.value = res.data?.realName || res.data?.userName || "用户";
    } else {
      // 静默失败，不影响页面渲染
      console.warn("获取用户信息失败:", res?.msg || "未知错误");
      userName.value = "用户";
    }
  } catch (error) {
    // 静默失败，不影响页面渲染
    console.error("获取用户信息异常:", error);
    userName.value = "用户";
  }
};


onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  fetchUserInfo();  
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.common-layout {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
.el-header {
  height: 80px;
  background-color: #304156;
  color: white;
  text-align: center;
  line-height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  min-height: 400px;
}
.el-menu-vertical-demo {
  border: 0;
}

.upload-content {
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin: 0 60px 0 0;
  cursor: pointer;
  position: relative;
}

.user-popover {
  position: absolute;
  top: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
  width: 160px;
  max-height: 112px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 10px 0;
  z-index: 2000;
  color: #333;
}

.user-popover .popover-arrow {
  position: absolute;
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid #fff;
  filter: drop-shadow(0 -2px 4px rgba(0, 0, 0, 0.1));
}

.user-popover .user-name {
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  color: #1f2f3d;
  margin: 0;
  padding: 0 16px;
  line-height: 20px;
}

.user-popover .divider {
  height: 1px;
  background-color: #e4e7ed;
  margin: 6px 16px;
}

.user-popover .menu-items {
  display: flex;
  flex-direction: column;
}

.user-popover .menu-item {
  text-align: center;
  font-size: 14px;
  color: #409eff;
  padding: 6px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  line-height: 20px;
}

.user-popover .menu-item:hover {
  background-color: #f5f7fa;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
