import {Vault, Workspace} from 'obsidian';
import {WEEK_PLANNER_BASE_DIR, WEEK_PLANNER_DAYS_DIR, WEEK_WEEK_DIR} from "./constants";
import * as path from 'path';

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

	async createIfNotExistsAndOpen(vault: Vault, workspace: Workspace, header: String) {
		const fileExists = await vault.adapter.exists(this.fullFileName);
		if (!fileExists) {
			await this.ensureDirectories(vault)
			await vault.create(this.fullFileName, '## ' + header)
		}

		await workspace.openLinkText(this.obsidianFile(this.fullFileName), '', false)
	}

	obsidianFile(filename: string) {
		return filename.replace('.md', '');
	}

	async ensureDirectories(vault: Vault, ) {
		const directories = this.fullFileName.split(path.sep)
		let directoryPath = ""
		for(let i=0; i < directories.length-1; i++) {
			directoryPath = directoryPath + directories[i] + path.sep
			console.log('dir path:' + directoryPath)
			const directoryExists = await vault.adapter.exists(directoryPath);
			if (!directoryExists) {
				await vault.createFolder(directoryPath)
			}
		}
	}
}

export function extendFileName(filename?: string) {
	if (filename == 'Inbox.md') {
		return WEEK_PLANNER_BASE_DIR + '/' + 'Inbox.md'
	} else {
		return WEEK_PLANNER_BASE_DIR + '/' + WEEK_PLANNER_DAYS_DIR + '/' + filename
	}
}

export function getInboxFileName() {
	return WEEK_PLANNER_BASE_DIR + '/' + 'Inbox.md'
}

export function getDayFileName(date: Date) {
	return WEEK_PLANNER_BASE_DIR + '/' + WEEK_PLANNER_DAYS_DIR + '/' + dateString(date) + "-" + getWeekday(date) + '.md'
}

export function getDayFileHeader(date: Date) {
	return dateString(date) + "-" + getWeekday(date)
}

export function getWeekFileName(date: Date) {
	const year = date.getFullYear()
	return WEEK_PLANNER_BASE_DIR + '/' + WEEK_WEEK_DIR + '/Calweek-' + year + '-' + weekNumber(date) + '.md'
}

export function weekNumber(date: Date) {
	const startDate = new Date(date.getFullYear(), 0, 1);
	const days = Math.floor((date.valueOf() - startDate.valueOf()) / (24 * 60 * 60 * 1000));
	return Math.ceil(days / 7);
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

