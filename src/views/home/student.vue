<template>
  <div class="student-page">
    <el-row :gutter="40">
      <el-col :span="5"
        ><div class="grid-content ep-bg-purple" />
        <h3 class="title">班级列表</h3>
        <el-tree
          ref="classListRef"
          :data="classList"
          node-key="id"
          :props="defaultProps"
          highlight-current
          default-expand-all
          @node-click="handleNodeClick"
        ></el-tree>
      </el-col>
      <el-col :span="19">
        <div class="grid-content ep-bg-purple" />
        <el-form inline>
          <el-form-item label="学号">
            <el-input v-model="queryParams.stuNum" style="width: 200px" />
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="queryParams.stuName" style="width: 200px" />
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input v-model="queryParams.phone" style="width: 240px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="handleSearch"
              >查询</el-button
            >
            <el-button type="info" size="small" @click="handleReset"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
        <el-form-item>
          <el-button type="primary" size="small" @click="handleAdd">
            <el-icon> <Plus /> </el-icon>添加
          </el-button>
        </el-form-item>
        <el-table
          stripe
          style="width: 100%"
          v-loading="loading"
          :data="studentList"
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ 'text-align': 'center' }"
        >
          <el-table-column type="index" label="#" width="60" />
          <el-table-column prop="stuNum" label="学号" min-width="120" />
          <el-table-column prop="stuName" label="姓名" min-width="120" />
          <el-table-column label="专业" width="120">
            <template #default="{ row }">
              {{ row.majorInfo?.majorName }}
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="手机" min-width="120" />
          <el-table-column prop="age" label="年龄" min-width="120" />
          <el-table-column label="性别" min-width="120">
            <template #default="{ row }">
              {{ sexLabelMap[row.sex] || "未知" }}
            </template>
          </el-table-column>

          <el-table-column prop="createTime" label="创建时间" min-width="120" />
          <el-table-column prop="updateTime" label="修改时间" min-width="120" />
          <el-table-column label="操作" width="180">
            <template #default="{ row }">
              <div class="mb-4">
                <el-button text type="primary" @click="handleEdit(row)"
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
          :title="dialogMode === 'add' ? '新增学生信息' : '编辑学生信息'"
          width="400px"
          destroy-on-close
          style="padding: 40px"
          center
        >
          <el-form
            ref="formRef"
            :model="dialogForm"
            :rules="rules"
            width="200px"
            label-width="40px"
            ihline
            label-position="top"
          >
            <!-- 班级 -->
            <el-form-item label="班级" prop="classId">
              <el-select
                v-model="dialogForm.classId"
                disabled
                style="width: 80%"
              >
                <el-option
                  :label="currentClassName"
                  :value="dialogForm.classId"
                />
              </el-select>
            </el-form-item>

            <!-- 姓名 -->
            <el-form-item label="姓名" prop="stuName">
              <el-input v-model="dialogForm.stuName" placeholder="请输入姓名" />
            </el-form-item>

            <!-- 学号 -->
            <el-form-item label="学号" prop="stuNum">
              <el-input v-model="dialogForm.stuNum" placeholder="请输入学号" />
            </el-form-item>

            <!-- 手机号码 -->
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="dialogForm.phone" maxlength="11" />
            </el-form-item>

            <!-- 性别 -->
            <el-form-item label="性别" prop="sex">
              <el-select v-model="dialogForm.sex" style="width: 80%">
                <el-option
                  v-for="item in sexOptions"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                />
              </el-select>
            </el-form-item>

            <!-- 专业 -->
            <el-form-item label="专业" prop="majorId">
              <el-select v-model="dialogForm.majorId" style="width: 100%">
                <el-option
                  v-for="item in majorList"
                  :key="item.majorId"
                  :label="item.majorName"
                  :value="item.majorId"
                />
              </el-select>
            </el-form-item>

            <!-- 年龄 -->
            <el-form-item label="年龄" prop="age">
              <el-input-number
                v-model="dialogForm.age"
                :min="1"
                :max="100"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
          </el-form>

          <!-- 底部按钮 -->
          <template #footer>
            <el-button type="primary" @click="handleSubmit">确定</el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
          </template>
        </el-dialog>

        <!-- pagination分页 -->
        <div class="example-pagination-block">
          <el-pagination
            v-model:current-page="queryParams.pageNum"
            :page-size="queryParams.pageSize"
            :total="total"
            layout="prev, pager, next"
            @current-change="handlePageChange"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, nextTick, computed } from "vue";
import { ElButton, ElMessage, ElMessageBox } from "element-plus";
import type { ElTree } from "element-plus";
import { Plus, Edit, Delete } from "@element-plus/icons-vue";
import {
  getStudentList,
  addStudent,
  deleteStudent,
  amendStudent,
  type StudentQuery,
} from "@/api/student";
import { getClasses, type ClassItem } from "@/api/classes";
import { getMajorList } from "@/api/major";
import { getDictByType, type DictItem } from "@/api/common";
// 班级列表类型
const classListRef = ref<InstanceType<typeof ElTree>>();
// 班级列表
const classList = ref<any[]>([]);

// 对tree字段名进行指定
const defaultProps = {
  children: "children",
  label: "label",
};
// 加载状态
const loading = ref(false);
// 分页参数
const queryParams = reactive({
  classId: undefined as number | undefined,
  stuName: "",
  stuNum: "",
  phone: "",
  pageNum: 1,
  pageSize: 10,
});

// 总列表数
const total = ref(0);
// 学生列表
const studentList = ref<any[]>([]);
// 专业列表
const majorList = ref<any[]>([]);
// 性别字典
const sexOptions = ref<DictItem[]>([]);
// 弹窗显示
const dialogVisible = ref(false);

// 当前模式
const dialogMode = ref<"add" | "edit">("add");

// 表单ref
const formRef = ref();

// 学生表单数据
const dialogForm = reactive({
  stuId: undefined as number | undefined,
  classId: undefined as number | undefined,
  stuName: "",
  stuNum: "",
  phone: "",
  sex: "0",
  majorId: undefined as number | undefined,
  age: 18,
});

const rules = {
  classId: [{ required: true, message: "请选择班级", trigger: "change" }],
  stuName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  stuNum: [{ required: true, message: "请输入学号", trigger: "blur" }],
  phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
  sex: [{ required: true, message: "请选择性别", trigger: "change" }],
  majorId: [{ required: true, message: "请选择专业", trigger: "change" }],
  age: [{ required: true, message: "请输入年龄", trigger: "change" }],
};

// 获取班级列表
const fetchClassTree = async () => {
  loading.value = true;
  try {
    const res = await getClasses({
      pageNum: 1,
      pageSize: 10,
    });

    if (res.data.success) {
      const rows: ClassItem[] = res.data.data.rows;

      // 转成 Tree 需要的结构
      classList.value = rows.map((item) => ({
        id: item.classId,
        label: `${item.className}`,
        raw: item, // 把完整数据挂上，后面右侧查询学生要用
      }));
    }
    // 默认使第一条班级列表高亮
    nextTick(() => {
      if (classList.value.length > 0) {
        const firstId = classList.value[0].id;
        classListRef.value?.setCurrentKey(firstId);
        queryParams.classId = firstId;
        fetchStudentList();
      }
    });
  } catch (error) {
    ElMessage.error("获取班级列表失败");
  } finally {
    loading.value = false;
  }
};

// 获取学生列表
const fetchStudentList = async () => {
  if (!queryParams.classId) return;

  loading.value = true;
  try {
    const res = await getStudentList(buildQueryParams(queryParams));

    if (res.data.success) {
      studentList.value = res.data.data.rows;
      total.value = res.data.data.count;
    }
    console.log("获取数据成功");
    console.log(res.data);
  } catch {
    ElMessage.error("获取学生列表失败");
  } finally {
    loading.value = false;
  }
};

const handleNodeClick = (data: any) => {
  queryParams.classId = data.id;
  queryParams.pageNum = 1;
  fetchStudentList();
  console.log(queryParams.classId);
};

// 获取专业列表
const fetchMajorList = async () => {
  try {
    const res = await getMajorList();
    if (res.data.success) {
      majorList.value = res.data.data;
    }
  } catch (error) {
    ElMessage.error("获取专业列表失败");
  }
};

// 删除学生
const handleDelete = async (row: any) => {
  const stuId = row.stuId;
  if (!stuId) {
    ElMessage.error("数据异常：缺少学生ID");
    return;
  }

  try {
    await ElMessageBox.confirm("确认删除该学生？", "提示", {
      type: "warning",
    });

    await deleteStudent({ stuId });
    ElMessage.success("删除成功");

    // 如果删的是当前页最后一条，可以考虑回退页码（进阶）
    fetchStudentList();
  } catch {}
};

// 对分页参数进行无实参过滤
function buildQueryParams(params: typeof queryParams): StudentQuery {
  const result: Partial<StudentQuery> = {};
  Object.keys(params).forEach((key) => {
    const val = (params as any)[key];
    if (val !== "" && val !== undefined && val !== null) {
      (result as any)[key] = val;
    }
  });
  // 强制补齐必传字段
  result.classId = params.classId!;
  result.pageNum = params.pageNum;
  result.pageSize = params.pageSize;

  return result as StudentQuery;
}

// 查询
const handleSearch = () => {
  queryParams.pageNum = 1;
  fetchStudentList();
};

// 重置
const handleReset = () => {
  queryParams.stuName = "";
  queryParams.stuNum = "";
  queryParams.phone = "";
  queryParams.pageNum = 1;
  fetchStudentList();
};

// 分页
const handlePageChange = (page: number) => {
  queryParams.pageNum = page;
  fetchStudentList();
};

const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  queryParams.pageNum = 1;
  fetchStudentList();
};

// 添加学生信息
const handleAdd = () => {
  dialogMode.value = "add";
  dialogVisible.value = true;

  Object.assign(dialogForm, {
    stuId: undefined,
    stuName: "",
    stuNum: "",
    phone: "",
    sex: "0",
    age: 18,
    majorId: undefined,
    classId: queryParams.classId,
  });
};

// 编辑学生信息
const handleEdit = (row: any) => {
  dialogMode.value = "edit";
  dialogVisible.value = true;

  Object.assign(dialogForm, {
    stuId: row.stuId,
    classId: row.classId,
    stuName: row.stuName,
    stuNum: row.stuNum,
    phone: row.phone,
    sex: row.sex,
    majorId: row.majorId,
    age: row.age,
  });
};

const handleSubmit = async () => {
  await formRef.value.validate();

  if (!dialogForm.classId) {
    ElMessage.error("班级不能为空");
    return;
  }

  if (!dialogForm.majorId) {
    ElMessage.error("请选择专业");
    return;
  }

  const payload = {
    classId: dialogForm.classId as number,
    stuName: dialogForm.stuName,
    stuNum: dialogForm.stuNum,
    phone: dialogForm.phone,
    sex: dialogForm.sex,
    age: dialogForm.age,
    majorId: dialogForm.majorId as number,
  };

  if (dialogMode.value === "add") {
    await addStudent(payload);
    ElMessage.success("添加成功");

    // 新增后回到第一页
    queryParams.pageNum = 1;
  } else {
    await amendStudent({
      ...payload,
      stuId: dialogForm.stuId as number,
    });
    ElMessage.success("修改成功");
  }

  dialogVisible.value = false;
  await nextTick();
  await fetchStudentList();
};

const currentClassName = computed(() => {
  const current = classList.value.find(
    (item) => item.id === queryParams.classId,
  );
  return current?.label || "";
});

// 获取性别字典
const fetchSexDict = async () => {
  try {
    const res = await getDictByType("sys_user_sex");
    if (res.data.success) {
      sexOptions.value = res.data.data;
    }
  } catch {
    ElMessage.error("获取性别字典失败");
  }
};
// 进行列表的性别字典映射
const sexLabelMap = computed<Record<string, string>>(() => {
  const map: Record<string, string> = {}
  sexOptions.value.forEach(item => {
    map[item.dictValue] = item.dictLabel
  })
  return map
})

onMounted(() => {
  fetchClassTree();
  fetchMajorList();
  fetchSexDict();
});
</script>

<style scoped>
.student-page {
  padding: 0;
}
.title {
  text-align: center;
}
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

:deep(.el-pagination) {
  justify-content: center;
}
.example-pagination-block + .example-pagination-block {
  margin-top: 10px;
}

.example-pagination-block {
  margin-top: 30px;
}

.mb-4 {
  display: flex;
  justify-content: center;
}
</style>
