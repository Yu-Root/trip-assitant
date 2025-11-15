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
                            <el-radio-button label="driving"><i class="fas fa-car"></i> 驾车</el-radio-button>
                            <el-radio-button label="walking"><i class="fas fa-walking"></i> 步行</el-radio-button>
                            <el-radio-button label="bicycling"><i class="fas fa-bicycle"></i> 骑行</el-radio-button>
                            <el-radio-button label="airplane"><i class="fas fa-plane"></i> 飞行</el-radio-button>
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

const currentStep = ref(1)
const totalSteps = 4

const stepStatus = ref([true, false, false, false])

const notification = reactive({
    show: false,
    message: ''
})

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

const transportModes = {
    driving: { name: '驾车', speed: 60, icon: 'fa-car' },
    walking: { name: '步行', speed: 5, icon: 'fa-walking' },
    bicycling: { name: '骑行', speed: 15, icon: 'fa-bicycle' },
    airplane: { name: '飞行', speed: 800, icon: 'fa-plane' }
}

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

const weekMap = { 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 7: '日' }

const nextStep = () => {
    if (currentStep.value++ > 4)
        currentStep.value = 0
}
</script>

<style lang="scss" scoped></style>