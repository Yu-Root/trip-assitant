<template>
    <el-dialog v-model="dialogRegisterVisible" title="注册账号" width="40%">
        <el-form :model="RegisterForm" class="Register-form">
            <el-form-item class="username form-item" prop="account">
                <el-input class="input-item" v-model="RegisterForm.account" placeholder="使用邮箱或者手机号">
                    <template #prefix>
                        <el-icon>
                            <User />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item class="password form-item" prop="password">
                <el-input class="input-item" v-model="RegisterForm.password" placeholder="密码">
                    <template #prefix>
                        <el-icon>
                            <Lock />
                        </el-icon>
                    </template>
                </el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogRegisterVisible = false">取消</el-button>
                <el-button type="primary" @click="GoRegister">注册</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue';

const RegisterForm = reactive({
    account: '',
    password: ''
})


const dialogRegisterVisible = ref(false)
const openDialog = () => {
    dialogRegisterVisible.value = true
}
defineExpose({
    openDialog
})
</script>

<style lang="scss" scoped></style>