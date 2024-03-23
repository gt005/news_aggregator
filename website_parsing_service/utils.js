export const getLastUpdatedDateObjectFromDateTimeString = (dateTimeString) => {
    let lastUpdatedDateTime = dateTimeString;

    if (lastUpdatedDateTime) {
        return new Date(lastUpdatedDateTime);
    }

    lastUpdatedDateTime = new Date();
    lastUpdatedDateTime.setMonth(lastUpdatedDateTime.getMonth() - 6);
    return lastUpdatedDateTime;
};
