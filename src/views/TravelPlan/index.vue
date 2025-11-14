<template>
    <div class="trip-container">
        <header class="trip-header-wrapper">
            <div class="trip-header">
                <div class="trip-header-nav-wrapper">
                    <div class="trip-logo">
                        <img src="@/assets/vue.svg" alt="">
                    </div>
                    <div class="trip-nav">
                        <span class="nav-span">全国各地</span>
                        <span class="nav-span">旅行助手</span>
                    </div>
                </div>
                <div class="trip-header-user-wrapper">
                    <span class="login">登录/注册</span>
                </div>
            </div>
        </header>
        <div class="content">
            <div class="content-header">
                <img src="@/assets/images/breadcrumb.png" alt="">
                <span class="header_desc">世界那么大，我想去看看</span>
            </div>
            <div class="banner">
                <div class="banner-wrapper">
                    <div class="title">
                        轻轻松松搞定
                        <span class="sub">你的攻略</span>
                    </div>
                    <div class="banner-desc">
                        让你再也不必为旅行规划而烦恼
                    </div>
                    <div class="button">
                        <el-button>
                            <span class="btn-desc">创建新的行程</span>
                            <template #icon>
                                <el-icon style="margin-right: 4px;">
                                    <Position />
                                </el-icon>
                            </template>
                        </el-button>
                    </div>
                    <div class="list">
                        <a href="https://zhuanlan.zhihu.com/p/32854215834" target="_blank" class="item">
                            <div class="list-title">
                                全国景点推荐
                            </div>
                            <div class="list-sub">
                                全国名胜景点大推荐
                            </div>
                            <img src="@/assets/images/view.svg" alt="">
                        </a>
                        <a href="Booking.com" target="_blank" class="item">
                            <div class="list-title">
                                全国酒店信息
                            </div>
                            <div class="list-sub">
                                全国酒店信息预订情况
                            </div>
                            <img src="@/assets/images/booking.jpg" alt="">
                        </a>
                        <a href="https://www.12306.cn/index/" target="_blank" class="item">
                            <div class="list-title">
                                全国车票情况
                            </div>
                            <div class="list-sub">
                                全国车票购买情况和预订
                            </div>
                            <img src="@/assets/images/plane.jpg" alt="">
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <footer class="trip-footer-wrapper">
            <div class="trip-footer">
                <div class="trip-footer-nav-wrapper">
                    <div class="footer-nav">
                        <span class="footer-nav-list">联系我们</span>
                        <span class="footer-nav-list">合作伙伴</span>
                        <span class="footer-nav-list">用户协议</span>
                        <span class="footer-nav-list">隐私协议</span>
                    </div>
                    <div class="desc">Homfay出品</div>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { Position } from '@element-plus/icons-vue'

</script>

<style lang="scss" scoped>
.trip-container {
    display: flex;
    flex-direction: column;
    background: #e8e8d8;
    min-height: 100vh;

    .trip-header-wrapper {
        position: fixed;
        z-index: 1000;
        width: 100%;
        background: #80deea;

        .trip-header {
            display: flex;
            justify-content: space-between;

            .trip-header-nav-wrapper {
                display: flex;
                justify-content: center;
                align-items: center;

                img {
                    width: 30px;
                    height: 30px;
                    cursor: pointer;
                }

                .trip-nav {

                    //.nav-span:first-child {
                    //    margin-right: 20px;
                    //}
                    //.nav-span+.nav-span {
                    //    margin-left: 20px;
                    //}
                    .nav-span {
                        margin-left: 20px;
                        font-size: 15px;
                        font-weight: 600;
                        color: aliceblue;
                        cursor: pointer;

                        &:hover {
                            color: yellow;
                        }
                    }
                }
            }

            .trip-header-user-wrapper {
                display: flex;
                justify-content: center;
                align-items: center;

                .login {
                    margin-right: 10px;
                    font-size: 15px;
                    font-weight: 600;
                    color: aliceblue;
                    cursor: pointer;

                    &:hover {
                        color: yellow;
                    }
                }
            }
        }
    }

    .content {
        flex: 1;

        .content-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }

    .trip-footer-wrapper {
        width: 100%;
        height: 50px;
        display: flex;
        flex-direction: column;
        background: #80deea;
        justify-content: center;
        align-items: center;

        .footer-nav {
            .footer-nav-list {
                color: aliceblue;
                margin: 0 40px;
                cursor: pointer;

                &:hover {
                    color: yellow;
                }
            }
        }

        .desc {
            font-size: 12px;
            text-align: center;
            color: aliceblue;
        }
    }

}

/* 手机样式 */
@media (max-width: 767px) {
    .trip-container {
        .trip-header-wrapper {
            .trip-header {
                height: 50px;
                padding: 0 15px;

                .trip-header-nav-wrapper {
                    gap: 15px;

                    img {
                        width: 30px;
                        height: 30px;
                    }

                    .trip-nav {
                        gap: 15px;

                        .nav-span {
                            font-size: 14px;
                            padding: 6px 10px;
                        }
                    }
                }

                .trip-header-user-wrapper {
                    .login {
                        font-size: 14px;
                        padding: 6px 12px;
                    }
                }
            }
        }

        .content {
            padding-top: 50px;

            img {
                margin-right: 2%;
                height: 40px;
                margin-left: 5%;
            }

            .content-header {
                margin-right: 1%;
                font-size: 8px;
                font-weight: 400;
            }
        }

        .trip-footer-wrapper {
            .trip-footer {
                padding: 0 15px;

                .trip-footer-nav-wrapper {
                    .footer-nav {
                        margin-bottom: 5px;

                        .footer-nav-list {
                            margin: 0 10px;
                            font-size: 13px;
                        }
                    }
                }
            }
        }
    }
}

/* 平板样式 */
@media (min-width: 768px) and (max-width: 1024px) {
    .trip-container {
        .trip-header-wrapper {
            .trip-header {
                padding: 0 30px;
                height: 40px;
            }
        }

        .content {
            padding-top: 40px;

            img {
                height: 40px;
                margin-left: 6%;
            }

            .content-header {
                font-size: 12px;
                font-weight: 400;
                margin-right: 3%;
            }
        }

        .trip-footer-wrapper {
            .trip-footer {
                padding: 0 30px;
            }
        }
    }
}

/* 桌面样式 */
@media (min-width: 1024px) {
    .trip-container {
        .trip-header-wrapper {
            .trip-header {
                padding: 0 40px;
            }
        }

        .content {
            padding-top: 34px;

            img {
                height: 40px;
                margin-left: 10%;
            }

            .content-header {
                margin-right: 3%;
                font-size: 12px;
                font-weight: 400;
            }

            .banner {
                width: 85vw;
                height: 50vh;
                background-image: url('@/assets/images/Banner.png');
                background-size: cover;
                margin: 0 auto;

                .banner-wrapper {
                    .title {
                        font-size: 28px;
                        font-weight: 600;
                        color: #fff;

                        .sub {
                            font-size: 28px;
                            font-weight: 400;
                            color: #fff;
                        }
                    }

                    .banner-desc {
                        margin-top: 4px;
                        font-size: 18px;
                        color: #fff;
                    }

                    .button {
                        .el-button {
                            width: 300px;
                            height: 50px;
                            transition: all 0.2s ease;

                            &:hover {
                                transform: translateY(-2px);
                            }

                            .btn-desc {
                                color: #375c48;
                                font-size: 18px;
                                font-weight: 600;
                                transition: all 0.2s ease;

                                &:hover {
                                    color: #80deea;
                                }
                            }
                        }
                    }

                    .list {
                        display: flex;
                        gap: 40px;
                        margin-top: 60px;
                        justify-content: center;

                        .item {
                            width: 360px;
                            height: 90px;
                            text-decoration: none;
                            background: linear-gradient(180deg, #fff, #d8f2e4);
                            box-shadow: 0 10px 20px rgba(116, 129, 52, 0.5);
                            border-radius: 8px;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            position: relative;
                            //align-items: center;

                            .list-title {
                                font-size: 16px;
                                font-weight: 600;
                                color: #375c48;
                                line-height: 16px;
                                margin-left: 30px;
                            }

                            .list-sub {
                                margin-top: 10px;
                                font-size: 12px;
                                color: #3abd79;
                                line-height: 12px;
                                margin-left: 30px;
                            }

                            img {
                                position: absolute;
                                top: 13px;
                                right: 30px;
                                width: 64px;
                                height: 64px;
                                object-fit: contain;
                            }

                        }
                    }
                }

            }

        }

        .trip-footer-wrapper {
            .trip-footer {
                padding: 0 40px;
            }
        }
    }
}
</style>