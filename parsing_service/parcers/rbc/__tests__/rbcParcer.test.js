import cheerio from 'cheerio';
import axios from 'axios';
import { DateTime } from 'luxon';
import { RBCParcer } from '../parcer';
import testData from './testData/rbcParcerTestData.json';
import expectedResult from './testData/rbcParcerTestDataRightResult.json';


jest.mock('axios');

const LAST_UPDATED_DATE = DateTime.local(2023, 10, 31, 15, 35).toISO();

describe('RBCParcer', () => {
    let parser;

    beforeEach(() => {
        parser = new RBCParcer();
    });

    describe('Main parsing method', () => {
        beforeEach(() => {
            axios.get.mockResolvedValueOnce({ data: testData[0] })
                .mockResolvedValueOnce({ data: testData[1] });
        });

        it('should parse news correctly for the set of data', async () => {
            const result = await parser.makeParceToDateTime(LAST_UPDATED_DATE);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('_getDateTimeFromHtmlBlock', () => {
        it('should extract datetime correctly', () => {
            const mockHtml = `<div class="q-item"><span class="q-item__date__text">27 окт, 15:06</span></div>`;
            const $ = cheerio.load(mockHtml);
            const result = parser._getDateTimeFromHtmlBlock($('.q-item'), $);
            expect(result).toEqual('2023-10-27T15:06:00.000+03:00');
        });

        const wrongDateCases = [
            '32 окт, 15:06',
            '1',
            ''
        ]
        wrongDateCases.forEach((wrongDate) => {
            it(`should return null if datetime is ${wrongDate}`, () => {
                const mockHtml = `<div class="q-item"><span class="q-item__date__text">${wrongDate}</span></div>`;
                const $ = cheerio.load(mockHtml);
                const result = parser._getDateTimeFromHtmlBlock($('.q-item'), $);
                expect(result).toBeNull();
            });
        });

        it('uld return null if datetime tag not exists', () => {
            const mockHtml = '<div class="q-item"></div>';
            const $ = cheerio.load(mockHtml);
            const result = parser._getDateTimeFromHtmlBlock($('.q-item'), $);
            expect(result).toBeNull();
        });
    });

    describe('_getTitleFromHtmlBlock', () => {
        it('should extract title correctly', () => {
            const mockHtml = `<div class="q-item"><span class="q-item__title">Test Title</span></div>`;
            const $ = cheerio.load(mockHtml);
            const result = parser._getTitleFromHtmlBlock($('.q-item'), $);
            expect(result).toEqual('Test Title');
        });

        it('should return null if title is missing', () => {
            const mockHtml = `<div class="q-item"></div>`;
            const $ = cheerio.load(mockHtml);
            const result = parser._getTitleFromHtmlBlock($('.q-item'), $);
            expect(result).toBeNull();
        });
    });

    describe('_getDescriptionFromHtmlBlock', () => {
        it('should extract description correctly', () => {
            const mockHtml = `<div class="q-item"><span class="q-item__description">Test Description</span></div>`;
            const $ = cheerio.load(mockHtml);
            const result = parser._getDescriptionFromHtmlBlock($('.q-item'), $);
            expect(result).toEqual('Test Description');
        });

        it('should return null if description is missing', () => {
            const mockHtml = `<div class="q-item"></div>`;
            const $ = cheerio.load(mockHtml);
            const result = parser._getDescriptionFromHtmlBlock($('.q-item'), $);
            expect(result).toBeNull();
        });
    });

    describe('_getLinkFromHtmlBlock', () => {
        it('should extract link correctly', () => {
            const mockHtml = `<div class="q-item"><a class="q-item__link" href="https://example.com/test"></a></div>`;
            const $ = cheerio.load(mockHtml);
            const result = parser._getLinkFromHtmlBlock($('.q-item'), $);
            expect(result).toEqual('https://example.com/test');
        });

        it('should return null if link is missing', () => {
            const mockHtml = `<div class="q-item"></div>`;
            const $ = cheerio.load(mockHtml);
            const result = parser._getLinkFromHtmlBlock($('.q-item'), $);
            expect(result).toBeNull();
        });
    });

    describe('_parseHtml', () => {
        it('should parse the provided HTML correctly', () => {
            const mockHtml = `
                <div class="q-item">
                    <span class="q-item__date__text">27 дек, 15:06</span>
                    <span class="q-item__title">Test Title</span>
                    <span class="q-item__description">Test Description</span>
                    <a class="q-item__link" href="https://example.com/test"></a>
                </div>
            `;
    
            parser._parseHtml(mockHtml, LAST_UPDATED_DATE);
    
            const expectedArticle = {
                dateTime: '2023-12-27T15:06:00.000+03:00',
                title: 'Test Title',
                description: 'Test Description',
                link: 'https://example.com/test'
            };
            expect(parser.articles).toEqual([expectedArticle]);
        });
    
        it('should stop parsing if an article is older than the last update date', () => {
            const mockHtml = `
                <div class="q-item">
                    <span class="q-item__date__text">30 окт, 15:06</span>
                    <span class="q-item__title">Old Article</span>
                    <span class="q-item__description">Old Description</span>
                    <a class="q-item__link" href="https://example.com/old"></a>
                </div>
            `;
    
            parser._parseHtml(mockHtml, LAST_UPDATED_DATE);
            expect(parser.allArticlesHaveBeenParced).toBe(true);
            expect(parser.articles).toEqual([]);
        });
    });
});
