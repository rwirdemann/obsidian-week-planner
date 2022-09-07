import {Vault} from 'obsidian';
import {WEEK_PLANNER_BASE_DIR, WEEK_PLANNER_DAYS_DIR} from "./constants";

export default class WeekPlannerFile {
	vault: Vault;
	fullFileName: string

	constructor(vault: Vault, fullFileName: string) {
		this.vault = vault;
		this.fullFileName = fullFileName
	}

	async getLineAt(at: number) {
		let todos = await this.getTodos()
		return todos[at]
	}

	async deleteLineAt(at: number) {
		let todos = await this.getTodos()
		todos.splice(at, 1)
		await this.updateFile(todos.join('\n'));
	}

	async insertAt(line: string, at: number) {
		let filecontent = await (await this.getFileContents())
		if (filecontent == undefined) {
			console.log('could not read file');
			return
		}

		let todos = filecontent.split('\n')
		todos.splice(at, 0, line)
		await this.updateFile(todos.join('\n'));
	}
	async getTodos() {
		let filecontent = await (await this.getFileContents())
		if (filecontent == undefined) {
			console.log('could not read file');
			return []
		}

		return filecontent.split('\n')
	}

	async getFileContents() {
		try {
			return await this.vault.adapter.read(this.fullFileName);
		} catch (error) {
			console.log(error)
		}
	}

	async updateFile(fileContents: string) {
		try {
			return await this.vault.adapter.write(this.fullFileName, fileContents);
		} catch (error) {
			console.log(error)
		}
	}
}

export function getInboxFileName() {
	return WEEK_PLANNER_BASE_DIR + '/' + 'Inbox.md'
}

export function getTodayFileName(date: Date) {
	return WEEK_PLANNER_BASE_DIR + '/' + WEEK_PLANNER_DAYS_DIR + '/' + dateString(date) + "-" + getWeekday(date) + '.md'
}

export function dateString(date: Date) {
	return [
		date.getFullYear(),
		padTo2Digits(date.getMonth() + 1),
		padTo2Digits(date.getDate()),
	].join('-')
}

function padTo2Digits(num: number) {
	return num.toString().padStart(2, '0');
}

export function getWeekday(date: Date) {
	const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	return weekday[date.getDay()];
}

