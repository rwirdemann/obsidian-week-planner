import {App, DropdownComponent, Modal, Setting} from "obsidian";

export class TodoModal extends Modal {
	result: string;
	targetList: string

	onSubmit: (result: string, targetList: string) => void;

	constructor(app: App, onSubmit: (result: string, targetList: string) => void) {
		super(app);
		this.onSubmit = onSubmit;
		this.targetList = 'inbox'
	}

	onOpen() {
		const {contentEl} = this;

		new Setting(contentEl)
			.setName("Decription")
			.addText((text) =>
				text.onChange((value) => {
					this.result = value
				})
			);

		new Setting(contentEl)
			.setName("Target list")
			.addDropdown(dropDown => {
				dropDown.addOption('inbox', 'Inbox');
				dropDown.addOption('today', 'Today');
				dropDown.onChange(async (value) => {
					this.targetList = value
				});
			});

		new Setting(contentEl)
			.addButton((btn) =>
				btn
					.setButtonText("Submit")
					.setCta()
					.onClick(() => {
						this.close();
						this.onSubmit(this.result, this.targetList);
					}));
	}

	onClose() {
		let {contentEl} = this;
		contentEl.empty();
	}
}