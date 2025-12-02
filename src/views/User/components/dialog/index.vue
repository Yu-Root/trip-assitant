<template>
    <el-dialog v-model="dialogSettingVisible" :title="tilte" align-center @close="handleCancel">
        <el-form :model="formData" :rules="rules" ref="formRef">
            <el-form-item v-for="field in fields" :key="field.key" :label="field.label" :prop="field.key">
                <el-input v-if="field.type === 'input'" v-model="formData[field.key]"
                    :placeholder="field.placeholder || ''"></el-input>

                <el-select v-if="field.type === 'select'" v-model="formData[field.key]"
                    :placeholder="field.placeholder || ''">
                    <el-option v-for="opt in field.options" :key="opt.value" :label="opt.label"
                        :value="opt.value"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="handleConfirm">确认</el-button>
        </template>
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
    formRef.value.validate((valid) => {
        if (valid) {
            emit('confirm', { ...formData })
            dialogSettingVisible.value = false
            emit('update:modelValue', false)
        }
    })
}

const handleCancel = () => {
    emit('cancel')
    dialogSettingVisible.value = false
    emit('update:modelValue', false)
    formRef.value.resetFields()
}

const openDialog = () => {
    dialogSettingVisible.value = true
    emit('update:modelValue', true)
}
defineExpose({
    openDialog
})
</script>

<style lang="scss" scoped></style>