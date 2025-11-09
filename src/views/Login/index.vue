<template>
    <div class="login-container">
        <el-card class="login-card">
            <template #header>
                <h1 class="login-title">登录</h1>
            </template>
            <el-form :model="loginForm" class="login-form">
                <el-form-item>
                    <el-input placeholder="使用邮箱或者手机号">
                        <template #prefix>
                            <el-icon>
                                <User />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-input placeholder="输入密码">
                        <template #prefix>
                            <el-icon>
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" round class="login-btn" @click="Login">Primary</el-button>
            <el-divider class="custom-divider">
                <span class="divider-text">其他方式登录</span>
            </el-divider>
            <div class="other-login-wrapper">
                <el-button class="other-login-item">
                    <img src="@/assets/images/Phone.png" alt="微信登录">
                </el-button>
                <el-button class="other-login-item">
                    <img src="@/assets/images/WeChat.png" alt="微信登录">
                </el-button>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { useMusicStore } from '@/stores/MusicStore';

const MusicStore = useMusicStore()

const router = useRouter()

const Login = () => {

    router.push('/home')
    MusicStore.playAfterInteraction()
}
</script>

<style lang="scss" scoped>
.other-login-item {
    width: 60px;
    height: 60px;
}

.other-login-item img {
    width: 100%;
    height: 100%;
}

.login-btn {
    border-radius: 40px;
    width: 80px;
    height: 50px;
    font-size: 16px;
    align-items: center;
    justify-content: center;
}
</style>