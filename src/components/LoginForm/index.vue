<template>
  <div class="login-form">
    <div class="login-header">
      <h2>欢迎登录</h2>
      <p>探索您的旅行助手</p>
    </div>
    
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginRules"
      label-width="80px"
      class="form-content"
    >
      <el-form-item label="用户名" prop="account">
        <el-input
          v-model="loginForm.account"
          placeholder="请输入用户名"
          prefix-icon="User"
          @input="onAccountInput"
        />
      </el-form-item>
      
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          placeholder="请输入密码"
          prefix-icon="Lock"
          @input="onPasswordInput"
        />
      </el-form-item>
      
      <el-form-item label="验证码" prop="captcha">
        <div class="captcha-row">
          <el-input
            v-model="loginForm.captcha"
            placeholder="请输入验证码"
            prefix-icon="Verification"
            @input="onCaptchaInput"
          />
          <div class="captcha-image" @click="refreshCaptcha">
            <span class="captcha-text">{{ captchaCode }}</span>
          </div>
        </div>
      </el-form-item>
      
      <el-form-item>
        <el-button
          type="primary"
          class="login-btn"
          @click="handleLogin"
          :loading="isLoading"
          :disabled="isLoading || !isFormValid"
        >
          {{ isLoading ? '登录中...' : '登录' }}
        </el-button>
      </el-form-item>
    </el-form>
    
    <div class="login-footer">
      <p>没有账号？<el-button type="text" @click="goToRegister">立即注册</el-button></p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/UserStore'
import { login } from '@/api/login'
import { generateCaptcha } from '@/utils/security'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

// 表单引用
const loginFormRef = ref(null)

// 登录表单
const loginForm = reactive({
  account: '',
  password: '',
  captcha: ''
})

// 表单验证规则
const loginRules = {
  account: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符之间', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 4, max: 4, message: '验证码长度为 4 个字符', trigger: 'blur' }
  ]
}

// 验证码
const captchaCode = ref('')
const isLoading = ref(false)

// 计算属性
const isFormValid = computed(() => {
  return loginForm.account && loginForm.password && loginForm.captcha
})

// 生成验证码
const refreshCaptcha = () => {
  captchaCode.value = generateCaptcha(4)
}

// 输入处理
const onAccountInput = (value) => {
  // 可以添加输入验证逻辑
}

const onPasswordInput = (value) => {
  // 可以添加输入验证逻辑
}

const onCaptchaInput = (value) => {
  // 可以添加输入验证逻辑
}

// 登录处理
const handleLogin = async () => {
  try {
    // 验证表单
    const valid = await loginFormRef.value.validate()
    if (!valid) return
    
    // 验证验证码
    if (loginForm.captcha.toLowerCase() !== captchaCode.value.toLowerCase()) {
      ElMessage.error('验证码错误')
      refreshCaptcha()
      return
    }
    
    // 开始登录
    isLoading.value = true
    
    // 调用登录接口
    const response = await login(loginForm)
    
    if (response.status === 0) {
      // 登录成功，保存用户信息
      userStore.saveUserState(response.userInfo, response.token, response.refreshToken)
      
      // 跳转到首页
      router.push('/home')
      
      ElMessage.success('登录成功')
    } else {
      ElMessage.error(response.message || '登录失败')
    }
  } catch (error) {
    ElMessage.error(error.message || '登录失败')
  } finally {
    isLoading.value = false
    refreshCaptcha()
  }
}

// 跳转到注册
const goToRegister = () => {
  router.push('/register')
}

// 初始化
const init = () => {
  // 检查是否已登录
  if (userStore.isLoggedIn()) {
    router.push('/home')
  } else {
    // 初始化验证码
    refreshCaptcha()
  }
}

onMounted(() => {
  init()
})
</script>

<style scoped>
.login-form {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.login-header p {
  margin: 0;
  font-size: 14px;
  color: #999;
}

.form-content {
  margin-bottom: 30px;
}

.captcha-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.captcha-image {
  width: 120px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}

.captcha-image:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.captcha-text {
  font-size: 24px;
  font-weight: bold;
  color: white;
  letter-spacing: 4px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  background: linear-gradient(45deg, #fff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.2s ease;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.login-footer {
  text-align: center;
}

.login-footer p {
  margin: 0;
  font-size: 14px;
  color: #999;
}

.login-footer .el-button {
  padding: 0;
  margin-left: 4px;
  color: #667eea;
}

.login-footer .el-button:hover {
  color: #764ba2;
}

@media (max-width: 480px) {
  .login-form {
    border-radius: 0;
    padding: 20px;
    max-width: 100%;
  }
}
</style>