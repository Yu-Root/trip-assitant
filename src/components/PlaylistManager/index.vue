<template>
  <div class="playlist-manager">
    <div class="manager-header">
      <h3>播放列表</h3>
      <el-button type="primary" size="small" @click="addSong">
        <el-icon><Plus /></el-icon> 添加歌曲
      </el-button>
    </div>
    
    <div class="manager-content">
      <div class="playlist-list">
        <div
          v-for="(song, index) in playList"
          :key="song.id"
          class="playlist-item"
          :class="{ 'active': index === currentSongIndex }"
        >
          <div class="item-index">{{ index + 1 }}</div>
          <div class="item-info">
            <div class="item-title">{{ song.title }}</div>
            <div class="item-artist">{{ song.artist }}</div>
          </div>
          <div class="item-duration">{{ formatTime(song.duration) }}</div>
          <div class="item-actions">
            <el-button type="text" size="small" @click="playSong(index)">
              <el-icon><Play /></el-icon>
            </el-button>
            <el-button type="text" size="small" @click="removeSong(index)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
      
      <div class="manager-footer">
        <el-button type="text" size="small" @click="clearPlaylist">
          <el-icon><Delete /></el-icon> 清空列表
        </el-button>
        <el-button type="text" size="small" @click="shufflePlaylist">
          <el-icon><Refresh /></el-icon> 随机播放
        </el-button>
      </div>
    </div>
    
    <!-- 添加歌曲模态框 -->
    <el-dialog
      v-model="showAddDialog"
      title="添加歌曲"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="addSongFormRef"
        :model="newSong"
        :rules="addSongRules"
        label-width="80px"
      >
        <el-form-item label="歌曲名称" prop="title">
          <el-input v-model="newSong.title" placeholder="请输入歌曲名称" />
        </el-form-item>
        
        <el-form-item label="歌手" prop="artist">
          <el-input v-model="newSong.artist" placeholder="请输入歌手名称" />
        </el-form-item>
        
        <el-form-item label="歌曲链接" prop="src">
          <el-input v-model="newSong.src" placeholder="请输入歌曲链接" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmAddSong">添加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMusicStore } from '@/stores/MusicStore'
import { Plus, Play, Delete, Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const musicStore = useMusicStore()

// 播放列表
const playList = computed(() => musicStore.playList)
const currentSongIndex = computed(() => musicStore.currentSongIndex)

// 添加歌曲模态框
const showAddDialog = ref(false)
const addSongFormRef = ref(null)
const newSong = ref({
  title: '',
  artist: '',
  src: ''
})

// 添加歌曲验证规则
const addSongRules = {
  title: [
    { required: true, message: '请输入歌曲名称', trigger: 'blur' },
    { min: 1, max: 50, message: '歌曲名称长度在 1 到 50 个字符之间', trigger: 'blur' }
  ],
  artist: [
    { required: true, message: '请输入歌手名称', trigger: 'blur' },
    { min: 1, max: 50, message: '歌手名称长度在 1 到 50 个字符之间', trigger: 'blur' }
  ],
  src: [
    { required: true, message: '请输入歌曲链接', trigger: 'blur' }
  ]
}

// 格式化时间
const formatTime = (seconds) => {
  if (!seconds) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

// 播放歌曲
const playSong = (index) => {
  musicStore.playSong(index)
}

// 移除歌曲
const removeSong = (index) => {
  musicStore.removeFromPlayList(index)
  ElMessage.success('歌曲已移除')
}

// 清空播放列表
const clearPlaylist = () => {
  if (playList.value.length === 0) {
    ElMessage.warning('播放列表已经是空的')
    return
  }
  
  if (confirm('确定要清空播放列表吗？')) {
    // 先暂停播放
    if (musicStore.isPlaying) {
      musicStore.toggle()
    }
    // 清空列表
    musicStore.playList = []
    ElMessage.success('播放列表已清空')
  }
}

// 随机播放
const shufflePlaylist = () => {
  if (playList.value.length === 0) {
    ElMessage.warning('播放列表是空的')
    return
  }
  
  // 随机排序播放列表
  const shuffledList = [...playList.value]
  for (let i = shuffledList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    [shuffledList[i], shuffledList[j]] = [shuffledList[j], shuffledList[i]]
  }
  
  // 更新播放列表
  musicStore.reorderPlayList(shuffledList)
  ElMessage.success('播放列表已随机排序')
}

// 添加歌曲
const addSong = () => {
  showAddDialog.value = true
  newSong.value = {
    title: '',
    artist: '',
    src: ''
  }
}

// 确认添加歌曲
const confirmAddSong = async () => {
  try {
    // 验证表单
    const valid = await addSongFormRef.value.validate()
    if (!valid) return
    
    // 创建新歌曲对象
    const song = {
      id: Date.now(),
      title: newSong.value.title,
      artist: newSong.value.artist,
      src: newSong.value.src,
      duration: 0
    }
    
    // 添加到播放列表
    musicStore.addToPlayList(song)
    ElMessage.success('歌曲已添加')
    
    // 关闭模态框
    showAddDialog.value = false
  } catch (error) {
    ElMessage.error('添加失败，请检查输入')
  }
}

// 初始化
const init = () => {
  // 可以从本地存储恢复播放列表
}

onMounted(() => {
  init()
})
</script>

<style scoped>
.playlist-manager {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.manager-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.manager-content {
  padding: 16px;
}

.playlist-list {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 16px;
}

.playlist-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.playlist-item:hover {
  background: #f5f5f5;
}

.playlist-item.active {
  background: #e6f7ff;
  border-left: 4px solid #667eea;
}

.item-index {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #999;
  font-weight: 500;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.item-artist {
  font-size: 12px;
  color: #999;
}

.item-duration {
  font-size: 12px;
  color: #999;
  min-width: 50px;
  text-align: right;
}

.item-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.playlist-item:hover .item-actions {
  opacity: 1;
}

.item-actions .el-button {
  padding: 0;
  color: #999;
}

.item-actions .el-button:hover {
  color: #667eea;
}

.manager-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.manager-footer .el-button {
  padding: 4px 8px;
  color: #999;
}

.manager-footer .el-button:hover {
  color: #667eea;
}

@media (max-width: 480px) {
  .playlist-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .item-actions {
    opacity: 1;
    margin-top: 8px;
  }
}
</style>