import { onMounted, ref } from "vue"

export const CityAttractions = () => {
    const apiKey = "d6252339014b34205c7ab52961b96dd1"
    const apiEndpoint = "https://restapi.amap.com/v3/place/text"

    const currentCity = ref('')
    const attractions = ref([])
    const loading = ref(false)
    const hasSearched = ref(false)

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

    const selectPopularCity = (city) => {
        currentCity.value = city
        searchAttractions()
    }

    const getImageStyle = (attraction) => {
        if (attraction.photos && attraction.photos.length > 0) {
            return `background-image: url(${attraction.photos[0].url})`
        }
        return 'background: linear-gradient(to right, #4b6cb7, #182848)'
    }

    const getType = (attraction) => {
        return attraction.type ? attraction.type.split(";")[0] : "风景名胜"
    }

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


