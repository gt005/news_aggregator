import schedule from "node-schedule";
import { RBCParser } from "./parsers/rbc/parser.js";
import { sendParsedNewsToBackendServer } from "./api.js";
import { getLastUpdatedDateTime } from "./redis/services/query.js";
import { setLastUpdatedDateTime } from "./redis/services/command.js";
import { redisParsingSourceName } from "./parsers/const.js";
import { getLastUpdatedDateObjectFromDateTimeString } from "./utils.js";


schedule.scheduleJob("*/2 * * * *", async function () {
    const lastUpdatedDateTime = getLastUpdatedDateObjectFromDateTimeString(
        await getLastUpdatedDateTime(redisParsingSourceName)
    );

    const articles = await new RBCParser().makeParseUntilPublicationDateTime(
        lastUpdatedDateTime,
    );

    if (articles.length === 0) {
        return;
    }

    await sendParsedNewsToBackendServer(articles);
    await setLastUpdatedDateTime(redisParsingSourceName, articles[0].published_at);
});
