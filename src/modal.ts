import {App, DropdownComponent, Modal, Setting, moment, Notice} from "obsidian";

export class TodoModal extends Modal {
	result: string;
	targetList: string
	targetDate: string

	onSubmit: (result: string, targetList: string, targetDate: Date) => void;

	constructor(app: App, onSubmit: (result: string, targetList: string, targetDate: Date) => void) {
		super(app);
		this.onSubmit = onSubmit;
		this.targetList = 'inbox'
		this.targetDate = moment().format('YYYY-MM-DD');
	}

	onOpen() {
		const {contentEl} = this;

		new Setting(contentEl)
			.setName("Task Description")
			.addText((text) =>
				text.onChange((value) => {
					this.result = value
				})
			)
			.addDropdown(dropDown => {
				dropDown.addOption('inbox', 'Inbox');
				dropDown.addOption('target-date', 'Specific date');
				dropDown.onChange(async (value) => {
					this.targetList = value
				});
			});

		new Setting(contentEl)
			.setName("Target date (only required if list' is 'Specific date')")
			.addText(text => text
				.setValue(this.targetDate)
				.setPlaceholder('YYYY-MM-DD')
				.onChange((value) => {
					this.targetDate = value
				})
			);

		new Setting(contentEl)
			.addButton((btn) =>
				btn
					.setButtonText("Submit")
					.setCta()
					.onClick(() => {
						if (this.result.trim() != '' && (this.targetList == 'inbox' || isValidDate(this.targetDate))) {
							this.close();
							this.onSubmit(this.result, this.targetList, moment(this.targetDate).toDate());
						}
					}));

	}
}

function isValidDate(date: string): boolean {
	return moment(date, 'YYYY-MM-DD', true).isValid()
}
