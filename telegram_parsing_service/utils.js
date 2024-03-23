export const getLastUpdatedDateObjectFromDateTimeString = (dateTimeString) => {
    let lastUpdatedDateTime = dateTimeString;

    if (lastUpdatedDateTime) {
        return new Date(lastUpdatedDateTime);
    }

    lastUpdatedDateTime = new Date();
    lastUpdatedDateTime.setMonth(lastUpdatedDateTime.getMonth() - 6);
    return lastUpdatedDateTime;
};

export const getSnscrapeDateFormatted = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} +0000`;
};

export const getApiDateFormatted = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

export const addOneSecond = (dateString) => {
    const date = new Date(dateString);
    const time = date.getTime() + 1000;
    const newDate = new Date(time);

    return newDate.toISOString().replace("Z", "");
};
