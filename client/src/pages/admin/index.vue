<template>
    <v-app>
        <navigation />
        <v-main style="overflow-y: auto;">
            <router-view />
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import Navigation from '../../components/navigation.vue'
</script>