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
        ></el-tree>
      </el-col>
      <el-col :span="19" 
        ><div class="grid-content ep-bg-purple" />
        <el-form inline="true">
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
            <el-button type="primary" size="small">查询</el-button>
            <el-button type="info" size="small">重置</el-button>
          </el-form-item>
        </el-form>
         <el-form-item>
      <el-button type="primary" size="small">
        <el-icon> <Plus /> </el-icon>添加
      </el-button>
    </el-form-item>
    <el-table  stripe style="width: 100%">
     <el-table-column type="index" label="#" width="60" />
     <el-table-column prop="className" label="学号" min-width="120" />
      <el-table-column prop="className" label="姓名" min-width="120" />
      <el-table-column prop="stuCount" label="专业" width="120" />
      <el-table-column prop="createTime" label="手机" min-width="120" />
      <el-table-column prop="updateTime" label="年龄" min-width="120" />
      <el-table-column prop="updateTime" label="性别" min-width="120" />
      <el-table-column prop="updateTime" label="创建时间" min-width="120" />
      <el-table-column prop="updateTime" label="修改时间" min-width="120" />
      <el-table-column label="操作" width="150">
  <template #default="{ row }">
          <div class="mb-4">
            <el-button text type="primary" @click=""
              ><el-icon>
                <Edit />
              </el-icon>
              编辑
            </el-button>
            <el-button text type="primary" @click=""
              ><el-icon>
                <Delete />
              </el-icon>
              删除
            </el-button>
          </div>
        </template>

      </el-table-column>
  </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import { ElButton, ElMessage, ElMessageBox,  } from "element-plus";
import type { ElTree } from "element-plus";
import { Plus, Edit, Delete } from "@element-plus/icons-vue";
import { getStudentList } from "@/api/student";
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
  pageNum: 1,
  pageSize: 10,
});

const fetchClassTree = async () => {
  loading.value = true;
  try {
    const res = await getClasses(queryParams);

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
        classListRef.value?.setCurrentKey(classList.value[0].id);
      }
    });
  } catch (error) {
    ElMessage.error("获取班级列表失败");
  } finally {
    loading.value = false;
  }
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
</style>
