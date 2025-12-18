<template>
    <el-dialog v-model="dialogCityInfoVisible" :title="title" align-center @close="handleCancel">

    </el-dialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';

const props = defineProps({
    title: {
        title: String,
        require: true
    },
    dialogValue: {
        type: Boolean,
        default: false
    }
})

const dialogCityInfoVisible = ref(props.dialogValue)

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