<template>
    <div class="User-center">
        <div class="User-center-wrapper">
            <div class="close-btn" @click="goToHome">
                <el-icon>
                    <Close />
                </el-icon>
            </div>
            <el-tabs v-model="activeName" class="tabs" :class="{ 'mobile-tabs': isMobile }">
                <el-tab-pane label="用户设置" name="first">
                    <div class="account-info-wrapped">
                        <span>用户头像：</span>
                        <div class="account-info-content">
                            <el-upload class="avatar-uploader" :action="avatarUrl" :show-file-list="false"
                                :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                                <img v-if="userStore.imageUrl" :src="userStore.imageUrl" class="avatar" />
                                <el-icon v-else class="avatar-uploader-icon">
                                    <Plus />
                                </el-icon>
                            </el-upload>
                        </div>
                    </div>
                    <div class="account-info-wrapped">
                        <span>用户账号：</span>
                        <div class="account-info-content">
                            <el-input v-model="userStore.account" disabled></el-input>
                        </div>
                    </div>
                    <div class="account-info-wrapped">
                        <span>用户密码：</span>
                        <div class="account-info-content">
                            <el-button @click="openChangePassword">修改密码</el-button>
                        </div>
                    </div>
                    <div class="account-info-wrapped">
                        <span>用户昵称：</span>
                        <div class="account-info-content">
                            <el-input v-model="userStore.name"></el-input>
                        </div>
                        <div class="account-save-button">
                            <el-button @click="saveName">保存</el-button>
                        </div>
                    </div>
                    <div class="account-info-wrapped">
                        <span>用户性别：</span>
                        <div class="account-info-content">
                            <el-select v-model="userStore.sex">
                                <el-option label="男" value="男" />
                                <el-option label="女" value="女" />
                            </el-select>
                        </div>
                        <div class="account-save-button">
                            <el-button @click="saveSex">保存</el-button>
                        </div>
                    </div>
                    <div class="account-info-wrapped">
                        <span>用户邮箱：</span>
                        <div class="account-info-content">
                            <el-input v-model="userStore.email"></el-input>
                        </div>
                        <div class="account-save-button">
                            <el-button @click="saveEmail">保存</el-button>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="旅行日志" name="second">Config</el-tab-pane>
                <el-tab-pane label="出行提醒" name="third">Role</el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script setup>
import { Plus, Close } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/UserStore'

const userStore = useUserStore()
console.log(userStore)

const router = useRouter()

const activeName = ref('first')
const isMobile = ref(false)

const goToHome = () => {
    router.push('/home')
}

const checkScreenSize = () => {
    isMobile.value = window.innerWidth <= 767
}

const avatarUrl = ref(`${import.meta.env.VITE_API_BASEURL}/user/uploadAvatar`)
const handleAvatarSuccess = (
    response,
    uploadFile
) => {

}
const beforeAvatarUpload = (rawFile) => {
    if (rawFile.type !== 'image/jpeg') {
        ElMessage.error('头像图片必须是 JPG 格式!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('头像图片大小不能超过 2MB!')
        return false
    }
    return true
}


const openChangePassword = () => {
    // 打开修改密码对话框
}

const saveName = () => {
    // 保存昵称
}

const saveSex = () => {
    // 保存性别
}

const saveEmail = () => {
    // 保存邮箱
}

onMounted(() => {
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
})
</script>

<style lang="scss" scoped>
.avatar-uploader .avatar {
    display: block;
}

//公共
.User-center {
    height: 100vh;
    width: 100vw;
    background: linear-gradient(135deg,
            #b0e0e6 0%,
            #80deea 100%);
    display: flex;
    align-items: center;
    justify-content: center;

    .User-center-wrapper {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        overflow: hidden;
        position: relative;

        .close-btn {
            position: absolute;
            top: 12px;
            right: 15px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 10;
            transition: all 0.3s ease;

            .el-icon {
                font-size: 20px;
                color: #606266;

                &:hover {
                    color: orange;
                }
            }

            &:hover {
                background: rgba(0, 0, 0, 0.15);
                transform: scale(1.2);
            }
        }

        .tabs {
            height: 100%;

            :deep(.el-tabs__header) {
                margin-bottom: 0;

                .el-tabs__nav {
                    display: flex;
                    width: 100%;

                    .el-tabs__item {
                        flex: 1;
                        text-align: center;
                        justify-content: center;
                    }
                }
            }

            :deep(.el-tabs__content) {
                padding: 20px;
                height: calc(100% - 40px);
                overflow-y: auto;
            }

            .account-info-wrapped {
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                padding: 10px 0;

                span {
                    width: 100px;
                    font-weight: 500;
                    color: rgb(81, 100, 115);
                }

                .account-info-content {
                    flex: 1;
                    display: flex;
                    align-items: center;

                    .avatar-uploader {
                        .avatar-uploader-trigger {
                            width: 80px;
                            height: 80px;
                            border: 1px dashed #d9d9d9;
                            border-radius: 6px;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background-color: #f5f7fa;

                            &:hover {
                                border-color: #409eff;
                            }

                            .el-icon {
                                font-size: 24px;
                                color: #8c939d;
                            }
                        }
                    }
                }

                .account-save-button {
                    margin-left: 15px;

                    .el-button {
                        color: #fff;

                        &:hover {
                            color: black;
                        }

                    }
                }
            }
        }

        .mobile-tabs {
            :deep(.el-tabs__header) {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: white;
                z-index: 1000;
                margin: 0;
                padding: 0 10px;
                box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
            }

            :deep(.el-tabs__nav-wrap) {
                &::after {
                    display: none;
                }
            }

            :deep(.el-tabs__nav) {
                display: flex;
                width: 100%;
                justify-content: space-around;
            }

            :deep(.el-tabs__item) {
                flex: 1;
                text-align: center;
                padding: 12px 0;
            }

            :deep(.el-tabs__content) {
                padding-bottom: 60px;
                /* 为底部标签栏留出空间 */
                height: calc(100vh - 60px);
            }
        }
    }
}

//手机
@media (max-width: 767px) {
    .User-center {
        .User-center-wrapper {
            width: 100vw;
            height: 100vh;
            border-radius: 0;
            background: rgba(255, 255, 255, 0.98);

            .close-btn {
                top: 10px;
                right: 10px;
                width: 36px;
                height: 36px;

                .el-icon {
                    font-size: 18px;
                }
            }

            .tabs {
                :deep(.el-tabs__content) {
                    padding: 15px;
                }

                .account-info-wrapped {
                    flex-direction: column;
                    align-items: flex-start;
                    margin-bottom: 15px;

                    span {
                        width: 100%;
                        margin-bottom: 8px;
                        font-size: 14px;
                    }

                    .account-info-content {
                        width: 100%;
                        margin-bottom: 8px;
                    }

                    .account-save-button {
                        display: flex;
                        margin-left: 0;
                        width: 100%;
                        justify-content: center;

                        .el-button {
                            width: 50%;
                            margin-top: 5px;
                            background-color: #b0e0e6;
                            border-radius: 20px;
                        }
                    }
                }
            }
        }
    }
}

//平板
@media (min-width: 768px) and (max-width: 1024px) {
    .User-center {
        .User-center-wrapper {
            width: 85vw;
            height: 85vh;
            max-width: 800px;

            .tabs {
                :deep(.el-tabs__content) {
                    padding: 25px;
                }

                .account-info-wrapped {
                    margin-bottom: 25px;

                    span {
                        width: 120px;
                        font-size: 16px;
                    }

                    .account-save-button {
                        .el-button {
                            background-color: #b0e0e6;
                            border-radius: 20px;
                        }
                    }
                }
            }
        }
    }
}

//桌面
@media (min-width: 1024px) {
    .User-center {
        .User-center-wrapper {
            width: 70vw;
            height: 85vh;
            max-width: 1000px;

            .tabs {
                :deep(.el-tabs__content) {
                    padding: 30px;
                }

                .account-info-wrapped {
                    margin-bottom: 25px;

                    span {
                        width: 120px;
                        font-size: 16px;
                    }

                    .account-save-button {
                        .el-button {
                            background-color: #b0e0e6;
                            border-radius: 20px;
                        }
                    }

                    .account-info-content {
                        .avatar-uploader {
                            .avatar-uploader-trigger {
                                transition: all 0.3s ease;

                                &:hover {
                                    transform: scale(1.05);
                                    border-color: #409eff;
                                }
                            }
                        }
                    }

                    .account-save-button {
                        .el-button {
                            transition: all 0.3s ease;

                            &:hover {
                                transform: translateY(-2px);
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    text-align: center;
}
</style>