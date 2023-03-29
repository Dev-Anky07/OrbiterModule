<template>
  <div class="login">
    <el-button
      text
      @click="dialogVisible = true"
      type="primary"
      v-if="!isLogin"
    >
      登录
    </el-button>
    <el-button text v-else disabled>
      {{ name }}
    </el-button>

    <el-button text type="danger" v-if="isLogin" @click="logout">
      退出登录
    </el-button>

    <el-dialog v-model="dialogVisible" title="Login" width="30%">
      <div>
        <div>
          用户名：
          <ElInput
            v-model="account"
            :type="'text'"
            :style="{ margin: '10px 0' }"
          />
        </div>
        <div>
          密码：
          <ElInput
            v-model="password"
            :type="'password'"
            :style="{ marginTop: '10px' }"
          />
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleConfirm"> Confirm </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'
import { login } from '@/hooks/login'

const dialogVisible = ref(false)
const account = ref('')
const password = ref('')

const isLogin = ref(false)

const name = ref('')

onMounted(() => {
  if (
    window.sessionStorage.getItem('token') &&
    window.sessionStorage.getItem('name')
  ) {
    isLogin.value = true
    name.value = window.sessionStorage.getItem('name') ?? ''
  }
})

const handleConfirm = async () => {
  dialogVisible.value = false
  const loading = ElLoading.service({ fullscreen: true })

  if (!account.value || !password.value) {
    ElMessage({
      showClose: true,
      message: '请输入正确的账号和密码',
      type: 'error',
    })
    return
  }

  try {
    await login(account.value, password.value)
    window.sessionStorage.setItem('name', account.value)
    isLogin.value = true
    name.value = account.value
    ElMessage({
      showClose: true,
      message: '登陆成功',
      type: 'success',
    })
  } catch (error) {
    ElMessage({
      showClose: true,
      message: '登陆失败',
      type: 'error',
    })
  } finally {
    loading.close()
  }
}

const logout = () => {
  window.sessionStorage.removeItem('token')
  window.sessionStorage.removeItem('name')
  isLogin.value = false
  name.value = ''
  password.value = ''
  account.value = ''
}
</script>

<style>
.login {
  margin-bottom: 20px;
}
</style>
