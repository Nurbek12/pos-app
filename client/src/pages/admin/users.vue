<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" class="d-flex justify-end align-center pb-2">
                <v-btn @click="dialog=true" color="primary" flat class="text-h5" size="x-large">Yaratish</v-btn>
            </v-col>
            <v-col cols="12">
                <v-card flat border>
                    <v-card-text class="px-1">
                        <v-data-table class="text-h5" :items="items" :headers="headers" items-per-page="-1">
                            <template #bottom></template>
                            <template #item.actions="{item,index}">
                                <div class="d-flex ga-2">
                                    <v-btn size="40" color="primary" flat @click="editItem(item, index)">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                </div>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
    <v-dialog v-model="dialog" max-width="550">
        <v-card>
            <v-card-title class="text-h5">Ishchi yaratish</v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="12">
                        <v-text-field class="text-h5" :rules="[(v: any) => !!v || 'v']" color="primary" variant="outlined" flat v-model="item.login" hide-details label="Login"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field class="text-h5"  :rules="[(v: any) => !!v || 'v']" color="primary" variant="outlined" flat v-model="item.password" hide-details label="Password"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-select class="text-h5" :rules="[(v: any) => !!v || 'v']" color="primary" variant="outlined" flat v-model="item.role" :items="['admin','app']" item-title="name" item-value="name" hide-details label="Roli" clearable></v-select>
                    </v-col>
                    <v-col cols="12">
                        <v-btn height="50" @click="save" color="primary" variant="flat" block size="x-large" class="text-h5">Saqlash</v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
            <div class="py-2"></div>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { Admin } from '@/types'
import { ref, reactive } from 'vue'
import { createUser, getUsers, updateUser } from '@/api/auth'

const dialog = ref(false)
const items = ref<Admin[]>([])
const createLoading = ref(false)
const itemIndex = ref<number|null>(null)

const headers = [
    { title: "Login", key: "login", sortable: false },
    { title: "Roli", key: "role", sortable: false },
    { title: "O'zgartirish", key: "actions", sortable: false },
]

const item = reactive({
    role: "",
    login: "",
    password: "",
})

const init = async () => {
    const foods = await getUsers()
    items.value = foods.data
}

const editItem = (d: any, index: number) => {
    Object.assign(item, d)
    itemIndex.value = index
    dialog.value = true
}

const add = async (body: any) => {
    const { data } = await createUser(body)
    items.value.push(data)
}

const update = async (index: number, {id, ...body}: any) => {
    const { data } = await updateUser(id, body)
    
    Object.assign(items.value[index], data)
}

const save = async () => {
    try {
        createLoading.value = true
        if(itemIndex.value !== null)
            await update(itemIndex.value, item)
        else
            await add(item)
        close()
    } catch (error) {
        console.log(error);
    } finally {
        createLoading.value = false
    }
}

const close = () => {
    Object.assign(item, {
        role: "",
        login: "",
        password: "",
    })
    dialog.value = false
    itemIndex.value = null
}

init()
</script>