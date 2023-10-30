import { DateTime } from 'luxon';


export function convertRBCDatetimeToISO(dateString) {
    /*
    Конветирует дату, полученную с сайта РБК в ISO формат.

    Форматы даты на сайте РБК:
    1) 27 окт, 15:06
    2) 15:06 (если новость сегодняшняя) 

    Args:
        dateString (str): дата в формате РБК

    Returns:
        str: дата в ISO формате или null, если дата не валидна
    */
    const convertedRBCWithDate = DateTime.fromFormat(dateString, 'd LLL, HH:mm', { locale: 'ru' });
    if (convertedRBCWithDate.isValid) {
        return convertedRBCWithDate.toISO();
    }

    const convertedRBCWithoutDate = DateTime.fromFormat(dateString, 'HH:mm', { locale: 'ru' });
    if (convertedRBCWithoutDate.isValid) {
        const today = DateTime.local();
        return today.set(convertedRBCWithoutDate.toObject()).toISO();
    }

    // TODO: сделать логирование
    console.log(`Error: invalid date format. Get date string: ${dateString}`);
    return null;
}
