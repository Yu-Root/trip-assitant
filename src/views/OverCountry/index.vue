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
</style>
