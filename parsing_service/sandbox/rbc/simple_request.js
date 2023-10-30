import cheerio from 'cheerio';
import axios from 'axios';

const news_by_page = 40;
const required_news_amount = 2000;

const urls = Array.from(
    { length: Math.ceil(required_news_amount / news_by_page) },
    (_, i) => `https://quote.rbc.ru/v5/ajax/get-news-on-main/?limit=${news_by_page}&offset=${i * news_by_page}`
)

const requests = urls.map(url => axios.get(url));

const responses = await Promise.all(requests);

const articles = [];

responses.map(response => {
    const $ = cheerio.load(response.data.html);


    $('.q-item').each((idx, elem) => {
        const title = $(elem).find('.q-item__title').text().trim();
        const description = $(elem).find('.q-item__description').text().trim();
        const data_text = $(elem).find('.q-item__date__text').text().trim();
        const link = $(elem).find('.q-item__link').attr('href').trim();

        

        articles.push({
            title,
            description,
            data_text,
            link
        })
    })

});

const lastFourArticles = articles.slice(-4);
console.log(lastFourArticles);
