import {DATE_FORMAT} from "../src/date";
import * as Moment from "moment";
import WeekPlannerFile, {getDateFromFilename, getWeekFileName} from "../src/file";

jest.mock('obsidian', () => ({
	App: jest.fn().mockImplementation(),
	moment: () => Moment()
}));

test('getWeekFileName', () => {
	const sun = Moment("2022-10-23", DATE_FORMAT)
	expect(getWeekFileName(sun)).toBe('Week Planner/Weeks/Calweek-2022-42.md');

	const mon = Moment("2022-10-24", DATE_FORMAT)
	expect(getWeekFileName(mon)).toBe('Week Planner/Weeks/Calweek-2022-43.md');

});

test('getDateFromFilename', () => {
	const fn = 'Week Planner/Days/2023-01-20-Friday.md'
	const expectedDate = Moment("2023-01-20", DATE_FORMAT)
	expect(getDateFromFilename(fn)).toStrictEqual(expectedDate);
});
