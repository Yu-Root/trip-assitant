<template>
    <el-dialog v-model="dialogSettingVisible" :title="tilte" align-center @close="handleCancel">
        <el-form :model="nameForm">
            <el-form-item>
                <el-input v-model="nameForm.oldName"></el-input>
            </el-form-item>
            <el-form-item>
                <template v-slot:label>
                    <span>新名称</span>
                </template>
                <el-input v-model="nameForm.newName" placeholder="输入你的新名字"></el-input>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    fields: {
        type: Array,
        required: true,
        validator: (val) => val.every(item => ['key', 'label', 'type'].every(k => k in item))
    },
    initialValue: {
        type: Object,
        default: () => ({})
    },
    dialogValue: {
        type: Boolean,
        default: false
    },
    rules: {
        type: Object,
        default: () => ({})
    }
})

const formRef = ref(null)
const dialogSettingVisible = ref(props.dialogValue)
const formData = reactive({})

watch(
    () => props.initialValue,
    (newVal) => {
        Object.assign(formData, newVal)
    },
    { immediate: true }
)

watch(
    () => props.dialogValue,
    (newVal) => {
        dialogSettingVisible.value = newVal
    }
)

const emit = defineEmits(['confirm', 'cancel', 'update:modelValue'])

const handleConfirm = () => {

}

const openDialog = () => {
    dialogSettingVisible.value = true
}
defineExpose({
    openDialog
})
</script>

<style lang="scss" scoped></style>