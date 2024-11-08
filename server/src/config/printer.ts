import escpos from 'escpos'
import { IOrder, LETTER_SIZE, orderTypesObject, orderTypesServices, truncateName } from './constants'

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
        .size(1, 2)
        .text("FISH & CHICKEN")
        .text(`Buyurtma: ${order.dailyNum}-${order.address}`)
        .text(`Kun: ${formattedDate}`)
        .text(`Soat: ${formattedTime}`)
        .text('*'.repeat(LETTER_SIZE))
        .size(1, 1)
        .text(`Stol: ${order.address}`)
        .text('*'.repeat(LETTER_SIZE));

      order.orderItems.forEach(item => {
        const itemName = truncateName(item.food.name, 20); // Adjust maxLength as needed
        const quantity = item.quantity;
        const price = item.food.price.toFixed(2);
        const total = (quantity * item.food.price).toFixed(2);

        const itemLine = `${itemName.padEnd(20)}${quantity}x`.padEnd(24) + `${price} $`.padStart(6) + `${total} $`.padStart(10);
        printer.text(itemLine);
      });

      // const serviceCharge = (order.total * order.serviceCharge).toFixed(2);
      const totalAmount = (order.total).toFixed(2);

      printer
        .text('*'.repeat(LETTER_SIZE))
        .text(`Xizmat kursatish 5%`.padEnd(13))
        .text(`Jami:`.padEnd(25) + `${totalAmount} $`.padStart(8))
        .cut()
        .close();
  })
}

export const printChef = (order: IOrder) => {
  const printer = chefPrinter

  device2.open((error) => {
    if (error) {
      console.error("Ошибка подключения к принтеру:", error);
      return;
    }

    const date = order.createdAt;
    const formattedDate = date.toLocaleDateString('en-GB');
    const formattedTime = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    printer
      .align('CT')
      .style('B')
      .size(1, 2)
      .text("FISH & CHICKEN")
      .text(`# ${order.address}-${order.dailyNum}`)
      .text('*'.repeat(LETTER_SIZE)) // 37 to match total width including borders
      .size(1, 1);

    order.orderItems.forEach(item => {
      const itemName = truncateName(item.food.name, 20); // Adjust maxLength as needed
      const quantity = item.quantity;
      const itemLine = `${itemName.padEnd(20)}${quantity}x`.padEnd(LETTER_SIZE); // Ensure the line fits in 32 characters
      printer.text(itemLine);
    });

    printer
      .text('*'.repeat(LETTER_SIZE)) // Footer line
      .align('CT')
      .text(formattedTime) // Right align the time
      .text('*'.repeat(LETTER_SIZE)) // Divider line
      .align('CT')
      .text(formattedDate) // Right align the date
      .cut()
      .close();
  })
}