import { DateTime } from "luxon";
import { timeZone } from "../../const.js";

export function convertRBCDatetimeToISO(dateString) {
  /*
    Конветирует дату, полученную с сайта РБК в ISO формат.
    Время всегда считается по Москве, что требует бизнес-логика.

    Форматы даты на сайте РБК:
    1) 29 дек 2023, 08:55
    2) 27 окт, 15:06
    3) 15:06 (если новость сегодняшняя) 

    Args:
        dateString (str): дата в формате РБК

    Returns:
        str: дата в ISO формате или null, если дата не валидна
    */
  const fullDatePattern = "d LLL yyyy, HH:mm";
  let convertedDate = DateTime.fromFormat(dateString, fullDatePattern, {
    zone: timeZone,
    locale: "ru",
  }).set({ second: 0, millisecond: 0 });
  if (convertedDate.isValid) {
    return convertedDate.toUTC().toISO({ includeOffset: false });
  }

  const partialDatePattern = "d LLL, HH:mm";
  convertedDate = DateTime.fromFormat(dateString, partialDatePattern, {
    zone: timeZone,
    locale: "ru",
  }).set({ year: DateTime.local().year, second: 0, millisecond: 0 });
  if (convertedDate.isValid) {
    return convertedDate.toUTC().toISO({ includeOffset: false });
  }

  const timePattern = "HH:mm";
  convertedDate = DateTime.fromFormat(dateString, timePattern, {
    zone: timeZone,
    locale: "ru",
  }).set({ second: 0, millisecond: 0 });
  if (convertedDate.isValid) {
    const today = DateTime.now().setZone(timeZone);
    convertedDate = today.set({
      hour: convertedDate.hour,
      minute: convertedDate.minute,
      second: 0,
      millisecond: 0,
    });
    return convertedDate.toUTC().toISO({ includeOffset: false });
  }

  console.log(`Error: invalid date format. Get date string: ${dateString}`);
  return null;
}
