import type { Food, Order, OrderItem } from '@prisma/client'

export interface IOrder extends Order {
    orderItems: (
        OrderItem &
        { food: Food }
    )[]
}

export const SERVICE_PRICE = 5

export const truncateName = (name: string, maxLength: number) => {
  return name.length > maxLength
    ? name.substring(0, maxLength - 3) + "..."
    : name;
};

export const LETTER_SIZE = 32;

export const orderTypesObject = {
  DELIVERY: "Yetkazib berish",
  ONESELF: "O'zi bilan",
  TABLE: "Stol",
};

export const orderTypesServices = {
  DELIVERY: "Yetkazib berish",
  ONESELF: "",
  TABLE: `Xizmat ko'rsatish ${SERVICE_PRICE}%`,
};
