<template>
  <div class="music-player">
    <div class="player-header">
      <h3>音乐播放器</h3>
    </div>
    
    <div class="player-content">
      <!-- 当前播放信息 -->
      <div class="current-track-info" v-if="currentTrackInfo">
        <div class="track-cover">
          <img src="https://via.placeholder.com/100" alt="专辑封面" />
        </div>
        <div class="track-details">
          <div class="track-title">{{ currentTrackInfo.title }}</div>
          <div class="track-artist">{{ currentTrackInfo.artist }}</div>
        </div>
      </div>

      <!-- 进度条 -->
      <div class="progress-section">
        <div class="time-display">{{ formatTime(currentTime) }}</div>
        <div class="progress-bar">
          <div class="progress" :style="{ width: progressPercentage + '%' }" @click="onProgressClick">
            <div class="progress-handle"></div>
          </div>
        </div>
        <div class="time-display">{{ formatTime(duration) }}</div>
      </div>

      <!-- 播放控制 -->
      <div class="controls-section">
        <div class="control-buttons">
          <el-button icon="RefreshRight" @click="toggleShuffle" :disabled="!hasTracks" :class="{ active: shuffleMode }" />
          <el-button icon="Back" @click="previous" :disabled="!hasTracks" />
          <el-button
            :icon="isPlaying ? 'Pause' : 'Play'"
            @click="togglePlay"
            :disabled="!hasTracks"
            class="play-button"
          />
          <el-button icon="Forward" @click="next" :disabled="!hasTracks" />
          <el-button icon="RefreshLeft" @click="toggleRepeat" :disabled="!hasTracks" :class="{ active: repeatMode !== 'none' }" />
        </div>
      </div>

      <!-- 音量控制 -->
      <div class="volume-section">
        <el-button icon="Sound" @click="toggleMute" :disabled="!hasTracks" :class="{ muted: isMuted }" />
        <div class="volume-slider">
          <el-slider
            v-model="volume"
            :min="0"
            :max="100"
            @input="onVolumeChange"
            :disabled="!hasTracks"
            class="volume-slider-el"
          />
        </div>
        <div class="volume-value">{{ Math.round(volume) }}%</div>
      </div>

      <!-- 播放列表 -->
      <div class="playlist-section">
        <div class="playlist-header">
          <h4>播放列表 ({{ playlist.length }})</h4>
          <el-button icon="Delete" @click="clearPlaylist" :disabled="playlist.length === 0" size="small" />
        </div>
        <div class="playlist-items">
          <div
            v-for="(track, index) in playlist"
            :key="track.id"
            class="playlist-item"
            :class="{ active: index === currentTrackIndex }"
            @click="playTrack(index)"
          >
            <div class="track-number">{{ index + 1 }}</div>
            <div class="track-info">
              <div class="track-title">{{ track.title }}</div>
              <div class="track-artist">{{ track.artist }}</div>
            </div>
            <div class="track-duration">{{ formatTime(track.duration) }}</div>
            <el-button icon="Delete" @click.stop="removeTrack(track.id)" size="small" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useMusicStore } from '@/stores/MusicStore'

const musicStore = useMusicStore()

// 响应式数据
const volume = ref(50)

// 计算属性
const currentTrackInfo = computed(() => musicStore.currentTrackInfo)
const isPlaying = computed(() => musicStore.isPlaying)
const currentTrackIndex = computed(() => musicStore.currentTrackIndex)
const currentTime = computed(() => musicStore.currentTime)
const duration = computed(() => musicStore.duration)
const playlist = computed(() => musicStore.playlist)
const repeatMode = computed(() => musicStore.repeatMode)
const shuffleMode = computed(() => musicStore.shuffleMode)
const isMuted = computed(() => musicStore.isMuted)

const hasTracks = computed(() => playlist.value.length > 0)

const progressPercentage = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

// 方法
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const togglePlay = () => {
  musicStore.toggle()
}

const previous = () => {
  musicStore.previous()
}

const next = () => {
  musicStore.next()
}

const playTrack = (index) => {
  musicStore.play(index)
}

const removeTrack = (trackId) => {
  musicStore.removeFromPlaylist(trackId)
}

const clearPlaylist = () => {
  musicStore.clearPlaylist()
}

const onProgressClick = (event) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const clickX = event.clientX - rect.left
  const percentage = clickX / rect.width
  const newTime = percentage * duration.value
  musicStore.seek(newTime)
}

const onVolumeChange = (val) => {
  musicStore.setVolume(val / 100)
}

const toggleMute = () => {
  musicStore.toggleMute()
}

const toggleRepeat = () => {
  musicStore.toggleRepeat()
}

const toggleShuffle = () => {
  musicStore.toggleShuffle()
}

// 生命周期
onMounted(() => {
  musicStore.init()
  volume.value = musicStore.volume * 100
})

onBeforeUnmount(() => {
  musicStore.cleanup()
})
</script>

<style scoped>
.music-player {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  color: white;
}

.player-header {
  text-align: center;
  margin-bottom: 20px;
}

.player-header h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.current-track-info {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.track-cover img {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.track-details {
  flex: 1;
}

.track-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.track-artist {
  font-size: 14px;
  opacity: 0.8;
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.time-display {
  font-size: 12px;
  width: 45px;
  text-align: center;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: white;
  border-radius: 3px;
  position: relative;
  transition: width 0.1s ease;
}

.progress-handle {
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.controls-section {
  text-align: center;
  margin-bottom: 20px;
}

.control-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.play-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: white;
  color: #667eea;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.volume-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.volume-slider {
  flex: 1;
}

.volume-slider-el {
  --el-slider-runway-background-color: rgba(255, 255, 255, 0.3);
  --el-slider-runway-height: 6px;
  --el-slider-process-background-color: white;
  --el-slider-button-background-color: white;
  --el-slider-button-width: 12px;
  --el-slider-button-height: 12px;
  --el-slider-button-border-color: #667eea;
}

.volume-value {
  font-size: 12px;
  width: 45px;
  text-align: right;
}

.playlist-section {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
  backdrop-filter: blur(10px);
}

.playlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.playlist-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.playlist-items {
  max-height: 200px;
  overflow-y: auto;
}

.playlist-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: background 0.3s ease;
}

.playlist-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.playlist-item.active {
  background: rgba(255, 255, 255, 0.2);
}

.track-number {
  width: 24px;
  text-align: center;
  font-size: 14px;
  opacity: 0.7;
}

.track-info {
  flex: 1;
}

.track-duration {
  font-size: 12px;
  opacity: 0.7;
  width: 60px;
  text-align: right;
}

/* 激活状态样式 */
.control-buttons .active {
  color: white;
  background: rgba(255, 255, 255, 0.2);
}

.control-buttons .muted {
  opacity: 0.5;
}
</style>