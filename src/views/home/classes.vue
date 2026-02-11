<template>
  <div class="classes-page">
    <el-form
      ref="ClassesRef"
      style="max-width: 600px"
      :inline="true"
      :hide-required-asterisk="false"
    >
      <el-form-item label="班级名称" prop="name">
        <el-mention v-model="searchForm.name" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="small" @click="handleSearch">
          查询
        </el-button>
        <el-button type="info" size="small" @click="resetForm(ClassesRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <el-form-item>
      <el-button type="primary" size="small" @click="openAddDialog">
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
      <el-table-column prop="className" label="班级名称" min-width="150" />
      <el-table-column prop="stuCount" label="班级人数" width="120" />
      <el-table-column prop="createTime" label="创建时间" min-width="180" />
      <el-table-column prop="updateTime" label="修改时间" min-width="180" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <div class="mb-4">
            <el-button text type="primary" @click="openEditDialog(row)"
              ><el-icon>
                <Edit />
              </el-icon>
              编辑
            </el-button>
            <el-button text type="primary" @click="handleDelete(row)"
              ><el-icon>
                <Delete />
              </el-icon>
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- dialog弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogMode === 'add' ? '添加班级' : '编辑班级信息'"
      width="400px"
    >
      <el-form
        label-position="top"
        :model="formData"
        ref="dialogFormRef"
        label-width="80px"
        style="padding: 20px"
        :rules="dialogRules"
      >
        <el-form-item label="班级名称" prop="className" required>
          <el-input v-model="formData.className"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer-center">
          <el-button @click="submitDialogForm" type="primary">确定</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>

  <!-- 底部分页 -->
  <div class="example-pagination-block">
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
import { Plus, Edit, Delete } from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";
import { ElButton, ElMessage, ElMessageBox } from "element-plus";
import {
  addClasses,
  deleteClasses,
  amendClasses,
  getClasses,
  type ClassItem,
} from "@/api/classes";

// 表单面板
const ClassesRef = ref<FormInstance>();
const dialogFormRef = ref<FormInstance>();

// 搜索表单数据
const searchForm = reactive({
  name: "",
});

// 表格数据
const classData = ref(<ClassItem[]>[]);
// 总条数
const total = ref(0);

// 分页参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
});

// 加载状态
const loading = ref(false);

/**弹窗相关 */
// 弹窗状态
const dialogVisible = ref(false);

// 设置弹窗的title类型
const dialogMode = ref<"add" | "edit">("add");

const formData = reactive<{ classId?: number; className: string }>({
  className: "",
});

// 弹窗添加班级的表单校验
// tip:无语的是本来就有校验，我只是想把英文的提醒改为中文而已
const dialogRules = {
  className: [
    {
      required: true,
      message: "请输入班级名称",
    },
  ],
};

// 构建请求参数（分页 + 搜索）
const buildQueryParams = () => {
  const params: { pageNum: number; pageSize: number; className?: string } = {
    pageNum: queryParams.pageNum,
    pageSize: queryParams.pageSize,
  };
  // 如果有name这个参数则搜索时把它带上
  if (searchForm.name && searchForm.name.trim()) {
    params.className = searchForm.name.trim();
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
      // console.log(res.data);
    }
  } catch (err) {
    console.error("请求失败:", err);
  } finally {
    loading.value = false;
  }
};

// 模糊查询
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

// 重置加载
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  //  重置表单校验和表单数据
  formEl.resetFields();
  searchForm.name = ""; // 清除输入框
  queryParams.pageNum = 1; // 重置页码
  fetchList();
};

// 删除班级
const handleDelete = async (row: ClassItem) => {
  try {
    await ElMessageBox.confirm(`确定删除班级【${row.className}】吗？`, "提示", {
      type: "warning",
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    });
    await deleteClasses({ classId: row.classId });
    ElMessage.success("删除成功");
    fetchList();
  } catch {}
};

// 编辑班级名称
const openEditDialog = (row: ClassItem) => {
  dialogMode.value = "edit";
  formData.classId = row.classId;
  formData.className = row.className;
  dialogVisible.value = true;
};

// 添加班级名称
const openAddDialog = () => {
  dialogMode.value = "add";
  formData.classId = undefined;
  formData.className = "";
  dialogVisible.value = true;
};

/** 新增和编辑共用,只是新增的话表单无需默认值*/
// 进行新增和修改的提交
const submitDialogForm = async () => {
  if (!formData.className.trim()) {
    ElMessage.warning("请输入班级名称");
    return;
  }

  try {
    if (dialogMode.value === "add") {
      await addClasses({ className: formData.className });
      ElMessage.success("添加成功");
    } else {
      await amendClasses({
        classId: formData.classId!,
        className: formData.className,
      });
      ElMessage.success("修改成功");
    }
    dialogVisible.value = false;
    fetchList();
  } catch {
    ElMessage.error("操作失败");
  }
};
</script>

<style scoped>
.classes-page {
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

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

:deep(.el-table) {
  width: 100% !important;
}

.mb-4 {
  display: flex;
  justify-content: center;
}

.dialog-footer-center {
  text-align: center;
}
</style>
