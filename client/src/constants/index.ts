export const SERVICE_PRICE = 0

export const categories = [
    { parent: "Food Menu", name: "Burger", image: "/images/burger.png" },
    { parent: "Food Menu", name: "Lavash", image: "/images/shawarma.png" },
    { parent: "Food Menu", name: "Hotdog", image: "/images/hotdog.png" },
    { parent: "Food Menu", name: "Klab Sendvich", image: "/images/bread.png" },
    { parent: "Food Menu", name: "Shaurma", image: "/images/taco.png" },
    { parent: "Food Menu", name: "KFC", image: "/images/fried-chicken.png" },
    { parent: "Food Menu", name: "Garnir", image: "/images/french-fries.png" },
    { parent: "Food Menu", name: "Qo'shimcha", image: "/images/hot-sauce.png" },
    
    { parent: "Drink Menu", name: "Salqin Ichimliklar", image: "/images/drinks.png" },
    { parent: "Drink Menu", name: "Issiq Ichimliklar", image: "/images/tea-cup.png" },
    { parent: "Drink Menu", name: "Moxito", image: "/images/drink.png" },

    { parent: "Pizza Menu", name: "Kichik", image: "/images/pizza-small.png" },
    { parent: "Pizza Menu", name: "O'rta", image: "/images/pizza-medium.png" },
    { parent: "Pizza Menu", name: "Katta", image: "/images/pizza-big.png" },
]

export const orderTypes = [
    { title:"Yetkazib berish", value: "DELIVERY" },
    { title:"O'zi bilan", value: "ONESELF" },
    { title: "Stol", value: "TABLE" },
]

export const orderTypesObject = {
    DELIVERY: "Yetkazib berish",
    ONESELF: "O'zi bilan",
    TABLE: "Stol",
}

export const orderTypesServices = {
    DELIVERY: "Yetkazib berish",
    ONESELF: "",
    TABLE: `Xizmat ko'rsatish ${SERVICE_PRICE}%`,
}