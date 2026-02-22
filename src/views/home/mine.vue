<template>
  <div class="mine-page">
    <el-page-header content="个人信息" @back="goBack" />
    <el-divider />

    <h2>修改信息</h2>
    <el-form
      ref="infoRef"
      :model="infoForm"
      :rules="infoFormRules"
      label-position="left"
      label-width="80px"
      class="info-form"
    >
      <el-form-item label="头像">
        <el-upload
          ref="avatarRef"
          action="/student/v3/prod-api/file/upload"
          :headers="{ Authorization: 'Bearer ' + token }"
          :auto-upload="false"
          :file-list="avatarList"
          :show-file-list="false"
          @change="avatarChange"
        >
          <el-avatar :size="100">
            <img
              v-if="!avatarPreview && infoForm.avatar"
              :src="'/student/v3' + infoForm.avatar"
            />
            <img v-else-if="avatarPreview" :src="avatarPreview" />
            <el-icon v-else :size="50"><User /></el-icon>
          </el-avatar>
        </el-upload>
      </el-form-item>

      <el-form-item label="账号" required>
        <el-input :model-value="infoForm.userName" disabled />
      </el-form-item>

      <el-form-item label="姓名" prop="realName" required>
        <el-input v-model="infoForm.realName" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitInfo">提交</el-button>
        <el-button @click="resetInfo">重置</el-button>
      </el-form-item>
    </el-form>

    <el-divider />
    <h2>修改密码</h2>

    <el-form
      ref="passwordRef"
      :model="passwordForm"
      :rules="passwordRules"
      label-position="left"
      label-width="80px"
      class="password-form"
    >
      <el-form-item label="原密码" prop="originalPassword" required>
        <el-input
          v-model="passwordForm.originalPassword"
          type="password"
          show-password
        />
      </el-form-item>

      <el-form-item label="新密码" prop="password" required>
        <el-input
          v-model="passwordForm.password"
          type="password"
          show-password
        />
      </el-form-item>

      <el-form-item label="确认密码" prop="surePassword" required>
        <el-input
          v-model="passwordForm.surePassword"
          type="password"
          show-password
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitPassword">提交</el-button>
        <el-button @click="resetPassword">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { User } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import {
  editUserInfo,
  editPassword,
  useUserStore,
  getUserInfo,
} from "@/api/user";

const router = useRouter();
const userStore = useUserStore();
const token = localStorage.getItem("token") || "";

/* refs */
const infoRef = ref();
const passwordRef = ref();
const avatarRef = ref();

/* 表单数据 */
const infoForm = reactive({
  avatar: "",
  userName: "",
  realName: "",
});

const passwordForm = reactive({
  originalPassword: "",
  password: "",
  surePassword: "",
});

/* 上传 */
const avatarList = ref<any[]>([]);
const avatarPreview = ref<string | undefined>();

/* 校验规则 */
const infoFormRules = {
  realName: [
    { required: true, message: "请输入姓名", trigger: "change" },
    { pattern: /^[\u4E00-\u9FA5]{1,}$/, message: "请输入中文姓名" },
  ],
};

const passwordRules = {
  originalPassword: [{ required: true, message: "请输入原密码" }],
  password: [
    {
      validator: (_: any, value: string, cb: Function) => {
        if (!value) cb(new Error("请输入新密码"));
        else cb();
      },
    },
  ],
  surePassword: [
    {
      validator: (_: any, value: string, cb: Function) => {
        if (value !== passwordForm.password) {
          cb(new Error("两次输入密码不一致"));
        } else cb();
      },
    },
  ],
};

/* 方法 */
const goBack = () => router.push("/home/index");

const resetInfo = () => {
  const { avatar, userName, realName } = userStore.userInfo;
  Object.assign(infoForm, { avatar, userName, realName });
  avatarPreview.value = undefined;
};

const avatarChange = (file: any) => {
  if (file.status === "ready") {
    avatarList.value = [file];
    avatarPreview.value && URL.revokeObjectURL(avatarPreview.value);
    avatarPreview.value = URL.createObjectURL(file.raw);
  }

  if (file.status === "success") {
    const { code, data } = file.response;
    if (code === 200) {
      infoForm.avatar = data.fileUrl;
      avatarList.value = [];
      avatarPreview.value = undefined;
      submitInfo();
    }
  }
};

const submitPassword = async () => {
  await passwordRef.value.validate();
  const userId = (userStore.userInfo as any)?.userId;
  if (!userId) {
    ElMessage.error("用户信息不完整，请重新登录");
    return;
  }
  await editPassword({
    userId,
    originalPassword: passwordForm.originalPassword,
    password: passwordForm.password,
  });

  ElMessage.success("密码修改成功");
  Gologin();
  resetPassword();
};

const Gologin = () => {
  setTimeout(() => {
    router.push("/login");
  }, 500);
};
const submitInfo = async () => {
  await infoRef.value.validate();

  if (avatarList.value.length) {
    avatarRef.value.submit();
    return;
  }

  const userId = (userStore.userInfo as any)?.userId;
  if (!userId) {
    ElMessage.error("用户信息不完整，请重新登录");
    return;
  }

  await editUserInfo({
    userId,
    realName: infoForm.realName,
    avatar: infoForm.avatar,
  });

  await userStore.refreshInfo();
  ElMessage.success("修改成功");
  // 修改成功后重新获取用户信息
  await fetchUserInfo();
};

const resetPassword = () => passwordRef.value.resetFields();

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const res = await getUserInfo();
    if (res && res.success) {
      const userInfo = res.data;
      // 填充表单数据
      infoForm.userName = userInfo.userName || "";
      infoForm.realName = userInfo.realName || "";
      infoForm.avatar = userInfo.avatar || "";

      // 更新 store
      (userStore.userInfo as any) = {
        avatar: userInfo.avatar || "",
        userName: userInfo.userName || "",
        realName: userInfo.realName || "",
        userId: userInfo.userId,
      };
    } else {
      ElMessage.error(res?.msg || "获取用户信息失败");
    }
  } catch (error: any) {
    console.error("获取用户信息失败:", error);
    ElMessage.error(error?.message || "获取用户信息失败");
  }
};

// 组件挂载时获取用户信息
onMounted(() => {
  fetchUserInfo();
});

/* 监听用户信息 */
watch(
  () => userStore.userInfo,
  (val) => {
    if (!val) return;
    Object.assign(infoForm, {
      avatar: val.avatar || "",
      userName: val.userName || "",
      realName: val.realName || "",
    });
  },
  { immediate: true, deep: true },
);
</script>

<style scoped>
.mine-page {
  padding: 20px;
  background-color: #fff;
}

.mine-page :deep(.el-page-header) {
  padding: 0;
  margin-bottom: 20px;
}

.mine-page h2 {
  margin: 20px 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.mine-page :deep(.el-divider) {
  margin: 30px 0;
}

.info-form,
.password-form {
  max-width: 500px;
  margin-top: 20px;
}

.mine-page :deep(.el-form-item) {
  margin-bottom: 24px;
}

.mine-page :deep(.el-form-item__label) {
  color: #606266;
  font-size: 14px;
  font-weight: 500;
  padding-right: 12px;
}

.mine-page :deep(.el-form-item.is-required .el-form-item__label::before) {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}

.mine-page :deep(.el-upload) {
  display: inline-block;
}

.mine-page :deep(.el-avatar) {
  cursor: pointer;
  border: 2px solid #e4e7ed;
  transition: border-color 0.3s;
  background-color: #f5f7fa;
}

.mine-page :deep(.el-avatar:hover) {
  border-color: #409eff;
}

.mine-page :deep(.el-input) {
  width: 300px;
}

.mine-page :deep(.el-input__wrapper) {
  border-radius: 4px;
}

.mine-page :deep(.el-button) {
  margin-right: 12px;
  padding: 10px 20px;
}

.mine-page :deep(.el-button--primary) {
  background-color: #409eff;
  border-color: #409eff;
}

.mine-page :deep(.el-button--default) {
  background-color: #fff;
  border-color: #dcdfe6;
  color: #606266;
}
</style>
