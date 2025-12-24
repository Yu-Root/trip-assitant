<template>
  <div class="captcha-container">
    <div class="captcha-input-group">
      <el-input
        v-model="inputCaptcha"
        type="text"
        placeholder="请输入验证码"
        @input="onInput"
        :disabled="isDisabled"
        :maxlength="4"
        class="captcha-input"
      />
      <div class="captcha-image" @click="refreshCaptcha" :style="{ background: getCaptchaBackground() }">
        <span class="captcha-text">{{ captchaText }}</span>
      </div>
      <el-button icon="Refresh" @click="refreshCaptcha" :disabled="isDisabled" />
    </div>
    <div class="captcha-error" v-if="errorMessage">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 组件属性
const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: true
  }
})

// 组件事件
const emit = defineEmits(['update:value', 'input', 'change', 'validate'])

// 响应式数据
const inputCaptcha = ref('')
const captchaText = ref('')
const errorMessage = ref('')
const isDisabled = ref(false)

// 验证码生成配置
const captchaConfig = {
  length: 4,
  chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  fontSize: '24px',
  fontFamilies: ['Arial', 'Helvetica', 'Courier New', 'Times New Roman'],
  colors: ['#333', '#666', '#999'],
  backgrounds: ['#f0f0f0', '#f5f5f5', '#fafafa']
}

// 计算属性
const isDisabled = computed(() => props.disabled)

// 方法
const generateCaptcha = () => {
  let captcha = ''
  for (let i = 0; i < captchaConfig.length; i++) {
    captcha += captchaConfig.chars.charAt(Math.floor(Math.random() * captchaConfig.chars.length))
  }
  return captcha
}

const refreshCaptcha = () => {
  if (isDisabled.value) return
  captchaText.value = generateCaptcha()
  inputCaptcha.value = ''
  errorMessage.value = ''
  emit('update:value', '')
  emit('change', '')
}

const getCaptchaBackground = () => {
  const randomIndex = Math.floor(Math.random() * captchaConfig.backgrounds.length)
  return captchaConfig.backgrounds[randomIndex]
}

const onInput = (value) => {
  inputCaptcha.value = value
  emit('update:value', value)
  emit('input', value)
  emit('change', value)
}

const validate = () => {
  if (!props.required && !inputCaptcha.value) {
    errorMessage.value = ''
    return true
  }
  if (!inputCaptcha.value) {
    errorMessage.value = '请输入验证码'
    return false
  }
  if (inputCaptcha.value.length < captchaConfig.length) {
    errorMessage.value = '请输入完整的验证码'
    return false
  }
  if (inputCaptcha.value.toLowerCase() !== captchaText.value.toLowerCase()) {
    errorMessage.value = '验证码错误'
    return false
  }
  errorMessage.value = ''
  return true
}

// 暴露给父组件的方法
defineExpose({
  validate,
  refreshCaptcha
})

// 生命周期
onMounted(() => {
  refreshCaptcha()
})
</script>

<style scoped>
.captcha-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.captcha-input-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.captcha-input {
  flex: 1;
}

.captcha-image {
  width: 120px;
  height: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;
  font-weight: bold;
  letter-spacing: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.captcha-image:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.captcha-text {
  font-size: 24px;
  font-family: 'Arial', 'Helvetica', sans-serif;
  color: #333;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.captcha-error {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 4px;
}
</style>