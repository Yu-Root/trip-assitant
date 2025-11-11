<template>
    <el-dialog v-model="dialogRegisterVisible" title="注册账号" width="800">

    </el-dialog>
</template>

<script setup>
import { ref } from 'vue';


const dialogRegisterVisible = ref(false)
const openDialog = () => {
    dialogRegisterVisible.value = true
}
defineExpose({
    openDialog
})
</script>

<style lang="scss" scoped></style>