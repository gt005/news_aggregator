import { convertRBCDatetimeToISO } from '../dateConverter';
import { DateTime } from 'luxon';

describe('test convertRBCDatetimeToISO', () => {
    it('should convert RBC datetime string with date to ISO format', () => {
        const rbcDatetimeString = '27 окт, 15:06';
        const expectedISOString = DateTime.local(new Date().getFullYear(), 10, 27, 15, 6).toUTC().toISO();
        
        let result = convertRBCDatetimeToISO(rbcDatetimeString);
        result = DateTime.fromISO(result).toUTC().toISO();
        expect(result).toEqual(expectedISOString);
    });

    it('should convert RBC datetime string without date to ISO format', () => {
        const rbcDatetimeString = '15:06';
    
        const now = DateTime.local();
        const expectedISOString = DateTime.local(now.year, now.month, now.day, 15, 6).toUTC().toISO();
    
        let result = convertRBCDatetimeToISO(rbcDatetimeString);
        result = DateTime.fromISO(result).toUTC().toISO();
        expect(result).toEqual(expectedISOString);
    });

    it('should return null for invalid datetime string', () => {
        const invalidDatetimeString = 'invalid datetime string';
        expect(convertRBCDatetimeToISO(invalidDatetimeString)).toBeNull();
    });

    it('should return null for empty datetime string', () => {
        const emptyDatetimeString = '';
        expect(convertRBCDatetimeToISO(emptyDatetimeString)).toBeNull();
    });

    it('should return null for empty datetime string', () => {
        const emptyDatetimeString = '32 окт, 15:06';
        expect(convertRBCDatetimeToISO(emptyDatetimeString)).toBeNull();
    });
});
