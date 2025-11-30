<template>
    <el-dialog v-model="dialogSettingVisible" title="修改" align-center>
        123
    </el-dialog>
</template>

<script setup>
import { ref } from 'vue';


const dialogSettingVisible = ref(false)
const openDialog = () => {
    dialogSettingVisible.value = true
}
defineExpose({
    openDialog
})
</script>

<style lang="scss" scoped></style>