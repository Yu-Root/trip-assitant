<template>
    <div class="home-container">
        <div class="music-control" @click="toggleMusic">
            <svg v-if="!MusicPlaying" t="1762656853788" viewBox="0 0 1024 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="6438" width="30" height="30">
                <path
                    d="M170.666667 
                298.666667l85.162666-0.213334L455.253333 139.093333q31.914667-20.906667 
                65.493334-2.730666 33.578667 18.133333 34.048 56.32v638.677333q0 38.144-33.536 
                56.32-33.578667 18.133333-65.493334-2.773333l-199.466666-158.976-85.162667 
                0.256q-35.370667 0-60.330667-25.002667-25.002667-25.002667-25.514666-60.330667V384q0-35.328 
                25.002666-60.330667Q135.338667 298.709333 170.666667 298.666667z m110.592 85.12L170.666667 
                384l0.512 256.853333 110.592-0.256 187.733333 151.338667-0.512-559.829333-187.733333 
                151.68z m403.541333-42.709334a42.666667 42.666667 0 1 0-60.330667 60.330667l90.496 
                90.496-90.453333 90.538667a42.666667 42.666667 0 0 0 60.288 60.330666l90.538667-90.538666 90.496 90.538666a42.666667 42.666667 0 0 0 60.330666-60.330666l-90.496-90.538667 90.496-90.496a42.666667 42.666667 0 0 0-60.330666-60.330667l-90.496 90.496-90.538667-90.496z"
                    p-id="6439"></path>
            </svg>
            <svg v-else t="1762657089869" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="8347" width="30" height="30">
                <path d="M872.802928 755.99406 872.864326 755.99406 872.864326 755.624646Z" fill="#272536" p-id="8348">
                </path>
                <path
                    d="M744.055658 192.799074c-4.814656-2.889817-9.601682-5.251607-15.442714-5.251607-14.262842 0-25.758664 11.559267-25.758664 25.805736 0 10.285251 6.088672 18.519796 14.6957 23.195282 94.679359 55.247278 158.344355 157.787676 158.344355 275.30416 0 117.424386-63.605643 219.931015-158.159136 275.18034-8.29492 4.538363-15.442714 13.050224-15.442714 23.583115 0 14.261818 11.559267 25.820062 25.791409 25.820062 5.716188 0 10.252505-2.202155 15.22475-5.063319 109.871363-64.133669 183.764304-183.143157 183.764304-319.520197C927.074995 375.785665 853.495186 257.010515 744.055658 192.799074z"
                    fill="#272536" p-id="8349"></path>
                <path
                    d="M773.946432 511.867994c0-79.96524-43.344181-149.739373-107.821681-187.289594-2.920516-1.52268-9.785877-4.520967-14.603603-4.520967-14.325263 0-25.914206 11.589966-25.914206 25.89988 0 9.616008 5.096065 18.176988 12.865006 22.666232 49.839105 28.307719 83.45983 81.829703 83.45983 143.244448 0 62.472843-34.801621 116.817566-86.070284 144.750755-7.457856 4.538363-12.397355 12.803607-12.397355 22.188348 0 14.325263 11.588943 25.943882 25.882484 25.943882 6.090718 0.031722 13.33061-3.542686 13.33061-3.542686C729.048873 664.171772 773.946432 593.294514 773.946432 511.867994z"
                    fill="#272536" p-id="8350"></path>
                <path
                    d="M541.3694 124.672464c-10.846022-5.219885-23.740704-3.790326-33.215496 3.712555-0.435928 0.358157-46.423309 36.914748-97.195669 74.296123-88.308255 65.081251-114.036219 75.925227-119.257128 77.649498l-110.6194 0c-0.63752 0-1.243317 0.062422-1.879813 0.093121l-56.504922 0c-14.231119 0-25.775037 11.543917-25.775037 25.775037l0 411.697573c0 14.261818 11.512195 25.761734 25.775037 25.761734l189.511191 0.027629c5.096065 1.865487 29.395494 13.0799 107.761306 76.999698 45.613874 37.162388 86.505189 73.485665 86.940095 73.829496 5.841032 5.218862 13.298887 7.92039 20.820188 7.92039 4.349051 0 8.729825-0.930185 12.862959-2.764973 11.277858-5.064342 18.517749-16.252149 18.517749-28.619828 0 0 0.031722-97.257068 0.031722-132.212184 0.808412-2.484587 1.213641-5.127787 1.213641-7.863085 0-2.792603-1.245364-578.026786-1.245364-578.026786C559.110459 140.892891 552.214399 129.924071 541.3694 124.672464zM508.308423 726.470653c0 1.494027-0.467651 94.617961-0.467651 94.617961-13.889335-11.745509-29.332049-24.64019-45.240367-37.507242-104.59008-84.702124-130.505309-91.816149-148.030451-91.816149-0.372483 0-0.683569 0.091074-1.025353 0.091074s-0.652869-0.091074-1.025353-0.091074L170.394297 691.765223c-18.037818 0-22.248723-5.128811-22.248723-23.246447L148.145573 352.559685c0-12.32163 1.461281-20.057825 16.298198-20.057825l128.065747 0c17.090237 0 43.315528-6.991228 157.787676-90.839915 20.383236-14.914688 40.330544-29.938869 57.544601-43.113937 0 0 0.373507 445.207781 0.467651 521.368368C507.779374 722.028481 508.308423 724.234729 508.308423 726.470653z"
                    fill="#272536" p-id="8351"></path>
            </svg>
        </div>
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
import { User, Location, } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useMusicStore } from '@/stores/MusicStore';

const MusicStore = useMusicStore()
const MusicPlaying = ref(true)
const toggleMusic = () => {
    MusicPlaying.value = !MusicPlaying.value
    MusicStore.toggle()
}

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
    overflow: hidden;
    position: relative
}

.music-control {
    position: fixed;
    top: 20px;
    right: 20px;
    display: flex;
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
        width: 160px;
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