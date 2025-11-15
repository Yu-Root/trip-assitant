import { ElLoading } from 'element-plus'

const API_KEY = "d6252339014b34205c7ab52961b96dd1"

// 地理编码
export const getLocation = async (address) => {
    if (!address || address.trim() === '') {
        console.warn('地址为空，使用默认地址')
        return { lng: 116.397428, lat: 39.90923 }
    }

    try {
        const res = await fetch(`https://restapi.amap.com/v3/geocode/geo?key=${API_KEY}&address=${encodeURIComponent(address)}`)
        const data = await res.json()

        if (data.status === '1' && data.geocodes && data.geocodes.length > 0 && data.geocodes[0].location) {
            const [lng, lat] = data.geocodes[0].location.split(',').map(Number)
            if (!isNaN(lng) && !isNaN(lat) && lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90) {
                return { lng, lat }
            }
        }

        console.warn(`无法获取"${address}"的坐标，使用默认坐标`)
        return { lng: 116.397428, lat: 39.90923 }
    } catch (error) {
        console.error('地理编码请求失败:', error)
        return { lng: 116.397428, lat: 39.90923 }
    }
}

// 获取天气信息
export const fetchWeather = async (city) => {
    const weatherBaseUrl = "https://restapi.amap.com/v3/weather/weatherInfo"
    const currentUrl = `${weatherBaseUrl}?key=${API_KEY}&city=${encodeURIComponent(city)}&extensions=base`
    const forecastUrl = `${weatherBaseUrl}?key=${API_KEY}&city=${encodeURIComponent(city)}&extensions=all`

    try {
        const [currentRes, forecastRes] = await Promise.all([
            fetch(currentUrl),
            fetch(forecastUrl)
        ])

        const [currentData, forecastData] = await Promise.all([
            currentRes.json(),
            forecastRes.json()
        ])

        if (currentData.status === "1" && currentData.lives && currentData.lives.length > 0) {
            return {
                live: currentData.lives[0],
                forecast: forecastData.forecasts && forecastData.forecasts[0]
            }
        }
        return null
    } catch (error) {
        console.error('获取天气信息失败:', error)
        return null
    }
}

// 获取景点信息
export const fetchPOI = async (city) => {
    const poiBaseUrl = "https://restapi.amap.com/v3/place/text"
    const poiParams = new URLSearchParams({
        key: API_KEY,
        keywords: "景点",
        city: city,
        types: "风景名胜",
        offset: 10,
        page: 1,
        extensions: "all",
        output: "JSON"
    })

    const poiUrl = `${poiBaseUrl}?${poiParams.toString()}`

    try {
        const res = await fetch(poiUrl)
        const data = await res.json()

        if (data.status === "1" && data.pois && data.pois.length > 0) {
            return data.pois
        }
        return []
    } catch (error) {
        console.error('获取景点信息失败:', error)
        return []
    }
}

// 获取天气和景点信息
export const fetchWeatherAndPOI = async (city) => {
    const loading = ElLoading.service({
        lock: true,
        text: '正在获取天气和景点信息...',
        background: 'rgba(0, 0, 0, 0.7)',
    })

    try {
        const [weather, pois] = await Promise.all([
            fetchWeather(city),
            fetchPOI(city)
        ])

        return { weather, pois }
    } catch (error) {
        console.error('获取信息失败:', error)
        return { weather: null, pois: [] }
    } finally {
        loading.close()
    }
}