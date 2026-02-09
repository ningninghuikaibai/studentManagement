<template>
  <div class="classes-page">
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      :rules="rules"
      :inline="true"
      hide-required-asterisk
    >
      <el-form-item label="班级名称" prop="name">
        <el-mention v-model="ruleForm.name" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="small" @click="handleSearch">
          查询
        </el-button>
        <el-button type="info" size="small" @click="resetForm(ruleFormRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <el-form-item>
      <el-button type="primary" size="small" @click="">
        <el-icon> <Plus /> </el-icon>添加
      </el-button>
    </el-form-item>

    <el-table
      :data="classData"
      stripe
      style="width: 100%"
      v-loading="loading"
      :header-cell-style="{ 'text-align': 'center' }"
      :cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column type="index" label="#" width="60" />
      <el-table-column prop="className" label="班级名称" width="250" />
      <el-table-column prop="stuCount" label="班级人数" width="250" />
      <el-table-column prop="createTime" label="创建时间" width="250" />
      <el-table-column prop="updateTime" label="修改时间" width="250" />
      <el-table-column prop="" label="操作" width="300" />
    </el-table>
  </div>

  <div class="example-pagination-block">
    <!-- <div class="example-demonstration">When you have few pages</div> -->
    <el-pagination
      v-model:current-page="queryParams.pageNum"
      :page-size="queryParams.pageSize"
      :total="total"
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { Plus } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import { getClasses } from "@/api/classes";

interface RuleForm {
  name: string;
  desc: string;
}

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  name: "",
  desc: "",
});

const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: "Please input name", trigger: "blur" }],
});

// 表格数据
const classData = ref([]);
// 总条数
const total = ref(0);

// 分页参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
});

// 加载状态
const loading = ref(false);

// 构建请求参数（分页 + 搜索）
const buildQueryParams = () => {
  const params: { pageNum: number; pageSize: number; className?: string } = {
    pageNum: queryParams.pageNum,
    pageSize: queryParams.pageSize,
  };

  if (ruleForm.name && ruleForm.name.trim()) {
    params.className = ruleForm.name.trim();
  }

  return params;
};

// 进行全部的loading测试
// const sleep =(ms:number) => new Promise(resolve => setTimeout(resolve,ms))

// 获取列表
const fetchList = async () => {
  loading.value = true;
  try {
    // await sleep(1000)
    const res = await getClasses(buildQueryParams());
    if (res.data.success) {
        classData.value = res.data.data.rows;
        total.value = res.data.data.count;
        console.log(res.data);
    }
  } catch (err) {
    console.error("请求失败:", err);
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  queryParams.pageNum = 1; // 重置页码
  fetchList();
};

// 分页变化
const handleCurrentChange = (page: number) => {
  queryParams.pageNum = page;
  fetchList();
};

onMounted(() => {
  fetchList();
});

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  queryParams.pageNum = 1; // 重置页码
  fetchList();
};
</script>

<style scoped>
:deep(.el-form--inline .el-form-item) {
  margin-right: 12px;
}

.example-pagination-block + .example-pagination-block {
  margin-top: 10px;
}

.example-pagination-block {
  margin-top: 30px;
}

:deep(.el-pagination) {
  /* align-items: center; */
  justify-content: center;
}
</style>
