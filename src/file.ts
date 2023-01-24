import {EditorPosition, Vault, Editor, Workspace, normalizePath, moment} from 'obsidian';
import {WEEK_PLANNER_DAYS_DIR, WEEK_WEEK_DIR} from "./constants";
import * as path from 'path';
import {allDaysValid, getWeekday, isWorkingDay, getCalendarWeek, dateString, DATE_FORMAT} from "./date";
import {WeekPlannerPluginSettings} from "./settings";

export default class WeekPlannerFile {
	vault: Vault
	fullFileName: string
	settings: WeekPlannerPluginSettings

	constructor(settings: WeekPlannerPluginSettings, vault: Vault, fullFileName: string) {
		this.settings = settings;
		this.vault = vault;
		this.fullFileName = fullFileName
	}

	async deleteLine(line: number, s: string, editor: Editor) {
		const from: EditorPosition = {line: line, ch: 0};

		// replace trailing newline only if the line to delete isn't the last one
		let delta = 0
		if (line < editor.lastLine()) {
			delta = path.sep.length
		}

		const to: EditorPosition = {line: line, ch: s.length + delta};
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
		await workspace.openLinkText(this.obsidianFile(this.fullFileName), '', false)
	}

	obsidianFile(filename: string) {
		return filename.replace('.md', '');
	}

	isInbox() {
		return this.fullFileName == getInboxFileName(this.settings);
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

export function extendFileName(settings: WeekPlannerPluginSettings, filename?: string) {
	if (filename == 'Inbox.md') {
		return settings.baseDir + '/' + 'Inbox.md'
	} else {
		return settings.baseDir + '/' + settings.daysDir + '/' + filename
	}
}

export function getInboxFileName(settings: WeekPlannerPluginSettings) {
	return settings.baseDir + '/' + 'Inbox.md'
}

export function getDayFileName(settings: WeekPlannerPluginSettings, date: Date) {
	return settings.baseDir + '/' + settings.daysDir + '/' + dateString(moment(date)) + "-" + getWeekday(date) + '.md'
}

export function getDateFromFilename(filename: String): moment.Moment {
	if (filename == undefined || filename == '') {
		return moment()
	}
	const parts = filename.split('/')
	if (parts.length == 0) {
		return moment()
	}
	const dateString = parts[parts.length - 1]
	const withoutWeekday = dateString.substring(0, dateString.lastIndexOf('-'))
	return moment(withoutWeekday, DATE_FORMAT).set({hour: 0, minute: 0, second: 0, millisecond: 0})
}

export function getWeekFileName(settings: WeekPlannerPluginSettings, m: moment.Moment) {
	const year = m.year()
	return settings.baseDir + '/' + WEEK_WEEK_DIR + '/' + 'Calweek-' + year + '-' + getCalendarWeek(m) + '.md'
}

export function getNextWorkingDay(workingDays: string) {
	let today = new Date()
	while (!isWorkingDay(today, workingDays)) {
		today.setDate(today.getDate() + 1);
	}
	return today
}

export function getTomorrowDate(workingDays: string, date?: moment.Moment) {
	let today = date !== undefined ? date : moment()
	let tomorrow = today.add(1, 'days');
	while (!isWorkingDay(tomorrow.toDate(), workingDays)) {
		tomorrow = moment(tomorrow).add(1, 'days');
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

