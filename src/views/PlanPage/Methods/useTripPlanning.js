import { ref, reactive, computed, watch } from 'vue'
import {
    transportModes, weatherIcons, weekMap,
    getDistance, showNotification, getTripDays
} from '@/views/PlanPage/Methods/tripUtils'
import { getLocation, fetchWeatherAndPOI } from '@/views/PlanPage/Methods/apiService'

export const useTripPlanning = () => {
    // 步骤状态
    const currentStep = ref(1)
    const totalSteps = 4
    const stepStatus = ref([true, false, false, false])

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

        if (currentStep.value === 2) {
            stepStatus.value[2] = true
        }

        if (currentStep.value === 3) {
            stepStatus.value[3] = true
        }

        if (currentStep.value < totalSteps) {
            currentStep.value++
        }
    }

    const prevStep = () => {
        if (currentStep.value > 1) {
            currentStep.value--
        }
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

    // 地图相关方法
    const showMapStep = async () => {
        const start = tripData.origin || '北京'
        const end = tripData.destination || '上海'

        try {
            const [startLoc, endLoc] = await Promise.all([
                getLocation(start),
                getLocation(end)
            ])

            if (isNaN(startLoc.lng) || isNaN(startLoc.lat) || isNaN(endLoc.lng) || isNaN(endLoc.lat)) {
                throw new Error('获取到无效的坐标数据')
            }

            // 初始化地图逻辑
            if (!window._amap2) {
                window._amap2 = new AMap.Map('map', {
                    zoom: 10,
                    center: [startLoc.lng, startLoc.lat],
                    viewMode: '2D',
                })

                // 添加地图控件
                try {
                    window._amap2.addControl(new AMap.ToolBar({
                        position: 'RT'
                    }))
                    window._amap2.addControl(new AMap.Scale())
                    window._amap2.addControl(new AMap.HawkEye())
                } catch (controlError) {
                    console.warn('地图控件添加失败:', controlError)
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

                //路线
                try {
                    // 起点和终点坐标
                    const p1 = [startLoc.lng, startLoc.lat]
                    const p2 = [endLoc.lng, endLoc.lat]

                    // 直接用两点数组作为路径
                    new AMap.Polyline({
                        path: [p1, p2],
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

                //调整地图视野
                try {
                    window._amap2.setFitView()
                } catch (fitViewError) {
                    console.warn('设置地图视图失败:', fitViewError)
                }
            }

            const distance = getDistance(startLoc.lat, startLoc.lng, endLoc.lat, endLoc.lng)
            tripData.distance = distance

        } catch (error) {
            console.error('地图初始化失败:', error)
            showNotification('地图初始化失败，请检查地址是否正确')
        }
    }

    // 获取天气和景点
    const fetchWeatherAndPOIData = async () => {
        const result = await fetchWeatherAndPOI(tripData.destination)
        tripData.weather = result.weather
        tripData.pois = result.pois

        if (!result.weather) {
            showNotification('天气信息获取失败')
        }
        if (result.pois.length === 0) {
            showNotification('未找到相关景点')
        }
    }

    // 预算估算
    const estimateBudget = () => {
        const transportCostMap = { driving: 300, walking: 0, bicycling: 50, airplane: 1200 }
        const transportCost = (transportCostMap[tripData.transport] || 0) * tripData.travelers

        const dailyCost = tripData.budget === 'low' ? 200 : tripData.budget === 'high' ? 800 : 400
        const days = getTripDays(tripData.startDate, tripData.endDate)
        const accommodationCost = dailyCost * days * tripData.travelers

        const ticketCost = (tripData.selectedPOIs.length || 0) * 50 * tripData.travelers

        const total = transportCost + accommodationCost + ticketCost

        return { transportCost, accommodationCost, ticketCost, total, days }
    }

    // PDF导出
    const exportPDF = () => {
        // PDF导出逻辑...
    }

    const doExportPDF = () => {
        // PDF生成逻辑...
    }

    return {
        currentStep,
        totalSteps,
        stepStatus,
        tripData,
        transportModes,
        weatherIcons,
        weekMap,
        distanceInfo,
        averageTemperature,
        budget,
        nextStep,
        prevStep,
        disabledStartDate,
        disabledEndDate,
        calculateTime,
        transportText,
        togglePOI,
        restartPlan,
        showMapStep,
        fetchWeatherAndPOIData,
        exportPDF
    }
}