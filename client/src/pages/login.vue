<template>
    <v-layout>
        <v-main>
            <v-container fluid style="height: 100vh;" class="bg-background">
                <v-row justify="center" align="center" class="h-100">
                    <v-card max-width="400" width="100%" flat border>
                        <v-card-title class="text-center text-primary text-h5">Tizimga kirish</v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" class="pb-0">
                                    <v-text-field :rules="[(v: any) => !!v || 'v']" v-model="formData.login" prepend-inner-icon="mdi-account" hide-details variant="outlined" flat label="Login"></v-text-field>
                                </v-col>
                                <v-col cols="12" class="pb-0">
                                    <v-text-field type="password":rules="[(v: any) => !!v || 'v']" v-model="formData.password" prepend-inner-icon="mdi-lock" hide-details variant="outlined" flat label="Parol"></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-btn @click="handleLogin()" :disabled="!formData.login.trim() || !formData.password.trim() || loading" color="primary" height="50" class="text-h5" flat block>Kirish</v-btn>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-row>
            </v-container>
        </v-main>
    </v-layout>
</template>

<script setup lang="ts">
import { checkToken } from '@/api'
import { reactive, ref } from 'vue'
import { useStore } from '@/stores'
import { useRouter } from 'vue-router'
import { loginUser } from '@/api/auth'

const store = useStore()
const router = useRouter()
const loading = ref(false)
const formData = reactive({
    login: '',
    password: ''
})

const handleLogin = async () => {
    try {
        loading.value = true
        const { data } = await loginUser(formData)
        
        store.setAuthData(data.user, data.token)
        checkToken()
        router.push('/'+data.user.role)
    } catch (error) {
        alert("Login yoki parol xato")
    } finally {
        loading.value = false
    }
}
</script>