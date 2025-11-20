<template>
    <div class="container">
        <Nav></Nav>
        <div class="header">
            <h1><i class="fas fa-map-marked-alt"></i> 城市景点探索</h1>
            <div class="popular-cities">
                <div v-for="city in popularCities" :key="city" class="popular-city" @click="selectPopularCity(city)">
                    {{ city }}
                </div>
            </div>

            <div class="search-box">
                <div class="search-form">
                    <div class="form-group">
                        <p class="label">请输入国内城市名称：</p>
                        <div class="input-group">
                            <input type="text" id="city-input" v-model="currentCity" placeholder="例如：北京、上海、广州..."
                                @keypress.enter="searchAttractions">
                            <button id="search-btn" @click="searchAttractions">
                                <i class="fas fa-search"></i> 搜索景点
                            </button>
                        </div>
                    </div>
                    <div class="api-info">
                        <i class="fas fa-info-circle"></i>系统基于高德地图API构建，实时获取城市景点信息
                    </div>

                    <div class="loader" v-show="loading">
                        <div class="spinner"></div>
                        <p>正在通过高德地图API搜索景点信息，请稍候...</p>
                    </div>

                    <div class="no-results" v-show="!loading && attractions.length === 0 && hasSearched">
                        <h2><i class="fas fa-exclamation-triangle"></i> 未找到景点信息</h2>
                        <p>请尝试输入其他城市名称或检查输入是否正确</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Nav from '@/components/Nav/index.vue'
import { CityAttractions } from '@/views/OverCountry/Method/CityAttractions'

const {
    currentCity,
    attractions,
    loading,
    hasSearched,
    popularCities,
    searchAttractions,
    selectPopularCity
} = CityAttractions()
</script>


<style scoped lang="scss">
.container {
    background: #F5FFFA;
    width: 100vw;
    height: 100vh;
}

.header {
    padding-top: 100px;
    text-align: center;

    .popular-cities {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;

        .popular-city {
            margin-top: 20px;
            background: #b0e0e6;
            width: 100px;
            height: 40px;
            border-radius: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            transition: all 0.3s ease;

            &:hover {
                cursor: pointer;
                transform: translateY(-3px);
            }
        }
    }
}

.search-box {

    .form-group {
        //border: 1px solid red;

        .label {
            font-weight: 600;
            font-size: 20px;
            margin-top: 40px;
            margin-bottom: 20px;
        }
    }

}
</style>
