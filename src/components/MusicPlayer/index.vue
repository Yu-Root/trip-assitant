<template>
  <div class="music-player">
    <div class="player-header">
      <h3>音乐播放器</h3>
      <el-button type="text" @click="togglePlayer">
        <el-icon><Setting /></el-icon>
      </el-button>
    </div>
    
    <div class="player-content">
      <!-- 播放信息 -->
      <div class="play-info">
        <div class="song-info">
          <h4>{{ currentSong.title }}</h4>
          <p>{{ currentSong.artist }}</p>
        </div>
      </div>
      
      <!-- 进度条 -->
      <div class="progress-section">
        <span class="time">{{ formatTime(currentTime) }}</span>
        <el-slider
          v-model="progressValue"
          :max="duration"
          @change="onSeek"
          class="progress-slider"
        >
          <template #mark>
            <span class="time-mark">{{ formatTime(duration) }}</span>
          </template>
        </el-slider>
      </div>
      
      <!-- 播放控制 -->
      <div class="controls">
        <el-button type="text" @click="playPrevious" :disabled="playList.length === 0">
          <el-icon size="24"><ArrowLeft /></el-icon>
        </el-button>
        <el-button type="primary" @click="togglePlay" circle>
          <el-icon size="32">
            <Play v-if="!isPlaying" />
            <Pause v-else />
          </el-icon>
        </el-button>
        <el-button type="text" @click="playNext" :disabled="playList.length === 0">
          <el-icon size="24"><ArrowRight /></el-icon>
        </el-button>
      </div>
      
      <!-- 音量控制 -->
      <div class="volume-section">
        <el-icon class="volume-icon">
          <Volume2 v-if="volume > 0.5" />
          <Volume1 v-else-if="volume > 0" />
          <VolumeX v-else />
        </el-icon>
        <el-slider
          v-model="volumeValue"
          :max="100"
          @change="onVolumeChange"
          class="volume-slider"
        >
          <template #mark>
            <span class="volume-value">{{ Math.round(volumeValue) }}%</span>
          </template>
        </el-slider>
      </div>
      
      <!-- 播放列表 -->
      <div class="playlist-section">
        <div class="playlist-header">
          <h4>播放列表</h4>
          <el-button type="text" size="small" @click="togglePlaylist">
            <el-icon><List /></el-icon>
          </el-button>
        </div>
        <div class="playlist-content" :class="{ 'show': showPlaylist }">
          <div
            v-for="(song, index) in playList"
            :key="song.id"
            class="playlist-item"
            :class="{ 'active': index === currentSongIndex }"
            @click="playSong(index)"
          >
            <div class="song-number">{{ index + 1 }}</div>
            <div class="song-title">{{ song.title }}</div>
            <div class="song-duration">{{ formatTime(song.duration) }}</div>
            <el-button type="text" @click.stop="removeFromPlayList(index)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
      
      <!-- 播放历史 -->
      <div class="history-section">
        <div class="history-header">
          <h4>播放历史</h4>
          <el-button type="text" size="small" @click="toggleHistory">
            <el-icon><Clock /></el-icon>
          </el-button>
        </div>
        <div class="history-content" :class="{ 'show': showHistory }">
          <div
            v-for="(song, index) in playHistory"
            :key="song.id"
            class="history-item"
            @click="playFromHistory(index)"
          >
            <div class="song-title">{{ song.title }}</div>
            <div class="song-artist">{{ song.artist }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useMusicStore } from '@/stores/MusicStore'
import { Play, Pause, ArrowLeft, ArrowRight, Volume2, Volume1, VolumeX, List, Clock, Delete, Setting } from '@element-plus/icons-vue'

const musicStore = useMusicStore()

// 计算属性
const isPlaying = computed(() => musicStore.isPlaying)
const currentTime = computed(() => musicStore.currentTime)
const duration = computed(() => musicStore.duration)
const volume = computed(() => musicStore.volume)
const currentSongIndex = computed(() => musicStore.currentSongIndex)
const playList = computed(() => musicStore.playList)
const playHistory = computed(() => musicStore.playHistory)
const currentSong = computed(() => playList.value[currentSongIndex.value] || { title: '未播放', artist: '未知' })

// 响应式数据
const showPlaylist = ref(false)
const showHistory = ref(false)
const progressValue = ref(0)
const volumeValue = ref(volume.value * 100)

// 监听播放进度
watch(currentTime, (newTime) => {
  progressValue.value = newTime
})

// 监听音量变化
watch(volume, (newVolume) => {
  volumeValue.value = newVolume * 100
})

// 格式化时间
const formatTime = (seconds) => {
  if (!seconds) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

// 播放控制
const togglePlay = () => {
  musicStore.toggle()
}

const playPrevious = () => {
  musicStore.playPrevious()
}

const playNext = () => {
  musicStore.playNext()
}

const playSong = (index) => {
  musicStore.playSong(index)
}

// 进度条控制
const onSeek = (value) => {
  musicStore.seek(value)
}

// 音量控制
const onVolumeChange = (value) => {
  musicStore.setVolume(value / 100)
}

// 播放列表控制
const togglePlaylist = () => {
  showPlaylist.value = !showPlaylist.value
}

const removeFromPlayList = (index) => {
  musicStore.removeFromPlayList(index)
}

// 播放历史控制
const toggleHistory = () => {
  showHistory.value = !showHistory.value
}

const playFromHistory = (index) => {
  musicStore.playFromHistory(index)
}

// 切换播放器显示
const togglePlayer = () => {
  // 可以实现播放器的展开/收起功能
  console.log('切换播放器设置')
}

// 初始化
const initPlayer = () => {
  musicStore.initPlayState()
}

initPlayer()
</script>

<style scoped>
.music-player {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  margin: 0 auto;
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.player-header h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.player-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.play-info {
  text-align: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.song-info h4 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 500;
}

.song-info p {
  margin: 0;
  font-size: 14px;
  opacity: 0.8;
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 10px;
}

.time {
  font-size: 12px;
  opacity: 0.8;
  min-width: 40px;
  text-align: center;
}

.progress-slider {
  flex: 1;
  --el-slider__bar-background-color: #fff;
  --el-slider__button-color: #fff;
}

.time-mark {
  font-size: 12px;
  opacity: 0.8;
}

.controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.controls .el-button {
  color: white;
}

.volume-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 10px;
}

.volume-icon {
  font-size: 20px;
  opacity: 0.8;
}

.volume-slider {
  flex: 1;
  --el-slider__bar-background-color: #fff;
  --el-slider__button-color: #fff;
}

.volume-value {
  font-size: 12px;
  opacity: 0.8;
  min-width: 40px;
  text-align: right;
}

.playlist-section,
.history-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.playlist-header,
.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
}

.playlist-header h4,
.history-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.playlist-content,
.history-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.playlist-content.show,
.history-content.show {
  max-height: 300px;
  padding: 12px 16px;
}

.playlist-item,
.history-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.playlist-item:last-child,
.history-item:last-child {
  border-bottom: none;
}

.playlist-item:hover,
.history-item:hover {
  background: rgba(255, 255, 255, 0.1);
  padding-left: 8px;
}

.playlist-item.active {
  background: rgba(255, 255, 255, 0.2);
  font-weight: 500;
}

.song-number {
  width: 24px;
  text-align: center;
  font-size: 12px;
  opacity: 0.8;
}

.song-title {
  flex: 1;
  font-size: 14px;
}

.song-duration {
  font-size: 12px;
  opacity: 0.8;
  min-width: 50px;
  text-align: right;
}

.song-artist {
  font-size: 12px;
  opacity: 0.8;
}

@media (max-width: 480px) {
  .music-player {
    border-radius: 0;
    max-width: 100%;
  }
}
</style>