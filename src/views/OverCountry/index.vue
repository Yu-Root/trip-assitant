<template>
    <div class="container">
        <div class="header">
            <h1><i class="fas fa-map-marked-alt"></i> 城市景点探索</h1>
            <p>输入国内城市名称，通过高德地图API获取当地著名旅游景点信息</p>
            <div class="popular-cities">
                <div v-for="city in popularCities" :key="city" class="popular-city" @click="selectPopularCity(city)">
                    {{ city }}
                </div>
            </div>
        </div>

        <div class="search-box">
            <div class="search-form">
                <div class="form-group">
                    <label for="city-input">请输入国内城市名称：</label>
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
            </div>
        </div>

        <div class="loader" v-show="loading">
            <div class="spinner"></div>
            <p>正在通过高德地图API搜索景点信息，请稍候...</p>
        </div>

        <div class="no-results" v-show="!loading && attractions.length === 0 && hasSearched">
            <h2><i class="fas fa-exclamation-triangle"></i> 未找到景点信息</h2>
            <p>请尝试输入其他城市名称或检查输入是否正确</p>
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

        <div class="footer">
            <p>© 2023 城市景点探索系统 | 数据来源于高德地图API</p>
            <div class="api-status">
                <span class="status-dot"></span>
                <span>高德地图API状态: <strong>已连接</strong></span>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
    name: 'CityAttractions',
    setup() {
        // 高德地图API配置
        const apiKey = "d6252339014b34205c7ab52961b96dd1"
        const apiEndpoint = "https://restapi.amap.com/v3/place/text"

        // 响应式数据
        const currentCity = ref('')
        const attractions = ref([])
        const loading = ref(false)
        const hasSearched = ref(false)

        // 热门城市列表
        const popularCities = ['北京', '上海', '杭州', '成都', '西安']

        // 搜索景点
        const searchAttractions = async () => {
            const city = currentCity.value.trim()
            if (!city) return

            loading.value = true
            attractions.value = []
            hasSearched.value = true

            try {
                const params = new URLSearchParams({
                    key: apiKey,
                    keywords: "景点",
                    city: city,
                    types: "风景名胜",
                    offset: 20,
                    page: 1,
                    extensions: "all",
                    output: "JSON"
                })

                const url = `${apiEndpoint}?${params.toString()}`
                const response = await fetch(url)
                const data = await response.json()

                if (data.status === "1" && data.pois && data.pois.length > 0) {
                    attractions.value = data.pois
                }
            } catch (error) {
                console.error("API请求失败:", error)
            } finally {
                loading.value = false
            }
        }

        // 选择热门城市
        const selectPopularCity = (city) => {
            currentCity.value = city
            searchAttractions()
        }

        // 获取景点图片样式
        const getImageStyle = (attraction) => {
            if (attraction.photos && attraction.photos.length > 0) {
                return `background-image: url(${attraction.photos[0].url})`
            }
            return 'background: linear-gradient(to right, #4b6cb7, #182848)'
        }

        // 获取景点类型
        const getType = (attraction) => {
            return attraction.type ? attraction.type.split(";")[0] : "风景名胜"
        }

        // 页面加载时默认搜索北京
        onMounted(() => {
            currentCity.value = "北京"
            searchAttractions()
        })

        return {
            currentCity,
            attractions,
            loading,
            hasSearched,
            popularCities,
            searchAttractions,
            selectPopularCity,
            getImageStyle,
            getType
        }
    }
}
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

body {
    background: linear-gradient(135deg, #1a2980, #26d0ce);
    background-size: 400% 400%;
    animation: gradientBG 15s ease infinite;
    color: #333;
    min-height: 100vh;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}

@keyframes gradientBG {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

.container {
    max-width: 1200px;
    width: 100%;
    padding: 40px 20px;
}

.header {
    text-align: center;
    margin-bottom: 40px;
    color: white;
    animation: fadeInDown 1s ease;
}

.header h1 {
    font-size: 3.5rem;
    margin-bottom: 10px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.header p {
    font-size: 1.2rem;
    max-width: 600px;
    margin: 0 auto;
    opacity: 0.9;
}

.search-box {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 15px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    padding: 40px;
    margin-bottom: 30px;
    animation: fadeInUp 1s ease;
}

.search-form {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.form-group {
    margin-bottom: 25px;
    width: 100%;
    max-width: 700px;
}

.form-group label {
    display: block;
    margin-bottom: 10px;
    font-size: 1.2rem;
    color: #444;
    font-weight: 500;
}

.input-group {
    display: flex;
    border-radius: 50px;
    overflow: hidden;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
    width: 100%;
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
    background: linear-gradient(to right, #FF416C, #FF4B2B);
    color: white;
    border: none;
    padding: 0 45px;
    font-size: 1.2rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.input-group button:hover {
    background: linear-gradient(to right, #e53935, #e35d5b);
    transform: translateY(-2px);
}

.api-info {
    background: #e3f2fd;
    padding: 15px;
    border-radius: 10px;
    margin-top: 20px;
    text-align: center;
    font-size: 0.9rem;
}

.api-info i {
    color: #1976d2;
    margin-right: 5px;
}

.result-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
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

.popular-cities {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 15px;
    margin-top: 25px;
}

.popular-city {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    padding: 12px 25px;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    font-size: 1.1rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
}

.popular-city:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
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

@media (max-width: 768px) {
    .header h1 {
        font-size: 2.5rem;
    }

    .result-container {
        grid-template-columns: 1fr;
    }

    .input-group {
        flex-direction: column;
        border-radius: 15px;
    }

    .input-group button {
        padding: 18px;
        margin-top: 10px;
        width: 100%;
    }

    .search-box {
        padding: 25px;
    }

    .header p {
        font-size: 1rem;
    }
}

.footer {
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
    margin-top: 50px;
    font-size: 0.9rem;
    padding: 20px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
}

.api-status {
    display: inline-flex;
    align-items: center;
    background: rgba(0, 0, 0, 0.2);
    padding: 5px 15px;
    border-radius: 20px;
    margin-top: 10px;
}

.status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #4CAF50;
    margin-right: 8px;
    box-shadow: 0 0 10px #4CAF50;
}
</style>