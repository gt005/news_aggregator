import { getFormattedDate } from '../time-utils';

describe('getFormattedDate', () => {
    test('valid case', () => {
        const testDate = new Date('2024-01-05T16:24:00')

        const formattedDate = getFormattedDate(testDate)

        expect(formattedDate).toBe('5 янв 2024');
    });
})
