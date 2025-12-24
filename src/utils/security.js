import DOMPurify from 'dompurify'

// 敏感词库（可配置）
const sensitiveWords = ['垃圾', '傻逼', '操你妈', '他妈的', '草泥马', '废物', '脑残', '智障', '去死', '滚蛋', '傻逼', '傻帽', '傻逼', '傻逼']

/**
 * 敏感词过滤
 * @param {string} text 待过滤文本
 * @returns {Object} { isSensitive: boolean, message: string }
 */
export const filterSensitiveWords = (text) => {
  if (!text) return { isSensitive: false, message: '' }
  
  for (const word of sensitiveWords) {
    const regex = new RegExp(word, 'gi')
    if (regex.test(text)) {
      return { isSensitive: true, message: `输入内容包含敏感词：${word}` }
    }
  }
  
  return { isSensitive: false, message: '' }
}

/**
 * XSS防护 - 普通文本转义
 * @param {string} text 待转义文本
 * @returns {string} 转义后的文本
 */
export const escapeHtml = (text) => {
  if (!text) return ''
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * XSS防护 - 富文本过滤
 * @param {string} html 待过滤HTML
 * @returns {string} 过滤后的HTML
 */
export const sanitizeHtml = (html) => {
  if (!html) return ''
  return DOMPurify.sanitize(html)
}

/**
 * 生成随机验证码
 * @param {number} length 验证码长度
 * @returns {string} 随机验证码
 */
export const generateCaptcha = (length = 4) => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let captcha = ''
  for (let i = 0; i < length; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return captcha
}