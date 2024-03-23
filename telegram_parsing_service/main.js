import schedule from "node-schedule";
import { sendParsedNewsToBackendServer } from "./api.js";
import { getLastUpdatedDateTime } from "./redis/services/query.js";
import { setLastUpdatedDateTime } from "./redis/services/command.js";
import { getLastUpdatedDateObjectFromDateTimeString } from "./utils.js";
import { TelegramParser } from "./parser.js";

schedule.scheduleJob("*/1 * * * *", async function () {
    const lastUpdatedDateTime = getLastUpdatedDateObjectFromDateTimeString(
        await getLastUpdatedDateTime(),
    );

    const telegramChannels = [
        { channel: "headlines_geo", channelName: "Geo Headlines" },
        { channel: "headlines_for_traders", channelName: "Headlines" },
        { channel: "bitkogan_hotline", channelName: "Bitkogan" },
        { channel: "tmptmp2", channelName: "Мой канал" }
    ];

    const tasks = telegramChannels.map(channel => {
        console.log(`Start parsing ${channel.channelName} channel`);
        return (async () => {
            const parser = new TelegramParser(channel.channel, channel.channelName);
            const articles =
                await parser.makeParseUntilPublicationDateTime(lastUpdatedDateTime);

            if (articles.length > 0) {
                return sendParsedNewsToBackendServer(
                    articles.filter(
                        item => item.description !== null && item.description.length > 20,
                    ),
                );
            }
        })();
    });

    await Promise.all(tasks);

    await setLastUpdatedDateTime((new Date()).toISOString());
});
