<template>
  <div class="rich-text-editor">
    <div class="editor-toolbar">
      <el-button type="text" size="small" @click="toggleBold">
        <el-icon><Bold /></el-icon>
      </el-button>
      <el-button type="text" size="small" @click="toggleItalic">
        <el-icon><Italic /></el-icon>
      </el-button>
      <el-button type="text" size="small" @click="toggleUnderline">
        <el-icon><Underline /></el-icon>
      </el-button>
      <el-divider direction="vertical" />
      <el-button type="text" size="small" @click="toggleLink">
        <el-icon><Link /></el-icon>
      </el-button>
      <el-button type="text" size="small" @click="toggleImage">
        <el-icon><Picture /></el-icon>
      </el-button>
      <el-divider direction="vertical" />
      <el-button type="text" size="small" @click="toggleQuote">
        <el-icon><Quote /></el-icon>
      </el-button>
      <el-button type="text" size="small" @click="toggleCode">
        <el-icon><Code /></el-icon>
      </el-button>
    </div>
    
    <div class="editor-content">
      <div
        ref="editorRef"
        class="editor-input"
        contenteditable="true"
        @input="onInput"
        @blur="onBlur"
        @focus="onFocus"
      >
        <p>开始编辑内容...</p>
      </div>
    </div>
    
    <div class="editor-footer">
      <el-button type="text" size="small" @click="clearContent">
        <el-icon><Delete /></el-icon> 清空
      </el-button>
      <el-button type="text" size="small" @click="previewContent">
        <el-icon><View /></el-icon> 预览
      </el-button>
      <el-button type="primary" size="small" @click="saveContent">
        保存
      </el-button>
    </div>
    
    <!-- 预览模态框 -->
    <el-dialog
      v-model="showPreview"
      title="内容预览"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="preview-content" v-html="sanitizedContent"></div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { sanitizeHtml } from '@/utils/security'
import { ElMessage } from 'element-plus'
import { Bold, Italic, Underline, Link, Picture, Quote, Code, Delete, View } from '@element-plus/icons-vue'

// 编辑器引用
const editorRef = ref(null)

// 编辑器内容
const rawContent = ref('')
const sanitizedContent = ref('')
const showPreview = ref(false)

// 计算属性
const isEmpty = computed(() => !rawContent.value.trim())

// 格式化内容
const formatContent = (content) => {
  return content.replace(/\n/g, '<br>')
}

// 反格式化内容
const unformatContent = (content) => {
  return content.replace(/<br>/g, '\n')
}

// 输入处理
const onInput = (e) => {
  const content = e.target.innerHTML
  rawContent.value = content
  
  // XSS防护 - 富文本过滤
  const sanitized = sanitizeHtml(content)
  if (sanitized !== content) {
    // 如果内容被过滤，更新编辑器内容
    e.target.innerHTML = sanitized
    rawContent.value = sanitized
    ElMessage.info('内容已自动过滤敏感标签')
  }
  
  // 更新安全内容
  sanitizedContent.value = sanitized
}

const onBlur = (e) => {
  // 处理失去焦点时的内容
  const content = e.target.innerHTML
  rawContent.value = content
  sanitizedContent.value = sanitizeHtml(content)
}

const onFocus = (e) => {
  // 处理获得焦点时的内容
  if (!rawContent.value.trim()) {
    e.target.innerHTML = '<p>开始编辑内容...</p>'
  }
}

// 工具栏功能
const toggleBold = () => {
  document.execCommand('bold', false, null)
}

const toggleItalic = () => {
  document.execCommand('italic', false, null)
}

const toggleUnderline = () => {
  document.execCommand('underline', false, null)
}

const toggleLink = () => {
  const url = prompt('请输入链接地址：')
  if (url) {
    document.execCommand('createLink', false, url)
  }
}

const toggleImage = () => {
  const url = prompt('请输入图片地址：')
  if (url) {
    document.execCommand('insertImage', false, url)
  }
}

const toggleQuote = () => {
  document.execCommand('formatBlock', false, '<blockquote>')
}

const toggleCode = () => {
  document.execCommand('formatBlock', false, '<pre>')
}

// 清空内容
const clearContent = () => {
  if (editorRef.value) {
    editorRef.value.innerHTML = '<p>开始编辑内容...</p>'
    rawContent.value = ''
    sanitizedContent.value = ''
    ElMessage.success('内容已清空')
  }
}

// 预览内容
const previewContent = () => {
  showPreview.value = true
}

// 保存内容
const saveContent = () => {
  if (!sanitizedContent.value.trim()) {
    ElMessage.warning('请输入内容')
    return
  }
  
  // 这里可以添加保存到数据库的逻辑
  ElMessage.success('内容已保存')
  
  // 可以返回安全的内容给父组件
  emit('save', sanitizedContent.value)
}

// 监听内容变化
watch(rawContent, (newContent) => {
  // 实时更新安全内容
  sanitizedContent.value = sanitizeHtml(newContent)
})

// 初始化
const init = () => {
  if (editorRef.value) {
    // 初始化编辑器内容
    editorRef.value.innerHTML = '<p>开始编辑内容...</p>'
  }
}

onMounted(() => {
  init()
})

// 暴露给父组件的属性
const emit = defineEmits(['save'])
defineExpose({
  getContent: () => sanitizedContent.value,
  setContent: (content) => {
    rawContent.value = content
    sanitizedContent.value = sanitizeHtml(content)
    if (editorRef.value) {
      editorRef.value.innerHTML = content
    }
  }
})
</script>

<style scoped>
.rich-text-editor {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.editor-toolbar .el-button {
  padding: 4px 8px;
}

.editor-toolbar .el-divider {
  height: 24px;
}

.editor-content {
  height: 300px;
  overflow-y: auto;
}

.editor-input {
  min-height: 300px;
  padding: 16px;
  outline: none;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

.editor-input:empty:before {
  content: attr(placeholder);
  color: #999;
}

.editor-input p {
  margin: 0 0 12px 0;
}

.editor-input blockquote {
  border-left: 4px solid #667eea;
  padding-left: 12px;
  margin: 12px 0;
  color: #666;
  background: #f5f5f5;
}

.editor-input pre {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
}

.editor-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f5f5f5;
  border-top: 1px solid #e0e0e0;
}

.preview-content {
  padding: 16px;
  line-height: 1.6;
  font-size: 14px;
  color: #333;
}

.preview-content p {
  margin: 0 0 12px 0;
}

.preview-content blockquote {
  border-left: 4px solid #667eea;
  padding-left: 12px;
  margin: 12px 0;
  color: #666;
  background: #f5f5f5;
}

.preview-content pre {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
}

@media (max-width: 480px) {
  .editor-toolbar {
    flex-wrap: wrap;
  }
}
</style>