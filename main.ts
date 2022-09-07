import {App, Editor, MarkdownView, Menu, Modal, Notice, Plugin, PluginSettingTab, Setting} from 'obsidian';
import WeekPlannerFile, {dateString, getInboxFileName, getTodayFileName, getWeekday} from "./src/file";
import {TODO_PREFIX} from "./src/constants";

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

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Week Planner', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		const menu = new Menu(this.app);

		menu.addItem((item) =>
			item
				.setTitle("Copy")
				.setIcon("documents")
				.onClick(() => {
					new Notice("Copied");
				})
		);

		this.addCommand({
			id: 'week-planner-inbox',
			name: 'Show Inbox',
			callback: () => this.createNewNote('Inbox', 'Inbox'),
			hotkeys: []
		});

		this.addCommand({
			id: 'week-planner-week',
			name: 'Show Week',
			callback: () => this.createNewNote('Calweek-2022-36', 'Goals of Calendar Week 36', 'Weeks'),
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
			id: 'move-to-today',
			name: 'Move task to today',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.moveToToday(editor)
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

	async createToday() {
		let date = new Date()
		let today = dateString(date) + "-" + getWeekday(date)
		await this.createNewNote(today, 'Today', 'Days')
	}

	async createTomorrow() {
		let date = new Date()
		date.setDate(date.getDate() + 1);
		while (!isWorkDay(date)) {
			date.setDate(date.getDate() + 1);
		}

		let tomorrow = dateString(date) + "-" + getWeekday(date)
		await this.createNewNote(tomorrow, 'Today', 'Days')
	}

	async createYesterday() {
		let date = new Date()
		date.setDate(date.getDate() - 1);

		while (!isWorkDay(date)) {
			date.setDate(date.getDate() - 1);
		}

		let yesterday = dateString(date) + "-" + getWeekday(date)
		await this.createNewNote(yesterday, 'Today', 'Days')
	}

	async moveToToday(editor: Editor) {
		let inbox = new WeekPlannerFile(this.app.vault, getInboxFileName());
		let today = new WeekPlannerFile(this.app.vault, getTodayFileName(new Date()));

		const line = editor.getCursor().line
		let todo = await inbox.getLineAt(line)
		if (todo.startsWith(TODO_PREFIX)) {
			await today.insertAt(todo, 1)
			await inbox.deleteLineAt(line)
		}
	}

	async createNewNote(input: string, header: string, subdir?: string): Promise<void> {
		if (typeof subdir !== 'undefined') {
			const subDirectoryExists = await this.app.vault.adapter.exists('Week Planner/' + subdir);
			if (!subDirectoryExists) {
				await this.app.vault.createFolder('Week Planner/' + subdir)
			}
		}

		const directoryPath = 'Week Planner'
		const directoryExists = await this.app.vault.adapter.exists(directoryPath);
		if (!directoryExists) {
			await this.app.vault.createFolder(directoryPath)
		}

		let fullFileName = "";
		if (typeof subdir !== 'undefined') {
			fullFileName = 'Week Planner/' + subdir + '/' + input
		} else {
			fullFileName = 'Week Planner/' + input
		}

		const fileExists = await this.app.vault.adapter.exists(fullFileName + '.md');
		if (!fileExists) {
			await this.app.vault.create(fullFileName + '.md', '## ' + header)
		}
		await this.app.workspace.openLinkText(fullFileName, '', false)
	}

	async getFileContents(fileName: string){
		try {
			return await this.app.vault.adapter.read(fileName);
		} catch (error) {
			console.log(error)
		}
	}

	async updateFile(fileName: string, fileContents: string){
		try {
			return await this.app.vault.adapter.write(fileName, fileContents);
		} catch (error) {
			console.log(error)
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

function isWorkDay(date: Date) {
	return date.getDay() > 0 && date.getDay() < 6
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
