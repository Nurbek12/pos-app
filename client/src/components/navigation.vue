<template>
    <v-navigation-drawer v-model="drawer" :rail="true" permanent width="290" rail-width="65" elevation="0" :expand-on-hover="true">
        <v-list :lines="false" nav variant="flat">
            <v-list-item height="50" exact active-class="text-white" link v-for="link, i in links" :key="i" :to="link.url" color="primary">
                <template v-slot:prepend>
                    <v-icon size="30" :icon="(link.icon as any)"></v-icon>
                </template>
                <v-list-item-title class="text-h5 py-1">{{ link.title }}</v-list-item-title>
            </v-list-item>
        </v-list>
        <template #append>
            <v-list nav>
                <v-list-item link @click="store.setAuthData(null, null)">
                    <template #prepend>
                        <v-icon size="30">mdi-logout-variant</v-icon>
                    </template>
                    <v-list-item-title class="text-h5 py-1">Chiqish</v-list-item-title>
                </v-list-item>
            </v-list>
        </template>
    </v-navigation-drawer>
</template>
  
<script setup lang="ts">
import { ref, watch } from "vue"
import { useStore } from '@/stores'
import { useDisplay } from "vuetify"

const store = useStore()
const mobile = useDisplay().mobile;

watch(mobile, () => {
    if (mobile) rail.value = true;
});
const rail = ref(true)
const drawer = ref(true)

const links = [
    { title: 'Statistika', icon: 'mdi-chart-bar-stacked', url: '/admin' },
    { title: 'Buyurtma', icon: 'mdi-shopping', url: '/admin/create-order' },
    { title: 'Buyurmalar', icon: 'mdi-update', url: '/admin/orders-table' },
    { title: 'Buyurmalar Tarixi', icon: 'mdi-list-box', url: '/admin/orders' },
    { title: 'Taomlar', icon: 'mdi-food', url: '/admin/foods' },
    { title: 'Ishchilar', icon: 'mdi-account-group', url: '/admin/users' },
]
</script>