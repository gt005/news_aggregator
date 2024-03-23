import { getSnscrapeDateFormatted } from "./utils.js";
import { exec } from "child_process";
import { getApiDateFormatted } from "./utils.js";

export class TelegramParser {
    constructor(channel, channelName) {
        this.channel = channel;
        this.channelName = channelName;
    }

    async makeParseUntilPublicationDateTime(lastUpdatedDateTime) {
        const sinceParsingDateString =
            getSnscrapeDateFormatted(lastUpdatedDateTime);
        const articles = await this._parse(sinceParsingDateString);
        return articles;
    }

    async _parse(sinceParsingDateString) {
        const command = `snscrape --jsonl --since "${sinceParsingDateString}" telegram-channel ${this.channel}`;

        const articles = await new Promise((resolve, reject) => {
            exec(
                command,
                { maxBuffer: 1024 * 1024 * 1024 },
                (error, stdout, stderr) => {
                    if (error) {
                        console.error(
                            `Error executing command: ${error.message}`,
                        );
                        reject(error);
                        return;
                    }
                    if (stderr) {
                        console.error(`Command execution error: ${stderr}`);
                        reject(new Error(stderr));
                        return;
                    }

                    try {
                        const articles =
                            this._parseArticlesFromSnscrapeString(stdout);
                        resolve(articles);
                    } catch (parseError) {
                        console.error("Error parsing articles:", parseError);
                        reject(parseError);
                    }
                },
            );
        });

        return articles;
    }

    _parseArticlesFromSnscrapeString(stringWithData) {
        const lines = stringWithData.trim().split("\n");

        const transformedObjects = [];

        for (const line of lines) {
            try {
                if (!line) {
                    continue;
                }
                const jsonObject = JSON.parse(line);

                const transformedObject =
                    this._getArticleObjectFromSnscrapeJson(jsonObject);

                transformedObjects.push(transformedObject);
            } catch (parseError) {
                console.error(`Error parsing JSON: ${parseError.message}`);
            }
        }

        return transformedObjects;
    }

    _getArticleObjectFromSnscrapeJson(jsonObject) {
        return {
            title: `${this.channelName}:`,
            url: jsonObject.url,
            source: "telegram",
            description: jsonObject.content,
            published_at: getApiDateFormatted(jsonObject.date),
        };
    }
}
