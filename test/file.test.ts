import {DATE_FORMAT} from "../src/date";
import * as Moment from "moment";
import {getWeekFileName} from "../src/file";

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