import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { Howl } from "howler";

// 示例音乐列表
const defaultPlaylist = [
  { id: 1, title: 'Home', artist: 'Unknown', url: '@/assets/audios/musics/Home.mp3', duration: 0 }
]

export const useMusicStore = defineStore('Music', () => {
    // 播放状态
    const isPlaying = ref(false)
    const currentTrackIndex = ref(0)
    const currentTime = ref(0)
    const duration = ref(0)
    const volume = ref(0.5)
    const isMuted = ref(false)
    const repeatMode = ref('none') // 'none', 'one', 'all'
    const shuffleMode = ref(false)
    
    // 播放列表
    const playlist = ref([...defaultPlaylist])
    
    // 播放历史
    const playHistory = ref([])
    
    // 音频控制器
    const currentTrack = ref(null)
    const seekTimer = ref(null)

    // 计算属性
    const currentTrackInfo = computed(() => {
        if (currentTrackIndex.value >= 0 && currentTrackIndex.value < playlist.value.length) {
            return playlist.value[currentTrackIndex.value]
        }
        return null
    })

    // 加载音频
    const loadTrack = (track) => {
        if (currentTrack.value) {
            currentTrack.value.unload()
        }
        currentTrack.value = new Howl({
            src: track.url,
            preload: true,
            loop: repeatMode.value === 'one',
            volume: isMuted.value ? 0 : volume.value,
            onload: () => {
                duration.value = currentTrack.value.duration()
                track.duration = duration.value
            },
            onplay: () => {
                isPlaying.value = true
                startSeekTimer()
            },
            onpause: () => {
                isPlaying.value = false
                stopSeekTimer()
            },
            onend: () => {
                isPlaying.value = false
                stopSeekTimer()
                handleTrackEnd()
            },
            ontimeupdate: () => {
                if (currentTrack.value) {
                    currentTime.value = currentTrack.value.seek()
                }
            }
        })
    }

    // 开始播放
    const play = (trackIndex = currentTrackIndex.value) => {
        if (trackIndex < 0 || trackIndex >= playlist.value.length) {
            return
        }
        currentTrackIndex.value = trackIndex
        const track = playlist.value[trackIndex]
        
        // 添加到播放历史
        if (playHistory.value.indexOf(track.id) === -1) {
            playHistory.value.unshift(track.id)
            if (playHistory.value.length > 10) {
                playHistory.value.pop()
            }
        }
        
        if (!currentTrack.value || currentTrack.value._src !== track.url) {
            loadTrack(track)
        }
        currentTrack.value.play()
    }

    // 暂停播放
    const pause = () => {
        if (currentTrack.value) {
            currentTrack.value.pause()
        }
    }

    // 切换播放状态
    const toggle = () => {
        if (isPlaying.value) {
            pause()
        } else {
            play()
        }
    }

    // 上一曲
    const previous = () => {
        let newIndex = currentTrackIndex.value - 1
        if (newIndex < 0) {
            newIndex = playlist.value.length - 1
        }
        play(newIndex)
    }

    // 下一曲
    const next = () => {
        let newIndex = currentTrackIndex.value + 1
        if (newIndex >= playlist.value.length) {
            newIndex = 0
        }
        play(newIndex)
    }

    // 处理曲目结束
    const handleTrackEnd = () => {
        if (repeatMode.value === 'all') {
            next()
        } else if (repeatMode.value === 'one') {
            play(currentTrackIndex.value)
        } else {
            if (currentTrackIndex.value < playlist.value.length - 1) {
                next()
            }
        }
    }

    // 调整进度
    const seek = (time) => {
        if (currentTrack.value) {
            currentTrack.value.seek(time)
            currentTime.value = time
        }
    }

    // 调整音量
    const setVolume = (val) => {
        volume.value = val
        if (currentTrack.value) {
            currentTrack.value.volume(isMuted.value ? 0 : val)
        }
    }

    // 静音切换
    const toggleMute = () => {
        isMuted.value = !isMuted.value
        if (currentTrack.value) {
            currentTrack.value.volume(isMuted.value ? 0 : volume.value)
        }
    }

    // 重复模式切换
    const toggleRepeat = () => {
        const modes = ['none', 'one', 'all']
        const currentModeIndex = modes.indexOf(repeatMode.value)
        repeatMode.value = modes[(currentModeIndex + 1) % modes.length]
        if (currentTrack.value) {
            currentTrack.value.loop(repeatMode.value === 'one')
        }
    }

    // 随机播放切换
    const toggleShuffle = () => {
        shuffleMode.value = !shuffleMode.value
    }

    // 添加到播放列表
    const addToPlaylist = (track) => {
        const existingTrack = playlist.value.find(t => t.id === track.id)
        if (!existingTrack) {
            playlist.value.push(track)
        }
    }

    // 从播放列表移除
    const removeFromPlaylist = (trackId) => {
        const index = playlist.value.findIndex(t => t.id === trackId)
        if (index !== -1) {
            playlist.value.splice(index, 1)
            if (currentTrackIndex.value === index) {
                if (playlist.value.length > 0) {
                    play(Math.min(index, playlist.value.length - 1))
                } else {
                    pause()
                    currentTrackIndex.value = 0
                }
            } else if (currentTrackIndex.value > index) {
                currentTrackIndex.value--
            }
        }
    }

    // 清空播放列表
    const clearPlaylist = () => {
        playlist.value = []
        pause()
        currentTrackIndex.value = 0
    }

    // 开始进度计时器
    const startSeekTimer = () => {
        stopSeekTimer()
        seekTimer.value = setInterval(() => {
            if (currentTrack.value && isPlaying.value) {
                currentTime.value = currentTrack.value.seek()
            }
        }, 1000)
    }

    // 停止进度计时器
    const stopSeekTimer = () => {
        if (seekTimer.value) {
            clearInterval(seekTimer.value)
            seekTimer.value = null
        }
    }

    // 交互后播放（解决浏览器自动播放限制）
    const playAfterInteraction = () => {
        if (!isPlaying.value && playlist.value.length > 0) {
            play()
        }
    }

    // 初始化
    const init = () => {
        if (playlist.value.length > 0) {
            loadTrack(playlist.value[0])
        }
    }

    // 清理
    const cleanup = () => {
        stopSeekTimer()
        if (currentTrack.value) {
            currentTrack.value.unload()
            currentTrack.value = null
        }
    }

    return {
        // 状态
        isPlaying,
        currentTrackIndex,
        currentTime,
        duration,
        volume,
        isMuted,
        repeatMode,
        shuffleMode,
        playlist,
        playHistory,
        currentTrackInfo,
        
        // 方法
        play,
        pause,
        toggle,
        previous,
        next,
        seek,
        setVolume,
        toggleMute,
        toggleRepeat,
        toggleShuffle,
        addToPlaylist,
        removeFromPlaylist,
        clearPlaylist,
        playAfterInteraction,
        init,
        cleanup
    }
})