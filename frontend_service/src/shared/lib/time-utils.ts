/**
 * Форматирует объект Date в строку с временем.
 * @param {Date} dateTime - Объект Date, который нужно отформатировать.
 * @returns {string} Строка с датой в формате "16:45".
 */
export const getFormattedTime = (dateTime: Date): string => {
    const hours = dateTime.getHours().toString()
    const minutes = dateTime.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
}

/**
 * Форматирует объект Date в строку с датой в российском формате.
 * @param {Date} dateTime - Объект Date, который нужно отформатировать.
 * @returns {string} Строка с датой в формате "5 января 2024".
 */
export const getFormattedDate = (dateTime: Date): string => {
    const day = dateTime.getDate()
    const months = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
    const month = months[dateTime.getMonth()]
    const year = dateTime.getFullYear()

    return `${day} ${month} ${year}`
}