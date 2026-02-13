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
            <el-input style="width: 200px" />
          </el-form-item>
          <el-form-item label="姓名">
            <el-input style="width: 200px" />
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input style="width: 240px" />
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
          <el-button type="primary" size="small">
            <el-icon> <Plus /> </el-icon>添加
          </el-button>
        </el-form-item>
        <el-table stripe style="width: 100%" 
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
          <el-table-column prop="sex" label="性别" min-width="120" />
          <el-table-column prop="createTime" label="创建时间" min-width="120" />
          <el-table-column prop="updateTime" label="修改时间" min-width="120" />
          <el-table-column label="操作" width="180">
            <template #default="{ row }">
              <div class="mb-4">
                <el-button text type="primary" @click=""
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
import { ref, reactive, onMounted, nextTick } from "vue";
import { ElButton, ElMessage, ElMessageBox } from "element-plus";
import type { ElTree } from "element-plus";
import { Plus, Edit, Delete } from "@element-plus/icons-vue";
import {
  getStudentList,
  addStudent,
  deleteStudent,
  amendStudent,
} from "@/api/student";
import { getClasses, type ClassItem } from "@/api/classes";

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
//   stuName: "",
//   stuNum: "",
//   phone: "",
  pageNum: 1,
  pageSize: 10,
});

const total = ref(0);
const studentList = ref<any[]>([]);

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
        label: `${item.className}（${item.stuCount}人）`,
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
  if (!queryParams.classId == null) return;

  loading.value = true;
  try {
    const res = await getStudentList({
      ...queryParams,
      classId: queryParams.classId ?? 0,
    });

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

// 删除学生
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm("确认删除该学生？", "提示", {
      type: "warning",
    });

    await deleteStudent(row.stuId);

    ElMessage.success("删除成功");
    fetchStudentList();
  } catch {}
};

// 查询
const handleSearch = () => {
  queryParams.pageNum = 1;
  fetchStudentList();
};

// 重置
const handleReset = () => {
//   queryParams.stuName = "";
//   queryParams.stuNum = "";
//   queryParams.phone = "";
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

onMounted(() => {
  fetchClassTree();
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
