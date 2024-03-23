import schedule from 'node-schedule';
import { RBCParcer } from './parcers/rbc/parcer.js';
import { client } from './redis.js';
import { redisParsingSourceName } from './parcers/const.js';
import { redisAppName } from './const.js';
import { sendParsedNewsToBackendServer } from './api.js';

const job = schedule.scheduleJob('*/30 * * * * *', async function () {
    let lastUpdatedDateTime = await client.get(`${redisAppName}:${redisParsingSourceName}`);
    lastUpdatedDateTime = new Date(lastUpdatedDateTime);
    lastUpdatedDateTime.setHours(lastUpdatedDateTime.getHours() + 3);
    lastUpdatedDateTime = lastUpdatedDateTime.toISOString();

    if (!lastUpdatedDateTime) {
        lastUpdatedDateTime = new Date();
        lastUpdatedDateTime.setMonth(lastUpdatedDateTime.getMonth() - 6);
    } else {
        lastUpdatedDateTime = new Date(lastUpdatedDateTime);
    }

    const articles = await new RBCParcer().makeParceUntilPublicationDateTime(
        lastUpdatedDateTime
    );

    if (articles.length !== 0) {
        await client.set(
            `${redisAppName}:${redisParsingSourceName}`,
            articles[0].published_at
        );
    }


    if (articles.length === 0) {
        return;
    }
    await sendParsedNewsToBackendServer(articles);
});
