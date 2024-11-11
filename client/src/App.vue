<template>
  <router-view />
  <v-dialog :model-value="store.getPrinterMessage !== null" max-width="500">
    <v-card>
      <div class="d-flex justify-center w-100 pt-6">
        <v-icon size="120" color="red">mdi-alert</v-icon>
      </div>
      <v-card-title class="text-red text-h6 text-center">Printerda moammo yuzaga keldi</v-card-title>
      <v-card-text>
        <v-sheet color="grey-lighten-4" max-height="300" class="overflow-y-auto rounded pa-4">
          {{ store.getPrinterMessage }}
        </v-sheet>
      </v-card-text>
      <v-card-actions class="pt-0 px-6 pb-6 d-flex justify-center">
        <v-btn @click="store.setPrinterMessage(null)" variant="flat" color="primary">Yopish</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useStore } from '@/stores'

const store = useStore()
</script>

<style>
::-webkit-scrollbar {
  background: none;
  width: 2px;
  height: 2px;
}

::-webkit-scrollbar-thumb {
  background: #FF1744;
  border-radius: 6px;
}
</style>