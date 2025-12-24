<template>
  <div class="auth-status">
    <div class="status-indicator" :class="{ 'active': isLoggedIn }">
      <el-icon><CheckCircle v-if="isLoggedIn" /><CloseCircle v-else /></el-icon>
    </div>
    <div class="status-info">
      <div class="status-text">
        <span v-if="isLoggedIn">{{ userInfo.name }}</span>
        <span v-else>未登录</span>
      </div>
      <div class="status-details">
        <span v-if="isLoggedIn">{{ userInfo.account }}</span>
        <span v-else>请登录以使用完整功能</span>
      </div>
    </div>
    <div class="status-actions">
      <el-button type="text" size="small" @click="handleLogin" v-if="!isLoggedIn">
        登录
      </el-button>
      <el-button type="text" size="small" @click="handleLogout" v-if="isLoggedIn">
        退出
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/UserStore'
import { CheckCircle, CloseCircle } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

// 计算属性
const isLoggedIn = computed(() => userStore.isLoggedIn())
const userInfo = computed(() => {
  return {
    name: userStore.name,
    account: userStore.account
  }
})

// 处理登录
const handleLogin = () => {
  router.push('/login')
}

// 处理退出
const handleLogout = () => {
  userStore.clearUserState()
  ElMessage.success('已退出登录')
  router.push('/login')
}

// 初始化
const init = () => {
  // 初始化登录状态
  userStore.initLoginState()
}

onMounted(() => {
  init()
})
</script>

<style scoped>
.auth-status {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.status-indicator {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  transition: all 0.2s ease;
}

.status-indicator.active {
  background: #67c23a;
  box-shadow: 0 0 12px rgba(103, 194, 58, 0.3);
}

.status-indicator .el-icon {
  font-size: 16px;
  color: white;
}

.status-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.status-text {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.status-details {
  font-size: 12px;
  color: #999;
}

.status-actions {
  display: flex;
  gap: 8px;
}

.status-actions .el-button {
  padding: 0 8px;
  color: #667eea;
}

.status-actions .el-button:hover {
  color: #764ba2;
}

@media (max-width: 480px) {
  .auth-status {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>