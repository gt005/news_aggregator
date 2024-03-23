import { client } from "../settings.js";
import { redisAppName, redisParsingSourceName } from "../const.js";

export const setLastUpdatedDateTime = async (dateTimeString) => {
    await client.set(
        `${redisAppName}:${redisParsingSourceName}`,
        dateTimeString,
    );
};

export const setApiToken = async (token) => {
    await client.set(
        `backend_api_service:auth_token:${token}`,
        `backend_api_service:auth_token:${token}`,
        "EX",
        180,
    );
};
