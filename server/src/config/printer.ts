import escpos from 'escpos'
import { IOrder, LETTER_SIZE } from './constants'

escpos.USB = require('escpos-usb'); 


const device1 = new escpos.USB(); 
const device2 = new escpos.USB(); 
const options = { encoding: "GB18030" };

const adminPrinter = new escpos.Printer(device1, options);
const chefPrinter = new escpos.Printer(device2, options);

export const printAdmin = (order: IOrder) => {
    const printer = adminPrinter

    device1.open((error) => {
      if (error) {
        console.error("Ошибка подключения к принтеру:", error);
        return;
      }

      const date = order.createdAt;
      const formattedDate = date.toLocaleDateString('en-GB');
      const formattedTime = date.toLocaleTimeString('en-GB');

      printer
        .align('CT')
        .style('B')
        .size(2, 2)
        .text("FISH & CHICKEN")
        .style('NORMAL')
        .align('LT')
        .size(1, 1)
        .text(`Buyurtma: ${order.dailyNum}-${order.address}`)
        .text(`Kun: ${formattedDate}`)
        .text(`Soat: ${formattedTime}`)
        .text('*'.repeat(LETTER_SIZE))
        .size(2, 2)
        .text(`${order.type === 'TABLE' && 'Stol: '}${order.address}`)
        .size(1, 1)
        .text('*'.repeat(LETTER_SIZE));

        order.orderItems.forEach(item => {
          const foodName = item.food.name;
          const quantity = item.quantity;
          const price = item.food.price;
          const totalPrice = price * quantity;
    
          // Если название еды слишком длинное, разбиваем его на строки по 32 символа
          const foodNameLines = foodName.match(/.{1,32}/g) || [];
          foodNameLines.forEach((line, index) => {
            // Печатаем название еды, добавляя количество и цены только на первой строке
            if (index === 0) {
              const itemLine = `${line.padEnd(20)} ${quantity} x ${price} ${totalPrice}`;
              printer.text(itemLine);
            } else {
              // Оставшиеся строки просто печатаются без дополнительных данных
              printer.text(line);
            }
          });
        });

      printer
        .size(1, 1)
        .text('*'.repeat(LETTER_SIZE))
        .text(
          order.type === 'DELIVERY' ?
          'Yetkazib berish 10,000 s\'om'
          : order.type === 'TABLE' ?
          'Xizmat kursatish 5%: ' + order.serviceCharge +' s\'om'
          : ''
        )
        .align('RT')
        .size(2, 2)
        .text(`Jami: ${order.total.toLocaleString()}`)
        .cut()
  })
}

export const printChef = (order: IOrder) => {
  const printer = chefPrinter

  device2.open((error) => {
    if (error) {
      console.error("Ошибка подключения к принтеру:", error);
      return;
    }

    printer
      .align('CT')
      .style('B')
      .size(2, 2)
      .text('Fish & Chicken')
      .size(1, 1) // Маленький шрифт для остальных строк
      .text(`# ${order.address}-${order.dailyNum}`)
      .text('*'.repeat(LETTER_SIZE))
      .align('LT');

    // Печать каждого элемента заказа с количеством
    order.orderItems.forEach(item => {
      const foodName = item.food.name;
      const quantity = item.quantity;
      const line = `${foodName} ${quantity} ta`;
      
      // Если строка длинная, разбиваем её
      const lines = line.match(/.{1,32}/g) || [];
      lines.forEach(part => printer.text(part));
    });

    // Устанавливаем увеличенный шрифт для времени и даты
    printer
      .text('*'.repeat(LETTER_SIZE)) 
      .align('CT')
      .size(2, 2)
      .text(order.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) // Время
      .size(1, 1)
      .text('*'.repeat(LETTER_SIZE)) 
      .text(order.createdAt.toLocaleDateString()) // Дата
      .cut()
      .close();

  })
}