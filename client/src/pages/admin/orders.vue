<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <v-card flat border>
                    <v-card-text class="pa-1">
                        <v-data-table
                            v-model:items-per-page="itemsPerPage"
                            :page="page"
                            :loading="loading"
                            :items-length="count"
                            @update:options="loadItems"
                            hover
                            :items="items"
                             class="text-h5"
                            color="primary"
                            :headers="headers"
                            item-value="id">
                            <template #item.date="{item}">
                                <span>{{ new Date(item.createdAt).toLocaleString() }}</span>
                            </template>
                            <template #item.id="{item}">
                                <span>{{ item.dailyNum }}</span>
                            </template>
                            <template #item.total="{item}">
                                <price :value="item.total" />
                            </template>
                            <template #item.creator="{item}">
                                <span>{{ item?.creator?.login }}</span>
                            </template>
                            <template #item.serviceCharge="{item}">
                                <price :value="item.serviceCharge" />
                            </template>
                            <template #item.type="{item}">
                                <span>{{orderTypesObject[item.type as keyof typeof orderTypesObject] || '-'}}</span>
                                <span v-show="item.type==='TABLE'"> - {{ item.address }}</span>
                            </template>
                            <template #item.actions="{index}">
                                <v-btn @click="viewIndex=index" color="primary" variant="flat" class="text-h5" size="large">
                                    Ko'rish
                                </v-btn>
                            </template>
                            <template #bottom></template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12">
                <v-pagination v-model="page" @update:modelValue="loadItems" active-color="primary" density="comfortable" variant="flat"
                   :length="Math.ceil(count / itemsPerPage)"></v-pagination>
            </v-col>
        </v-row>
    </v-container>
    
            
    <v-dialog :model-value="viewIndex!==null" @update:model-value="viewIndex=null" max-width="750">
        <OrderCard v-if="viewIndex!==null" :order="(items[viewIndex!] as any)" @close-card="viewIndex=null" />
    </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IOrder } from '@/types'
import { getOrders } from '@/api/order'
import { orderTypesObject } from '@/constants'
import Price from '@/components/price.vue'
import OrderCard from '@/components/order-card.vue'

const page = ref(1)
const count = ref(0);
const loading = ref(true);
const itemsPerPage = ref(25)
const items = ref<IOrder[]>([])
const viewIndex = ref<number|null>(null);

const headers = ref([
    { title: 'ID', key: 'id', sortable: false },
    { title: 'Ofitsiant', key: 'creator', sortable: false },
    { title: 'Buyurtma narxi', key: 'total', sortable: false },
    { title: 'Buyutrma turi', key: 'type', sortable: false },
    { title: 'Xizmat narxi', key: 'serviceCharge', sortable: false },
    { title: 'Sana/Vaqt', key: 'date', sortable: false },
    { title: 'Ko\'rish', key: 'actions', sortable: false },
])

const loadItems =  async () => {
    loading.value = true
    const { data } = await getOrders({
        page: page.value,
        limit: itemsPerPage.value,
        status: "COMPLETED",
    })
    items.value = data.result
    count.value = data.total
    loading.value = false
}
</script>