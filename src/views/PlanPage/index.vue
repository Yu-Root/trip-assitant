<template>
    <div class="Planning-Page">
        <div class="Planning-header">
            <h1><i class="fas fa-plane"></i>旅行规划</h1>
            <p>分步规划您的旅行，自动获取天气、景点、路线与预算</p>
        </div>
        <el-steps :active="currentStep - 1" align-center class="step-indicator" finish-status="success">
            <el-step title="目的地" description="设置旅行基本信息"></el-step>
            <el-step title="路线交通" description="规划路线与交通方式"></el-step>
            <el-step title="天气景点" description="查看天气与选择景点"></el-step>
            <el-step title="行程总结" description="查看完整行程规划"></el-step>
        </el-steps>
        <div class="progress-bar">
            <div class="progress" :style="{ width: `${(currentStep / totalSteps) * 100}%` }"></div>
        </div>
        <div class="step-content">
            <div v-if="currentStep === 1" class="step-1">
                <el-form :model="tripData" label-width="100px">
                    <el-form-item label="出发地">
                        <el-input v-model="tripData.origin" placeholder="如：北京">
                            <template #prefix>
                                <i class="fas fa-map-marker-alt"></i>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="目的地">
                        <el-input v-model="tripData.destination" placeholder="如：上海">
                            <template #prefix>
                                <i class="fas fa-location-arrow"></i>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="开始日期">
                        <el-date-picker v-model="tripData.startDate" type="date" placeholder="选择开始日期"
                            :disabled-date="disabledStartDate">
                            <template #prefix>
                                <i class="fas fa-calendar-alt"></i>
                            </template>
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束日期">
                        <el-date-picker v-model="tripData.endDate" type="date" placeholder="选择结束日期"
                            :disabled-date="disabledEndDate">
                            <template #prefix>
                                <i class="fas fa-calendar-alt"></i>
                            </template>
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="旅行人数">
                        <el-input-number v-model="tripData.travelers" :min="1" />
                    </el-form-item>
                    <el-form-item label="预算范围">
                        <el-select v-model="tripData.budget" placeholder="请选择预算范围">
                            <el-option label="经济型 (¥1000-3000)" value="low"></el-option>
                            <el-option label="中等 (¥3000-8000)" value="medium"></el-option>
                            <el-option label="高端 (¥8000+)" value="high"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="btn-group">
                    <el-button type="primary" @click="nextStep">下一步 <i class="fas fa-arrow-right"></i></el-button>
                </div>
            </div>
            <div v-if="currentStep === 2" class="step-2">
                <el-form :model="tripData" label-width="120px">
                    <el-form-item label="交通方式">
                        <el-radio-group v-model="tripData.transport">
                            <el-radio-button value="driving"><i class="fas fa-car"></i> 驾车</el-radio-button>
                            <el-radio-button value="walking"><i class="fas fa-walking"></i> 步行</el-radio-button>
                            <el-radio-button value="bicycling"><i class="fas fa-bicycle"></i> 骑行</el-radio-button>
                            <el-radio-button value="airplane"><i class="fas fa-plane"></i> 飞行</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-form>

                <div class="distance-info">{{ distanceInfo }}</div>

                <div class="time-list">
                    <div v-for="mode in Object.keys(transportModes)" :key="mode"
                        :class="['time-item', { active: tripData.transport === mode }]">
                        <i :class="['fas', transportModes[mode].icon]"></i>
                        {{ transportModes[mode].name }}：{{ calculateTime(mode) }}
                    </div>
                </div>

                <div id="map" class="map-container"></div>

                <div class="btn-group">
                    <el-button @click="prevStep"><i class="fas fa-arrow-left"></i> 上一步</el-button>
                    <el-button type="primary" @click="nextStep">下一步 <i class="fas fa-arrow-right"></i></el-button>
                </div>
            </div>
            <div v-if="currentStep === 3" class="step-3">
                <div class="weather-section" v-if="tripData.weather">
                    <h3><i class="fas fa-cloud-sun"></i> 天气预报</h3>
                    <p class="weather-desc">您旅行期间的天气情况</p>

                    <div class="weather-cards">
                        <div v-for="(cast, index) in tripData.weather.forecast.casts.slice(0, 5)" :key="index"
                            class="weather-card">
                            <div class="weekday">周{{ weekMap[cast.week] || cast.week }}</div>
                            <div class="weather-icon">
                                <i :class="['fas', weatherIcons[cast.dayweather] || 'fa-cloud']"></i>
                            </div>
                            <div class="temperature">{{ cast.daytemp }}°C</div>
                            <div class="weather-desc">{{ cast.dayweather }}</div>
                        </div>
                    </div>
                </div>

                <div class="poi-section">
                    <h3>推荐景点</h3>
                    <div class="poi-grid">
                        <div v-for="(attraction, index) in tripData.pois" :key="index" class="poi-card"
                            :class="{ selected: tripData.selectedPOIs.includes(index) }" @click="togglePOI(index)">
                            <div class="poi-image"
                                :style="{ backgroundImage: attraction.photos && attraction.photos.length > 0 ? `url(${attraction.photos[0].url})` : 'none' }">
                            </div>
                            <div class="poi-info">
                                <div class="poi-name">{{ attraction.name }}</div>
                                <div class="poi-address">{{ attraction.address || "地址未提供" }}</div>
                                <div class="poi-type">{{ attraction.type.split(';')[0] || "风景名胜" }}</div>
                                <div class="poi-rating">
                                    <i class="fas fa-star"></i> 评分: {{ attraction.importance || '4.0' }}
                                </div>
                                <div class="poi-ticket">
                                    <i class="fas fa-ticket-alt"></i> 门票: 免费
                                </div>
                                <div class="poi-action">
                                    点击{{ tripData.selectedPOIs.includes(index) ? '移除' : '添加' }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="btn-group">
                    <el-button @click="prevStep"><i class="fas fa-arrow-left"></i> 上一步</el-button>
                    <el-button type="primary" @click="nextStep">下一步 <i class="fas fa-arrow-right"></i></el-button>
                </div>
            </div>
            <div v-if="currentStep === 4" class="step-4">
                <div class="summary-section">
                    <div class="summary-success">
                        <div class="success-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h2>行程规划完成！</h2>
                        <p>您已成功规划本次旅行。可以下载行程单或返回修改。</p>
                    </div>

                    <div class="summary-card">
                        <h3 class="summary-title"><i class="fas fa-file-alt"></i> 行程概览</h3>
                        <div class="summary-grid">
                            <div class="summary-item">
                                <div class="item-label"><i class="fas fa-map-marker-alt"></i> 目的地</div>
                                {{ tripData.destination }}
                            </div>
                            <div class="summary-item">
                                <div class="item-label"><i class="fas fa-calendar-alt"></i> 旅行日期</div>
                                {{ tripData.startDate }} 至 {{ tripData.endDate }}
                            </div>
                            <div class="summary-item">
                                <div class="item-label"><i class="fas fa-user-friends"></i> 旅行人数</div>
                                {{ tripData.travelers }} 人
                            </div>
                            <div class="summary-item">
                                <div class="item-label"><i class="fas fa-route"></i> 交通方式</div>
                                {{ transportText(tripData.transport) }}
                            </div>
                        </div>

                        <div class="summary-item">
                            <div class="item-label"><i class="fas fa-cloud-sun"></i> 天气预报</div>
                            旅行期间平均温度: {{ averageTemperature }}°C
                        </div>

                        <div class="summary-item">
                            <div class="item-label"><i class="fas fa-map-marked-alt"></i> 推荐景点</div>
                            <ul v-if="tripData.pois && tripData.selectedPOIs.length > 0">
                                <li v-for="idx in tripData.selectedPOIs" :key="idx">
                                    {{ tripData.pois[idx].name }}
                                </li>
                            </ul>
                            <span v-else>未选择景点</span>
                        </div>
                    </div>

                    <div class="summary-card">
                        <h3 class="summary-title"><i class="fas fa-calculator"></i> 预算估算</h3>
                        <div class="budget-details">
                            <div>交通费用: <b>¥{{ budget.transportCost }}</b></div>
                            <div>住宿费用 ({{ budget.days }}晚): <b>¥{{ budget.accommodationCost }}</b></div>
                            <div>景点门票: <b>¥{{ budget.ticketCost }}</b></div>
                            <div class="total-budget">总预算: <b>¥{{ budget.total }}</b></div>
                        </div>
                    </div>

                    <div class="btn-group">
                        <el-button @click="currentStep = 1"><i class="fas fa-edit"></i> 修改</el-button>
                        <el-button @click="restartPlan"><i class="fas fa-redo"></i> 重新规划</el-button>
                        <el-button type="primary" @click="exportPDF"><i class="fas fa-file-download"></i> 下载行程单
                            (PDF)</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'

// 步骤状态
const currentStep = ref(1)
const totalSteps = 4

// 步骤完成状态
const stepStatus = ref([true, false, false, false])

// 通知状态
const notification = reactive({
    show: false,
    message: ''
})

// 表单数据
const tripData = reactive({
    origin: '',
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    transport: 'driving',
    weather: null,
    pois: [],
    selectedPOIs: [],
    budget: '',
    distance: null
})

// 交通方式配置
const transportModes = {
    driving: { name: '驾车', speed: 60, icon: 'fa-car' },
    walking: { name: '步行', speed: 5, icon: 'fa-walking' },
    bicycling: { name: '骑行', speed: 15, icon: 'fa-bicycle' },
    airplane: { name: '飞行', speed: 800, icon: 'fa-plane' }
}

// 天气图标映射
const weatherIcons = {
    "晴": "fa-sun",
    "多云": "fa-cloud",
    "阴": "fa-cloud",
    "小雨": "fa-cloud-rain",
    "中雨": "fa-cloud-showers-heavy",
    "大雨": "fa-cloud-showers-heavy",
    "暴雨": "fa-poo-storm",
    "雷阵雨": "fa-bolt",
    "阵雨": "fa-cloud-sun-rain",
    "小雪": "fa-snowflake",
    "中雪": "fa-snowflake",
    "大雪": "fa-snowman",
    "雾": "fa-smog",
    "霾": "fa-smog"
}

// 星期映射
const weekMap = { 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 7: '日' }

// 计算属性
const distanceInfo = computed(() => {
    if (!tripData.distance) return '距离计算中...'
    return `两地直线距离约 ${tripData.distance.toFixed(1)} 公里`
})

const averageTemperature = computed(() => {
    if (tripData.weather && tripData.weather.forecast && tripData.weather.forecast.casts) {
        const casts = tripData.weather.forecast.casts
        let avgTemp = 0
        casts.slice(0, 5).forEach(c => {
            avgTemp += Number(c.daytemp) || 0
        })
        return (avgTemp / Math.min(5, casts.length)).toFixed(1)
    } else {
        return '--'
    }
})

const budget = computed(() => estimateBudget())

// 方法
const nextStep = () => {
    // 步骤1的验证
    if (currentStep.value === 1) {
        if (!tripData.destination || !tripData.startDate || !tripData.endDate || tripData.travelers < 1) {
            showNotification('请填写完整信息')
            return
        }
        stepStatus.value[1] = true
    }

    // 步骤2的验证
    if (currentStep.value === 2) {
        stepStatus.value[2] = true
    }

    // 步骤3的验证
    if (currentStep.value === 3) {
        stepStatus.value[3] = true
    }

    if (currentStep.value < totalSteps) {
        currentStep.value++

        // 步骤2加载地图
        if (currentStep.value === 2) {
            setTimeout(() => {
                showMapStep(true)
            }, 100)
        }

        // 步骤3获取天气和景点
        if (currentStep.value === 3) {
            fetchWeatherAndPOI()
        }
    }
}

const prevStep = () => {
    if (currentStep.value > 1) {
        currentStep.value--
    }
}

const showNotification = (msg) => {
    ElMessage({
        message: msg,
        type: 'warning',
        duration: 2000
    })
}

const disabledStartDate = (time) => {
    return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
}

const disabledEndDate = (time) => {
    if (!tripData.startDate) return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
    return time.getTime() < new Date(tripData.startDate).getTime()
}

const calculateTime = (mode) => {
    if (!tripData.distance) return '计算中...'

    const speed = transportModes[mode].speed
    const hours = tripData.distance / speed

    if (speed >= 100) {
        return `${hours.toFixed(2)} 小时`
    } else {
        const h = Math.floor(hours)
        const m = Math.round((hours - h) * 60)
        return h > 0 ? `${h}小时${m}分钟` : `${m}分钟`
    }
}

const transportText = (mode) => {
    return transportModes[mode]?.name || '未知'
}

const togglePOI = (index) => {
    const idx = tripData.selectedPOIs.indexOf(index)
    if (idx > -1) {
        tripData.selectedPOIs.splice(idx, 1)
    } else {
        tripData.selectedPOIs.push(index)
    }
}

const restartPlan = () => {
    // 重置所有数据
    Object.assign(tripData, {
        origin: '',
        destination: '',
        startDate: '',
        endDate: '',
        travelers: 1,
        transport: 'driving',
        weather: null,
        pois: [],
        selectedPOIs: [],
        budget: '',
        distance: null
    })

    stepStatus.value = [true, false, false, false]
    currentStep.value = 1
}

// 修复的地理编码函数
const getLocation = async (address) => {
    // 如果地址为空，使用默认地址
    if (!address || address.trim() === '') {
        console.warn('地址为空，使用默认地址')
        return { lng: 116.397428, lat: 39.90923 } // 默认北京坐标
    }

    const apiKey = "d6252339014b34205c7ab52961b96dd1"
    try {
        const res = await fetch(`https://restapi.amap.com/v3/geocode/geo?key=${apiKey}&address=${encodeURIComponent(address)}`)
        const data = await res.json()

        if (data.status === '1' && data.geocodes && data.geocodes.length > 0 && data.geocodes[0].location) {
            const [lng, lat] = data.geocodes[0].location.split(',').map(Number)

            // 验证坐标是否有效
            if (!isNaN(lng) && !isNaN(lat) && lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90) {
                return { lng, lat }
            } else {
                console.warn('获取到无效的坐标:', { lng, lat })
            }
        }

        // 如果API返回无效数据，使用默认坐标
        console.warn(`无法获取"${address}"的坐标，使用默认坐标`)
        return { lng: 116.397428, lat: 39.90923 } // 默认北京坐标

    } catch (error) {
        console.error('地理编码请求失败:', error)
        return { lng: 116.397428, lat: 39.90923 } // 默认北京坐标
    }
}

// 修复的地图初始化函数
const showMapStep = async (showDistance) => {
    const start = tripData.origin || '北京'
    const end = tripData.destination || '上海'

    try {
        const [startLoc, endLoc] = await Promise.all([
            getLocation(start),
            getLocation(end)
        ])

        // 验证坐标有效性
        if (isNaN(startLoc.lng) || isNaN(startLoc.lat) || isNaN(endLoc.lng) || isNaN(endLoc.lat)) {
            throw new Error('获取到无效的坐标数据')
        }

        // 初始化地图
        if (!window._amap2) {
            window._amap2 = new AMap.Map('map', {
                zoom: 10,
                center: [startLoc.lng, startLoc.lat],
                viewMode: '3D',
            })

            // 添加地图控件
            try {
                window._amap2.addControl(new AMap.ToolBar())
                window._amap2.addControl(new AMap.Scale())
                window._amap2.addControl(new AMap.HawkEye())
            } catch (controlError) {
                console.warn('地图控件添加失败:', controlError)
            }
        } else {
            window._amap2.clearMap()
            window._amap2.setCenter([startLoc.lng, startLoc.lat])
        }

        // 添加标记
        try {
            new AMap.Marker({
                position: [startLoc.lng, startLoc.lat],
                map: window._amap2,
                title: start
            })
            new AMap.Marker({
                position: [endLoc.lng, endLoc.lat],
                map: window._amap2,
                title: end
            })
        } catch (markerError) {
            console.warn('标记添加失败:', markerError)
        }

        // 绘制路线
        try {
            const p1 = [startLoc.lng, startLoc.lat]
            const p2 = [endLoc.lng, endLoc.lat]
            const mx = (p1[0] + p2[0]) / 2
            const my = (p1[1] + p2[1]) / 2
            let dx = p2[0] - p1[0]
            let dy = p2[1] - p1[1]
            let nx = -dy, ny = dx
            let curveFactor = 0.15
            let len = Math.sqrt(nx * nx + ny * ny)
            if (len === 0) len = 1
            nx = nx / len
            ny = ny / len
            const ctrl = [mx + nx * curveFactor * Math.sqrt(dx * dx + dy * dy), my + ny * curveFactor * Math.sqrt(dx * dx + dy * dy)]

            function getBezierPoints(p1, ctrl, p2, num) {
                const pts = []
                for (let t = 0; t <= 1; t += 1 / num) {
                    const x = (1 - t) * (1 - t) * p1[0] + 2 * (1 - t) * t * ctrl[0] + t * t * p2[0]
                    const y = (1 - t) * (1 - t) * p1[1] + 2 * (1 - t) * t * ctrl[1] + t * t * p2[1]
                    pts.push([x, y])
                }
                return pts
            }

            const bezierPath = getBezierPoints(p1, ctrl, p2, 50)
            new AMap.Polyline({
                path: bezierPath,
                strokeColor: '#0091ff',
                strokeWeight: 4,
                isOutline: true,
                outlineColor: '#fff',
                lineJoin: 'round',
                map: window._amap2
            })
        } catch (polylineError) {
            console.warn('路线绘制失败:', polylineError)
        }

        try {
            window._amap2.setFitView()
        } catch (fitViewError) {
            console.warn('设置地图视图失败:', fitViewError)
        }

        // 计算距离
        const distance = getDistance(startLoc.lat, startLoc.lng, endLoc.lat, endLoc.lng)
        tripData.distance = distance

    } catch (error) {
        console.error('地图初始化失败:', error)
        showNotification('地图初始化失败，请检查地址是否正确')
    }
}

// 球面距离计算
const getDistance = (lat1, lng1, lat2, lng2) => {
    const toRad = d => d * Math.PI / 180
    const R = 6371
    const dLat = toRad(lat2 - lat1)
    const dLng = toRad(lng2 - lng1)
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// 获取天气和景点
const fetchWeatherAndPOI = () => {
    const loading = ElLoading.service({
        lock: true,
        text: '正在获取天气和景点信息...',
        background: 'rgba(0, 0, 0, 0.7)',
    })

    const apiKey = "d6252339014b34205c7ab52961b96dd1"
    const weatherBaseUrl = "https://restapi.amap.com/v3/weather/weatherInfo"
    const poiBaseUrl = "https://restapi.amap.com/v3/place/text"
    const endCity = tripData.destination

    // 天气
    const weatherCurrentUrl = `${weatherBaseUrl}?key=${apiKey}&city=${encodeURIComponent(endCity)}&extensions=base`
    const weatherForecastUrl = `${weatherBaseUrl}?key=${apiKey}&city=${encodeURIComponent(endCity)}&extensions=all`

    // 景点
    const poiParams = new URLSearchParams({
        key: apiKey,
        keywords: "景点",
        city: endCity,
        types: "风景名胜",
        offset: 10,
        page: 1,
        extensions: "all",
        output: "JSON"
    })
    const poiUrl = `${poiBaseUrl}?${poiParams.toString()}`

    Promise.all([
        fetch(weatherCurrentUrl).then(res => res.json()),
        fetch(weatherForecastUrl).then(res => res.json()),
        fetch(poiUrl).then(res => res.json())
    ]).then(([currentData, forecastData, poiData]) => {
        // 天气
        if (currentData.status === "1" && currentData.lives && currentData.lives.length > 0) {
            tripData.weather = {
                live: currentData.lives[0],
                forecast: forecastData.forecasts && forecastData.forecasts[0]
            }
        } else {
            showNotification('天气信息获取失败')
        }

        // 景点
        if (poiData.status === "1" && poiData.pois && poiData.pois.length > 0) {
            tripData.pois = poiData.pois
        } else {
            showNotification('未找到相关景点')
        }
    }).catch(() => {
        showNotification('天气或景点信息获取失败')
    }).finally(() => {
        loading.close()
    })
}

// 预算估算
const estimateBudget = () => {
    // 交通费用
    const transportCostMap = { driving: 300, walking: 0, bicycling: 50, airplane: 1200 }
    const transportCost = (transportCostMap[tripData.transport] || 0) * tripData.travelers

    // 住宿费用
    const dailyCost = tripData.budget === 'low' ? 200 : tripData.budget === 'high' ? 800 : 400
    const days = getTripDays()
    const accommodationCost = dailyCost * days * tripData.travelers

    // 门票
    const ticketCost = (tripData.selectedPOIs.length || 0) * 50 * tripData.travelers // 假设每个景点50元

    // 总预算
    const total = transportCost + accommodationCost + ticketCost

    return { transportCost, accommodationCost, ticketCost, total, days }
}

const getTripDays = () => {
    if (!tripData.startDate || !tripData.endDate) return 1
    const start = new Date(tripData.startDate)
    const end = new Date(tripData.endDate)
    return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)))
}

// PDF导出
const exportPDF = () => {
    if (!window.jspdf) {
        const script = document.createElement('script')
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
        script.onload = () => doExportPDF()
        document.body.appendChild(script)
    } else {
        doExportPDF()
    }
}

const doExportPDF = () => {
    const { jsPDF } = window.jspdf
    const doc = new jsPDF()
    let y = 20

    doc.setFont('helvetica')
    doc.setFontSize(20)
    doc.text('智能旅行规划助手 - 行程单', 20, y)
    y += 15

    doc.setFontSize(13)
    doc.text('出发地: ' + (tripData.origin || '--'), 20, y)
    y += 8
    doc.text('目的地: ' + tripData.destination, 20, y)
    y += 8
    doc.text('日期: ' + tripData.startDate + ' 至 ' + tripData.endDate, 20, y)
    y += 8
    doc.text('人数: ' + tripData.travelers + ' 人', 20, y)
    y += 8
    doc.text('交通方式: ' + transportText(tripData.transport), 20, y)
    y += 8
    doc.text('预算: ' + (tripData.budget === 'low' ? '经济型' : tripData.budget === 'high' ? '高端' : '中等'), 20, y)
    y += 12

    doc.setFontSize(15)
    doc.text('预算估算', 20, y)
    y += 8
    doc.setFontSize(12)
    doc.text('交通费用: ¥' + budget.value.transportCost, 20, y)
    y += 7
    doc.text('住宿费用: ¥' + budget.value.accommodationCost, 20, y)
    y += 7
    doc.text('景点门票: ¥' + budget.value.ticketCost, 20, y)
    y += 7
    doc.text('总预算: ¥' + budget.value.total, 20, y)
    y += 12

    doc.setFontSize(15)
    doc.text('推荐景点', 20, y)
    y += 8
    doc.setFontSize(12)
    if (tripData.pois && tripData.selectedPOIs.length > 0) {
        tripData.selectedPOIs.forEach((idx, i) => {
            const poi = tripData.pois[idx]
            doc.text((i + 1) + '. ' + poi.name + ' - ' + (poi.address || ''), 22, y)
            y += 7
        })
    } else {
        doc.text('无', 22, y)
        y += 7
    }

    y += 8
    doc.setFontSize(13)
    doc.text('感谢使用智能旅行规划助手！', 20, y)

    doc.save('旅行行程单.pdf')
}

// 监听步骤变化
watch(currentStep, (newVal) => {
    // 步骤2加载地图
    if (newVal === 2) {
        setTimeout(() => {
            showMapStep(true)
        }, 100)
    }

    // 步骤3获取天气和景点
    if (newVal === 3) {
        fetchWeatherAndPOI()
    }
})

// 修复地图API加载
onMounted(() => {
    // 确保高德地图API已加载
    if (!window.AMap) {
        const script = document.createElement('script')
        script.src = 'https://webapi.amap.com/maps?v=2.0&key=d6252339014b34205c7ab52961b96dd1&plugin=AMap.ToolBar,AMap.Scale,AMap.HawkEye,AMap.Driving,AMap.Walking,AMap.Riding'
        script.onerror = () => {
            console.error('高德地图API加载失败')
            showNotification('地图服务加载失败，请检查网络连接')
        }
        document.head.appendChild(script)
    }
})
</script>

<style lang="scss" scoped>
.map-container {
    width: 100%;
    height: 320px;
    border-radius: 12px;
    margin: 20px 0;
}
</style>