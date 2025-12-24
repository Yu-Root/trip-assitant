<template>
  <div class="register-form">
    <div class="register-header">
      <h2>创建账号</h2>
      <p>开始您的旅行助手之旅</p>
    </div>
    
    <el-form
      ref="registerFormRef"
      :model="registerForm"
      :rules="registerRules"
      label-width="80px"
      class="form-content"
    >
      <el-form-item label="用户名" prop="account">
        <el-input
          v-model="registerForm.account"
          placeholder="请输入用户名"
          prefix-icon="User"
          @input="onAccountInput"
        />
      </el-form-item>
      
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="registerForm.password"
          type="password"
          placeholder="请输入密码"
          prefix-icon="Lock"
          @input="onPasswordInput"
        />
      </el-form-item>
      
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model="registerForm.confirmPassword"
          type="password"
          placeholder="请再次输入密码"
          prefix-icon="Lock"
          @input="onConfirmPasswordInput"
        />
      </el-form-item>
      
      <el-form-item label="昵称" prop="nickname">
        <el-input
          v-model="registerForm.nickname"
          placeholder="请输入昵称"
          prefix-icon="UserFilled"
          @input="onNicknameInput"
        />
      </el-form-item>
      
      <el-form-item label="简介" prop="bio">
        <el-input
          v-model="registerForm.bio"
          type="textarea"
          placeholder="请输入个人简介"
          :rows="3"
          @input="onBioInput"
        />
      </el-form-item>
      
      <el-form-item>
        <el-button
          type="primary"
          class="register-btn"
          @click="handleRegister"
          :loading="isLoading"
          :disabled="isLoading || !isFormValid"
        >
          {{ isLoading ? '注册中...' : '注册' }}
        </el-button>
      </el-form-item>
    </el-form>
    
    <div class="register-footer">
      <p>已有账号？<el-button type="text" @click="goToLogin">立即登录</el-button></p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/UserStore'
import { register } from '@/api/login'
import { filterSensitiveWords, escapeHtml } from '@/utils/security'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

// 表单引用
const registerFormRef = ref(null)

// 注册表单
const registerForm = reactive({
  account: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  bio: ''
})

// 表单验证规则
const registerRules = {
  account: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符之间', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度在 2 到 20 个字符之间', trigger: 'blur' }
  ],
  bio: [
    { max: 200, message: '简介长度不超过 200 个字符', trigger: 'blur' }
  ]
}

// 确认密码验证
const validateConfirmPassword = (rule, value, callback) => {
  if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const isLoading = ref(false)

// 计算属性
const isFormValid = computed(() => {
  return registerForm.account && registerForm.password && registerForm.confirmPassword && registerForm.nickname
})

// 输入处理
const onAccountInput = (value) => {
  // 可以添加输入验证逻辑
}

const onPasswordInput = (value) => {
  // 可以添加输入验证逻辑
}

const onConfirmPasswordInput = (value) => {
  // 可以添加输入验证逻辑
}

const onNicknameInput = (value) => {
  // 敏感词过滤
  const result = filterSensitiveWords(value)
  if (result.isSensitive) {
    ElMessage.warning(result.message)
  }
}

const onBioInput = (value) => {
  // 敏感词过滤
  const result = filterSensitiveWords(value)
  if (result.isSensitive) {
    ElMessage.warning(result.message)
  }
  
  // XSS防护 - 普通文本转义
  const sanitizedValue = escapeHtml(value)
  if (sanitizedValue !== value) {
    ElMessage.info('内容已自动过滤敏感标签')
  }
}

// 注册处理
const handleRegister = async () => {
  try {
    // 验证表单
    const valid = await registerFormRef.value.validate()
    if (!valid) return
    
    // 敏感词过滤
    const nicknameResult = filterSensitiveWords(registerForm.nickname)
    if (nicknameResult.isSensitive) {
      ElMessage.warning(nicknameResult.message)
      return
    }
    
    const bioResult = filterSensitiveWords(registerForm.bio)
    if (bioResult.isSensitive) {
      ElMessage.warning(bioResult.message)
      return
    }
    
    // XSS防护 - 普通文本转义
    const sanitizedNickname = escapeHtml(registerForm.nickname)
    const sanitizedBio = escapeHtml(registerForm.bio)
    
    // 开始注册
    isLoading.value = true
    
    // 调用注册接口
    const response = await register({
      account: registerForm.account,
      password: registerForm.password,
      nickname: sanitizedNickname,
      bio: sanitizedBio
    })
    
    if (response.status === 0) {
      // 注册成功
      ElMessage.success('注册成功，请登录')
      
      // 跳转到登录页面
      router.push('/login')
    } else {
      ElMessage.error(response.message || '注册失败')
    }
  } catch (error) {
    ElMessage.error(error.message || '注册失败')
  } finally {
    isLoading.value = false
  }
}

// 跳转到登录
const goToLogin = () => {
  router.push('/login')
}

// 初始化
const init = () => {
  // 检查是否已登录
  if (userStore.isLoggedIn()) {
    router.push('/home')
  }
}

onMounted(() => {
  init()
})
</script>

<style scoped>
.register-form {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h2 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.register-header p {
  margin: 0;
  font-size: 14px;
  color: #999;
}

.form-content {
  margin-bottom: 30px;
}

.register-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.2s ease;
}

.register-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.register-footer {
  text-align: center;
}

.register-footer p {
  margin: 0;
  font-size: 14px;
  color: #999;
}

.register-footer .el-button {
  padding: 0;
  margin-left: 4px;
  color: #667eea;
}

.register-footer .el-button:hover {
  color: #764ba2;
}

@media (max-width: 480px) {
  .register-form {
    border-radius: 0;
    padding: 20px;
    max-width: 100%;
  }
}
</style>