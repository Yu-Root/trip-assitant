<template>
  <div class="captcha-component">
    <div class="captcha-row">
      <el-input
        v-model="captchaInput"
        placeholder="请输入验证码"
        prefix-icon="Verification"
        @input="onInput"
        @blur="onBlur"
        class="captcha-input"
      />
      <div class="captcha-image" @click="refreshCaptcha">
        <canvas ref="captchaCanvas" class="captcha-canvas"></canvas>
      </div>
    </div>
    <div class="captcha-hint" v-if="hintMessage">
      <el-icon><Warning /></el-icon>
      <span>{{ hintMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Warning } from '@element-plus/icons-vue'

// 验证码画布引用
const captchaCanvas = ref(null)

// 验证码输入
const captchaInput = ref('')

// 验证码配置
const config = ref({
  width: 120,
  height: 40,
  length: 4,
  noise: 100,
  fontSize: 24,
  font: 'Arial',
  colors: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b']
})

// 验证码状态
const captchaCode = ref('')
const hintMessage = ref('')

// 生成随机颜色
const randomColor = () => {
  const colors = config.value.colors
  return colors[Math.floor(Math.random() * colors.length)]
}

// 生成随机字符
const randomChar = () => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  return chars.charAt(Math.floor(Math.random() * chars.length))
}

// 生成验证码文本
const generateCaptchaText = () => {
  let text = ''
  for (let i = 0; i < config.value.length; i++) {
    text += randomChar()
  }
  return text
}

// 绘制验证码
const drawCaptcha = () => {
  const canvas = captchaCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  const { width, height, fontSize, font } = config.value
  
  // 清空画布
  ctx.clearRect(0, 0, width, height)
  
  // 绘制背景
  ctx.fillStyle = randomColor()
  ctx.fillRect(0, 0, width, height)
  
  // 绘制干扰线
  for (let i = 0; i < config.value.noise; i++) {
    ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`
    ctx.beginPath()
    ctx.moveTo(Math.random() * width, Math.random() * height)
    ctx.lineTo(Math.random() * width, Math.random() * height)
    ctx.stroke()
  }
  
  // 绘制干扰点
  for (let i = 0; i < config.value.noise * 2; i++) {
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`
    ctx.beginPath()
    ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2, 0, Math.PI * 2)
    ctx.fill()
  }
  
  // 绘制验证码文本
  ctx.font = `${fontSize}px ${font}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  const text = generateCaptchaText()
  captchaCode.value = text
  
  const charWidth = width / text.length
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const x = charWidth * i + charWidth / 2
    const y = height / 2
    
    // 随机旋转
    const rotate = (Math.random() - 0.5) * 0.5
    
    // 随机颜色
    const color = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`
    
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rotate)
    ctx.fillStyle = color
    ctx.fillText(char, 0, 0)
    ctx.restore()
  }
}

// 刷新验证码
const refreshCaptcha = () => {
  drawCaptcha()
  captchaInput.value = ''
  hintMessage.value = ''
}

// 输入处理
const onInput = (value) => {
  hintMessage.value = ''
}

const onBlur = (e) => {
  // 可以添加输入验证逻辑
}

// 验证验证码
const verifyCaptcha = (input) => {
  if (!input) {
    hintMessage.value = '请输入验证码'
    return false
  }
  
  if (input.toLowerCase() !== captchaCode.value.toLowerCase()) {
    hintMessage.value = '验证码错误'
    refreshCaptcha()
    return false
  }
  
  hintMessage.value = ''
  return true
}

// 初始化
const init = () => {
  if (captchaCanvas.value) {
    // 设置画布尺寸
    captchaCanvas.value.width = config.value.width
    captchaCanvas.value.height = config.value.height
    
    // 绘制验证码
    drawCaptcha()
  }
}

onMounted(() => {
  init()
})

// 监听配置变化
watch(config, (newConfig) => {
  init()
}, { deep: true })

// 暴露给父组件的方法
defineExpose({
  verify: verifyCaptcha,
  refresh: refreshCaptcha,
  getCode: () => captchaCode.value,
  getInput: () => captchaInput.value
})
</script>

<style scoped>
.captcha-component {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.captcha-row {
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
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.captcha-image:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.captcha-canvas {
  width: 100%;
  height: 100%;
}

.captcha-hint {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  background: #fff3f0;
  border: 1px solid #ffccc7;
  border-radius: 4px;
  font-size: 12px;
  color: #f56c6c;
}

.captcha-hint .el-icon {
  font-size: 14px;
}
</style>