import {moment} from 'obsidian';

export const DATE_FORMAT = "YYYY-MM-DD"

const DAYS_TO_NUMBER = new Map<string, number>([
	['sun', 0],
	['mon', 1],
	['tue', 2],
	['wed', 3],
	['thu', 4],
	['fri', 5],
	['sat', 6],
]);

export function isWorkingDay(date: Date, workingDays?: string) {
	if (workingDays === undefined) {
		return date.getDay() > 0 && date.getDay() < 6
	}

	const allowedDays = mapToNumbersArray(workingDays)
	return allowedDays.contains(date.getDay())
}

export function getWeekday(date: Date) {
	const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	return weekday[date.getDay()];
}

export function getCalendarWeek(m: moment.Moment) {
	return m.isoWeek()
}

export function allDaysValid(days: string[]) {
	return days.every(function (d) { return DAYS_TO_NUMBER.get(d.toLowerCase().trim()) != undefined; });
}

export function dateString(m: moment.Moment) {
	return m.format('YYYY-MM-DD');
}

function mapToNumbersArray(workingDays: string) {
	const days: number[] = [];
	workingDays.split(',').forEach((d) => {
		const day = DAYS_TO_NUMBER.get(d.toLowerCase().trim())
		if (day != undefined) {
			days.push(day)
		}
	});
	return days
}
