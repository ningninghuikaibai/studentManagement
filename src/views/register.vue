<template>
  <div class="register-page">
    <div class="register-panel">
      <div class="register-panel-content">
        <h1 class="title">学生管理系统 | 注册</h1>
        <el-form
          ref="registerFormRef"
          :model="registerForm"
          status-icon
          :rules="rules"
          label-width="auto"
          class="register-form"
          label-position="top"
          @submit.prevent="handleRegister"
        >
          <el-form-item label="账号" prop="userName">
            <el-input
              v-model="registerForm.userName"
              autocomplete="off"
              placeholder="账号"
            >
              <template #prefix>
                <el-icon>
                  <User />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="realName">
            <el-input
              v-model="registerForm.realName"
              autocomplete="off"
              placeholder="姓名"
            >
              <template #prefix>
                <el-icon>
                  <User />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="registerForm.password"
              autocomplete="off"
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
          <el-form-item label="确认密码" prop="passwordAgain">
            <el-input
              v-model="registerForm.passwordAgain"
              placeholder="确认密码"
              type="password"
            >
              <template #prefix>
                <el-icon>
                  <View />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="code" class="captcha-form-item">
            <div class="captcha-wrapper">
              <el-input
                v-model="registerForm.code"
                placeholder="验证码"
                class="captcha-input"
              >
                <template #prefix>
                  <el-icon>
                    <Message />
                  </el-icon>
                </template>
              </el-input>
              <span
                v-html="captchaSvg"
                @click="fetchCaptcha"
                class="captchSvg-span"
              ></span>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              native-type="submit"
              @click="handleRegister"
              :loading="loading"
              :disabled="loading"
              style="width: 86px; height: 42px"
            >
              注册
            </el-button>
            <div class="login-remind">
              <span>已有账号？</span>
              <span class="promptly-login" @click="goLogin">立即登录</span>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { getCaptcha } from "@/api/form";
import type { CaptchaData } from "@/api/form";
import { useRouter } from "vue-router";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { User, View, Message } from "@element-plus/icons-vue";
import { userResgiter } from "@/api/user";
import router from "@/router";
const registerFormRef = ref<FormInstance>();

const captchaSvg = ref("");
// 默认的是将disabled关闭，则按钮可用
const loading = ref(false);

// 页面一开始加载便请求验证码 防止验证码初始化空白
onMounted(() => {
  fetchCaptcha();
});

const validatePass = (rule: any, value: any, callback: any) => {
  if (!value) return callback(new Error("请输入密码"));
  callback();
};

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (!value) return callback(new Error("请再次输入密码"));
  if (value !== registerForm.value.password)
    return callback(new Error("两次密码不一致"));
  callback();
};
// 表单校验规则
const rules = reactive<FormRules<typeof registerForm>>({
  userName: [
    {
      required: true,
      message: "请输入账号(1-30位中文/英文/数字)",
      trigger: "blur",
    },
  ],
  realName: [
    { required: true, message: "请输入姓名(2-5)位中文", trigger: "blur" },
    {
      pattern: /^[\u4e00-\u9fa5]{2,5}$/,
      message: "姓名必须为2-5位中文",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码至少6位", trigger: "blur" },
  ],
  passwordAgain: [{ validator: validatePass2, trigger: "blur" }],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
});

// 注册表格
const registerForm = ref({
  userName: "",
  realName: "",
  password: "",
  passwordAgain: "", // 只用于前端校验不用于传递后端
  code: "",
  uuid: "",
});

// 注册函数 调用注册接口
const handleRegister = async () => {
  // registerFrom没值或者loading为true(表明按钮被禁用)
  if (!registerFormRef.value || loading.value) return;

  const valid = await registerFormRef.value.validate().catch(() => false);

  if (!valid) return; // 表单校验不过直接拦截
  loading.value = true; // 锁住按钮,防止用户多次点击
  try {
    // 发送请求
    const { userName, realName, password, code, uuid } = registerForm.value;

    const res = await userResgiter({
      userName,
      realName,
      password,
      code,
      uuid,
    });
    const result = res.data;

    // 进行业务代码的判断
    if (result.code !== 200) {
      ElMessage.error(result.msg || "注册失败");
      fetchCaptcha();
      return;
    }

    ElMessage.success("注册成功");
    loading.value = false;

    //注册成功延迟0.5秒进入登录页
    setTimeout(() => {
      router.push("/login");
    }, 500);
  } catch (err: any) {
    // 这里只处理 HTTP 错误（如 422、500）
    console.log("HTTP错误:", err.response?.data);
    ElMessage.error(err.response?.data?.errorMsg || "注册失败");
    fetchCaptcha();
  }
};

// 验证码函数 进行验证码接口的调用
const fetchCaptcha = async () => {
  try {
    const res = await getCaptcha();
    const captcha: CaptchaData = res.data.data;

    registerForm.value.uuid = captcha.uuid;
    captchaSvg.value = captcha.captchaImage;
  } catch (err) {
    console.error("验证码获取失败", err);
  } finally {
    loading.value = false;
  }
};

// 将路由切换为登录页面
const goLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
.register-page {
  width: 100vw;
  height: 100vh;
  background: url("@/assets/images/login-bg.jpg") no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 800px;
}

.register-panel {
  height: 800px;
  width: 500px;
  background-color: #ffffff;
  border-radius: 20px;

  padding: 40px 0 0 0;
}
.title {
  text-align: center;
  color: #409eff;
  padding: 0 10px 0 0;
  margin: 0 0 30px 0;
}
.register-form {
  max-width: 600px;
  padding: 0 15px 0 15px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  /* flex-direction: column; */
}

.register-form .el-input {
  width: 300px;
  height: 40px;
}

.register-form .el-form-item {
  width: 300px;
}

.captcha-form-item {
  width: 300px;
}

.captcha-wrapper {
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
}

.captcha-input {
  flex: 1;
  max-width: 120px;
  margin: 0 34px 0 0;
}

.captchSvg-span {
  cursor: pointer;
  width: 120px;
  height: 50px;
  flex-shrink: 0;
  display: inline-block;
}

.login-remind {
  margin: 10px 0 0 60px;

  .promptly-login {
    color: #409eff;
    cursor: pointer;
  }
}
</style>
