import cheerio from "cheerio";
import axios from "axios";
import { convertRBCDatetimeToISO } from "./services/dateConverter.js";

export class RBCParser {
    constructor() {
        this.articles = [];
        this.allArticlesHaveBeenParsed = false;
    }

    async makeParseUntilPublicationDateTime(lastUpdatedDateTime) {
        /*
        Парсит новости с сайта РБК.

        Args:
            lastUpdatedDateTime (str): дата и время последнего обновления новостей в ISO формате

        Returns:
            Массив объектов новостей до установленного времени
        */
        const news_by_request = 10;
        const max_news_amount = 500; // максимальное количество новостей, доступных для параметра offset, а значит и для парсинга

        for (let i = 0; i < max_news_amount; i += news_by_request) {
            const response = await axios.get(
                `https://quote.rbc.ru/v5/ajax/get-news-on-main/?limit=${news_by_request}&offset=${i}`,
            );

            this._extractNewsFromHtml(response.data.html, lastUpdatedDateTime);

            if (this.allArticlesHaveBeenParsed) {
                break;
            }
        }

        return this.articles;
    }

    _extractNewsFromHtml(html, lastUpdatedDateTime) {
        /*
        Парсит html страницы с новостями.

        Args:
            html (str): html страницы с новостями
            lastUpdatedDateTime (str): дата и время последнего обновления новостей в ISO формате
        */
        const parseFunction = cheerio.load(html);

        parseFunction(".q-item").each((idx, elem) => {
            const dateTime = this._getDateTimeFromHtmlBlock(
                elem,
                parseFunction,
            );

            if (new Date(dateTime) <= new Date(lastUpdatedDateTime)) {
                this.allArticlesHaveBeenParsed = true;
                return;
            }

            const title = this._getTitleFromHtmlBlock(elem, parseFunction);
            const description = this._getDescriptionFromHtmlBlock(
                elem,
                parseFunction,
            );
            const link = this._getLinkFromHtmlBlock(elem, parseFunction);

            console.log(`Parsing article: ${link}`);
            this.articles.push({
                title: title,
                url: link,
                source: "rbc",
                description: description,
                published_at: dateTime,
            });
        });
    }

    _getDateTimeFromHtmlBlock(cheerioBlock, parseFunction) {
        /*
        Возвращает дату и время новости, полученные из html блока.

        Args:
            cheerioBlock (Cheerio): блок с новостью
            parseFunction (function): функция парсинга

        Returns:
            str: дата и время новости в ISO формате или null, если дата и время не найдены
    */
        const dateText = parseFunction(cheerioBlock).find(
            ".q-item__date__text",
        );
        if (dateText.length === 0) {
            console.log("Error: date text not found in block.");
            return null;
        }

        let dateString = dateText.text().trim();

        // Словарь замен для аббревиатур месяцев
        const replacements = {
            мар: "март",
            апр: "апр.",
            фев: "февр.",
        };

        Object.entries(replacements).forEach(([key, value]) => {
            dateString = dateString.replace(key, value);
        });

        return convertRBCDatetimeToISO(dateString);
    }

    _getTitleFromHtmlBlock(cheerioBlock, parseFunction) {
        /*
        Возвращает заголовок новости, полученный из html блока.

        Args:
            cheerioBlock (Cheerio): блок с новостью
            parseFunction (function): функция парсинга

        Returns:
            str: заголовок новости или null, если заголовок не найден
        */
        const title = parseFunction(cheerioBlock).find(".q-item__title");
        if (title.length === 0) {
            // TODO: сделать логирование
            console.log("Error: title not found in block.");
            return null;
        }

        return title.text().trim();
    }

    _getDescriptionFromHtmlBlock(cheerioBlock, parseFunction) {
        /*
        Возвращает описание новости, полученное из html блока.

        Args:
            cheerioBlock (Cheerio): блок с новостью
            parseFunction (function): функция парсинга

        Returns:
            str: описание новости или null, если описание не найдено
        */
        // TODO: сделать логирование, если не найден блок с описанием
        const description = parseFunction(cheerioBlock).find(
            ".q-item__description",
        );
        if (description.length === 0) {
            // TODO: сделать логирование
            console.log("Error: description not found in block.");
            return null;
        }

        return description.text().trim();
    }

    _getLinkFromHtmlBlock(cheerioBlock, parseFunction) {
        /*
        Возвращает ссылку на новость, полученную из html блока.

        Args:
            cheerioBlock (Cheerio): блок с новостью
            parseFunction (function): функция парсинга

        Returns:
            str: ссылка на новость или null, если ссылка не найдена
        */
        const link = parseFunction(cheerioBlock).find(".q-item__link");
        if (link.length === 0) {
            // TODO: сделать логирование
            console.log("Error: link not found in block.");
            return null;
        }

        return link.attr("href").trim();
    }
}
