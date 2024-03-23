import { DateTime } from "luxon";
import { timeZone } from "../../../const.js";

export const DATE_STRING_TO_ISO_TESTS = [
  [
    "29 дек 2023, 08:55",
    DateTime.fromObject({
      year: 2023,
      month: 12,
      day: 29,
      hour: 5,
      minute: 55,
    }).toISO({ includeOffset: false }),
  ],
  [
    "27 окт, 15:06",
    DateTime.fromObject({
      year: new Date().getFullYear(),
      month: 10,
      day: 27,
      hour: 12,
      minute: 6,
    }).toISO({ includeOffset: false }),
  ],
  [
    "15:06",
    DateTime.now()
      .setZone(timeZone)
      .set({ hour: 12, minute: 6, second: 0, millisecond: 0 })
      .toISO({ includeOffset: false }),
  ],
];
