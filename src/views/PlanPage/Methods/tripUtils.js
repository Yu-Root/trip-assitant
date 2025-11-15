import { ElMessage, ElLoading } from 'element-plus'

// 交通方式配置
export const transportModes = {
    driving: { name: '驾车', speed: 60, icon: 'fa-car' },
    walking: { name: '步行', speed: 5, icon: 'fa-walking' },
    bicycling: { name: '骑行', speed: 15, icon: 'fa-bicycle' },
    airplane: { name: '飞行', speed: 800, icon: 'fa-plane' }
}

// 天气图标映射
export const weatherIcons = {
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
export const weekMap = { 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 7: '日' }

// 球面距离计算
export const getDistance = (lat1, lng1, lat2, lng2) => {
    const toRad = d => d * Math.PI / 180
    const R = 6371
    const dLat = toRad(lat2 - lat1)
    const dLng = toRad(lng2 - lng1)
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// 显示通知
export const showNotification = (msg, type = 'warning') => {
    ElMessage({
        message: msg,
        type: type,
        duration: 2000
    })
}

// 计算行程天数
export const getTripDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 1
    const start = new Date(startDate)
    const end = new Date(endDate)
    return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)))
}