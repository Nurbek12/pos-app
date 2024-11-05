<template>
    <v-app-bar flat color="background" class="px-2">
        <v-sheet border width="100%" color="white" class="overflow-hidden" height="50" elevation="0">
            <v-slide-group :show-arrows="true" mandatory v-model="category">
                <v-slide-group-item v-for="cy,n in categories" :value="cy.name":key="n" v-slot="{ isSelected, toggle }">
                    <v-btn v-show="groups[cy.name]?.length>0" class="ma-2 text-body-2" variant="flat" :color="isSelected ? 'primary' : undefined" @click="toggle">
                        <v-avatar size="20" class="mr-2" rounded>
                            <v-img cover :src="cy.image||'/nophoto.jpg'"></v-img>
                        </v-avatar>
                        {{ cy.parent === 'Pitsa' ? 'Pitsa ' + cy.name : cy.name }} ({{ groups[cy.name]?.length }})
                    </v-btn>
                </v-slide-group-item>
                <template #next>
                    <v-btn color="primary" variant="flat" size="40">
                        <AkChevronRight style="width: 20; height: 20;" />
                    </v-btn>
                </template>
                <template #prev>
                    <v-btn color="primary" variant="flat" size="40">
                        <AkChevronLeft style="width: 20; height: 20;" />
                    </v-btn>
                </template>
            </v-slide-group>
        </v-sheet>
    </v-app-bar>
    <v-container fluid>
        <v-row>
            <v-col cols="6" md="8"  style="height: 90vh; overflow: auto;">
                <v-row>
                    <v-col cols="12" md="6" lg="3" class="pa-2" v-for="food,i in groups[category]||[]" :key="i">
                        <v-card flat border>
                            <v-card-text class="pt-3 pb-2 text-center text-body-1 font-weight-medium">{{ food.name }}</v-card-text>
                            <v-card-text class="text-h6 pt-0 pb-1 text-center text-primary">{{ Number(food.price).toLocaleString('en-EN') }} so'm</v-card-text>
                            <v-card-actions>
                                <template v-if="store.getCart.some(c => c.id === food.id)">
                                    <v-btn @click="store.removeFromCart(food)" color="primary" variant="flat">
                                        <ChMinus />
                                    </v-btn>
                                    <div class="w-100 text-center text-h6">
                                        {{ store.getCart.find(c => c.id === food.id)?.quantity }}
                                    </div>
                                    <v-btn @click="store.addToCart(food)" color="primary" variant="flat">
                                        <GlPlus />
                                    </v-btn>
                                </template>
                                <v-btn v-else @click="store.addToCart(food)" color="primary" variant="flat" block>Qo'shish</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="6" md="4" class="pa-2">
                <v-card flat border>
                    <!-- <v-card-title>Buyurtma yaratish</v-card-title>
                    <v-card-text class="pb-0">
                        <v-list>
                            <span class="text-grey text-subtitle-1" v-show="store.getCart.length==0">Bo'sh</span>
                            <v-list-item v-for="c,i in store.getCart" :key="i" class="px-0">
                                <v-list-item-title>{{ c.name }}</v-list-item-title>
                                <v-list-item-subtitle>{{ c.price }} so'm x {{ c.quantity }} = {{ Number(c.price * c.quantity!).toLocaleString('en-EN') }} so'm</v-list-item-subtitle>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                    <v-card-text>
                        Jami: {{ Number(store.getCartTotal).toLocaleString('en-EN') }} so'm
                    </v-card-text>
                    <v-card-actions>
                        <v-btn :loading="loading" @click="create" :disabled="store.getCart.length<=0" color="primary" variant="elevated" block flat>Yaratish</v-btn>
                    </v-card-actions> -->
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
                                        <div class="d-flex align-center ga-2 mt-2 mb-1" v-if="store.getCart.some(cr => cr.id === c.id)">
                                            <v-btn size="30" @click="store.removeFromCart(c)" color="primary" variant="flat">
                                                <v-icon>mdi-minus</v-icon>
                                            </v-btn>
            
                                            <div class="w-100 text-center bg-primary rounded text-subtitle-1" style="width: 40px !important; height: 30px;">
                                                {{ store.getCart.find(cr => cr.id === c.id)?.quantity }}
                                            </div>
            
                                            <v-btn size="30" @click="store.addToCart(c)" color="primary" variant="flat">
                                                <v-icon>mdi-plus</v-icon>
                                            </v-btn>
                                        </div>
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
                            <v-btn height="45" @click="create" :disabled="store.getCart.length<=0||!address" color="primary" variant="flat" style="flex: 1">
                                Yaratish
                            </v-btn>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
    <v-dialog :model-value="dialog" max-width="500">
        <OrderCard v-if="!!order?.id" :order="order" @close-card="closeDialog" />
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from '@/stores'
import { getFoods } from '@/api/food'
import { Food, IOrder } from '@/types'
import { createOrder } from '@/api/order'
import Price from '@/components/price.vue'
import { createOrderEmit } from '@/api/socket'
import OrderCard from '@/components/order-card.vue'
import { categories, orderTypes, orderTypesObject, orderTypesServices } from '@/constants'
import { GlPlus, ChMinus, AkChevronLeft, AkChevronRight } from '@kalimahapps/vue-icons'

const store = useStore()
const dialog = ref(false)
const loading = ref(false)
const address = ref<any>('')
const items = ref<Food[]>([])
const category = ref("Burger")
const order = ref<IOrder|null>(null)
const type = ref<'DELIVERY'|'ONESELF'|'TABLE'>('TABLE')

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
        case 'TABLE': return store.getCartTotal * 0.05;
    }
})

const init = async () => {
    const { data } = await getFoods()
    items.value = data
}

const create = async () => {
    loading.value = true
    const newOrder = {
        type: type.value,
        address: '' + address.value,
        serviceCharge: extraPrice.value || 0,
        total: store.getCartTotal + extraPrice.value,
        items: store.getCart.map(({id, quantity})=>({foodId: id, quantity}))
    }
    const { data } = await createOrder(newOrder)
    order.value = data as any
    createOrderEmit(data)
    loading.value = false
    order.value = data
    dialog.value = true
    address.value = null
    loading.value = false
    store.clearCart()
}

const closeDialog = () => {
    order.value=null
    dialog.value=false
}

init()
</script>