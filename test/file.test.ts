import {isWorkDay} from "../src/file";
import * as Moment from "moment";

jest.mock('obsidian', () => ({
	App: jest.fn().mockImplementation(),
	moment: () => Moment()
}));

test('isWorkDay', () => {
	const sun = Moment("2022-10-23", "YYYY-MM-DD").toDate()

	expect(isWorkDay(sun)).toBe(false);
});
