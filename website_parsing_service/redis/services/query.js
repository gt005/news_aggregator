import { client } from "../settings.js";
import { redisAppName } from "../const.js";

export const getLastUpdatedDateTime = async (parsingSourceName) => {
    let lastUpdatedDateTime = await client.get(
        `${redisAppName}:${parsingSourceName}`,
    );

    lastUpdatedDateTime = new Date(lastUpdatedDateTime);
    lastUpdatedDateTime.setHours(lastUpdatedDateTime.getHours() + 3);
    lastUpdatedDateTime = lastUpdatedDateTime.toISOString();

    return lastUpdatedDateTime;
};
