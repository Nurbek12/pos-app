<template>
    <v-app>
        <v-main style="overflow-y: auto;">
            <v-navigation-drawer temporary v-model="drawer1" location="right" width="80">
                <v-list mandatory nav variant="flat">
                    <v-list-item height="60" link v-for="cy,n in categories" :key="n"
                        :value="cy.name" @click="category=cy.name;drawer1=false" 
                        :base-color="category===cy.name?'primary':'grey-lighten-4'">
                        <div v-show="groups[cy.name]?.length>0" class="d-flex justify-center">
                            <v-avatar size="40" rounded>
                                <v-img cover :src="cy.image"></v-img>
                            </v-avatar>
                        </div>
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>
            <v-container fluid class="pa-2">
                <v-sheet color="surface" class="py-2" border>
                    <v-data-table :headers="headers" :items="groups[category]||[]" items-per-page="-1">
                        <template #bottom></template>
                        <template #item.price="{item}">
                            <price :value="item.price" />
                        </template>
                        <template #item.add="{item: food}">
                            <div style="width: 140px;">
                                <div class="d-flex align-center justify-space-between ga-3" v-if="store.getCart.some(c => c.id === food.id)">
                                    <v-btn size="37" @click="store.removeFromCart(food)" color="primary" variant="flat">
                                        <v-icon>mdi-minus</v-icon>
                                    </v-btn>
    
                                    <div class="w-100 text-center bg-primary rounded text-subtitle-1 py-1" style="width: 40px !important;">
                                        {{ store.getCart.find(c => c.id === food.id)?.quantity }}
                                    </div>
    
                                    <v-btn size="37" @click="store.addToCart(food)" color="primary" variant="flat">
                                        <v-icon>mdi-plus</v-icon>
                                    </v-btn>
                                </div>
                                <v-btn v-else @click="store.addToCart(food)" color="primary" variant="flat" block>Qo'shish</v-btn>
                            </div>
                        </template>
                    </v-data-table>
                </v-sheet>
            </v-container>
            <v-bottom-sheet v-model="drawer">
                <v-card flat class="mt-2">
                    <v-card-title>
                        <span class="pl-2">Buyurtma yaratish</span>
                    </v-card-title>
                    <v-card-text class="pb-0">
                        <v-list bg-color="grey-lighten-4" class="px-4 py-2 rounded">
                            <span class="text-grey text-subtitle-1" v-show="store.getCart.length==0">Bo'sh</span>
                            <template v-for="c in store.getCart" :key="c.id">
                                <v-list-item class="px-0">
                                    <v-list-item-title>{{ c.name }}</v-list-item-title>
                                    <v-list-item-subtitle>
                                        <price :value="c.price" /> x {{ c.quantity }} = <price :value="c.price * c.quantity!" /></v-list-item-subtitle>
                                        <template #append>
                                            <div class="d-flex align-center justify-space-between ga-2" v-if="store.getCart.some(cr => cr.id === c.id)">
                                                <v-btn size="28" @click="store.removeFromCart(c)" color="primary" variant="flat">
                                                    <v-icon>mdi-minus</v-icon>
                                                </v-btn>
                
                                                <v-btn size="28" @click="store.addToCart(c)" color="primary" variant="flat">
                                                    <v-icon>mdi-plus</v-icon>
                                                </v-btn>
                                            </div>
                                        </template>
                                </v-list-item>
                                <v-divider />
                            </template>
                        </v-list>
                    </v-card-text>
                    <v-card-text>
                        <div>
                            <span class="text-subtitle-1 text-grey-darken-3">Jami: <price :value="store.getCartTotal + extraPrice" /></span> <br>
                            <span v-show="type!=='ONESELF'" class="text-subtitle-2 text-grey-darken-3">{{ orderTypesServices[type] }}: <price :value="extraPrice" /></span>
                        </div>
                    </v-card-text>
                    <v-card-text class="pt-0">
                        <div>
                            <v-select v-model="type" :items="orderTypes" @update:model-value="address=$event=='TABLE'?'':orderTypesObject[$event]" hide-details variant="outlined" placeholder="Buyurtma turi" flat density="compact" color="primary" />
                            <v-text-field v-show="type==='TABLE'" :type="type==='TABLE'?'number':'text'" v-model="address" hide-details variant="outlined" placeholder="Stol Raqami" flat density="compact" color="primary" class="mt-4" />
                        </div>
                        <div class="d-flex ga-2 w-100 mt-4">
                            <v-btn size="45" @click="store.clearCart" :disabled="store.getCart.length<=0" color="primary" variant="flat">
                                <v-icon size="25">mdi-delete</v-icon>
                            </v-btn>
                            <v-btn height="45" @click="handleCreateOrder" :loading="loading" :disabled="store.getCart.length<=0||!address" color="primary" variant="flat" style="flex: 1">
                                Yaratish
                            </v-btn>
                        </div>
                    </v-card-text>
                </v-card>
            </v-bottom-sheet>
            <v-bottom-navigation border height="60">
                <div class="d-flex align-center ga-2 px-2 w-100">
                    <v-btn @click="drawer=true" style="flex: 1" active-color="primary" base-color="primary" color="primary" height="45" variant="flat" density="compact">
                        <div class="w-100 d-flex align-center ga-5">
                            <span>Jami: <price :value="store.getCartTotal + extraPrice" /></span>
                        </div>
                    </v-btn>
                    <v-btn @click="drawer1=true" active-color="primary" base-color="primary" color="primary" height="45" variant="flat" density="compact">
                        <v-icon>mdi-food</v-icon>
                    </v-btn>
                </div>
            </v-bottom-navigation>
            <v-dialog :model-value="dialog" @update:model-value="dialog=false" max-width="500">
                <OrderCard v-if="!!order?.id" :order="order" @close-card="closeDialog" is-mobile/>
            </v-dialog>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { Food } from '@/types'
import { computed, ref } from 'vue'
import { useStore } from '@/stores'
import { getFoods } from '@/api/food'
import { categories, SERVICE_PRICE } from '@/constants'
import { createOrder } from '@/api/order'
import Price from '@/components/price.vue'
// import { createOrderEmit } from '@/api/socket'
import OrderCard from '@/components/order-card.vue'
import { orderTypes, orderTypesObject, orderTypesServices } from '@/constants'

const store = useStore()
const dialog = ref(false)
const drawer = ref(false)
const drawer1 = ref(false)
const loading = ref(false)
const order = ref<any>(null)
const items = ref<Food[]>([])
const category = ref("Burger")
const address = ref<null|string>(null)
const type = ref<'DELIVERY'|'ONESELF'|'TABLE'>('TABLE')

const headers = [
    { title: 'Nomi', key: 'name', sortable: false },
    { title: 'Narxi', key: 'price', sortable: false },
    { title: 'Qo\'shish/Ayirish', key: 'add', sortable: false },
]

const groups = computed(() => {
    const groupBy: { [key: string]: Food[] } = {}

    categories.map(category => {
        groupBy[category.name] = items.value.filter(food => food.category === category.name) 
    })
    
    return groupBy
})

const extraPrice = computed(() => {
    switch(type.value) {
        case 'DELIVERY': return 10000;
        case 'ONESELF': return 0;
        case 'TABLE': return store.getCartTotal * (SERVICE_PRICE/100);
    }
})

const init = async () => {
    const { data } = await getFoods()
    items.value = data
}

const handleCreateOrder = async () => {
    loading.value = true
    const newOrder = {
        type: type.value,
        address: '' + address.value,
        serviceCharge: extraPrice.value || 0,
        total: store.getCartTotal + extraPrice.value,
        items: store.getCart.map(({id, quantity})=>({foodId: id, quantity}))
    }
    const { data } = await createOrder(newOrder)
    if(data?.id) {
        store.clearCart()
        type.value = 'TABLE'
        order.value = data
        dialog.value = true
        address.value = null
        drawer.value = false
    }
    loading.value = false
}

const closeDialog = () => {
    order.value=null
    dialog.value=false
}

init()
</script>