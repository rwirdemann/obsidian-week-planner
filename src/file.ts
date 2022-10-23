import {EditorPosition, Vault, Editor, Workspace, normalizePath, moment} from 'obsidian';
import { WEEK_PLANNER_BASE_DIR, WEEK_PLANNER_DAYS_DIR, WEEK_WEEK_DIR } from "./constants";
import * as path from 'path';
import {allDaysValid, getWeekday, isWorkingDay, getCalendarWeek, dateString, dateString} from "./date";

export default class WeekPlannerFile {
	vault: Vault
	fullFileName: string

	constructor(vault: Vault, fullFileName: string) {
		this.vault = vault;
		this.fullFileName = fullFileName
	}
	async deleteLine(line: number, s: string, editor: Editor) {
		const from: EditorPosition = { line: line, ch: 0 };
		
		// replace trailing newline only if the line to delete isn't the last one
		let delta = 0
		if (line < editor.lastLine()) {
			delta = path.sep.length
		}

		const to: EditorPosition = { line: line, ch: s.length + delta};
		editor.replaceRange('', from, to)
	}

	async insertAt(line: string, at: number) {
		const filecontents = await this.getFileContents()
		if (filecontents == undefined) {
			console.log('could not read file');
			return
		}

		const todos = filecontents.split('\n')
		todos.splice(at, 0, line)
		await this.updateFile(todos.join('\n'));
	}

	async getTodos() {
		const filecontent = await this.getFileContents()
		if (filecontent == undefined) {
			console.log('could not read file');
			return []
		}

		return filecontent.split('\n')
	}

	async getFileContents() {
		return await this.vault.adapter.read(this.fullFileName);
	}

	async updateFile(fileContents: string) {
		try {
			return await this.vault.adapter.write(this.fullFileName, fileContents);
		} catch (error) {
			console.log(error)
		}
	}

	async createIfNotExists(vault: Vault, workspace: Workspace, header: string) {
		const fileExists = await vault.adapter.exists(this.fullFileName);
		if (!fileExists) {
			await this.ensureDirectories()
			await vault.create(this.fullFileName, '## ' + header)
		}
	}

	async createIfNotExistsAndOpen(vault: Vault, workspace: Workspace, header: string) {
		await this.createIfNotExists(vault, workspace, header)
		await workspace.openLinkText(this.obsidianFile(this.fullFileName), '', true)
	}

	obsidianFile(filename: string) {
		return filename.replace('.md', '');
	}

	isInbox() {
		return this.fullFileName == getInboxFileName();
	}

	isToday() {
		const d = new Date()
		return this.fullFileName.endsWith(dateString(moment(d)) + '-' + getWeekday(d) + '.md')
	}

	isYesterday() {
		const d = getYesterdayDate()
		return this.fullFileName.endsWith(dateString(moment(d)) + '-' + getWeekday(d) + '.md')
	}

	async ensureDirectories() {
		const directories = this.fullFileName.split('/')
		let directoryPath = ""
		for (let i = 0; i < directories.length - 1; i++) {
			directoryPath = directoryPath + directories[i] + '/'
			console.log('dir path:' + directoryPath)

			try {
				const normalizedPath = normalizePath(directoryPath);
				const folderExists = await this.vault.adapter.exists(normalizedPath, false)
				if (!folderExists) {
					await this.vault.createFolder(normalizedPath);
				}
			} catch (error) {
				console.log(error)
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
	return WEEK_PLANNER_BASE_DIR + '/' + WEEK_PLANNER_DAYS_DIR + '/' + dateString(moment(date)) + "-" + getWeekday(date) + '.md'
}

export function getDayFileHeader(date: Date) {
	return dateString(moment(date)) + "-" + getWeekday(date)
}

export function getWeekFileName(date: Date) {
	const year = date.getFullYear()
	return WEEK_PLANNER_BASE_DIR + '/' + WEEK_WEEK_DIR + '/' + 'Calweek-' + year + '-' + getCalendarWeek(date) + '.md'
}

export function getNextWorkingDay() {
	const date = new Date()
	while (!isWorkingDay(date)) {
		date.setDate(date.getDate() + 1);
	}
	return date
}

export function getTomorrowDate(workingDays: string) {
	let tomorrow  = moment().add(1,'days');
	while (!isWorkingDay(tomorrow.toDate(), workingDays)) {
		tomorrow  = moment(tomorrow).add(1,'days');
	}
	return tomorrow.toDate()
}

export function getYesterdayDate() {
	const date = new Date()
	date.setDate(date.getDate() - 1);
	while (!isWorkingDay(date)) {
		date.setDate(date.getDate() - 1);
	}
	return date
}

export function isValidWorkingDaysString(value: string) {
	if (value == undefined || value.trim() == '') {
		console.log("working day string undefined or empty")
		return false
	}

	return allDaysValid(value.split(','));
}

