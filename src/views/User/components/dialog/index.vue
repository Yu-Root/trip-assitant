<template>
    <el-dialog v-model="dialogSettingVisible" :title="tilte" align-center>
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
import { reactive, ref } from 'vue';

const nameForm = reactive({
    oldName: '',
    newName: ''
})

const props = defineProps({
    title: {
        type: string,
        required: true
    },
    fields: {
        type: Array,
        required: true,
        validator: (val) => val.every(item => ['key', 'label', 'type'].every(k => k in item))
    },
})

const dialogSettingVisible = ref(false)
const openDialog = () => {
    dialogSettingVisible.value = true
}
defineExpose({
    openDialog
})
</script>

<style lang="scss" scoped></style>