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

            <div class="result-container" id="results">
                <div v-for="(attraction, index) in attractions" :key="attraction.id"
                    :class="`attraction-card delay-${index % 5}`">
                    <div class="attraction-image" :style="getImageStyle(attraction)">
                        <div class="attraction-name">{{ attraction.name }}</div>
                    </div>
                    <div class="attraction-info">
                        <div class="info-row">
                            <i class="fas fa-map-marker-alt"></i>
                            <p>{{ attraction.address || "地址信息未提供" }}</p>
                        </div>
                        <div class="info-row">
                            <i class="fas fa-tag"></i>
                            <p>类型: {{ getType(attraction) }}</p>
                        </div>
                        <div class="info-row">
                            <i class="fas fa-phone"></i>
                            <p>电话: {{ attraction.tel || "暂无信息" }}</p>
                        </div>
                        <div class="tags">
                            <span class="tag">{{ currentCity }}</span>
                            <span class="tag">评分: {{ attraction.importance || "4.0" }}</span>
                            <span class="tag">{{ getType(attraction) }}</span>
                        </div>
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
    selectPopularCity,
    getImageStyle,
    getType
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
            color: white;
            padding: 12px 25px;
            border-radius: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            transition: all 0.3s ease;
            font-size: 1.1rem;
            border: 2px solid rgba(255, 255, 255, 0.3);
            cursor: pointer;

            &:hover {
                background: rgba(206, 203, 40, 0.3);
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
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

        .input-group {
            display: flex;
            border-radius: 50px;
            overflow: hidden;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
            width: 60%;
            margin: 0 auto;
        }

        .input-group input {
            flex: 1;
            padding: 18px 25px;
            border: none;
            font-size: 1.2rem;
            outline: none;
            transition: all 0.3s ease;
        }

        .input-group input:focus {
            background-color: #f8f9fa;
        }

        .input-group button {
            background: linear-gradient(135deg, #b0e0e6 0%, #80deea 100%);
            color: white;
            border: none;
            padding: 0 45px;
            font-size: 1.2rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .input-group button:hover {
            background: yellow;
            color: black;
            transform: translateY(-2px);
        }
    }

    .api-info {
        background: #e3f2fd;
        padding: 15px;
        border-radius: 50px;
        margin-top: 20px;
        text-align: center;
        font-size: 0.9rem;
        display: inline-block;
    }

    .api-info i {
        color: #1976d2;
        margin-right: 5px;
    }

}

.result-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 30px;
    margin-top: 40px;
}


.attraction-card {
    background: white;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.5s ease forwards;
}

.attraction-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.attraction-image {
    height: 220px;
    background-size: cover;
    background-position: center;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #4b6cb7;
}

.attraction-name {
    position: absolute;
    bottom: 0;
    width: 100%;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
    color: white;
    padding: 20px;
    font-size: 1.5rem;
    font-weight: 700;
}

.attraction-info {
    padding: 25px;
}

.attraction-info p {
    margin: 15px 0;
    line-height: 1.7;
    color: #555;
    font-size: 1rem;
}

.info-row {
    display: flex;
    align-items: center;
    margin: 10px 0;
}

.info-row i {
    color: #4b6cb7;
    width: 25px;
    font-size: 1.1rem;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    margin-top: 15px;
}

.tag {
    background: #e3f2fd;
    color: #1976d2;
    padding: 6px 15px;
    border-radius: 20px;
    font-size: 0.9rem;
    margin-right: 8px;
    margin-bottom: 8px;
    font-weight: 500;
}

.loader {
    text-align: center;
    padding: 80px 40px;
}

.loader .spinner {
    width: 60px;
    height: 60px;
    border: 5px solid rgba(26, 41, 128, 0.2);
    border-radius: 50%;
    border-top: 5px solid #1a2980;
    animation: spin 1s linear infinite;
    margin: 0 auto 30px;
}

.no-results {
    text-align: center;
    grid-column: 1 / -1;
    padding: 80px 40px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 15px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}


@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.delay-1 {
    animation-delay: 0.1s;
}

.delay-2 {
    animation-delay: 0.2s;
}

.delay-3 {
    animation-delay: 0.3s;
}

.delay-4 {
    animation-delay: 0.4s;
}

.delay-5 {
    animation-delay: 0.5s;
}
</style>
