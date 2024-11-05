<template>
    <v-card flat>
        <v-card-text class="pb-0 text-primary text-h3">{{order.address}}-{{ order?.dailyNum }}</v-card-text>
        <v-card-text class="py-2">Buyurtma raqami: #{{ (order?.dailyNum||1).toString().padStart(6, '0') }}</v-card-text>
        <v-card-text class="py-2">Buyurtma narxi: <price :value="order?.total||0" /></v-card-text>
        <v-card-text v-show="order.type!=='ONESELF'" class="text-subtitle-2 py-3 text-grey-darken-3">
            {{ orderTypesServices[order.type as keyof typeof orderTypesServices] }}:
            <price :value="order.serviceCharge||0" />
        </v-card-text>
        <v-card-text class="pt-0">
            <v-table style="border: 1px solid #ccc; border-radius: 4px; background: #eee;">
                <tbody>
                    <tr v-for="food,i in order?.orderItems||[]" :key="i">
                        <td>{{ food.food.name }}</td>
                        <td><price :value="food.food.price" /> <span style="text-wrap: nowrap;">x {{ food.quantity }}</span></td>
                        <td><price :value="food.food.price * food.quantity" /></td>
                    </tr>
                </tbody>
            </v-table>
        </v-card-text>
        <v-card-text class="pt-0">
            <v-btn color="green" flat block @click="emits('close-card')">Yopish</v-btn>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { IOrder } from '@/types'
import Price from './price.vue'
import { orderTypesServices } from '@/constants';

defineProps<{ order: IOrder }>()
const emits = defineEmits(['close-card'])
</script>