// 输入安全工具库
import DOMPurify from 'dompurify'

// 敏感词库
const sensitiveWords = [
  '色情', '暴力', '赌博', '毒品', '恐怖', '极端',
  '反动', '邪教', '违法', '违规', '垃圾', '傻逼',
  '操你妈', '他妈的', '去死', '滚蛋', '废物', '垃圾'
]

// 敏感词过滤函数
export const filterSensitiveWords = (text) => {
  if (!text) return ''
  let result = text
  sensitiveWords.forEach(word => {
    const regex = new RegExp(word, 'gi')
    result = result.replace(regex, '*'.repeat(word.length))
  })
  return result
}

// 检查是否包含敏感词
export const hasSensitiveWords = (text) => {
  if (!text) return false
  return sensitiveWords.some(word => text.toLowerCase().includes(word.toLowerCase()))
}

// XSS防护 - 净化HTML内容
export const sanitizeHtml = (html) => {
  if (!html) return ''
  return DOMPurify.sanitize(html)
}

// XSS防护 - 转义特殊字符
export const escapeHtml = (text) => {
  if (!text) return ''
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// 生成图形验证码
export const generateCaptcha = () => {
  // 简单的验证码生成逻辑
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let captcha = ''
  for (let i = 0; i < 4; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return captcha
}

// 验证验证码
export const validateCaptcha = (input, correct) => {
  return input && correct && input.toLowerCase() === correct.toLowerCase()
}

// 密码强度检查
export const checkPasswordStrength = (password) => {
  if (!password) return 0
  let strength = 0
  // 长度检查
  if (password.length >= 8) strength++
  // 包含大写字母
  if (/[A-Z]/.test(password)) strength++
  // 包含小写字母
  if (/[a-z]/.test(password)) strength++
  // 包含数字
  if (/\d/.test(password)) strength++
  // 包含特殊字符
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++
  return strength
}

// 邮箱格式验证
export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

// 手机号格式验证
export const validatePhone = (phone) => {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}