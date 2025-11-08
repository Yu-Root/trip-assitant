<template>
    <div class="home-container">
        <div class="background-section cyan-bg">
            <div class="square-item white-card" @click="GoToPage('/user')">
                <div class="square-content">
                    <el-icon size="60px">
                        <User />
                    </el-icon>
                    <span class="square-text">个人中心</span>
                </div>
            </div>
        </div>
        <div class="background-section white-bg">
            <div class="square-item cyan-card" @click="GoToPage('/travel_plan')">
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
    overflow: hidden;
}

.background-section {
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.cyan-bg {
    //background-color: #80deea;
    background: linear-gradient(135deg,
            #b0e0e6 0%,
            #80deea 100%);
}

.white-bg {
    //background-color: #f5f5f0;
    background: linear-gradient(135deg,
            #f5f5f0 0%,
            #e8e8d8 100%);
}

.white-card {
    //background-color: #f5f5f0;
    background: linear-gradient(135deg,
            #f5f5f0 0%,
            #e8e8d8 100%);
}

.cyan-card {
    //background-color: #80deea;
    background: linear-gradient(135deg,
            #b0e0e6 0%,
            #80deea 100%);
}

//.cards-wrapper {
//    display: flex;
//    gap: 200px;
//    flex-wrap: wrap;
//    justify-content: center;
//}

.square-item {
    width: 250px;
    height: 250px;
    border-radius: 15px;
    box-shadow: 0px 0px 12px 2px rgba(0, 0, 0, 0.5);
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    justify-content: center;
    align-items: center;
}

.square-item:hover {
    transform: translateY(-5px);
    box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.8)
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

/*响应式设计 - 媒体查询*/

/*平板竖屏和手机*/
@media (max-width: 1024px) {
    .home-container {
        flex-direction: column;
    }

    .background-section {
        flex: none;
        height: 50vh;
        width: 100%;
    }

    .square-item {
        width: 200px;
        height: 200px;
    }

    .white-card .square-content .el-icon,
    .cyan-card .square-content .el-icon {
        font-size: 50px;
    }

    .square-text {
        font-size: 1.3em;
    }
}

/*手机小屏幕 - 屏幕宽度小于等于768px时应用*/
@media (max-width: 768px) {
    .square-item {
        width: 16px;
        height: 160px;
    }

    .white-card .square-content .el-icon,
    .cyan-card .square-content .el-icon {
        font-size: 45px;
    }

    .square-text {
        font-size: 1.1em;
        margin-top: 15px;
    }
}

/*手机超小屏幕*/
@media (max-width: 480px) {
    .square-item {
        width: 130px;
        height: 130px;
    }

    .white-card .square-content .el-icon,
    .cyan-card .square-content .el-icon {
        font-size: 35px;
    }

    .square-text {
        font-size: 1em;
        margin-top: 10px;
    }
}

/*大屏幕*/
@media (min-width: 1025px) and (max-width: 1366px) {
    .square-item {
        width: 200px;
        height: 200px;
    }

    .white-card .square-content .el-icon,
    .cyan-card .square-content .el-icon {
        font-size: 50px;
    }
}

//针对触摸设备的优化
@media (hover: none) and (pointer: coarse) {
    .square-item:hover {
        transform: none;
    }

    .square-item:active {
        transform: scale(0.7);
    }
}
</style>