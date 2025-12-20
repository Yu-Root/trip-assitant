<template>
    <el-dialog v-model="dialogCityInfoVisible" :title="title" align-center @close="handleCancel">
        <div class="city-info">
            <div class="city-img">
                <img :src=imgUrl alt="">
            </div>
            <div class="city-desc">
                <span>{{ desc }}</span>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';

const props = defineProps({
    title: {
        type: String,
        require: true
    },
    imgUrl: {
        type: String,
        require: true
    },
    desc: {
        type: String,
        require: true
    },
    initialValue: {
        type: Object,
        default: () => ({})
    },
    dialogValue: {
        type: Boolean,
        default: false
    }
})

const dialogCityInfoVisible = ref(props.dialogValue)
const infoData = reactive({})

watch(
    () => props.initialValue,
    (newVal) => {
        Object.assign(infoData, newVal)
    },
    { immediate: true }
)

watch(
    () => props.dialogValue,
    (newVal) => {
        dialogCityInfoVisible.value = newVal
    }
)

const emit = defineEmits(['confirm', 'cancel'])

const handleConfirm = () => {
    emit('confirm')
    dialogCityInfoVisible.value = false
}

const handleCancel = () => {
    emit('cancel')
    dialogCityInfoVisible.value = false
}
</script>

<style lang="scss" scoped></style>