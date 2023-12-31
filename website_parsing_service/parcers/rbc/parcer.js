import cheerio from 'cheerio';
import axios from 'axios';
import { convertRBCDatetimeToISO } from './services/dateConverter';


export class RBCParcer {
    constructor() {
        this.articles = [];
        this.allArticlesHaveBeenParced = false;
    }

    async makeParceUntilPublicationDateTime(lastUpdatedDateTime) {
        /*
        Парсит новости с сайта РБК.

        Args:
            lastUpdatedDateTime (str): дата и время последнего обновления новостей в ISO формате

        Returns:
            Массив объектов новостей до установленного времени
        */
        const news_by_request = 10;
        const max_news_amount = 500;  // максимальное количество новостей, доступных для параметра offset, а значит и для парсинга

        for (let i = 0; i < Math.ceil(max_news_amount / news_by_request); i += news_by_request) {
            const response = await axios.get(`https://quote.rbc.ru/v5/ajax/get-news-on-main/?limit=${news_by_request}&offset=${i}`);

            this._extractNewsFromHtml(response.data.html, lastUpdatedDateTime);

            if (this.allArticlesHaveBeenParced) {
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
        const parceFunction = cheerio.load(html);

        parceFunction('.q-item').each((idx, elem) => {
            const dateTime = this._getDateTimeFromHtmlBlock(elem, parceFunction);

            if (new Date(dateTime) <= new Date(lastUpdatedDateTime)) {
                this.allArticlesHaveBeenParced = true;
                return;
            }

            const title = this._getTitleFromHtmlBlock(elem, parceFunction);
            const description = this._getDescriptionFromHtmlBlock(elem, parceFunction);
            const link = this._getLinkFromHtmlBlock(elem, parceFunction);

            this.articles.push({
                title: title,
                description: description,
                dateTime: dateTime,
                link: link
            });
        });
    }

    _getDateTimeFromHtmlBlock(cheerioBlock, parceFunction) {
        /*
        Возвращает дату и время новости, полученные из html блока.

        Args:
            cheerioBlock (Cheerio): блок с новостью
            parceFunction (function): функция парсинга

        Returns:
            str: дата и время новости в ISO формате или null, если дата и время не найдены
        */
        const dateText = parceFunction(cheerioBlock).find('.q-item__date__text');
        if (dateText.length === 0) {
            // TODO: сделать логирование
            console.log('Error: date text not found in block.');
            return null;
        }

        return convertRBCDatetimeToISO(dateText.text().trim());
    }

    _getTitleFromHtmlBlock(cheerioBlock, parceFunction) {
        /*
        Возвращает заголовок новости, полученный из html блока.

        Args:
            cheerioBlock (Cheerio): блок с новостью
            parceFunction (function): функция парсинга

        Returns:
            str: заголовок новости или null, если заголовок не найден
        */
        const title = parceFunction(cheerioBlock).find('.q-item__title');
        if (title.length === 0) {
            // TODO: сделать логирование
            console.log('Error: title not found in block.');
            return null;
        }

        return title.text().trim();
    }

    _getDescriptionFromHtmlBlock(cheerioBlock, parceFunction) {
        /*
        Возвращает описание новости, полученное из html блока.

        Args:
            cheerioBlock (Cheerio): блок с новостью
            parceFunction (function): функция парсинга

        Returns:
            str: описание новости или null, если описание не найдено
        */
        // TODO: сделать логирование, если не найден блок с описанием
        const description = parceFunction(cheerioBlock).find('.q-item__description');
        if (description.length === 0) {
            // TODO: сделать логирование
            console.log('Error: description not found in block.');
            return null;
        }

        return description.text().trim();
    }

    _getLinkFromHtmlBlock(cheerioBlock, parceFunction) {
        /*
        Возвращает ссылку на новость, полученную из html блока.

        Args:
            cheerioBlock (Cheerio): блок с новостью
            parceFunction (function): функция парсинга

        Returns:
            str: ссылка на новость или null, если ссылка не найдена
        */
        const link = parceFunction(cheerioBlock).find('.q-item__link');
        if (link.length === 0) {
            // TODO: сделать логирование
            console.log('Error: link not found in block.');
            return null;
        }

        return link.attr('href').trim();
    }
}