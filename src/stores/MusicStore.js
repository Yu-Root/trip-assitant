import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { Howl } from "howler";

import homeMusic from '@/assets/audios/musics/Home.mp3'

export const useMusicStore = defineStore('Music', () => {
    const isPlaying = ref(false)

    const music_controller = reactive({
        home_music: new Howl({
            src: homeMusic,
            preload: true,
            loop: true,
        })
    })

    const play = () => {
        music_controller.home_music.play()
        isPlaying.value = true
    }

    const pause = () => {
        music_controller.home_music.pause()
        isPlaying.value = false
    }

    const toggle = () => {
        if (isPlaying.value) {
            pause()
        } else {
            play()
        }
    }

    const playAfterInteraction = () => {
        if (!isPlaying.value) {
            play()
        }
    }

    return {
        isPlaying,
        music_controller,
        play,
        pause,
        toggle,
        playAfterInteraction,
    }
})