import { convertRBCDatetimeToISO } from '../dateConverter';
import { DATE_STRING_TO_ISO_TESTS } from '../test_utils/const';


describe('test convertRBCDatetimeToISO', () => {
    it.each(DATE_STRING_TO_ISO_TESTS)('should convert RBC datetime string "%s" to ISO format', (input, expectedISOString) => {
        const result = convertRBCDatetimeToISO(input);
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
