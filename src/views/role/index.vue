<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate">
        <el-button size="mini" type="primary" @click="showDialog = true">添加角色</el-button>
      </div>
      <!-- 放置table组件 -->
      <el-table :data="list">
        <!-- 放置列 -->
        <el-table-column prop="name" align="center" width="200" label="角色">
          <template v-slot="{ row }">
            <el-input v-if="row.isEdit" size="mini"></el-input>
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" align="center" width="200" label="启用">
          <template v-slot="{ row }">
            <el-switch v-if="row.isEdit" />
            <span v-else> {{ row.state === 1 ? "已启用" : row.state === 0 ? "未启用" : "无" }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="description" align="center" label="描述">
          <template v-slot="{ row }">
            <el-input v-if="row.isEdit" type="textarea" />
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <template v-if="row.isEdit">
              <!-- 编辑状态 -->
              <el-button type="primary" size="mini" @click="btnEditOK(row)">确定</el-button>
              <el-button size="mini" @click="row.isEdit = false">取消</el-button>
            </template>
            <template v-else>
              <!-- 非编辑状态 -->
              <el-button size="mini" type="text" @click="btnPermission(row.id)">分配权限</el-button>
              <el-button size="mini" type="text" @click="btnEditRow(row)">编辑</el-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="confirmDel(row.id)">
                <el-button slot="reference" style="margin-left:10px" size="mini" type="text">删除</el-button>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <!-- 放置分页组件 -->
      <el-row type="flex" style="height:60px" align="middle" justify="end">
        <!-- 放置分页组件 -->
        <el-pagination layout="prev, pager, next" :page-size="pageParams.pageSize" :current-page="pageParams.page"
          :total="pageParams.total" @current-change="changePage" />
      </el-row>
    </div>
    <!-- 添加角色 -->
    <el-dialog width="500px" title="新增角色" :visible.sync="showDialog" @close="btnCancel">
      <!-- 表单内容 -->
      <el-form label-width="120px" :rules="rules" :model="roleForm" ref="roleForm">
        <el-form-item label="角色名称" prop="name">
          <el-input style="width:300px" size="mini" v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="启用">
          <el-switch size="mini" v-model="roleForm.state" :active-value="1" :inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input type="textarea" :rows="3" style="width:300px" size="mini" v-model="roleForm.description" />
        </el-form-item>
        <el-form-item>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-button type="primary" size="mini" @click="btnOK">确定</el-button>
              <el-button size="mini" @click="btnCancel">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 放置权限弹层 -->
    <el-dialog :visible.sync="showPermissionDialog" title="分配权限">
      <!-- 放置权限数据 -->
      <el-tree node-key="id" :data="permissionData" :props="{ label: 'name' }" show-checkbox check-strictly default-expand-all ref="permTree"
        :default-checked-keys="permIds" />
        <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="mini" @click="btnPermissionOK">确定</el-button>
        <el-button size="mini" @click="showPermissionDialog = false">取消</el-button>
      </el-col>
    </el-row>
    </el-dialog>
    
  </div>
</template>

<script>
import { getRoleList, addRole, delRole, getRoleDetail,assignPerm } from '@/api/role'
import { transListToTreeData } from '@/utils/index'
import { getPermissionList } from '@/api/permission'

export default {
  name: 'Role',
  data() {
    return {
      currentRoleId: null,
      permIds: [],
      showPermissionDialog: false,
      permissionData: [],
      // 弹窗显示与隐藏
      showDialog: false,
      // 表格数据
      list: [],
      // 分页器
      pageParams: {
        page: 1,//第几页
        pageSize: 5,//每页多少条
        total: 0//总共
      },
      // 弹窗表单校验
      roleForm: {
        name: '',
        description: '',
        state: 0
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '角色描述不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows, total } = await getRoleList(this.pageParams)
      this.list = rows
      this.pageParams.total = total
      // 针对每一行数据添加一个编辑标记
      this.list.forEach(item => {
        // item.isEdit = false // 添加一个属性 初始值为false
        // 数据响应式的问题  数据变化 视图更新
        // 添加的动态属性 不具备响应式特点
        // this.$set(目标对象, 属性名称, 初始值) 可以针对目标对象 添加的属性 添加响应式
        this.$set(item, 'isEdit', false)
      })
    },
    // 切换分页
    changePage(newPage) {
      this.pageParams.page = newPage
      this.getRoleList()
    },
    // 确定
    btnOK() {
      this.$refs.roleForm.validate(async isOK => {
        if (isOK) {
          await addRole(this.roleForm)
          this.$message.success('新增角色成功')
          this.getRoleList()
          this.btnCancel()
        }
      })
    },
    // 取消
    btnCancel() {
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    // 编辑
    btnEditRow(row) {
      console.log(row);
      row.isEdit = true
    },
    // 编辑状态的确定按钮
    // 点击确定时触发
    async btnEditOK(row) {
      if (row.editRow.name && row.editRow.description) {
        // 下一步操作
        await updateRole({ ...row.editRow, id: row.id })
        // 更新成功
        this.$message.success('更新角色成功')
        // 更新显示数据  退出编辑状态
        // row.name = row.editRow.name // eslint的一校验 误判
        // Object.assign(target, source)
        Object.assign(row, {
          ...row.editRow,
          isEdit: false // 退出编辑模式
        }) // 规避eslint的误判
      } else {
        this.$message.warning('角色和描述不能为空')
      }
    },
    // 删除角色
    async confirmDel(id) {
      await delRole(id)
      this.$message.success('删除角色成功')
      // 删除的如果是最后一个
      if (this.list.length === 1) this.pageParams.page--
      this.getRoleList()
    },
    // 分配权限
    async btnPermission(id) {
      this.currentRoleId = id
      const { permIds } = await getRoleDetail(id)
      this.permIds = permIds
      this.permissionData = transListToTreeData(await getPermissionList(), 0)
      this.showPermissionDialog = true
    },
    // 点击确定时触发
    async  btnPermissionOK() {
      await assignPerm({
        id: this.currentRoleId,
        permIds: this.$refs.permTree.getCheckedKeys()
      })
      this.$message.success('角色分配权限成功')
      this.showPermissionDialog = false
    }
  },
}
</script>

<style scoped>
.role-operate {
  padding: 10px;
}
</style>