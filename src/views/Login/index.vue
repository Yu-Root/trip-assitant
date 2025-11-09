<template>
    <el-button type="primary" round @click="Login">Primary</el-button>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router';
import { useMusicStore } from '@/stores/MusicStore';

const MusicStore = useMusicStore()
const handleUserInteraction = () => {
    MusicStore.playAfterInteraction()
}

const router = useRouter()
const Login = () => {
    router.push('/home')
}

onMounted(() => {
    document.addEventListener('click', handleUserInteraction, { once: true })
})
onUnmounted(() => {
    document.removeEventListener('click', handleUserInteraction)
})
</script>

<style lang="scss" scoped></style>