import { getFormattedTime } from "../time-utils";

describe('getFormattedTime', () => {
    test('valid case', () => {
        const dateTime = new Date('2024-01-05T06:24:00')

        const formattedTime = getFormattedTime(dateTime)

        expect(formattedTime).toBe('6:24')
    })
})