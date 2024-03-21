import { DateTime } from 'luxon';
import { timeZone } from '../../../const.js';


export const DATE_STRING_TO_ISO_TESTS = [
    [
        '29 дек 2023, 08:55',
        DateTime.fromObject({ year: 2023, month: 12, day: 29, hour: 8, minute: 55}, {zone: timeZone }).toISO()
    ],
    [
        '27 окт, 15:06',
        DateTime.fromObject({ year: new Date().getFullYear(), month: 10, day: 27, hour: 15, minute: 6}, { zone: timeZone }).toISO()
    ],
    [
        '15:06',
        DateTime.now().setZone(timeZone).set({ hour: 15, minute: 6, second: 0, millisecond: 0 }).toISO()
    ],
    [
        '20 мар, 22:12',
        DateTime.fromObject({ year: new Date().getFullYear(), month: 3, day: 20, hour: 22, minute: 12}, { zone: timeZone }).toISO()
    ]
];
