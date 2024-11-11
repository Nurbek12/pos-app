import escpos from "escpos";
import { IOrder, SERVICE_PRICE } from "./constants";

escpos.USB = require("escpos-usb");
escpos.Network = require("escpos-network");

const deviceAdmin = new escpos.USB();
const deviceChef = new escpos.Network("192.168.123.100");

const chefPrinter = new escpos.Printer(deviceChef, { encoding: "UTF-8" });

// Команды управления принтером
const COMMANDS = {
  // Команды для настройки шрифта
  TXT_NORMAL: Buffer.from([0x1b, 0x21, 0x00]), // Нормальный шрифт
  TXT_SMALL: Buffer.from([0x1b, 0x4d, 0x01]), // Маленький шрифт
  TXT_CONDENSED: Buffer.from([0x0f]), // Сжатый шрифт
  TXT_BOLD: Buffer.from([0x1b, 0x45, 0x01]), // Жирный шрифт
  TXT_BOLD_OFF: Buffer.from([0x1b, 0x45, 0x00]), // Отключение жирного
  TXT_ALIGN_CT: Buffer.from([0x1b, 0x61, 0x01]), // Центрирование
  TXT_ALIGN_LT: Buffer.from([0x1b, 0x61, 0x00]), // Выравнивание влево
  TXT_ALIGN_RT: Buffer.from([0x1b, 0x61, 0x02]), // Выравнивание вправо
};

// Функция для печати текста с определенным размером
const printText = (
  printer: any,
  text: string,
  options: {
    small?: boolean;
    condensed?: boolean;
    bold?: boolean;
    align?: "left" | "center" | "right";
  } = {}
) => {
  // Сброс форматирования
  printer.buffer.write(COMMANDS.TXT_NORMAL);

  // Применяем форматирование
  if (options.small) {
    printer.buffer.write(COMMANDS.TXT_SMALL);
  }
  if (options.condensed) {
    printer.buffer.write(COMMANDS.TXT_CONDENSED);
  }
  if (options.bold) {
    printer.buffer.write(COMMANDS.TXT_BOLD);
  }

  // Выравнивание
  if (options.align === "center") {
    printer.buffer.write(COMMANDS.TXT_ALIGN_CT);
  } else if (options.align === "right") {
    printer.buffer.write(COMMANDS.TXT_ALIGN_RT);
  } else {
    printer.buffer.write(COMMANDS.TXT_ALIGN_LT);
  }

  // Печать текста
  printer.text(text);

  // Сброс форматирования
  printer.buffer.write(COMMANDS.TXT_NORMAL);
  return printer;
};

export const printAdmin = async (order: IOrder) => {
  try {
    await new Promise((resolve, reject) => {
      deviceAdmin.open((error) => {
        if (error) {
          reject(new Error(`Ошибка подключения к принтеру: ${error.message}`));
          return;
        }
        resolve(true);
      });
    });

    const printer = new escpos.Printer(deviceAdmin);

    // Форматируем дату и время
    const date = order.createdAt;
    const formattedDate = date.toLocaleDateString("en-GB");
    const formattedTime = date.toLocaleTimeString("en-GB");

    await new Promise((resolve, reject) => {
      // Заголовок
      printText(printer, "FISH & CHICKEN\n", { bold: true, align: "center" });

      // Информация о заказе (уменьшенным шрифтом)
      printText(printer, `Buyurtma: ${order.dailyNum}-${order.address}\n`, {
        small: true,
        condensed: true,
      });
      printText(printer, `Kun: ${formattedDate}\n`, {
        small: true,
        condensed: true,
      });
      printText(printer, `Soat: ${formattedTime}\n`, {
        small: true,
        condensed: true,
      });
      printText(printer, "-".repeat(32) + "\n", { small: true });

      // Список блюд
      order.orderItems.forEach((item) => {
        const foodName = item.food.name.slice(0, 20);
        const quantity = item.quantity;
        const price = item.food.price;
        const totalPrice = price * quantity;

        // Название блюда
        printText(printer, `${foodName}\n`);
        // Количество и цена
        printText(printer, `${quantity}x${price} so'm = ${totalPrice} so'm\n`, {
          small: true,
          condensed: true,
          align: "right",
        });
      });

      printText(printer, "-".repeat(32) + "\n", { small: true });

      // Информация о доставке/обслуживании
      if (order.type === "DELIVERY") {
        printText(printer, "Yetkazib berish 10,000 s'om\n", {
          small: true,
          condensed: true,
        });
      } else if (order.type === "TABLE") {
        printText(
          printer,
          `Xizmat kursatish ${SERVICE_PRICE}%: ${order.serviceCharge} s'om\n`,
          { small: true, condensed: true }
        );
      }

      // Итоговая сумма
      printText(printer, `Jami: ${order.total} s'om\n`, {
        bold: true,
        align: "right",
      });

      printer.cut().close();

      resolve(true);
    });

    return { status: "success" }
  } catch (error: any) {
    return { status: "error", message: `Ошибка принтера: ${error.message}` };
  }
};

// Функция проверки статуса принтера
export const checkPrinterStatus = async () => {
  try {
    await new Promise((resolve, reject) => {
      deviceAdmin.open((error) => {
        if (error) {
          reject(new Error(`Ошибка подключения к принтеру: ${error.message}`));
          return;
        }
        resolve(true);
      });
    });

    return {
      status: "connected",
      message: "Принтер подключен и готов к работе",
    };
  } catch (error: any) {
    return { status: "error", message: `Ошибка принтера: ${error.message}` };
  }
};

export const printChef = async (order: IOrder) => {
  try {  
    await new Promise((resolve, reject) => {
      deviceChef.open((error) => {
        if (error) {
          console.error("Ошибка подключения к принтеру шефа:", error);
          return;
        }
        resolve(true);
      });
    })

    await new Promise((resolve, reject) => {
      // Шапка квитанции
      chefPrinter
        .style("NORMAL")
        .size(1, 1)
        .text("")
        .text("-".repeat(24))
        .text("")
        .text(
          order.type === "DELIVERY"
            ? `ZAKAZ: #${order.dailyNum} | DOSTAVKA`
            : order.type === "TABLE"
            ? `ZAKAZ: #${order.dailyNum} | STOL: ${order.address}`
            : `ZAKAZ: #${order.dailyNum} | SOBOY`
        )
        .text("")
        .text("-".repeat(24))
        .text("")
        .align("LT")
        .style("IU");
  
      order.orderItems.forEach((item) => {
        const foodName = item.food.name;
        const quantity = item.quantity;
  
        // Формируем строку с выравниванием по ширине 32 символа
        const justifyLine = (name: any, qty: any, width = 24) => {
          const line = `${name} ${qty}`; // Начальная строка с пробелом между названием и количеством
          if (line.length >= width) return line.slice(0, width); // Если строка уже длиннее нужной длины, обрезаем
  
          const spacesNeeded = width - line.length; // Количество пробелов для заполнения
          return name + " ".repeat(spacesNeeded) + qty; // Строка с заполнением пробелами
        };
  
        // Получаем строку с выравниванием
        const line = justifyLine(foodName, quantity);
  
        // Разбиваем длинные строки по 24 символа и отправляем на печать
        const lines = line.match(/.{1,24}/g) || [];
        lines.forEach((part) => chefPrinter.text(part));
      });
  
      // Подвал квитанции
      chefPrinter
        .style("NORMAL")
        .text("")
        .text("-".repeat(24)) // Линия-разделитель
        .align("CT")
        .size(1, 1)
        .text(
          `${order.createdAt.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}` +
            "  |  " +
            `${order.createdAt.toLocaleDateString()}`
        ) // Время
        .text("-".repeat(24)) // Линия-разделитель
        .feed(1) // Отступ внизу
        .cut()
        .close();

      resolve(true)
    })

    return { status: "success" }
  } catch (error: any) {
    return { status: "error", message: `Ошибка принтера: ${error.message}` };
  }
};
