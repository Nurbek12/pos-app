import { Order, OrderItem, Food } from '@prisma/client';
import escpos from 'escpos';
escpos.USB = require('escpos-usb'); // Подключаем поддержку USB

interface IOrder extends Order {
  orderItems: (OrderItem & { food: Food })[];
}

// Настраиваем устройство для принтера через USB-порт
const device = new escpos.USB(); // Автоматически находит первый доступный USB-принтер

// Настройки для принтера (кодировка и другие параметры)
const options = { encoding: "GB18030" }; // Укажите нужную кодировку

// Создаём экземпляры принтеров
export const printer1 = new escpos.Printer(device, options);
export const printer2 = new escpos.Printer(device, options);

// Функция для форматирования номера заказа
export const generatedFunction = (n: number) => {
  const letterIndex = Math.floor((n - 1) / 99);
  const letter = String.fromCharCode((letterIndex % 26) + 65);
  const number = ((n - 1) % 99) + 1;
  return letter + '-' + number;
};

// Функция для печати чека
export const printPaper = (order: IOrder, printer: escpos.Printer) => {
  device.open((error) => {
    if (error) {
      console.error("Ошибка подключения к принтеру:", error);
      return;
    }

    printer
      .align('CT') // Выравнивание по центру
      .text('Fish & Chicken') // Название ресторана
      .align('LT') // Выравнивание по левому краю

      .text(`Номер Заказа: ${generatedFunction(order.id)}`)
      .text(`Дата: ${order.created_at.toLocaleDateString()}`)
      .text(`Время: ${order.created_at.toLocaleTimeString()}`)
      .text(`Номер стола: ${order.table}`)
      .drawLine() // Разделительная линия
      .text('Блюда       кол-во  цена  общая')
      .drawLine();

    order.orderItems.forEach(item => {
      // Форматируем строку для каждого блюда
      printer.text(
        `${item.food.name.padEnd(15)} ${item.quantity.toString().padEnd(5)} ${item.food.price.toString().padEnd(5)} ${(item.quantity * item.food.price).toString().padEnd(5)}`
      );
    });

    printer
      .drawLine()
      .text(`Общая цена:          ${order.total}`)
      .drawLine()
      .text('Спасибо, что пообедали с нами!')
      .cut() // Обрезка бумаги
      .close(); // Закрытие соединения с принтером
  });
};
