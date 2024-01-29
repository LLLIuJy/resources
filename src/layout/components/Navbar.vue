<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- 头像 -->
          <img v-if="avatar" :src="avatar" class="user-avatar">
          <!-- 有头像就显示头像，没头像就显示名字的第一个字 -->
          <span v-else class="username">{{ name.charAt(0) }}</span>
          <!-- 用户名 -->
          <span class="user-name">{{ name }}</span>
          <!-- 图标 -->
          <i class="el-icon-setting" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/LLLIuJy/resources">
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>
          <a target="_blank" @click.prevent="updatePassword">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </a>
          <el-dropdown-item @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 修改密码的弹出层 -->
    <el-dialog title="修改密码" :visible.sync="showDialog" width="500px" @close="btnCancel">
      <el-form label-width="120px" ref="passForm" :model="passForm" :rules="rules">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input show-password placeholder="请输入旧密码" size="small" v-model="passForm.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input show-password placeholder="请输入新密码" size="small" v-model="passForm.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input show-password placeholder="请再次输入密码" size="small" v-model="passForm.confirmPassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="btnOK">确认</el-button>
          <el-button size="mini" type="danger" @click="btnCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { updataPwd } from '@/api/user'

export default {
  data() {
    return {
      // 弹出层的显示与隐藏
      showDialog: false,

      // 修改密码数据
      passForm:{
        // 旧密码
        oldPassword:'',
        // 新密码
        newPassword:'',
        // 确认密码
        confirmPassword:''
      },

      // 修改密码的校验规则
      rules:{
        // 旧密码
        oldPassword:[{required:true,message:"旧密码不能为空",trigger:'blur'}],
        // 新密码
        newPassword:[{required:true,message:"新密码不能为空",trigger:'blur'},{trigger:'blur',min:6,max:16,message:'请输入6-16位密码'}],
        // 确认密码
        confirmPassword:[{required:true,message:"确认密码不能为空",trigger:'blur'},{
          trigger:'blur',
          validator:(rule,value,callback)=>{
          if(this.passForm.newPassword===value){
            callback()
          }else{
            callback(new Error("确认密码与新密码不一致"))
          }
        }}]
      }
    }
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 退出登录
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push('/login')
    },
    // 修改密码
    updatePassword() {
      this.showDialog = true
    },
    // 密码修改成功
    btnOK(){
      // 校验
      this.$refs.passForm.validate(async isOK=>{
        if(isOK){
          // 调用修改密码的接口
         await updataPwd(this.passForm)
         this.$message.success("密码修改成功")
         this.btnCancel()
        }
      })
    },
    // 取消修改密码
    btnCancel(){
      // 重置表单
      this.$refs.passForm.resetFields()
      this.showDialog=false
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;

        .user-name {
          margin-right: 10px;
          font-size: 16px;
        }

        .username {
          width: 30px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          background-color: #04c9be;
          color: #fff;
          border-radius: 50%;
          margin-right: 4px;
        }

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }

        .el-icon-setting {
          font-size: 20px;
        }
      }
    }
  }
}
</style>
