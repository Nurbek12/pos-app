<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <v-card flat border>
                    <v-card-text class="pa-1">
                        <v-data-table
                            :loading="loading"
                            @update:options="loadItems"
                            hover
                            :items="items"
                            color="primary"
                            class="text-h6"
                            items-per-page="-1"
                            :headers="headers"
                            item-value="id">
                            <template #item.date="{item}">
                                <span>{{ new Date(item.createdAt).toLocaleString() }}</span>
                            </template>
                            <template #item.id="{item}">
                                <span>{{ item.dailyNum }}</span>
                            </template>
                            <template #item.creator="{item}">
                                <span>{{ item?.creator?.login }}</span>
                            </template>
                            <template #item.total="{item}">
                                <price :value="item.total" />
                            </template>
                            <template #item.serviceCharge="{item}">
                                <price :value="item.serviceCharge" />
                            </template>
                            <template #item.type="{item}">
                                <span>{{orderTypesObject[item.type as keyof typeof orderTypesObject] || '-'}}</span>
                                <span v-show="item.type==='TABLE'"> - {{ item.address }}</span>
                            </template>
                            <template #item.actions="{item,index}">
                                <div class="d-flex align-center ga-2">
                                    <v-btn @click="viewIndex=index" color="primary" variant="flat"  class="text-h5" size="large">
                                        Ko'rish
                                    </v-btn>
                                    <v-btn :disabled="deletedIndex===index" @click="handleDeleteOrder(item.id, index)" color="primary" variant="flat"  class="text-h5" size="large">
                                        Bekor qilish
                                    </v-btn>
                                </div>
                            </template>
                            <template #bottom></template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
    <v-dialog :model-value="viewIndex!==null" @update:model-value="viewIndex=null" max-width="750">
        <OrderCard :button-loading="createLoading" v-if="viewIndex!==null" :order="(items[viewIndex!] as any)" @close-card="completeOrder" button-title="Tasdiqlash" />
    </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IOrder } from '@/types'
import Price from '@/components/price.vue'
import { orderTypesObject } from '@/constants'
import OrderCard from '@/components/order-card.vue'
import { getOrders, updateOrder, deleteOrder } from '@/api/order'

const loading = ref(true)
const items = ref<IOrder[]>([])
const createLoading = ref(false)
const viewIndex = ref<number|null>(null)
const deletedIndex = ref<number|null>(null)

const headers = ref([
    { title: 'ID', key: 'id', sortable: false },
    { title: 'Ofitsiant', key: 'creator', sortable: false },
    { title: 'Buyurtma narxi', key: 'total', sortable: false },
    { title: 'Buyurtma Turi', key: 'type', sortable: false },
    { title: 'Xizmat narxi', key: 'serviceCharge', sortable: false },
    { title: 'Sana/Vaqt', key: 'date', sortable: false },
    { title: 'Boshqarish', key: 'actions', sortable: false },
])

const loadItems =  async () => {
    loading.value = true
    const { data } = await getOrders({
        page: 1,
        limit: 1000,
        status: "CREATED",
    })
    items.value = data.result as any
    loading.value = false
}

const completeOrder = async () => {
    createLoading.value = true
    const { data } = await updateOrder(items.value[viewIndex.value!].id, { status: "COMPLETED" })
    if(data.status !== "PRINTER_ERROR") {
        items.value.splice(viewIndex.value!, 1)
    }
    viewIndex.value = null
    createLoading.value = false
}

const handleDeleteOrder = async (id: number, index: number) => {
    if(!confirm('Buyurtmani bekor qilmoqchimisiz?')) return
    deletedIndex.value = index

    await deleteOrder(id)
    items.value.splice(index, 1)
    deletedIndex.value = null
    alert('Buyurtmani bekor qilindi✅')
}
</script>