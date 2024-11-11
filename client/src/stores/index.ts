import { defineStore } from 'pinia'
import { Food, Admin } from '@/types'

export const useStore = defineStore('app', {
    state: () => ({
        printerMessage: null as string | null,
        user: JSON.parse(localStorage.getItem('user-data') || 'null') as Admin | null,
        token: localStorage.getItem('token-data') || null,
        cart: JSON.parse(localStorage.getItem('cart-items') || '[]') as (Food & {quantity?: number})[],
        foods: [] as Food[],
        orderIds: JSON.parse(localStorage.getItem('orders-id-items') || '[]') as number[]
    }),
    getters: {
        getPrinterMessage: state => state.printerMessage,
        getToken: state => state.token,
        isLogged: state => !state.token,
        getCart: state => state.cart,
        getCartTotal: state => state.cart.reduce((a,b) => a + (b.price * b.quantity!) || 0, 0),
        getFoods: state => state.foods,
    },
    actions: {
        setFoods(foods: Food[]) {
            this.$patch({ foods })
        },
        setOrderIds(orderIds: number[] | null) {
            if(orderIds === null) {
                this.orderIds = []
                localStorage.removeItem('orders-id-items')
                return
            }
            this.orderIds = orderIds
            localStorage.setItem('orders-id-items', JSON.stringify(this.cart))
        },
        addToCart(food: Food) {
            const index = this.cart.findIndex(c => c.id === food.id)
            if(this.cart[index]?.quantity) this.cart[index].quantity+=1
            else this.cart.push(Object.assign(food, {quantity: 1}))
            localStorage.setItem('cart-items', JSON.stringify(this.cart))
        },
        removeFromCart(food: Food) {
            const index = this.cart.findIndex(c => c.id === food.id)
            if(this.cart[index] && this.cart[index].quantity! > 1) this.cart[index].quantity! -= 1
            else this.cart.splice(index, 1)
            localStorage.setItem('cart-items', JSON.stringify(this.cart))
        },
        clearCart() {
            this.cart = []
            localStorage.removeItem('cart-items')
        },
        setAuthData(user: Partial<Admin> | null, token: string | null) {
            if(user === null || token === null) {
                localStorage.removeItem('user-data')
                localStorage.removeItem('token-data')
                window.location.href = '/login'
            } else {
                localStorage.setItem('user-data', JSON.stringify(user))
                localStorage.setItem('token-data', token)
            }
            this.$patch({ user, token })
        },
        setPrinterMessage(printerMessage: string | null) {
            this.$patch({ printerMessage })
        }
    }
})