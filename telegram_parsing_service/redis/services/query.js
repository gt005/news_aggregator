import { client } from "../settings.js";
import { redisAppName, redisParsingSourceName } from "../const.js";

export const getLastUpdatedDateTime = async () => {
    let lastUpdatedDateTime = await client.get(
        `${redisAppName}:${redisParsingSourceName}`,
    );

    return lastUpdatedDateTime;
};
