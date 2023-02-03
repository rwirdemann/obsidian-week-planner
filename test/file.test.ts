import {DATE_FORMAT} from "../src/date";
import * as Moment from "moment";
import {getWeekFileName} from "../src/file";
import {WeekPlannerPluginSettings} from "../src/settings";
import {WEEK_PLANNER_BASE_DIR, WEEK_PLANNER_DAYS_DIR, WEEK_WEEK_DIR} from "../src/constants";

jest.mock('obsidian', () => ({
	App: jest.fn().mockImplementation(),
	moment: () => Moment()
}));

test('getWeekFileName', () => {
	let settings: { workingDays: string, daysDir: string; weeksDir: string, baseDir: string } = {
		workingDays: 'Mon,Tue,Wed,Thu,Fri',
		baseDir: WEEK_PLANNER_BASE_DIR,
		daysDir: WEEK_PLANNER_DAYS_DIR,
		weeksDir: WEEK_WEEK_DIR
	}

	const sun = Moment("2022-10-23", DATE_FORMAT)
	expect(getWeekFileName(settings, sun)).toBe('Week Planner/Weeks/Calweek-2022-42.md');

	const mon = Moment("2022-10-24", DATE_FORMAT)
	expect(getWeekFileName(settings, mon)).toBe('Week Planner/Weeks/Calweek-2022-43.md');
});
