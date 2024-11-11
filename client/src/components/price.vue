<template>
    <span>{{ new Intl.NumberFormat('en-EN').format(value) }} so'm</span>
</template>

<script setup lang="ts">
defineProps<{ value: number }>()
</script>