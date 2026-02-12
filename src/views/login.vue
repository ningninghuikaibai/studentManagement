<template>
  <div class="login-page">
    <div class="login-panel">
      <div class="login-panel-content">
        <h1 class="title">学生管理系统 | 登录</h1>
        <el-form
          ref="loginFormRef"
          :rules="rules"
          :inline="true"
          :model="loginForm"
          status-icon
          class="demo-form-inline"
          label-position="top"
          @submit.prevent="handleLogin"
        >
          <el-form-item label="账号" prop="userName">
            <el-input v-model="loginForm.userName" placeholder="账号">
              <template #prefix>
                <el-icon>
                  <User />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              placeholder="密码"
              type="password"
            >
              <template #prefix>
                <el-icon>
                  <View />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="验证码" style="max-width: 120px" prop="code">
            <el-input v-model="loginForm.code" placeholder="验证码">
              <template #prefix>
                <el-icon>
                  <Message />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <span
            v-html="captchaSvg"
            @click="fetchCaptcha"
            class="captchSvg-span"
          ></span>
          <el-button
            type="primary"
            native-type="submit"
            size="large"
            @click="handleLogin"
            :loading="loading"
            :disabled="loading"
            style="width: 86px; height: 42px"
            >登录</el-button
          >
          <div class="register-remind">
            <span>没有账号？</span>
            <span class="promptly-register" @click="goRegister">立即注册</span>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { userLogin } from "@/api/user";
import { getCaptcha } from "@/api/common";
import type { CaptchaData } from "@/api/common";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { User, View, Message } from "@element-plus/icons-vue";

const loginFormRef = ref<FormInstance>();

const rules: FormRules = {
  userName: [
    { required: true, message: "请输入账号", trigger: "blur" },
    { min: 3, max: 20, message: "账号长度应为 3-20 位", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度应为 6-20 位", trigger: "blur" },
  ],
  code: [
    { required: true, message: "请输入验证码", trigger: "blur" },
    { len: 4, message: "验证码为 4 位", trigger: "blur" },
  ],
};

const loginForm = ref({
  userName: "",
  password: "",
  uuid: "",
  code: "",
});

const captchaSvg = ref("");

// 默认是关闭disabled的
const loading = ref(false);

// 页面一开始加载便请求验证码 防止验证码初始化空白
onMounted(() => {
  fetchCaptcha();
});

// 登录函数 进行登录接口的调用以及token保存
const handleLogin = async () => {
  // 如果loginForm没有值或者按钮loading为true(表明按钮被禁用)则直接返回
  if (!loginFormRef.value || loading.value) return;

  // 表单不通过直接拦截
  const valid = await loginFormRef.value.validate().catch(() => false);
  if (!valid) return;

  loading.value = true; // 锁住按钮,防止用户多次点击

  try {
    const res = await userLogin(loginForm.value);
    const result = res.data;

    // 业务状态码判断
    if (result.code != 200) {
      ElMessage.error(result.msg || "登录失败");
      fetchCaptcha(); // 失败刷新验证码
      return;
    }
    // 登录成功逻辑
    // const token = result.data.token; 
    localStorage.setItem("token", result.data.token);
    // console.log("token=", result.data.token);

    ElMessage.success("登录成功");

    // 延迟0.5秒进入首页
    setTimeout(() => {
      router.push("/home");
    }, 500);
  } catch (err: any) {
    ElMessage.error("网络错误，请稍后重试!");
  } finally {
    //进行兜底始终会将disabled设置为false
    loading.value = false;
  }
};

// 验证码函数 进行验证码接口的调用
const fetchCaptcha = async () => {
  try {
    const res = await getCaptcha();
    const captcha: CaptchaData = res.data.data;

    loginForm.value.uuid = captcha.uuid;
    captchaSvg.value = captcha.captchaImage;
  } catch (err) {
    console.error("验证码获取失败", err);
  }
};

const router = useRouter();

// 将路由切换为注册页
const goRegister = () => {
  router.push("/register");
};
</script>

<style scoped>
.login-page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: url("@/assets/images/login-bg.jpg") no-repeat;
  background-size: 100% 100%;

  min-height: 800px;

  display: flex;
  justify-content: center;
  align-items: center;
}

.login-panel {
  width: 500px;
  height: 500px;
  background-color: #ffffff;
  /* padding: auto; */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  border-radius: 20px;
}

.login-panel-content {
  width: 300px;
  /* height: 300px; */
  padding: 0 0 0 20px;
}
.title {
  padding: 0 0 20px 0;
  color: #409eff;
  text-align: center;
}
.captchSvg-span {
  cursor: pointer;
  width: 120px;
  height: 50px;
  margin: 20px 0px 0px 0px;
}

.register-remind {
  padding: 10px 0 0 20px;

  .promptly-register {
    color: #409eff;
    cursor: pointer;
  }
}

.login-panel ::v-deep .el-form-item__label {
  color: #909399;
  font-size: 15px;
}

.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>
