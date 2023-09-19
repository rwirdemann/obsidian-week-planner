import {App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting} from 'obsidian';
import WeekPlannerFile, {
	dateString,
	extendFileName,
	getInboxFileName,
	getDayFileHeader,
	getDayFileName,
	getWeekday,
	getWeekFileName,
	weekNumber,
	getTomorrowDate,
	getYesterdayDate,
	getCurrentWorkdayDate
} from "./src/file";
import {TODO_DONE_PREFIX, TODO_PREFIX} from "./src/constants";

interface WeekPlannerPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: WeekPlannerPluginSettings = {
	mySetting: 'default'
}

export default class WeekPlannerPlugin extends Plugin {
	settings: WeekPlannerPluginSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'week-planner-inbox',
			name: 'Show Inbox',
			callback: () => this.createInbox(),
			hotkeys: []
		});

		this.addCommand({
			id: 'week-planner-week',
			name: 'Show Week',
			callback: () => this.createWeek(),
			hotkeys: []
		});

		this.addCommand({
			id: 'week-planner-today',
			name: 'Show Today',
			callback: () => this.createToday(),
			hotkeys: []
		});

		this.addCommand({
			id: 'week-planner-yesterday',
			name: 'Show Yesterday',
			callback: () => this.createYesterday(),
			hotkeys: []
		});

		this.addCommand({
			id: 'week-planner-tomorrow',
			name: 'Show Tomorrow',
			callback: () => this.createTomorrow(),
			hotkeys: []
		});

		this.addCommand({
			id: 'move-task',
			name: 'Move Task',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.moveTask(editor)
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	async createInbox() {
		const date = new Date()
		let weekFile = new WeekPlannerFile(this.app.vault, getInboxFileName());
		await weekFile.createIfNotExistsAndOpen(this.app.vault, this.app.workspace, 'Inbox')
	}

	async createWeek() {
		const date = new Date()
		let weekFile = new WeekPlannerFile(this.app.vault, getWeekFileName(date));
		await weekFile.createIfNotExistsAndOpen(this.app.vault, this.app.workspace, 'Goals of Week ' + weekNumber(date))
	}

	async createToday() {
		let date = new Date()
		let file = new WeekPlannerFile(this.app.vault, getDayFileName(date));
		await file.createIfNotExistsAndOpen(this.app.vault, this.app.workspace, getDayFileHeader(date))
	}

	async createTomorrow() {
		let date = getTomorrowDate()
		let file = new WeekPlannerFile(this.app.vault, getDayFileName(date));
		await file.createIfNotExistsAndOpen(this.app.vault, this.app.workspace, getDayFileHeader(date))
	}

	async createYesterday() {
		let date = getYesterdayDate()
		let file = new WeekPlannerFile(this.app.vault, getDayFileName(date));
		await file.createIfNotExistsAndOpen(this.app.vault, this.app.workspace, getDayFileHeader(date))
	}

	async moveTask(editor: Editor) {
		let sourceFileName = extendFileName(this.app.workspace.getActiveFile()?.name)
		let source = new WeekPlannerFile(this.app.vault, sourceFileName);

		let destFileName = ""
		let header = ""
		if (source.isInbox() || source.isYesterday()) {
			const date = getCurrentWorkdayDate()
			destFileName = getDayFileName(date)
			header = getDayFileHeader(date)			
		} else if (source.isToday()) {
			const date = getTomorrowDate()
			destFileName = getDayFileName(getTomorrowDate())
			header = getDayFileHeader(date)			
		} else {
			return
		}

		let dest = new WeekPlannerFile(this.app.vault, destFileName);
		await dest.createIfNotExists(this.app.vault, this.app.workspace, header)

		const line = editor.getCursor().line
		let todo = await source.getLineAt(line)
		if (todo.startsWith(TODO_PREFIX) || todo.startsWith(TODO_DONE_PREFIX)) {
			console.log('line: ' + todo)
			await dest.insertAt(todo, 1)
			await source.deleteLineAt(line)
		}
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Hello Ling');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: WeekPlannerPlugin;

	constructor(app: App, plugin: WeekPlannerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
