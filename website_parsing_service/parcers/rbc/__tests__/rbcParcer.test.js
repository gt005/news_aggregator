import cheerio from 'cheerio';
import axios from 'axios';
import { DateTime } from 'luxon';
import { RBCParcer } from '../parcer.js';
import testData from './testData/rbcParcerTestData.json';
import expectedResult from './testData/rbcParcerTestDataRightResult.json';
import * as dateConverterServices from '../services/dateConverter.js';
import { convertRBCDatetimeToISO } from '../services/dateConverter.js';
import { timeZone } from '../../const.js';


jest.mock('axios');

const LAST_UPDATED_DATE = DateTime.fromObject({ year: 2023, month: 10, day: 31, hour: 12, minute: 35 }).toISO({ includeOffset: false })


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
            const result = await parser.makeParceUntilPublicationDateTime(LAST_UPDATED_DATE);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('_getDateTimeFromHtmlBlock', () => {
        it(`should extract datetime correctly`, () => {
            const testDate = '27 окт, 15:06';

            const spyConvertRBCDatetimeToISO = jest.spyOn(dateConverterServices, 'convertRBCDatetimeToISO');

            const mockHtml = `<div class="q-item"><span class="q-item__date__text">${testDate}</span></div>`;

            const $ = cheerio.load(mockHtml);
            const result = parser._getDateTimeFromHtmlBlock($('.q-item'), $);

            expect(result).toEqual(convertRBCDatetimeToISO(testDate));

            expect(spyConvertRBCDatetimeToISO).toHaveBeenCalledWith(testDate);

            spyConvertRBCDatetimeToISO.mockRestore();
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

    describe('_extractNewsFromHtml', () => {
        it('should parse the provided HTML correctly', () => {
            const testDateTime = '27 дек, 15:06';
            const mockHtml = `
                <div class="q-item">
                    <span class="q-item__date__text">${testDateTime}</span>
                    <span class="q-item__title">Test Title</span>
                    <span class="q-item__description">Test Description</span>
                    <a class="q-item__link" href="https://example.com/test"></a>
                </div>
            `;

            parser._extractNewsFromHtml(mockHtml, LAST_UPDATED_DATE);

            const expectedArticle = {
                published_at: convertRBCDatetimeToISO(testDateTime),
                title: 'Test Title',
                source: 'rbc',
                description: 'Test Description',
                url: 'https://example.com/test'
            };
            expect(parser.articles).toEqual([expectedArticle]);
        });

        it('should stop parsing if an article is older than the last update date', () => {
            const mockHtml = `
                <div class="q-item">
                    <span class="q-item__date__text">30 окт 2023, 15:06</span>
                    <span class="q-item__title">Old Article</span>
                    <span class="q-item__description">Old Description</span>
                    <a class="q-item__link" href="https://example.com/old"></a>
                </div>
            `;

            parser._extractNewsFromHtml(mockHtml, LAST_UPDATED_DATE);
            expect(parser.allArticlesHaveBeenParced).toBe(true);
            expect(parser.articles).toEqual([]);
        });
    });
});
