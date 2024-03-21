import schedule from 'node-schedule';
import { RBCParcer } from './parcers/rbc/parcer.js';
import { client } from './redis.js';
import { redisParsingSourceName } from './parcers/const.js';
import { redisAppName } from './const.js';
import { sendParsedNewsToBackendServer } from './api.js';

const job = schedule.scheduleJob('*/30 * * * * *', async function () {
    let lastUpdatedDateTime = await client.get(`${redisAppName}:${redisParsingSourceName}`);

    if (!lastUpdatedDateTime) {
        lastUpdatedDateTime = new Date();
        lastUpdatedDateTime.setMonth(lastUpdatedDateTime.getMonth() - 6);
    } else {
        lastUpdatedDateTime = new Date(lastUpdatedDateTime);
    }

    const articles = await new RBCParcer().makeParceUntilPublicationDateTime(
        lastUpdatedDateTime.toISOString()
    );

    await client.set(
        `${redisAppName}:${redisParsingSourceName}`,
        new Date().toISOString()
    );

    if (articles.length === 0) {
        return;
    }
    await sendParsedNewsToBackendServer(articles);
});
