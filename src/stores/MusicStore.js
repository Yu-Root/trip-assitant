import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { Howl } from "howler";

import homeMusic from '@/assets/audios/musics/Home.mp3'

export const useMusicStore = defineStore('Music', () => {
    const isPlaying = ref(false)
    const currentTime = ref(0)
    const duration = ref(0)
    const volume = ref(0.5)
    const currentSongIndex = ref(0)
    const playHistory = ref([])

    // 播放列表
    const playList = ref([
        {
            id: 1,
            title: 'Home',
            artist: 'Unknown',
            src: homeMusic,
            duration: 0
        }
    ])

    // 当前播放的音乐实例
    const currentMusic = ref(null)

    // 初始化音乐实例
    const initMusic = (song) => {
        return new Howl({
            src: song.src,
            preload: true,
            loop: false,
            volume: volume.value,
            onload: () => {
                duration.value = currentMusic.value.duration()
                song.duration = duration.value
            },
            onplay: () => {
                isPlaying.value = true
                // 记录播放历史
                addToPlayHistory(song)
                // 定期更新播放进度
                requestAnimationFrame(updateProgress)
            },
            onpause: () => {
                isPlaying.value = false
            },
            onend: () => {
                // 播放下一首
                playNext()
            }
        })
    }

    // 更新播放进度
    const updateProgress = () => {
        if (isPlaying.value && currentMusic.value) {
            currentTime.value = currentMusic.value.seek()
            requestAnimationFrame(updateProgress)
        }
    }

    // 播放指定歌曲
    const playSong = (index) => {
        if (index < 0 || index >= playList.value.length) return
        
        // 暂停当前音乐
        if (currentMusic.value) {
            currentMusic.value.pause()
        }
        
        // 初始化新的音乐实例
        const song = playList.value[index]
        currentMusic.value = initMusic(song)
        currentSongIndex.value = index
        currentMusic.value.play()
    }

    // 播放下一首
    const playNext = () => {
        const nextIndex = (currentSongIndex.value + 1) % playList.value.length
        playSong(nextIndex)
    }

    // 播放上一首
    const playPrevious = () => {
        const prevIndex = (currentSongIndex.value - 1 + playList.value.length) % playList.value.length
        playSong(prevIndex)
    }

    // 播放/暂停
    const toggle = () => {
        if (!currentMusic.value) {
            // 播放第一首
            playSong(0)
        } else if (isPlaying.value) {
            currentMusic.value.pause()
        } else {
            currentMusic.value.play()
        }
    }

    // 调整音量
    const setVolume = (newVolume) => {
        volume.value = newVolume
        if (currentMusic.value) {
            currentMusic.value.volume(newVolume)
        }
    }

    // 调整进度
    const seek = (time) => {
        if (currentMusic.value) {
            currentMusic.value.seek(time)
            currentTime.value = time
        }
    }

    // 添加到播放列表
    const addToPlayList = (song) => {
        playList.value.push(song)
    }

    // 从播放列表移除
    const removeFromPlayList = (index) => {
        if (index === currentSongIndex.value) {
            // 如果移除的是当前播放的歌曲，暂停播放
            currentMusic.value.pause()
            currentMusic.value = null
            currentSongIndex.value = 0
        } else if (index < currentSongIndex.value) {
            // 如果移除的是当前歌曲之前的歌曲，调整当前索引
            currentSongIndex.value--
        }
        playList.value.splice(index, 1)
    }

    // 重新排序播放列表
    const reorderPlayList = (newList) => {
        playList.value = newList
        // 重新初始化当前播放的歌曲
        if (currentSongIndex.value < playList.value.length) {
            const song = playList.value[currentSongIndex.value]
            currentMusic.value = initMusic(song)
            currentMusic.value.play()
        }
    }

    // 记录播放历史
    const addToPlayHistory = (song) => {
        // 避免重复记录
        const existingIndex = playHistory.value.findIndex(item => item.id === song.id)
        if (existingIndex !== -1) {
            playHistory.value.splice(existingIndex, 1)
        }
        playHistory.value.unshift(song)
        // 限制历史记录长度
        if (playHistory.value.length > 20) {
            playHistory.value.pop()
        }
    }

    // 从播放历史播放
    const playFromHistory = (index) => {
        if (index < 0 || index >= playHistory.value.length) return
        const song = playHistory.value[index]
        // 检查是否在播放列表中
        const listIndex = playList.value.findIndex(item => item.id === song.id)
        if (listIndex !== -1) {
            playSong(listIndex)
        } else {
            // 添加到播放列表并播放
            addToPlayList(song)
            playSong(playList.value.length - 1)
        }
    }

    // 初始化时恢复播放状态
    const initPlayState = () => {
        // 可以从本地存储恢复播放状态
        // 这里简化处理，直接播放第一首
        playSong(0)
    }

    return {
        isPlaying,
        currentTime,
        duration,
        volume,
        currentSongIndex,
        playList,
        playHistory,
        playSong,
        playNext,
        playPrevious,
        toggle,
        setVolume,
        seek,
        addToPlayList,
        removeFromPlayList,
        reorderPlayList,
        playFromHistory,
        initPlayState
    }
})