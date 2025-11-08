<template>
    <div class="home-container">
        <div class="cards-wrapper">
            <div class="square-item" @click="GoToPage('/user')">
                <div class="square-content">
                    <el-icon size="60px">
                        <User />
                    </el-icon>
                    <span class="square-text">个人中心</span>
                </div>
            </div>
            <div class="square-item" @click="GoToPage('/trip')">
                <div class="square-content">
                    <el-icon size="60px">
                        <Location />
                    </el-icon>
                    <span class="square-text">旅行规划</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { User, Location } from '@element-plus/icons-vue'

const router = useRouter()
const GoToPage = (path) => {
    router.push(path)
}
</script>

<style lang="scss" scoped>
.home-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: black;
}

.cards-wrapper {
    display: flex;
    gap: 200px;
    flex-wrap: wrap;
    justify-content: center;
}

.square-item {
    width: 250px;
    height: 250px;
    background-color: white;
    border-radius: 15px;
    box-shadow: 0px 0px 12px 5px rgba(184, 184, 197, 0.974);
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    justify-content: center;
    align-items: center;
}
.square-item:hover {
    transform: translateY(-5px);
    box-shadow: 0px 0px 20px 0 rgba(249, 249, 249, 0.997);
}

.square-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.square-text {
    margin-top: 20px;
    font-size: 1.5em;
    font-weight: bold;
    color: #333;
}
</style>